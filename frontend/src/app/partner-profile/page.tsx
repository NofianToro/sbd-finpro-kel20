"use client";

import React, { useState } from "react";
import { 
  FaCog, FaChartBar, FaUtensils, FaReceipt, FaCamera, FaStore, FaLock
} from "react-icons/fa";

// --- COLOR PALETTE DARI GAMBAR ---
const COLORS = {
  red: "#C1272D",       // Merah gelap
  orange: "#F7931E",    // Oranye Koi
  white: "#FFFFFF",     // Putih
  ink: "#1C1C1C",       // Hitam tinta
  green: "#39B54A"      // Hijau terang
};

// --- MOCK DATA ---
const INITIAL_PROFILE = {
  username: "paragita_sushi",
  display_name: "Paragita Sushi & Grill",
  phone: "+62 811-2233-4455",
  description: "Serving the finest authentic Japanese Omakase and premium sushi rolls since 2026. Experience the true taste of Tokyo.",
  url_img: "https://images.unsplash.com/photo-1553621042-f6e147245754?q=80&w=800&auto=format&fit=crop"
};

export default function RestaurantProfileEdit() {
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsSaving(true);
    // Simulasi API Call ke backend
    setTimeout(() => {
      setIsSaving(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }, 1500);
  };

  return (
    <div className="w-[1440px] min-h-screen mx-auto flex font-sans text-[#1C1C1C]" style={{ backgroundColor: "#F3F4F6" }}>
      
      {/* LEFT SIDEBAR (Identik dengan Kanban Board) */}
      <aside className="w-[280px] flex flex-col shrink-0 sticky top-0 h-screen" style={{ backgroundColor: COLORS.ink, color: COLORS.white }}>
        <div className="p-8 border-b border-gray-800">
          <h1 className="text-2xl font-bold tracking-tight">Paragita <span style={{ color: COLORS.red }}>Sushi</span></h1>
          <p className="text-xs text-gray-400 mt-1">Merchant Portal</p>
        </div>
        <nav className="flex-1 py-6">
          <ul className="space-y-2 px-4">
            <li><a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors" style={{ hover: { backgroundColor: "#333" } }}><FaReceipt /> Live Orders</a></li>
            <li><a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors" style={{ hover: { backgroundColor: "#333" } }}><FaUtensils /> Menu Management</a></li>
            <li><a href="#" className="flex items-center gap-3 text-gray-400 hover:text-white px-4 py-3 rounded-xl font-medium transition-colors" style={{ hover: { backgroundColor: "#333" } }}><FaChartBar /> Statistics</a></li>
            <li>
              {/* Active State menggunakan warna Merah dari Palette */}
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium" style={{ backgroundColor: COLORS.red, color: COLORS.white }}>
                <FaCog /> Settings & Profile
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto relative">
        
        {/* TOPBAR */}
        <header className="h-[80px] bg-white border-b border-gray-200 px-8 flex justify-between items-center shrink-0 sticky top-0 z-10">
          <h2 className="text-2xl font-bold">Settings & Profile</h2>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full overflow-hidden border-2" style={{ borderColor: COLORS.orange }}>
               <img src={profile.url_img} alt="Profile" className="w-full h-full object-cover" />
             </div>
             <span className="font-bold">{profile.display_name}</span>
          </div>
        </header>

        {/* FORM CONTENT */}
        <div className="flex-1 p-10 flex justify-center">
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
            
            {/* Banner & Avatar Area */}
            <div className="relative h-[200px] w-full" style={{ backgroundColor: COLORS.ink }}>
              {/* Pattern atau background abstract bisa disini */}
              <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              
              {/* Avatar Uploader */}
              <div className="absolute -bottom-16 left-10">
                <div className="relative w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-white shadow-lg group">
                  <img src={profile.url_img} alt="Resto Avatar" className="w-full h-full object-cover" />
                  <button className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <FaCamera className="text-2xl mb-1" />
                    <span className="text-xs font-bold">Change</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="pt-24 px-10 pb-10">
              <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-4">
                <FaStore className="text-xl" style={{ color: COLORS.orange }} />
                <h3 className="text-xl font-bold">Public Business Information</h3>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Display Name */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Restaurant Name</label>
                  <input 
                    type="text" 
                    name="display_name"
                    value={profile.display_name} 
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-shadow"
                    style={{ focusRing: COLORS.orange }}
                  />
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Business Phone</label>
                  <input 
                    type="text" 
                    name="phone"
                    value={profile.phone} 
                    onChange={handleInputChange}
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-shadow"
                  />
                </div>

                {/* Username (Disabled) */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                    System Username <FaLock className="text-gray-400 text-xs" />
                  </label>
                  <input 
                    type="text" 
                    value={profile.username} 
                    disabled
                    className="w-full h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                  />
                  <span className="text-xs text-gray-400">Used for login. Cannot be changed.</span>
                </div>

                {/* Password Update */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-700">Update Password</label>
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-shadow"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-2 mb-10">
                <label className="text-sm font-bold text-gray-700">Restaurant Description</label>
                <textarea 
                  name="description"
                  value={profile.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 transition-shadow resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                <button className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                  Discard Changes
                </button>
                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-8 py-3 font-bold text-white rounded-lg transition-all flex items-center gap-2 disabled:opacity-70 shadow-md"
                  // Menggunakan warna Hijau dari Palette untuk tombol Save
                  style={{ backgroundColor: COLORS.green }}
                >
                  {isSaving ? "Saving..." : "Save Profile"}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Toast Notification (Simulasi Update Berhasil) */}
        {showToast && (
          <div className="fixed bottom-8 right-8 text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-bounce" style={{ backgroundColor: COLORS.ink }}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.green }}></span>
            <span className="font-bold">Profile updated successfully!</span>
          </div>
        )}

      </main>
    </div>
  );
}