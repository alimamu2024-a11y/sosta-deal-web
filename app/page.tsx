"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { 
    Search, Home as HomeIcon, Gavel, Users, User, Smartphone, Monitor,
    Shirt, Car, Briefcase, Settings, Building2, Gift,
    Gem, ShoppingBag, Plus, Mic, Heart, Bell, PlusSquare, 
    MessageCircleMore, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PostAdForm from '../components/PostAdForm';

type AdItem = {
  id: number;
  title: string;
  price: number;
  condition: string;
  time: string;
  image: string;
  urgent: boolean;
};

// ডামি অ্যাড ডাটা জেনারেটর
const generateMockAds = (page: number, limit: number): AdItem[] => {
  const items = [];
  const startId = (page - 1) * limit;
  for (let i = 0; i < limit; i++) {
    const id = startId + i + 1;
    items.push({
      id: id,
      title: `${['iPhone 15 Pro', 'Samsung TV', 'Nike Shoes', 'Leather Bag', 'Watch', 'Headphones', 'Laptop', 'Camera', 'Gaming Chair', 'Smart Watch'][i % 10]}`,
      price: Math.floor(Math.random() * 50000 + 1000),
      condition: ['নতুন', 'পুরাতন', 'ভালো', 'মোটামুটি'][Math.floor(Math.random() * 4)],
      time: `${Math.floor(Math.random() * 60)} মিনিট আগে`,
      image: `https://picsum.photos/seed/ad_${id}/400/400`,
      urgent: Math.random() > 0.7,
    });
  }
  return items;
};

// লেজি লোড ইমেজ কম্পোনেন্ট
const LazyImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && imgRef.current) {
            imgRef.current.src = src;
            observer.disconnect();
          }
        });
      },
      { rootMargin: '100px' }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [src]);

  return (
    <div className="relative h-32 bg-gray-100">
      {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      <img
        ref={imgRef}
        className="w-full h-full object-cover transition-opacity duration-300"
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        style={{ opacity: isLoaded ? 1 : 0 }}
      />
    </div>
  );
};

// ছোট কার্ড (৩ কলামের জন্য)
const SmallAdCard = ({ ad }: { ad: AdItem }) => (
  <Link href="/post-details">
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group">
      <div className="relative">
        <LazyImage src={ad.image} alt={ad.title} />
        {ad.urgent && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            Urgent
          </div>
        )}
      </div>
      <div className="p-2">
        <h3 className="font-bold text-xs text-gray-800 line-clamp-1 group-hover:text-orange-600">
          {ad.title}
        </h3>
        <p className="text-[9px] text-gray-400 mt-1 uppercase flex items-center gap-1">
          <span>{ad.condition}</span> • <span>{ad.time}</span>
        </p>
        <div className="mt-1 text-orange-600 font-black text-sm">
          ৳ {ad.price.toLocaleString()}
        </div>
      </div>
    </div>
  </Link>
);

// বড় কার্ড (২ কলামের জন্য)
const LargeAdCard = ({ ad }: { ad: AdItem }) => (
  <Link href="/post-details">
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all group flex flex-row h-28 md:h-32">
      <div className="relative w-28 md:w-32 h-full">
        <LazyImage src={ad.image} alt={ad.title} />
        {ad.urgent && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm">
            Urgent
          </div>
        )}
      </div>
      <div className="flex-1 p-2 md:p-3 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-xs md:text-sm text-gray-800 line-clamp-2 group-hover:text-orange-600">
            {ad.title}
          </h3>
          <p className="text-[9px] text-gray-400 mt-1 uppercase">
            {ad.condition} • {ad.time}
          </p>
        </div>
        <div className="text-orange-600 font-black text-sm md:text-base">
          ৳ {ad.price.toLocaleString()}
        </div>
      </div>
    </div>
  </Link>
);

// স্কেলেটন কার্ড
const SmallSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
    <div className="h-32 bg-gray-200" />
    <div className="p-2">
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-2 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3" />
    </div>
  </div>
);

const LargeSkeleton = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse flex flex-row h-28 md:h-32">
    <div className="w-28 md:w-32 h-full bg-gray-200" />
    <div className="flex-1 p-2 md:p-3">
      <div className="h-3 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-2 bg-gray-200 rounded w-1/2 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mt-6 md:mt-8" />
    </div>
  </div>
);

const SostaDealFinalUpgrade = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isSellFormOpen, setIsSellFormOpen] = useState(false);
  
  // রিসেন্ট অ্যাডস (৩ কলাম – ৩টি করে লোড)
  const [recentAds, setRecentAds] = useState<AdItem[]>([]);
  const [recentPage, setRecentPage] = useState(1);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [hasMoreRecent, setHasMoreRecent] = useState(true);
  const recentObserverRef = useRef<HTMLDivElement | null>(null);
  const isLoadingRecent = useRef(false);

  // প্রস্তাবিত অ্যাডস (২ কলাম – ৫টি করে লোড)
  const [featuredAds, setFeaturedAds] = useState<AdItem[]>([]);
  const [featuredPage, setFeaturedPage] = useState(1);
  const [loadingFeatured, setLoadingFeatured] = useState(false);
  const [hasMoreFeatured, setHasMoreFeatured] = useState(true);
  const featuredObserverRef = useRef<HTMLDivElement | null>(null);
  const isLoadingFeatured = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // রিসেন্ট অ্যাডস লোড (৩টি করে)
  const loadRecentAds = useCallback(async (reset: boolean = false) => {
    if (isLoadingRecent.current || (reset === false && !hasMoreRecent)) return;
    isLoadingRecent.current = true;
    setLoadingRecent(true);
    
    const currentPage = reset ? 1 : recentPage + 1;
    await new Promise(r => setTimeout(r, 500));
    const newAds = generateMockAds(currentPage, 3);
    
    if (reset) {
      setRecentAds(newAds);
      setRecentPage(1);
      setHasMoreRecent(true);
    } else {
      setRecentAds(prev => [...prev, ...newAds]);
      setRecentPage(currentPage);
    }
    
    if (newAds.length < 3) setHasMoreRecent(false);
    setLoadingRecent(false);
    isLoadingRecent.current = false;
  }, [recentPage, hasMoreRecent]);

  // প্রস্তাবিত অ্যাডস লোড (৫টি করে)
  const loadFeaturedAds = useCallback(async (reset: boolean = false) => {
    if (isLoadingFeatured.current || (reset === false && !hasMoreFeatured)) return;
    isLoadingFeatured.current = true;
    setLoadingFeatured(true);
    
    const currentPage = reset ? 1 : featuredPage + 1;
    await new Promise(r => setTimeout(r, 500));
    const newAds = generateMockAds(currentPage + 100, 5);
    
    if (reset) {
      setFeaturedAds(newAds);
      setFeaturedPage(1);
      setHasMoreFeatured(true);
    } else {
      setFeaturedAds(prev => [...prev, ...newAds]);
      setFeaturedPage(currentPage);
    }
    
    if (newAds.length < 5) setHasMoreFeatured(false);
    setLoadingFeatured(false);
    isLoadingFeatured.current = false;
  }, [featuredPage, hasMoreFeatured]);

  // প্রথমবার লোড
  useEffect(() => {
    loadRecentAds(true);
    loadFeaturedAds(true);
  }, []);

  // রিসেন্ট অ্যাডস ইনফিনিট স্ক্রল অবজার্ভার
  useEffect(() => {
    if (!recentObserverRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingRecent && hasMoreRecent) {
          loadRecentAds(false);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    observer.observe(recentObserverRef.current);
    return () => observer.disconnect();
  }, [loadingRecent, hasMoreRecent, loadRecentAds]);

  // প্রস্তাবিত অ্যাডস ইনফিনিট স্ক্রল অবজার্ভার
  useEffect(() => {
    if (!featuredObserverRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingFeatured && hasMoreFeatured) {
          loadFeaturedAds(false);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    observer.observe(featuredObserverRef.current);
    return () => observer.disconnect();
  }, [loadingFeatured, hasMoreFeatured, loadFeaturedAds]);

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
      
      {/* হেডার – অপরিবর্তিত */}
      <header className="bg-white px-4 py-3 sticky top-0 z-[100] border-b border-gray-100 shadow-sm">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center bg-[#f0f1f5] rounded-xl px-4 py-1.5 border focus-within:border-[#f85606] transition-all flex-1">
            <Search size={16} className="text-gray-400" />
            <input type="text" placeholder="SostaDeal এ খুঁজুন..." className="bg-transparent border-none outline-none ml-2 w-full text-xs" />
            <button className="bg-[#f85606] text-white px-4 py-1.5 rounded-lg text-xs font-bold shrink-0 active:scale-95 transition-transform">Search</button>
          </div>
          <Link href="/social" className="hidden md:flex items-center gap-2 bg-orange-100 text-[#f85606] px-4 py-2 rounded-lg font-bold hover:bg-orange-200">
            <Users size={20} />
            <span className="text-sm">SostaSocial</span>
          </Link>
          <ShoppingBag size={20} className="text-gray-600 shrink-0 cursor-pointer" />
        </div>
      </header>

      <div className="max-w-[1200px] mx-auto">
        
        {/* ব্যানার – অপরিবর্তিত */}
        
{/* ব্যানার স্লাইডার - টেক্সট ছবির নিচে */}
<div className="mx-2 md:mx-0">
  {/* ছবি স্লাইডার */}
  <div className="relative h-44 md:h-80 overflow-hidden md:mt-4 md:rounded-3xl shadow-sm">
    <AnimatePresence mode="wait">
      <motion.div 
        key={currentSlide}
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }} 
        exit={{ opacity: 0, x: -20 }} 
        transition={{ duration: 0.5 }}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${
            currentSlide === 0 ? '/banner1.jpg' : 
            currentSlide === 1 ? '/banner2.jpg' : 
            '/banner3.jpg'
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* হালকা ওভারলে (শুধু ছবির ওপরে) */}
        <div className="absolute inset-0 bg-black/10" />
      </motion.div>
    </AnimatePresence>
    
    {/* স্লাইডার ডটস */}
    <div className="absolute bottom-4 w-full flex justify-center gap-1.5 z-10">
      {[0,1,2].map(i => (
        <button
          key={i}
          onClick={() => setCurrentSlide(i)}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            currentSlide === i ? "w-6 bg-white" : "w-1.5 bg-white/60"
          }`}
        />
      ))}
    </div>
  </div>

  {/* টেক্সট সেকশন - ছবির নিচে */}
  <div className="bg-gradient-to-r from-orange-500 to-red-500 mt-3 rounded-xl p-3 text-center shadow-md">
    <h2 className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter">
      {currentSlide === 0 ? "সব ধরণের গাড়ি পাচ্ছেন" : currentSlide === 1 ? "সুমন গাড়ি বাজার এ" : "পুরাতন গাড়ির কালেকশন"}
    </h2>
    <p className="text-xs md:text-sm text-white/90 font-medium mt-1">
      {currentSlide === 0 ? "১৫% পর্যন্ত ছাড়" : currentSlide === 1 ? "সর্বোচ্চ ১০% ছাড়" : "যোগাযোগ করুন সুমন ভাইয়ের সাথে ৩০০২৩৮১৪"}
    </p>
  </div>
</div>
        {/* ক্যাটাগরি – অপরিবর্তিত */}
        <nav className="bg-white py-8 grid grid-cols-5 md:grid-cols-10 gap-y-8 px-1 md:rounded-3xl md:mt-6 shadow-sm">
          {categories.map((item, index) => (
            <motion.div key={index} whileTap={{ scale: 0.8 }} whileHover={{ y: -5 }} className="flex flex-col items-center cursor-pointer group">
              <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-1 bg-gray-50 rounded-full border border-gray-100 group-hover:bg-orange-50 transition-colors shadow-sm">
                {React.cloneElement(item.icon as React.ReactElement<any>, { size: 24 })}
              </div>
              <span className="text-[10px] md:text-xs font-bold text-[#424242] text-center px-1 leading-tight tracking-tight">
                {item.label}
              </span>
            </motion.div>
          ))}
        </nav>

        {/* ✅ সেকশন ১: রিসেন্ট অ্যাডস – ৩ কলাম গ্রিড (ইনফিনিট স্ক্রল, ৩টি করে লোড) */}
        <section className="mt-6 p-4 bg-white md:rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">রিসেন্ট অ্যাডস (কুষ্টিয়া)</h2>
            <button className="text-[11px] font-bold text-[#f85606] uppercase">সব দেখুন &gt;</button>
          </div>

          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {recentAds.map((ad) => (
              <SmallAdCard key={ad.id} ad={ad} />
            ))}
            {loadingRecent && recentAds.length === 0 && (
              [...Array(3)].map((_, i) => <SmallSkeleton key={i} />)
            )}
          </div>
          
          {/* স্ক্রল ট্রিগার – রিসেন্ট অ্যাডস */}
          <div ref={recentObserverRef} className="flex justify-center py-4">
            {loadingRecent && recentAds.length > 0 && (
              <Loader2 className="animate-spin text-orange-500" size={18} />
            )}
            {!hasMoreRecent && recentAds.length > 0 && (
              <p className="text-[10px] text-gray-400">সব অ্যাড দেখানো হয়েছে</p>
            )}
          </div>
        </section>

        {/* ✅ সেকশন ২: প্রস্তাবিত অ্যাডস – ২ কলাম গ্রিড (ইনফিনিট স্ক্রল, ৫টি করে লোড) */}
        <section className="mt-6 p-4 bg-white md:rounded-3xl shadow-sm">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-xl font-black text-gray-800 italic uppercase tracking-tighter">আপনার জন্য প্রস্তাবিত</h2>
            <button className="text-[11px] font-bold text-[#f85606] uppercase">সব দেখুন &gt;</button>
          </div>

          <div className="grid grid-cols-2 gap-2 md:gap-4">
            {featuredAds.map((ad) => (
              <LargeAdCard key={ad.id} ad={ad} />
            ))}
            {loadingFeatured && featuredAds.length === 0 && (
              [...Array(5)].map((_, i) => <LargeSkeleton key={i} />)
            )}
          </div>
          
          {/* স্ক্রল ট্রিগার – প্রস্তাবিত অ্যাডস */}
          <div ref={featuredObserverRef} className="flex justify-center py-4">
            {loadingFeatured && featuredAds.length > 0 && (
              <Loader2 className="animate-spin text-orange-500" size={18} />
            )}
            {!hasMoreFeatured && featuredAds.length > 0 && (
              <p className="text-[10px] text-gray-400">সব প্রস্তাবিত অ্যাড দেখানো হয়েছে</p>
            )}
          </div>
        </section>

      </div>

      {/* পোস্ট অ্যাড ফর্ম – অপরিবর্তিত */}
      <PostAdForm isOpen={isSellFormOpen} onClose={() => setIsSellFormOpen(false)} />
    </div>
  );
};

export default SostaDealFinalUpgrade;