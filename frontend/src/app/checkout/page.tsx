"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaUser, FaTwitter, FaInstagram, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {getUserProfile, topUpSaldo} from "../../api/userApi";
import {createOrder} from "../../api/orderApi";
import {addOrderItem} from "../../api/orderApi";
import {createBill} from "../../api/billApi";
import {updateFoodStock} from "../../api/foodApi";
import { useRouter } from "next/navigation";


// will do
// create order header
// create order detail
// create bill
// deduct saldo
// redirect tracking
export default function CheckoutPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");

  const subtotal = cartItems.reduce((acc, item) => acc + Number(item.price) * item.quantity, 0);
  const platformFee = 2000;
  const totalAmount = subtotal + platformFee;
  
  // load cart + user
  useEffect(()=>{
    fetchProfile();

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const fetchProfile = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if(!userId) return; 
        const response = await getUserProfile(userId);
        setUserProfile(response.data);
      } catch (error){
        console.error("Failed to fetch profile", error);
      }
    };

  const handlePayment = async () => {
      try {
        
        setIsProcessing(true);  
        if(cartItems.length === 0) return;
        if(Number(userProfile?.saldo) < totalAmount){
          alert("Insufficient balance");
          setIsProcessing(false);
          return;
        }
        const restaurantId = cartItems[0].restaurant_id;

        // create order header
        const orderResponse = await createOrder({
          user_id: userProfile.user_id,
          restaurant_id: restaurantId,
          order_amount: totalAmount,
          order_status: "waiting",
          location
        });

        console.log(orderResponse);

        const orderId = orderResponse.data.order_id;

        //create order detail
        for(const item of cartItems){
          await addOrderItem({
            order_id:orderId,
            food_id: item.food_id,
            quantity: item.quantity,
            total_harga_food: Number(item.price) * item.quantity
          });
        }
        // create bill
        await createBill(
          orderId,
          {
            total_amount: totalAmount,
            platform_fee: platformFee
          }
        );
        // ini harusnya ga top up, tapi diganti negatif untuk sementara to deduce saldo
        await topUpSaldo(
          userProfile.user_id,
          -totalAmount
        );

        setIsSuccess(true);
        localStorage.removeItem("cart");
        setCartItems([]);

        // save for tracking
        localStorage.setItem("current_order_id", orderId);

        setTimeout(()=>{
          router.push('/tracking');
        }, 2000);

      } catch (error) {
        console.error(error);
      } finally{
        setIsProcessing(false);
      }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] relative flex flex-col font-sans text-[#1C1C1C]">
      
      {/* HEADER */}
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
          <span className="text-sm font-medium">Balance: Rp {
            Number(userProfile?.saldo || 0)
            .toLocaleString("id-ID")
          }
          </span>
          <div className="relative cursor-pointer">
            <FaShoppingCart className="text-2xl" />
            <div className="absolute -top-2 -right-2 bg-[#C1272D] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FaUser className="text-xl" />
            <span>{userProfile?.display_name || "Guest"}</span>
          </div>
        </div>
      </header>

      {/* 2. PAGE TITLE */}
      <div className="px-[80px] pt-[40px] pb-[20px]">
        <h1 className="text-3xl font-bold text-[#1C1C1C]">Finalize Your Order / 注文の確定</h1>
      </div>

      {/* 3. TWO-COLUMN CHECKOUT CONTENT */}
      <main className="px-[80px] pb-[60px] flex gap-[48px] flex-1">
        
        {/* Left Column */}
        <div className="w-[850px] shrink-0 flex flex-col gap-6">
          
          {/* Delivery Details Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaMapMarkerAlt className="text-[#C62828]" /> Delivery Details
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Delivery Location</label>
                <input 
                  type="text" 
                  placeholder="Enter delivery address"
                  value={location}
                  onChange={(e) =>setLocation(e.target.value)}
                  className="w-full h-[48px] px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C62828]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Note to Chef / Driver (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)} 
                  placeholder="e.g., Please make the ramen extra spicy..."
                  className="w-full h-[80px] p-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#C62828] resize-none"
                ></textarea>
              </div>
            </div>
          </section>

          {/* Order Summary Table */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4">Items Required</h2>
            <div className="w-full text-left border-collapse">
              <div className="grid grid-cols-12 text-sm font-semibold text-gray-500 border-b border-gray-200 pb-2 mb-4">
                <div className="col-span-6">Item</div>
                <div className="col-span-2 text-center">Qty</div>
                <div className="col-span-4 text-right">Subtotal</div>
              </div>
              <div className="flex flex-col gap-4">
                {cartItems.map(item => (
                  <div key={item.food_id} className="grid grid-cols-12 items-center">
                    <div className="col-span-6 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-md overflow-hidden bg-gray-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={item.url_img} alt={item.food_name} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-[#1C1C1C] line-clamp-2">{item.food_name}</span>
                    </div>
                    <div className="col-span-2 text-center font-medium">x{item.quantity}</div>
                    <div className="col-span-4 text-right font-semibold text-[#1C1C1C]">
                      Rp {(Number(item.price) * item.quantity).toLocaleString("id-ID")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Payment Method Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaCreditCard className="text-[#C62828]" /> Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-[#C62828] bg-red-50 rounded-xl p-4 cursor-pointer relative">
                <div className="absolute top-4 right-4 text-[#C62828]">
                  <FaCheckCircle className="text-xl" />
                </div>
                <h3 className="font-bold text-[#1C1C1C] mb-1">KoiBite Balance</h3>
                <p className="text-sm font-medium text-[#C62828]">Rp {Number(userProfile?.saldo).toLocaleString("id-ID") || 0}</p>
              </div>
              <div className="border border-gray-200 bg-white hover:border-[#C62828] transition-colors rounded-xl p-4 cursor-pointer">
                <h3 className="font-bold text-[#1C1C1C] mb-1">Credit / Debit Card</h3>
                <p className="text-sm text-gray-500">Visa, Mastercard, JCB</p>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (Summary sticky) */}
        <div className="flex-1 shrink-0 relative">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 sticky top-[100px]"
          >
            <h2 className="text-xl font-bold text-[#1C1C1C] mb-6">Payment Summary</h2>
            
            <div className="space-y-4 text-sm mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-[#1C1C1C]">Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Platform Fee</span>
                <span className="font-semibold text-[#1C1C1C]">Rp {platformFee.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-gray-300 pt-4 mb-8">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-[#1C1C1C]">Total Amount</span>
                <span className="text-2xl font-black text-[#C62828]">Rp {totalAmount.toLocaleString("id-ID")}</span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isSuccess ? (
                <motion.button
                  key="pay-button"
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-[64px] rounded-xl flex items-center justify-center font-bold text-lg text-white bg-[#4CAF50] hover:bg-[#43A047] transition-colors shadow-md disabled:opacity-80"
                >
                  {isProcessing ? (
                    <FaSpinner className="animate-spin text-2xl" />
                  ) : (
                    "Pay & Place Order"
                  )}
                </motion.button>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="w-full h-[64px] rounded-xl flex items-center justify-center gap-2 font-bold text-lg text-white bg-[#C62828] shadow-md"
                >
                  <FaCheckCircle className="text-2xl" />
                  Order Placed!
                </motion.div>
              )}
            </AnimatePresence>

            {isSuccess && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-gray-500 mt-4 font-medium"
              >
                Redirecting to order tracking...
              </motion.p>
            )}

          </motion.div>
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