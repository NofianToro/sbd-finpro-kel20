"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaUser, FaHeart, FaChevronLeft, FaStar, FaTwitter, FaInstagram } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// --- MOCK DATA ---
const MOCK_FOOD = {
  food_name: "Premium Truffle Salmon Roll",
  url_img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop",
  price: 85000,
  category: "Sushi",
  description: "Experience the epitome of sushi craftsmanship. Our signature roll combines fresh, melt-in-your-mouth salmon with aromatic earthy black truffle, perfectly seasoned sushi rice, and a delicate touch of truffle mayo. Torched tableside for a smoky finish.",
  total_likes: 2400,
  stok: 12,
};

const MOCK_RESTAURANT = {
  display_name: "Paragita Sushi & Grill",
  url_img: "https://images.unsplash.com/photo-1582285149378-028a3f81e35d?q=80&w=150&auto=format&fit=crop", // placeholder profile
};

const MOCK_REVIEWS = [
  { id: 1, username: "Fauzan Arfa", rating: 5, review: "Absolutely phenomenal! The truffle flavor is perfectly balanced.", feedback_date: "May 10, 2026" },
  { id: 2, username: "Kamila Salma", rating: 5, review: "Worth every rupiah. The salmon literally melts in your mouth.", feedback_date: "May 12, 2026" },
  { id: 3, username: "Budi Santoso", rating: 4, review: "Delicious but portion size is a bit small for the price.", feedback_date: "May 14, 2026" },
];

const MOCK_USER = {
  balance: 150000,
  profile_name: "Michael",
};

export default function FoodDetail() {
  const [qty, setQty] = React.useState(1);
  const [isFavorite, setIsFavorite] = React.useState(false);

  const breadcrumbs = `Explore > ${MOCK_FOOD.category} > ${MOCK_FOOD.food_name}`;

  return (
    <div 
      className="min-h-screen flex flex-col font-sans bg-[#FDFBF7] relative text-[#1C1C1C]"
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

      {/* 2. BREADCRUMBS & NAVIGATION */}
      <div className="px-[80px] py-[24px]">
        <p className="text-sm text-gray-500 mb-4">{breadcrumbs}</p>
        <Link href="/homepage" className="inline-flex items-center text-[#1C1C1C] font-semibold hover:text-[#C62828] transition-colors">
          <FaChevronLeft className="mr-2" /> Back to Omakase
        </Link>
      </div>

      {/* 3. MAIN HERO SECTION */}
      <main className="px-[80px] flex gap-[48px] mb-12">
        {/* Left Column */}
        <div className="w-[600px] shrink-0">
          <div className="w-full h-[500px] rounded-2xl overflow-hidden shadow-md relative bg-gray-200">
            <img 
              src={MOCK_FOOD.url_img} 
              alt={MOCK_FOOD.food_name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="flex-1 flex flex-col pt-4 relative">
          <div className="flex items-center gap-4 mb-4">
            <span className="bg-[#1C1C1C] text-white px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider">
              {MOCK_FOOD.category}
            </span>
            <span className="flex items-center text-sm font-semibold text-gray-500">
              <FaHeart className="text-[#C62828] mr-1.5" /> {MOCK_FOOD.total_likes.toLocaleString()}
            </span>
          </div>

          <h1 className="text-4xl font-extrabold text-[#1C1C1C] leading-snug mb-2">
            {MOCK_FOOD.food_name}
          </h1>
          <p className="text-3xl font-bold text-[#C62828] mb-6">
            Rp {MOCK_FOOD.price.toLocaleString("id-ID")}
          </p>

          {/* Restaurant Card */}
          <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl mb-6 bg-white shadow-sm">
            <div className="w-[48px] h-[48px] bg-gray-200 rounded-full overflow-hidden shrink-0">
              <img src={MOCK_RESTAURANT.url_img} alt={MOCK_RESTAURANT.display_name} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-bold text-[#1C1C1C]">{MOCK_RESTAURANT.display_name}</h3>
              <span className="text-xs bg-orange-100 text-[#FF9800] px-2 py-0.5 rounded-md font-semibold">
                Omakase Partner
              </span>
            </div>
          </div>

          <p className="text-lg text-gray-600 leading-relaxed mb-4">
            {MOCK_FOOD.description}
          </p>

          <p className="text-sm font-bold text-[#FF9800] bg-orange-50 w-fit px-3 py-1 rounded-md mb-auto">
            Only {MOCK_FOOD.stok} left in stock
          </p>

          {/* 4. ACTION AREA */}
          <div className="flex gap-[24px] mt-12 w-full">
            <div className="flex items-center justify-between border-2 border-gray-200 rounded-xl px-4 w-[140px] shrink-0 h-[64px] bg-white">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="text-2xl font-bold text-gray-400 hover:text-[#1C1C1C]"
              >
                -
              </button>
              <span className="text-lg font-bold">{qty}</span>
              <button 
                onClick={() => setQty(Math.min(MOCK_FOOD.stok, qty + 1))}
                className="text-2xl font-bold text-gray-400 hover:text-[#1C1C1C]"
              >
                +
              </button>
            </div>
            
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="flex-1 h-[64px] bg-[#4CAF50] text-white font-bold text-lg rounded-xl shadow-lg hover:bg-[#43A047] transition-colors"
            >
              Add to Tray — Rp {(MOCK_FOOD.price * qty).toLocaleString("id-ID")}
            </motion.button>
            
            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="w-[64px] h-[64px] rounded-full border-2 border-gray-200 flex items-center justify-center shrink-0 bg-white hover:border-[#C62828] transition-colors"
            >
              <FaHeart className={`text-2xl transition-colors ${isFavorite ? "text-[#C62828]" : "text-gray-300"}`} />
            </button>
          </div>
        </div>
      </main>

      {/* 5. REVIEWS SECTION */}
      <section className="bg-white px-[80px] py-[64px] mt-12 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-[#1C1C1C] mb-8">Reviews & Ratings / 評価 (Hyōka)</h2>
        
        <div className="flex items-center gap-6 mb-8">
          <div className="text-6xl font-extrabold text-[#1C1C1C]">4.8</div>
          <div className="flex flex-col">
            <div className="flex text-[#FFC107] text-2xl mb-1">
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar className="text-gray-300" />
            </div>
            <span className="text-sm font-semibold text-gray-500">Based on {MOCK_FOOD.total_likes.toLocaleString()} likes</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="p-6 border border-gray-100 rounded-2xl bg-[#FDFBF7] shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {review.username.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1C1C1C]">{review.username}</h4>
                    <p className="text-xs text-gray-500">{review.feedback_date}</p>
                  </div>
                </div>
                <div className="flex text-[#FFC107] text-sm">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < review.rating ? "" : "text-gray-300"} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{review.review}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="bg-[#2D2D2D] py-[48px] px-[80px] text-gray-400 mt-auto shrink-0 w-full">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={100} height={30} className="object-contain mb-4 filter grayscale opacity-70" />
            <p className="text-sm mb-4">Discover the finest flavors from local chefs and specialized omakase.</p>
            <p className="text-xs">&copy; 2026 KoiBite. All rights reserved.</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">EXPLORE</h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/menu" className="hover:text-white transition-colors">Digital Menu</Link></li>
              <li><Link href="/chef" className="hover:text-white transition-colors">Top Chefs</Link></li>
              <li><Link href="/collection" className="hover:text-white transition-colors">Collections</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">USER</h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/profile" className="hover:text-white transition-colors">Profile</Link></li>
              <li><Link href="/rewards" className="hover:text-white transition-colors">KoiRewards</Link></li>
              <li><Link href="/wallet" className="hover:text-white transition-colors">Wallet</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">SUPPORT</h4>
            <ul className="text-sm space-y-2">
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <Link href="#" className="hover:text-white text-xl transition-colors"><FaTwitter /></Link>
              <Link href="#" className="hover:text-white text-xl transition-colors"><FaInstagram /></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}