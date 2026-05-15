"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Utensils, BarChart2, Settings, Bell } from "lucide-react";

type OrderStatus = "ordered" | "processing" | "delivery" | "done";

interface Order {
  id: string;
  items: { name: string; qty: number }[];
  total: string;
  status: OrderStatus;
  date: string;
}

const initialOrders: Order[] = [
  {
    id: "#ORD-001",
    items: [
      { name: "Salmon Sashimi", qty: 2 },
      { name: "Miso Soup", qty: 1 },
    ],
    total: "Rp 120.000",
    status: "ordered",
    date: "12:30 PM",
  },
  {
    id: "#ORD-002",
    items: [
      { name: "Spicy Tuna Roll", qty: 1 },
      { name: "Ocha Cold", qty: 2 },
    ],
    total: "Rp 85.000",
    status: "ordered",
    date: "12:35 PM",
  },
  {
    id: "#ORD-003",
    items: [
      { name: "Chicken Teriyaki Bento", qty: 1 },
    ],
    total: "Rp 65.000",
    status: "processing",
    date: "12:15 PM",
  },
  {
    id: "#ORD-004",
    items: [
      { name: "Ebi Furai", qty: 3 },
      { name: "Rice", qty: 2 },
    ],
    total: "Rp 150.000",
    status: "processing",
    date: "12:10 PM",
  },
  {
    id: "#ORD-005",
    items: [
      { name: "Unagi Don", qty: 1 },
    ],
    total: "Rp 110.000",
    status: "delivery",
    date: "11:50 AM",
  },
  {
    id: "#ORD-006",
    items: [
      { name: "Matcha Ice Cream", qty: 2 },
    ],
    total: "Rp 40.000",
    status: "done",
    date: "11:30 AM",
  },
];

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
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

  const moveOrder = (id: string, currentStatus: OrderStatus) => {
    const statusFlow: Record<OrderStatus, OrderStatus> = {
      ordered: "processing",
      processing: "delivery",
      delivery: "done",
      done: "done",
    };

    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: statusFlow[currentStatus] } : order
      )
    );
  };

  const renderColumn = (
    title: string,
    status: OrderStatus,
    badgeColor: string,
    buttonText: string,
    buttonColor: string
  ) => {
    const columnOrders = orders.filter((o) => o.status === status);

    return (
      <div className="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 flex flex-col border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
          <h3 className="font-bold text-[#1C1C1C] text-lg">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${badgeColor}`}>
            {columnOrders.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
          <AnimatePresence>
            {columnOrders.map((order) => (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1C1C1C] text-sm">{order.id}</span>
                  <span className="text-xs text-gray-500">{order.date}</span>
                </div>
                
                <div className="text-sm text-gray-700">
                  <ul className="list-disc pl-4 space-y-1 my-2">
                    {order.items.map((item, idx) => (
                      <li key={idx}>
                        <span className="font-medium">{item.qty}x</span> {item.name}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
                  <span className="font-bold text-[#1C1C1C] text-sm">{order.total}</span>
                  {status !== "done" && (
                    <button
                      onClick={() => moveOrder(order.id, status)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all transform active:scale-95 ${buttonColor}`}
                    >
                      {buttonText}
                    </button>
                  )}
                  {status === "done" && (
                    <span className="text-xs font-bold text-green-600 px-3 py-1.5 bg-green-50 rounded-lg">
                      Completed
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {columnOrders.length === 0 && (
            <div className="text-center text-gray-400 py-8 text-sm">
              No orders here.
            </div>
          )}
        </div>
      </div>
    );
  };

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
            <Link href="/partner-dashboard" className="flex items-center px-4 py-3 rounded-xl bg-red-900/20 text-[#C62828] font-bold">
              <Package className="mr-3 w-5 h-5" /> Orders
            </Link>
            <Link href="/partner-menu" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
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
              {/* Restaurant Toggle */}
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
              
              {/* Notification Bell */}
              <div className="relative cursor-pointer">
                <Bell className="w-6 h-6 text-gray-600" />
                <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></div>
              </div>
            </div>
          </header>

          {/* KANBAN BOARD */}
          <div className="flex-1 p-8 flex flex-col overflow-hidden">
            
            <div className="mb-8 shrink-0 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-[#1C1C1C] mb-1">Live Order Management</h1>
                <span className="text-gray-500 text-sm font-medium">注文管理</span>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
              <div className="flex gap-6 h-full items-start">
                {/* Columns */}
                {renderColumn("New Orders", "ordered", "bg-red-500", "Accept & Cook", "bg-[#C62828] hover:bg-red-800")}
                {renderColumn("Cooking", "processing", "bg-orange-500", "Send to Driver", "bg-blue-600 hover:bg-blue-700")}
                {renderColumn("On Delivery", "delivery", "bg-blue-500", "Mark as Done", "bg-green-600 hover:bg-green-700")}
                {renderColumn("Completed", "done", "bg-green-500", "", "")}
              </div>
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

    </div>
  );
}