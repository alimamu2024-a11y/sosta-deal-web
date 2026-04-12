"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Heart, Loader2, Flame, TrendingUp, Eye, Star, 
  Trophy, Medal, Crown, Award, Sparkles, Gem, Gift, Users, Store
} from "lucide-react";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  sold: number;
  views: number;
  isTrending: boolean;
};

type TopSeller = {
  id: string;
  name: string;
  avatar: string;
  storeName: string;
  totalSold: number;
  rating: number;
  rank: number;
  points: number;
  badge: string;
  badgeColor: string;
  products: number;
};

type TopBuyer = {
  id: string;
  name: string;
  avatar: string;
  totalPurchased: number;
  totalSpent: number;
  points: number;
  rank: number;
  badge: string;
  badgeColor: string;
  reviews: number;
};

// Mock Top Sellers Data
const TOP_SELLERS: TopSeller[] = [
  { id: "1", name: "Md. Rafiqul Islam", avatar: "https://randomuser.me/api/portraits/men/32.jpg", storeName: "AudioTech Official", totalSold: 45678, rating: 4.9, rank: 1, points: 12500, badge: "Platinum", badgeColor: "from-purple-500 to-pink-500", products: 234 },
  { id: "2", name: "Shakila Akter", avatar: "https://randomuser.me/api/portraits/women/44.jpg", storeName: "Fashion Hub BD", totalSold: 34567, rating: 4.8, rank: 2, points: 9800, badge: "Gold", badgeColor: "from-yellow-500 to-amber-500", products: 189 },
  { id: "3", name: "Tanvir Hossain", avatar: "https://randomuser.me/api/portraits/men/45.jpg", storeName: "Gadget World", totalSold: 28765, rating: 4.7, rank: 3, points: 8700, badge: "Silver", badgeColor: "from-gray-400 to-gray-500", products: 156 },
  { id: "4", name: "Nusrat Jahan", avatar: "https://randomuser.me/api/portraits/women/46.jpg", storeName: "Home Decor Ltd", totalSold: 23456, rating: 4.8, rank: 4, points: 7600, badge: "Bronze", badgeColor: "from-amber-600 to-orange-500", products: 134 },
  { id: "5", name: "Kamal Ahmed", avatar: "https://randomuser.me/api/portraits/men/47.jpg", storeName: "Beauty Pro", totalSold: 19876, rating: 4.9, rank: 5, points: 6900, badge: "Bronze", badgeColor: "from-amber-600 to-orange-500", products: 112 },
  { id: "6", name: "Fatema Begum", avatar: "https://randomuser.me/api/portraits/women/48.jpg", storeName: "Kids Corner", totalSold: 16789, rating: 4.8, rank: 6, points: 6200, badge: "Silver", badgeColor: "from-gray-400 to-gray-500", products: 98 },
  { id: "7", name: "Rashed Khan", avatar: "https://randomuser.me/api/portraits/men/49.jpg", storeName: "Sports Zone", totalSold: 14567, rating: 4.7, rank: 7, points: 5800, badge: "Bronze", badgeColor: "from-amber-600 to-orange-500", products: 87 },
  { id: "8", name: "Sultana Parvin", avatar: "https://randomuser.me/api/portraits/women/50.jpg", storeName: "Book World", totalSold: 12345, rating: 4.9, rank: 8, points: 5400, badge: "Silver", badgeColor: "from-gray-400 to-gray-500", products: 76 },
];

// Mock Top Buyers Data
const TOP_BUYERS: TopBuyer[] = [
  { id: "1", name: "Rafiqul Islam", avatar: "https://randomuser.me/api/portraits/men/1.jpg", totalPurchased: 234, totalSpent: 125000, points: 3450, rank: 1, badge: "King", badgeColor: "from-purple-500 to-pink-500", reviews: 45 },
  { id: "2", name: "Shakila Akter", avatar: "https://randomuser.me/api/portraits/women/2.jpg", totalPurchased: 189, totalSpent: 98750, points: 2890, rank: 2, badge: "Elite", badgeColor: "from-blue-500 to-cyan-500", reviews: 38 },
  { id: "3", name: "Tanvir Hossain", avatar: "https://randomuser.me/api/portraits/men/3.jpg", totalPurchased: 156, totalSpent: 87600, points: 2340, rank: 3, badge: "Premium", badgeColor: "from-green-500 to-emerald-500", reviews: 29 },
  { id: "4", name: "Nusrat Jahan", avatar: "https://randomuser.me/api/portraits/women/4.jpg", totalPurchased: 134, totalSpent: 65400, points: 2010, rank: 4, badge: "Regular", badgeColor: "from-gray-400 to-gray-500", reviews: 22 },
  { id: "5", name: "Kamal Ahmed", avatar: "https://randomuser.me/api/portraits/men/5.jpg", totalPurchased: 112, totalSpent: 54300, points: 1680, rank: 5, badge: "Regular", badgeColor: "from-gray-400 to-gray-500", reviews: 18 },
  { id: "6", name: "Nasrin Sultana", avatar: "https://randomuser.me/api/portraits/women/6.jpg", totalPurchased: 98, totalSpent: 43200, points: 1450, rank: 6, badge: "Silver", badgeColor: "from-gray-400 to-gray-500", reviews: 15 },
  { id: "7", name: "Jahangir Alam", avatar: "https://randomuser.me/api/portraits/men/7.jpg", totalPurchased: 87, totalSpent: 38700, points: 1280, rank: 7, badge: "Bronze", badgeColor: "from-amber-600 to-orange-500", reviews: 12 },
  { id: "8", name: "Morsheda Khatun", avatar: "https://randomuser.me/api/portraits/women/8.jpg", totalPurchased: 76, totalSpent: 29800, points: 1120, rank: 8, badge: "Bronze", badgeColor: "from-amber-600 to-orange-500", reviews: 10 },
];

// Mock API for trending products
const fetchTrendingProducts = async (page: number): Promise<Product[]> => {
  await new Promise(r => setTimeout(r, 400));
  const trendingItems = [
    { title: "iPhone 15 Pro Max", price: 129999, sold: 2345, views: 45678, rating: 4.9 },
    { title: "Samsung S24 Ultra", price: 119999, sold: 1890, views: 38765, rating: 4.8 },
    { title: "Nike Air Max Shoes", price: 8999, sold: 3456, views: 23456, rating: 4.7 },
    { title: "Noise Cancelling Headphones", price: 12999, sold: 4567, views: 12345, rating: 4.6 },
    { title: "Smart Watch Pro", price: 5999, sold: 5678, views: 34567, rating: 4.8 },
    { title: "Wireless Earbuds", price: 3499, sold: 6789, views: 23456, rating: 4.5 },
    { title: "Gaming Laptop", price: 89999, sold: 1234, views: 34567, rating: 4.9 },
    { title: "Designer Handbag", price: 4999, sold: 2345, views: 12345, rating: 4.6 },
  ];
  return trendingItems.map((item, i) => ({
    id: `trending-${page}-${i}-${Date.now()}`,
    title: item.title,
    price: item.price,
    image: `https://picsum.photos/seed/trending${page}${i}/300/400`,
    category: "Electronics",
    rating: item.rating,
    sold: item.sold,
    views: item.views,
    isTrending: true,
  }));
};

// Top Seller Card Component
const TopSellerCard = ({ seller }: { seller: TopSeller }) => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer"
      onClick={() => router.push(`/store/${seller.id}`)}
    >
      <div className="relative flex flex-col items-center text-center">
        <div className="relative">
          <img src={seller.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-orange-500" />
          <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${seller.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
            #{seller.rank}
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-center gap-1">
            <h4 className="font-semibold text-sm">{seller.name.split(" ")[0]}</h4>
            {seller.rank === 1 && <Crown size={14} className="text-yellow-500" />}
          </div>
          <p className="text-[10px] text-gray-500">{seller.storeName}</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="flex items-center gap-0.5"><Star size={10} className="fill-yellow-400" /><span className="text-[9px] font-semibold">{seller.rating}</span></div>
            <div className="flex items-center gap-0.5"><ShoppingBag size={10} className="text-gray-400" /><span className="text-[9px] text-gray-500">{seller.totalSold.toLocaleString()}</span></div>
          </div>
        </div>
        <div className={`mt-2 bg-gradient-to-r ${seller.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}>
          {seller.badge}
        </div>
      </div>
    </motion.div>
  );
};

// Top Buyer Card Component
const TopBuyerCard = ({ buyer }: { buyer: TopBuyer }) => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer"
      onClick={() => router.push(`/profile/${buyer.id}`)}
    >
      <div className="relative flex flex-col items-center text-center">
        <div className="relative">
          <img src={buyer.avatar} className="w-20 h-20 rounded-full object-cover border-2 border-teal-500" />
          <div className={`absolute -top-2 -right-2 bg-gradient-to-r ${buyer.badgeColor} text-white text-[10px] font-bold px-2 py-0.5 rounded-full`}>
            #{buyer.rank}
          </div>
        </div>
        <div className="mt-2">
          <div className="flex items-center justify-center gap-1">
            <h4 className="font-semibold text-sm">{buyer.name.split(" ")[0]}</h4>
            {buyer.rank === 1 && <Gem size={14} className="text-teal-500" />}
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className="flex items-center gap-0.5"><ShoppingBag size={10} className="text-teal-500" /><span className="text-[9px] font-semibold">{buyer.totalPurchased}</span></div>
            <div className="flex items-center gap-0.5"><Award size={10} className="text-yellow-500" /><span className="text-[9px] text-gray-500">{buyer.points}</span></div>
          </div>
          <p className="text-[9px] text-gray-400 mt-0.5">Spent: ৳{buyer.totalSpent.toLocaleString()}</p>
        </div>
        <div className={`mt-1 bg-gradient-to-r ${buyer.badgeColor} text-white text-[9px] font-bold px-2 py-0.5 rounded-full`}>
          {buyer.badge}
        </div>
      </div>
    </motion.div>
  );
};

// Trending Product Card Component
const TrendingCard = ({ product, onAddToCart, onWishlist, rank }: any) => {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: rank * 0.05 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm active:scale-95 transition-all duration-150 cursor-pointer"
      onClick={() => router.push(`/mall/product/${product.id}`)}
    >
      <div className="relative">
        <div className="relative aspect-3/4 bg-gray-50">
          <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
          <button onClick={(e) => { e.stopPropagation(); onWishlist(product); }} className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full">
            <Heart size={14} className="text-gray-600" />
          </button>
        </div>
        <div className="absolute top-2 left-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
          #{rank + 1}
        </div>
        {rank < 3 && <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Flame size={10} /> Trending</div>}
      </div>
      <div className="p-2">
        <p className="text-[11px] text-gray-500 line-clamp-1">{product.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center gap-0.5"><Star size={10} className="fill-yellow-400 text-yellow-400" /><span className="text-[10px] font-semibold">{product.rating}</span></div>
          <div className="flex items-center gap-0.5"><Eye size={10} className="text-gray-400" /><span className="text-[9px] text-gray-400">{product.views.toLocaleString()}</span></div>
          <div className="flex items-center gap-0.5"><ShoppingBag size={10} className="text-gray-400" /><span className="text-[9px] text-gray-400">{product.sold.toLocaleString()}</span></div>
        </div>
        <p className="font-bold text-black text-sm mt-1">৳{product.price.toLocaleString()}</p>
        <button onClick={(e) => { e.stopPropagation(); onAddToCart(product); }} className="mt-1.5 w-full bg-black text-white text-[9px] py-1.5 rounded-lg font-semibold active:scale-95 transition-all">Add to Cart</button>
      </div>
    </motion.div>
  );
};

// Skeleton Components
const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
    <div className="aspect-3/4 bg-gray-200 animate-pulse" />
    <div className="p-2"><div className="h-2 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" /><div className="h-2 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" /><div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" /></div>
  </div>
);

const SkeletonGridCard = () => (
  <div className="bg-white rounded-2xl p-3">
    <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto animate-pulse" />
    <div className="h-3 bg-gray-200 rounded w-20 mx-auto mt-2 animate-pulse" />
    <div className="h-2 bg-gray-200 rounded w-16 mx-auto mt-1 animate-pulse" />
  </div>
);

export default function TrendingPage() {
  const router = useRouter();
  const { addToCart, getCartCount } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState<"sellers" | "buyers">("sellers");
  const [wishlistMsg, setWishlistMsg] = useState("");
  const observerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadProducts = useCallback(async (reset: boolean = false) => {
    if (loadingRef.current || (reset === false && !hasMore)) return;
    loadingRef.current = true;
    setLoading(true);
    const currentPage = reset ? 1 : page + 1;
    const newProducts = await fetchTrendingProducts(currentPage);
    if (reset) { setProducts(newProducts); setPage(1); setHasMore(true); }
    else { setProducts(prev => [...prev, ...newProducts]); setPage(currentPage); }
    if (newProducts.length < 8) setHasMore(false);
    setLoading(false); setInitialLoading(false);
    loadingRef.current = false;
  }, [page, hasMore]);

  useEffect(() => { 
    setProducts([]); 
    setPage(1); 
    setHasMore(true); 
    loadProducts(true); 
  }, []);

  useEffect(() => {
    if (!observerRef.current || initialLoading) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !loading && hasMore) loadProducts(false);
    }, { threshold: 0.1, rootMargin: "200px" });
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, initialLoading, loadProducts]);

  const handleWishlist = (product: Product) => { 
    setWishlistMsg(`❤️ ${product.title} উইশলিস্টে যোগ হয়েছে`); 
    setTimeout(() => setWishlistMsg(""), 1500); 
  };
  
  const handleAddToCart = (product: Product) => { 
    addToCart(product); 
    setWishlistMsg(`🛒 ${product.title} কার্টে যোগ হয়েছে`); 
    setTimeout(() => setWishlistMsg(""), 1500); 
  };

  const displaySellers = TOP_SELLERS.slice(0, 8);
  const displayBuyers = TOP_BUYERS.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <AnimatePresence>
        {wishlistMsg && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -50 }} 
            className="fixed top-14 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-full text-[11px] z-50 whitespace-nowrap"
          >
            {wishlistMsg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Trophy size={24} className="text-yellow-500" />
              <h1 className="text-xl font-bold text-gray-800">Leaderboard 🔥</h1>
            </div>
            <p className="text-[10px] text-gray-400">Top sellers & buyers of the month</p>
          </div>
          <button onClick={() => router.push("/mall/cart")} className="relative p-1">
            <ShoppingBag size={22} className="text-gray-600" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Toggle Buttons */}
      <div className="px-4 py-3 flex gap-3">
        <button 
          onClick={() => setActiveTab("sellers")} 
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "sellers" 
              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg" 
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          <Store size={16} /> 🏪 Top Sellers
        </button>
        <button 
          onClick={() => setActiveTab("buyers")} 
          className={`flex-1 py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
            activeTab === "buyers" 
              ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg" 
              : "bg-white text-gray-600 border border-gray-200"
          }`}
        >
          <Users size={16} /> 👥 Top Buyers
        </button>
      </div>

      {/* Rewards Banner */}
      <div className="mx-3 mb-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy size={24} className="text-white" />
            <div>
              <p className="text-white text-[10px] opacity-80">Rewards Program</p>
              <p className="text-white font-bold text-sm">Earn Points & Get Badges!</p>
            </div>
          </div>
          <div className="text-right">
            <Gift size={24} className="text-white mx-auto" />
            <p className="text-white text-[9px] font-semibold">Shop & Earn</p>
          </div>
        </div>
        <div className="flex justify-between mt-2 pt-2 border-t border-white/20">
          <div className="text-center"><Sparkles size={14} className="text-white mx-auto" /><p className="text-white text-[8px]">100 pts = ৳1</p></div>
          <div className="text-center"><Medal size={14} className="text-white mx-auto" /><p className="text-white text-[8px]">Monthly Rewards</p></div>
          <div className="text-center"><Gem size={14} className="text-white mx-auto" /><p className="text-white text-[8px]">Exclusive Badges</p></div>
        </div>
      </div>

      {/* Top Sellers Grid Section */}
      {activeTab === "sellers" && (
        <div className="px-3 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">🏆 Top Sellers</h2>
            <button className="text-[10px] text-orange-500">View All →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {displaySellers.map((seller) => (
              <TopSellerCard key={seller.id} seller={seller} />
            ))}
          </div>
        </div>
      )}

      {/* Top Buyers Grid Section */}
      {activeTab === "buyers" && (
        <div className="px-3 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-bold text-gray-800">👑 Top Buyers</h2>
            <button className="text-[10px] text-orange-500">View All →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {displayBuyers.map((buyer) => (
              <TopBuyerCard key={buyer.id} buyer={buyer} />
            ))}
          </div>
        </div>
      )}

      {/* Trending Products Section */}
      <div className="px-3">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-orange-500" />
            <h2 className="font-bold text-gray-800">Trending Products</h2>
          </div>
          <button className="text-[10px] text-orange-500">View All →</button>
        </div>
        
        {initialLoading ? (
          <div className="grid grid-cols-2 gap-2">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-5xl mb-2">🔥</div>
            <p className="text-gray-400 text-xs">No trending products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {products.map((product, idx) => (
              <TrendingCard 
                key={product.id} 
                product={product} 
                rank={idx} 
                onAddToCart={handleAddToCart} 
                onWishlist={handleWishlist} 
              />
            ))}
          </div>
        )}
        
        <div ref={observerRef} className="flex justify-center py-4">
          {loading && !initialLoading && (
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin text-orange-500" size={18} />
              <span className="text-[10px] text-gray-400">Loading more...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}