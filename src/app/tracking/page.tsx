"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaUser, FaTwitter, FaInstagram, FaCheck, FaUtensils, FaMotorcycle, FaBoxOpen, FaPhoneAlt, FaCommentDots } from "react-icons/fa";
import { motion } from "framer-motion";

// --- MOCK DATA ---
const MOCK_ORDER = {
  order_id: "KB-8829-XJ",
  status: "Processing", // Ordered, Processing, Delivery, Done
  eta: "15 - 20 Minutes",
  restaurant: {
    name: "Paragita Sushi & Grill",
    driver: "Budi Santoso",
    plate: "B 1234 XYZ"
  },
  items: [
    { name: "Wagyu Beef Bento", qty: 1 },
    { name: "Matcha Mochi Dessert", qty: 2 }
  ],
  total_amount: 147000
};

const MOCK_USER = {
  balance: 1500000,
  profile_name: "Michael",
};

const steps = [
  { id: "Ordered", label: "Order Placed", icon: FaBoxOpen },
  { id: "Processing", label: "Kitchen Preparing", icon: FaUtensils },
  { id: "Delivery", label: "On the Way", icon: FaMotorcycle },
  { id: "Done", label: "Arrived", icon: FaCheck },
];

export default function OrderTrackingPage() {
  // Mapping current status index
  const currentStepIndex = steps.findIndex(step => step.id === MOCK_ORDER.status) >= 0 
    ? steps.findIndex(step => step.id === MOCK_ORDER.status) 
    : 1;

  return (
    <div 
      className="min-h-screen bg-[#FDFBF7] relative flex flex-col font-sans text-[#1C1C1C]"
    >
      {/* 1. TOP HEADER */}
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
          <span className="text-sm font-medium">Balance: Rp {MOCK_USER.balance.toLocaleString("id-ID")}</span>
          <div className="relative cursor-pointer">
            <FaShoppingCart className="text-2xl" />
          </div>
          <div className="flex items-center space-x-2">
            <FaUser className="text-xl" />
            <span>{MOCK_USER.profile_name}</span>
          </div>
        </div>
      </header>

      {/* 2. MAIN CONTENT */}
      <main className="px-[80px] py-[48px] flex-1 flex flex-col">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Track Your Order / ご注文の追跡</h1>
          <p className="text-gray-500 font-medium mt-1">Order ID: {MOCK_ORDER.order_id}</p>
        </div>

        {/* Two-Column Layout */}
        <div className="flex justify-between gap-[48px]">
          
          {/* Left Column: Tracker */}
          <div className="w-[800px] shrink-0 flex flex-col gap-8">
            
            {/* Visualizer Area */}
            <div className="w-full h-[350px] rounded-2xl bg-gray-100 flex items-center justify-center relative overflow-hidden border border-gray-200 shadow-inner">
              {/* Subtle background pattern could go here, simulating a map or abstract waves */}
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-400 to-transparent"></div>
              
              <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10 w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center shadow-lg border-2 border-[#C62828]"
              >
                <FaUtensils className="text-5xl text-[#C62828] mb-1" />
              </motion.div>
              <div className="absolute bottom-6 font-bold text-gray-500 tracking-wider">
                CHEF IS PREPARING YOUR MEAL
              </div>
            </div>

            {/* Status Stepper */}
            <div className="relative w-full mt-4">
              {/* Progress Line */}
              <div className="absolute top-6 left-[10%] right-[10%] h-1 bg-gray-200 rounded-full z-0 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className="h-full bg-[#C62828] rounded-full"
                />
              </div>

              {/* Steps */}
              <div className="relative z-10 flex justify-between">
                {steps.map((step, index) => {
                  const isActive = index === currentStepIndex;
                  const isCompleted = index < currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="flex flex-col items-center w-1/4">
                      <motion.div 
                        initial={false}
                        animate={
                          isActive 
                            ? { scale: [1, 1.15, 1], boxShadow: "0px 0px 15px rgba(198, 40, 40, 0.4)" } 
                            : {}
                        }
                        transition={{ duration: 1.5, repeat: isActive ? Infinity : 0 }}
                        className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors duration-300 ${
                          isActive 
                            ? "bg-[#C62828] text-white border-4 border-red-100" 
                            : isCompleted 
                              ? "bg-white text-[#C62828] border-2 border-[#C62828]" 
                              : "bg-white text-gray-300 border-2 border-gray-200"
                        }`}
                      >
                        <Icon className="text-xl" />
                      </motion.div>
                      <span className={`text-sm font-bold text-center ${
                        isActive ? "text-[#1C1C1C]" : isCompleted ? "text-gray-600" : "text-gray-400"
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Right Column: Order Details */}
          <div className="w-[430px] shrink-0 flex flex-col gap-6">
            
            {/* ETA Box */}
            <div className="bg-[#1C1C1C] text-white p-6 rounded-2xl shadow-lg flex flex-col gap-2 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-10 translate-x-10"></div>
              <span className="text-sm font-medium text-gray-400 uppercase tracking-widest">Estimated Arrival</span>
              <span className="text-4xl font-extrabold">{MOCK_ORDER.eta}</span>
            </div>

            {/* Restaurant & Driver Info */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
              <div>
                <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Restaurant</h3>
                <p className="font-bold text-lg text-[#1C1C1C]">{MOCK_ORDER.restaurant.name}</p>
              </div>
              <div className="w-full h-px bg-gray-100"></div>
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Assigned Driver</h3>
                  <p className="font-bold text-[#1C1C1C] leading-snug">{MOCK_ORDER.restaurant.driver}</p>
                  <p className="text-sm text-[#C62828] font-semibold">{MOCK_ORDER.restaurant.plate}</p>
                </div>
                <div className="flex gap-2">
                  <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <FaCommentDots />
                  </button>
                  <button className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors">
                    <FaPhoneAlt />
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <h3 className="font-bold text-[#1C1C1C] mb-4">Order Summary</h3>
              <ul className="flex flex-col gap-3 mb-4 flex-1">
                {MOCK_ORDER.items.map((item, idx) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      <span className="font-semibold text-[#1C1C1C] mr-2">{item.qty}x</span>
                      {item.name}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-4 border-t border-dashed border-gray-200 flex justify-between items-center">
                <span className="font-semibold text-gray-500">Total</span>
                <span className="font-bold text-lg text-[#C62828]">Rp {MOCK_ORDER.total_amount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Action Button */}
            <button 
              disabled={MOCK_ORDER.status !== "Delivery"}
              className={`w-full h-[56px] rounded-xl font-bold text-lg mt-auto transition-colors ${
                MOCK_ORDER.status === "Delivery" 
                  ? "bg-[#4CAF50] hover:bg-[#43A047] text-white shadow-md cursor-pointer" 
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Confirm Delivery Received
            </button>

          </div>
        </div>
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