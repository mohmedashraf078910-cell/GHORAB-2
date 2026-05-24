import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/lib/data";

export interface CartItem {
  id: string;
  productId: number;
  quantity: number;
  size: string;
  color: string;
  product: Product;
}

interface StoreState {
  cart: CartItem[];
  wishlist: number[];
  addToCart: (product: Product, size: string, color: string, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  cartTotal: () => number;
  cartCount: () => number;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isSearchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (v: boolean) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      wishlist: [],

      addToCart: (product, size, color, qty = 1) => {
        const id = `${product.id}-${size}-${color}`;
        const existing = get().cart.find((i) => i.id === id);
        if (existing) {
          set({
            cart: get().cart.map((i) =>
              i.id === id ? { ...i, quantity: i.quantity + qty } : i
            ),
          });
        } else {
          set({ cart: [...get().cart, { id, productId: product.id, quantity: qty, size, color, product }] });
        }
      },

      removeFromCart: (id) => set({ cart: get().cart.filter((i) => i.id !== id) }),

      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          set({ cart: get().cart.filter((i) => i.id !== id) });
        } else {
          set({
            cart: get().cart.map((i) =>
              i.id === id ? { ...i, quantity } : i
            ),
          });
        }
      },

      clearCart: () => set({ cart: [] }),

      toggleWishlist: (productId) => {
        const current = get().wishlist;
        if (current.includes(productId)) {
          set({ wishlist: current.filter((id) => id !== productId) });
        } else {
          set({ wishlist: [...current, productId] });
        }
      },

      isInWishlist: (productId) => get().wishlist.includes(productId),

      cartTotal: () =>
        get().cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),

      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

      searchQuery: "",
      setSearchQuery: (q) => set({ searchQuery: q }),

      isSearchOpen: false,
      setSearchOpen: (v) => set({ isSearchOpen: v }),

      mobileMenuOpen: false,
      setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
    }),
    { name: "ghorab-store" }
  )
);
