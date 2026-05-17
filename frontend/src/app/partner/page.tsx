"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { loginRestaurant, registerRestaurant } from "@/api/restaurantApi";

export default function PartnerAuthPage() {
  const router = useRouter();
  const [isLoginMode, setIsLoginMode] = useState(true);

  // Shared fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register-only fields
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const switchMode = (mode: boolean) => {
    setIsLoginMode(mode);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLoginMode) {
        const res = await loginRestaurant({ username, password });
        console.log("Restaurant login response:", res);
        if (res.success) {
          if (res.data?.token) {
            localStorage.setItem("restaurant_token", res.data.token);
          }
          if (res.data?.restaurant) {
            localStorage.setItem("restaurant", JSON.stringify(res.data.restaurant));
          }
          router.push("/partner-dashboard");
        } else {
          setError(res.message || "Login failed.");
        }
      } else {
        const res = await registerRestaurant({
          username,
          password,
          display_name: displayName,
          phone: phone ? `+62${phone}` : undefined,
        });
        console.log("Restaurant register response:", res);
        if (res.success) {
          setSuccess("Restaurant registered! You can now log in.");
          setIsLoginMode(true);
          setUsername("");
          setPassword("");
          setDisplayName("");
          setPhone("");
        } else {
          setError(res.message || "Registration failed.");
        }
      }
    } catch (err: any) {
      console.error("Partner auth error:", err);
      setError(
        err?.response?.data?.message || err?.message || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-[#1C1C1C] bg-[#FDFBF7] overflow-x-hidden">

      {/* HEADER */}
      <header className="h-[80px] bg-[#2D2D2D] text-white flex justify-between items-center px-8 shrink-0 z-50">
        <div className="flex items-center">
          <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="flex space-x-8 text-lg">
          <Link href="/explore" className="hover:text-gray-300">Explore</Link>
          <Link href="/homepage" className="hover:text-gray-300">Home</Link>
          <Link href="/login" className="hover:text-gray-300">Customer Login</Link>
        </div>
      </header>

      {/* SPLIT CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row">

        {/* LEFT: Visual Branding */}
        <div className="md:w-1/2 relative min-h-[600px] shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1578474846511-04ba529f0b88?q=80&w=1000&auto=format&fit=crop"
            alt="Professional Japanese Chef"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-[#1C1C1C] bg-opacity-60" />
          <div className="absolute inset-0 flex flex-col justify-center px-12 lg:px-20 text-white">
            <h1 className="text-5xl font-bold leading-tight mb-4 drop-shadow-md">
              Empower Your <br />Kitchen.
            </h1>
            <p className="text-lg opacity-90 drop-shadow-md max-w-[500px]">
              Join KoiBite as a Partner. Let our smart matchmaking algorithm bring the right hungry customers directly to your tables.
            </p>
          </div>
        </div>

        {/* RIGHT: Form */}
        <div className="md:w-1/2 flex flex-col justify-center items-center py-12 px-4">
          <div className="w-full max-w-md flex flex-col">
            <h2 className="text-3xl font-bold text-[#1C1C1C] mb-8 text-center">Partner Portal</h2>

            {/* Toggle */}
            <div className="flex p-1 bg-gray-200 rounded-full mb-8 shrink-0">
              <button
                type="button"
                onClick={() => switchMode(true)}
                className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  isLoginMode ? "bg-white shadow-sm text-[#1C1C1C]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => switchMode(false)}
                className={`flex-1 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                  !isLoginMode ? "bg-white shadow-sm text-[#1C1C1C]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Register
              </button>
            </div>

            <form className="flex flex-col w-full" onSubmit={handleSubmit}>

              {/* Restaurant Name (register only) */}
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
                        id="partner-display-name"
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Paragita Sushi & Grill"
                        required={!isLoginMode}
                        className="h-[48px] w-full px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Username (always) */}
              <div className="flex flex-col gap-1 mb-4 shrink-0">
                <label className="text-sm font-semibold text-gray-700">Username</label>
                <input
                  id="partner-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. paragita_sushi"
                  required
                  autoComplete="username"
                  className="h-[48px] w-full px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                />
              </div>

              {/* Phone (register only) */}
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
                      <label className="text-sm font-semibold text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-gray-600 text-sm">
                          +62
                        </span>
                        <input
                          id="partner-phone"
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="81234567890"
                          required={!isLoginMode}
                          className="h-[48px] flex-1 w-full px-4 bg-white border border-gray-200 rounded-r-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400">e.g. 81234567890 (without leading 0)</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Password (always) */}
              <div className="flex flex-col gap-1 mb-4 shrink-0">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <input
                  id="partner-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete={isLoginMode ? "current-password" : "new-password"}
                  className="h-[48px] w-full px-4 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#C62828] focus:ring-1 focus:ring-[#C62828] transition-colors"
                />
                {!isLoginMode && (
                  <p className="text-[10px] text-gray-400 mt-1">Must contain uppercase, lowercase, number &amp; special character</p>
                )}
              </div>

              {/* Feedback */}
              {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
              {success && <p className="text-sm text-green-600 mb-3">{success}</p>}

              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.98 }}
                className="w-full h-[56px] bg-[#C62828] disabled:bg-gray-300 disabled:text-gray-500 text-white font-bold text-lg rounded-xl mt-4 shadow-md hover:bg-red-800 transition-colors shrink-0"
              >
                {loading
                  ? (isLoginMode ? "Logging in..." : "Registering...")
                  : (isLoginMode ? "Log Into Dashboard" : "Register as Partner")}
              </motion.button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-8 font-medium">
              Need help? <Link href="#" className="text-[#1C1C1C] hover:underline">Contact Merchant Support</Link>
            </p>
          </div>
        </div>
      </div>

      {/* FOOTER */}
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
              <li><Link href="/" className="hover:text-white">Top Rated Foods</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-300">PARTNER</h3>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link href="/partner" className="hover:text-white">Partner Portal</Link></li>
              <li><Link href="/partner-dashboard" className="hover:text-white">Dashboard</Link></li>
              <li><Link href="/partner-menu" className="hover:text-white">Manage Menu</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-gray-300">SUPPORT</h3>
            <ul className="space-y-2 text-gray-400 text-xs">
              <li><Link href="/" className="hover:text-white">Help Center/FAQ</Link></li>
              <li><Link href="/" className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex space-x-4 md:w-1/4 justify-end items-start">
          <div className="text-2xl cursor-pointer hover:text-gray-300 text-gray-400">T</div>
          <div className="text-2xl cursor-pointer hover:text-gray-300 text-gray-400">I</div>
        </div>
      </footer>
    </div>
  );
}