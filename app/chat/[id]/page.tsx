"use client";
import React, { useState } from 'react';
import { ArrowLeft, Send, Phone, MoreVertical, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function ChatWindow({ params }: { params: { id: string } }) {
  const [text, setText] = useState("");

  return (
    <div className="flex flex-col h-screen bg-[#f7f7f9]">
      {/* 🔝 চ্যাট হেডার */}
      <div className="bg-white px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/chat">
            <ArrowLeft size={24} className="text-gray-700" />
          </Link>
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-black">
              R
            </div>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <div className="flex items-center gap-1">
                <h2 className="font-black text-[14px] text-gray-900 leading-none">Rubel Admin</h2>
                <ShieldCheck size={14} className="text-blue-500 fill-blue-500 text-white" />
            </div>
            <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter mt-1">Online Now</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <Phone size={20} />
          <MoreVertical size={20} />
        </div>
      </div>

      {/* 💬 মেসেজ বডি */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* রিসিভ করা মেসেজ (বাম পাশে) */}
        <div className="flex justify-start">
          <div className="bg-white p-3.5 rounded-[22px] rounded-tl-none max-w-[85%] shadow-sm border border-gray-100">
            <p className="text-[14px] font-semibold text-gray-800 leading-snug">
                ভাই, টুনি MALL-এর ওই ড্রেসটার কি ডিসকাউন্ট হবে? 👗
            </p>
            <span className="text-[9px] text-gray-400 mt-1.5 block font-bold">11:45 PM</span>
          </div>
        </div>

        {/* পাঠানো মেসেজ (ডান পাশে) */}
        <div className="flex justify-end">
          <div className="bg-[#f85606] p-3.5 rounded-[22px] rounded-tr-none max-w-[85%] shadow-lg shadow-orange-100 text-white">
            <p className="text-[14px] font-bold leading-snug">
                অবশ্যই ভাই! আপনি আমাদের সুপার ফাস্ট নেটওয়ার্ক ব্যবহার করছেন, আপনার জন্য বিশেষ অফার থাকবে। 🚀
            </p>
            <span className="text-[9px] text-orange-200 mt-1.5 block text-right font-bold">11:46 PM</span>
          </div>
        </div>
      </div>

      {/* ⌨️ ইনপুট বক্স */}
      <div className="p-4 bg-white border-t border-gray-50 pb-8">
        <div className="flex items-center gap-2 bg-gray-50 rounded-[25px] px-4 py-2 border border-gray-100 focus-within:border-orange-200 transition-all">
          <input 
            type="text" 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="আপনার বার্তা লিখুন..." 
            className="flex-1 bg-transparent outline-none py-2 text-[14px] font-bold text-gray-700"
          />
          <button 
            className={`p-2.5 rounded-full transition-all duration-300 ${
              text ? 'bg-[#f85606] text-white scale-110 rotate-0' : 'bg-gray-200 text-gray-400 scale-100 -rotate-12'
            }`}
          >
            <Send size={18} fill={text ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}