import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  decimal,
  boolean,
  bigint,
  json,
} from "drizzle-orm/mysql-core";

// ─── Users (Auth) ──────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─── Categories ──────────────────────────────────────────────────────

export const categories = mysqlTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Products ────────────────────────────────────────────────────────

export const products = mysqlTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal("compareAtPrice", { precision: 10, scale: 2 }),
  images: json("images").$type<string[]>().default([]).notNull(),
  categoryId: bigint("categoryId", { mode: "number", unsigned: true }),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  inventory: int("inventory").default(0).notNull(),
  lowStockThreshold: int("lowStockThreshold").default(5).notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  isNewArrival: boolean("isNewArrival").default(false).notNull(),
  tags: json("tags").$type<string[]>().default([]).notNull(),
  sizes: json("sizes").$type<string[]>().default([]).notNull(),
  colors: json("colors").$type<string[]>().default([]).notNull(),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  material: varchar("material", { length: 255 }),
  care: text("care"),
  metaTitle: varchar("metaTitle", { length: 255 }),
  metaDescription: text("metaDescription"),
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0").notNull(),
  reviewCount: int("reviewCount").default(0).notNull(),
  soldCount: int("soldCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Product Variants ────────────────────────────────────────────────

export const productVariants = mysqlTable("product_variants", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  size: varchar("size", { length: 50 }),
  color: varchar("color", { length: 100 }),
  sku: varchar("sku", { length: 100 }).notNull().unique(),
  price: decimal("price", { precision: 10, scale: 2 }),
  inventory: int("inventory").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Reviews ─────────────────────────────────────────────────────────

export const reviews = mysqlTable("reviews", {
  id: serial("id").primaryKey(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  userName: varchar("userName", { length: 255 }).notNull(),
  rating: int("rating").notNull(),
  title: varchar("title", { length: 255 }),
  body: text("body"),
  images: json("images").$type<string[]>().default([]).notNull(),
  isVerified: boolean("isVerified").default(false).notNull(),
  helpful: int("helpful").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Cart Items ──────────────────────────────────────────────────────

export const cartItems = mysqlTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: varchar("sessionId", { length: 255 }).notNull(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  variantId: bigint("variantId", { mode: "number", unsigned: true }),
  quantity: int("quantity").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Wishlist Items ──────────────────────────────────────────────────

export const wishlistItems = mysqlTable("wishlist_items", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Orders ──────────────────────────────────────────────────────────

export const orders = mysqlTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  userEmail: varchar("userEmail", { length: 320 }),
  userName: varchar("userName", { length: 255 }),
  status: mysqlEnum("status", ["pending", "paid", "shipped", "delivered", "cancelled", "refunded"]).default("pending").notNull(),
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "paid", "failed", "refunded"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
  shippingCost: decimal("shippingCost", { precision: 10, scale: 2 }).default("0").notNull(),
  discount: decimal("discount", { precision: 10, scale: 2 }).default("0").notNull(),
  tax: decimal("tax", { precision: 10, scale: 2 }).default("0").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("EGP").notNull(),
  couponCode: varchar("couponCode", { length: 100 }),
  shippingAddress: json("shippingAddress").$type<Record<string, string>>(),
  billingAddress: json("billingAddress").$type<Record<string, string>>(),
  trackingNumber: varchar("trackingNumber", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ─── Order Items ─────────────────────────────────────────────────────

export const orderItems = mysqlTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: bigint("orderId", { mode: "number", unsigned: true }).notNull(),
  productId: bigint("productId", { mode: "number", unsigned: true }).notNull(),
  variantId: bigint("variantId", { mode: "number", unsigned: true }),
  productName: varchar("productName", { length: 255 }).notNull(),
  productImage: text("productImage"),
  size: varchar("size", { length: 50 }),
  color: varchar("color", { length: 100 }),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ─── Coupons ─────────────────────────────────────────────────────────

export const coupons = mysqlTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 100 }).notNull().unique(),
  type: mysqlEnum("type", ["percentage", "fixed"]).default("percentage").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  minOrder: decimal("minOrder", { precision: 10, scale: 2 }).default("0").notNull(),
  maxDiscount: decimal("maxDiscount", { precision: 10, scale: 2 }),
  usageLimit: int("usageLimit"),
  usageCount: int("usageCount").default(0).notNull(),
  expiresAt: timestamp("expiresAt"),
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
