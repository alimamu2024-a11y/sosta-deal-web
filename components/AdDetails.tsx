"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Phone, MapPin, Share2, Heart, MessageCircle, 
  ChevronLeft, Clock, ShieldCheck, Star, User, Send, 
  AlertTriangle, ZoomIn, Camera, Video, BarChart2,
  ArrowLeft, Calendar, ChevronRight, Info, Eye
} from 'lucide-react';

// Swiper Components & Styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Zoom } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
const AdDetails = ({ ad, onClose }: { ad: any, onClose: () => void }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // স্লাইডার ডাটা (ইমেজ এবং ভিডিওর জন্য type আলাদা করে দেওয়া হয়েছে)
  const mediaItems = [
    { type: 'image', url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000' },
    { type: 'video', url: 'https://assets.mixkit.co/videos/preview/mixkit-taking-photos-from-a-smartphone-34352-result.mp4' },
    { type: 'image', url: 'https://images.unsplash.com/photo-1696446267197-03e5c709e99c?q=80&w=1000' },
  ];

  // হোয়াটসঅ্যাপে শেয়ার করার ফাংশন
  const handleWhatsAppShare = () => {
    const text = `এই অসাধারণ ডিলটি দেখুন সস্তা ডিলে: ${ad?.title || 'iPhone 15 Pro Max'}\nলিঙ্ক: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.div 
  initial={{ opacity: 0, y: 20 }} // সাইড থেকে না এসে নিচ থেকে হালকা করে ভাসবে
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 20 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
  className="fixed inset-0 bg-white z-[100] overflow-y-auto"
>
      {/* Back Button */}
<button 
  onClick={onClose}
  className="absolute top-4 left-4 z-50 p-2 bg-[#00BFA5] text-white rounded-full shadow-lg hover:bg-[#00a892] transition-colors"
>
  <ChevronLeft size={24} />
</button>

      {/* ২. ইমেজ ও ভিডিও স্লাইডার (কালো দাগ দূর করার ফিক্স) */}
      <div className="w-full h-[480px] bg-black relative overflow-hidden shadow-2xl">
        <Swiper
          modules={[Pagination, Autoplay, Zoom]}
          autoplay={{ delay: 8000, disableOnInteraction: false }}
          zoom={{ maxRatio: 3 }}
          pagination={{ clickable: true }}
          className="h-full w-full"
        >
          {mediaItems.map((item, index) => (
            <SwiperSlide key={index} className="w-full h-full flex items-center justify-center">
              <div className="swiper-zoom-container w-full h-full">
                {item.type === 'video' ? (
                  <video 
                    src={item.url} 
                    className="w-full h-full object-cover" 
                    controls 
                    playsInline
                    muted
                    autoPlay
                    loop
                  />
                ) : (
                  <img 
                    src={item.url} 
                    className="w-full h-full object-cover object-center" 
                    alt="product" 
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-50 bg-black/40 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
          <ZoomIn size={12}/> Double tap to zoom
        </div>
      </div>

      {/* ৩. মেইন কন্টেন্ট এরিয়া */}
      <div className="px-6 pt-10 pb-10 -mt-12 bg-white rounded-t-[50px] relative z-10 shadow-[0_-30px_60px_rgba(0,0,0,0.1)]">
        
        {/* ৪. টাইটেল ও একশন বাটন (হোয়াটসঅ্যাপ শেয়ারসহ) */}
        <div className="flex items-start justify-between gap-4 mb-8">
          <div className="space-y-3">
             <div className="flex items-center gap-2">
               <span className="bg-orange-100 text-[#f85606] text-[9px] font-black px-3 py-1 rounded-full uppercase border border-orange-200 shadow-sm italic">নতুন বিজ্ঞাপন</span>
               <span className="text-gray-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1 italic"><Clock size={10} /> এখনই</span>
             </div>
             <h1 className="text-2xl font-[1000] text-gray-800 leading-tight uppercase tracking-tight italic">
               {ad?.title || 'iPhone 15 Pro Max'}
             </h1>
          </div>
          
          <div className="flex gap-2 shrink-0">
             {/* হোয়াটসঅ্যাপ শেয়ার বাটন */}
             <button onClick={handleWhatsAppShare} className="bg-green-50 border border-green-100 p-3.5 rounded-2xl text-green-600 shadow-sm active:scale-90 transition-all">
                <Share2 size={20} />
             </button>
             <button onClick={() => setIsFavorite(!isFavorite)} className="bg-gray-50 border border-gray-100 p-3.5 rounded-2xl shadow-sm active:scale-90 transition-all">
                <Heart size={20} className={isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"} />
             </button>
          </div>
        </div>

        {/* ৫. প্রাইস কার্ড */}
        <div className="flex items-center justify-between bg-gray-50/80 p-6 rounded-[35px] border border-gray-100 shadow-inner mb-8">
           <div className="flex items-end gap-1 text-[#f85606]">
              <span className="text-xl font-bold mb-1">৳</span>
              <span className="text-4xl font-[1000] tracking-tighter italic leading-none">১,২০,০০০</span>
           </div>
           <p className="text-[11px] font-black text-gray-600 flex items-center gap-1 uppercase italic tracking-tighter">
              <MapPin size={12} className="text-[#f85606]" /> কুষ্টিয়া
           </p>
        </div>

        {/* ৬. সেলার সেকশন */}
        <div className="bg-white p-5 rounded-[40px] border border-gray-100 shadow-sm space-y-6 mb-10">
            <div className="flex items-center justify-between">
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-500 rounded-[20px] flex items-center justify-center text-white text-xl font-[1000] shadow-lg border border-white/20">S</div>
                  <div>
                    <h4 className="font-[1000] text-[16px] text-gray-800 leading-none">Sabbir Ahmed</h4>
                    <div className="flex items-center gap-1.5 mt-2">
                       <ShieldCheck size={12} className="text-green-500" />
                       <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">ভেরিফাইড সেলার</p>
                    </div>
                  </div>
               </div>
               <button onClick={handleWhatsAppShare} className="p-4 bg-[#f85606] text-white rounded-[22px] shadow-xl active:scale-90">
                  <MessageCircle size={24} />
               </button>
            </div>
            <a href="tel:01700000000" className="w-full h-15 bg-gray-900 text-white rounded-[24px] font-[1000] uppercase flex items-center justify-center gap-3 shadow-xl active:scale-95 text-sm tracking-[0.1em] border-b-4 border-black/20 py-4">
              <Phone size={20} /> সরাসরি কল দিন
            </a>
        </div>

        {/* ৭. রিভিউ সেকশন (User Icon ফিক্সড) */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-1">
              <h3 className="text-[11px] font-[1000] uppercase text-gray-800 tracking-[0.2em]">ইউজার রিভিউ (১২)</h3>
              <div className="flex items-center gap-2 text-[#f85606] font-[1000] text-sm px-4 py-2 bg-orange-50 rounded-2xl border border-orange-100 italic">
                <Star size={16} fill="currentColor"/> 4.8
              </div>
           </div>
           
           <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="p-5 bg-gray-50/50 rounded-[35px] border border-gray-100 flex gap-4 transition-all hover:bg-white hover:shadow-md">
                   <div className="w-11 h-11 rounded-2xl bg-white flex items-center justify-center shrink-0 border border-gray-100">
                     <User size={20} className="text-gray-300" />
                   </div>
                   <div className="space-y-2 flex-1">
                      <div className="flex items-center justify-between">
                         <p className="text-[12px] font-[1000] text-gray-700 uppercase tracking-tighter">User_{i}</p>
                         <span className="text-[9px] font-bold text-gray-300 uppercase">২ দিন আগে</span>
                      </div>
                      <div className="flex text-orange-400 gap-0.5"><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/></div>
                      <p className="text-[13px] text-gray-500 font-bold italic leading-relaxed">পণ্যটি একদম ফ্রেশ ছিল। সস্তা ডিলে ভালো প্রোডাক্ট পাওয়া যায়!</p>
                   </div>
                </div>
              ))}
           </div>
           
           {/* মতামত ইনপুট */}
           <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-[30px] shadow-inner focus-within:bg-white transition-all mt-4">
              <input type="text" placeholder="মতামত দিন..." className="flex-1 bg-transparent px-4 py-2 text-xs font-bold outline-none text-gray-700" />
              <button className="bg-gray-800 p-3.5 rounded-[22px] text-white shadow-xl active:scale-90"><Send size={18} /></button>
           </div>
        </div>

        {/* ৮. রিপোর্ট বাটন */}
        <button className="w-full mt-12 flex items-center justify-center gap-2 text-gray-300 text-[9px] font-black uppercase tracking-[0.2em] italic">
          <AlertTriangle size={12} /> বিজ্ঞাপনটি রিপোর্ট করুন
        </button>

      </div>
    </motion.div>
  );
};

export default AdDetails;