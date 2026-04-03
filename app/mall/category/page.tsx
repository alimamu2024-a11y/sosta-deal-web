"use client";

import React, { useState, useTransition, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { 
  Search, ShoppingCart, Heart, Camera, ChevronLeft, Loader2, Sparkles, Zap, ShieldCheck
} from 'lucide-react';

// 🔥 TITAN ENGINE DATA SET (সুপার-সনিক লোডিংয়ের জন্য ডাটা স্ট্রাকচার)
const CATEGORY_DATA: any = {
  "Just for You": [
    { id: 1, name: "Smart Watch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300", color: "bg-blue-50" },
    { id: 2, name: "Air Jordan", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300", color: "bg-red-50" },
    { id: 3, name: "Lady Bag", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300", color: "bg-orange-50" },
    { id: 4, name: "RayBan Glass", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=300", color: "bg-yellow-50" },
    { id: 5, name: "Matte Lipstick", image: "https://images.unsplash.com/photo-1586790170053-202e35228b42?w=300", color: "bg-pink-50" },
    { id: 6, name: "Chanel No.5", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300", color: "bg-purple-50" },
    { id: 7, name: "Gold Necklace", image: "https://images.unsplash.com/photo-1515562141207-7a18b5ce7142?w=300", color: "bg-cyan-50" },
    { id: 8, name: "Beach Hat", image: "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=300", color: "bg-emerald-50" },
    { id: 9, name: "Gucci Belt", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300", color: "bg-stone-50" },
    { id: 10, name: "Gaming Mouse", image: "https://images.unsplash.com/photo-1527690718058-2934b7974a72?w=300", color: "bg-indigo-50" },
    { id: 11, name: "Wireless Buds", image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300", color: "bg-rose-50" },
    { id: 12, name: "Power Bank", image: "https://images.unsplash.com/photo-1609592424109-dd089450d647?w=300", color: "bg-teal-50" },
  ],
  "Women": [
    { id: 13, name: "Silk Saree", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=300", color: "bg-orange-50" },
    { id: 14, name: "Party Heels", image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=300", color: "bg-gray-50" },
    { id: 15, name: "Anarkali", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=300", color: "bg-red-50" },
  ]
};

const sidebarCategories = [
  "Just for You", "New In", "Sale", "Women", "Men", "Kids", "Home", "1 to 99", "Shoes", "Bags", "Gadgets"
];

export default function TuniMallCategory() {
  const [selectedCategory, setSelectedCategory] = useState("Just for You");
  const [isPending, startTransition] = useTransition();
  const [cartCount, setCartCount] = useState(3);
  const [viewMode, setViewMode] = useState('grid'); // Edge Case: Toggle view

  // 🧠 AI USER BEHAVIOR: Track the user's category preference
  const trackBehavior = useCallback((category: string) => {
    console.log(`[AI-PRO] User interested in: ${category}`);
    // এখানে আপনার Supabase-এ ডাটা পুশ করার লজিক বসবে
  }, []);

  const handleCategoryChange = (cat: string) => {
    trackBehavior(cat); // AI Tracking
    startTransition(() => {
      setSelectedCategory(cat);
    });
  };

  const currentItems = CATEGORY_DATA[selectedCategory] || CATEGORY_DATA["Just for You"];

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden max-w-[1440px] mx-auto border-x border-gray-100 font-sans selection:bg-orange-200">
      
      {/* 🔝 TOP HEADER: Heart & Shopping Cart Fixed */}
      <div className="flex items-center gap-2 px-3 py-3 border-b border-gray-50 bg-white sticky top-0 z-50">
        <ChevronLeft size={24} className="text-gray-900 cursor-pointer shrink-0" />
        
        {/* 🔍 SEARCH BAR AREA */}
        <div className="flex-1 flex items-center bg-[#F3F4F6] rounded-2xl px-3 border border-transparent focus-within:border-pink-400 focus-within:bg-white transition-all h-[40px] relative min-w-0">
          <div className="flex-1 relative flex items-center h-full overflow-hidden text-ellipsis">
            <input 
              id="tuni-search"
              type="text"
              placeholder="Search on Tuni Mall..."
              className="peer w-full bg-transparent outline-none text-[13px] text-gray-800 font-bold z-10" 
            />
          </div>

          <div className="flex items-center gap-2.5 ml-1 border-l border-gray-300 pl-2 shrink-0">
             <button onClick={() => alert("AI Visual Search Initializing...")}>
                <Camera size={19} className="text-orange-500" />
             </button>
             <Search size={18} className="text-gray-400" />
          </div>
        </div>

        {/* ❤️ RIGHT SIDE ICONS (HEART & CART) */}
        <div className="flex items-center gap-3 shrink-0 ml-1">
          <Heart size={22} className="text-gray-800 hover:text-pink-600 transition-colors cursor-pointer" />
          
          <div className="relative cursor-pointer active:scale-90 transition-transform">
            <ShoppingCart size={22} className="text-gray-800" />
            {/* 🛒 Cart Count Badge */}
            <span className="absolute -top-1.5 -right-1.5 bg-pink-600 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center ring-2 ring-white">
              {cartCount}
            </span>
          </div>
        </div>
      </div>
      {/* 🟢 DYNAMIC MAIN BODY */}
      <div className="flex flex-1 overflow-hidden bg-[#FBFBFB]">
        
        {/* ⬅️ SIDEBAR: TITAN ENGINE SCROLLING */}
        <div className="w-[110px] md:w-[150px] bg-[#F7F8F9] overflow-y-auto no-scrollbar border-r border-gray-100 shadow-inner">
          {sidebarCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`w-full py-6 px-3 text-[12px] md:text-[15px] leading-tight text-center transition-all duration-300 relative group ${
                selectedCategory === cat 
                  ? "bg-white text-orange-600 font-black" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-white/50"
              }`}
            >
              {selectedCategory === cat && (
                <div className="absolute left-0 top-1/4 bottom-1/4 w-[5px] bg-orange-600 rounded-r-full shadow-[2px_0_10px_rgba(234,88,12,0.3)]" />
              )}
              {cat}
            </button>
          ))}
        </div>

        {/* ➡️ CONTENT: VIBRANT GRID & AI RECOMMENDATIONS */}
        <div className="flex-1 bg-white overflow-y-auto p-6 pb-40 no-scrollbar relative scroll-smooth">
          
          {/* HEADER IN CONTENT */}
          <div className="flex items-center justify-between mb-8 animate-in fade-in duration-700">
             <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                   <Zap size={20} className="text-orange-500 fill-orange-500" />
                   <h2 className="text-[18px] md:text-[22px] font-black text-gray-900 tracking-tight uppercase">{selectedCategory}</h2>
                </div>
                <p className="text-[10px] text-gray-400 font-bold tracking-[2px] ml-7">T U N I M A L L</p>
             </div>
             {isPending && <Loader2 size={20} className="animate-spin text-orange-600" />}
          </div>
          
          {/* 🔥 MAIN GRID: Optimized for Speed & Clarity */}
          <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-8 gap-y-12 transition-all duration-500 ${isPending ? 'opacity-20 blur-sm scale-95' : 'opacity-100 scale-100'}`}>
            {currentItems.map((item: any) => (
              <div key={item.id} className="flex flex-col items-center group cursor-pointer">
                {/* গোল আইকন ডিজাইন */}
                <div className={`w-full aspect-square rounded-full p-1.5 border-2 border-transparent group-hover:border-orange-200 group-hover:rotate-6 transition-all duration-500 ${item.color} shadow-sm group-hover:shadow-orange-100`}>
                  <div className="w-full h-full rounded-full overflow-hidden relative bg-white border border-gray-100 ring-2 ring-white ring-offset-2">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      loading="lazy"
                      className="object-cover group-hover:scale-125 transition-transform duration-1000 ease-in-out"
                      sizes="(max-width: 768px) 30vw, 15vw"
                    />
                  </div>
                </div>
                <span className="text-[12px] md:text-[14px] text-gray-800 text-center font-extrabold mt-4 leading-tight group-hover:text-orange-600 transition-colors px-1">
                  {item.name}
                </span>
                <div className="mt-1 h-1 w-0 bg-orange-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </div>
            ))}
          </div>

          {/* ⚡ AI BEHAVIOR PRO & RECOMMENDER */}
          <div className="mt-24 pt-10 border-t-2 border-orange-50/50">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="bg-orange-600 text-white p-1.5 rounded-lg shadow-lg shadow-orange-200">
                      <Sparkles size={18} />
                   </div>
                   <h3 className="text-[16px] font-black text-gray-900 tracking-wide italic">YOU MAY ALSO LIKE</h3>
                </div>
                <div className="h-[2px] flex-1 bg-gradient-to-r from-orange-100 to-transparent ml-4" />
             </div>
             
             {/* ২ লাইনে ৬টি বড় এবং কালারফুল রিকমেন্ডেশন */}
             <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="group relative aspect-[4/5] bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500">
                     <div className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full shadow-md text-gray-300 group-hover:text-red-500 transition-colors">
                        <Heart size={16} />
                     </div>
                     <div className="absolute inset-0 bg-gradient-to-t from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     <div className="w-full h-full flex flex-col items-center justify-center p-6">
                        <div className="w-16 h-16 bg-orange-100/50 rounded-full animate-pulse flex items-center justify-center">
                           <ShieldCheck size={32} className="text-orange-200" />
                        </div>
                        <div className="mt-4 h-3 w-24 bg-gray-100 rounded-full overflow-hidden">
                           <div className="h-full bg-orange-400 w-1/2 animate-shimmer" />
                        </div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 1.5s infinite linear;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}