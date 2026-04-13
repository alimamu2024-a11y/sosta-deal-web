"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import { useInfiniteQuery, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import { 
  ShoppingBag, Search, Heart, Loader2, 
  Zap, Flame, Camera, Menu, Mail, X, Sparkles, Star, Gift,
  Home, Grid, TrendingUp, User, LogOut
} from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const queryClient = new QueryClient();

// ============ ডাটা (পূর্বের মতই) ============
const BANNER_SLIDES = [
  { id: 1, title: "মেগা সেল", discount: "৭০% ছাড়", color: "from-purple-600 to-pink-600" },
  { id: 2, title: "ফ্ল্যাশ ডিল", discount: "৬০% ছাড়", color: "from-orange-600 to-red-600" },
  { id: 3, title: "নতুন সংগ্রহ", discount: "৫০% ছাড়", color: "from-blue-600 to-cyan-600" },
  { id: 4, title: "ইলেকট্রনিক্স", discount: "৪০% ছাড়", color: "from-green-600 to-teal-600" },
  { id: 5, title: "ফ্যাশন উইক", discount: "৬০% ছাড়", color: "from-pink-600 to-rose-600" },
  { id: 6, title: "হোম ডেকোর", discount: "৫০% ছাড়", color: "from-amber-600 to-yellow-600" },
  { id: 7, title: "বিউটি সেল", discount: "৪০% ছাড়", color: "from-purple-500 to-pink-500" },
  { id: 8, title: "স্পোর্টস", discount: "৫০% ছাড়", color: "from-red-600 to-orange-600" },
  { id: 9, title: "কিডস জোন", discount: "৭০% ছাড়", color: "from-green-500 to-emerald-500" },
  { id: 10, title: "প্রিমিয়াম", discount: "৩০% ছাড়", color: "from-indigo-600 to-purple-600" },
];

const CATEGORIES = [
  { id: 1, name: "ফ্যাশন", icon: "👕", color: "from-pink-400 to-rose-400" },
  { id: 2, name: "ইলেকট্রনিক্স", icon: "📱", color: "from-blue-400 to-cyan-400" },
  { id: 3, name: "হোম", icon: "🏠", color: "from-green-400 to-emerald-400" },
  { id: 4, name: "বিউটি", icon: "💄", color: "from-purple-400 to-pink-400" },
  { id: 5, name: "স্পোর্টস", icon: "⚽", color: "from-orange-400 to-red-400" },
  { id: 6, name: "মোবাইল", icon: "📱", color: "from-indigo-400 to-purple-400" },
  { id: 7, name: "কম্পিউটার", icon: "💻", color: "from-gray-500 to-gray-700" },
  { id: 8, name: "ঘড়ি", icon: "⌚", color: "from-slate-400 to-gray-500" },
  { id: 9, name: "ব্যাগ", icon: "👜", color: "from-amber-400 to-orange-400" },
  { id: 10, name: "জুতা", icon: "👟", color: "from-red-400 to-orange-400" },
  { id: 11, name: "গহনা", icon: "💍", color: "from-yellow-400 to-amber-400" },
  { id: 12, name: "বই", icon: "📚", color: "from-emerald-500 to-green-500" },
  { id: 13, name: "খেলনা", icon: "🧸", color: "from-yellow-400 to-orange-400" },
  { id: 14, name: "স্বাস্থ্য", icon: "💪", color: "from-teal-400 to-green-400" },
  { id: 15, name: "পোষ্য", icon: "🐕", color: "from-amber-300 to-yellow-400" },
  { id: 16, name: "ফার্নিচার", icon: "🛋️", color: "from-stone-400 to-stone-600" },
  { id: 17, name: "গেমিং", icon: "🎮", color: "from-purple-500 to-indigo-500" },
  { id: 18, name: "মিউজিক", icon: "🎵", color: "from-red-500 to-pink-500" },
  { id: 19, name: "ক্যামেরা", icon: "📷", color: "from-gray-400 to-gray-600" },
  { id: 20, name: "বেবি", icon: "👶", color: "from-sky-400 to-blue-400" },
  { id: 21, name: "স্টেশনারি", icon: "✏️", color: "from-lime-400 to-green-400" },
  { id: 22, name: "টুলস", icon: "🔧", color: "from-gray-500 to-gray-700" },
  { id: 23, name: "ফুল", icon: "🌸", color: "from-pink-300 to-rose-300" },
  { id: 24, name: "গিফট", icon: "🎁", color: "from-red-400 to-orange-400" },
];

const TABS = ["সব", "মহিলা", "পুরুষ", "কিডস", "ইলেকট্রনিক্স", "ফ্যাশন"];

const FLASH_SALE = [
  { id: 1, price: 674, original: 1348, discount: 50 },
  { id: 2, price: 378, original: 756, discount: 50 },
  { id: 3, price: 841, original: 1682, discount: 50 },
  { id: 4, price: 674, original: 1348, discount: 50 },
  { id: 5, price: 378, original: 756, discount: 50 },
  { id: 6, price: 841, original: 1682, discount: 50 },
  { id: 7, price: 499, original: 998, discount: 50 },
  { id: 8, price: 299, original: 598, discount: 50 },
  { id: 9, price: 999, original: 1998, discount: 50 },
  { id: 10, price: 549, original: 1098, discount: 50 },
  { id: 11, price: 199, original: 398, discount: 50 },
  { id: 12, price: 799, original: 1598, discount: 50 },
];

const OFFERS = [
  { id: 1, title: "ফ্যাশন সেল", discount: "৫০%", color: "from-pink-500 to-rose-500" },
  { id: 2, title: "ইলেকট্রনিক্স", discount: "৪০%", color: "from-blue-500 to-cyan-500" },
  { id: 3, title: "হোম ডেকোর", discount: "৬০%", color: "from-green-500 to-emerald-500" },
  { id: 4, title: "বিউটি প্রো", discount: "৩০%", color: "from-purple-500 to-pink-500" },
  { id: 5, title: "স্পোর্টস", discount: "৫০%", color: "from-orange-500 to-red-500" },
  { id: 6, title: "কিডস জোন", discount: "৭০%", color: "from-yellow-500 to-orange-500" },
  { id: 7, title: "মেগা ডিল", discount: "৮০%", color: "from-red-500 to-orange-500" },
  { id: 8, title: "লিমিটেড", discount: "৬০%", color: "from-indigo-500 to-purple-500" },
  { id: 9, title: "প্রিমিয়াম", discount: "৫০%", color: "from-amber-500 to-yellow-500" },
  { id: 10, title: "এক্সক্লুসিভ", discount: "৪০%", color: "from-teal-500 to-green-500" },
  { id: 11, title: "ট্রেন্ডি", discount: "৫০%", color: "from-rose-500 to-pink-500" },
  { id: 12, title: "হট ডিল", discount: "৭০%", color: "from-orange-600 to-red-600" },
];

const categoryToTab: Record<string, string> = {
  "ফ্যাশন": "Fashion", "ইলেকট্রনিক্স": "Electronics", "হোম": "Home",
  "বিউটি": "Beauty", "স্পোর্টস": "Sports", "মোবাইল": "Electronics",
  "কম্পিউটার": "Electronics", "ঘড়ি": "Fashion", "ব্যাগ": "Fashion",
  "জুতা": "Fashion", "গহনা": "Fashion", "বই": "All",
  "খেলনা": "Kids", "স্বাস্থ্য": "Health", "পোষ্য": "All",
  "ফার্নিচার": "Home", "গেমিং": "Electronics", "মিউজিক": "Electronics",
  "ক্যামেরা": "Electronics", "বেবি": "Kids", "স্টেশনারি": "All",
  "টুলস": "Home", "ফুল": "Gifts", "গিফট": "Gifts"
};

const productData: Record<string, string[]> = {
  "সব": ["iPhone 15 Pro", "Nike Air Max", "Samsung TV", "Leather Bag", "Watch", "Headphones", "Laptop", "Camera"],
  "মহিলা": ["Designer Saree", "Women's Watch", "Handbag", "Heels", "Lipstick", "Perfume", "Bracelet", "Sunglasses"],
  "পুরুষ": ["Men's Shirt", "Sneakers", "Men's Watch", "Backpack", "Perfume", "Sunglasses", "Belt", "Wallet"],
  "কিডস": ["Kids Toy", "Baby Dress", "Kids Shoes", "Learning Tablet", "Stroller", "Kids Watch", "Color Pen", "School Bag"],
  "ইলেকট্রনিক্স": ["iPhone 15", "Samsung S24", "MacBook Pro", "iPad Air", "AirPods Pro", "Smart Watch", "Power Bank", "Headphones"],
  "ফ্যাশন": ["Premium T-Shirt", "Denim Jeans", "Leather Jacket", "Hoodie", "Sports Shoes", "Cap", "Scarf", "Belt"],
  "হোম": ["Sofa", "Bed", "Table", "Lamp", "Curtain", "Pillow", "Carpet", "Mirror"],
  "বিউটি": ["Lipstick", "Foundation", "Perfume", "Face Cream", "Shampoo", "Hair Oil", "Nail Polish", "Face Wash"],
  "স্পোর্টস": ["Football", "Cricket Bat", "Gym Gloves", "Protein", "Sports Shoes", "T-shirt", "Short", "Water Bottle"],
};

const fetchProductsAPI = async ({ pageParam = 1, category = "সব", search = "" }) => {
  await new Promise(r => setTimeout(r, 300));
  let items = productData[category] || productData["সব"];
  if (search) items = items.filter(i => i.toLowerCase().includes(search.toLowerCase()));
  const products = Array(20).fill(0).map((_, i) => ({
    id: `${category}-${pageParam}-${i}-${Date.now()}`,
    title: `${items[i % items.length]} ${(pageParam-1)*20 + i + 1}`,
    price: Math.floor(Math.random() * 5000 + 299),
    image: `https://picsum.photos/seed/${category}${pageParam}${i}/300/400`,
    category: category,
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    sold: Math.floor(Math.random() * 1000),
  }));
  return { products, nextPage: pageParam + 1, hasNextPage: pageParam < 100 };
};

// ============ 3D স্টাইল্ড প্রোডাক্ট কার্ড ============
const ProductCard = React.memo(({ product, onAddToCart, onWishlist }: any) => {
  const router = useRouter();
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => router.push(`/mall/product/${product.id}`)}
      className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer transform-gpu will-change-transform"
    >
      <div className="relative aspect-[3/4] bg-gray-200 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.title} 
          className="w-full h-full object-cover transition-opacity duration-500" 
          loading="lazy"
          onLoad={(e) => { e.currentTarget.style.opacity = "1"; }}
          style={{ opacity: 0 }} 
        />
        <button onClick={(e) => { e.stopPropagation(); onWishlist(product); }} className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full shadow-md">
          <Heart size={14} className="text-gray-600" />
        </button>
        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">-{Math.floor(Math.random() * 40 + 20)}%</div>
      </div>
      <div className="p-2">
        <p className="text-[11px] text-gray-500 line-clamp-1">{product.title}</p>
        <p className="font-bold text-black text-sm">৳{product.price.toLocaleString()}</p>
        <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="mt-1.5 w-full bg-black text-white text-[10px] py-1.5 rounded-lg font-semibold active:scale-95 transition-all">কার্টে যোগ করুন</button>
      </div>
    </motion.div>
  );
});
ProductCard.displayName = "ProductCard";

// ============ মূল কম্পোনেন্ট ============
function TuniMallContent() {
  const router = useRouter();
  const { addToCart, getCartCount } = useCart();
  const [activeTab, setActiveTab] = useState("সব");
  const [searchQuery, setSearchQuery] = useState("");
  const [wishlistMsg, setWishlistMsg] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["products", activeTab, searchQuery],
    queryFn: ({ pageParam = 1 }) => fetchProductsAPI({ pageParam, category: activeTab, search: searchQuery }),
    getNextPageParam: (lastPage) => lastPage.hasNextPage ? lastPage.nextPage : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const allProducts = data?.pages.flatMap(page => page.products) || [];
  const columnCount = 2;
  
  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(allProducts.length / columnCount),
    getScrollElement: () => scrollContainerRef.current,
    estimateSize: () => 320,
    overscan: 3,
  });

  useEffect(() => {
    const lastRowIndex = rowVirtualizer.getVirtualItems().at(-1)?.index;
    if (lastRowIndex !== undefined && lastRowIndex >= Math.ceil(allProducts.length / columnCount) - 2 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [rowVirtualizer.getVirtualItems(), hasNextPage, isFetchingNextPage, fetchNextPage, allProducts.length, columnCount]);

  useEffect(() => {
    refetch();
  }, [activeTab, searchQuery]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchQuery("");
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCategoryClick = (category: string) => {
    const mappedTab = categoryToTab[category] || "সব";
    setActiveTab(mappedTab);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleWishlist = (product: any) => {
    setWishlistMsg(`❤️ ${product.title} উইশলিস্টে যোগ হয়েছে`);
    setTimeout(() => setWishlistMsg(""), 1500);
  };

  const handleAddToCartLocal = (product: any) => {
    addToCart(product);
    setWishlistMsg(`🛒 ${product.title} কার্টে যোগ হয়েছে`);
    setTimeout(() => setWishlistMsg(""), 1500);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        setIsSearching(true);
        refetch();
        setTimeout(() => setIsSearching(false), 600);
      }
    }, 400);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setIsSearching(true);
      refetch();
      setTimeout(() => setIsSearching(false), 600);
    }
  };

  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 15, seconds: 45 });
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen pb-20 overflow-x-hidden selection:bg-orange-100">
      <AnimatePresence>
        {wishlistMsg && (
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-full text-[11px] z-50 whitespace-nowrap backdrop-blur-md">
            {wishlistMsg}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isSearching && (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-xs z-[100] flex items-center gap-2 shadow-lg">
            <Sparkles size={14} className="animate-spin" /><span>🤖 AI সার্চ করছে...</span><Loader2 size={12} className="animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================== আল্ট্রা মডার্ন হেডার ===================== */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-100/50 shadow-sm">
        <div className="px-4 py-3">
          {/* প্রথম সারি - লোগো ও আইকন */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                SOSTA
              </span>
              <span className="text-2xl font-black text-gray-800">DEAL</span>
            </div>
            <div className="flex items-center gap-4">
              <motion.button whileTap={{ scale: 0.9 }} className="relative">
                <Heart size={22} className="text-gray-600" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </motion.button>
              <motion.button whileTap={{ scale: 0.9 }} onClick={() => router.push("/mall/cart")} className="relative">
                <ShoppingBag size={22} className="text-gray-600" />
                {getCartCount() > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-md">
                    {getCartCount()}
                  </span>
                )}
              </motion.button>
            </div>
          </div>

          {/* সার্চ বার - গ্লাসমরফিক */}
          <div className="relative mb-3">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-50" />
            <div className="relative flex items-center bg-white/80 backdrop-blur-md rounded-2xl px-4 py-2.5 border border-gray-100/50 shadow-lg">
              <Search size={18} className="text-gray-400 mr-2" />
              <input
                placeholder="১০ কোটি+ পণ্য সার্চ করুন..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
              />
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="ml-2 px-4 py-1.5 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold rounded-xl shadow-md"
              >
                Search
              </motion.button>
            </div>
          </div>

          {/* ট্যাব - অ্যানিমেটেড আন্ডারলাইন */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
            {TABS.map((tab) => (
              <motion.button
                key={tab}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleTabChange(tab)}
                className={`relative px-4 py-1.5 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? "text-white" 
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {activeTab === tab && (
                  <motion.span
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full -z-10 shadow-md"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
                {tab}
              </motion.button>
            ))}
          </div>
        </div>
      </header>

      {/* ব্যানার সোয়াইপার */}
      <div className="h-44 mx-2 mt-2 rounded-xl overflow-hidden shadow-md">
        <Swiper modules={[Autoplay, Pagination, EffectFade]} autoplay={{ delay: 3000, disableOnInteraction: false }} pagination={{ clickable: true, bulletClass: "swiper-pagination-bullet !bg-white" }} effect="fade" loop className="h-full">
          {BANNER_SLIDES.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className={`relative h-full bg-gradient-to-r ${slide.color}`}>
                <div className="absolute inset-0 flex flex-col justify-center px-5">
                  <h2 className="text-white text-xl font-black drop-shadow">{slide.title}</h2>
                  <p className="text-yellow-300 text-sm font-bold">{slide.discount}</p>
                  <button onClick={() => router.push(`/mall/product/banner-${slide.id}`)} className="mt-1.5 bg-white text-black px-4 py-0.5 text-[10px] font-bold rounded-full w-fit shadow">এখনই কিনুন →</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ক্যাটাগরি গ্রিড - 3D হোভার ইফেক্ট */}
      <div className="bg-white mt-2 py-4 px-2 rounded-t-2xl shadow-sm">
        <div className="flex justify-between items-center mb-3 px-1"><span className="font-bold text-gray-700 text-sm">ক্যাটাগরি</span><button className="text-[10px] text-orange-500">সব দেখুন →</button></div>
        <div className="grid grid-cols-5 gap-y-4 gap-x-2">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center cursor-pointer transform-gpu will-change-transform"
            >
              <div className="w-14 h-14 min-w-[56px] min-h-[56px] rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-2xl shadow-md transition-all duration-200 hover:shadow-lg">
                {cat.icon}
              </div>
              <span className="text-[10px] mt-1.5 font-medium text-gray-700 text-center">{cat.name}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ফ্ল্যাশ সেল - মডার্ন */}
      <div className="mt-2 bg-gradient-to-r from-red-50 to-orange-50 px-3 py-3 mx-2 rounded-xl shadow">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-1.5"><Zap size={18} className="text-red-500 animate-pulse" fill="currentColor" /><span className="font-bold text-red-600 text-sm">ফ্ল্যাশ সেল</span></div>
          <div className="text-[10px] font-bold bg-black text-white px-2.5 py-1 rounded-full shadow">{String(timeLeft.hours).padStart(2,'0')}:{String(timeLeft.minutes).padStart(2,'0')}:{String(timeLeft.seconds).padStart(2,'0')}</div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {FLASH_SALE.map((item) => (
            <motion.div
              key={item.id}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push(`/mall/product/flash-${item.id}`)}
              className="bg-white rounded-xl p-1 shadow-md cursor-pointer transform-gpu"
            >
              <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-3xl">
                <span className="shrink-0">⚡</span>
                <div className="absolute top-0 left-0 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br">-{item.discount}%</div>
              </div>
              <div className="text-center mt-1"><p className="text-red-600 font-bold text-xs">৳{item.price}</p><p className="text-gray-400 text-[9px] line-through">৳{item.original}</p></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* অফার গ্রিড */}
      <div className="mt-2 px-2">
        <div className="flex justify-between items-center mb-2 px-1"><div className="flex items-center gap-1.5"><span className="text-sm">🎁</span><span className="font-bold text-gray-700 text-sm">হট অফার</span></div><button className="text-[10px] text-orange-500">সব দেখুন →</button></div>
        <div className="grid grid-cols-4 gap-2">
          {OFFERS.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => router.push(`/mall/product/offer-${offer.id}`)}
              className={`bg-gradient-to-r ${offer.color} rounded-xl p-2 shadow-lg cursor-pointer transform-gpu`}
            >
              <p className="text-white text-[8px] opacity-80">অফার</p>
              <p className="text-white text-[10px] font-bold leading-tight">{offer.title}</p>
              <p className="text-yellow-200 text-[12px] font-black">{offer.discount}</p>
              <button className="mt-1 bg-white/20 text-white text-[7px] px-1.5 py-0.5 rounded-full">কিনুন →</button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* প্রস্তাবিত পণ্য ভার্চুয়াল স্ক্রল */}
      <div className="px-2 mt-2">
        <div className="flex justify-between items-center mb-2 px-1"><h2 className="font-bold flex items-center gap-1 text-gray-800 text-sm"><Flame size={16} className="text-orange-500" />প্রস্তাবিত পণ্য</h2><button className="text-[10px] text-orange-500">সব দেখুন →</button></div>
        
        {isLoading && allProducts.length === 0 ? (
          <div className="grid grid-cols-2 gap-2">{[...Array(6)].map((_, i) => <div key={i} className="bg-white rounded-xl p-2 animate-pulse h-64" />)}</div>
        ) : allProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl"><div className="text-5xl mb-2">🛒</div><p className="text-gray-400 text-xs">কোন পণ্য নেই</p><button onClick={() => refetch()} className="mt-3 text-orange-500 text-xs font-semibold">আবার চেষ্টা করুন →</button></div>
        ) : (
          <div ref={scrollContainerRef} className="h-[600px] overflow-y-auto rounded-xl">
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const rowItems = allProducts.slice(virtualRow.index * columnCount, (virtualRow.index + 1) * columnCount);
                return (
                  <div
                    key={virtualRow.key}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                      display: 'flex',
                      gap: '8px',
                      padding: '4px',
                    }}
                  >
                    {rowItems.map((product: any) => (
                      <div key={product.id} className="w-1/2">
                        <ProductCard product={product} onAddToCart={handleAddToCartLocal} onWishlist={handleWishlist} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function TuniMallHome() {
  return (
    <QueryClientProvider client={queryClient}>
      <TuniMallContent />
    </QueryClientProvider>
  );
}