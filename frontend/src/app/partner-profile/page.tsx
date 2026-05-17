"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Package, Utensils, BarChart2, Settings } from "lucide-react";
import { FaCamera, FaStore, FaLock } from "react-icons/fa";
import { updateRestaurantImage } from "@/api/restaurantApi";

export default function RestaurantSettings() {
  const router = useRouter();
  const [restaurant, setRestaurant] = useState<{
    restaurant_id?: string;
    display_name?: string;
    username?: string;
    phone?: string;
    url_img?: string;
  } | null>(null);

  // Image URL input state
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Auth guard + load from localStorage
  useEffect(() => {
    const token = localStorage.getItem("restaurant_token");
    if (!token) {
      router.push("/partner-login");
      return;
    }
    const stored = localStorage.getItem("restaurant");
    if (stored) {
      const data = JSON.parse(stored);
      setRestaurant(data);
      setImageUrl(data.url_img || "");
      setPreviewUrl(data.url_img || "");
    }
  }, [router]);

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(e.target.value);
  };

  const handlePreview = () => {
    setPreviewUrl(imageUrl);
  };

  const handleSaveImage = async () => {
    if (!restaurant?.restaurant_id) return;
    if (!imageUrl.trim()) {
      setToast({ message: "Please enter an image URL.", type: "error" });
      setTimeout(() => setToast(null), 3000);
      return;
    }
    setSaving(true);
    try {
      const res = await updateRestaurantImage(restaurant.restaurant_id, imageUrl);
      if (res.success) {
        // Update localStorage so sidebar/dashboard reflect change immediately
        const updated = { ...restaurant, url_img: imageUrl };
        setRestaurant(updated);
        localStorage.setItem("restaurant", JSON.stringify(updated));
        setToast({ message: "Profile image updated successfully!", type: "success" });
      } else {
        setToast({ message: res.message || "Failed to update image.", type: "error" });
      }
    } catch (err: any) {
      setToast({
        message: err?.response?.data?.message || "An error occurred.",
        type: "error",
      });
    } finally {
      setSaving(false);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDiscard = () => {
    const original = restaurant?.url_img || "";
    setImageUrl(original);
    setPreviewUrl(original);
  };

  const handleLogout = () => {
    localStorage.removeItem("restaurant_token");
    localStorage.removeItem("restaurant");
    router.push("/partner-login");
  };

  const displayName = restaurant?.display_name || restaurant?.username || "Loading...";
  const avatarLetter = displayName[0]?.toUpperCase() ?? "R";

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans">

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
        <aside className="w-[280px] bg-[#1C1C1C] text-white flex flex-col shrink-0 sticky top-0 h-[calc(100vh-80px)]">
          <div className="px-6 py-10 border-b border-gray-800 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-700 bg-gray-800 shadow-md flex items-center justify-center">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={previewUrl} alt="Restaurant" className="w-full h-full object-cover" onError={() => setPreviewUrl("")} />
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
            <Link href="/partner-menu" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Utensils className="mr-3 w-5 h-5" /> Menu Management
            </Link>
            <Link href="/partner-statistics" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <BarChart2 className="mr-3 w-5 h-5" /> Statistics
            </Link>
            <Link href="/partner-profile" className="flex items-center px-4 py-3 rounded-xl bg-red-900/20 text-[#C62828] font-bold">
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
        <main className="flex-1 overflow-y-auto">

          {/* TOPBAR */}
          <header className="h-[80px] bg-white border-b border-gray-200 px-8 flex justify-between items-center shrink-0">
            <h2 className="text-2xl font-bold text-[#1C1C1C]">Settings &amp; Profile</h2>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C62828] bg-gray-200 flex items-center justify-center">
                {previewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={previewUrl} alt="Profile" className="w-full h-full object-cover" onError={() => {}} />
                ) : (
                  <span className="text-sm font-bold text-gray-500">{avatarLetter}</span>
                )}
              </div>
              <span className="font-bold text-[#1C1C1C]">{displayName}</span>
            </div>
          </header>

          {/* FORM AREA */}
          <div className="p-10 flex justify-center">
            <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

              {/* Banner + Avatar */}
              <div className="relative h-[180px] w-full bg-[#1C1C1C]">
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                <div className="absolute -bottom-14 left-10">
                  <div className="relative w-28 h-28 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg group flex items-center justify-center">
                    {previewUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={previewUrl} alt="Restaurant Avatar" className="w-full h-full object-cover" onError={() => setPreviewUrl("")} />
                    ) : (
                      <span className="text-5xl font-bold text-gray-400">{avatarLetter}</span>
                    )}
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <FaCamera className="text-xl mb-1" />
                      <span className="text-xs font-bold">Change</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="pt-20 px-10 pb-10">

                {/* Profile Image Section */}
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <FaCamera className="text-xl text-[#C62828]" />
                  <h3 className="text-xl font-bold text-[#1C1C1C]">Profile Image</h3>
                </div>

                <div className="mb-8 space-y-3">
                  <label className="text-sm font-bold text-gray-700">Image URL</label>
                  <div className="flex gap-3">
                    <input
                      id="settings-image-url"
                      type="url"
                      value={imageUrl}
                      onChange={handleImageUrlChange}
                      placeholder="https://example.com/your-restaurant-image.jpg"
                      className="flex-1 h-12 px-4 rounded-lg border border-gray-300 text-black focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={handlePreview}
                      className="px-5 h-12 rounded-lg border border-gray-300 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors whitespace-nowrap"
                    >
                      Preview
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Paste a direct image URL (jpg, png, webp). Click Preview to check it before saving.
                  </p>

                  {/* Preview box */}
                  {previewUrl && (
                    <div className="mt-3 flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                      <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700">Image Preview</p>
                        <p className="text-xs text-gray-400 break-all">{previewUrl}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Read-only info section */}
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                  <FaStore className="text-xl text-[#F7931E]" />
                  <h3 className="text-xl font-bold text-[#1C1C1C]">Account Information</h3>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Restaurant Name</label>
                    <input
                      type="text"
                      value={restaurant?.display_name || ""}
                      disabled
                      className="h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700">Business Phone</label>
                    <input
                      type="text"
                      value={restaurant?.phone || ""}
                      disabled
                      className="h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      Username <FaLock className="text-gray-400 text-xs" />
                    </label>
                    <input
                      type="text"
                      value={restaurant?.username || ""}
                      disabled
                      className="h-12 px-4 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <span className="text-xs text-gray-400">Used for login. Cannot be changed.</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-4 border-t border-gray-100 pt-6">
                  <button
                    type="button"
                    onClick={handleDiscard}
                    className="px-6 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Discard
                  </button>
                  <button
                    id="settings-save-image"
                    type="button"
                    onClick={handleSaveImage}
                    disabled={saving}
                    className="px-8 py-3 font-bold text-white bg-[#C1272D] hover:bg-red-800 rounded-lg transition-colors disabled:opacity-60 shadow-md"
                  >
                    {saving ? "Saving..." : "Save Image"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 text-white font-bold transition-all ${
          toast.type === "success" ? "bg-[#1C1C1C]" : "bg-red-700"
        }`}>
          <span className={`w-2 h-2 rounded-full ${toast.type === "success" ? "bg-green-400" : "bg-red-300"}`} />
          {toast.message}
        </div>
      )}
    </div>
  );
}