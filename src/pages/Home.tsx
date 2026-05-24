import { Link } from "react-router";
import { motion } from "framer-motion";
import { ArrowRight, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { products, categories } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

const staggerContainer = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.1 } },
  viewport: { once: true },
};

export default function Home() {
  const featuredProducts = products.filter((p) => p.isFeatured);
  const newArrivals = products.filter((p) => p.isNewArrival);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/hero-jacket.jpg"
            alt="GHORAB Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/80 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full flex flex-col justify-end pb-20 lg:pb-32 px-6 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-2xl"
          >
            <p className="text-xs tracking-[0.4em] uppercase text-white/50 mb-4">
              Cairo &middot; 2026 Collection
            </p>
            <h1 className="text-5xl lg:text-8xl font-bold tracking-tight leading-[0.9] mb-6">
              BEYOND<br />BOUNDARIES
            </h1>
            <p className="text-base lg:text-lg text-white/60 leading-relaxed mb-8 max-w-md">
              Luxury streetwear crafted for the underground. Each piece tells a story of rebellion, refined.
            </p>
            <div className="flex gap-4">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-white text-black px-8 py-3.5 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/90 transition-colors"
              >
                Shop Now <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/product/shadow-bomber-jacket"
                className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-3.5 text-xs tracking-[0.2em] uppercase hover:border-white/40 transition-colors"
              >
                View Lookbook
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-10">
        <motion.div className="mb-12 lg:mb-16" {...fadeInUp}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">Curated Selection</p>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Featured</h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {featuredProducts.map((product, i) => (
            <motion.div key={product.id} variants={fadeInUp} transition={{ delay: i * 0.1 }}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-10 bg-[#080808]">
        <motion.div className="mb-12 lg:mb-16" {...fadeInUp}>
          <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">Browse By</p>
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">Categories</h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Link to={`/shop/${cat.slug}`} className="group relative block aspect-[3/4] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-end p-5 lg:p-6">
                  <h3 className="text-lg lg:text-xl font-semibold tracking-wide">{cat.name}</h3>
                  <p className="text-xs text-white/60 mt-1">{cat.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
          <motion.div {...fadeInUp}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src="/product-tee-1.jpg"
                alt="GHORAB Craftsmanship"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
            </div>
          </motion.div>

          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">Our Story</p>
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6">
              Born in the<br />Underground
            </h2>
            <div className="space-y-4 text-white/50 leading-relaxed">
              <p>
                GHORAB was founded in Cairo with a singular vision: to create luxury streetwear that speaks to the rebels, the creatives, and the ones who refuse to conform.
              </p>
              <p>
                Each piece is meticulously crafted using premium materials sourced from the finest mills. We combine traditional Egyptian craftsmanship with cutting-edge design, creating garments that are as durable as they are distinctive.
              </p>
              <p>
                Our name — meaning "raven" — symbolizes intelligence, adaptability, and the freedom to exist beyond boundaries. This is more than clothing. It's a movement.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-8 mt-10 pt-10 border-t border-white/10">
              <div>
                <p className="text-2xl lg:text-3xl font-bold">2.5K+</p>
                <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Orders</p>
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold">15+</p>
                <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Countries</p>
              </div>
              <div>
                <p className="text-2xl lg:text-3xl font-bold">4.8</p>
                <p className="text-xs text-white/40 mt-1 uppercase tracking-wider">Rating</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20 lg:py-32 px-4 sm:px-6 lg:px-10 bg-[#080808]">
        <motion.div className="mb-12 lg:mb-16" {...fadeInUp}>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">Just Dropped</p>
              <h2 className="text-3xl lg:text-5xl font-bold tracking-tight">New Arrivals</h2>
            </div>
            <Link
              to="/shop"
              className="hidden sm:inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {newArrivals.map((product, i) => (
            <motion.div key={product.id} variants={fadeInUp} transition={{ delay: i * 0.1 }}>
              <ProductCard product={product} showNewBadge />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust Badges */}
      <section className="py-16 lg:py-24 px-4 sm:px-6 lg:px-10 border-t border-white/5">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 max-w-5xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true }}
        >
          {[
            { icon: Truck, title: "Free Shipping", desc: "On orders over EGP 3000" },
            { icon: Shield, title: "Secure Payment", desc: "Encrypted transactions" },
            { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy" },
            { icon: Star, title: "Premium Quality", desc: "Handcrafted garments" },
          ].map((badge, i) => (
            <motion.div key={badge.title} className="text-center" variants={fadeInUp}>
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center mx-auto mb-4">
                <badge.icon className="w-5 h-5 text-white/60" />
              </div>
              <h4 className="text-sm font-semibold mb-1">{badge.title}</h4>
              <p className="text-xs text-white/40">{badge.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
