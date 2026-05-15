"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Utensils, BarChart2, Settings, Bell, Plus, Search, Edit2, Trash2, Minus, Heart } from "lucide-react";

interface Food {
  food_id: string;
  food_name: string;
  url_img: string;
  price: string;
  category: string;
  description: string;
  total_likes: number;
  stok: number;
}

const initialFoods: Food[] = [
  {
    food_id: "F-001",
    food_name: "Salmon Sashimi",
    url_img: "https://images.unsplash.com/photo-1579584425555-c3ce17f6a08c?q=80&w=200&auto=format&fit=crop",
    price: "120000",
    category: "Sushi",
    description: "Fresh premium salmon sashimi served with soy sauce and wasabi.",
    total_likes: 245,
    stok: 12
  },
  {
    food_id: "F-002",
    food_name: "Chicken Teriyaki Bento",
    url_img: "https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?q=80&w=200&auto=format&fit=crop",
    price: "65000",
    category: "Bento",
    description: "Grilled chicken with teriyaki sauce, rice, and side salad.",
    total_likes: 189,
    stok: 25
  },
  {
    food_id: "F-003",
    food_name: "Ebi Furai",
    url_img: "https://images.unsplash.com/photo-1615361200141-f45040f367be?q=80&w=200&auto=format&fit=crop",
    price: "45000",
    category: "Side Dish",
    description: "Crispy deep-fried breaded shrimp.",
    total_likes: 156,
    stok: 30
  },
  {
    food_id: "F-004",
    food_name: "Matcha Ice Cream",
    url_img: "https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?q=80&w=200&auto=format&fit=crop",
    price: "35000",
    category: "Dessert",
    description: "Authentic Japanese green tea ice cream.",
    total_likes: 312,
    stok: 50
  },
  {
    food_id: "F-005",
    food_name: "Spicy Tuna Roll",
    url_img: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=200&auto=format&fit=crop",
    price: "85000",
    category: "Sushi",
    description: "Spicy minced tuna rolled with rice and seaweed.",
    total_likes: 278,
    stok: 15
  },
  {
    food_id: "F-006",
    food_name: "Unagi Don",
    url_img: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=200&auto=format&fit=crop",
    price: "150000",
    category: "Donburi",
    description: "Grilled eel over a bed of steamed rice with sweet soy sauce.",
    total_likes: 420,
    stok: 8
  }
];

export default function RestaurantFoodManagement() {
  const [foods, setFoods] = useState<Food[]>(initialFoods);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", { 
          weekday: "long", month: "short", day: "numeric" 
        }) + " | " + 
        now.toLocaleTimeString("en-US", { 
          hour: "2-digit", minute: "2-digit" 
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleStockChange = (id: string, delta: number) => {
    setFoods((prev) => 
      prev.map(food => {
        if (food.food_id === id) {
          const newStock = Math.max(0, food.stok + delta);
          return { ...food, stok: newStock };
        }
        return food;
      })
    );
  };

  const filteredFoods = foods.filter(food => 
    food.food_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    food.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans relative shadow-2xl overflow-hidden">
      
      {/* 1. TOP HEADER (From Homepage) */}
      <header className="h-[80px] bg-[#2D2D2D] text-white flex justify-between items-center px-8 shrink-0 z-50">
        <div className="flex items-center">
          <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="flex space-x-8 text-lg">
          <Link href="/explore" className="hover:text-gray-300">Explore</Link>
          <Link href="/favorites" className="hover:text-gray-300">Favorites</Link>
          <Link href="/orders" className="hover:text-gray-300">Orders</Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-[280px] bg-[#1C1C1C] text-white flex flex-col shrink-0 relative z-20">
          <div className="px-6 py-10 border-b border-gray-800 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-700 bg-gray-800 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=200&auto=format&fit=crop" alt="Kura Sushi Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-2xl font-bold mb-1">Kura Sushi</h2>
            <p className="text-sm text-gray-400">Partner Dashboard</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link href="/partner-dashboard" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Package className="mr-3 w-5 h-5" /> Orders
            </Link>
            <Link href="/partner-menu" className="flex items-center px-4 py-3 rounded-xl bg-red-900/20 text-[#C62828] font-bold">
              <Utensils className="mr-3 w-5 h-5" /> Menu Management
            </Link>
            <Link href="/partner-statistics" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <BarChart2 className="mr-3 w-5 h-5" /> Statistics
            </Link>
            <Link href="#" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Settings className="mr-3 w-5 h-5" /> Settings
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <Link href="/partner" className="flex justify-center items-center px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
              Log Out
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
          
          {/* TOPBAR */}
          <header className="h-[80px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <div>
              <span className="text-sm font-semibold text-gray-600">{currentTime || "Loading time..."}</span>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <span className={`text-sm font-bold ${isOpen ? "text-green-600" : "text-gray-400"}`}>
                  {isOpen ? "Restaurant Open" : "Closed"}
                </span>
                <button 
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isOpen ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${isOpen ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>
              
              <div className="relative cursor-pointer">
                <Bell className="w-6 h-6 text-gray-600" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </header>

          {/* MENU MANAGEMENT CONTENT */}
          <div className="flex-1 p-8 flex flex-col overflow-hidden">
            
            <div className="mb-8 shrink-0 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-[#1C1C1C] mb-1">Menu Management</h1>
                <span className="text-gray-500 text-sm font-medium">メニュー管理</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input 
                    type="text" 
                    placeholder="Search food by name or category..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#C62828] w-64 text-sm"
                  />
                </div>
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 bg-[#C62828] hover:bg-red-800 text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm text-sm"
                >
                  <Plus className="w-5 h-5" /> Add New Food
                </button>
              </div>
            </div>

            {/* DATA TABLE */}
            <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-200 custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Menu Item</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Category</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Price</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b">Engagement</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b text-center">Stock Control</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider border-b text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredFoods.map((food) => (
                    <tr key={food.food_id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={food.url_img} alt={food.food_name} className="w-[60px] h-[60px] rounded-lg object-cover shadow-sm" />
                          <div>
                            <p className="font-bold text-[#1C1C1C]">{food.food_name}</p>
                            <p className="text-xs text-gray-500 mt-1 max-w-[200px] truncate">{food.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{food.category}</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-[#1C1C1C]">
                        Rp {parseInt(food.price).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                          <Heart className="w-4 h-4 text-red-500 fill-current" />
                          <span className="text-sm font-bold">{food.total_likes}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-3">
                          <button 
                            onClick={() => handleStockChange(food.food_id, -1)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className={`font-bold w-6 text-center ${food.stok === 0 ? 'text-red-500' : 'text-[#1C1C1C]'}`}>
                            {food.stok}
                          </span>
                          <button 
                            onClick={() => handleStockChange(food.food_id, 1)}
                            className="p-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredFoods.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                        No food items found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          {/* Footer */}
          <footer className="bg-[#2D2D2D] text-white py-12 px-8 flex flex-col md:flex-row justify-between text-sm shrink-0">
            <div className="mb-8 md:mb-0 space-y-2 flex flex-col md:w-1/4">
              <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={160} height={50} className="object-contain" />
              <p className="text-xs text-gray-400 mt-2">© 2026 Kelompok Sembilan Belas.</p>
            </div>
            
            <div className="grid grid-cols-3 gap-8 md:w-2/4">
              <div>
                <h3 className="font-semibold mb-4 text-gray-300">EXPLORE</h3>
                <ul className="space-y-2 text-gray-400 text-xs">
                  <li><Link href="/" className="hover:text-white">Restaurant List</Link></li>
                  <li><Link href="/" className="hover:text-white">Popular Foods (By Total Likes)</Link></li>
                  <li><Link href="/" className="hover:text-white">Top Rated Foods</Link></li>
                  <li><Link href="/" className="hover:text-white">Food Category Filter</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-300">USER</h3>
                <ul className="space-y-2 text-gray-400 text-xs">
                  <li><Link href="/" className="hover:text-white">Profile</Link></li>
                  <li><Link href="/" className="hover:text-white">Active orders</Link></li>
                  <li><Link href="/" className="hover:text-white">Order History</Link></li>
                  <li><Link href="/" className="hover:text-white">My Favorite Foods</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4 text-gray-300">SUPPORT</h3>
                <ul className="space-y-2 text-gray-400 text-xs">
                  <li><Link href="/" className="hover:text-white">Help Center/FAQ</Link></li>
                  <li><Link href="/" className="hover:text-white">Privacy Policy</Link></li>
                  <li><Link href="/" className="hover:text-white">Terms of Service</Link></li>
                  <li><Link href="/" className="hover:text-white">Contact Us</Link></li>
                </ul>
              </div>
            </div>

            <div className="flex space-x-4 md:w-1/4 justify-end">
              <div className="text-2xl cursor-pointer hover:text-gray-300 text-gray-400">T</div>
              <div className="text-2xl cursor-pointer hover:text-gray-300 text-gray-400">I</div>
            </div>
          </footer>
        </main>
      </div>

      {/* ADD NEW FOOD MODAL (Framed Motion) */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-[60]"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl w-[500px] z-[70] overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                <h2 className="text-xl font-bold text-[#1C1C1C]">Add New Food</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                  &times;
                </button>
              </div>
              <div className="p-6 space-y-4">
                
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Image URL</label>
                  <input type="text" placeholder="https://unsplash.com/..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]" />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Food Name</label>
                  <input type="text" placeholder="e.g. Tuna Sashimi" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]" />
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-bold text-gray-700">Category</label>
                    <select className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828] text-[#1C1C1C]">
                      <option>Sushi</option>
                      <option>Bento</option>
                      <option>Side Dish</option>
                      <option>Dessert</option>
                      <option>Donburi</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1 flex-1">
                    <label className="text-xs font-bold text-gray-700">Price (Rp)</label>
                    <input type="number" placeholder="0" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]" />
                  </div>
                  <div className="flex flex-col gap-1 w-[80px]">
                    <label className="text-xs font-bold text-gray-700">Stock</label>
                    <input type="number" placeholder="0" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828]" />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-gray-700">Description</label>
                  <textarea rows={3} placeholder="Briefly describe the food..." className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#C62828] resize-none"></textarea>
                </div>

              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors text-sm">
                  Cancel
                </button>
                <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-lg font-bold bg-[#C62828] text-white hover:bg-red-800 transition-colors shadow-sm text-sm">
                  Save Food
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}