import { createRouter, publicQuery, authedQuery, adminQuery } from "./middleware";
import { authRouter } from "./authRouter";
import { z } from "zod";
import { getDb } from "./queries/connection";
import { eq, desc, and, sql, like, inArray } from "drizzle-orm";
import { products, categories, orders, orderItems, coupons, reviews, cartItems, wishlistItems } from "@db/schema";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  auth: authRouter,

  // ─── Public Product Routes ───────────────────────────────────────

  product: createRouter({
    list: publicQuery
      .input(
        z.object({
          category: z.string().optional(),
          search: z.string().optional(),
          featured: z.boolean().optional(),
          newArrival: z.boolean().optional(),
          limit: z.number().min(1).max(50).default(20),
          offset: z.number().min(0).default(0),
        }).optional()
      )
      .query(async ({ input }) => {
        const db = getDb();
        const filters = [];

        if (input?.category) {
          const cat = await db.query.categories.findFirst({
            where: eq(categories.slug, input.category),
          });
          if (cat) filters.push(eq(products.categoryId, cat.id));
        }

        if (input?.search) {
          filters.push(like(products.name, `%${input.search}%`));
        }

        if (input?.featured) filters.push(eq(products.isFeatured, true));
        if (input?.newArrival) filters.push(eq(products.isNewArrival, true));

        filters.push(eq(products.status, "published"));

        const where = filters.length > 0 ? and(...filters) : undefined;

        const items = await db
          .select()
          .from(products)
          .where(where)
          .orderBy(desc(products.createdAt))
          .limit(input?.limit ?? 20)
          .offset(input?.offset ?? 0);

        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(products)
          .where(where);

        return {
          items,
          total: countResult[0]?.count ?? 0,
        };
      }),

    bySlug: publicQuery
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const db = getDb();
        const product = await db.query.products.findFirst({
          where: eq(products.slug, input.slug),
        });

        if (!product) return null;

        const productReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.productId, product.id))
          .orderBy(desc(reviews.createdAt))
          .limit(10);

        const relatedProducts = await db
          .select()
          .from(products)
          .where(
            and(
              eq(products.categoryId, product.categoryId ?? 0),
              sql`${products.id} != ${product.id}`,
              eq(products.status, "published")
            )
          )
          .limit(4);

        return { ...product, reviews: productReviews, relatedProducts };
      }),

    byId: publicQuery
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return getDb().query.products.findFirst({
          where: eq(products.id, input.id),
        });
      }),
  }),

  // ─── Category Routes ──────────────────────────────────────────────

  category: createRouter({
    list: publicQuery.query(async () => {
      return getDb().select().from(categories).orderBy(categories.name);
    }),
  }),

  // ─── Cart Routes ──────────────────────────────────────────────────

  cart: createRouter({
    get: publicQuery
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        const db = getDb();
        const items = await db
          .select()
          .from(cartItems)
          .where(eq(cartItems.sessionId, input.sessionId));

        const enriched = await Promise.all(
          items.map(async (item) => {
            const product = await db.query.products.findFirst({
              where: eq(products.id, item.productId),
            });
            return { ...item, product };
          })
        );

        return enriched;
      }),

    add: publicQuery
      .input(
        z.object({
          sessionId: z.string(),
          productId: z.number(),
          variantId: z.number().optional(),
          quantity: z.number().min(1).default(1),
          userId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.insert(cartItems).values({
          sessionId: input.sessionId,
          productId: input.productId,
          variantId: input.variantId,
          quantity: input.quantity,
          userId: input.userId,
        });
        return { success: true };
      }),

    update: publicQuery
      .input(z.object({ id: z.number(), quantity: z.number().min(0) }))
      .mutation(async ({ input }) => {
        if (input.quantity === 0) {
          await getDb().delete(cartItems).where(eq(cartItems.id, input.id));
        } else {
          await getDb()
            .update(cartItems)
            .set({ quantity: input.quantity })
            .where(eq(cartItems.id, input.id));
        }
        return { success: true };
      }),

    remove: publicQuery
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await getDb().delete(cartItems).where(eq(cartItems.id, input.id));
        return { success: true };
      }),

    clear: publicQuery
      .input(z.object({ sessionId: z.string() }))
      .mutation(async ({ input }) => {
        await getDb()
          .delete(cartItems)
          .where(eq(cartItems.sessionId, input.sessionId));
        return { success: true };
      }),
  }),

  // ─── Order Routes ─────────────────────────────────────────────────

  order: createRouter({
    create: publicQuery
      .input(
        z.object({
          orderNumber: z.string(),
          userId: z.number().optional(),
          userEmail: z.string().optional(),
          userName: z.string().optional(),
          subtotal: z.string(),
          shippingCost: z.string().optional(),
          discount: z.string().optional(),
          tax: z.string().optional(),
          total: z.string(),
          couponCode: z.string().optional(),
          shippingAddress: z.record(z.string()).optional(),
          paymentMethod: z.string().optional(),
          items: z.array(
            z.object({
              productId: z.number(),
              variantId: z.number().optional(),
              productName: z.string(),
              productImage: z.string().optional(),
              size: z.string().optional(),
              color: z.string().optional(),
              price: z.string(),
              quantity: z.number(),
              total: z.string(),
            })
          ),
        })
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        const [orderResult] = await db
          .insert(orders)
          .values({
            orderNumber: input.orderNumber,
            userId: input.userId,
            userEmail: input.userEmail,
            userName: input.userName,
            subtotal: input.subtotal,
            shippingCost: input.shippingCost ?? "0",
            discount: input.discount ?? "0",
            tax: input.tax ?? "0",
            total: input.total,
            couponCode: input.couponCode,
            shippingAddress: input.shippingAddress,
            paymentMethod: input.paymentMethod,
            status: "pending",
            paymentStatus: "pending",
          })
          .$returningId();

        const orderId = orderResult.id;

        for (const item of input.items) {
          await db.insert(orderItems).values({
            orderId,
            ...item,
          });

          await db
            .update(products)
            .set({
              inventory: sql`${products.inventory} - ${item.quantity}`,
              soldCount: sql`${products.soldCount} + ${item.quantity}`,
            })
            .where(eq(products.id, item.productId));
        }

        return { orderId, orderNumber: input.orderNumber };
      }),

    get: publicQuery
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        const db = getDb();
        const order = await db.query.orders.findFirst({
          where: eq(orders.orderNumber, input.orderNumber),
        });

        if (!order) return null;

        const items = await db
          .select()
          .from(orderItems)
          .where(eq(orderItems.orderId, order.id));

        return { ...order, items };
      }),
  }),

  // ─── Coupon Routes ────────────────────────────────────────────────

  coupon: createRouter({
    validate: publicQuery
      .input(z.object({ code: z.string(), orderTotal: z.string().optional() }))
      .query(async ({ input }) => {
        const db = getDb();
        const coupon = await db.query.coupons.findFirst({
          where: eq(coupons.code, input.code),
        });

        if (!coupon) return { valid: false, message: "Invalid coupon code" };
        if (!coupon.isActive) return { valid: false, message: "Coupon is inactive" };
        if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date())
          return { valid: false, message: "Coupon has expired" };
        if (coupon.usageLimit && (coupon.usageCount ?? 0) >= coupon.usageLimit)
          return { valid: false, message: "Coupon usage limit reached" };

        const minOrder = parseFloat(coupon.minOrder?.toString() ?? "0");
        const orderTotal = parseFloat(input.orderTotal ?? "0");
        if (orderTotal < minOrder)
          return { valid: false, message: `Minimum order amount is ${minOrder}` };

        return {
          valid: true,
          coupon: {
            code: coupon.code,
            type: coupon.type,
            value: coupon.value,
            maxDiscount: coupon.maxDiscount,
          },
        };
      }),
  }),

  // ─── Review Routes ─────────────────────────────────────────────────

  review: createRouter({
    create: publicQuery
      .input(
        z.object({
          productId: z.number(),
          userName: z.string(),
          rating: z.number().min(1).max(5),
          title: z.string().optional(),
          body: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const db = getDb();
        await db.insert(reviews).values(input);

        const productReviews = await db
          .select()
          .from(reviews)
          .where(eq(reviews.productId, input.productId));

        const avgRating =
          productReviews.reduce((sum, r) => sum + r.rating, 0) /
          productReviews.length;

        await db
          .update(products)
          .set({
            rating: avgRating.toFixed(2),
            reviewCount: productReviews.length,
          })
          .where(eq(products.id, input.productId));

        return { success: true };
      }),

    list: publicQuery
      .input(z.object({ productId: z.number() }))
      .query(async ({ input }) => {
        return getDb()
          .select()
          .from(reviews)
          .where(eq(reviews.productId, input.productId))
          .orderBy(desc(reviews.createdAt));
      }),
  }),

  // ─── Admin Routes ─────────────────────────────────────────────────

  admin: createRouter({
    dashboard: adminQuery.query(async () => {
      const db = getDb();

      const totalOrders = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders);

      const totalRevenue = await db
        .select({ total: sql<number>`coalesce(sum(${orders.total}), 0)` })
        .from(orders)
        .where(eq(orders.paymentStatus, "paid"));

      const pendingOrders = await db
        .select({ count: sql<number>`count(*)` })
        .from(orders)
        .where(eq(orders.status, "pending"));

      const lowStockProducts = await db
        .select()
        .from(products)
        .where(sql`${products.inventory} <= ${products.lowStockThreshold}`);

      const recentOrders = await db
        .select()
        .from(orders)
        .orderBy(desc(orders.createdAt))
        .limit(10);

      return {
        totalOrders: totalOrders[0]?.count ?? 0,
        totalRevenue: totalRevenue[0]?.total ?? 0,
        pendingOrders: pendingOrders[0]?.count ?? 0,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
      };
    }),

    orders: adminQuery
      .input(
        z.object({
          status: z.string().optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        }).optional()
      )
      .query(async ({ input }) => {
        const db = getDb();
        const filters = [];

        if (input?.status) {
          filters.push(eq(orders.status, input.status as any));
        }

        const where = filters.length > 0 ? and(...filters) : undefined;

        const items = await db
          .select()
          .from(orders)
          .where(where)
          .orderBy(desc(orders.createdAt))
          .limit(input?.limit ?? 50)
          .offset(input?.offset ?? 0);

        return items;
      }),

    updateOrderStatus: adminQuery
      .input(
        z.object({
          orderId: z.number(),
          status: z.enum(["pending", "paid", "shipped", "delivered", "cancelled", "refunded"]),
        })
      )
      .mutation(async ({ input }) => {
        await getDb()
          .update(orders)
          .set({
            status: input.status,
            updatedAt: new Date(),
          })
          .where(eq(orders.id, input.orderId));

        return { success: true };
      }),

    products: adminQuery.query(async () => {
      return getDb()
        .select()
        .from(products)
        .orderBy(desc(products.createdAt));
    }),

    createProduct: adminQuery
      .input(
        z.object({
          name: z.string().min(1),
          slug: z.string().min(1),
          description: z.string().optional(),
          price: z.string(),
          compareAtPrice: z.string().optional(),
          images: z.array(z.string()).default([]),
          categoryId: z.number().optional(),
          sku: z.string().min(1),
          inventory: z.number().default(0),
          sizes: z.array(z.string()).default([]),
          colors: z.array(z.string()).default([]),
          tags: z.array(z.string()).default([]),
          status: z.enum(["draft", "published", "archived"]).default("published"),
          isFeatured: z.boolean().default(false),
          isNewArrival: z.boolean().default(false),
          material: z.string().optional(),
          care: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const [result] = await getDb()
          .insert(products)
          .values(input)
          .$returningId();
        return { id: result.id };
      }),

    updateProduct: adminQuery
      .input(
        z.object({
          id: z.number(),
          data: z.object({
            name: z.string().optional(),
            slug: z.string().optional(),
            description: z.string().optional(),
            price: z.string().optional(),
            compareAtPrice: z.string().optional(),
            images: z.array(z.string()).optional(),
            categoryId: z.number().optional(),
            inventory: z.number().optional(),
            sizes: z.array(z.string()).optional(),
            colors: z.array(z.string()).optional(),
            tags: z.array(z.string()).optional(),
            status: z.enum(["draft", "published", "archived"]).optional(),
            isFeatured: z.boolean().optional(),
            isNewArrival: z.boolean().optional(),
            material: z.string().optional(),
            care: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ input }) => {
        await getDb()
          .update(products)
          .set({ ...input.data, updatedAt: new Date() })
          .where(eq(products.id, input.id));
        return { success: true };
      }),

    deleteProduct: adminQuery
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await getDb().delete(products).where(eq(products.id, input.id));
        return { success: true };
      }),

    customers: adminQuery.query(async () => {
      return getDb()
        .select()
        .from(users)
        .orderBy(desc(users.createdAt));
    }),
  }),
});

export type AppRouter = typeof appRouter;
