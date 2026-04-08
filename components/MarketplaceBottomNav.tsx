// components/MarketplaceBottomNav.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  Home, Mic, ShoppingBag, Plus, MessageCircle, Users, LayoutDashboard, LogIn 
} from "lucide-react";
import { useState } from "react";
import PostAdForm from "./PostAdForm";

export default function MarketplaceBottomNav() {
  const { user } = useAuth();
  const [isSellFormOpen, setIsSellFormOpen] = useState(false);

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-5px_25px_rgba(0,0,0,0.07)] px-2 py-2 z-50 rounded-t-2xl">
        <div className="flex items-center justify-around max-w-md mx-auto">
          
          {/* HOME */}
          <Link href="/" className="flex flex-col items-center group">
            <Home className="text-orange-500 group-active:scale-90" size={22} />
            <span className="text-[9px] font-bold mt-1 text-orange-500 uppercase">HOME</span>
          </Link>

          {/* গ্ৰামের হাট */}
          <Link href="/grammer-haat" className="flex flex-col items-center group">
            <Mic className="text-green-600 group-active:scale-90" size={20} />
            <span className="text-[9px] font-bold mt-1 text-green-700 uppercase">গ্ৰামের হাট</span>
          </Link>

          {/* টুনি MALL */}
          <Link href="/mall" className="flex flex-col items-center group">
            <div className="relative">
              <ShoppingBag className="text-pink-600 group-active:scale-90" size={22} />
              <span className="absolute -top-1 -right-1 text-[8px]">✨</span>
            </div>
            <span className="text-[9px] font-bold mt-1 text-pink-600 italic uppercase">টুনি MALL</span>
          </Link>

          {/* পোস্ট বাটন */}
          <div className="relative flex justify-center -mt-8">
            <button 
              onClick={() => setIsSellFormOpen(true)} 
              className="bg-orange-500 p-3.5 rounded-2xl shadow-lg flex items-center justify-center border-[3px] border-white active:scale-95"
            >
              <Plus className="text-white" size={28} strokeWidth={4} />
            </button>
          </div>

          {/* CHAT */}
          <Link href="/chat" className="flex flex-col items-center group relative">
            <MessageCircle className="text-red-500 group-active:scale-90" size={20} />
            <span className="absolute -top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            <span className="text-[9px] font-bold mt-1 text-red-600 uppercase">CHAT</span>
          </Link>

          {/* SOCIAL */}
          <Link href="/social" className="flex flex-col items-center group">
            <Users className="text-sky-600 group-active:scale-90" size={20} />
            <span className="text-[9px] font-bold mt-1 text-sky-700 uppercase">SOCIAL</span>
          </Link>

          {/* DASHBOARD / LOGIN (ME এর জায়গায় DASHBOARD) */}
          {user ? (
            <Link href="/dashboard" className="flex flex-col items-center group">
              <LayoutDashboard className="text-orange-500 group-active:scale-90" size={20} />
              <span className="text-[9px] font-bold mt-1 text-orange-600 uppercase">DASHBOARD</span>
            </Link>
          ) : (
            <Link href="/login" className="flex flex-col items-center group">
              <LogIn size={20} className="text-gray-500 group-active:scale-90" />
              <span className="text-[9px] font-bold mt-1 text-gray-500 uppercase">LOGIN</span>
            </Link>
          )}
        </div>
      </footer>

      <PostAdForm isOpen={isSellFormOpen} onClose={() => setIsSellFormOpen(false)} />
    </>
  );
}