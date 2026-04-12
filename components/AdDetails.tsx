"use client";
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MapPin, Share2, Heart, MessageCircle, 
  ChevronLeft, Clock, ShieldCheck, Star, User, Send, 
  AlertTriangle, ZoomIn, X, Check, Copy, ExternalLink,
  ThumbsUp, Flag, ShoppingBag, Truck, RotateCcw, Award
} from 'lucide-react';

// Swiper Components & Styles
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay, Zoom, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/zoom';
import 'swiper/css/thumbs';

// চ্যাট কম্পোনেন্ট ইম্পোর্ট
import UnifiedChat from '@/components/chat/UnifiedChat';
import { getRoomId } from '@/helpers/chat';

interface AdDetailsProps {
  ad: {
    id?: string;
    title?: string;
    price?: number;
    originalPrice?: number;
    discount?: number;
    location?: string;
    sellerName?: string;
    sellerAvatar?: string;
    sellerVerified?: boolean;
    sellerJoinDate?: string;
    rating?: number;
    reviewCount?: number;
    soldCount?: number;
    images?: string[];
    description?: string;
    deliveryTime?: string;
    returnDays?: number;
    warranty?: boolean;
    category?: string;
  };
  onClose: () => void;
}

const AdDetails = ({ ad, onClose }: AdDetailsProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const swiperRef = useRef<any>(null);

  // চেক করুন ইউজার লগইন কিনা (localStorage থেকে)
  useEffect(() => {
    const storedUser = localStorage.getItem("sosta_user");
    setIsLoggedIn(!!storedUser);
  }, []);

  // স্লাইডার ডাটা
  const mediaItems = ad?.images && ad.images.length > 0 
    ? ad.images.map((url, idx) => ({ type: 'image', url }))
    : [
        { type: 'image', url: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1696446267197-03e5c709e99c?q=80&w=1000' },
        { type: 'image', url: 'https://images.unsplash.com/photo-1592899677977-9e10cb588fef?q=80&w=1000' },
      ];

  // পণ্যের জন্য ইউনিক রুম আইডি
  const productRoomId = getRoomId('marketplace', ad?.id || 'product_123');

  // দাম ক্যালকুলেশন
  const price = ad?.price || 120000;
  const originalPrice = ad?.originalPrice || 150000;
  const discount = ad?.discount || Math.round(((originalPrice - price) / originalPrice) * 100);

  // হোয়াটসঅ্যাপে শেয়ার
  const handleWhatsAppShare = () => {
    const text = `🛍️ ${ad?.title || 'প্রোডাক্ট'}\n💰 দাম: ৳${price.toLocaleString()}\n⭐ রেটিং: ${ad?.rating || 4.8}\n\nশপ করুন: ${window.location.href}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // ফেসবুকে শেয়ার
  const handleFacebookShare = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
    window.open(url, '_blank');
  };

  // লিংক কপি
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // চ্যাট খোলার ফাংশন
  const handleOpenChat = () => {
    if (!isLoggedIn) {
      alert('🔐 চ্যাট করতে দয়া করে লগইন করুন।');
      window.location.href = '/login';
      return;
    }
    setShowChat(true);
  };

  // ফেভারিট টগল
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Supabase এ সংরক্ষণ
  };

  // রিপোর্ট ফাংশন
  const handleReport = () => {
    alert('📢 বিজ্ঞাপনটি রিপোর্ট করার জন্য আমাদের সাপোর্ট টিমকে জানান।');
  };

  // স্ক্রল কন্ট্রোল
  useEffect(() => {
    if (showChat) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showChat]);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 bg-white z-[100] overflow-y-auto"
      >
        {/* Back Button */}
        <button 
          onClick={onClose}
          className="fixed top-4 left-4 z-50 p-3 bg-white/90 backdrop-blur-md text-gray-800 rounded-full shadow-lg hover:bg-white transition-all active:scale-95 border border-gray-100"
        >
          <ChevronLeft size={22} />
        </button>

        {/* Share Button Group */}
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button 
            onClick={handleFacebookShare}
            className="p-3 bg-white/90 backdrop-blur-md text-blue-600 rounded-full shadow-lg hover:bg-white transition-all active:scale-95 border border-gray-100"
          >
            <Share2 size={18} />
          </button>
          <button 
            onClick={handleCopyLink}
            className="p-3 bg-white/90 backdrop-blur-md text-gray-600 rounded-full shadow-lg hover:bg-white transition-all active:scale-95 border border-gray-100"
          >
            {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
          </button>
        </div>

        {/* ইমেজ স্লাইডার */}
        <div className="w-full h-[500px] bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
          <Swiper
            ref={swiperRef}
            modules={[Pagination, Autoplay, Zoom, Thumbs]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            zoom={{ maxRatio: 3 }}
            pagination={{ clickable: true, dynamicBullets: true }}
            thumbs={{ swiper: thumbsSwiper }}
            onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
            className="h-full w-full"
          >
            {mediaItems.map((item, index) => (
              <SwiperSlide key={index} className="w-full h-full flex items-center justify-center">
                <div className="swiper-zoom-container w-full h-full">
                  <img 
                    src={item.url} 
                    className="w-full h-full object-contain" 
                    alt={`product ${index + 1}`}
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Image Counter Badge */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-bold">
            {activeImageIndex + 1} / {mediaItems.length}
          </div>
          
          {/* Zoom Hint */}
          <div className="absolute bottom-6 right-4 z-50 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full text-white/70 text-[10px] flex items-center gap-1">
            <ZoomIn size={10} /> জুম করতে ডাবল ট্যাপ করুন
          </div>
        </div>

        {/* কন্টেন্ট এরিয়া */}
        <div className="px-5 pt-6 pb-24 relative z-10">
          
          {/* Category & Badges */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-orange-100 text-orange-600 text-[10px] font-bold px-3 py-1 rounded-full uppercase">
              {ad?.category || 'ইলেকট্রনিক্স'}
            </span>
            <span className="bg-green-100 text-green-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Award size={10} /> ট্রেন্ডিং
            </span>
            <span className="bg-blue-100 text-blue-600 text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <Clock size={10} /> নতুন
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-4">
            {ad?.title || 'iPhone 15 Pro Max'}
          </h1>

          {/* Rating & Sold */}
          <div className="flex items-center gap-4 mb-5">
            <div className="flex items-center gap-1.5">
              <div className="flex text-yellow-400">
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" />
                <Star size={16} fill="currentColor" className="text-gray-300" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{ad?.rating || 4.8}</span>
              <span className="text-xs text-gray-400">({ad?.reviewCount || 128} রিভিউ)</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <ShoppingBag size={14} className="text-gray-400" />
              <span className="text-sm text-gray-600">{ad?.soldCount || 440} সোল্ড</span>
            </div>
          </div>

          {/* Price Card */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-5 mb-6 border border-orange-100">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl md:text-4xl font-black text-orange-600">৳{price.toLocaleString()}</span>
              <span className="text-lg text-gray-400 line-through">৳{originalPrice.toLocaleString()}</span>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">-{discount}%</span>
            </div>
            <p className="text-xs text-green-600 font-medium flex items-center gap-1">
              <Truck size={12} /> ফ্রি ডেলিভারি | স্টকে আছে
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-8">
            <button 
              onClick={handleOpenChat}
              className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
            >
              <MessageCircle size={18} /> চ্যাট
            </button>
            <button 
              onClick={handleWhatsAppShare}
              className="flex items-center justify-center gap-2 bg-green-500 text-white py-3.5 rounded-xl font-bold shadow-lg active:scale-95 transition-all"
            >
              <Phone size={18} /> কল করুন
            </button>
            <button 
              onClick={handleFavorite}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold shadow-sm active:scale-95 transition-all border ${isFavorite ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-gray-200 text-gray-600'}`}
            >
              <Heart size={18} className={isFavorite ? "fill-red-500" : ""} /> 
              {isFavorite ? 'সেভড' : 'সেভ'}
            </button>
          </div>

          {/* Seller Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {ad?.sellerName?.[0] || 'S'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{ad?.sellerName || 'সাব্বির আহমেদ'}</h4>
                  <div className="flex items-center gap-1 mt-1">
                    <ShieldCheck size={12} className="text-green-500" />
                    <p className="text-[10px] font-semibold text-gray-400">
                      {ad?.sellerVerified ? 'ভেরিফাইড সেলার' : 'সেলার'} 
                      {ad?.sellerJoinDate && ` • সদস্য ${ad.sellerJoinDate}`}
                    </p>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleOpenChat}
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm active:scale-95"
              >
                মেসেজ
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
              <div className="text-center">
                <p className="text-xs text-gray-400">সাড়া দেওয়ার হার</p>
                <p className="font-bold text-gray-800">98%</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-400">গড় সাড়া সময়</p>
                <p className="font-bold text-gray-800">১ ঘন্টা</p>
              </div>
            </div>
          </div>

          {/* Delivery Info */}
          <div className="bg-gray-50 rounded-2xl p-5 mb-6">
            <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Truck size={18} className="text-orange-500" /> ডেলিভারি তথ্য
            </h4>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between">
                <span className="text-gray-500">ডেলিভারি চার্জ:</span>
                <span className="font-medium text-green-600">ফ্রি</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">এস্টিমেটেড ডেলিভারি:</span>
                <span className="font-medium">{ad?.deliveryTime || '৮-১৩ এপ্রিল'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500">রিটার্ন পলিসি:</span>
                <span className="font-medium flex items-center gap-1"><RotateCcw size={12} /> {ad?.returnDays || 14} দিন ইজি রিটার্ন</span>
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h4 className="font-bold text-gray-800 mb-3">বিবরণ</h4>
            <p className={`text-gray-600 text-sm leading-relaxed ${!showFullDescription && 'line-clamp-3'}`}>
              {ad?.description || 'আইফোন ১৫ প্রো ম্যাক্স। অত্যাধুনিক ডিজাইন ও অসাধারণ পারফরম্যান্স। টাইটানিয়াম বডি, এ১৭ প্রো চিপ, ৪৮এমপি ক্যামেরা। ব্যাটারি ব্যাকআপ চমৎকার। অরিজিনাল পণ্য।'}
            </p>
            <button 
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="text-orange-500 text-sm font-medium mt-2"
            >
              {showFullDescription ? 'কম দেখুন' : 'আরও দেখুন'}
            </button>
          </div>

          {/* Reviews Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-800">ক্রেতার রিভিউ</h4>
              <button className="text-orange-500 text-sm font-medium">সব দেখুন →</button>
            </div>
            
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User size={18} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">রাহিম উদ্দিন</p>
                      <div className="flex text-yellow-400 text-xs">
                        <Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/><Star size={10} fill="currentColor"/>
                      </div>
                    </div>
                    <span className="text-[10px] text-gray-400 ml-auto">২ দিন আগে</span>
                  </div>
                  <p className="text-gray-600 text-sm">পণ্যটি অসাধারণ! একদম অরিজিনাল। দ্রুত ডেলিভারি পেয়েছি।</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button className="flex items-center gap-1 text-gray-400 text-xs"><ThumbsUp size={12} /> সাহায্যকর</button>
                    <button className="flex items-center gap-1 text-gray-400 text-xs"><Flag size={12} /> রিপোর্ট</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Report Button */}
          <button 
            onClick={handleReport}
            className="w-full flex items-center justify-center gap-2 text-gray-400 text-xs py-3 border-t border-gray-100 mt-4"
          >
            <AlertTriangle size={12} /> এই বিজ্ঞাপনটি রিপোর্ট করুন
          </button>
        </div>
      </motion.div>

      {/* চ্যাট মডাল */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[200] bg-white rounded-t-3xl shadow-2xl h-[85vh] md:h-[75vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">লাইভ চ্যাট</h3>
                  <p className="text-[10px] opacity-80 line-clamp-1 max-w-[200px]">
                    {ad?.title?.slice(0, 35) || 'প্রোডাক্ট'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowChat(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <UnifiedChat roomId={productRoomId} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdDetails;