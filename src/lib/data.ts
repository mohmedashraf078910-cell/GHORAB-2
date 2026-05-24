export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: string;
  categoryId: number;
  sku: string;
  inventory: number;
  sizes: string[];
  colors: string[];
  tags: string[];
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  isNewArrival: boolean;
  material: string;
  care: string;
  rating: number;
  reviewCount: number;
  soldCount: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  size: string;
  color: string;
  product: Product;
}

export interface Review {
  id: number;
  productId: number;
  userName: string;
  rating: number;
  title: string;
  body: string;
  isVerified: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled" | "refunded";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  total: number;
  items: number;
  customer: string;
  createdAt: string;
}

export const categories: Category[] = [
  { id: 1, name: "Outerwear", slug: "outerwear", description: "Statement jackets and coats", image: "/product-jacket-1.jpg" },
  { id: 2, name: "Tops", slug: "tops", description: "Premium tees and hoodies", image: "/product-hoodie-1.jpg" },
  { id: 3, name: "Bottoms", slug: "bottoms", description: "Technical pants and cargos", image: "/product-pants-1.jpg" },
  { id: 4, name: "Accessories", slug: "accessories", description: "Details that define", image: "/product-vest-1.jpg" },
];

export const products: Product[] = [
  {
    id: 1,
    name: "GHORAB Arabic Logo Hoodie",
    slug: "ghorab-arabic-logo-hoodie",
    description: "Heavyweight 480gsm cotton fleece hoodie featuring minimal Arabic calligraphy branding. Dropped shoulders, oversized silhouette, and premium ribbed cuffs. A statement piece that bridges street culture with luxury craftsmanship.",
    price: 2800,
    compareAtPrice: 3200,
    images: ["/product-hoodie-1.jpg"],
    category: "Tops",
    categoryId: 2,
    sku: "GH-HD-001",
    inventory: 45,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Charcoal"],
    tags: ["hoodie", "arabic", "logo", "featured"],
    status: "published",
    isFeatured: true,
    isNewArrival: true,
    material: "100% Heavyweight Cotton Fleece",
    care: "Machine wash cold. Hang dry. Do not bleach.",
    rating: 4.8,
    reviewCount: 124,
    soldCount: 89,
  },
  {
    id: 2,
    name: "Shadow Bomber Jacket",
    slug: "shadow-bomber-jacket",
    description: "Technical bomber jacket in matte black nylon with asymmetric zipper closure. Features concealed pockets, adjustable hem, and the iconic GHORAB raven emblem embroidered on the back. Water-resistant and windproof.",
    price: 4500,
    compareAtPrice: 5200,
    images: ["/product-jacket-1.jpg"],
    category: "Outerwear",
    categoryId: 1,
    sku: "GH-JK-001",
    inventory: 23,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    tags: ["jacket", "bomber", "technical"],
    status: "published",
    isFeatured: true,
    isNewArrival: false,
    material: "Matte Nylon with DWR Coating",
    care: "Professional clean only.",
    rating: 4.9,
    reviewCount: 87,
    soldCount: 156,
  },
  {
    id: 3,
    name: "Essential Boxy Tee",
    slug: "essential-boxy-tee",
    description: "Oversized boxy-fit t-shirt in 300gsm heavyweight cotton. Minimal embroidered raven logo on the chest. The perfect foundation piece for any elevated streetwear look.",
    price: 1200,
    images: ["/product-tee-1.jpg"],
    category: "Tops",
    categoryId: 2,
    sku: "GH-TE-001",
    inventory: 120,
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Black", "White", "Ash Grey"],
    tags: ["t-shirt", "essential", "boxy"],
    status: "published",
    isFeatured: false,
    isNewArrival: true,
    material: "100% Heavyweight Cotton",
    care: "Machine wash cold. Tumble dry low.",
    rating: 4.7,
    reviewCount: 203,
    soldCount: 342,
  },
  {
    id: 4,
    name: "Tactical Cargo Pants",
    slug: "tactical-cargo-pants",
    description: "Technical cargo pants with 8 utility pockets, articulated knees, and adjustable ankle cuffs. Made from durable cotton-nylon blend with water-repellent finish. The ultimate fusion of function and form.",
    price: 3200,
    compareAtPrice: 3800,
    images: ["/product-pants-1.jpg"],
    category: "Bottoms",
    categoryId: 3,
    sku: "GH-PT-001",
    inventory: 34,
    sizes: ["30", "32", "34", "36"],
    colors: ["Black", "Olive"],
    tags: ["pants", "cargo", "technical"],
    status: "published",
    isFeatured: true,
    isNewArrival: false,
    material: "65% Cotton, 35% Nylon",
    care: "Machine wash cold. Hang dry.",
    rating: 4.6,
    reviewCount: 91,
    soldCount: 178,
  },
  {
    id: 5,
    name: "Draped Wool Overcoat",
    slug: "draped-wool-overcoat",
    description: "Dramatic oversized wool overcoat with draped silhouette and hidden button closure. Below-knee length with exaggerated sleeves. A statement piece inspired by architectural forms.",
    price: 6800,
    images: ["/product-coat-1.jpg"],
    category: "Outerwear",
    categoryId: 1,
    sku: "GH-CT-001",
    inventory: 12,
    sizes: ["M", "L", "XL"],
    colors: ["Black"],
    tags: ["coat", "wool", "draped", "luxury"],
    status: "published",
    isFeatured: true,
    isNewArrival: true,
    material: "100% Italian Wool",
    care: "Dry clean only.",
    rating: 5.0,
    reviewCount: 34,
    soldCount: 45,
  },
  {
    id: 6,
    name: "Utility Mesh Vest",
    slug: "utility-mesh-vest",
    description: "Tactical mesh vest with multiple zippered compartments and adjustable straps. Layer it over a hoodie or tee for the ultimate techwear look. Breathable yet durable construction.",
    price: 2400,
    images: ["/product-vest-1.jpg"],
    category: "Accessories",
    categoryId: 4,
    sku: "GH-VT-001",
    inventory: 28,
    sizes: ["S/M", "L/XL"],
    colors: ["Black"],
    tags: ["vest", "utility", "technical"],
    status: "published",
    isFeatured: false,
    isNewArrival: true,
    material: "Mesh Nylon with Metal Hardware",
    care: "Hand wash. Air dry.",
    rating: 4.5,
    reviewCount: 56,
    soldCount: 89,
  },
  {
    id: 7,
    name: "Relaxed Sweatpants",
    slug: "relaxed-sweatpants",
    description: "Premium heavyweight sweatpants with minimal embroidered logo. Elastic waistband with drawcord, side pockets, and elastic cuffs. The perfect balance of comfort and elevated style.",
    price: 1800,
    compareAtPrice: 2200,
    images: ["/product-sweatpants-1.jpg"],
    category: "Bottoms",
    categoryId: 3,
    sku: "GH-SP-001",
    inventory: 67,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Sand"],
    tags: ["sweatpants", "relaxed", "essential"],
    status: "published",
    isFeatured: false,
    isNewArrival: false,
    material: "100% Cotton Fleece",
    care: "Machine wash cold. Tumble dry low.",
    rating: 4.7,
    reviewCount: 145,
    soldCount: 267,
  },
  {
    id: 8,
    name: "Cairo Nights Tech Jacket",
    slug: "cairo-nights-tech-jacket",
    description: "Our flagship technical jacket featuring reflective detailing and waterproof construction. Inspired by the energy of Cairo after dark. Limited edition drop piece.",
    price: 5200,
    images: ["/hero-jacket.jpg"],
    category: "Outerwear",
    categoryId: 1,
    sku: "GH-JK-002",
    inventory: 8,
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    tags: ["jacket", "technical", "limited", "featured"],
    status: "published",
    isFeatured: true,
    isNewArrival: true,
    material: "3-Layer Technical Fabric",
    care: "Professional clean only.",
    rating: 4.9,
    reviewCount: 42,
    soldCount: 38,
  },
];

export const reviews: Review[] = [
  { id: 1, productId: 1, userName: "Omar K.", rating: 5, title: "Worth every penny", body: "The quality is insane. Heavyweight fabric that feels like it will last forever. The fit is perfectly oversized.", isVerified: true, createdAt: "2026-05-20" },
  { id: 2, productId: 1, userName: "Youssef A.", rating: 5, title: "Best hoodie I own", body: "The Arabic calligraphy is subtle but powerful. Gets compliments everywhere I go.", isVerified: true, createdAt: "2026-05-18" },
  { id: 3, productId: 1, userName: "Karim M.", rating: 4, title: "Great quality", body: "Love the fabric and the design. Slightly long on the sleeves for me but otherwise perfect.", isVerified: true, createdAt: "2026-05-15" },
  { id: 4, productId: 2, userName: "Ahmed R.", rating: 5, title: "Technical perfection", body: "The water resistance actually works. Wore it in light rain and stayed completely dry. The asymmetrical zipper is a nice touch.", isVerified: true, createdAt: "2026-05-19" },
  { id: 5, productId: 3, userName: "Mostafa S.", rating: 5, title: "Essential piece", body: "Bought three colors. The 300gsm weight is perfect - substantial but not too heavy for summer evenings.", isVerified: true, createdAt: "2026-05-17" },
];

export const orders: Order[] = [
  { id: 1, orderNumber: "GH-260524-001", status: "delivered", paymentStatus: "paid", total: 7300, items: 2, customer: "Omar Khalil", createdAt: "2026-05-24T10:00:00" },
  { id: 2, orderNumber: "GH-260524-002", status: "shipped", paymentStatus: "paid", total: 2800, items: 1, customer: "Youssef Ahmed", createdAt: "2026-05-24T09:30:00" },
  { id: 3, orderNumber: "GH-260524-003", status: "pending", paymentStatus: "pending", total: 5200, items: 1, customer: "Karim Mahmoud", createdAt: "2026-05-24T09:00:00" },
  { id: 4, orderNumber: "GH-260523-004", status: "paid", paymentStatus: "paid", total: 4000, items: 2, customer: "Ahmed Rashid", createdAt: "2026-05-23T16:00:00" },
  { id: 5, orderNumber: "GH-260523-005", status: "delivered", paymentStatus: "paid", total: 1800, items: 1, customer: "Mostafa Samir", createdAt: "2026-05-23T14:00:00" },
  { id: 6, orderNumber: "GH-260522-006", status: "delivered", paymentStatus: "paid", total: 9600, items: 3, customer: "Hassan Ibrahim", createdAt: "2026-05-22T11:00:00" },
  { id: 7, orderNumber: "GH-260522-007", status: "cancelled", paymentStatus: "refunded", total: 3200, items: 1, customer: "Tarek Fathy", createdAt: "2026-05-22T10:00:00" },
  { id: 8, orderNumber: "GH-260521-008", status: "shipped", paymentStatus: "paid", total: 6800, items: 1, customer: "Nour El-Din", createdAt: "2026-05-21T15:00:00" },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(productId: number, categoryId: number): Product[] {
  return products.filter((p) => p.id !== productId && p.categoryId === categoryId).slice(0, 4);
}

export function getProductsByCategory(slug: string): Product[] {
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return products;
  return products.filter((p) => p.categoryId === cat.id);
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase();
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.category.toLowerCase().includes(q)
  );
}
