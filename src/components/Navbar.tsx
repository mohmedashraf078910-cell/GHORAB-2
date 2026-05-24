import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Menu, X, Heart, User } from "lucide-react";
import { useStore } from "@/store/useStore";
import { categories } from "@/lib/data";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, wishlist } = useStore();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5"
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link to="/" className="text-xl lg:text-2xl font-bold tracking-[0.3em] uppercase">
              GHORAB
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              <Link to="/" className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/shop" className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">
                Shop All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/shop/${cat.slug}`}
                  className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
              <Link to="/admin" className="text-xs tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors">
                Admin
              </Link>
            </nav>

            <div className="flex items-center gap-3 lg:gap-5">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              <Link to="/cart" className="p-2 text-white/70 hover:text-white transition-colors relative">
                <ShoppingBag className="w-4 h-4" />
                {cartCount() > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[10px] font-bold rounded-full flex items-center justify-center">
                    {cartCount()}
                  </span>
                )}
              </Link>

              <Link to="/login" className="p-2 text-white/70 hover:text-white transition-colors hidden lg:block">
                <User className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 text-white/70 hover:text-white transition-colors lg:hidden"
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[#0a0a0a]/98 backdrop-blur-xl flex items-start justify-center pt-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setSearchOpen(false)}
              className="absolute top-6 right-6 p-2 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <form onSubmit={handleSearch} className="w-full max-w-2xl px-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full bg-transparent border-b-2 border-white/20 focus:border-white text-2xl lg:text-4xl font-light py-4 outline-none placeholder:text-white/20"
                autoFocus
              />
              <p className="text-white/40 text-xs mt-3 tracking-wider uppercase">
                Press Enter to search
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-[#0a0a0a]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <span className="text-lg font-bold tracking-[0.3em]">GHORAB</span>
              <button onClick={() => setMenuOpen(false)} className="p-2">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col p-8 gap-6">
              <Link to="/" className="text-2xl font-light tracking-wider" onClick={() => setMenuOpen(false)}>Home</Link>
              <Link to="/shop" className="text-2xl font-light tracking-wider" onClick={() => setMenuOpen(false)}>Shop All</Link>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/shop/${cat.slug}`}
                  className="text-2xl font-light tracking-wider text-white/70"
                  onClick={() => setMenuOpen(false)}
                >
                  {cat.name}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-6 mt-4 flex flex-col gap-4">
                <Link to="/cart" className="flex items-center gap-3 text-white/70" onClick={() => setMenuOpen(false)}>
                  <ShoppingBag className="w-5 h-5" /> Cart ({cartCount()})
                </Link>
                <Link to="/login" className="flex items-center gap-3 text-white/70" onClick={() => setMenuOpen(false)}>
                  <User className="w-5 h-5" /> Account
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
