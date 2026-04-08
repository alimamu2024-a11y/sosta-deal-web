// app/mall/me/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import imageCompression from "browser-image-compression";
import { 
  User, Mail, Phone, MapPin, Calendar, 
  ShoppingBag, Heart, Star, Settings, LogOut,
  Package, Truck, CreditCard, Shield, HelpCircle,
  ChevronRight, Edit2, Camera, Store, Award, Gift, Sparkles,
  TrendingUp, Flame, Trophy, Crown, Gem, Users, Eye, Share2,
  MessageCircle, PlusCircle, Trash2, Loader2, Upload, X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ==================== TYPES ====================
type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
  items: number;
  image: string;
};

type WishlistItem = {
  id: string;
  title: string;
  price: number;
  image: string;
  rating: number;
};

type TrendingStats = {
  rank: number;
  points: number;
  badge: string;
  badgeColor: string;
  views: number;
  likes: number;
  shares: number;
};

type SellerProduct = {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  description: string;
  images: string[];
  createdAt: string;
  status: "active" | "inactive";
};

// ==================== MOCK DATA ====================
const mockOrders: Order[] = [
  { id: "ORD001", date: "2024-03-15", total: 12999, status: "Delivered", items: 2, image: "https://picsum.photos/seed/order1/100/100" },
  { id: "ORD002", date: "2024-03-10", total: 8999, status: "Shipped", items: 1, image: "https://picsum.photos/seed/order2/100/100" },
  { id: "ORD003", date: "2024-03-05", total: 3499, status: "Processing", items: 3, image: "https://picsum.photos/seed/order3/100/100" },
];

const mockWishlist: WishlistItem[] = [
  { id: "1", title: "iPhone 15 Pro Max", price: 129999, image: "https://picsum.photos/seed/wish1/200/200", rating: 4.9 },
  { id: "2", title: "Samsung S24 Ultra", price: 119999, image: "https://picsum.photos/seed/wish2/200/200", rating: 4.8 },
  { id: "3", title: "Nike Air Max", price: 8999, image: "https://picsum.photos/seed/wish3/200/200", rating: 4.7 },
];

const mockTrendingStats: TrendingStats = {
  rank: 42,
  points: 1250,
  badge: "Platinum",
  badgeColor: "from-purple-500 to-pink-500",
  views: 45678,
  likes: 2345,
  shares: 1234,
};

const CATEGORIES = [
  "ফ্যাশন", "ইলেকট্রনিক্স", "হোম", "বিউটি", "স্পোর্টস",
  "মোবাইল", "কম্পিউটার", "ঘড়ি", "ব্যাগ", "জুতা",
  "গহনা", "বই", "খেলনা", "স্বাস্থ্য", "পোষ্য",
  "ফার্নিচার", "গেমিং", "মিউজিক", "ক্যামেরা", "গিফট"
];

const CONDITIONS = ["নতুন", "ব্যবহৃত (ভালো)", "ব্যবহৃত (মোটামুটি)", "পুরাতন"];

// ==================== MAIN COMPONENT ====================
export default function MallMePage() {
  const router = useRouter();
  const { user, logout, becomeSeller } = useAuth();
  const { getCartCount } = useCart();
  const [activeTab, setActiveTab] = useState("overview");
  const [profileImage, setProfileImage] = useState(user?.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSellerForm, setShowSellerForm] = useState(false);
  const [sellerApp, setSellerApp] = useState({ storeName: "", phone: "", description: "" });
  const [wishlistMsg, setWishlistMsg] = useState("");

  // Seller product states
  const [sellerProducts, setSellerProducts] = useState<SellerProduct[]>([]);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    description: "",
  });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  // Image compression for profile
  const compressImage = async (file: File): Promise<File> => {
    const options = { maxSizeMB: 0.05, maxWidthOrHeight: 600, useWebWorker: true, fileType: "image/jpeg" };
    try { return await imageCompression(file, options); } catch { return file; }
  };

  const handleProfileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const compressed = await compressImage(file);
    setProfileImage(URL.createObjectURL(compressed));
    alert("Profile picture updated");
    setIsUploading(false);
  };

  const handleBecomeSeller = () => {
    if (!sellerApp.storeName) {
      alert("Please enter store name");
      return;
    }
    becomeSeller();
    setShowSellerForm(false);
    alert("You are now a seller on Tuni Mall!");
  };

  const handleRemoveFromWishlist = (id: string) => {
    setWishlistMsg("Removed from wishlist");
    setTimeout(() => setWishlistMsg(""), 1500);
  };

  // Product image compression (max 5 images, each ~50KB)
  const compressProductImage = async (file: File): Promise<File> => {
    const options = { maxSizeMB: 0.05, maxWidthOrHeight: 800, useWebWorker: true, fileType: "image/jpeg" };
    try { return await imageCompression(file, options); } catch { return file; }
  };

  const handleProductImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (productImages.length + files.length > 5) {
      alert("You can upload maximum 5 images");
      return;
    }
    setIsProductLoading(true);
    const compressedFiles = await Promise.all(files.map(compressProductImage));
    const newPreviews = compressedFiles.map(f => URL.createObjectURL(f));
    setProductImages(prev => [...prev, ...newPreviews]);
    setProductImageFiles(prev => [...prev, ...compressedFiles]);
    setIsProductLoading(false);
  };

  const removeProductImage = (index: number) => {
    setProductImages(prev => prev.filter((_, i) => i !== index));
    setProductImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const resetProductForm = () => {
    setProductForm({ title: "", price: "", category: "", condition: "", description: "" });
    setProductImages([]);
    setProductImageFiles([]);
    setEditingProduct(null);
    setShowAddProductForm(false);
  };

  const handleSubmitProduct = async () => {
    if (!productForm.title || !productForm.price || !productForm.category || !productForm.condition) {
      alert("Please fill all required fields");
      return;
    }
    if (productImages.length === 0) {
      alert("Please upload at least 1 image");
      return;
    }

    setIsProductLoading(true);
    const newProduct: SellerProduct = {
      id: editingProduct?.id || Date.now().toString(),
      title: productForm.title,
      price: parseFloat(productForm.price),
      category: productForm.category,
      condition: productForm.condition,
      description: productForm.description,
      images: productImages,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    if (editingProduct) {
      setSellerProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
      alert("Product updated!");
    } else {
      setSellerProducts(prev => [newProduct, ...prev]);
      alert("Product added successfully!");
    }
    resetProductForm();
    setIsProductLoading(false);
  };

  const handleEditProduct = (product: SellerProduct) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      price: product.price.toString(),
      category: product.category,
      condition: product.condition,
      description: product.description,
    });
    setProductImages(product.images);
    setProductImageFiles([]);
    setShowAddProductForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setSellerProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Delivered": return "text-green-600 bg-green-50";
      case "Shipped": return "text-blue-600 bg-blue-50";
      case "Processing": return "text-yellow-600 bg-yellow-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      
      {/* Toast Message */}
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
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 pb-8">
        <div className="flex justify-between items-start">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full">← Back</button>
          <button onClick={() => router.push("/mall/me/settings")} className="p-2 bg-white/20 rounded-full"><Settings size={20} /></button>
        </div>
        
        {/* Profile Section */}
        <div className="flex flex-col items-center mt-2">
          <div className="relative">
            <img src={profileImage} className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover" alt={user.name} />
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-md" disabled={isUploading}>
              {isUploading ? <Loader2 size={14} className="text-orange-500 animate-spin" /> : <Camera size={14} className="text-orange-500" />}
            </button>
            <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleProfileUpload} />
          </div>
          <h2 className="text-xl font-bold mt-3">{user.name}</h2>
          <p className="text-sm opacity-90">{user.email}</p>
          <div className="flex gap-2 mt-2">
            <span className="bg-white/20 text-xs px-3 py-1 rounded-full">Member</span>
            {user.isSeller && <span className="bg-green-500/80 text-xs px-3 py-1 rounded-full">Seller</span>}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-6">
        <div className="grid grid-cols-3 gap-3 bg-white rounded-2xl p-4 shadow-md">
          <div className="text-center"><p className="text-2xl font-bold text-orange-500">12</p><p className="text-[10px] text-gray-500">Orders</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-red-500">8</p><p className="text-[10px] text-gray-500">Wishlist</p></div>
          <div className="text-center"><p className="text-2xl font-bold text-green-500">{sellerProducts.length}</p><p className="text-[10px] text-gray-500">Products</p></div>
        </div>
      </div>

      {/* Trending Score Banner */}
      <div className="mx-4 mt-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4 text-white shadow-md">
        <div className="flex justify-between items-center">
          <div><div className="flex items-center gap-1"><Flame size={16} /><span className="text-xs font-bold">Trending Score</span></div><p className="text-2xl font-bold mt-1">#{mockTrendingStats.rank}</p><p className="text-[10px] opacity-80">Global Rank</p></div>
          <div className="text-right"><div className="flex gap-2"><div className="text-center"><Eye size={14} className="mx-auto" /><p className="text-xs">{mockTrendingStats.views.toLocaleString()}</p><p className="text-[8px]">Views</p></div><div className="text-center"><Heart size={14} className="mx-auto" /><p className="text-xs">{mockTrendingStats.likes.toLocaleString()}</p><p className="text-[8px]">Likes</p></div><div className="text-center"><Share2 size={14} className="mx-auto" /><p className="text-xs">{mockTrendingStats.shares.toLocaleString()}</p><p className="text-[8px]">Shares</p></div></div></div>
        </div>
        <div className="mt-2 pt-2 border-t border-white/20 flex justify-between"><div className="flex items-center gap-1"><Award size={14} /><span className="text-xs">{mockTrendingStats.points} pts</span></div><div className={`bg-gradient-to-r ${mockTrendingStats.badgeColor} text-white text-xs px-2 py-0.5 rounded-full`}>{mockTrendingStats.badge}</div></div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto bg-white border-b px-4 gap-2 sticky top-0 z-10 mt-4">
        {["overview", "orders", "wishlist", "trending", "seller"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-4 text-sm font-medium capitalize border-b-2 transition whitespace-nowrap ${activeTab === tab ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>
            {tab === "overview" ? "Overview" : tab === "orders" ? "Orders" : tab === "wishlist" ? "Wishlist" : tab === "trending" ? "Trending" : "Seller Dashboard"}
          </button>
        ))}
      </div>

      <div className="p-4 space-y-4">
        
        {/* ===================== OVERVIEW TAB ===================== */}
        {activeTab === "overview" && (
          <>
            {!user.isSeller && !showSellerForm && (
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl p-4 cursor-pointer" onClick={() => setShowSellerForm(true)}>
                <div className="flex justify-between items-center"><div><p className="text-white text-xs opacity-80">Sell on Tuni Mall</p><h3 className="text-white font-bold text-lg">Become a Seller 🚀</h3><p className="text-white text-xs opacity-80 mt-1">Start earning with us</p></div><div className="bg-white/20 p-3 rounded-full"><Store size={28} className="text-white" /></div></div>
              </div>
            )}
            {showSellerForm && (
              <div className="bg-white rounded-2xl p-5 shadow-md"><h3 className="font-bold text-lg mb-3">Seller Registration</h3><input type="text" placeholder="Store Name *" value={sellerApp.storeName} onChange={(e) => setSellerApp({...sellerApp, storeName: e.target.value})} className="w-full border rounded-xl p-3 mb-3" /><input type="tel" placeholder="Phone Number" value={sellerApp.phone} onChange={(e) => setSellerApp({...sellerApp, phone: e.target.value})} className="w-full border rounded-xl p-3 mb-3" /><textarea placeholder="Store Description" rows={3} value={sellerApp.description} onChange={(e) => setSellerApp({...sellerApp, description: e.target.value})} className="w-full border rounded-xl p-3 mb-4"></textarea><div className="flex gap-3"><button onClick={handleBecomeSeller} className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-semibold">Submit</button><button onClick={() => setShowSellerForm(false)} className="flex-1 border border-gray-300 py-2 rounded-xl">Cancel</button></div></div>
            )}
            {user.isSeller && (
              <div className="bg-white rounded-2xl overflow-hidden shadow-md"><h3 className="font-bold p-4 pb-0">Seller Center</h3><button onClick={() => setActiveTab("seller")} className="w-full flex items-center justify-between p-4 border-b border-gray-100"><div className="flex gap-3"><Store size={20} className="text-orange-500" /><span>Seller Dashboard</span></div><ChevronRight size={16} /></button><button className="w-full flex items-center justify-between p-4 border-b border-gray-100"><div className="flex gap-3"><Package size={20} className="text-blue-500" /><span>Manage Products</span></div><ChevronRight size={16} /></button><button className="w-full flex items-center justify-between p-4"><div className="flex gap-3"><Truck size={20} className="text-green-500" /><span>Manage Orders</span></div><ChevronRight size={16} /></button></div>
            )}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md"><button className="w-full flex items-center justify-between p-4 border-b border-gray-100"><div className="flex gap-3"><ShoppingBag size={20} className="text-orange-500" /><span>My Orders</span></div><ChevronRight size={16} /></button><button className="w-full flex items-center justify-between p-4 border-b border-gray-100"><div className="flex gap-3"><Heart size={20} className="text-red-500" /><span>Wishlist</span></div><ChevronRight size={16} /></button><button className="w-full flex items-center justify-between p-4"><div className="flex gap-3"><MessageCircle size={20} className="text-blue-500" /><span>Messages</span></div><ChevronRight size={16} /></button></div>
            <button onClick={() => { if(confirm("Logout?")) { logout(); router.push("/login"); } }} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold">Logout</button>
          </>
        )}

        {/* ===================== ORDERS TAB ===================== */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-md">
            {mockOrders.map(order => (
              <div key={order.id} className="p-4 border-b border-gray-100"><div className="flex gap-3"><img src={order.image} className="w-16 h-16 rounded-lg object-cover" /><div className="flex-1"><div className="flex justify-between"><p className="font-semibold">Order #{order.id}</p><span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>{order.status}</span></div><p className="text-[10px] text-gray-400">{order.date}</p><p className="text-xs mt-1">{order.items} items • ৳{order.total.toLocaleString()}</p><button className="text-[10px] text-orange-500 mt-1">Track Order →</button></div></div></div>
            ))}
            <button className="w-full p-3 text-center text-orange-500 text-sm font-medium">View All Orders →</button>
          </div>
        )}

        {/* ===================== WISHLIST TAB ===================== */}
        {activeTab === "wishlist" && (
          <div className="space-y-3">
            {mockWishlist.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 text-center"><Heart size={48} className="text-gray-300 mx-auto mb-3" /><h3 className="font-semibold">Your wishlist is empty</h3><button onClick={() => router.push("/mall")} className="mt-3 bg-orange-500 text-white px-4 py-2 rounded-full text-sm">Start Shopping →</button></div>
            ) : (
              mockWishlist.map(item => (
                <div key={item.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3"><img src={item.image} className="w-20 h-20 rounded-xl object-cover" /><div className="flex-1"><h3 className="font-semibold text-sm">{item.title}</h3><div className="flex items-center gap-1"><Star size={12} className="fill-yellow-400" /><span className="text-xs">{item.rating}</span></div><p className="text-orange-500 font-bold text-sm">৳{item.price.toLocaleString()}</p><div className="flex gap-2 mt-2"><button className="bg-black text-white text-[10px] px-3 py-1 rounded-full">Add to Cart</button><button onClick={() => handleRemoveFromWishlist(item.id)} className="border border-red-500 text-red-500 text-[10px] px-3 py-1 rounded-full">Remove</button></div></div></div>
              ))
            )}
          </div>
        )}

        {/* ===================== TRENDING TAB ===================== */}
        {activeTab === "trending" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-md"><div className="flex justify-between items-center mb-4"><div className="flex gap-2"><Trophy size={20} className="text-yellow-500" /><h3 className="font-bold">Your Trending Score</h3></div><span className="text-2xl font-bold text-orange-500">#{mockTrendingStats.rank}</span></div><div className="grid grid-cols-3 gap-3 text-center"><div className="p-2 bg-gray-50 rounded-xl"><Eye size={16} className="mx-auto text-gray-500" /><p className="text-sm font-bold mt-1">{mockTrendingStats.views.toLocaleString()}</p><p className="text-[9px] text-gray-400">Views</p></div><div className="p-2 bg-gray-50 rounded-xl"><Heart size={16} className="mx-auto text-red-500" /><p className="text-sm font-bold mt-1">{mockTrendingStats.likes.toLocaleString()}</p><p className="text-[9px] text-gray-400">Likes</p></div><div className="p-2 bg-gray-50 rounded-xl"><Share2 size={16} className="mx-auto text-blue-500" /><p className="text-sm font-bold mt-1">{mockTrendingStats.shares.toLocaleString()}</p><p className="text-[9px] text-gray-400">Shares</p></div></div></div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-4"><div className="flex gap-2"><Sparkles size={18} className="text-white" /><h3 className="text-white font-bold">Boost Your Rank!</h3></div><p className="text-white text-xs opacity-90 mt-1">Share products, get likes, write reviews.</p><button className="mt-2 bg-white text-purple-600 text-xs font-bold px-3 py-1 rounded-full">Learn More →</button></div>
            <div className="bg-white rounded-2xl p-4 shadow-md"><h3 className="font-bold text-sm mb-2 flex gap-2"><TrendingUp size={16} className="text-orange-500" /> Trending Tips</h3><div className="space-y-2 text-xs"><div className="flex gap-2"><Crown size={12} className="text-yellow-500" /> Complete your profile</div><div className="flex gap-2"><Heart size={12} className="text-red-500" /> Get 100+ likes</div><div className="flex gap-2"><Star size={12} className="text-yellow-500" /> Receive 5-star reviews</div></div></div>
          </div>
        )}

        {/* ===================== SELLER DASHBOARD TAB ===================== */}
        {activeTab === "seller" && user.isSeller && (
          <div className="space-y-4">
            {/* Add Product Button */}
            {!showAddProductForm && (
              <button onClick={() => setShowAddProductForm(true)} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"><PlusCircle size={20} /> Add New Product</button>
            )}

            {/* Add/Edit Product Form */}
            {showAddProductForm && (
              <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100">
                <div className="flex justify-between items-center mb-4"><h3 className="font-bold text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h3><button onClick={resetProductForm} className="text-gray-400"><X size={20} /></button></div>
                
                {/* Image Upload (Max 5) */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Product Images (Max 5)</label>
                  <div className="flex gap-2 flex-wrap">
                    {productImages.map((img, idx) => (
                      <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden border"><img src={img} className="w-full h-full object-cover" /><button onClick={() => removeProductImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"><X size={12} /></button></div>
                    ))}
                    {productImages.length < 5 && (
                      <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-orange-500">
                        <Upload size={20} className="text-gray-400" /><span className="text-[9px] text-gray-400">Upload</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleProductImagesUpload} />
                      </label>
                    )}
                  </div>
                  {isProductLoading && <p className="text-xs text-gray-500 mt-1">Compressing images...</p>}
                </div>

                {/* Product Details */}
                <input type="text" placeholder="Product Title *" value={productForm.title} onChange={(e) => setProductForm({...productForm, title: e.target.value})} className="w-full border rounded-xl p-3 mb-3" />
                <input type="number" placeholder="Price (৳) *" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full border rounded-xl p-3 mb-3" />
                <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full border rounded-xl p-3 mb-3">
                  <option value="">Select Category *</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <select value={productForm.condition} onChange={(e) => setProductForm({...productForm, condition: e.target.value})} className="w-full border rounded-xl p-3 mb-3">
                  <option value="">Select Condition *</option>
                  {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
                </select>
                <textarea rows={3} placeholder="Product Description" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full border rounded-xl p-3 mb-4"></textarea>
                
                <div className="flex gap-3">
                  <button onClick={handleSubmitProduct} disabled={isProductLoading} className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-semibold">{isProductLoading ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}</button>
                  <button onClick={resetProductForm} className="flex-1 border border-gray-300 py-2 rounded-xl">Cancel</button>
                </div>
              </div>
            )}

            {/* Products List */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md">
              <h3 className="font-bold p-4 border-b">Your Products</h3>
              {sellerProducts.length === 0 ? (
                <p className="p-4 text-center text-gray-500">No products yet. Click "Add New Product" to start selling.</p>
              ) : (
                sellerProducts.map(product => (
                  <div key={product.id} className="p-4 border-b border-gray-100 flex gap-3">
                    <img src={product.images[0]} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.title}</h4>
                      <p className="text-xs text-gray-500">{product.category} • {product.condition}</p>
                      <p className="text-orange-500 font-bold text-sm">৳{product.price.toLocaleString()}</p>
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEditProduct(product)} className="text-xs bg-gray-100 px-2 py-1 rounded-full">Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation for Mall */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white flex justify-around items-center py-2 border-t shadow-lg z-50">
        <button onClick={() => router.push("/mall")} className="flex flex-col items-center"><span className="text-xl">🏠</span><span className="text-[8px] font-semibold">HOME</span></button>
        <button onClick={() => router.push("/mall/category")} className="flex flex-col items-center"><span className="text-xl">📂</span><span className="text-[8px] font-semibold">CATEGORY</span></button>
        <button onClick={() => router.push("/mall/trending")} className="flex flex-col items-center"><span className="text-xl">🔥</span><span className="text-[8px] font-semibold">TRENDING</span></button>
        <button onClick={() => router.push("/mall/cart")} className="flex flex-col items-center relative"><span className="text-xl">🛒</span><span className="text-[8px] font-semibold">CART</span>{getCartCount() > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[7px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{getCartCount()}</span>}</button>
        <button onClick={() => router.push("/mall/me")} className="flex flex-col items-center"><span className="text-xl">👤</span><span className="text-[8px] font-semibold text-orange-500">ME</span></button>
        <button onClick={() => { if(confirm("Exit Mall?")) router.push("/"); }} className="flex flex-col items-center"><span className="text-xl">🚪</span><span className="text-[8px] font-semibold text-red-500">EXIT</span></button>
      </nav>
    </div>
  );
}