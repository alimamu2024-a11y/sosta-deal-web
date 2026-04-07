"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, ArrowLeft, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/context/CartContext";

// ============ ক্যাটাগরি ডাটা ============
const ALL_CATEGORIES = [
  { id: 1, name: "ফ্যাশন", icon: "👕", color: "from-pink-500 to-rose-500", productCount: 1250 },
  { id: 2, name: "ইলেকট্রনিক্স", icon: "📱", color: "from-blue-500 to-cyan-500", productCount: 890 },
  { id: 3, name: "হোম", icon: "🏠", color: "from-green-500 to-emerald-500", productCount: 560 },
  { id: 4, name: "বিউটি", icon: "💄", color: "from-purple-500 to-pink-500", productCount: 430 },
  { id: 5, name: "স্পোর্টস", icon: "⚽", color: "from-orange-500 to-red-500", productCount: 320 },
  { id: 6, name: "মোবাইল", icon: "📱", color: "from-indigo-500 to-purple-500", productCount: 2100 },
  { id: 7, name: "কম্পিউটার", icon: "💻", color: "from-gray-600 to-gray-800", productCount: 670 },
  { id: 8, name: "ঘড়ি", icon: "⌚", color: "from-slate-500 to-gray-600", productCount: 340 },
  { id: 9, name: "ব্যাগ", icon: "👜", color: "from-amber-500 to-orange-500", productCount: 280 },
  { id: 10, name: "জুতা", icon: "👟", color: "from-red-500 to-orange-500", productCount: 450 },
  { id: 11, name: "গহনা", icon: "💍", color: "from-yellow-500 to-amber-500", productCount: 190 },
  { id: 12, name: "বই", icon: "📚", color: "from-emerald-600 to-green-600", productCount: 520 },
  { id: 13, name: "খেলনা", icon: "🧸", color: "from-yellow-500 to-orange-500", productCount: 310 },
  { id: 14, name: "স্বাস্থ্য", icon: "💪", color: "from-teal-500 to-green-500", productCount: 240 },
  { id: 15, name: "পোষ্য", icon: "🐕", color: "from-amber-400 to-yellow-500", productCount: 120 },
  { id: 16, name: "ফার্নিচার", icon: "🛋️", color: "from-stone-500 to-stone-700", productCount: 380 },
  { id: 17, name: "গেমিং", icon: "🎮", color: "from-purple-600 to-indigo-600", productCount: 290 },
  { id: 18, name: "মিউজিক", icon: "🎵", color: "from-red-600 to-pink-600", productCount: 210 },
  { id: 19, name: "ক্যামেরা", icon: "📷", color: "from-gray-500 to-gray-700", productCount: 160 },
  { id: 20, name: "বেবি", icon: "👶", color: "from-sky-400 to-blue-500", productCount: 350 },
  { id: 21, name: "স্টেশনারি", icon: "✏️", color: "from-lime-500 to-green-500", productCount: 180 },
  { id: 22, name: "টুলস", icon: "🔧", color: "from-gray-600 to-gray-800", productCount: 140 },
  { id: 23, name: "ফুল", icon: "🌸", color: "from-pink-400 to-rose-400", productCount: 95 },
  { id: 24, name: "গিফট", icon: "🎁", color: "from-red-500 to-orange-500", productCount: 220 },
];

const POPULAR_CATEGORIES = ALL_CATEGORIES.slice(0, 8);

export default function CategoryPage() {
  const router = useRouter();
  const { getCartCount } = useCart();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCategories, setFilteredCategories] = useState(ALL_CATEGORIES);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = ALL_CATEGORIES.filter(cat =>
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(ALL_CATEGORIES);
    }
  }, [searchQuery]);

  const handleCategoryClick = (categoryName: string) => {
    router.push(`/mall?cat=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      
      {/* হেডার */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-bold text-lg flex-1">ক্যাটাগরি</h1>
          <button onClick={() => router.push("/mall/cart")} className="relative p-1">
            <ShoppingBag size={22} className="text-gray-600" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>

        {/* সার্চ বার */}
        <div className="px-4 pb-3">
          <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="ক্যাটাগরি সার্চ করুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none ml-2"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1">
                <X size={14} className="text-gray-400" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* জনপ্রিয় ক্যাটাগরি */}
      <div className="px-4 py-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-gray-800 text-base">🔥 জনপ্রিয় ক্যাটাগরি</h2>
          <button className="text-[10px] text-orange-500">সব দেখুন →</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {POPULAR_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${cat.color} flex items-center justify-center text-3xl shadow-sm`}>
                {cat.icon}
              </div>
              <span className="text-[10px] font-medium text-gray-700 mt-1.5 text-center">{cat.name}</span>
              <span className="text-[8px] text-gray-400">{cat.productCount}+ পণ্য</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* সকল ক্যাটাগরি */}
      <div className="px-4 py-2">
        <h2 className="font-bold text-gray-800 text-base mb-3">📂 সকল ক্যাটাগরি</h2>
        
        {filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-5xl mb-2">🔍</div>
            <p className="text-gray-400 text-sm">কোন ক্যাটাগরি পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filteredCategories.map((cat) => (
              <motion.div
                key={cat.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(cat.name)}
                className="bg-white rounded-xl p-3 flex items-center gap-3 shadow-sm cursor-pointer active:scale-95 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${cat.color} flex items-center justify-center text-xl`}>
                  {cat.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm text-gray-800">{cat.name}</h3>
                  <p className="text-[9px] text-gray-400">{cat.productCount} টি পণ্য</p>
                </div>
                <button className="text-orange-500 text-xs">→</button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* অফার ব্যানার */}
      <div className="mx-4 mt-4 mb-2">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-white text-[10px] opacity-80">স্পেশাল অফার</p>
              <h3 className="text-white font-bold text-base">সব ক্যাটাগরিতে</h3>
              <p className="text-yellow-200 text-lg font-black">৫০% ছাড়</p>
            </div>
            <button className="bg-white text-black px-4 py-1.5 rounded-full text-[10px] font-bold">
              শপ নাও →
            </button>
          </div>
        </div>
      </div>

      {/* বটম নেভিগেশন */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center py-2.5 border-t shadow-lg z-50">
        <button onClick={() => router.push("/mall")} className="flex flex-col items-center active:scale-95 transition-all">
          <span className="text-xl">🏠</span>
          <span className="text-[8px] font-semibold text-gray-500">হোম</span>
        </button>
        <button onClick={() => router.push("/mall/category")} className="flex flex-col items-center active:scale-95 transition-all">
          <span className="text-xl">📂</span>
          <span className="text-[8px] font-semibold text-gray-500">ক্যাটাগরি</span>
        </button>
        <button onClick={() => router.push("/mall/trending")} className="flex flex-col items-center active:scale-95 transition-all">
          <span className="text-xl">🔥</span>
          <span className="text-[8px] font-semibold text-gray-500">ট্রেন্ডিং</span>
        </button>
        <button onClick={() => router.push("/mall/cart")} className="flex flex-col items-center active:scale-95 transition-all relative">
          <span className="text-xl">🛒</span>
          <span className="text-[8px] font-semibold text-gray-500">কার্ট</span>
          {getCartCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[7px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
              {getCartCount()}
            </span>
          )}
        </button>
        <button onClick={() => router.push("/me")} className="flex flex-col items-center active:scale-95 transition-all">
          <span className="text-xl">👤</span>
          <span className="text-[8px] font-semibold text-gray-500">আমি</span>
        </button>
        <button onClick={() => { if(confirm("মার্কেট প্লেসে ফিরে যাবেন?")) router.push("/"); }} className="flex flex-col items-center active:scale-95 transition-all">
          <span className="text-xl">🚪</span>
          <span className="text-[8px] font-semibold text-red-500">প্রস্থান</span>
        </button>
      </nav>
    </div>
  );
}