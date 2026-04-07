"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
    Search, Home as HomeIcon, Gavel, Users, User, Smartphone, Monitor,
    Shirt, Car, Briefcase, Settings, Building2, Gift,
    Gem, ShoppingBag, Plus, Mic, Heart, Bell, PlusSquare, 
    MessageCircleMore 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// আপনার নতুন পোস্ট অ্যাড ফর্ম কম্পোনেন্ট
import PostAdForm from '../components/PostAdForm';

const SostaDealFinalUpgrade = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSellFormOpen, setIsSellFormOpen] = useState(false);

  // ৪ সেকেন্ড পর পর ব্যানার পরিবর্তন হওয়ার লজিক
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { label: 'অফার জোন', icon: <Gift className="text-red-500" /> },
    { label: 'কম দাম', icon: <Gem className="text-pink-500" /> },
    { label: 'মোবাইল', icon: <Smartphone className="text-blue-500" /> },
    { label: 'ইলেকট্রনিক্স', icon: <Monitor className="text-indigo-500" /> },
    { label: 'ফ্যাশন', icon: <Shirt className="text-orange-500" /> },
    { label: 'হোম', icon: <HomeIcon className="text-green-500" /> },
    { label: 'গাড়ি', icon: <Car className="text-slate-600" /> },
    { label: 'জব', icon: <Briefcase className="text-amber-600" /> },
    { label: 'সার্ভিস', icon: <Settings className="text-cyan-600" /> },
    { label: 'প্রপার্টি', icon: <Building2 className="text-emerald-600" /> },
  ];

  return (
    <div className="bg-[#f2f3f7] min-h-screen pb-24 font-sans w-full overflow-x-hidden text-[#212121]">
      
      {/* 🟢 ১. ওয়েবসাইট হেডার - SostaSocial বাটন সহ */}
      <header className="bg-white px-4 py-3 sticky top-0 z-[100] border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-4">
          
          {/* সার্চ বার */}
          <div className="flex items-center bg-[#f0f1f5] rounded-xl px-4 py-1.5 border focus-within:border-[#f85606] transition-all flex-1">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="SostaDeal এ খুঁজুন..." className="bg-transparent border-none outline-none ml-2 w-full text-xs" />
            <button className="bg-[#f85606] text-white px-4 py-1.5 rounded-lg text-xs font-bold shrink-0 active:scale-95 transition-transform">Search</button>
          </div>

          {/* 🔥 SostaSocial বাটন (শুধুমাত্র পিসিতে দেখা যাবে) */}
          <Link href="/social" className="hidden md:flex items-center gap-2 bg-orange-100 text-[#f85606] px-4 py-2 rounded-lg font-bold hover:bg-orange-200 transition-colors">
            <Users size={20} />
            <span className="text-sm">SostaSocial</span>
          </Link>
          
          <ShoppingBag size={20} className="text-gray-600 shrink-0 cursor-pointer" />
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto">
        
        {/* ২. প্রিমিয়াম ব্যানার স্লাইডার */}
        <div className="relative h-44 md:h-80 overflow-hidden md:mt-4 md:rounded-3xl shadow-sm">
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentSlide}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.5 }}
              className={`absolute inset-0 flex flex-col items-center justify-center text-white p-8
                ${currentSlide === 0 ? 'bg-gradient-to-br from-[#f85606] to-[#ff8e53]' : 
                  currentSlide === 1 ? 'bg-gradient-to-br from-[#210124] to-[#750d37]' : 
                  'bg-gradient-to-br from-[#004e92] to-[#000428]'}`}
            >
              <h2 className="text-3xl md:text-6xl font-black italic uppercase tracking-tighter leading-none text-center">
                {currentSlide === 0 ? "BIG DISCOUNTS" : currentSlide === 1 ? "মেগা সেল" : "NEW ARRIVAL"}
              </h2>
              <p className="mt-2 text-xs md:text-base font-bold tracking-[0.3em] opacity-80 uppercase">সব পণ্যে বিশেষ ছাড়</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-4 w-full flex justify-center gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? "w-6 bg-white" : "w-1.5 bg-white/40"}`} />
            ))}
          </div>
        </div>

        {/* ৩. ক্যাটাগরি গ্রিড - রিয়েলিস্টিক আইকন */}
        <nav className="bg-white py-8 grid grid-cols-5 md:grid-cols-10 gap-y-8 px-1 md:rounded-3xl md:mt-6 shadow-sm">
          {categories.map((item, index) => (
            <motion.div key={index} whileTap={{ scale: 0.8 }} whileHover={{ y: -5 }} className="flex flex-col items-center cursor-pointer group">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-1 bg-gray-50 rounded-full border border-gray-100 group-hover:bg-orange-50 transition-colors shadow-sm">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <span className="text-[10px] md:text-xs font-bold text-[#424242] text-center px-1 leading-tight tracking-tight h-7 flex items-center">
                {item.label}
              </span>
            </motion.div>
          ))}
        </nav>

        {/* ৪. রিসেন্ট অ্যাডস সেকশন */}
        <section className="mt-6 p-4 bg-white md:rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">রিসেন্ট অ্যাডস (কুষ্টিয়া)</h2>
            <button className="text-[11px] font-bold text-[#f85606] uppercase">সব দেখুন &gt;</button>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4">
          {[...Array(6)].map((_, i) => (
            <Link href="/post-details" key={i}> 
              <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                <div className="h-32 bg-gray-100 relative">
                  <div className="absolute top-2 left-2 bg-black/60 text-white text-[9px] px-1 rounded">Urgent</div>
                </div>
                
                <div className="p-3">
                  <h3 className="font-bold text-xs text-gray-800 line-clamp-1">Urgent Sale Item</h3>
                  <p className="text-[10px] text-gray-500 mt-1 uppercase">পুরাতন • ২ মিনিট আগে</p>
                  <div className="mt-2 text-[#f85606] font-black text-sm">৳ ৫,০০০</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>

      {/* 🟢 ৫. মোবাইল বটম ন্যাভ - সোশ্যাল বাটন সহ */}
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-[0_-5px_25px_rgba(0,0,0,0.07)] px-2 py-3 z-50 rounded-t-[35px]">
      <div className="flex items-end justify-between max-w-md mx-auto relative gap-0.5">
        
        {/* 🏠 HOME */}
        <Link href="/" className="flex flex-col items-center flex-1 group">
          <HomeIcon className="text-[#f85606] group-active:scale-90 transition-transform" size={24} />
          <span className="text-[9px] font-black mt-1 text-[#f85606] uppercase">HOME</span>
        </Link>

        {/* 🎤 গ্ৰামের হাট */}
        <Link href="/grammer-haat" className="flex flex-col items-center flex-1 group">
          <Mic className="text-green-600 group-active:scale-90 transition-transform" size={22} />
          <span className="text-[9px] font-black mt-1 text-green-700 uppercase">গ্ৰামের হাট</span>
        </Link>

        {/* 🎀 টুনি MALL */}
        <Link href="/mall" className="flex flex-col items-center flex-1 group">
          <div className="relative">
            <ShoppingBag className="text-[#FF1493] group-active:scale-90 transition-transform" size={22} />
            <span className="absolute -top-1 -right-1 text-[8px]">✨</span>
          </div>
          <span className="text-[9px] font-black mt-1 text-[#FF1493] italic uppercase">টুনি MALL</span>
        </Link>

        {/* ➕ প্লাস বাটন (Post Add) */}
        <div className="relative flex-1 flex justify-center -mt-8">
          <button 
            onClick={() => setIsSellFormOpen(true)} 
            className="bg-[#f85606] p-3.5 rounded-[22px] shadow-lg shadow-orange-200 flex items-center justify-center border-[3px] border-white active:scale-95 transition-all outline-none"
          >
            <Plus className="text-white" size={28} strokeWidth={4} />
          </button>
        </div>

        {/* 💬 CHAT */}
        <Link href="/chat" className="flex flex-col items-center flex-1 group relative">
          <MessageCircleMore className="text-red-600 group-active:scale-90 transition-transform" size={22} />
          <span className="absolute top-0 right-2 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
          <span className="text-[9px] font-black mt-1 text-red-700 uppercase">CHAT</span>
        </Link>

        {/* 👥 SOCIAL */}
        <Link href="/social" className="flex flex-col items-center flex-1 group">
          <Users className="text-sky-600 group-active:scale-90 transition-transform" size={22} />
          <span className="text-[9px] font-black mt-1 text-sky-700 uppercase">SOCIAL</span>
        </Link>

        {/* 👤 ME - এখন লগইন পেজে নিয়ে যাবে */}
        <Link href="/login" className="flex flex-col items-center flex-1 group">
          <User className="text-gray-400 group-active:scale-90 transition-transform" size={22} />
          <span className="text-[9px] font-black mt-1 text-gray-500 uppercase tracking-tighter">ME</span>
        </Link>
      </div>
    </footer>

    {/* 🕕 ৬. পোস্ট অ্যাড ফর্ম কম্পোনেন্ট */}
    <PostAdForm 
      isOpen={isSellFormOpen} 
      onClose={() => setIsSellFormOpen(false)} 
    />
  </div>
);
};

export default SostaDealFinalUpgrade;