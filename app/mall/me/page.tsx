// app/mall/me/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import imageCompression from "browser-image-compression";
import { 
  ShoppingBag, Heart, Star, Settings, LogOut,
  Truck, ChevronRight, Edit2, Camera, Store, Award, Sparkles,
  TrendingUp, Flame, Trophy, Crown, Eye, Share2,
  MessageCircle, Loader2, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== TYPES ====================
type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
  image: string;
};

type WishlistItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
};

type TrendingStats = {
  rank: number;
  points: number;
  badge: string;
  badgeColor: string;
  views: number;
  likes: number;
  shares: number;
};

type LocalUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isSeller: boolean;
  joinDate?: string;
  points?: number;
};

// ==================== MOCK DATA ====================
const mockOrders: Order[] = [
  { id: "ORD001", date: "2024-03-15", total: 12999, status: "Delivered", items: 2, image: "https://picsum.photos/seed/order1/100/100" },
  { id: "ORD002", date: "2024-03-10", total: 8999, status: "Shipped", items: 1, image: "https://picsum.photos/seed/order2/100/100" },
  { id: "ORD003", date: "2024-03-05", total: 3499, status: "Processing", items: 3, image: "https://picsum.photos/seed/order3/100/100" },
];

const mockWishlist: WishlistItem[] = [
  { id: "1", title: "iPhone 15 Pro Max", price: 129999, image: "https://picsum.photos/seed/wish1/200/200", rating: 4.9 },
  { id: "2", title: "Samsung S24 Ultra", price: 119999, image: "https://picsum.photos/seed/wish2/200/200", rating: 4.8 },
  { id: "3", title: "Nike Air Max", price: 8999, image: "https://picsum.photos/seed/wish3/200/200", rating: 4.7 },
];

const mockTrendingStats: TrendingStats = {
  rank: 42,
  points: 1250,
  badge: "Platinum",
  badgeColor: "from-purple-500 to-pink-500",
  views: 45678,
  likes: 2345,
  shares: 1234,
};

// ==================== MAIN COMPONENT ====================
export default function MallMePage() {
  const router = useRouter();
  const { logout, becomeSeller, isLoading } = useAuth();
  const { getCartCount } = useCart();
  const [activeTab, setActiveTab] = useState("overview");
  const [localUser, setLocalUser] = useState<LocalUser | null>(null);
  const [profileImage, setProfileImage] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [sellerApp, setSellerApp] = useState({ storeName: "", phone: "", description: "" });
  const [wishlistMsg, setWishlistMsg] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("sosta_user");
    if (stored) {
      const userData: LocalUser = JSON.parse(stored);
      setLocalUser(userData);
      setProfileImage(userData.avatar);
    } else if (!isLoading) {
      router.push("/login");
    }
  }, [isLoading, router]);

  const compressImage = async (file: File): Promise<File> => {
    const options = { maxSizeMB: 0.05, maxWidthOrHeight: 600, useWebWorker: true, fileType: "image/jpeg" };
    try { return await imageCompression(file, options); } catch { return file; }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const compressed = await compressImage(file);
    const preview = URL.createObjectURL(compressed);
    setProfileImage(preview);
    if (localUser) {
      const updated = { ...localUser, avatar: preview };
      localStorage.setItem("sosta_user", JSON.stringify(updated));
      setLocalUser(updated);
    }
    alert("Profile picture updated");
    setIsUploading(false);
  };

  const handleBecomeSeller = () => {
    if (!sellerApp.storeName) {
      alert("Please enter store name");
      return;
    }
    becomeSeller();
    if (localUser) {
      const updated = { ...localUser, isSeller: true };
      localStorage.setItem("sosta_user", JSON.stringify(updated));
      setLocalUser(updated);
    }
    setShowSellerForm(false);
    alert("You are now a seller on Tuni Mall! Visit Seller Dashboard.");
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlistMsg("Removed from wishlist");
    setTimeout(() => setWishlistMsg(""), 1500);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Delivered": return "text-green-600 bg-green-50";
      case "Shipped": return "text-blue-600 bg-blue-50";
      case "Processing": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (isLoading || !localUser) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-orange-500" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      
      <AnimatePresence>
        {wishlistMsg && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-14 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-full text-[11px] z-50"
          >
            {wishlistMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 pb-8">
        <div className="flex justify-between items-start">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full">← Back</button>
          <button onClick={() => router.push("/mall/me/settings")} className="p-2 bg-white/20 rounded-full"><Settings size={20} /></button>
        </div>
        <div className="flex flex-col items-center mt-2">
          <div className="relative">
            <img src={profileImage} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" alt={localUser.name} />
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md" disabled={isUploading}>
              {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} className="text-orange-500" />}
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleProfileUpload} />
          </div>
          <h2 className="text-xl font-bold mt-3">{localUser.name}</h2>
          <p className="text-sm opacity-90">{localUser.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="bg-white/20 text-xs px-3 py-1 rounded-full">Member</span>
            {localUser.isSeller && <span className="bg-green-500/80 text-xs px-3 py-1 rounded-full">Seller</span>}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-6">
        <div className="grid grid-cols-3 gap-3 bg-white rounded-2xl p-4 shadow-md">
          <div className="text-center"><p className="text-2xl font-bold text-orange-500">12</p><p className="text-[10px] text-gray-500">Orders</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-red-500">8</p><p className="text-[10px] text-gray-500">Wishlist</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-green-500">0</p><p className="text-[10px] text-gray-500">Products</p></div>
        </div>
      </div>

      {/* Trending Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-md">
        <div className="flex justify-between items-center">
          <div><div className="flex items-center gap-1"><Flame size={16} /><span className="text-xs font-bold">Trending Score</span></div><p className="text-2xl font-bold mt-1">#{mockTrendingStats.rank}</p><p className="text-[10px] opacity-80">Global Rank</p></div>
          <div className="text-right"><div className="flex gap-2"><div className="text-center"><Eye size={14} className="mx-auto" /><p className="text-xs">{mockTrendingStats.views.toLocaleString()}</p><p className="text-[8px]">Views</p></div><div className="text-center"><Heart size={14} className="mx-auto" /><p className="text-xs">{mockTrendingStats.likes.toLocaleString()}</p><p className="text-[8px]">Likes</p></div><div className="text-center"><Share2 size={14} className="mx-auto" /><p className="text-xs">{mockTrendingStats.shares.toLocaleString()}</p><p className="text-[8px]">Shares</p></div></div></div>
        </div>
        <div className="mt-2 pt-2 border-t border-white/20 flex justify-between"><div className="flex items-center gap-1"><Award size={14} /><span className="text-xs">{mockTrendingStats.points} pts</span></div><div className={`bg-gradient-to-r ${mockTrendingStats.badgeColor} text-white text-xs px-2 py-0.5 rounded-full`}>{mockTrendingStats.badge}</div></div>
      </div>

      {/* Tabs – শুধুমাত্র সাধারণ ট্যাব (সেলার ড্যাশবোর্ড নেই) */}
      <div className="flex overflow-x-auto bg-white border-b px-4 gap-2 sticky top-0 z-10 mt-4">
        <button onClick={() => setActiveTab("overview")} className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition ${activeTab === "overview" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>Overview</button>
        <button onClick={() => setActiveTab("orders")} className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition ${activeTab === "orders" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>Orders</button>
        <button onClick={() => setActiveTab("wishlist")} className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition ${activeTab === "wishlist" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>Wishlist</button>
        <button onClick={() => setActiveTab("trending")} className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition ${activeTab === "trending" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>Trending</button>
      </div>

      <div className="p-4 space-y-4">
        
        {/* ========== OVERVIEW TAB ========== */}
        {activeTab === "overview" && (
          <>
            {/* সেলার না হলে সেলার হওয়ার অপশন */}
            {!localUser.isSeller && !showSellerForm && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 cursor-pointer" onClick={() => setShowSellerForm(true)}>
                <div className="flex justify-between items-center"><div><p className="text-white text-xs opacity-80">Sell on Tuni Mall</p><h3 className="text-white font-bold text-lg">Become a Seller 🚀</h3><p className="text-white text-xs opacity-80 mt-1">Start earning with us</p></div><div className="bg-white/20 p-3 rounded-full"><Store size={28} className="text-white" /></div></div>
              </div>
            )}
            {showSellerForm && (
              <div className="bg-white rounded-2xl p-5 shadow-md"><h3 className="font-bold text-lg mb-3">Seller Registration</h3><input type="text" placeholder="Store Name *" value={sellerApp.storeName} onChange={(e) => setSellerApp({...sellerApp, storeName: e.target.value})} className="w-full border rounded-xl p-3 mb-3" /><input type="tel" placeholder="Phone Number" value={sellerApp.phone} onChange={(e) => setSellerApp({...sellerApp, phone: e.target.value})} className="w-full border rounded-xl p-3 mb-3" /><textarea placeholder="Store Description" rows={3} value={sellerApp.description} onChange={(e) => setSellerApp({...sellerApp, description: e.target.value})} className="w-full border rounded-xl p-3 mb-4"></textarea><div className="flex gap-3"><button onClick={handleBecomeSeller} className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-semibold">Submit</button><button onClick={() => setShowSellerForm(false)} className="flex-1 border border-gray-300 py-2 rounded-xl">Cancel</button></div></div>
            )}

            {/* সেলার হয়ে গেলে ড্যাশবোর্ড লিংক */}
            {localUser.isSeller && (
              <div className="bg-white rounded-2xl p-4 shadow-md flex justify-between items-center">
                <div><h3 className="font-semibold">Seller Dashboard</h3><p className="text-xs text-gray-500">Manage products, orders & more</p></div>
                <button onClick={() => router.push("/mall/seller/dashboard")} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm">Go to Dashboard →</button>
              </div>
            )}

            {/* সাধারণ অপশন */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md">
              <button onClick={() => setActiveTab("orders")} className="w-full flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex gap-3"><ShoppingBag size={20} className="text-orange-500" /><span>My Orders</span></div><ChevronRight size={16} />
              </button>
              <button onClick={() => setActiveTab("wishlist")} className="w-full flex items-center justify-between p-4 border-b border-gray-100">
                <div className="flex gap-3"><Heart size={20} className="text-red-500" /><span>Wishlist</span></div><ChevronRight size={16} />
              </button>
              <button className="w-full flex items-center justify-between p-4">
                <div className="flex gap-3"><MessageCircle size={20} className="text-blue-500" /><span>Messages</span></div><ChevronRight size={16} />
              </button>
            </div>
            <button onClick={() => { if(confirm("Logout?")) { logout(); router.push("/login"); } }} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold">Logout</button>
          </>
        )}

        {/* ========== ORDERS TAB ========== */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            {mockOrders.map(order => (
              <div key={order.id} className="p-4 border-b border-gray-100"><div className="flex gap-3"><img src={order.image} className="w-16 h-16 rounded-lg object-cover" /><div className="flex-1"><div className="flex justify-between"><p className="font-semibold">Order #{order.id}</p><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></div><p className="text-[10px] text-gray-400">{order.date}</p><p className="text-xs mt-1">{order.items} items • ৳{order.total.toLocaleString()}</p><button className="text-[10px] text-orange-500 mt-1">Track Order →</button></div></div></div>
            ))}
            <button className="w-full p-3 text-center text-orange-500 text-sm font-medium">View All Orders →</button>
          </div>
        )}

        {/* ========== WISHLIST TAB ========== */}
        {activeTab === "wishlist" && (
          <div className="space-y-3">
            {mockWishlist.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center"><Heart size={48} className="text-gray-300 mx-auto mb-3" /><h3 className="font-semibold">Your wishlist is empty</h3><button onClick={() => router.push("/mall")} className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-full text-sm">Start Shopping →</button></div>
            ) : (
              mockWishlist.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3"><img src={item.image} className="w-20 h-20 rounded-xl object-cover" /><div className="flex-1"><h3 className="font-semibold text-sm">{item.title}</h3><div className="flex items-center gap-1"><Star size={12} className="fill-yellow-400" /><span className="text-xs">{item.rating}</span></div><p className="text-orange-500 font-bold text-sm">৳{item.price.toLocaleString()}</p><div className="flex gap-2 mt-2"><button className="bg-black text-white text-[10px] px-3 py-1 rounded-full">Add to Cart</button><button onClick={() => handleRemoveFromWishlist(item.id)} className="border border-red-500 text-red-500 text-[10px] px-3 py-1 rounded-full">Remove</button></div></div></div>
              ))
            )}
          </div>
        )}

        {/* ========== TRENDING TAB ========== */}
        {activeTab === "trending" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-md"><div className="flex justify-between items-center mb-4"><div className="flex gap-2"><Trophy size={20} className="text-yellow-500" /><h3 className="font-bold">Your Trending Score</h3></div><span className="text-2xl font-bold text-orange-500">#{mockTrendingStats.rank}</span></div><div className="grid grid-cols-3 gap-3 text-center"><div className="p-2 bg-gray-50 rounded-xl"><Eye size={16} className="mx-auto text-gray-500" /><p className="text-sm font-bold mt-1">{mockTrendingStats.views.toLocaleString()}</p><p className="text-[9px] text-gray-400">Views</p></div><div className="p-2 bg-gray-50 rounded-xl"><Heart size={16} className="mx-auto text-red-500" /><p className="text-sm font-bold mt-1">{mockTrendingStats.likes.toLocaleString()}</p><p className="text-[9px] text-gray-400">Likes</p></div><div className="p-2 bg-gray-50 rounded-xl"><Share2 size={16} className="mx-auto text-blue-500" /><p className="text-sm font-bold mt-1">{mockTrendingStats.shares.toLocaleString()}</p><p className="text-[9px] text-gray-400">Shares</p></div></div></div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4"><div className="flex gap-2"><Sparkles size={18} className="text-white" /><h3 className="text-white font-bold">Boost Your Rank!</h3></div><p className="text-white text-xs opacity-90 mt-1">Share products, get likes, write reviews.</p><button className="mt-2 bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full">Learn More →</button></div>
            <div className="bg-white rounded-2xl p-4 shadow-md"><h3 className="font-bold text-sm mb-2 flex gap-2"><TrendingUp size={16} className="text-orange-500" /> Trending Tips</h3><div className="space-y-2 text-xs"><div className="flex gap-2"><Crown size={12} className="text-yellow-500" /> Complete your profile</div><div className="flex gap-2"><Heart size={12} className="text-red-500" /> Get 100+ likes</div><div className="flex gap-2"><Star size={12} className="text-yellow-500" /> Receive 5-star reviews</div></div></div>
          </div>
        )}
      </div>
    </div>
  );
}