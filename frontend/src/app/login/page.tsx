"use client";

import Image from "next/image";
import Link from "next/link";
import { FaTwitter, FaInstagram } from "react-icons/fa";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {loginUser} from "../../api/userApi";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export default function Login() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      setError("");
      try {
        const response = await loginUser({username, password});
        localStorage.setItem(
            "token", response.data.token
        );
        localStorage.setItem(
            "role", "user"
        );
        router.push("homepage");
      } catch (error) {
        setError("Login failed");
      } finally{
        setLoading(true);
      }
    };
  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-[#2D2D2D] text-white py-4 px-8 flex justify-between items-center whitespace-nowrap">
        <div className="flex items-center">
          <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={120} height={40} className="object-contain" />
        </div>
        <div className="flex space-x-8 text-lg">
          <Link href="/explore" className="hover:text-gray-300">Explore</Link>
          <Link href="/favorites" className="hover:text-gray-300">Favorites</Link>
          <Link href="/orders" className="hover:text-gray-300">Orders</Link>
          <Link href="/register" className="hover:text-gray-300">Register</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col md:flex-row">
        {/* Left Section - Image */}
        <div className="md:w-1/2 relative min-h-[600px] bg-[#1E1E1E]">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image
            // Path default jika file sudah berada di dalam folder public: 
            src="/image1.png"
            alt="Sushi Background"
            fill
            className="object-cover"
            priority
            unoptimized
          />
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-start p-12 text-white">
            <h1 className="text-5xl font-semibold mb-4 drop-shadow-md">Sayonara, Doomscrolling</h1>
            <p className="text-lg opacity-90 drop-shadow-md">Tell us your craving. Let the algorithm serve your perfect match.</p>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="md:w-1/2 bg-[#FCFAF8] flex justify-center items-center p-8">
          <div className="bg-white border-2 border-gray-400 rounded-lg p-10 w-full max-w-md shadow-sm">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-medium text-gray-800">Irasshaimase!</h2>
              <p className="text-sm text-gray-500">(いらっしゃいませ)</p>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) =>setUsername(e.target.value)}
                  className="w-full border border-gray-400 rounded-md p-2 text-black focus:outline-none focus:border-red-600"
                />
              </div>
              
              <div>
                <label className="block text-xs text-gray-600 mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) =>setPassword(e.target.value)}
                  className="w-full border border-gray-400 rounded-md p-2 text-black focus:outline-none focus:border-red-600"
                />
              </div>


              <div className="pt-2">
                <Link href="/register" className="text-xs text-[#0099FF] hover:underline">
                  Do not have an account? Register here
                </Link>
              </div>

              <div className="pt-4 flex justify-center">
                <button
                  type="submit"
                  className="bg-[#C1272D] text-white px-12 py-2 text-sm rounded-md hover:bg-red-800 transition-colors"
                >
                  {loading? "Loading..." : "login"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2D2D2D] text-white py-12 px-8 flex flex-col md:flex-row justify-between text-sm w-full">
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
