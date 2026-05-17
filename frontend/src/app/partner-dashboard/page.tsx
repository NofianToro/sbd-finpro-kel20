"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Utensils, BarChart2, Settings, Bell } from "lucide-react";
import { getRestaurantOrders, updateOrderStatus } from "@/api/restaurantApi";

type OrderStatus = "ordered" | "processing" | "delivery" | "done";

interface OrderItem {
  food_name: string;
  quantity: number;
  price: number;
}

interface Order {
  order_id: string;
  items: OrderItem[];
  total_price: number;
  status: OrderStatus;
  created_at: string;
}

const STATUS_FLOW: Record<OrderStatus, OrderStatus> = {
  ordered: "processing",
  processing: "delivery",
  delivery: "done",
  done: "done",
};

const STATUS_MAP: Record<string, OrderStatus> = {
  ordered: "ordered",
  processing: "processing",
  delivery: "delivery",
  done: "done",
};

export default function RestaurantDashboard() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurant, setRestaurant] = useState<{ restaurant_id?: string; display_name?: string; username?: string; url_img?: string } | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [currentTime, setCurrentTime] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [movingId, setMovingId] = useState<string | null>(null);

  // Auth guard + load restaurant info from localStorage
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem("restaurant_token");
    if (!token) {
      router.push("/partner-login");
      return;
    }
    const stored = localStorage.getItem("restaurant");
    if (stored) {
      setRestaurant(JSON.parse(stored));
    }
  }, [router]);

  // Clock
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" }) +
          " | " +
          now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Fetch orders
  const fetchOrders = useCallback(async () => {
    if (!restaurant?.restaurant_id) return;
    setLoadingOrders(true);
    try {
      const res = await getRestaurantOrders(restaurant.restaurant_id);
      if (res.success && res.data) {
        // Normalize status to known type, default to "ordered"
        const normalized: Order[] = res.data.map((o: any) => ({
          order_id: String(o.order_id),
          items: o.items || [],
          total_price: Number(o.total_price ?? o.order_amount ?? o.total ?? 0),
          status: STATUS_MAP[o.status ?? o.order_status] ?? "ordered",
          created_at: (o.created_at || o.order_date)
            ? new Date(o.created_at || o.order_date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
            : "--:--",
        }));
        setOrders(normalized);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  }, [restaurant?.restaurant_id]);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30s
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  // Advance an order to the next status
  const moveOrder = async (order_id: string, currentStatus: OrderStatus) => {
    const nextStatus = STATUS_FLOW[currentStatus];
    if (nextStatus === currentStatus) return;
    setMovingId(order_id);
    try {
      await updateOrderStatus(order_id, nextStatus);
      setOrders((prev) =>
        prev.map((o) => (o.order_id === order_id ? { ...o, status: nextStatus } : o))
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    } finally {
      setMovingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("restaurant_token");
    localStorage.removeItem("restaurant");
    router.push("/partner-login");
  };

  const renderColumn = (
    title: string,
    status: OrderStatus,
    badgeColor: string,
    buttonText: string,
    buttonColor: string
  ) => {
    const columnOrders = orders.filter((o) => o.status === status);
    return (
      <div className="flex-1 min-w-[300px] bg-gray-50 rounded-xl p-4 flex flex-col border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
          <h3 className="font-bold text-[#1C1C1C] text-lg">{title}</h3>
          <span className={`px-2 py-1 rounded-full text-xs font-bold text-white ${badgeColor}`}>
            {columnOrders.length}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
          <AnimatePresence>
            {columnOrders.map((order) => (
              <motion.div
                key={order.order_id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-[#1C1C1C] text-sm">#{order.order_id}</span>
                  <span className="text-xs text-gray-500">{order.created_at}</span>
                </div>

                <div className="text-sm text-gray-700">
                  {order.items.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1 my-2">
                      {order.items.map((item, idx) => (
                        <li key={idx}>
                          <span className="font-medium">{item.quantity}x</span> {item.food_name}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-400 text-xs my-2">No item details</p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-1">
                  <span className="font-bold text-[#1C1C1C] text-sm">
                    Rp {order.total_price.toLocaleString("id-ID")}
                  </span>
                  {status !== "done" ? (
                    <button
                      onClick={() => moveOrder(order.order_id, status)}
                      disabled={movingId === order.order_id}
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg text-white transition-all transform active:scale-95 disabled:opacity-50 ${buttonColor}`}
                    >
                      {movingId === order.order_id ? "..." : buttonText}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-green-600 px-3 py-1.5 bg-green-50 rounded-lg">
                      Completed
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {columnOrders.length === 0 && (
            <div className="text-center text-gray-400 py-8 text-sm">
              {loadingOrders ? "Loading..." : "No orders here."}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col font-sans relative shadow-2xl overflow-hidden">

      {/* TOP HEADER */}
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

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-[280px] bg-[#1C1C1C] text-white flex flex-col shrink-0 relative z-20">
          <div className="px-6 py-10 border-b border-gray-800 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-gray-700 bg-gray-800 shadow-md flex items-center justify-center">
              {restaurant?.url_img ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={restaurant.url_img} alt="Restaurant" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-500">
                  {(restaurant?.display_name || restaurant?.username || "R")[0].toUpperCase()}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-bold mb-1">
              {restaurant?.display_name || restaurant?.username || "Loading..."}
            </h2>
            <p className="text-sm text-gray-400">Partner Dashboard</p>
          </div>

          <nav className="flex-1 px-4 space-y-2 pt-4">
            <Link href="/partner-dashboard" className="flex items-center px-4 py-3 rounded-xl bg-red-900/20 text-[#C62828] font-bold">
              <Package className="mr-3 w-5 h-5" /> Orders
            </Link>
            <Link href="/partner-menu" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <Utensils className="mr-3 w-5 h-5" /> Menu Management
            </Link>
            <Link href="/partner-statistics" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
              <BarChart2 className="mr-3 w-5 h-5" /> Statistics
            </Link>
            <Link href="/partner-profile" className="flex items-center px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors font-medium">
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
        <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">

          {/* TOPBAR */}
          <header className="h-[80px] bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
            <div>
              <span className="text-sm font-semibold text-gray-600">{currentTime || "Loading time..."}</span>
            </div>

            <div className="flex items-center gap-6">
              {/* Restaurant Open/Close Toggle */}
              <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-200">
                <span className={`text-sm font-bold ${isOpen ? "text-green-600" : "text-gray-400"}`}>
                  {isOpen ? "Restaurant Open" : "Closed"}
                </span>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors ${isOpen ? "bg-green-500" : "bg-gray-300"}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${isOpen ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Refresh button */}
              <button
                onClick={fetchOrders}
                className="text-sm text-gray-500 hover:text-[#C62828] transition-colors font-medium"
              >
                ↻ Refresh
              </button>

              {/* Notification Bell */}
              <div className="relative cursor-pointer">
                <Bell className="w-6 h-6 text-gray-600" />
                {orders.filter(o => o.status === "ordered").length > 0 && (
                  <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                )}
              </div>
            </div>
          </header>

          {/* KANBAN BOARD */}
          <div className="flex-1 p-8 flex flex-col overflow-hidden">
            <div className="mb-8 shrink-0 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-[#1C1C1C] mb-1">Live Order Management</h1>
                <span className="text-gray-500 text-sm font-medium">注文管理</span>
              </div>
              <span className="text-sm text-gray-400">
                {loadingOrders ? "Loading orders..." : `${orders.length} total orders`}
              </span>
            </div>

            <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
              <div className="flex gap-6 h-full items-start">
                {renderColumn("New Orders", "ordered", "bg-red-500", "Accept & Cook", "bg-[#C62828] hover:bg-red-800")}
                {renderColumn("Cooking", "processing", "bg-orange-500", "Send to Driver", "bg-blue-600 hover:bg-blue-700")}
                {renderColumn("On Delivery", "delivery", "bg-blue-500", "Mark as Done", "bg-green-600 hover:bg-green-700")}
                {renderColumn("Completed", "done", "bg-green-500", "", "")}
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="bg-[#2D2D2D] text-white py-8 px-8 flex justify-between text-sm shrink-0">
            <div className="flex flex-col">
              <Image src="/KoiBite_logo.png" alt="KoiBite Logo" width={120} height={40} className="object-contain" />
              <p className="text-xs text-gray-400 mt-2">© 2026 Kelompok Sembilan Belas.</p>
            </div>
            <div className="flex items-center gap-6 text-gray-400 text-xs">
              <Link href="/" className="hover:text-white">Help</Link>
              <Link href="/" className="hover:text-white">Privacy</Link>
              <Link href="/" className="hover:text-white">Terms</Link>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}