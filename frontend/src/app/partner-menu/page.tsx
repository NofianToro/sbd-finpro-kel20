"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Utensils, BarChart2, Settings, Plus, Search, Minus, Heart } from "lucide-react";
import { getFoodsByRestaurant, createFood, updateFoodStock } from "@/api/foodApi";

interface Food {
  food_id: string;
  food_name: string;
  url_img: string;
  price: number | string;
  category: string;
  description: string;
  total_likes: number;
  stok: number;
}

const EMPTY_FORM = {
  food_name: "",
  url_img: "",
  price: "",
  category: "Sushi",
  description: "",
  stok: "10",
};

const CATEGORIES = ["Sushi", "Bento", "Ramen", "Side Dish", "Dessert", "Donburi", "Drinks", "Other"];

export default function RestaurantFoodManagement() {
  const router = useRouter();
  const [foods, setFoods] = useState<Food[]>([]);
  const [restaurant, setRestaurant] = useState<{ restaurant_id?: string; display_name?: string; username?: string; url_img?: string } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [stockLoading, setStockLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Auth guard + load restaurant
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("restaurant_token");
    if (!token) { router.push("/partner-login"); return; }
    const stored = localStorage.getItem("restaurant");
    if (stored) setRestaurant(JSON.parse(stored));
  }, [router]);

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) +
          " | " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch foods
  const fetchFoods = useCallback(async () => {
    if (!restaurant?.restaurant_id) return;
    setLoading(true);
    try {
      const res = await getFoodsByRestaurant(restaurant.restaurant_id);
      if (res.success && res.data) {
        setFoods(res.data);
      }
    } catch (err) {
      console.error("Failed to fetch foods:", err);
    } finally {
      setLoading(false);
    }
  }, [restaurant?.restaurant_id]);

  useEffect(() => { fetchFoods(); }, [fetchFoods]);

  // Stock adjustment — backend uses delta (+/-)
  const handleStockChange = async (food_id: string, delta: number) => {
    setStockLoading(food_id);
    try {
      const res = await updateFoodStock(food_id, delta);
      if (res.success) {
        setFoods((prev) =>
          prev.map((f) =>
            f.food_id === food_id ? { ...f, stok: Math.max(0, Number(f.stok) + delta) } : f
          )
        );
      } else {
        showToast(res.message || "Failed to update stock.", "error");
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "Stock update failed.", "error");
    } finally {
      setStockLoading(null);
    }
  };

  // Create food
  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant?.restaurant_id) return;
    setSubmitting(true);
    try {
      const res = await createFood({
        restaurant_id: restaurant.restaurant_id,
        food_name: form.food_name,
        url_img: form.url_img,
        price: Number(form.price),
        category: form.category,
        description: form.description,
        stok: Number(form.stok),
      });
      if (res.success) {
        showToast("Food item added successfully!", "success");
        setIsModalOpen(false);
        setForm(EMPTY_FORM);
        fetchFoods();
      } else {
        showToast(res.message || "Failed to add food.", "error");
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || "An error occurred.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("restaurant_token");
    localStorage.removeItem("restaurant");
    router.push("/partner-login");
  };

  const filteredFoods = foods.filter(
    (f) =>
      f.food_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayName = restaurant?.display_name || restaurant?.username || "Loading...";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "R";

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans relative overflow-hidden">

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
        <aside className="w-[280px] bg-[#1C1C1C] text-white flex flex-col shrink-0 relative z-20">
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
            <Link href="/partner-menu" className="flex items-center px-4 py-3 rounded-xl bg-red-900/20 text-[#C62828] font-bold">
              <Utensils className="mr-3 w-5 h-5" /> Menu Management
            </Link>
            <Link href="/partner-statistics" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <BarChart2 className="mr-3 w-5 h-5" /> Statistics
            </Link>
            <Link href="/partner-profile" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Settings className="mr-3 w-5 h-5" /> Settings
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">

          {/* TOPBAR */}
          <header className="h-[80px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <span className="text-sm font-semibold text-gray-600">{currentTime || "Loading time..."}</span>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">
                {loading ? "Loading menu..." : `${foods.length} items`}
              </span>
            </div>
          </header>

          {/* CONTENT */}
          <div className="flex-1 p-8 flex flex-col overflow-hidden">

            <div className="mb-6 shrink-0 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-[#1C1C1C] mb-1">Menu Management</h1>
                <span className="text-gray-500 text-sm font-medium">メニュー管理</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search food or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828] w-56 text-sm text-black"
                  />
                </div>
                <button
                  onClick={() => { setForm(EMPTY_FORM); setIsModalOpen(true); }}
                  className="flex items-center gap-2 bg-[#C62828] hover:bg-red-800 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Food
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-200">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Menu Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Likes</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b text-center">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">Loading menu...</td>
                    </tr>
                  ) : filteredFoods.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                        {searchTerm ? "No items match your search." : "No food items yet. Add your first item!"}
                      </td>
                    </tr>
                  ) : filteredFoods.map((food) => (
                    <tr key={food.food_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {food.url_img ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={food.url_img} alt={food.food_name} className="w-[56px] h-[56px] rounded-lg object-cover shadow-sm shrink-0" />
                          ) : (
                            <div className="w-[56px] h-[56px] rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <Utensils className="w-6 h-6 text-gray-300" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-[#1C1C1C]">{food.food_name}</p>
                            <p className="text-xs text-gray-500 mt-0.5 max-w-[220px] truncate">{food.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{food.category}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#1C1C1C]">
                        Rp {Number(food.price).toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                          <span className="text-sm font-bold">{food.total_likes ?? 0}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button
                            onClick={() => handleStockChange(food.food_id, -1)}
                            disabled={stockLoading === food.food_id || Number(food.stok) <= 0}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`font-bold w-8 text-center ${Number(food.stok) === 0 ? "text-red-500" : "text-[#1C1C1C]"}`}>
                            {stockLoading === food.food_id ? "..." : food.stok}
                          </span>
                          <button
                            onClick={() => handleStockChange(food.food_id, 1)}
                            disabled={stockLoading === food.food_id}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors disabled:opacity-40"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-[#2D2D2D] text-white py-6 px-8 flex justify-between text-sm shrink-0">
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

      {/* ADD FOOD MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[520px] z-[70] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-[#1C1C1C]">Add New Food</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 text-xl transition-colors">&times;</button>
              </div>

              <form onSubmit={handleAddFood} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Food Name *</label>
                  <input
                    type="text" required
                    value={form.food_name}
                    onChange={(e) => setForm(f => ({ ...f, food_name: e.target.value }))}
                    placeholder="e.g. Tuna Sashimi"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Image URL</label>
                  <input
                    type="url"
                    value={form.url_img}
                    onChange={(e) => setForm(f => ({ ...f, url_img: e.target.value }))}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C62828]"
                  />
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-bold text-gray-700">Category *</label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) => setForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C62828]"
                    >
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-bold text-gray-700">Price (Rp) *</label>
                    <input
                      type="number" required min="0"
                      value={form.price}
                      onChange={(e) => setForm(f => ({ ...f, price: e.target.value }))}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C62828]"
                    />
                  </div>
                  <div className="flex flex-col gap-1 w-[80px]">
                    <label className="text-xs font-bold text-gray-700">Stock *</label>
                    <input
                      type="number" required min="0"
                      value={form.stok}
                      onChange={(e) => setForm(f => ({ ...f, stok: e.target.value }))}
                      placeholder="0"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C62828]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="Briefly describe the food..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-[#C62828] resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-lg font-bold bg-[#C62828] text-white hover:bg-red-800 transition-colors shadow-sm text-sm disabled:opacity-60"
                  >
                    {submitting ? "Saving..." : "Save Food"}
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 text-white font-bold z-[80] ${
          toast.type === "success" ? "bg-[#1C1C1C]" : "bg-red-700"
        }`}>
          <span className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-green-400" : "bg-red-300"}`} />
          {toast.message}
        </div>
      )}
    </div>
  );
}