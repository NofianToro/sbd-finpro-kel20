"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaUser, FaTwitter, FaInstagram, FaWallet, FaHeart, FaHistory, FaCog, FaCheckCircle, FaRedo } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import {getUserProfile,topUpSaldo} from "../../api/userApi";
import {getUserOrders} from "../../api/orderApi";
import {getFavoritesByUserId} from "../../api/favoriteApi";


export default function ProfileDashboard() {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("profile");
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if(!userId) return;
        const profileResponse =await getUserProfile(userId);
        setUserProfile(profileResponse.data);
        const orderResponse = await getUserOrders(userId);
        setOrders(orderResponse.data || []);
        const favoriteResponse =await getFavoritesByUserId(userId);
        setFavorites(favoriteResponse.data || []);
        } catch(error){
          console.error(error);
        }
    };

    fetchProfile();

}, []);
  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1C1C1C] bg-[#FDFBF7] relative">
      
      {/* HEADER */}
      <header className="h-[80px] bg-[#2D2D2D] text-white flex justify-between items-center px-[80px] shrink-0 z-50">
        <Link href="/homepage" className="flex items-center">
            <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={120} height={40}className="object-contain" />
          </Link>
        <div className="flex space-x-8 text-lg">
          <Link href="/homepage" className="hover:text-gray-300">Explore</Link>
          <Link href="/profile" className="hover:text-gray-300">Favorites</Link>
          <Link href="/profile" className="hover:text-gray-300">Orders</Link>
        </div>
        <div className="flex items-center space-x-6 text-lg">
          <span className="text-sm font-medium">Balance: Rp {Number(userProfile?.saldo || 0).toLocaleString("id-ID")}</span>
          <Link href="/checkout" className="relative cursor-pointer">
          <FaShoppingCart className="text-2xl" />
          </Link>
          <Link href="/profile" className="flex items-center space-x-2 hover:text-gray-300">
            <FaUser className="text-xl" />
            <span>{userProfile?.display_name?.split(" ")[0]}</span>
          </Link>
        </div>
      </header>

      {/* 2. DASHBOARD CONTAINER */}
      <main className="px-[80px] py-[48px] flex gap-[48px] min-h-[800px] flex-1">
        
        {/* LEFT COLUMN: Sidebar Navigation */}
        <aside className="w-[320px] shrink-0 flex flex-col">
          
          {/* User Summary Card */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-[80px] h-[80px] rounded-full overflow-hidden border-4 border-white shadow-md mb-4 bg-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={userProfile?.url_profile||"https://i.pinimg.com/736x/cf/cf/4f/cfcf4fb9f3af6ca37b6f96171166decd.jpg"} alt="Profile" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold text-[#1C1C1C]">{userProfile?.display_name}</h2>
            <p className="text-sm text-gray-500 mb-6">@{userProfile?.username}</p>

            {/* Wallet Box */}
            <div className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-500 font-semibold uppercase tracking-wider">
                <FaWallet className="text-[#FF9800]" /> KoiBite Wallet
              </div>
              <div className="flex justify-between items-end">
                <span className="text-2xl font-bold text-[#FF9800]">Rp {Number(userProfile?.saldo).toLocaleString("id-ID")}</span>
                <button 
                  onClick={async () => {
                    try {
                      const updated = await topUpSaldo(userProfile.user_id,100000);
                      setUserProfile(updated.data);
                    } catch(error){
                      console.error(error);
                    }
                  }}
                  className="text-xs font-bold text-white bg-[#1C1C1C] px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">
                  Top Up +100l
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex flex-col gap-2">
            {[
              { id: "profile", label: "My Profile", icon: <FaUser /> },
              { id: "history", label: "Order History", icon: <FaHistory /> },
              { id: "favorites", label: "Favorite Foods", icon: <FaHeart /> },
              { id: "settings", label: "Settings", icon: <FaCog /> },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-r-lg font-semibold transition-all text-sm ${
                  activeTab === tab.id 
                    ? "bg-white text-[#1C1C1C] border-l-4 border-[#C62828] shadow-sm" 
                    : "bg-transparent text-gray-500 hover:bg-gray-100 border-l-4 border-transparent"
                }`}
              >
                <span className={activeTab === tab.id ? "text-[#C62828]" : ""}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* RIGHT COLUMN: Dynamic Content Area */}
        <section className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-[40px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* TAB: PROFILE */}
            {activeTab === "profile" && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col h-full"
              >
                <h2 className="text-2xl font-bold text-[#1C1C1C] mb-8">Personal Information / 個人情報</h2>
                
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">Display Name</label>
                    <input type="text" readOnly disabled value={userProfile?.display_name || ""}className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1C1C1C] font-medium focus:outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">Username</label>
                    <input type="text" readOnly disabled value={userProfile?.username || ""}className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1C1C1C] font-medium focus:outline-none" />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">Phone Number</label>
                    <input type="text" readOnly disabled value={userProfile?.phone} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-[#1C1C1C] font-medium focus:outline-none" />
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-gray-100">
                  <button className="px-6 py-3 border-2 border-[#1C1C1C] text-[#1C1C1C] font-bold rounded-lg hover:bg-gray-50 transition-colors">
                    Edit Profile
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB: ORDER HISTORY */}
            {activeTab === "history" && (
              <motion.div 
                key="history"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-[#1C1C1C] mb-8">Order History / 注文履歴</h2>
                <div className="flex flex-col gap-4">
                  {orders.map((order, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-[#1C1C1C]">{order.order_id}</span>
                          <span className="text-sm text-gray-500">• {new Date(order.order_date).toLocaleDateString("id-ID")}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-green-50 text-[#4CAF50] px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                          <FaCheckCircle /> {order.order_status}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-end border-t border-gray-100 pt-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-semibold text-gray-600 max-w-[400px] truncate">{order.items}</span>
                          <span className="font-bold text-lg text-[#C62828]">Rp {Number(order.order_amount).toLocaleString("id-ID")}</span>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#1C1C1C] font-semibold text-sm rounded-lg transition-colors">
                          <FaRedo /> Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: FAVORITE FOODS */}
            {activeTab === "favorites" && (
              <motion.div 
                key="favorites"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="text-2xl font-bold text-[#1C1C1C] mb-8">Saved Cravings / お気に入り</h2>
                <div className="grid grid-cols-3 gap-6">
                  {favorites.map((fav, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow group relative bg-white flex flex-col">
                      <div className="h-[140px] w-full bg-gray-200 relative overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={fav.url_img} alt={fav.food_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-[#C62828]">
                          <FaHeart />
                        </div>
                      </div>
                      <div className="p-4 flex flex-col flex-1 gap-1">
                        <h3 className="font-bold text-[#1C1C1C] text-sm line-clamp-2 leading-snug">{fav.name}</h3>
                        <p className="font-bold text-[#C62828] mt-auto">Rp {fav.price.toLocaleString("id-ID")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TAB: SETTINGS (MOCK) */}
            {activeTab === "settings" && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col items-center justify-center h-full text-gray-400"
              >
                <FaCog className="text-6xl mb-4 opacity-50" />
                <h2 className="text-xl font-bold mb-2">Settings</h2>
                <p>Account preferences and notifications will appear here.</p>
              </motion.div>
            )}

          </AnimatePresence>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-12 px-8 flex flex-col md:flex-row justify-between text-sm shrink-0 mt-auto">
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
          <FaTwitter className="text-2xl cursor-pointer hover:text-gray-300 text-gray-400" />
          <FaInstagram className="text-2xl cursor-pointer hover:text-gray-300 text-gray-400" />
        </div>
      </footer>
    </div>
  );
}