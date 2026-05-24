import { Link } from "react-router";
import { Instagram, Twitter, Youtube, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#060606] border-t border-white/5">
      <div className="w-full px-4 sm:px-6 lg:px-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-1">
            <Link to="/" className="text-2xl font-bold tracking-[0.3em] uppercase block mb-6">
              GHORAB
            </Link>
            <p className="text-sm text-white/40 leading-relaxed max-w-xs">
              Luxury streetwear born in Cairo. Crafted with intention, designed for those who move differently.
            </p>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/60 mb-6">Shop</h4>
            <ul className="space-y-3">
              {["Outerwear", "Tops", "Bottoms", "Accessories"].map((item) => (
                <li key={item}>
                  <Link
                    to={`/shop/${item.toLowerCase()}`}
                    className="text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/60 mb-6">Brand</h4>
            <ul className="space-y-3">
              {["About", "Lookbook", "Careers", "Contact"].map((item) => (
                <li key={item}>
                  <button className="text-sm text-white/40 hover:text-white transition-colors">
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-white/60 mb-6">Connect</h4>
            <div className="flex gap-4 mb-6">
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
            <p className="text-xs text-white/30">
              Subscribe for exclusive drops and early access.
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/30">
            &copy; 2026 GHORAB. All rights reserved.
          </p>
          <div className="flex gap-6">
            <button className="text-xs text-white/30 hover:text-white/60 transition-colors">Privacy</button>
            <button className="text-xs text-white/30 hover:text-white/60 transition-colors">Terms</button>
            <button className="text-xs text-white/30 hover:text-white/60 transition-colors">Shipping</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
