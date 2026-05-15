"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function PartnerAuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1C1C1C] bg-[#FDFBF7] overflow-x-hidden">
      
      {/* 1. TOP HEADER */}
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

      {/* 2. SPLIT CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* LEFT SIDE: Visual Branding */}
        <div className="md:w-1/2 relative min-h-[600px] shrink-0">
          {/* Background Image */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1000&auto=format&fit=crop" 
            alt="Professional Japanese Chef" 
            className="w-full h-full object-cover absolute inset-0"
          />
          
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-[#1C1C1C] bg-opacity-60"></div>
          
          {/* Content (Centered) */}
          <div className="absolute inset-0 flex flex-col justify-center px-12 lg:px-20 text-white">
            <h1 className="text-5xl font-bold leading-tight mb-4 drop-shadow-md">
              Empower Your <br /> Kitchen.
            </h1>
            <p className="text-lg opacity-90 drop-shadow-md max-w-[500px]">
              Join KoiBite as a Partner. Let our smart matchmaking algorithm bring the right hungry customers directly to your tables.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: The Form Area */}
        <div className="md:w-1/2 flex flex-col justify-center items-center py-12 relative px-4">
          <div className="w-full max-w-md flex flex-col">
            <h2 className="text-3xl font-bold text-[#1C1C1C] mb-8 text-center">Partner Portal</h2>

            {/* Toggle Switch */}
            <div className="flex p-1 bg-gray-200 rounded-full mb-8 shrink-0">
              <button 
                onClick={() => setIsLoginMode(true)} 
                className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  isLoginMode ? 'bg-white shadow-sm text-[#1C1C1C]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Log In
              </button>
              <button 
                onClick={() => setIsLoginMode(false)} 
                className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  !isLoginMode ? 'bg-white shadow-sm text-[#1C1C1C]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Register
              </button>
            </div>

            {/* Form */}
            <form className="flex flex-col w-full" onSubmit={(e) => e.preventDefault()}>
              
              {/* Restaurant Name (Register Only) */}
              <AnimatePresence initial={false}>
                {!isLoginMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 mb-4">
                      <label className="text-sm font-semibold text-gray-700">Restaurant Name</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Paragita Sushi & Grill"
                        className="h-[48px] w-full px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username (Always Visible) */}
              <div className="flex flex-col gap-1 mb-4 shrink-0">
                <label className="text-sm font-semibold text-gray-700">Username</label>
                <input 
                  type="text" 
                  placeholder="e.g. paragita_sushi"
                  className="h-[48px] w-full px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                />
              </div>

              {/* Phone Number (Register Only) */}
              <AnimatePresence initial={false}>
                {!isLoginMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 mb-4">
                      <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                      <input 
                        type="tel" 
                        placeholder="+62 812-XXXX-XXXX"
                        className="h-[48px] w-full px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password (Always Visible) */}
              <div className="flex flex-col gap-1 mb-4 shrink-0">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="h-[48px] w-full px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                />
              </div>

              {/* Restaurant Description (Register Only) */}
              <AnimatePresence initial={false}>
                {!isLoginMode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="flex flex-col gap-1 mb-4">
                      <label className="text-sm font-semibold text-gray-700">Restaurant Description</label>
                      <textarea 
                        rows={3}
                        placeholder="Brief bio about your restaurant..."
                        className="w-full p-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors resize-none"
                      ></textarea>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button 
                whileTap={{ scale: 0.98 }}
                className="w-full h-[56px] bg-[#C62828] text-white font-bold text-lg rounded-xl mt-4 shadow-md hover:bg-red-800 transition-colors shrink-0"
              >
                {isLoginMode ? "Log Into Dashboard" : "Register as Partner"}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8 font-medium">
              Need help? <Link href="#" className="text-[#1C1C1C] hover:underline">Contact Merchant Support</Link>
            </p>
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
    </div>
  );
}