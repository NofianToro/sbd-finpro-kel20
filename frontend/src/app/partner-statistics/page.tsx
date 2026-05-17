"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Package, 
  Utensils, 
  BarChart2, 
  Settings, 
  Bell,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Star,
  ChevronDown
} from "lucide-react";

const BARCHART_DATA = [
  { day: "Mon", height: "h-[40%]", value: "Rp 1.2M" },
  { day: "Tue", height: "h-[55%]", value: "Rp 1.6M" },
  { day: "Wed", height: "h-[45%]", value: "Rp 1.4M" },
  { day: "Thu", height: "h-[70%]", value: "Rp 2.1M" },
  { day: "Fri", height: "h-[85%]", value: "Rp 2.8M" },
  { day: "Sat", height: "h-[100%]", value: "Rp 3.5M" },
  { day: "Sun", height: "h-[90%]", value: "Rp 3.1M" },
];

const TOP_FOODS = [
  { id: 1, name: "Salmon Sashimi", orders: "428 orders", img: "https://images.unsplash.com/photo-1579584425555-c3ce17f6a08c?q=80&w=200&auto=format&fit=crop" },
  { id: 2, name: "Unagi Don", orders: "312 orders", img: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?q=80&w=200&auto=format&fit=crop" },
  { id: 3, name: "Spicy Tuna Roll", orders: "285 orders", img: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=200&auto=format&fit=crop" },
];

const RECENT_REVIEWS = [
  { id: 1, customer: "Alex W.", rating: 5, text: "Salmon was incredibly fresh! Best in town.", product: "Salmon Sashimi", date: "2 hrs ago" },
  { id: 2, customer: "Sarah T.", rating: 4, text: "Good portion size but delivery took a bit long.", product: "Chicken Teriyaki Bento", date: "5 hrs ago" },
  { id: 3, customer: "Budi T.", rating: 5, text: "My favorite sushi spot on KoiBite.", product: "Spicy Tuna Roll", date: "1 day ago" },
  { id: 4, customer: "Jessica L.", rating: 5, text: "The eel was grilled to perfection.", product: "Unagi Don", date: "1 day ago" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

export default function RestaurantStatistics() {
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");

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
          <div className="h-[80px] flex items-center px-6 border-b border-gray-800">
            <Image src="/KoiBite_logo.png" alt="KoiBite" width={100} height={30} className="object-contain" />
          </div>
          
          <div className="px-6 py-8">
            <h2 className="text-xl font-bold mb-1">Kura Sushi</h2>
            <p className="text-xs text-gray-400">Partner Dashboard</p>
          </div>

          <nav className="flex-1 px-4 space-y-2">
            <Link href="/partner-dashboard" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Package className="mr-3 w-5 h-5" /> Orders
            </Link>
            <Link href="/partner-menu" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Utensils className="mr-3 w-5 h-5" /> Menu Management
            </Link>
            <Link href="/partner-statistics" className="flex items-center px-4 py-3 rounded-xl bg-red-900/20 text-[#C62828] font-bold">
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
        <main className="flex-1 flex flex-col h-full overflow-y-auto relative z-10 custom-scrollbar">
          
          {/* TOPBAR */}
          <header className="h-[80px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 sticky top-0 z-30">
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

          {/* DASHBOARD CONTENT */}
          <div className="p-8 flex flex-col relative min-h-full">
            
            {/* Page Header */}
            <div className="flex justify-between items-end mb-8">
              <div>
                <h1 className="text-3xl font-bold text-[#1C1C1C] mb-1">Performance & Reports</h1>
                <span className="text-gray-500 text-sm font-medium">統計</span>
              </div>
              
              <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 cursor-pointer shadow-sm hover:bg-gray-50 transition-colors">
                <span className="text-sm font-bold text-gray-700 mr-3">This Month</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            </div>

            {/* KPI WIDGETS (Animated Grid) */}
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">+14.5%</span>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Orders</h3>
                  <div className="text-3xl font-bold text-[#1C1C1C]">342</div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center">
                    <DollarSign className="w-6 h-6" />
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">+8.2%</span>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Total Revenue</h3>
                  <div className="text-3xl font-bold text-[#1C1C1C]">Rp 15.450.000</div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Items Sold</h3>
                  <div className="text-3xl font-bold text-[#1C1C1C]">890</div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <span className="text-gray-400 text-xs font-medium">from 156 reviews</span>
                </div>
                <div>
                  <h3 className="text-gray-500 text-sm font-medium mb-1">Avg Rating</h3>
                  <div className="text-3xl font-bold text-[#1C1C1C]">4.8 <span className="text-lg text-gray-400 font-medium">/ 5.0</span></div>
                </div>
              </motion.div>
            </motion.div>

            {/* MIDDLE SECTION: Charts & Rankings */}
            <motion.div 
              className="flex flex-col lg:flex-row gap-8 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              
              {/* Left Column: Chart */}
              <div className="lg:w-3/5 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-[#1C1C1C]">Revenue Overview</h2>
                  <span className="text-xs text-gray-400">Weekly</span>
                </div>
                
                {/* Mock Chart Area */}
                <div className="flex-1 flex items-end justify-between gap-2 h-[200px] mt-4 relative pt-6">
                  {/* Grid Lines (Mock) */}
                  <div className="absolute inset-0 flex flex-col justify-between z-0">
                    {[1,2,3,4].map(line => (
                      <div key={line} className="border-b border-gray-100 w-full h-0"></div>
                    ))}
                  </div>

                  {BARCHART_DATA.map((bar, idx) => (
                    <div key={idx} className="flex flex-col items-center flex-1 z-10 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-gray-700 bg-white shadow-md rounded px-2 py-1 mb-2">
                        {bar.value}
                      </div>
                      <div className={`w-full max-w-[40px] bg-gray-200 rounded-t-sm relative`}>
                        <div className={`absolute bottom-0 w-full bg-[#C62828] rounded-t-sm transition-all duration-1000 ${bar.height}`}></div>
                      </div>
                      <span className="text-xs font-bold text-gray-500 mt-3">{bar.day}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Top Foods */}
              <div className="lg:w-2/5 bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col">
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-6">Top Selling Items</h2>
                
                <div className="flex flex-col gap-4 flex-1">
                  {TOP_FOODS.map((food, idx) => (
                    <div key={food.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-6 text-center font-bold text-gray-400 text-lg">
                        {idx + 1}
                      </div>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={food.img} alt={food.name} className="w-[50px] h-[50px] rounded-md object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-[#1C1C1C] truncate">{food.name}</h4>
                        <p className="text-sm text-gray-500">{food.orders}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <button className="mt-4 w-full py-2 text-sm font-bold text-[#C62828] hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100">
                  View Full Menu Stats
                </button>
              </div>

            </motion.div>

            {/* BOTTOM SECTION: Recent Reviews */}
            <motion.div 
              className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-[#1C1C1C]">Recent Reviews</h2>
              </div>
              <div className="overflow-x-auto w-full">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Customer</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Item</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Feedback</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {RECENT_REVIEWS.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-[#1C1C1C]">{review.customer}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{review.product}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} 
                              />
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 max-w-[300px] truncate">
                          &ldquo;{review.text}&rdquo;
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-400 text-right">{review.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

          </div>

          {/* Footer */}
          <footer className="mt-auto bg-[#2D2D2D] text-white py-12 px-8 flex flex-col md:flex-row justify-between text-sm shrink-0">
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

    </div>
  );
}