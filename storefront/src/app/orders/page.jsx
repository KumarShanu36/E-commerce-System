"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  ExternalLink,
} from "lucide-react";
import { API_URL } from "@/config";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd get the userId from a session
    const mockUserId = "69fc8f6e874343fafbaebec2";
    const fetchOrders = async () => {
      try {
        const res = await fetch(
          `${API_URL}/api/v1/orders/user/${mockUserId}`,
        );
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (e) {
        console.error("Failed to fetch orders");
      } finally {
        setIsLoading(false);
      }
    };

    // For demonstration, if API fails or is empty, use mock data
    fetchOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "SHIPPED":
        return <Truck className="text-indigo-500" size={18} />;
      default:
        return <Clock className="text-amber-500" size={18} />;
    }
  };

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
        <div className="w-10"></div>
      </nav>

      <main className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter italic mb-4">
            Order History
          </h1>
          <p className="text-zinc-500 font-medium text-lg">
            Track your architectural acquisitions.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-zinc-50 dark:bg-zinc-900/50 animate-pulse rounded-[32px]"
              ></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="h-[50vh] flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-zinc-100 dark:bg-zinc-900 rounded-[32px] flex items-center justify-center text-zinc-400 mb-6">
              <Package size={40} />
            </div>
            <h2 className="text-2xl font-black mb-2">No orders yet.</h2>
            <p className="text-zinc-500 mb-8 max-w-sm">
              Your acquisition history will appear here once you make your first
              purchase.
            </p>
            <Link
              href="/"
              className="px-10 py-4 bg-zinc-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white dark:bg-zinc-950 rounded-[32px] p-8 border border-zinc-100 dark:border-zinc-900 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                      Order Identifier
                    </span>
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      {order.id}
                      <ExternalLink
                        size={14}
                        className="text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                      Acquisition Date
                    </span>
                    <p className="font-bold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-6">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                        Logistics Status
                      </span>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span className="font-black text-xs uppercase tracking-widest">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-1">
                        Investment
                      </span>
                      <p className="font-black text-primary">
                        ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <button className="px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs font-black uppercase tracking-widest hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
                    View Details
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
