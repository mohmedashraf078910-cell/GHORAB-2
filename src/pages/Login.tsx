import { Link } from "react-router";
import { motion } from "framer-motion";
import { LogIn } from "lucide-react";

export default function Login() {
  return (
    <div className="pt-24 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-10 min-h-[80vh] flex items-center justify-center">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <Link to="/" className="text-2xl font-bold tracking-[0.3em] uppercase">
            GHORAB
          </Link>
          <h1 className="text-2xl font-bold mt-8 mb-2">Welcome Back</h1>
          <p className="text-sm text-white/50">Sign in to access your account and orders.</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 p-8">
          <button
            onClick={() => {
              window.location.href = "/api/oauth/callback?code=demo&state=demo";
            }}
            className="w-full h-14 bg-white text-black text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-3 mb-6"
          >
            <LogIn className="w-4 h-4" /> Sign in with Kimi
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#0a0a0a] px-4 text-xs text-white/30 uppercase tracking-wider">or</span>
            </div>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
            <div>
              <label className="text-xs text-white/50 mb-2 block">Email</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="text-xs text-white/50 mb-2 block">Password</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              className="w-full h-12 border border-white/20 text-xs tracking-[0.2em] uppercase hover:bg-white/5 transition-colors"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/admin" className="text-xs text-white/40 hover:text-white transition-colors underline">
              Continue as Guest Admin
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
