// app/mall/category/page.tsx
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { 
  ArrowLeft, ShoppingBag, Heart, Star, Loader2,
  Menu, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Product = {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  sold: number;
};

// ক্যাটাগরি লিস্ট (আপনার বিদ্যমান)
const CATEGORY_LIST = [
  "ফ্যাশন", "ইলেকট্রনিক্স", "হোম", "বিউটি", "স্পোর্টস",
  "মোবাইল", "কম্পিউটার", "ঘড়ি", "ব্যাগ", "জুতা",
  "গহনা", "বই", "খেলনা", "স্বাস্থ্য", "পোষ্য",
  "ফার্নিচার", "গেমিং", "মিউজিক", "ক্যামেরা", "গিফট"
];

// ক্যাটাগরি ভিত্তিক প্রোডাক্ট আনার ফাংশন
const fetchProductsByCategory = async (category: string, page: number): Promise<Product[]> => {
  await new Promise(r => setTimeout(r, 400));
  
  const categoryItems: Record<string, string[]> = {
    "ফ্যাশন": ["T-Shirt", "Jeans", "Jacket", "Saree", "Sharee", "Panjabi", "Hoodie", "Sneakers"],
    "ইলেকট্রনিক্স": ["iPhone", "Samsung", "Laptop", "Headphone", "Smart Watch", "Power Bank", "Earbuds", "Tablet"],
    "হোম": ["Sofa", "Bed", "Table", "Lamp", "Curtain", "Pillow", "Carpet", "Mirror"],
    "বিউটি": ["Lipstick", "Foundation", "Perfume", "Face Cream", "Shampoo", "Hair Oil", "Nail Polish", "Face Wash"],
    "স্পোর্টস": ["Football", "Cricket Bat", "Gym Gloves", "Protein", "Sports Shoes", "T-shirt", "Short", "Water Bottle"],
    "মোবাইল": ["iPhone 15", "Samsung S24", "Xiaomi", "OnePlus", "Google Pixel", "Nothing Phone", "Realme", "Vivo"],
    "কম্পিউটার": ["MacBook Pro", "Dell XPS", "HP Laptop", "Lenovo", "Asus ROG", "Gaming PC", "Monitor", "Keyboard"],
    "ঘড়ি": ["Rolex", "Apple Watch", "Samsung Watch", "Casio", "Titan", "Fossil", "G-Shock", "Smart Band"],
    "ব্যাগ": ["Handbag", "Backpack", "Laptop Bag", "Travel Bag", "School Bag", "Wallet", "Clutch", "Tote Bag"],
    "জুতা": ["Nike", "Adidas", "Puma", "Bata", "Apex", "Sneakers", "Formal Shoes", "Sandals"],
    "গহনা": ["Necklace", "Earrings", "Ring", "Bracelet", "Mangalsutra", "Nose Pin", "Anklet", "Pendant"],
    "বই": ["Fiction", "Academic", "Self Help", "Children Book", "Dictionary", "Novel", "Poetry", "Comics"],
    "খেলনা": ["Teddy Bear", "Action Figure", "Puzzle", "Board Game", "Remote Car", "Doll", "Lego", "Video Game"],
    "স্বাস্থ্য": ["Vitamin", "Protein", "Mask", "Sanitizer", "Thermometer", "First Aid", "Gloves", "Tissue"],
    "পোষ্য": ["Dog Food", "Cat Food", "Pet Bed", "Leash", "Toy", "Aquarium", "Bird Cage", "Pet Shampoo"],
    "ফার্নিচার": ["Sofa Set", "Dining Table", "Bed", "Wardrobe", "Bookshelf", "Office Chair", "Study Table", "Cabinet"],
    "গেমিং": ["PS5", "Xbox", "Gaming Chair", "Gaming Mouse", "Mechanical Keyboard", "Headset", "Monitor", "Controller"],
    "মিউজিক": ["Guitar", "Piano", "Headphones", "Speakers", "Microphone", "Drum Set", "Violin", "Synthesizer"],
    "ক্যামেরা": ["DSLR", "Mirrorless", "Action Camera", "Lens", "Tripod", "Drone", "Camera Bag", "Memory Card"],
    "গিফট": ["Gift Box", "Teddy Bear", "Chocolate", "Flower Bouquet", "Birthday Card", "Balloon", "Cake", "Photo Frame"],
  };
  
  const items = categoryItems[category] || ["Premium Product", "Best Seller", "Top Rated", "New Arrival", "Limited Edition"];
  
  return Array(8).fill(0).map((_, i) => ({
    id: `${category}-${page}-${i}-${Date.now()}`,
    title: `${items[i % items.length]} ${(page-1)*8 + i + 1}`,
    price: Math.floor(Math.random() * 5000 + 299),
    image: `https://picsum.photos/seed/${category}${page}${i}/300/400`,
    category: category,
    rating: Number((Math.random() * 2 + 3).toFixed(1)),
    sold: Math.floor(Math.random() * 1000),
  }));
};

// প্রোডাক্ট কার্ড কম্পোনেন্ট
const ProductCard = ({ product, onAddToCart, onWishlist }: any) => {
  const router = useRouter();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-all duration-150"
      onClick={() => router.push(`/mall/product/${product.id}`)}
    >
      <div className="relative aspect-3/4 bg-gray-50">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
        <button
          onClick={(e) => { e.stopPropagation(); onWishlist(product); }}
          className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm p-1.5 rounded-full"
        >
          <Heart size={14} className="text-gray-600" />
        </button>
        <div className="absolute bottom-2 left-2 bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
          -{Math.floor(Math.random() * 40 + 20)}%
        </div>
      </div>
      <div className="p-2">
        <p className="text-[11px] text-gray-500 line-clamp-1">{product.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <Star size={10} className="fill-yellow-400 text-yellow-400" />
          <span className="text-[10px] font-semibold">{product.rating}</span>
          <span className="text-[9px] text-gray-400">({product.sold})</span>
        </div>
        <p className="font-bold text-black text-sm mt-1">৳{product.price.toLocaleString()}</p>
        <button
          onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
          className="mt-1 w-full bg-black text-white text-[9px] py-1.5 rounded-lg font-semibold active:scale-95 transition-all"
        >
          কার্টে যোগ করুন
        </button>
      </div>
    </motion.div>
  );
};

const SkeletonCard = () => (
  <div className="bg-white rounded-xl overflow-hidden shadow-sm">
    <div className="aspect-3/4 bg-gray-200 animate-pulse" />
    <div className="p-2">
      <div className="h-2 bg-gray-200 rounded w-3/4 mb-2 animate-pulse" />
      <div className="h-2 bg-gray-200 rounded w-1/2 mb-2 animate-pulse" />
      <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
    </div>
  </div>
);

export default function CategoryPage() {
  const router = useRouter();
  const { addToCart, getCartCount } = useCart();
  const [selectedCategory, setSelectedCategory] = useState("ফ্যাশন");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [wishlistMsg, setWishlistMsg] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const observerRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadProducts = useCallback(async (reset: boolean = false) => {
    if (loadingRef.current || (reset === false && !hasMore)) return;
    loadingRef.current = true;
    setLoading(true);
    
    const currentPage = reset ? 1 : page + 1;
    const newProducts = await fetchProductsByCategory(selectedCategory, currentPage);
    
    if (reset) {
      setProducts(newProducts);
      setPage(1);
      setHasMore(true);
    } else {
      setProducts(prev => [...prev, ...newProducts]);
      setPage(currentPage);
    }
    
    if (newProducts.length < 8) setHasMore(false);
    
    setLoading(false);
    loadingRef.current = false;
  }, [selectedCategory, page, hasMore]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    loadProducts(true);
  }, [selectedCategory]);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          loadProducts(false);
        }
      },
      { threshold: 0.1, rootMargin: "200px" }
    );
    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [loading, hasMore, loadProducts]);

  const handleWishlist = (product: Product) => {
    setWishlistMsg(`❤️ ${product.title} উইশলিস্টে যোগ হয়েছে`);
    setTimeout(() => setWishlistMsg(""), 1500);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setWishlistMsg(`🛒 ${product.title} কার্টে যোগ হয়েছে`);
    setTimeout(() => setWishlistMsg(""), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* টোস্ট মেসেজ */}
      {wishlistMsg && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 bg-black/80 text-white px-3 py-1.5 rounded-full text-[11px] z-50">
          {wishlistMsg}
        </div>
      )}

      {/* হেডার */}
      <header className="sticky top-0 z-40 bg-white shadow-sm">
        <div className="px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft size={22} />
          </button>
          <h1 className="font-bold text-lg flex-1">ক্যাটাগরি</h1>
          <button onClick={() => router.push("/mall/cart")} className="relative p-1">
            <ShoppingBag size={22} className="text-gray-600" />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </button>
          <button onClick={() => setSidebarOpen(true)} className="md:hidden p-1">
            <Menu size={22} />
          </button>
        </div>
      </header>

      {/* Shein স্টাইল সাইডবার + গ্রিড */}
      <div className="flex relative">
        {/* ডেস্কটপ সাইডবার (সবসময় খোলা) */}
        <aside className="hidden md:block w-64 bg-white border-r sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto p-3">
          <h2 className="font-bold text-gray-800 mb-3 px-2">সব ক্যাটাগরি</h2>
          <div className="space-y-1">
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                  selectedCategory === cat
                    ? "bg-orange-500 text-white font-semibold"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* মোবাইলের স্লাইড-ইন সাইডবার */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/50 z-50 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25 }}
                className="fixed top-0 left-0 bottom-0 w-72 bg-white z-50 shadow-xl overflow-y-auto p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-bold text-lg">ক্যাটাগরি</h2>
                  <button onClick={() => setSidebarOpen(false)} className="p-1">
                    <X size={22} />
                  </button>
                </div>
                <div className="space-y-1">
                  {CATEGORY_LIST.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                        selectedCategory === cat
                          ? "bg-orange-500 text-white font-semibold"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* প্রোডাক্ট গ্রিড এলাকা */}
        <main className="flex-1 p-3">
          {/* ব্যানার */}
          <div className="h-28 mb-3 rounded-xl overflow-hidden bg-gradient-to-r from-orange-500 to-red-500">
            <div className="h-full flex flex-col justify-center px-5">
              <h2 className="text-white font-bold text-lg">{selectedCategory}</h2>
              <p className="text-white/80 text-xs">সর্বোচ্চ ৭০% ছাড়ে সেরা পণ্য</p>
              <button className="mt-1 bg-white/20 text-white text-[10px] px-3 py-0.5 rounded-full w-fit">শপ নাও →</button>
            </div>
          </div>

          {loading && products.length === 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl">
              <div className="text-5xl mb-2">🛒</div>
              <p className="text-gray-400 text-xs">কোন পণ্য নেই</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  onWishlist={handleWishlist}
                />
              ))}
            </div>
          )}
          
          {/* ইনফিনিট স্ক্রল ট্রিগার */}
          <div ref={observerRef} className="flex justify-center py-4">
            {loading && products.length > 0 && (
              <Loader2 className="animate-spin text-orange-500" size={18} />
            )}
            {!hasMore && products.length > 0 && (
              <p className="text-[10px] text-gray-400">সব পণ্য দেখানো হয়েছে</p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}