"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaPlus, FaTimes, FaHeart, FaTrash, FaShoppingCart, FaUser, FaTwitter, FaInstagram } from "react-icons/fa";

// --- MOCK DATA ---
const MOCK_FOODS = [
  {
    food_id: "1",
    food_name: "Truffle Salmon Roll",
    url_img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
    price: 55000,
    category: "Sushi",
    description: "Premium salmon wrapped in nori and seasoned sushi rice, topped with special truffle mayo and lightly torched for a perfect smoky flavor.",
    total_likes: 2400,
    stok: 12
  },
  {
    food_id: "2",
    food_name: "Spicy Tonkotsu Ramen",
    url_img: "https://images.unsplash.com/photo-1552611052-33e04de081de?q=80&w=800&auto=format&fit=crop",
    price: 45000,
    category: "Ramen",
    description: "Rich pork bone broth with spicy chili oil, tender chashu slices, soft boiled egg, and bamboo shoots.",
    total_likes: 3100,
    stok: 8
  },
  {
    food_id: "3",
    food_name: "Wagyu Beef Bento",
    url_img: "https://images.unsplash.com/photo-1580959375944-cbbccb5cba07?q=80&w=800&auto=format&fit=crop",
    price: 85000,
    category: "Bento",
    description: "A5 Wagyu beef slices grilled to perfection with teriyaki glaze, served with Japanese rice and tempura.",
    total_likes: 1850,
    stok: 5
  },
  {
    food_id: "4",
    food_name: "Matcha Mochi Dessert",
    url_img: "https://images.unsplash.com/photo-1515037893149-de7f840978e2?q=80&w=800&auto=format&fit=crop",
    price: 20000,
    category: "Dessert",
    description: "Soft and chewy mochi filled with premium Uji matcha cream and red bean paste.",
    total_likes: 4200,
    stok: 20
  },
  {
    food_id: "5",
    food_name: "Ebi Tempura Udong",
    url_img: "https://images.unsplash.com/photo-1617093727343-374698b1b08d?q=80&w=800&auto=format&fit=crop",
    price: 40000,
    category: "Noodles",
    description: "Thick udon noodles in a clear dashi broth, topped with crispy jumbo shrimp tempura.",
    total_likes: 1560,
    stok: 15
  }
];

export default function Homepage() {
  const [foods, setFoods] = useState(MOCK_FOODS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null);
  const [matchedItems, setMatchedItems] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<any[]>([]);
  
  const userBalance = 150000;
  const platformFee = 2000;

  // Handlers for Swiping
  const handleMatch = () => {
    if (currentIndex >= foods.length) return;
    
    // Koreksi UX: Match = Buang ke kanan
    setSwipeDirection("right"); 
    const currentFood = foods[currentIndex];
    
    // Add to matched list if not already there
    if (!matchedItems.find(item => item.food_id === currentFood.food_id)) {
      setMatchedItems(prev => [...prev, currentFood]);
    }
    
    // Langsung pindah index, Framer Motion akan mengurus animasinya
    setCurrentIndex(prev => prev + 1);
  };

  const handlePass = () => {
    if (currentIndex >= foods.length) return;
    
    // Koreksi UX: Pass = Buang ke kiri
    setSwipeDirection("left"); 
    
    setCurrentIndex(prev => prev + 1);
  };

  // Handlers for Cart
  const addToCart = (food: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.food_id === food.food_id);
      if (existing) {
        return prev.map(item => item.food_id === food.food_id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...prev, { ...food, quantity: 1 }];
      }
    });
  };

  const updateCartQty = (food_id: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.food_id === food_id) {
          const newQty = Math.max(0, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeCartItem = (food_id: string) => {
    setCartItems(prev => prev.filter(item => item.food_id !== food_id));
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalAmount = subtotal > 0 ? subtotal + platformFee : 0;

  // Framer Motion Variants
  const cardVariants = {
    initial: { scale: 0.95, opacity: 0, y: 20 },
    animate: { scale: 1, opacity: 1, x: 0, y: 0, rotate: 0, transition: { type: "spring" as const, stiffness: 300, damping: 20 } },
    exit: (direction: "left" | "right") => ({
      x: direction === "right" ? 300 : -300,
      opacity: 0,
      rotate: direction === "right" ? 15 : -15,
      transition: { duration: 0.3 }
    })
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1C1C1C] overflow-hidden bg-[#FDFBF7] relative">
      {/* 1. Header (Top Navigation) */}
      <header className="h-[80px] bg-[#2D2D2D] text-white flex justify-between items-center px-[80px] shrink-0 z-50">
        <div className="flex items-center">
          <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="flex space-x-8 text-lg">
          <Link href="/explore" className="hover:text-gray-300">Explore</Link>
          <Link href="/favorites" className="hover:text-gray-300">Favorites</Link>
          <Link href="/orders" className="hover:text-gray-300">Orders</Link>
        </div>
        <div className="flex items-center space-x-6 text-lg">
          <span className="text-sm font-medium">Balance: Rp {userBalance.toLocaleString("id-ID")}</span>
          <div className="relative cursor-pointer">
            <FaShoppingCart className="text-2xl" />
            {cartItems.length > 0 && (
              <div className="absolute -top-2 -right-2 bg-[#C1272D] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <FaUser className="text-xl" />
            <span>My_Name</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT COLUMNS */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* 2. LEFT COLUMN: Search & Matched List */}
        <aside className="w-[320px] bg-[#FDFBF7] p-6 flex flex-col shrink-0 border-r border-gray-200">
          {/* Search Bar */}
          <div className="relative h-[48px] w-full mb-4 shrink-0">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search cravings..." 
              className="w-full h-full pl-11 pr-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] text-sm shadow-sm transition-all"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap mb-6 items-center shrink-0 scrollbar-hide pb-2">
            <button className="px-4 py-1.5 bg-[#C1272D] text-white text-xs font-semibold rounded-full shadow-sm">All</button>
            <button className="px-4 py-1.5 bg-white border border-gray-200 text-[#1C1C1C] hover:border-[#C62828] text-xs font-semibold rounded-full transition-colors shadow-sm">Sushi</button>
            <button className="px-4 py-1.5 bg-white border border-gray-200 text-[#1C1C1C] hover:border-[#C62828] text-xs font-semibold rounded-full transition-colors shadow-sm">Ramen</button>
            <button className="px-4 py-1.5 bg-white border border-gray-200 text-[#1C1C1C] hover:border-[#C62828] text-xs font-semibold rounded-full transition-colors shadow-sm">Bento</button>
          </div>

          {/* Matched List Section */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-3 pr-2 scrollbar-thin">
            <h3 className="font-bold text-sm text-gray-400 mb-2 uppercase tracking-wider">Matched List</h3>
            
            <AnimatePresence>
              {matchedItems.length === 0 ? (
                <div className="text-center text-sm text-gray-400 mt-10">No cravings matched yet. Keep swiping!</div>
              ) : (
                matchedItems.map((item) => (
                  <motion.div 
                    key={item.food_id + "match"}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="h-[80px] bg-white border border-gray-100 rounded-xl p-2 flex items-center justify-between shadow-sm min-h-[80px]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-[60px] h-[60px] rounded-lg overflow-hidden relative shrink-0">
                        <img src={item.url_img} alt={item.food_name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-[#1C1C1C] line-clamp-1 w-[130px]">{item.food_name}</span>
                        <span className="text-xs font-bold text-[#C62828] mt-1">Rp {item.price.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-8 h-8 shrink-0 bg-white border border-gray-200 text-[#1C1C1C] hover:border-[#C62828] hover:text-[#C62828] rounded-md flex justify-center items-center font-bold text-sm shadow-sm transition-colors"
                    >
                      <FaPlus />
                    </button>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* 3. CENTER COLUMN: The Swipe Arena */}
        <section className="flex-1 flex flex-col items-center justify-center relative bg-transparent overflow-hidden">
          <AnimatePresence custom={swipeDirection} mode="wait">
            {currentIndex < foods.length ? (
              <motion.div
                key={currentIndex}
                custom={swipeDirection}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-[480px] flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden mb-8 border border-gray-100"
              >
                {/* Image Section */}
                <div className="h-[400px] w-full bg-gray-200 relative">
                  <img 
                    src={foods[currentIndex].url_img} 
                    alt={foods[currentIndex].food_name} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-xs font-bold rounded-full text-[#1C1C1C]">
                    {foods[currentIndex].category}
                  </div>
                </div>
                
                {/* Details Section */}
                <div className="p-6 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-[#1C1C1C]">{foods[currentIndex].food_name}</h2>
                    <span className="text-xl font-bold text-[#C62828]">Rp {foods[currentIndex].price.toLocaleString("id-ID")}</span>
                  </div>
                  <p className="text-sm text-gray-500 mb-5 leading-relaxed line-clamp-2">
                    {foods[currentIndex].description}
                  </p>
                  
                  <div className="flex justify-between items-center text-sm font-medium pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <FaHeart className="text-[#C62828]" /> {foods[currentIndex].total_likes.toLocaleString()} Likes
                    </div>
                    <div className="text-[#FF9800] bg-orange-50 px-3 py-1 rounded-full text-xs font-bold">
                      {foods[currentIndex].stok} Left in Stock
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-center text-gray-400 mb-8"
              >
                <div className="text-4xl mb-4">🍽️</div>
                <h2 className="text-xl font-bold text-[#1C1C1C] mb-2">You've seen everything!</h2>
                <p>Check your matched list to complete your order.</p>
                <button 
                  onClick={() => setCurrentIndex(0)} 
                  className="mt-6 px-6 py-2 bg-[#C62828] text-white rounded-full font-bold text-sm shadow-md hover:bg-red-800 transition-colors"
                >
                  Start Over
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Swipe Action Buttons */}
          <div className="flex items-center gap-8 translate-y-[-10px]">
            <button 
              onClick={handlePass}
              disabled={currentIndex >= foods.length}
              className="w-[80px] h-[80px] bg-gray-100 text-[#1C1C1C] shadow-md rounded-full flex justify-center items-center hover:bg-gray-200 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaTimes className="text-3xl" />
            </button>
            <button 
              onClick={handleMatch}
              disabled={currentIndex >= foods.length}
              className="w-[80px] h-[80px] bg-[#C62828] text-white shadow-[0_4px_20px_rgba(198,40,40,0.4)] rounded-full flex justify-center items-center hover:bg-red-800 transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaHeart className="text-3xl" />
            </button>
          </div>
        </section>

        {/* 4. RIGHT COLUMN: Quick Cart */}
        <aside className="w-[320px] bg-[#F5F5F5] p-6 flex flex-col shrink-0 border-l border-gray-200 relative">
          <div className="flex items-center justify-between mb-6 shrink-0">
            <h2 className="text-xl font-bold tracking-tight text-[#1C1C1C]">Current Tray</h2>
            <div className="bg-[#1C1C1C] text-white text-xs font-bold px-2 py-1 rounded-md">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)} Items
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 pr-1 scrollbar-thin mb-4">
            <AnimatePresence>
              {cartItems.length === 0 ? (
                <div className="text-center text-sm text-gray-400 mt-10">Your tray is empty. Catch some cravings!</div>
              ) : (
                cartItems.map(item => (
                  <motion.div 
                    key={item.food_id + "cart"}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-col gap-2 pb-4 border-b border-gray-200 last:border-0"
                  >
                    <div className="flex justify-between items-start">
                      <span className="font-semibold text-sm text-[#1C1C1C] max-w-[200px] leading-tight flex-1">{item.food_name}</span>
                      <span className="font-bold text-sm text-[#1C1C1C] ml-2 shrink-0">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <button 
                        onClick={() => removeCartItem(item.food_id)}
                        className="text-gray-400 hover:text-[#C62828] text-sm transition-colors"
                      >
                        <FaTrash />
                      </button>
                      <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-md px-2 py-1 shadow-sm">
                        <button onClick={() => updateCartQty(item.food_id, -1)} className="text-gray-400 hover:text-[#1C1C1C] font-bold px-1 transition-colors">-</button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateCartQty(item.food_id, 1)} className="text-gray-400 hover:text-[#1C1C1C] font-bold px-1 transition-colors">+</button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Bill Summary */}
          <div className="shrink-0 pt-4 border-t border-dashed border-gray-300">
            <div className="flex justify-between items-center mb-2 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-medium text-[#1C1C1C]">Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center mb-4 text-sm">
              <span className="text-gray-500">Platform Fee</span>
              <span className="font-medium text-[#1C1C1C]">Rp {(totalAmount > 0 ? platformFee : 0).toLocaleString("id-ID")}</span>
            </div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-bold text-lg text-[#1C1C1C]">Total</span>
              <span className="text-2xl font-bold text-[#C62828]">Rp {totalAmount.toLocaleString("id-ID")}</span>
            </div>
            
            {/* Checkout Button */}
            <button 
              disabled={cartItems.length === 0}
              className="w-full h-[56px] bg-[#4CAF50] disabled:bg-gray-300 disabled:text-gray-500 text-white rounded-xl font-bold text-lg hover:bg-[#3d8c40] disabled:hover:bg-gray-300 transition-colors shadow-md flex justify-center items-center"
            >
              Checkout
            </button>
          </div>
        </aside>

      </main>

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
          <FaTwitter className="text-2xl cursor-pointer hover:text-gray-300 text-gray-400" />
          <FaInstagram className="text-2xl cursor-pointer hover:text-gray-300 text-gray-400" />
        </div>
      </footer>
    </div>
  );
}
