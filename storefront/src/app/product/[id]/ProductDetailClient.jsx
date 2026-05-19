"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";
import {
  ArrowLeft,
  Star,
  Clock,
  Truck,
  MapPin,
  Heart,
  ChevronRight,
} from "lucide-react";

export default function ProductDetailClient({ id }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/v1/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data);
        }
        const relatedRes = await fetch(
          `http://localhost:5000/api/v1/products/${id}/related`,
        );
        if (relatedRes.ok) {
          const relatedData = await relatedRes.json();
          setRelatedProducts(relatedData);
        }
      } catch (e) {
        console.error("Failed to fetch product");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black animate-pulse">
        INITIATING ARCHITECTURAL RENDER...
      </div>
    );
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center font-black">
        PRODUCT NOT FOUND IN ECOSYSTEM.
      </div>
    );

  const isFavorited = isInWishlist(product.id || product._id);

  // Calculate delivery date (3 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const deliveryStr = deliveryDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

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
        <button
          onClick={() => toggleWishlist(product.id || product._id)}
          className={`p-2 rounded-full glass-morphism border border-white/10 hover:bg-white/10 transition-all ${isFavorited ? "text-rose-500" : "text-zinc-400"}`}
        >
          <Heart fill={isFavorited ? "currentColor" : "none"} size={24} />
        </button>
      </nav>

      <main className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Image Gallery */}
          <div className="space-y-6">
            <div className="aspect-square bg-zinc-100 dark:bg-zinc-900 rounded-[40px] flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-800 relative group">
              <div className="text-8xl font-black opacity-[0.03] dark:opacity-[0.07] select-none uppercase tracking-tighter">
                {product.name.split(" ")[0]}
              </div>
              {/* Placeholder for real images */}
              <div className="absolute inset-0 flex items-center justify-center text-zinc-400 font-medium">
                IMAGE {selectedImage + 1}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 scroll-bar-hide">
              {[1, 2, 3].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-24 h-24 rounded-2xl border-2 transition-all ${selectedImage === idx ? "border-primary scale-105" : "border-zinc-100 dark:border-zinc-800 opacity-50"}`}
                >
                  <div className="w-full h-full bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center text-[10px] font-bold text-zinc-400">
                    THUMB {idx + 1}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 ml-2">
                <Star size={16} fill="currentColor" />
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-zinc-500 text-xs ml-1 font-medium">
                  ({product.reviews || 0} reviews)
                </span>
              </div>
            </div>

            <h1 className="text-5xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-10">
              <div className="text-5xl font-black text-primary tracking-tighter">
                ${product.discountedPrice}
              </div>
              {product.mrp > product.discountedPrice && (
                <div className="text-xl text-zinc-400 line-through font-bold mb-1 decoration-rose-500/30">
                  ${product.mrp}
                </div>
              )}
            </div>

            <div className="space-y-8 mb-12">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  The Narrative
                </h3>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-3">
                  Architectural Specs
                </h3>
                <p className="text-zinc-500 dark:text-zinc-500 italic">
                  {product.details}
                </p>
              </div>
            </div>

            {/* Logistics Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] border border-zinc-100 dark:border-zinc-800 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-500">
                  <Clock size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Expiry Date
                  </h4>
                  <p className="font-bold">
                    {product.expiryDate
                      ? new Date(product.expiryDate).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-primary">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Expedited Delivery
                  </h4>
                  <p className="font-bold text-primary">By {deliveryStr}</p>
                </div>
              </div>

              <div className="md:col-span-2 pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-start gap-4">
                <div className="w-12 h-12 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500">
                  <MapPin size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    Shipping To
                  </h4>
                  <p className="font-bold">
                    789 Skyline Avenue, Digital District, Meta-City
                  </p>
                  <button className="text-[10px] font-black text-primary uppercase tracking-widest mt-1 hover:underline">
                    Change Address
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 py-5 bg-zinc-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-black/10 dark:shadow-white/10 uppercase tracking-widest text-sm">
                Add to Cart
              </button>
              <button className="flex-1 py-5 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] transition-all active:scale-95 shadow-xl shadow-primary/20 uppercase tracking-widest text-sm">
                Buy Instantly
              </button>
            </div>
          </div>
        </div>

        {/* Related Products - Horizontal Scroll */}
        <section className="mt-40">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-black tracking-tighter mb-2 italic">
                Similar Curations
              </h2>
              <p className="text-zinc-500 font-medium">
                Elevate your architectural ensemble.
              </p>
            </div>
            <Link
              href="/"
              className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:gap-3 transition-all"
            >
              <span>View All</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {relatedProducts.length === 0 ? (
            <div className="p-20 bg-zinc-50 dark:bg-zinc-900/50 rounded-[40px] text-center border border-dashed border-zinc-200 dark:border-zinc-800 text-zinc-500 font-medium">
              NO RELATED PIECES IN CURRENT COLLECTION.
            </div>
          ) : (
            <div className="flex gap-8 overflow-x-auto pb-10 scroll-mt-10 scroll-smooth snap-x scroll-bar-hide">
              {relatedProducts.map((related) => (
                <Link
                  key={related.id || related._id}
                  href={`/product/${related.id || related._id}`}
                  className="flex-shrink-0 w-[300px] group snap-start"
                >
                  <div className="aspect-[4/5] bg-zinc-50 dark:bg-zinc-900/50 rounded-[32px] mb-6 flex items-center justify-center relative overflow-hidden border border-zinc-100 dark:border-zinc-900/50 transition-all group-hover:shadow-2xl">
                    <div className="text-4xl font-black opacity-[0.03] dark:opacity-[0.07] select-none uppercase tracking-tighter">
                      {related.name.split(" ")[0]}
                    </div>
                  </div>
                  <h4 className="font-bold text-xl mb-1 group-hover:text-primary transition-colors">
                    {related.name}
                  </h4>
                  <div className="text-zinc-500 font-black tracking-tighter">
                    ${related.discountedPrice}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-20 px-6 text-center text-zinc-500 text-sm">
        <div className="text-2xl font-black text-zinc-900 dark:text-white mb-6 tracking-tighter">
          ANTIGRAVITY.
        </div>
        &copy; 2026 Antigravity E-commerce System. All rights reserved.
      </footer>
    </div>
  );
}
