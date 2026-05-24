import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Minus, Plus, X, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, clearCart } = useStore();
  const navigate = useNavigate();

  const shipping = cartTotal() > 3000 ? 0 : 150;
  const total = cartTotal() + shipping;

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-[60vh]">
        <ShoppingBag className="w-16 h-16 text-white/20 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Your Cart is Empty</h1>
        <p className="text-white/40 mb-8">Discover our latest collection and add something special.</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors"
        >
          Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-2">Shopping Cart</h1>
        <p className="text-sm text-white/40 mb-10">{cartCount()} item(s)</p>

        <div className="grid lg:grid-cols-3 gap-10 lg:gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4 p-4 bg-white/[0.02] border border-white/5"
              >
                <Link to={`/product/${item.product.slug}`} className="w-24 h-32 bg-[#111] flex-shrink-0 overflow-hidden">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <Link to={`/product/${item.product.slug}`} className="text-sm font-medium hover:text-white/80 transition-colors">
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-white/40 mt-1">
                          {item.size} / {item.color}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 text-white/30 hover:text-red-400 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-white/10">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <p className="text-sm font-semibold">
                      EGP {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            <button
              onClick={clearCart}
              className="text-xs text-white/30 hover:text-white/60 transition-colors tracking-wider uppercase"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.02] border border-white/5 p-6 sticky top-28">
              <h2 className="text-sm font-semibold tracking-wider uppercase mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Subtotal</span>
                  <span>EGP {cartTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `EGP ${shipping}`}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">EGP {total.toLocaleString()}</span>
              </div>

              {shipping > 0 && (
                <div className="flex items-center gap-2 mb-6 p-3 bg-white/5 text-xs text-white/50">
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  Add EGP {(3000 - cartTotal()).toLocaleString()} more for free shipping
                </div>
              )}

              <button
                onClick={() => navigate("/checkout")}
                className="w-full h-14 bg-white text-black text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <Link
                to="/shop"
                className="block w-full h-12 border border-white/10 text-white/60 text-xs tracking-[0.2em] uppercase hover:border-white/30 hover:text-white transition-colors flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
