"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
// Lucide React থেকে আরও আধুনিক এবং 'Thin' আইকন ইম্পোর্ট করা হয়েছে
import { LayoutGrid, Flame, ShoppingBag, CircleUser, LogOut } from "lucide-react";

export default function MallLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // বর্তমান পেজ ট্র্যাক করার জন্য
  const { getCartCount } = useCart();

  // কোন পেজ অ্যাক্টিভ আছে তা চেক করার জন্য হেল্পার ফাংশন
  const isActive = (path: string) => pathname === path;

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* মেইন কন্টেন্ট: স্ক্রিনের নিচেরPadding বাড়ানো হয়েছে যাতে কন্টেন্ট ঢাকা না পড়ে */}
      <main className="pb-24 pt-2">
        {children}
      </main>

      {/* আধুনিক, প্রিমিয়াম বটম নেভিগেশন (Glassmorphism & Compact Design) */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2 px-4">
        <nav className="flex h-16 w-full max-w-lg items-center justify-around rounded-full bg-white/70 px-3 border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-md">
          
          {/* হোম - কাস্টম হোম আইকন লজিক */}
          <button 
            onClick={() => router.push("/mall")} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive("/mall") ? "scale-105" : "text-stone-500 hover:text-stone-900"}`}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full">
              {isActive("/mall") && (
                <span className="absolute inset-0 rounded-full bg-[#FFE4E1]/80 scale-110"></span>
              )}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill={isActive("/mall") ? "#E53E3E" : "none"} // অ্যাক্টিভ হলে রেড ফিল
                stroke={isActive("/mall") ? "#E53E3E" : "currentColor"} // অ্যাক্টিভ হলে রেড স্ট্রোক
                strokeWidth={isActive("/mall") ? "1.5" : "1.2"} // আরও চিকন স্ট্রোক
                className="relative h-5 w-5"
              >
                <path d="M12.97 3.69l7.5 5.61a1.5 1.5 0 01.53 1.13v9.07c0 .83-.67 1.5-1.5 1.5h-4.5a.75.75 0 01-.75-.75v-3.75a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v3.75a.75.75 0 01-.75.75h-4.5A1.5 1.5 0 013 20.25V11.23a1.5 1.5 0 01.53-1.13l7.5-5.61a1.5 1.5 0 011.94 0z" />
              </svg>
            </div>
            <span className={`text-[10.5px] font-medium tracking-tight ${isActive("/mall") ? "text-[#E53E3E]" : ""}`}>হোম</span>
          </button>

          {/* ক্যাটাগরি */}
          <button 
            onClick={() => router.push("/mall/category")} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive("/mall/category") ? "scale-105" : "text-stone-500 hover:text-stone-900"}`}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full">
              {isActive("/mall/category") && (
                <span className="absolute inset-0 rounded-full bg-[#FFE4E1]/80 scale-110"></span>
              )}
              <LayoutGrid strokeWidth={isActive("/mall/category") ? "1.8" : "1.2"} className={`relative h-5 w-5 ${isActive("/mall/category") ? "text-[#E53E3E]" : ""}`} />
            </div>
            <span className={`text-[10.5px] font-medium tracking-tight ${isActive("/mall/category") ? "text-[#E53E3E]" : ""}`}>ক্যাটাগরি</span>
          </button>

          {/* ট্রেন্ডিং */}
          <button 
            onClick={() => router.push("/mall/trending")} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive("/mall/trending") ? "scale-105" : "text-stone-500 hover:text-stone-900"}`}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full">
              {isActive("/mall/trending") && (
                <span className="absolute inset-0 rounded-full bg-[#FFE4E1]/80 scale-110"></span>
              )}
              <Flame strokeWidth={isActive("/mall/trending") ? "1.8" : "1.2"} className={`relative h-5 w-5 ${isActive("/mall/trending") ? "text-[#E53E3E]" : ""}`} />
            </div>
            <span className={`text-[10.5px] font-medium tracking-tight ${isActive("/mall/trending") ? "text-[#E53E3E]" : ""}`}>ট্রেন্ডিং</span>
          </button>

          {/* কার্ট - ব্যাজ ডিজাইন আধুনিক করা হয়েছে */}
          <button 
            onClick={() => router.push("/mall/cart")} 
            className={`relative flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive("/mall/cart") ? "scale-105" : "text-stone-500 hover:text-stone-900"}`}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full">
              {isActive("/mall/cart") && (
                <span className="absolute inset-0 rounded-full bg-[#FFE4E1]/80 scale-110"></span>
              )}
              <ShoppingBag strokeWidth={isActive("/mall/cart") ? "1.8" : "1.2"} className={`relative h-5 w-5 ${isActive("/mall/cart") ? "text-[#E53E3E]" : ""}`} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[8.5px] font-bold text-white shadow-lg ring-1 ring-white">
                  {getCartCount() > 99 ? "99+" : getCartCount()}
                </span>
              )}
            </div>
            <span className={`text-[10.5px] font-medium tracking-tight ${isActive("/mall/cart") ? "text-[#E53E3E]" : ""}`}>কার্ট</span>
          </button>

          {/* আমি */}
          <button 
            onClick={() => router.push("/mall/me")} 
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${isActive("/mall/me") ? "scale-105" : "text-stone-500 hover:text-stone-900"}`}
          >
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full">
              {isActive("/mall/me") && (
                <span className="absolute inset-0 rounded-full bg-[#FFE4E1]/80 scale-110"></span>
              )}
              <CircleUser strokeWidth={isActive("/mall/me") ? "1.8" : "1.2"} className={`relative h-5 w-5 ${isActive("/mall/me") ? "text-[#E53E3E]" : ""}`} />
            </div>
            <span className={`text-[10.5px] font-medium tracking-tight ${isActive("/mall/me") ? "text-[#E53E3E]" : ""}`}>আমি</span>
          </button>

          {/* প্রস্থান */}
          <button 
            onClick={() => { if(confirm("মার্কেট প্লেসে ফিরে যাবেন?")) router.push("/"); }} 
            className="flex flex-col items-center gap-1.5 text-stone-400 hover:text-red-600 transition-all duration-300"
          >
            <div className="flex h-8 w-8 items-center justify-center">
              <LogOut strokeWidth="1.2" className="h-5 w-5" />
            </div>
            <span className="text-[10.5px] font-medium tracking-tight">প্রস্থান</span>
          </button>

        </nav>
      </div>
    </div>
  );
}