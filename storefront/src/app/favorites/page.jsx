"use client";

import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from "lucide-react";

const ALL_PRODUCTS = [
  { id: "1", name: "Premium Hoodie", price: 299, category: "Apparel" },
  { id: "2", name: "Antigravity Sneakers", price: 599, category: "Footwear" },
  { id: "3", name: "Tech Backpack", price: 150, category: "Accessories" },
];

export default function FavoritesPage() {
  const { wishlist, toggleWishlist } = useWishlist();

  const favoriteProducts = ALL_PRODUCTS.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen bg-white dark:bg-black text-zinc-900 dark:text-zinc-100">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 glass-morphism border-b border-white/10 px-6 py-4 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold hover:text-primary transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Shop</span>
        </Link>
        <div className="text-xl font-black gradient-text tracking-tighter">
          ANTIGRAVITY.
        </div>
        <div className="w-10"></div> {/* Spacer */}
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter italic mb-4">
            Your Favorites
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Items you've curated for your next architectural addition.
          </p>
        </div>

        {favoriteProducts.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-[32px] flex items-center justify-center text-zinc-400 mb-6">
              <Heart size={40} />
            </div>
            <h2 className="text-2xl font-black mb-2">Nothing here yet.</h2>
            <p className="text-zinc-500 mb-8 max-w-sm">
              Start exploring our collections and add items to your wishlist to
              see them here.
            </p>
            <Link
              href="/"
              className="px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                className="group relative bg-white dark:bg-zinc-950 rounded-[40px] p-6 border border-zinc-100 dark:border-zinc-900 transition-all hover:shadow-2xl"
              >
                {/* Remove Button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-8 right-8 z-20 w-12 h-12 flex items-center justify-center rounded-full glass-morphism border border-white/10 hover:bg-rose-500/10 text-zinc-400 hover:text-rose-500 transition-all"
                  title="Remove from favorites"
                >
                  <Trash2 size={20} />
                </button>

                <Link
                  href={`/product/${product.id}`}
                  className="block relative"
                >
                  <div className="aspect-[4/5] bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] mb-8 flex items-center justify-center relative overflow-hidden">
                    <div className="text-6xl font-black opacity-[0.03] dark:opacity-[0.07] select-none uppercase tracking-tighter">
                      {product.name.split(" ")[0]}
                    </div>
                  </div>

                  <div className="flex flex-col items-start px-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-2">
                      {product.category}
                    </span>
                    <h3 className="font-bold text-2xl tracking-tight text-zinc-900 dark:text-zinc-100 mb-1">
                      {product.name}
                    </h3>
                    <div className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white">
                      ${product.price}
                    </div>
                  </div>
                </Link>

                <div className="mt-8 flex gap-4">
                  <button className="flex-1 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:bg-black dark:hover:bg-zinc-200 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShoppingCart size={16} />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-10 px-6 text-center text-zinc-500 text-sm">
        &copy; 2026 Antigravity E-commerce System. All rights reserved.
      </footer>
    </div>
  );
}
