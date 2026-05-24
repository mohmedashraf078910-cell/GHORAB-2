import { useState } from "react";
import { useParams, Link } from "react-router";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Truck, Shield, RotateCcw, ChevronRight, Star, Minus, Plus } from "lucide-react";
import { getProductBySlug, getRelatedProducts, reviews } from "@/lib/data";
import { useStore } from "@/store/useStore";
import ProductCard from "@/components/ProductCard";
import { toast } from "sonner";

export default function ProductDetail() {
  const { slug } = useParams();
  const product = getProductBySlug(slug || "");
  const { addToCart, toggleWishlist, isInWishlist } = useStore();

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"details" | "care" | "reviews">("details");

  if (!product) {
    return (
      <div className="pt-32 pb-20 px-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <Link to="/shop" className="text-white/60 hover:text-white underline">
          Back to Shop
        </Link>
      </div>
    );
  }

  const relatedProducts = getRelatedProducts(product.id, product.categoryId);
  const productReviews = reviews.filter((r) => r.productId === product.id);
  const inWishlist = isInWishlist(product.id);

  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <div className="pt-20 lg:pt-24">
      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-10 py-4 border-b border-white/5">
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Link to="/" className="hover:text-white transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/shop" className="hover:text-white transition-colors">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-white/60">{product.name}</span>
        </div>
      </div>

      {/* Product Main */}
      <div className="px-4 sm:px-6 lg:px-10 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="aspect-[3/4] bg-[#111] overflow-hidden">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col"
          >
            <div className="mb-6">
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">{product.category}</p>
              <h1 className="text-2xl lg:text-4xl font-bold tracking-tight mb-4">{product.name}</h1>

              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-white/20"}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-white/50">{product.rating} ({product.reviewCount} reviews)</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold">EGP {product.price.toLocaleString()}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-lg text-white/40 line-through">
                      EGP {product.compareAtPrice.toLocaleString()}
                    </span>
                    <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
            </div>

            <p className="text-sm text-white/50 leading-relaxed mb-8">{product.description}</p>

            {/* Size Selection */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs tracking-[0.2em] uppercase text-white/60">Size</span>
                {selectedSize && <span className="text-xs text-white/40">Selected: {selectedSize}</span>}
              </div>
              <div className="flex gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-[48px] h-12 px-4 border text-sm font-medium transition-all ${
                      selectedSize === size
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs tracking-[0.2em] uppercase text-white/60">Color</span>
                {selectedColor && <span className="text-xs text-white/40">{selectedColor}</span>}
              </div>
              <div className="flex gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-5 h-12 border text-sm transition-all ${
                      selectedColor === color
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex gap-3 mb-8">
              <div className="flex items-center border border-white/10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-14 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-14 flex items-center justify-center text-white/60 hover:text-white transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 h-14 bg-white text-black text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Cart
              </button>

              <button
                onClick={() => {
                  toggleWishlist(product.id);
                  toast(inWishlist ? "Removed from wishlist" : "Added to wishlist");
                }}
                className={`w-14 h-14 border flex items-center justify-center transition-all ${
                  inWishlist ? "border-red-600 bg-red-600/10 text-red-500" : "border-white/10 text-white/40 hover:border-white/30"
                }`}
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-white/5">
              {[
                { icon: Truck, label: "Free Shipping", desc: "Orders 3000+" },
                { icon: Shield, label: "Secure Payment", desc: "SSL Encrypted" },
                { icon: RotateCcw, label: "30-Day Returns", desc: "Easy exchange" },
              ].map((badge) => (
                <div key={badge.label} className="text-center">
                  <badge.icon className="w-5 h-5 mx-auto mb-2 text-white/40" />
                  <p className="text-[10px] font-medium tracking-wider uppercase">{badge.label}</p>
                  <p className="text-[10px] text-white/40">{badge.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 sm:px-6 lg:px-10 pb-16">
        <div className="flex gap-8 border-b border-white/10 mb-8">
          {(["details", "care", "reviews"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-xs tracking-[0.2em] uppercase transition-colors relative ${
                activeTab === tab ? "text-white" : "text-white/40 hover:text-white/70"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-px bg-white"
                  layoutId="activeTab"
                />
              )}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === "details" && (
            <div className="max-w-2xl">
              <p className="text-sm text-white/50 leading-relaxed mb-6">{product.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/[0.02] p-4">
                  <span className="text-[10px] tracking-wider uppercase text-white/40 block mb-1">Material</span>
                  <span className="text-sm">{product.material}</span>
                </div>
                <div className="bg-white/[0.02] p-4">
                  <span className="text-[10px] tracking-wider uppercase text-white/40 block mb-1">SKU</span>
                  <span className="text-sm">{product.sku}</span>
                </div>
                <div className="bg-white/[0.02] p-4">
                  <span className="text-[10px] tracking-wider uppercase text-white/40 block mb-1">Category</span>
                  <span className="text-sm">{product.category}</span>
                </div>
                <div className="bg-white/[0.02] p-4">
                  <span className="text-[10px] tracking-wider uppercase text-white/40 block mb-1">Stock</span>
                  <span className="text-sm">{product.inventory} units</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "care" && (
            <div className="max-w-2xl">
              <p className="text-sm text-white/50 leading-relaxed">{product.care}</p>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="max-w-2xl">
              {productReviews.length > 0 ? (
                <div className="space-y-6">
                  {productReviews.map((review) => (
                    <div key={review.id} className="border-b border-white/5 pb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{review.userName}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-white/20"}`}
                              />
                            ))}
                          </div>
                        </div>
                        {review.isVerified && (
                          <span className="ml-auto text-[10px] bg-green-600/20 text-green-400 px-2 py-0.5 tracking-wider uppercase">
                            Verified
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-medium mb-1">{review.title}</h4>
                      <p className="text-sm text-white/50">{review.body}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40">No reviews yet. Be the first to review this product.</p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="px-4 sm:px-6 lg:px-10 pb-20 border-t border-white/5 pt-16">
          <h2 className="text-2xl font-bold tracking-tight mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
