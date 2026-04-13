// components/AdDetails.tsx
"use client";
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, MapPin, Share2, Heart, MessageCircle, ChevronLeft, Clock, 
  ShieldCheck, Star, User, X, Copy, AlertTriangle, Truck, RotateCcw, 
  Award, Check, Eye, ThumbsUp, Flag, ShoppingBag, Zap, Calendar, Mail,
  Sparkles, TrendingUp, BadgeCheck, Store, CircleCheck
} from 'lucide-react';
import LazyImage from './LazyImage';

const UnifiedChat = lazy(() => import('./chat/UnifiedChat').catch(() => ({ default: () => <div className="p-4 text-center">চ্যাট লোড হয়নি</div> })));

const getRoomId = (platform: string, id: string) => `${platform}_${id}`;

export default function AdDetails({ ad, onClose }: any) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("sosta_user"));
  }, []);

  const mediaItems = ad?.images?.length ? ad.images.map((url: string) => ({ type: 'image', url })) : [{ type: 'image', url: ad.image }];
  const productRoomId = getRoomId('marketplace', ad?.id);
  const discount = Math.round(((ad.originalPrice - ad.price) / ad.originalPrice) * 100);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `🛍️ ${ad.title}\n💰 দাম: ৳${ad.price.toLocaleString()}\n⭐ রেটিং: ${ad.rating}\n\nশপ করুন: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleFacebookShare = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
  };

  const handleOpenChat = () => {
    if (!isLoggedIn) return (window.location.href = '/login');
    setShowChat(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.96 }} 
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="fixed inset-0 bg-white z-[100] overflow-y-auto"
    >
      {/* Glassmorphic Back Button */}
      <button 
        onClick={onClose} 
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all border border-white/20"
      >
        <ChevronLeft size={20} className="text-gray-700" />
      </button>
      
      {/* Share Button Group */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button onClick={handleFacebookShare} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all border border-white/20">
          <Share2 size={18} className="text-gray-700" />
        </button>
        <button onClick={handleWhatsAppShare} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all border border-white/20">
          <Phone size={18} className="text-gray-700" />
        </button>
        <button onClick={handleCopyLink} className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all border border-white/20">
          {isCopied ? <Check size={18} className="text-green-500" /> : <Copy size={18} className="text-gray-700" />}
        </button>
      </div>

      {/* Image Gallery - Modern Full Width */}
      <div className="w-full h-[480px] bg-black relative overflow-hidden">
        {mediaItems.map((item: any, idx: number) => (
          <div 
            key={idx} 
            className={`absolute inset-0 transition-all duration-500 ease-out ${activeImageIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
          >
            <LazyImage src={item.url} alt={`product ${idx + 1}`} className="w-full h-full object-contain" />
          </div>
        ))}
        
        {/* Image Counter Badge */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-xs font-medium">
          {activeImageIndex + 1} / {mediaItems.length}
        </div>
        
        {/* Image Navigation Dots */}
        <div className="absolute bottom-6 right-4 flex gap-1.5">
          {mediaItems.map((_: any, idx: number) => (
            <button
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                activeImageIndex === idx ? 'w-6 bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="px-5 pt-6 pb-28 relative z-10">
        
        {/* Category Badges */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <Sparkles size={10} /> {ad.category || "ইলেকট্রনিক্স"}
          </span>
          {ad.urgent && (
            <span className="bg-gradient-to-r from-red-100 to-red-200 text-red-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
              <Zap size={10} /> জরুরি বিক্রি
            </span>
          )}
          {discount > 0 && (
            <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm">
              -{discount}% ছাড়
            </span>
          )}
          <span className="bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 text-[11px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1">
            <TrendingUp size={10} /> ট্রেন্ডিং
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight mb-3">
          {ad.title}
        </h1>

        {/* Rating & Stats */}
        <div className="flex items-center gap-4 mb-5 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400 gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} size={14} fill={i <= Math.floor(ad.rating) ? "currentColor" : "none"} className={i <= Math.floor(ad.rating) ? "text-yellow-400" : "text-gray-300"} />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-800">{ad.rating}</span>
            <span className="text-xs text-gray-400">({ad.reviewCount || 128} রিভিউ)</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <Eye size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600">{ad.viewCount || 1240} বার দেখা</span>
          </div>
          <div className="w-px h-4 bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <ShoppingBag size={14} className="text-gray-400" />
            <span className="text-sm text-gray-600">{ad.soldCount || 89} সোল্ড</span>
          </div>
        </div>

        {/* Price Card - Premium Design */}
        <div className="bg-gradient-to-r from-orange-50 via-red-50 to-orange-50 rounded-2xl p-5 mb-6 border border-orange-100/50 shadow-sm">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl md:text-4xl font-black text-orange-600">৳{ad.price?.toLocaleString() || '১,২০,০০০'}</span>
            <span className="text-base text-gray-400 line-through">৳{ad.originalPrice?.toLocaleString() || '১,৫০,০০০'}</span>
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">-{discount}%</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-green-600 font-medium flex items-center gap-1"><Truck size={12} /> ফ্রি ডেলিভারি</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-600 flex items-center gap-1"><RotateCcw size={10} /> {ad.returnDays || 7} দিন রিটার্ন</span>
          </div>
        </div>

        {/* Action Buttons - Modern Gradient */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <button 
            onClick={handleOpenChat}
            className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2"><MessageCircle size={18} /> চ্যাট</span>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button 
            className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3.5 rounded-xl font-bold shadow-md hover:shadow-xl transition-all duration-300 active:scale-95"
          >
            <span className="relative z-10 flex items-center justify-center gap-2"><Phone size={18} /> কল</span>
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className={`group relative overflow-hidden py-3.5 rounded-xl font-bold transition-all duration-300 active:scale-95 border-2 ${
              isFavorite 
                ? 'bg-red-50 border-red-200 text-red-500' 
                : 'bg-white border-gray-200 text-gray-700 hover:border-orange-200 hover:bg-orange-50'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              <Heart size={18} className={isFavorite ? 'fill-red-500' : ''} /> 
              {isFavorite ? 'সেভড' : 'সেভ'}
            </span>
          </button>
        </div>

        {/* Seller Card - Premium */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {ad.sellerName?.[0] || 'S'}
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-gray-800 text-lg">{ad.sellerName || 'সাব্বির আহমেদ'}</h4>
                  {ad.sellerVerified && <BadgeCheck size={16} className="text-blue-500" />}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <ShieldCheck size={12} className="text-green-500" />
                  <p className="text-[10px] font-medium text-gray-500">{ad.sellerVerified ? 'ভেরিফাইড সেলার' : 'সেলার'}</p>
                  <span className="text-gray-300 text-[10px]">•</span>
                  <p className="text-[10px] font-medium text-gray-500">সদস্য {ad.sellerJoinDate || '২০২৪'}</p>
                </div>
              </div>
            </div>
            <button 
              onClick={handleOpenChat}
              className="px-4 py-2 bg-gray-100 hover:bg-orange-100 text-gray-700 hover:text-orange-600 rounded-xl text-sm font-medium transition-all duration-200"
            >
              মেসেজ
            </button>
          </div>
          
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100">
            <div className="text-center">
              <p className="text-[10px] text-gray-400">সাড়া দেওয়ার হার</p>
              <p className="font-bold text-gray-800 text-sm">98%</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">গড় সাড়া সময়</p>
              <p className="font-bold text-gray-800 text-sm">১ ঘন্টা</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400">সম্পন্ন অর্ডার</p>
              <p className="font-bold text-gray-800 text-sm">{ad.completedOrders || 156}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <h4 className="font-bold text-gray-800 text-base mb-2 flex items-center gap-2">বিবরণ</h4>
          <p className={`text-gray-600 text-sm leading-relaxed ${!showFullDescription && 'line-clamp-3'}`}>
            {ad.description || 'পণ্যটি অরিজিনাল এবং নতুন কন্ডিশনে আছে। ডেলিভারির আগে চেক করে নেওয়া যাবে। বাজেট নেগোশিয়েবল।'}
          </p>
          <button 
            onClick={() => setShowFullDescription(!showFullDescription)} 
            className="text-orange-500 text-sm font-medium mt-2 hover:text-orange-600 transition-colors"
          >
            {showFullDescription ? 'কম দেখুন ↑' : 'আরও দেখুন ↓'}
          </button>
        </div>

        {/* Delivery Info Card */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-6">
          <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
            <Truck size={18} className="text-orange-500" /> ডেলিভারি তথ্য
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500">ডেলিভারি চার্জ:</span>
              <span className="font-medium text-green-600">ফ্রি</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">এস্টিমেটেড ডেলিভারি:</span>
              <span className="font-medium">{ad.deliveryTime || '৮-১৩ এপ্রিল'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">রিটার্ন পলিসি:</span>
              <span className="font-medium flex items-center gap-1"><RotateCcw size={12} /> {ad.returnDays || 14} দিন ইজি রিটার্ন</span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-500 text-sm mb-6 pb-4 border-b border-gray-100">
          <MapPin size={16} className="text-orange-500" />
          <span>{ad.location || 'কুষ্টিয়া সদর, কুষ্টিয়া'}</span>
        </div>

        {/* Report Button */}
        <button className="w-full flex items-center justify-center gap-2 text-gray-400 text-xs py-3 hover:text-red-500 transition-colors">
          <AlertTriangle size={12} /> বিজ্ঞাপনটি রিপোর্ট করুন
        </button>
      </div>

      {/* Chat Modal */}
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
                  <p className="text-[10px] opacity-80 line-clamp-1 max-w-[200px]">{ad?.title?.slice(0, 35) || 'প্রোডাক্ট'}</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <Suspense fallback={<div className="p-4 text-center">চ্যাট লোড হচ্ছে...</div>}>
                <UnifiedChat roomId={productRoomId} />
              </Suspense>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}