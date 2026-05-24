import { Link } from "react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "lucide-react";
import { useStore } from "@/store/useStore";
import type { Product } from "@/lib/data";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  showNewBadge?: boolean;
}

export default function ProductCard({ product, showNewBadge }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[0] || "M";
    const defaultColor = product.colors[0] || "Black";
    addToCart(product, defaultSize, defaultColor, 1);
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
    toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
  };

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <Link to={`/product/${product.slug}`} className="group block">
      <motion.div
        className="relative aspect-[3/4] overflow-hidden bg-[#111] mb-4"
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {showNewBadge && product.isNewArrival && (
            <span className="bg-white text-black text-[10px] font-bold tracking-wider uppercase px-2.5 py-1">
              New
            </span>
          )}
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleWishlist}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
              inWishlist ? "bg-red-600 text-white" : "bg-white/10 backdrop-blur-sm text-white hover:bg-white/20"
            }`}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleQuickAdd}
            className="w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <div className="space-y-1.5">
        <h3 className="text-sm font-medium truncate group-hover:text-white/80 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">EGP {product.price.toLocaleString()}</span>
          {product.compareAtPrice && (
            <span className="text-xs text-white/40 line-through">
              EGP {product.compareAtPrice.toLocaleString()}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? "text-yellow-500" : "text-white/20"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-[10px] text-white/40 ml-1">({product.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
