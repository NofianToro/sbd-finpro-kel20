"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Utensils, BarChart2, Settings, Star, TrendingUp, ShoppingBag, Heart } from "lucide-react";
import { getRestaurantOrders } from "@/api/restaurantApi";
import { getFoodsByRestaurant } from "@/api/foodApi";

interface Order {
  order_id: string;
  total_price: number | string;
  status: string;
  created_at: string;
  items?: { food_name: string; quantity: number; price: number }[];
}

interface Food {
  food_id: string;
  food_name: string;
  url_img: string;
  price: number | string;
  total_likes: number;
  stok: number;
  category: string;
}

interface Stats {
  totalOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalMenuItems: number;
  totalLikes: number;
  avgOrderValue: number;
}

// Helper: format compact number
const fmt = (n: number) =>
  n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : String(n);

export default function RestaurantStatistics() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<{ restaurant_id?: string; display_name?: string; username?: string; url_img?: string } | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Auth guard
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("restaurant_token");
    if (!token) { router.push("/partner-login"); return; }
    const stored = localStorage.getItem("restaurant");
    if (stored) setRestaurant(JSON.parse(stored));
  }, [router]);

  const fetchData = useCallback(async () => {
    if (!restaurant?.restaurant_id) return;
    setLoading(true);
    try {
      const [ordersRes, foodsRes] = await Promise.all([
        getRestaurantOrders(restaurant.restaurant_id),
        getFoodsByRestaurant(restaurant.restaurant_id),
      ]);
      if (ordersRes.success && ordersRes.data) setOrders(ordersRes.data);
      if (foodsRes.success && foodsRes.data) setFoods(foodsRes.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    } finally {
      setLoading(false);
    }
  }, [restaurant?.restaurant_id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Derive statistics
  const stats: Stats = {
    totalOrders: orders.length,
    completedOrders: orders.filter(o => o.status === "done").length,
    totalRevenue: orders
      .filter(o => o.status === "done")
      .reduce((sum, o) => sum + Number(o.total_price ?? 0), 0),
    totalMenuItems: foods.length,
    totalLikes: foods.reduce((sum, f) => sum + Number(f.total_likes ?? 0), 0),
    avgOrderValue: orders.filter(o => o.status === "done").length > 0
      ? orders.filter(o => o.status === "done").reduce((sum, o) => sum + Number(o.total_price ?? 0), 0) /
        orders.filter(o => o.status === "done").length
      : 0,
  };

  // Top foods by likes
  const topFoods = [...foods]
    .sort((a, b) => Number(b.total_likes) - Number(a.total_likes))
    .slice(0, 5);

  // Orders by status breakdown
  const statusBreakdown = [
    { label: "New Orders", key: "ordered", color: "bg-red-500" },
    { label: "Cooking", key: "processing", color: "bg-orange-500" },
    { label: "On Delivery", key: "delivery", color: "bg-blue-500" },
    { label: "Completed", key: "done", color: "bg-green-500" },
  ].map(s => ({ ...s, count: orders.filter(o => o.status === s.key).length }));

  const displayName = restaurant?.display_name || restaurant?.username || "Loading...";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "R";

  const handleLogout = () => {
    localStorage.removeItem("restaurant_token");
    localStorage.removeItem("restaurant");
    router.push("/partner-login");
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans overflow-hidden">

      {/* TOP HEADER */}
      <header className="h-[80px] bg-[#2D2D2D] text-white flex justify-between items-center px-8 shrink-0 z-50">
        <div className="flex items-center">
          <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="flex space-x-8 text-lg">
          <Link href="/explore" className="hover:text-gray-300">Explore</Link>
          <Link href="/homepage" className="hover:text-gray-300">Home</Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-[280px] bg-[#1C1C1C] text-white flex flex-col shrink-0 z-20">
          <div className="px-6 py-10 border-b border-gray-800 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-700 bg-gray-800 shadow-md flex items-center justify-center">
              {restaurant?.url_img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={restaurant.url_img} alt="Restaurant" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-500">{avatarLetter}</span>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-1">{displayName}</h2>
            <p className="text-sm text-gray-400">Partner Dashboard</p>
          </div>

          <nav className="flex-1 px-4 space-y-2 pt-4">
            <Link href="/partner-dashboard" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Package className="mr-3 w-5 h-5" /> Orders
            </Link>
            <Link href="/partner-menu" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Utensils className="mr-3 w-5 h-5" /> Menu Management
            </Link>
            <Link href="/partner-statistics" className="flex items-center px-4 py-3 rounded-xl bg-red-900/20 text-[#C62828] font-bold">
              <BarChart2 className="mr-3 w-5 h-5" /> Statistics
            </Link>
            <Link href="/partner-profile" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Settings className="mr-3 w-5 h-5" /> Settings
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button onClick={handleLogout} className="w-full flex justify-center items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              Log Out
            </button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 overflow-y-auto flex flex-col">

          {/* TOPBAR */}
          <header className="h-[80px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <div>
              <h1 className="text-2xl font-bold text-[#1C1C1C]">Statistics</h1>
              <span className="text-xs text-gray-400">統計情報</span>
            </div>
            <button onClick={fetchData} className="text-sm text-gray-500 hover:text-[#C62828] font-medium transition-colors">
              ↻ Refresh
            </button>
          </header>

          <div className="flex-1 p-8 space-y-6">

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "Total Orders", value: loading ? "..." : stats.totalOrders, icon: <ShoppingBag className="w-6 h-6" />, color: "bg-red-50 text-[#C62828]", sub: `${stats.completedOrders} completed` },
                { label: "Total Revenue", value: loading ? "..." : `Rp ${fmt(stats.totalRevenue)}`, icon: <TrendingUp className="w-6 h-6" />, color: "bg-green-50 text-green-600", sub: `Avg Rp ${fmt(Math.round(stats.avgOrderValue))} / order` },
                { label: "Menu Items", value: loading ? "..." : stats.totalMenuItems, icon: <Utensils className="w-6 h-6" />, color: "bg-orange-50 text-orange-500", sub: "Active items" },
                { label: "Total Likes", value: loading ? "..." : fmt(stats.totalLikes), icon: <Heart className="w-6 h-6" />, color: "bg-pink-50 text-pink-500", sub: "Across all menu items" },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col gap-3"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                    {card.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{card.label}</p>
                    <p className="text-3xl font-bold text-[#1C1C1C] mt-1">{card.value}</p>
                    <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* MIDDLE: Status Breakdown + Top Foods */}
            <div className="flex flex-col lg:flex-row gap-6">

              {/* Order Status Breakdown */}
              <motion.div
                className="lg:w-2/5 bg-white rounded-xl border border-gray-100 shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              >
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-6">Order Status Breakdown</h2>
                {loading ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : orders.length === 0 ? (
                  <p className="text-gray-400 text-sm">No orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {statusBreakdown.map((s) => {
                      const pct = orders.length > 0 ? Math.round((s.count / orders.length) * 100) : 0;
                      return (
                        <div key={s.key}>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-gray-700">{s.label}</span>
                            <span className="text-sm font-bold text-gray-500">{s.count} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5">
                            <div
                              className={`${s.color} h-2.5 rounded-full transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-xs text-gray-400 pt-2">{orders.length} total orders tracked</p>
                  </div>
                )}
              </motion.div>

              {/* Top Foods by Likes */}
              <motion.div
                className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm p-6"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              >
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-6">Top Menu Items by Likes</h2>
                {loading ? (
                  <p className="text-gray-400 text-sm">Loading...</p>
                ) : topFoods.length === 0 ? (
                  <p className="text-gray-400 text-sm">No menu items yet.</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    {topFoods.map((food, idx) => (
                      <div key={food.food_id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <span className="w-6 text-center font-bold text-gray-300 text-lg">{idx + 1}</span>
                        {food.url_img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={food.url_img} alt={food.food_name} className="w-[48px] h-[48px] rounded-lg object-cover shadow-sm shrink-0" />
                        ) : (
                          <div className="w-[48px] h-[48px] rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                            <Utensils className="w-5 h-5 text-gray-300" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1C1C1C] truncate">{food.food_name}</h4>
                          <p className="text-xs text-gray-400">{food.category} · Rp {Number(food.price).toLocaleString("id-ID")}</p>
                        </div>
                        <div className="flex items-center gap-1 text-pink-500 shrink-0">
                          <Heart className="w-4 h-4 fill-current" />
                          <span className="text-sm font-bold">{food.total_likes ?? 0}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </div>

            {/* BOTTOM: All Orders Table */}
            <motion.div
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-[#1C1C1C]">All Orders</h2>
                <span className="text-sm text-gray-400">{orders.length} total</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Order ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Revenue</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">Loading orders...</td></tr>
                    ) : orders.length === 0 ? (
                      <tr><td colSpan={4} className="px-6 py-10 text-center text-gray-400">No orders yet.</td></tr>
                    ) : orders.slice().reverse().map((order) => {
                      const statusStyles: Record<string, string> = {
                        ordered: "bg-red-100 text-red-700",
                        processing: "bg-orange-100 text-orange-700",
                        delivery: "bg-blue-100 text-blue-700",
                        done: "bg-green-100 text-green-700",
                      };
                      return (
                        <tr key={order.order_id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-[#1C1C1C] text-sm">#{order.order_id}</td>
                          <td className="px-6 py-4 font-bold text-[#1C1C1C]">
                            Rp {Number(order.total_price ?? 0).toLocaleString("id-ID")}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${statusStyles[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-400 text-right">
                            {order.created_at
                              ? new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                              : "--"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>

          {/* Footer */}
          <footer className="bg-[#2D2D2D] text-white py-6 px-8 flex justify-between text-sm shrink-0 mt-auto">
            <div>
              <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={100} height={34} className="object-contain" />
              <p className="text-xs text-gray-400 mt-1">© 2026 Kelompok Sembilan Belas.</p>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-xs">
              <Link href="/" className="hover:text-white">Help</Link>
              <Link href="/" className="hover:text-white">Privacy</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}