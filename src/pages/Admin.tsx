import { useState } from "react";
import { Link, Routes, Route, useLocation } from "react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  BarChart3,
  TrendingUp,
  DollarSign,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Plus,
  Edit3,
  Trash2,
  Eye,
  ChevronLeft,
  Download,
} from "lucide-react";
import { products, orders, categories, reviews } from "@/lib/data";
import { toast } from "sonner";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Package, label: "Products", path: "/admin/products" },
  { icon: ShoppingCart, label: "Orders", path: "/admin/orders" },
  { icon: Users, label: "Customers", path: "/admin/customers" },
  { icon: Tag, label: "Coupons", path: "/admin/coupons" },
  { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
];

export default function Admin() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="pt-16 min-h-screen bg-[#0a0a0a]">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className="hidden lg:block w-64 border-r border-white/5 min-h-screen sticky top-16">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-8">
              <ChevronLeft className="w-3 h-3" /> Back to Store
            </Link>
            <nav className="space-y-1">
              {sidebarItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                    location.pathname === item.path
                      ? "bg-white/5 text-white border-l-2 border-white"
                      : "text-white/50 hover:text-white hover:bg-white/[0.02]"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile sidebar toggle */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg"
        >
          <LayoutDashboard className="w-5 h-5" />
        </button>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-10">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/coupons" element={<Coupons />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ─── Dashboard ──────────────────────────────────────────────────────

function Dashboard() {
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === "paid" ? sum + o.total : sum), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStockProducts = products.filter((p) => p.inventory <= 10);

  const stats = [
    { label: "Total Revenue", value: `EGP ${totalRevenue.toLocaleString()}`, change: "+12.5%", up: true, icon: DollarSign },
    { label: "Total Orders", value: totalOrders.toString(), change: "+8.2%", up: true, icon: ShoppingCart },
    { label: "Pending Orders", value: pendingOrders.toString(), change: "-2.1%", up: false, icon: AlertTriangle },
    { label: "Low Stock Items", value: lowStockProducts.length.toString(), change: "Needs attention", up: false, icon: Package },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.02] border border-white/5 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <stat.icon className="w-5 h-5 text-white/40" />
              <span className={`text-xs flex items-center gap-0.5 ${stat.up ? "text-green-400" : "text-red-400"}`}>
                {stat.change}
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              </span>
            </div>
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white/[0.02] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold tracking-wider uppercase">Recent Orders</h2>
            <Link to="/admin/orders" className="text-xs text-white/40 hover:text-white transition-colors">View All</Link>
          </div>
          <div className="space-y-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-white/40">{order.customer}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">EGP {order.total.toLocaleString()}</p>
                  <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                    order.status === "delivered" ? "bg-green-600/20 text-green-400" :
                    order.status === "pending" ? "bg-yellow-600/20 text-yellow-400" :
                    order.status === "shipped" ? "bg-blue-600/20 text-blue-400" :
                    "bg-red-600/20 text-red-400"
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white/[0.02] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold tracking-wider uppercase">Top Products</h2>
            <Link to="/admin/products" className="text-xs text-white/40 hover:text-white transition-colors">View All</Link>
          </div>
          <div className="space-y-3">
            {products
              .sort((a, b) => b.soldCount - a.soldCount)
              .slice(0, 5)
              .map((product) => (
                <div key={product.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                  <div className="w-12 h-16 bg-[#111] flex-shrink-0 overflow-hidden">
                    <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{product.name}</p>
                    <p className="text-xs text-white/40">{product.soldCount} sold</p>
                  </div>
                  <p className="text-sm">EGP {product.price.toLocaleString()}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Products ───────────────────────────────────────────────────────

function Products() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search);
    const matchStatus = statusFilter === "all" || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Products</h1>
        <button
          onClick={() => toast.info("Add product form coming soon")}
          className="flex items-center gap-2 bg-white text-black px-5 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-white/90 transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm outline-none focus:border-white/30"
            placeholder="Search products..."
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-transparent border border-white/10 text-sm px-4 py-2.5 outline-none focus:border-white/30"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Product</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">SKU</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Price</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Stock</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Status</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Sold</th>
                <th className="text-right text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((product) => (
                <tr key={product.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 bg-[#111] flex-shrink-0 overflow-hidden">
                        <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{product.name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">{product.sku}</td>
                  <td className="px-4 py-3 text-sm">EGP {product.price.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-sm ${product.inventory <= 10 ? "text-red-400" : "text-white/60"}`}>
                      {product.inventory}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                      product.status === "published" ? "bg-green-600/20 text-green-400" :
                      product.status === "draft" ? "bg-yellow-600/20 text-yellow-400" :
                      "bg-red-600/20 text-red-400"
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/50">{product.soldCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => toast.info("Edit product")} className="p-1.5 text-white/30 hover:text-white transition-colors">
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => toast.error("Product deleted")} className="p-1.5 text-white/30 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Orders ─────────────────────────────────────────────────────────

function Orders() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const statusColors: Record<string, string> = {
    pending: "bg-yellow-600/20 text-yellow-400",
    paid: "bg-blue-600/20 text-blue-400",
    shipped: "bg-purple-600/20 text-purple-400",
    delivered: "bg-green-600/20 text-green-400",
    cancelled: "bg-red-600/20 text-red-400",
    refunded: "bg-gray-600/20 text-gray-400",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Orders</h1>
        <button onClick={() => toast.info("Exporting orders...")} className="flex items-center gap-2 border border-white/10 px-4 py-2.5 text-xs tracking-[0.15em] uppercase hover:bg-white/5 transition-colors">
          <Download className="w-3.5 h-3.5" /> Export
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {["all", "pending", "paid", "shipped", "delivered", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`text-xs tracking-[0.15em] uppercase whitespace-nowrap px-4 py-2 border transition-colors ${
              statusFilter === status ? "border-white text-white" : "border-white/10 text-white/40 hover:border-white/30"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Order</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Customer</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Total</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Status</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Payment</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Date</th>
                <th className="text-right text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((order) => (
                <tr key={order.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                  <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3 text-sm text-white/60">{order.customer}</td>
                  <td className="px-4 py-3 text-sm">EGP {order.total.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${statusColors[order.status] || ""}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${
                      order.paymentStatus === "paid" ? "bg-green-600/20 text-green-400" : "bg-yellow-600/20 text-yellow-400"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-white/40">{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toast.info("View order details")} className="p-1.5 text-white/30 hover:text-white transition-colors ml-auto block">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Customers ──────────────────────────────────────────────────────

function Customers() {
  const customerMap = new Map<string, { name: string; orders: number; total: number; lastOrder: string }>();

  orders.forEach((o) => {
    const existing = customerMap.get(o.customer);
    if (existing) {
      existing.orders++;
      existing.total += o.total;
      if (new Date(o.createdAt) > new Date(existing.lastOrder)) existing.lastOrder = o.createdAt;
    } else {
      customerMap.set(o.customer, { name: o.customer, orders: 1, total: o.total, lastOrder: o.createdAt });
    }
  });

  const customers = Array.from(customerMap.values()).sort((a, b) => b.total - a.total);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Customers</h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/[0.02] border border-white/5 p-6">
          <p className="text-3xl font-bold">{customers.length}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Total Customers</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6">
          <p className="text-3xl font-bold">{customers.filter((c) => c.orders > 1).length}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Returning</p>
        </div>
        <div className="bg-white/[0.02] border border-white/5 p-6">
          <p className="text-3xl font-bold">EGP {Math.round(customers.reduce((s, c) => s + c.total, 0) / customers.length).toLocaleString()}</p>
          <p className="text-xs text-white/40 uppercase tracking-wider mt-1">Avg. Lifetime Value</p>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Customer</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Orders</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Total Spent</th>
                <th className="text-left text-xs tracking-wider uppercase text-white/40 px-4 py-3 font-medium">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.01] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold">
                        {c.name.charAt(0)}
                      </div>
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{c.orders}</td>
                  <td className="px-4 py-3 text-sm">EGP {c.total.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-white/40">{new Date(c.lastOrder).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── Coupons ────────────────────────────────────────────────────────

function Coupons() {
  const [coupons] = useState([
    { id: 1, code: "GHORAB20", type: "percentage", value: 20, usage: 45, limit: 100, expires: "2026-06-30", active: true },
    { id: 2, code: "WELCOME", type: "fixed", value: 500, usage: 128, limit: 200, expires: "2026-12-31", active: true },
    { id: 3, code: "SUMMER15", type: "percentage", value: 15, usage: 23, limit: 50, expires: "2026-06-15", active: false },
  ]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Coupons</h1>
        <button onClick={() => toast.info("Create coupon form coming soon")} className="flex items-center gap-2 bg-white text-black px-5 py-2.5 text-xs tracking-[0.15em] uppercase font-semibold hover:bg-white/90 transition-colors">
          <Plus className="w-4 h-4" /> Create Coupon
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div key={coupon.id} className="bg-white/[0.02] border border-white/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-bold font-mono">{coupon.code}</span>
              <span className={`text-[10px] px-2 py-0.5 uppercase tracking-wider ${coupon.active ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>
                {coupon.active ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Discount</span>
                <span>{coupon.type === "percentage" ? `${coupon.value}%` : `EGP ${coupon.value}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Usage</span>
                <span>{coupon.usage} / {coupon.limit}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/40">Expires</span>
                <span>{coupon.expires}</span>
              </div>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/40 rounded-full transition-all"
                style={{ width: `${(coupon.usage / coupon.limit) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Analytics ──────────────────────────────────────────────────────

function Analytics() {
  const totalRevenue = orders.reduce((sum, o) => (o.paymentStatus === "paid" ? sum + o.total : sum), 0);
  const avgOrderValue = Math.round(totalRevenue / orders.length);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Analytics</h1>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Revenue", value: `EGP ${totalRevenue.toLocaleString()}`, icon: DollarSign },
          { label: "Total Orders", value: orders.length.toString(), icon: ShoppingCart },
          { label: "Avg. Order Value", value: `EGP ${avgOrderValue.toLocaleString()}`, icon: TrendingUp },
          { label: "Total Reviews", value: reviews.length.toString(), icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="bg-white/[0.02] border border-white/5 p-6">
            <stat.icon className="w-5 h-5 text-white/40 mb-4" />
            <p className="text-2xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Category Distribution */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.02] border border-white/5 p-6">
          <h2 className="text-sm font-semibold tracking-wider uppercase mb-6">Products by Category</h2>
          <div className="space-y-4">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div key={cat.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{cat.name}</span>
                    <span className="text-white/40">{count} products</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-white/30 rounded-full" style={{ width: `${(count / products.length) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-6">
          <h2 className="text-sm font-semibold tracking-wider uppercase mb-6">Order Status Distribution</h2>
          <div className="space-y-4">
            {["pending", "paid", "shipped", "delivered", "cancelled"].map((status) => {
              const count = orders.filter((o) => o.status === status).length;
              const colors: Record<string, string> = {
                pending: "bg-yellow-500",
                paid: "bg-blue-500",
                shipped: "bg-purple-500",
                delivered: "bg-green-500",
                cancelled: "bg-red-500",
              };
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize">{status}</span>
                    <span className="text-white/40">{count} orders</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${colors[status]} rounded-full`} style={{ width: `${(count / orders.length) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
