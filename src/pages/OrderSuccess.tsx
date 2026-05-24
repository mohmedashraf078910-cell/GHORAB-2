import { Link } from "react-router";
import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="pt-32 pb-20 px-6 flex flex-col items-center justify-center min-h-[70vh]">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        </motion.div>

        <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
        <p className="text-white/50 mb-2">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>
        <p className="text-sm text-white/30 mb-8">
          Order number: <span className="text-white/60 font-mono">GH-260524-009</span>
        </p>

        <div className="bg-white/[0.02] border border-white/5 p-6 mb-8 text-left">
          <h3 className="text-xs tracking-[0.2em] uppercase text-white/60 mb-4">What happens next?</h3>
          <ul className="space-y-3 text-sm text-white/50">
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0">1</span>
              You will receive an order confirmation email shortly.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0">2</span>
              We will process and ship your order within 1-2 business days.
            </li>
            <li className="flex items-start gap-3">
              <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold flex-shrink-0">3</span>
              You will receive a tracking number once your order ships.
            </li>
          </ul>
        </div>

        <div className="flex gap-4 justify-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:border-white/40 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
