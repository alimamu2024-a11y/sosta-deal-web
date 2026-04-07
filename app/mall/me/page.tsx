"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { 
  User, ShoppingBag, Heart, Settings, LogOut, 
  Package, Truck, Star, Clock, Award, ChevronRight,
  Store, FileText, MessageCircle, HelpCircle, Share2,
  CreditCard, MapPin, Bell, Shield, Moon, Sun,
  Camera
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type UserData = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  joinDate: string;
  points: number;
  badge: string;
  ordersCount: number;
  wishlistCount: number;
  reviewsCount: number;
};

// Mock User Data
const mockUser: UserData = {
  id: "1",
  name: "Md. Rafiqul Islam",
  email: "rafiqul@example.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  phone: "+880 1712 345678",
  joinDate: "January 2024",
  points: 3450,
  badge: "Gold Member",
  ordersCount: 24,
  wishlistCount: 12,
  reviewsCount: 8,
};

const menuItems = [
  { icon: ShoppingBag, label: "My Orders", path: "/me/orders", color: "text-orange-500" },
  { icon: Heart, label: "Wishlist", path: "/me/wishlist", color: "text-red-500" },
  { icon: MapPin, label: "Address Book", path: "/me/address", color: "text-blue-500" },
  { icon: CreditCard, label: "Payment Methods", path: "/me/payments", color: "text-green-500" },
  { icon: Bell, label: "Notifications", path: "/me/notifications", color: "text-purple-500" },
  { icon: Shield, label: "Account Security", path: "/me/security", color: "text-gray-500" },
  { icon: HelpCircle, label: "Help Center", path: "/me/help", color: "text-teal-500" },
  { icon: Share2, label: "Invite Friends", path: "/me/invite", color: "text-pink-500" },
];

const sellerMenuItems = [
  { icon: Store, label: "Seller Dashboard", path: "/seller/dashboard", color: "text-orange-500" },
  { icon: Package, label: "Manage Products", path: "/seller/products", color: "text-blue-500" },
  { icon: Truck, label: "Manage Orders", path: "/seller/orders", color: "text-green-500" },
  { icon: FileText, label: "Analytics", path: "/seller/analytics", color: "text-purple-500" },
];

export default function MePage() {
  const router = useRouter();
  const { getCartCount } = useCart();
  const [isSeller, setIsSeller] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      router.push("/");
    }
  };

  return (
    <div className={`min-h-screen pb-24 ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white shadow-sm px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold">My Profile</h1>
        <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2 rounded-full hover:bg-gray-100">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Profile Card */}
      <div className={`mx-4 mt-4 rounded-2xl p-5 ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img src={mockUser.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-orange-500" />
            <button className="absolute bottom-0 right-0 bg-orange-500 text-white p-1 rounded-full">
              <Camera size={12} />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{mockUser.name}</h2>
              <button onClick={() => router.push("/me/edit")} className="text-xs text-orange-500">Edit</button>
            </div>
            <p className="text-sm text-gray-500">{mockUser.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Star size={10} /> {mockUser.badge}
              </div>
              <div className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <Award size={10} /> {mockUser.points} pts
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-500">{mockUser.ordersCount}</p>
            <p className="text-xs text-gray-500">Orders</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-500">{mockUser.wishlistCount}</p>
            <p className="text-xs text-gray-500">Wishlist</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-500">{mockUser.reviewsCount}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>
      </div>

      {/* Become a Seller Banner */}
      {!isSeller && (
        <div 
          onClick={() => router.push("/seller/register")}
          className="mx-4 mt-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-xs opacity-80">Sell on Tuni Mall</p>
              <h3 className="text-white font-bold text-lg">Become a Seller 🚀</h3>
              <p className="text-white text-xs opacity-80 mt-1">Start earning with us</p>
            </div>
            <div className="bg-white/20 p-3 rounded-full">
              <Store size={28} className="text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Seller Section (if already seller) */}
      {isSeller && (
        <div className="mx-4 mt-4">
          <h3 className="text-sm font-semibold mb-2">Seller Center</h3>
          <div className={`rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
            {sellerMenuItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center justify-between p-4 ${idx !== sellerMenuItems.length - 1 ? "border-b border-gray-100" : ""}`}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={item.color} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      <div className="mx-4 mt-4">
        <h3 className="text-sm font-semibold mb-2">Account Settings</h3>
        <div className={`rounded-2xl overflow-hidden ${isDarkMode ? "bg-gray-800" : "bg-white"} shadow-sm`}>
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center justify-between p-4 ${idx !== menuItems.length - 1 ? "border-b border-gray-100" : ""}`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={20} className={item.color} />
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <div className="mx-4 mt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 text-red-600 rounded-2xl font-semibold"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center py-2.5 border-t shadow-lg z-50">
        <button onClick={() => router.push("/mall")} className="flex flex-col items-center active:scale-95">
          <span className="text-xl">🏠</span>
          <span className="text-[8px] font-semibold text-gray-500">HOME</span>
        </button>
        <button onClick={() => router.push("/mall/category")} className="flex flex-col items-center active:scale-95">
          <span className="text-xl">📂</span>
          <span className="text-[8px] font-semibold text-gray-500">CATEGORY</span>
        </button>
        <button onClick={() => router.push("/mall/trending")} className="flex flex-col items-center active:scale-95">
          <span className="text-xl">🔥</span>
          <span className="text-[8px] font-semibold text-gray-500">TRENDING</span>
        </button>
        <button onClick={() => router.push("/mall/cart")} className="flex flex-col items-center active:scale-95 relative">
          <span className="text-xl">🛒</span>
          <span className="text-[8px] font-semibold text-gray-500">CART</span>
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[7px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
              {getCartCount()}
            </span>
          )}
        </button>
        <button onClick={() => router.push("/me")} className="flex flex-col items-center active:scale-95">
          <span className="text-xl">👤</span>
          <span className="text-[8px] font-semibold text-gray-500">ME</span>
        </button>
        <button onClick={() => { if(confirm("মার্কেট প্লেসে ফিরে যাবেন?")) router.push("/"); }} className="flex flex-col items-center active:scale-95">
          <span className="text-xl">🚪</span>
          <span className="text-[8px] font-semibold text-red-500">MALL EXIT</span>
        </button>
      </nav>
    </div>
  );
}