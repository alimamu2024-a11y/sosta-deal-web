"use client";

import React, { useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { 
  Search, ShoppingCart, Heart, Clock, Home, User, 
  Zap, Flame, Award, Camera, Loader2
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// ১. টাইটান ইঞ্জিন ডাটাবেজ (Tuni Mall Exclusive)
const CONTENT_MAP: any = {
  "All": { topIcons: 12, flashItems: 8, bottomIcons: 8, banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800" },
  "Women": { topIcons: 12, flashItems: 8, bottomIcons: 8, banner: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800" },
  "Men": { topIcons: 12, flashItems: 8, bottomIcons: 8, banner: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=800" },
  "Kids": { topIcons: 12, flashItems: 8, bottomIcons: 8, banner: "https://images.unsplash.com/photo-1514096702362-21e2810e975b?w=800" },
};

export default function TuniMallFinal() {
  const [activeTab, setActiveTab] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // সুপার-সোনিক জিরো ল্যাগ সুইচিং
  const handleTabChange = useCallback((tab: string) => {
    if(tab === activeTab) return;
    setIsLoading(true);
    setActiveTab(tab);
    setTimeout(() => setIsLoading(false), 200); // ২ মিলি-সেকেন্ড ডিলে
  }, [activeTab]);

  const data = useMemo(() => CONTENT_MAP[activeTab] || CONTENT_MAP["All"], [activeTab]);

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-24 font-sans selection:bg-orange-100">
      
      {/* 🚀 ১. স্লিম ও পাওয়ারফুল হেডার (Tuni Mall Branding) */}
      <div className="sticky top-0 z-[110] bg-white/95 backdrop-blur-sm px-4 pt-3 pb-1 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-[#F5F5F5] rounded-full flex items-center px-4 py-1.5 border border-gray-100">
            <Search size={14} className="text-gray-400" />
            <input 
              type="text" 
              placeholder={`Search Tuni Mall: ${activeTab}`} 
              className="flex-1 bg-transparent outline-none px-2 text-[11px] font-bold text-gray-800" 
            />
            <Camera size={16} className="text-gray-400 cursor-pointer" />
          </div>
          <div className="flex gap-3 text-gray-700">
            <Heart size={20} />
            <div className="relative">
              <ShoppingCart size={20} />
              <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[8px] px-1 rounded-full">৩</span>
            </div>
          </div>
        </div>
        
        {/* ক্যাটাগরি ট্যাব */}
        <div className="flex gap-5 overflow-x-auto py-2 scrollbar-hide">
          {["All", "Women", "Men", "Kids", "Home", "1 to 99"].map((cat) => (
            <button 
              key={cat} 
              onClick={() => handleTabChange(cat)} 
              className={`text-[12px] font-black uppercase whitespace-nowrap transition-all ${activeTab === cat ? "text-orange-600 border-b-2 border-orange-600 scale-105" : "text-gray-400 hover:text-gray-600"}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-orange-600" size={32} /></div>
      ) : (
        <>
          {/* 🖼️ ২. টাইটান স্লাইডার (সাইলেন্ট ভিডিও স্লট সহ) */}
          <div className="w-full h-44 relative bg-gray-100 shadow-inner">
            <Swiper className="h-full" loop={true}>
              <SwiperSlide>
                <Image src={data.banner} alt="Tuni Mall Banner" fill priority className="object-cover" sizes="100vw" />
              </SwiperSlide>
              <SwiperSlide>
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-orange-500 font-black italic text-sm tracking-widest uppercase underline decoration-white">TUNI MALL AD</p>
                    <p className="text-white text-[10px] font-bold uppercase mt-1">Titan Engine Powered</p>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>

          {/* ⭕ ৩. টপ ক্যাটাগরি আইকন (৩ লাইন - ১২টি গোল বাটন) */}
          <div className="bg-white py-4 grid grid-cols-4 gap-y-5 px-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-[#F9F9F9] border border-gray-100 overflow-hidden relative shadow-sm hover:scale-110 transition-all">
                   <Image src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=120`} alt="tuni" fill className="object-cover p-1.5 rounded-full" />
                </div>
                <span className="text-[9px] font-black text-gray-700 uppercase tracking-tighter">Tuni {i+1}</span>
              </div>
            ))}
          </div>

          {/* ⚡ ৪. ফ্ল্যাশ সেল (২ লাইন - ৮টি প্রোডাক্ট) */}
          <div className="mt-2 bg-white p-3">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-1 text-orange-600 font-black italic text-base tracking-tighter uppercase">
                <Zap size={18} fill="currentColor" /> Flash Sale
              </div>
              <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-0.5 rounded-md border border-orange-100">
                <Clock size={12} />
                <span className="text-[10px] font-black tracking-widest">02:45:10</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1,2,3,4,5,6,7,8].map(i => (
                <div key={i} className="relative group">
                  <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 relative">
                    <Image src={`https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200`} alt="p" fill className="object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-0 left-0 bg-orange-600 text-white text-[8px] font-black px-1.5 rounded-br-lg italic shadow-md">HOT</div>
                  </div>
                  <p className="text-[10px] font-black mt-1.5 text-gray-900 text-center">৳৮৫০</p>
                </div>
              ))}
            </div>
          </div>

          {/* ⭕ ৫. বটম ক্যাটাগরি (২ লাইন - ৮টি আইকন) */}
          <div className="mt-2 bg-white py-4 grid grid-cols-4 gap-y-5 px-2 border-t border-gray-50">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-1 cursor-pointer">
                <div className="w-14 h-14 rounded-full bg-gray-50 border border-gray-200 overflow-hidden relative shadow-sm hover:rotate-6 transition-transform">
                   <Image src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=120`} alt="cat" fill className="object-cover p-2 rounded-full" />
                </div>
                <span className="text-[9px] font-black text-gray-500 uppercase">Mall {i+1}</span>
              </div>
            ))}
          </div>

          {/* 🛍️ ৬. মেইন ইনফিনিট গ্রিড (২ কলাম প্রিমিয়াম লুক) */}
          <div className="p-2 grid grid-cols-2 gap-2 mt-1">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                <div className="relative aspect-[4/5]">
                  <Image src={`https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400`} alt="p" fill className="object-cover" loading="lazy" />
                  <div className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-md rounded-full text-orange-600"><Heart size={14} fill="currentColor" /></div>
                </div>
                <div className="p-3">
                  <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Tuni Mall Official</h3>
                  <p className="text-[11px] font-bold text-gray-800 mt-0.5 line-clamp-1">Titan Quality Tuni Outfit</p>
                  <div className="mt-2 flex justify-between items-end">
                    <div>
                      <p className="text-sm font-black text-black">৳১,২৫০</p>
                      <p className="text-[9px] text-gray-400 line-through">৳২,০০০</p>
                    </div>
                    <button className="bg-orange-600 text-white p-2 rounded-xl shadow-lg shadow-orange-100 active:scale-90 transition-transform">
                      <ShoppingCart size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 📱 ৭. আপনার দেওয়া সেই স্লিম ও বড় স্ক্রিন লুক নেভিগেশন (Tuni Mall Edition) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 flex justify-around items-center z-[120] h-14 px-4 shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col items-center justify-center text-black cursor-pointer group">
          <Home size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          <span className="text-[9px] font-black uppercase mt-0.5">Home</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:text-black transition-colors">
          <Zap size={20} />
          <span className="text-[9px] font-bold uppercase mt-0.5">Category</span>
        </div>
        <div className="flex flex-col items-center justify-center text-[#f85606] cursor-pointer scale-110">
          <Flame size={22} fill="#f85606" className="drop-shadow-sm" />
          <span className="text-[9px] font-black uppercase mt-0.5">Trending</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:text-black transition-colors">
          <Award size={20} />
          <span className="text-[9px] font-bold uppercase mt-0.5">New</span>
        </div>
        <div className="flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:text-black transition-colors">
          <User size={20} />
          <span className="text-[9px] font-bold uppercase mt-0.5">Me</span>
        </div>
      </nav>

    </div>
  );
}