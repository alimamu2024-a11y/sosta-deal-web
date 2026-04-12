// app/mall/seller/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import imageCompression from "browser-image-compression";
import { 
  Package, PlusCircle, Trash2, Edit2, Upload, X,
  ShoppingBag, DollarSign, TrendingUp, Star, Eye,
  Loader2, Store, Settings, LogOut, ChevronRight
} from "lucide-react";

// ==================== TYPES ====================
type SellerProduct = {
  id: string;
  title: string;
  price: number;
  category: string;
  condition: string;
  stock: number;
  sold: number;
  description: string;
  images: string[];
  createdAt: string;
  status: "active" | "inactive";
};

type Order = {
  id: string;
  date: string;
  customerName: string;
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: { productId: string; title: string; quantity: number; price: number }[];
};

type Stats = {
  totalProducts: number;
  totalSold: number;
  totalRevenue: number;
  pendingOrders: number;
  averageRating: number;
  totalViews: number;
};

// ==================== MOCK DATA (পরে Supabase/API থেকে আনবেন) ====================
const MOCK_PRODUCTS: SellerProduct[] = [
  {
    id: "prod1",
    title: "iPhone 15 Pro Max",
    price: 129999,
    category: "ইলেকট্রনিক্স",
    condition: "নতুন",
    stock: 10,
    sold: 5,
    description: "অরিজিনাল আইফোন ১৫ প্রো ম্যাক্স। ফুল বক্স সহ। ওয়ারেন্টি আছে।",
    images: ["https://picsum.photos/seed/iphone/200/200"],
    createdAt: new Date().toISOString(),
    status: "active",
  },
  {
    id: "prod2",
    title: "Nike Air Max Shoes",
    price: 8999,
    category: "ফ্যাশন",
    condition: "ব্যবহৃত (ভালো)",
    stock: 3,
    sold: 2,
    description: "নাইকি জুতা, ব্যাবহার করেছেন মাত্র ২ বার।",
    images: ["https://picsum.photos/seed/nike/200/200"],
    createdAt: new Date().toISOString(),
    status: "active",
  },
];

const MOCK_ORDERS: Order[] = [
  {
    id: "ORD001",
    date: "2024-03-15",
    customerName: "রাফিকুল ইসলাম",
    total: 129999,
    status: "delivered",
    items: [{ productId: "prod1", title: "iPhone 15 Pro Max", quantity: 1, price: 129999 }],
  },
  {
    id: "ORD002",
    date: "2024-03-10",
    customerName: "শাহিনা আক্তার",
    total: 8999,
    status: "shipped",
    items: [{ productId: "prod2", title: "Nike Air Max Shoes", quantity: 1, price: 8999 }],
  },
];

const CATEGORIES = ["ফ্যাশন", "ইলেকট্রনিক্স", "হোম", "বিউটি", "স্পোর্টস"];
const CONDITIONS = ["নতুন", "ব্যবহৃত (ভালো)", "ব্যবহৃত (মোটামুটি)", "পুরাতন"];

// ==================== MAIN COMPONENT ====================
export default function SellerDashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("products");
  const [products, setProducts] = useState<SellerProduct[]>(MOCK_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SellerProduct | null>(null);
  const [productForm, setProductForm] = useState({
    title: "",
    price: "",
    category: "",
    condition: "",
    stock: "",
    description: "",
  });
  const [productImages, setProductImages] = useState<string[]>([]);
  const [productImageFiles, setProductImageFiles] = useState<File[]>([]);
  const [isProductLoading, setIsProductLoading] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalProducts: products.length,
    totalSold: products.reduce((sum, p) => sum + p.sold, 0),
    totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
    pendingOrders: orders.filter(o => o.status === "pending" || o.status === "processing").length,
    averageRating: 4.8,
    totalViews: 1250,
  });

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
    // চেক করুন ইউজার সেলার কিনা – আপনি চাইলে লোকাল স্টোরেজ বা AuthContext থেকে নিতে পারেন
    const stored = localStorage.getItem("sosta_user");
    if (stored) {
      const localUser = JSON.parse(stored);
      if (!localUser.isSeller) {
        alert("আপনি সেলার নন। সেলার হতে রেজিস্ট্রেশন করুন।");
        router.push("/mall/me");
      }
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    setStats({
      totalProducts: products.length,
      totalSold: products.reduce((sum, p) => sum + p.sold, 0),
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      pendingOrders: orders.filter(o => o.status === "pending" || o.status === "processing").length,
      averageRating: 4.8,
      totalViews: 1250,
    });
  }, [products, orders]);

  const compressProductImage = async (file: File): Promise<File> => {
    const options = { maxSizeMB: 0.05, maxWidthOrHeight: 800, useWebWorker: true, fileType: "image/jpeg" };
    try { return await imageCompression(file, options); } catch { return file; }
  };

  const handleProductImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (productImages.length + files.length > 5) {
      alert("সর্বোচ্চ ৫টি ছবি আপলোড করতে পারবেন");
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
    setProductForm({ title: "", price: "", category: "", condition: "", stock: "", description: "" });
    setProductImages([]);
    setProductImageFiles([]);
    setEditingProduct(null);
    setShowProductForm(false);
  };

  const handleSubmitProduct = async () => {
    if (!productForm.title || !productForm.price || !productForm.category || !productForm.condition || !productForm.stock) {
      alert("সব তথ্য পূরণ করুন");
      return;
    }
    if (productImages.length === 0) {
      alert("কমপক্ষে ১টি ছবি আপলোড করুন");
      return;
    }

    setIsProductLoading(true);
    const newProduct: SellerProduct = {
      id: editingProduct?.id || Date.now().toString(),
      title: productForm.title,
      price: parseFloat(productForm.price),
      category: productForm.category,
      condition: productForm.condition,
      stock: parseInt(productForm.stock),
      sold: editingProduct?.sold || 0,
      description: productForm.description,
      images: productImages,
      createdAt: new Date().toISOString(),
      status: "active",
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProduct : p));
      alert("প্রোডাক্ট আপডেট হয়েছে!");
    } else {
      setProducts(prev => [newProduct, ...prev]);
      alert("প্রোডাক্ট যোগ হয়েছে!");
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
      stock: product.stock.toString(),
      description: product.description,
    });
    setProductImages(product.images);
    setProductImageFiles([]);
    setShowProductForm(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm("প্রোডাক্ট ডিলিট করবেন?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "delivered": return "bg-green-100 text-green-600";
      case "shipped": return "bg-blue-100 text-blue-600";
      case "processing": return "bg-yellow-100 text-yellow-600";
      case "pending": return "bg-orange-100 text-orange-600";
      case "cancelled": return "bg-red-100 text-red-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin" /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 pb-8">
        <div className="flex justify-between items-start">
          <button onClick={() => router.back()} className="p-2 bg-white/20 rounded-full">← Back</button>
          <button onClick={() => logout()} className="p-2 bg-white/20 rounded-full"><LogOut size={20} /></button>
        </div>
        <div className="flex flex-col items-center mt-2">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center">
            <Store size={40} className="text-white" />
          </div>
          <h2 className="text-xl font-bold mt-2">Seller Dashboard</h2>
          <p className="text-sm opacity-90">{user.email}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-4 -mt-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <Package size={24} className="mx-auto text-orange-500" />
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
            <p className="text-[10px] text-gray-500">মোট প্রোডাক্ট</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <ShoppingBag size={24} className="mx-auto text-green-500" />
            <p className="text-2xl font-bold">{stats.totalSold}</p>
            <p className="text-[10px] text-gray-500">মোট বিক্রি</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <DollarSign size={24} className="mx-auto text-blue-500" />
            <p className="text-2xl font-bold">৳{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-[10px] text-gray-500">মোট আয়</p>
          </div>
          <div className="bg-white rounded-2xl p-3 shadow-sm text-center">
            <TrendingUp size={24} className="mx-auto text-purple-500" />
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
            <p className="text-[10px] text-gray-500">বাকি অর্ডার</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white border-b px-4 gap-2">
        <button onClick={() => setActiveTab("products")} className={`py-3 px-4 text-sm font-medium border-b-2 transition ${activeTab === "products" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>প্রোডাক্ট</button>
        <button onClick={() => setActiveTab("orders")} className={`py-3 px-4 text-sm font-medium border-b-2 transition ${activeTab === "orders" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>অর্ডার</button>
        <button onClick={() => setActiveTab("stats")} className={`py-3 px-4 text-sm font-medium border-b-2 transition ${activeTab === "stats" ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>পরিসংখ্যান</button>
      </div>

      <div className="p-4 space-y-4">
        {/* ========== PRODUCTS TAB ========== */}
        {activeTab === "products" && (
          <>
            <button onClick={() => setShowProductForm(true)} className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md"><PlusCircle size={20} /> নতুন প্রোডাক্ট যোগ করুন</button>

            {showProductForm && (
              <div className="bg-white rounded-2xl p-5 shadow-md border">
                <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">{editingProduct ? "প্রোডাক্ট এডিট করুন" : "নতুন প্রোডাক্ট"}</h3><button onClick={resetProductForm}><X size={20} /></button></div>
                
                <div className="mb-4">
                  <label className="text-sm font-medium">প্রোডাক্টের ছবি (সর্বোচ্চ ৫টি)</label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {productImages.map((img, idx) => (
                      <div key={idx} className="relative w-16 h-16 rounded-lg overflow-hidden border"><img src={img} className="w-full h-full object-cover" /><button onClick={() => removeProductImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl"><X size={10} /></button></div>
                    ))}
                    {productImages.length < 5 && (
                      <label className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer">
                        <Upload size={16} className="text-gray-400" />
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleProductImagesUpload} />
                      </label>
                    )}
                  </div>
                  {isProductLoading && <p className="text-xs text-gray-500 mt-1">ছবি কম্প্রেস হচ্ছে...</p>}
                </div>

                <input type="text" placeholder="প্রোডাক্টের নাম *" value={productForm.title} onChange={(e) => setProductForm({...productForm, title: e.target.value})} className="w-full border rounded-xl p-2 mb-2 text-sm" />
                <input type="number" placeholder="মূল্য (৳) *" value={productForm.price} onChange={(e) => setProductForm({...productForm, price: e.target.value})} className="w-full border rounded-xl p-2 mb-2 text-sm" />
                <input type="number" placeholder="স্টক সংখ্যা *" value={productForm.stock} onChange={(e) => setProductForm({...productForm, stock: e.target.value})} className="w-full border rounded-xl p-2 mb-2 text-sm" />
                <select value={productForm.category} onChange={(e) => setProductForm({...productForm, category: e.target.value})} className="w-full border rounded-xl p-2 mb-2 text-sm">
                  <option value="">ক্যাটাগরি *</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={productForm.condition} onChange={(e) => setProductForm({...productForm, condition: e.target.value})} className="w-full border rounded-xl p-2 mb-2 text-sm">
                  <option value="">কন্ডিশন *</option>
                  {CONDITIONS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <textarea rows={2} placeholder="বিবরণ" value={productForm.description} onChange={(e) => setProductForm({...productForm, description: e.target.value})} className="w-full border rounded-xl p-2 mb-3 text-sm"></textarea>
                
                <div className="flex gap-2">
                  <button onClick={handleSubmitProduct} disabled={isProductLoading} className="flex-1 bg-orange-500 text-white py-2 rounded-xl font-semibold">{isProductLoading ? "সেভ হচ্ছে..." : (editingProduct ? "আপডেট করুন" : "যোগ করুন")}</button>
                  <button onClick={resetProductForm} className="flex-1 border py-2 rounded-xl">বাতিল</button>
                </div>
              </div>
            )}

            {/* প্রোডাক্ট লিস্ট */}
            <div className="space-y-3">
              {products.map(p => (
                <div key={p.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3">
                  <img src={p.images[0]} className="w-16 h-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <h4 className="font-semibold">{p.title}</h4>
                    <p className="text-xs text-gray-500">{p.category} • {p.condition} • স্টক: {p.stock}</p>
                    <p className="text-orange-500 font-bold text-sm">৳{p.price.toLocaleString()}</p>
                    <div className="flex gap-2 mt-1">
                      <button onClick={() => handleEditProduct(p)} className="text-xs bg-gray-100 px-2 py-1 rounded-full">এডিট</button>
                      <button onClick={() => handleDeleteProduct(p.id)} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">ডিলিট</button>
                    </div>
                  </div>
                </div>
              ))}
              {products.length === 0 && <p className="text-center text-gray-500">কোনো প্রোডাক্ট নেই</p>}
            </div>
          </>
        )}

        {/* ========== ORDERS TAB ========== */}
        {activeTab === "orders" && (
          <div className="space-y-3">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-2xl p-3 shadow-sm">
                <div className="flex justify-between"><span className="font-semibold">অর্ডার #{order.id}</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getStatusBadge(order.status)}`}>{order.status}</span></div>
                <p className="text-xs text-gray-500">{order.date} | {order.customerName}</p>
                <p className="text-sm font-medium">মোট: ৳{order.total.toLocaleString()}</p>
                <button className="text-[10px] text-orange-500 mt-1">বিস্তারিত →</button>
              </div>
            ))}
          </div>
        )}

        {/* ========== STATS TAB ========== */}
        {activeTab === "stats" && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold">বিক্রয় পরিসংখ্যান</h3>
            <div className="flex justify-between text-sm"><span>মোট প্রোডাক্ট:</span><span className="font-bold">{stats.totalProducts}</span></div>
            <div className="flex justify-between text-sm"><span>মোট বিক্রি:</span><span className="font-bold">{stats.totalSold}</span></div>
            <div className="flex justify-between text-sm"><span>মোট আয়:</span><span className="font-bold text-green-600">৳{stats.totalRevenue.toLocaleString()}</span></div>
            <div className="flex justify-between text-sm"><span>বাকি অর্ডার:</span><span className="font-bold text-orange-500">{stats.pendingOrders}</span></div>
            <div className="flex justify-between text-sm"><span>গড় রেটিং:</span><span className="font-bold flex items-center"><Star size={14} className="text-yellow-400 fill-yellow-400" /> {stats.averageRating}</span></div>
            <div className="flex justify-between text-sm"><span>মোট ভিউ:</span><span className="font-bold">{stats.totalViews}</span></div>
          </div>
        )}
      </div>
    </div>
  );
}