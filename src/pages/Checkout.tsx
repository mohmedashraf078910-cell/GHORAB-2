import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ArrowLeft, CreditCard, MapPin, Tag } from "lucide-react";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";

export default function Checkout() {
  const { cart, cartTotal, clearCart } = useStore();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    phone: "",
    coupon: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "cod">("card");
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const shipping = cartTotal() > 3000 ? 0 : 150;
  const subtotal = cartTotal();
  const total = subtotal + shipping - discount;

  if (cart.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === "ghorab20") {
      setDiscount(subtotal * 0.2);
      setCouponApplied(true);
      toast.success("20% discount applied!");
    } else if (couponCode.toLowerCase() === "welcome") {
      setDiscount(500);
      setCouponApplied(true);
      toast.success("EGP 500 discount applied!");
    } else {
      toast.error("Invalid coupon code");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.firstName || !formData.lastName || !formData.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    clearCart();
    navigate("/order-success");
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="pt-24 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
        </button>

        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-10">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <div className="bg-white/[0.02] border border-white/5 p-6">
                <h2 className="text-sm font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Contact & Shipping
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 mb-2 block">Email *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField("email", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">First Name *</label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField("firstName", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Last Name *</label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateField("lastName", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                      required
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-white/50 mb-2 block">Address *</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => updateField("address", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                      placeholder="Street address, building, apartment"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField("city", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                      placeholder="Cairo"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-white/50 mb-2 block">Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                      placeholder="+20 XXX XXX XXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="bg-white/[0.02] border border-white/5 p-6">
                <h2 className="text-sm font-semibold tracking-wider uppercase mb-6 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" /> Payment Method
                </h2>
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`w-full p-4 border text-left transition-colors flex items-center gap-4 ${
                      paymentMethod === "card"
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "card" ? "border-white" : "border-white/20"
                    }`}>
                      {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Credit/Debit Card</p>
                      <p className="text-xs text-white/40">Visa, Mastercard, Meeza</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cod")}
                    className={`w-full p-4 border text-left transition-colors flex items-center gap-4 ${
                      paymentMethod === "cod"
                        ? "border-white bg-white/5"
                        : "border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === "cod" ? "border-white" : "border-white/20"
                    }`}>
                      {paymentMethod === "cod" && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cash on Delivery</p>
                      <p className="text-xs text-white/40">Pay when you receive</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/[0.02] border border-white/5 p-6 sticky top-28">
                <h2 className="text-sm font-semibold tracking-wider uppercase mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-6 pb-6 border-b border-white/10 max-h-60 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-14 h-18 bg-[#111] flex-shrink-0 overflow-hidden">
                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">{item.product.name}</p>
                        <p className="text-[10px] text-white/40">{item.size} / {item.color}</p>
                        <p className="text-xs text-white/60">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-xs font-medium">
                        EGP {(item.product.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <label className="text-xs text-white/50 mb-2 flex items-center gap-1.5">
                    <Tag className="w-3 h-3" /> Coupon Code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs outline-none focus:border-white/30 uppercase"
                      placeholder="Enter code"
                      disabled={couponApplied}
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={couponApplied || !couponCode}
                      className="px-4 py-2 border border-white/20 text-xs tracking-wider uppercase hover:bg-white/5 transition-colors disabled:opacity-40"
                    >
                      {couponApplied ? "Applied" : "Apply"}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/30 mt-2">Try: GHORAB20 or WELCOME</p>
                </div>

                {/* Totals */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Subtotal</span>
                    <span>EGP {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/50">Shipping</span>
                    <span>{shipping === 0 ? "Free" : `EGP ${shipping}`}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-400">
                      <span>Discount</span>
                      <span>-EGP {discount.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center mb-6 pt-4 border-t border-white/10">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold">EGP {total.toLocaleString()}</span>
                </div>

                <button
                  type="submit"
                  className="w-full h-14 bg-white text-black text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors"
                >
                  Complete Order
                </button>

                <p className="text-[10px] text-white/30 text-center mt-4">
                  By placing this order, you agree to our Terms and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
