import { useState, useMemo } from "react";
import { useParams, useSearchParams } from "react-router";
import { motion } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { products, categories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";

type SortOption = "newest" | "price-low" | "price-high" | "popular";

export default function Shop() {
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(category || "all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [showFilters, setShowFilters] = useState(false);

  const activeCategory = category || selectedCategory;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (activeCategory && activeCategory !== "all") {
      const cat = categories.find((c) => c.slug === activeCategory);
      if (cat) {
        result = result.filter((p) => p.categoryId === cat.id);
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    result = result.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [activeCategory, searchQuery, sortBy, priceRange]);

  const pageTitle = searchQuery
    ? `Search: "${searchQuery}"`
    : category
      ? categories.find((c) => c.slug === category)?.name || "Shop"
      : "All Products";

  return (
    <div className="pt-24 lg:pt-32 pb-20 px-4 sm:px-6 lg:px-10">
      {/* Header */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-2">
          {filteredProducts.length} Products
        </p>
        <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">{pageTitle}</h1>
      </motion.div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategory("all")}
            className={`text-xs tracking-[0.15em] uppercase whitespace-nowrap px-4 py-2 border transition-colors ${
              activeCategory === "all"
                ? "border-white text-white"
                : "border-white/10 text-white/40 hover:border-white/30"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`text-xs tracking-[0.15em] uppercase whitespace-nowrap px-4 py-2 border transition-colors ${
                activeCategory === cat.slug
                  ? "border-white text-white"
                  : "border-white/10 text-white/40 hover:border-white/30"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-white/60 hover:text-white transition-colors px-4 py-2 border border-white/10">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Filter
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 bg-[#0a0a0a] border-l border-white/10 p-6">
              <SheetTitle className="text-lg font-semibold mb-6">Filters</SheetTitle>

              <div className="mb-8">
                <h4 className="text-xs tracking-[0.2em] uppercase text-white/60 mb-4">Price Range</h4>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/30"
                    placeholder="Min"
                  />
                  <span className="text-white/40">-</span>
                  <input
                    type="number"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full bg-white/5 border border-white/10 px-3 py-2 text-sm outline-none focus:border-white/30"
                    placeholder="Max"
                  />
                </div>
              </div>

              <div className="mb-8">
                <h4 className="text-xs tracking-[0.2em] uppercase text-white/60 mb-4">Categories</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`block text-sm w-full text-left py-2 transition-colors ${
                        activeCategory === cat.slug ? "text-white" : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSelectedCategory("all");
                }}
                className="w-full py-3 border border-white/20 text-xs tracking-[0.2em] uppercase hover:bg-white/5 transition-colors"
              >
                Reset Filters
              </button>
            </SheetContent>
          </Sheet>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-transparent border border-white/10 text-xs tracking-[0.15em] uppercase text-white/60 px-4 py-2 pr-10 outline-none focus:border-white/30 cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/40" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20">
          <p className="text-white/40 text-lg mb-2">No products found</p>
          <p className="text-white/20 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
