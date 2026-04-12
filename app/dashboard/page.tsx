"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import imageCompression from "browser-image-compression";
import { 
  Trash2, Edit, Package, Star, LogOut, Camera, Calendar, Mail, Home,
  Upload, X, Check, Loader2, Eye, TrendingUp, DollarSign, Users, 
  MessageCircle, ShoppingBag, Gift, Award, Zap, Clock, Gavel, 
  BarChart3, Settings, HelpCircle, Share2, Heart, MapPin, Phone,
  PlusCircle, MinusCircle, AlertTriangle, CheckCircle, RefreshCw,
  MousePointer
} from "lucide-react";

// ===================== মক ডাটা =====================
const initialUserAds = [
  { id: "1", title: "iPhone 15 Pro Max", price: 129999, location: "কুষ্টিয়া", time: "২ মিনিট আগে", urgent: true, image: "https://picsum.photos/seed/iphone/200/200", status: "active", views: 12500, clicks: 340 },
  { id: "2", title: "Samsung S24 Ultra", price: 119999, location: "কুষ্টিয়া", time: "৫ মিনিট আগে", urgent: true, image: "https://picsum.photos/seed/samsung/200/200", status: "active", views: 9800, clicks: 280 },
  { id: "3", title: "Nike Air Max", price: 8999, location: "কুষ্টিয়া", time: "১০ মিনিট আগে", urgent: false, image: "https://picsum.photos/seed/nike/200/200", status: "active", views: 7600, clicks: 210 },
];

const mockAuctions = [
  { id: "auc1", name: "Vintage Watch", currentBid: 2500, startingPrice: 1500, endTime: "2h 30m", bids: 12, image: "https://picsum.photos/seed/watch/200/200" },
  { id: "auc2", name: "Gaming Laptop", currentBid: 35000, startingPrice: 25000, endTime: "1d 5h", bids: 8, image: "https://picsum.photos/seed/laptop/200/200" },
];

const mockAffiliateStats = {
  totalEarned: 1250,
  clicks: 340,
  conversions: 23,
  pending: 450,
};

const mockMessages = [
  { id: 1, name: "রফিকুল ইসলাম", message: "পণ্যটি এখনো আছে?", time: "৫ মিনিট আগে", avatar: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: 2, name: "শাকিলা আক্তার", message: "সর্বনিম্ন দাম কত?", time: "১ ঘন্টা আগে", avatar: "https://randomuser.me/api/portraits/women/2.jpg" },
];

const mockSocialActivities = [
  { id: 1, user: "রুবেল রানা", action: "আপনার পোস্টে লাইক দিয়েছেন", time: "১০ মিনিট আগে", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
  { id: 2, user: "নুসরাত জাহান", action: "আপনাকে ফলো করেছেন", time: "২ ঘন্টা আগে", avatar: "https://randomuser.me/api/portraits/women/4.jpg" },
];

const mockGramerHaatAds = [
  { id: "gh1", title: "দেশী মুরগি", price: 450, location: "পোড়াদহ", time: "১ ঘন্টা আগে", image: "https://picsum.photos/seed/chicken/200/200" },
  { id: "gh2", title: "তাজা সবজি", price: 120, location: "কুষ্টিয়া সদর", time: "৩ ঘন্টা আগে", image: "https://picsum.photos/seed/veggies/200/200" },
];

// ===================== মেইন ড্যাশবোর্ড =====================
export default function DashboardPage() {
  const router = useRouter();
  const { user, logout, isLoading } = useAuth();
  const [userAds, setUserAds] = useState(initialUserAds);
  const [activeTab, setActiveTab] = useState("overview");
  // নিরাপদে প্রপার্টি অ্যাক্সেস - যেটা থাকে সেটা নেবে
  const [profileImage, setProfileImage] = useState<string | null>(
    (user as any)?.avatar || (user as any)?.avatar_url || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [boostModal, setBoostModal] = useState<{ open: boolean; adId: string | null }>({ open: false, adId: null });
  const [auctionModal, setAuctionModal] = useState<{ open: boolean; auction: any | null }>({ open: false, auction: null });
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [isLoading, user, router]);

  const compressImage = async (file: File): Promise<File> => {
    const options = { maxSizeMB: 0.05, maxWidthOrHeight: 600, useWebWorker: true, fileType: "image/jpeg" };
    try { return await imageCompression(file, options); } catch { return file; }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const compressedFile = await compressImage(file);
    const imageUrl = URL.createObjectURL(compressedFile);
    setProfileImage(imageUrl);
    alert("প্রোফাইল ছবি আপডেট হয়েছে (মক)");
    setIsUploading(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("বিজ্ঞাপন ডিলিট করুন?")) setUserAds(prev => prev.filter(ad => ad.id !== id));
  };

  const handleEdit = (ad: any) => alert(`"${ad.title}" এডিট করুন (PostAdForm খুলবে)`);
  const handleBoost = (adId: string) => setBoostModal({ open: true, adId });
  const confirmBoost = () => { alert("বিজ্ঞাপন বুস্ট করা হয়েছে (পেইড ফিচার)"); setBoostModal({ open: false, adId: null }); };
  const handlePlaceBid = (auction: any) => setAuctionModal({ open: true, auction });
  const confirmBid = () => { alert(`বিড দেওয়া হয়েছে: ${bidAmount} টাকা`); setAuctionModal({ open: false, auction: null }); setBidAmount(""); };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={32} className="animate-spin text-orange-500" /></div>;
  if (!user) return null;

  // ইউজারের নাম ও অন্যান্য তথ্য নিরাপদে বের করা
  const displayName = (user as any).full_name || (user as any).name || (user as any).email?.split('@')[0] || "ইউজার";
  const joinDate = (user as any).created_at 
    ? new Date((user as any).created_at).toLocaleDateString('bn-BD', { year: 'numeric', month: 'long' }) 
    : (user as any).joinDate || "জানুয়ারি ২০২৪";
  const isSeller = (user as any).is_seller || (user as any).role === "seller" || false;
  const userEmail = (user as any).email || "";
  const profileImageSrc = profileImage && profileImage.trim() !== "" ? profileImage : null;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-linear-to-r from-orange-500 to-red-500 text-white p-5">
        <div className="flex justify-between items-start">
          <div><h1 className="text-2xl font-bold">মার্কেটপ্লেস ড্যাশবোর্ড</h1><p className="text-sm opacity-90">স্বাগতম, {displayName}</p></div>
          <div className="flex items-center gap-3">
            <button onClick={() => router.push("/")} className="bg-white/20 p-2 rounded-full hover:bg-white/30"><Home size={20} /></button>
            <div className="relative">
              {profileImageSrc ? (
                <img src={profileImageSrc} className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover" />
              ) : (
                <div className="w-12 h-12 rounded-full border-2 border-white shadow-md bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600 text-sm font-bold">{displayName.charAt(0).toUpperCase()}</span>
                </div>
              )}
              <button onClick={() => fileInputRef.current?.click()} className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-md" disabled={isUploading}>
                {isUploading ? <Loader2 size={12} className="text-orange-500 animate-spin" /> : <Camera size={12} className="text-orange-500" />}
              </button>
              <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleProfileImageUpload} />
            </div>
          </div>
        </div>
        <div className="mt-4 space-y-1 text-sm">
          <div className="flex items-center gap-2"><Mail size={14} /> {userEmail}</div>
          <div className="flex items-center gap-2"><Calendar size={14} /> যুক্ত হয়েছেন {joinDate}</div>
          <div className="flex items-center gap-2"><Star size={14} /> {isSeller ? "বিক্রেতা" : "সদস্য"}</div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-5">
          <div className="bg-white/10 rounded-xl p-3"><p className="text-xs opacity-80">মোট বিজ্ঞাপন</p><p className="text-xl font-bold">{userAds.length}</p></div>
          <div className="bg-white/10 rounded-xl p-3"><p className="text-xs opacity-80">সক্রিয়</p><p className="text-xl font-bold">{userAds.filter(ad => ad.status === "active").length}</p></div>
        </div>
      </div>

      {/* ট্যাব নেভিগেশন - আগের মতোই */}
      <div className="flex overflow-x-auto bg-white border-b px-4 gap-1 sticky top-0 z-10">
        {["overview", "myads", "auctions", "earnings", "gramerhaat", "social", "messages", "affiliate", "settings"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`py-3 px-3 text-sm font-medium capitalize border-b-2 transition ${activeTab === tab ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500"}`}>
            {tab === "overview" ? "ওভারভিউ" : tab === "myads" ? "আমার বিজ্ঞাপন" : tab === "auctions" ? "লাইভ অকশন" : tab === "earnings" ? "আয়" : tab === "gramerhaat" ? "গ্রামের হাট" : tab === "social" ? "সোশ্যাল" : tab === "messages" ? "চ্যাট" : tab === "affiliate" ? "অ্যাফিলিয়েট" : "সেটিংস"}
          </button>
        ))}
      </div>

      <div className="p-4">
        {/* ওভারভিউ ট্যাব */}
        {activeTab === "overview" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center"><Eye className="mx-auto text-blue-500" size={24} /><p className="text-xl font-bold mt-1">23.5K</p><p className="text-xs text-gray-500">মোট ভিউ</p></div>
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center"><DollarSign className="mx-auto text-green-500" size={24} /><p className="text-xl font-bold mt-1">৳12,500</p><p className="text-xs text-gray-500">আয়</p></div>
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center"><MessageCircle className="mx-auto text-orange-500" size={24} /><p className="text-xl font-bold mt-1">৮</p><p className="text-xs text-gray-500">নতুন মেসেজ</p></div>
              <div className="bg-white p-4 rounded-2xl shadow-sm text-center"><Gavel className="mx-auto text-purple-500" size={24} /><p className="text-xl font-bold mt-1">২</p><p className="text-xs text-gray-500">সক্রিয় অকশন</p></div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm"><h3 className="font-bold mb-2">দ্রুত অ্যাকশন</h3><div className="flex gap-3 flex-wrap"><button onClick={() => router.push("/post-ad")} className="bg-orange-500 text-white px-4 py-2 rounded-xl text-sm">+ নতুন বিজ্ঞাপন</button><button onClick={() => setActiveTab("auctions")} className="border border-orange-500 text-orange-500 px-4 py-2 rounded-xl text-sm">লাইভ অকশন শুরু করুন</button><button onClick={() => setActiveTab("earnings")} className="border border-green-500 text-green-500 px-4 py-2 rounded-xl text-sm">আয় তুলুন</button></div></div>
            <div className="bg-white rounded-2xl p-4 shadow-sm"><h3 className="font-bold mb-2">সাম্প্রতিক কার্যকলাপ</h3><div className="space-y-2">{mockMessages.slice(0,2).map(msg => (<div key={msg.id} className="flex justify-between text-sm border-b pb-2"><span>{msg.name}: {msg.message}</span><span className="text-gray-400 text-xs">{msg.time}</span></div>))}</div></div>
          </div>
        )}

        {/* মাই অ্যাডস ট্যাব */}
        {activeTab === "myads" && (
          <div className="space-y-3">
            {userAds.map(ad => (
              <div key={ad.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3">
                <img src={ad.image} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1">
                  <div className="flex justify-between"><div><h3 className="font-semibold">{ad.title}</h3><p className="text-xs text-gray-500">{ad.location} • {ad.time}</p><p className="text-orange-500 font-bold">৳{ad.price.toLocaleString()}</p></div>{ad.urgent && <span className="bg-red-100 text-red-600 text-xs px-2 rounded-full">জরুরি</span>}</div>
                  <div className="flex justify-between items-center mt-2"><div className="flex gap-2"><button onClick={() => handleEdit(ad)} className="bg-gray-100 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Edit size={12} /> এডিট</button><button onClick={() => handleDelete(ad.id)} className="bg-red-50 text-red-600 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Trash2 size={12} /> ডিলিট</button></div><button onClick={() => handleBoost(ad.id)} className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs flex items-center gap-1"><Zap size={12} /> বুস্ট</button></div>
                  <div className="flex gap-3 mt-1 text-xs text-gray-500"><span><Eye size={12} className="inline" /> {ad.views} ভিউ</span><span><MousePointer size={12} className="inline" /> {ad.clicks} ক্লিক</span></div>
                </div>
              </div>
            ))}
            <button onClick={() => router.push("/post-ad")} className="w-full border-2 border-dashed border-orange-500 text-orange-500 py-3 rounded-xl text-center font-semibold">+ নতুন বিজ্ঞাপন পোস্ট করুন</button>
          </div>
        )}

        {/* লাইভ অকশন ট্যাব */}
        {activeTab === "auctions" && (
          <div className="space-y-3">
            {mockAuctions.map(auction => (
              <div key={auction.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3">
                <img src={auction.image} className="w-20 h-20 rounded-xl object-cover" />
                <div className="flex-1"><h3 className="font-semibold">{auction.name}</h3><p className="text-xs text-gray-500">বর্তমান বিড: ৳{auction.currentBid.toLocaleString()}</p><p className="text-xs">বিড: {auction.bids}</p><div className="flex justify-between items-center mt-2"><span className="text-red-500 text-xs flex items-center gap-1"><Clock size={12} /> শেষ: {auction.endTime}</span><button onClick={() => handlePlaceBid(auction)} className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs">বিড করুন</button></div></div>
              </div>
            ))}
            <button className="w-full bg-gray-100 py-3 rounded-xl text-center font-semibold">+ নতুন অকশন তৈরি করুন</button>
          </div>
        )}

        {/* আয় ট্যাব */}
        {activeTab === "earnings" && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-lg">আয়ের সারাংশ</h3>
            <div className="grid grid-cols-2 gap-3"><div className="bg-green-50 p-3 rounded-xl text-center"><p className="text-2xl font-bold text-green-600">৳12,500</p><p className="text-xs">মোট আয়</p></div><div className="bg-yellow-50 p-3 rounded-xl text-center"><p className="text-2xl font-bold text-yellow-600">৳2,500</p><p className="text-xs">বাকি</p></div></div>
            <button className="w-full bg-orange-500 text-white py-2 rounded-xl font-semibold">উইথড্র করতে আবেদন করুন</button>
            <div className="border-t pt-3"><h4 className="font-semibold">লেনদেন ইতিহাস</h4><p className="text-sm text-gray-500">আপনার কোনো লেনদেন নেই</p></div>
          </div>
        )}

        {/* গ্রামের হাট ট্যাব */}
        {activeTab === "gramerhaat" && (
          <div className="space-y-3">{mockGramerHaatAds.map(ad => (<div key={ad.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3"><img src={ad.image} className="w-16 h-16 rounded-xl object-cover" /><div><h3 className="font-semibold">{ad.title}</h3><p className="text-xs text-gray-500">{ad.location} • {ad.time}</p><p className="text-orange-500 font-bold">৳{ad.price}</p></div></div>))}</div>
        )}

        {/* সোশ্যাল ট্যাব */}
        {activeTab === "social" && (<div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">{mockSocialActivities.map(act => (<div key={act.id} className="flex items-center gap-3 border-b pb-2"><img src={act.avatar} className="w-8 h-8 rounded-full" /><div><p className="text-sm font-medium">{act.user}</p><p className="text-xs text-gray-500">{act.action} • {act.time}</p></div></div>))}</div>)}

        {/* চ্যাট ট্যাব */}
        {activeTab === "messages" && (<div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">{mockMessages.map(msg => (<div key={msg.id} className="flex items-center gap-3 border-b pb-2"><img src={msg.avatar} className="w-10 h-10 rounded-full" /><div><p className="font-semibold">{msg.name}</p><p className="text-xs text-gray-500">{msg.message}</p></div><div className="ml-auto text-xs text-gray-400">{msg.time}</div></div>))}<button className="w-full text-orange-500 text-sm font-semibold">সব চ্যাট দেখুন →</button></div>)}

        {/* অ্যাফিলিয়েট ট্যাব */}
        {activeTab === "affiliate" && (
          <div className="bg-white rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="font-bold text-lg">অ্যাফিলিয়েট প্রোগ্রাম</h3>
            <div className="grid grid-cols-3 gap-2 text-center"><div className="bg-blue-50 p-2 rounded-xl"><p className="text-xl font-bold text-blue-600">{mockAffiliateStats.clicks}</p><p className="text-xs">ক্লিক</p></div><div className="bg-green-50 p-2 rounded-xl"><p className="text-xl font-bold text-green-600">{mockAffiliateStats.conversions}</p><p className="text-xs">কনভার্শন</p></div><div className="bg-yellow-50 p-2 rounded-xl"><p className="text-xl font-bold text-yellow-600">৳{mockAffiliateStats.totalEarned}</p><p className="text-xs">আয়</p></div></div>
            <p className="text-sm">আপনার রেফারেল লিংক: <code className="bg-gray-100 px-2 py-1 rounded">https://sostadeal.com/ref/{user.id}</code></p>
            <button className="w-full bg-gray-100 py-2 rounded-xl text-sm font-semibold">লিংক কপি করুন</button>
          </div>
        )}

        {/* সেটিংস ট্যাব */}
        {activeTab === "settings" && (
          <div className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
            <button className="w-full bg-gray-100 py-3 rounded-xl text-sm font-semibold">পাসওয়ার্ড পরিবর্তন</button>
            <button className="w-full bg-gray-100 py-3 rounded-xl text-sm font-semibold">গোপনীয়তা নীতি</button>
            <button className="w-full bg-gray-100 py-3 rounded-xl text-sm font-semibold">সেবার শর্তাবলী</button>
            <button onClick={() => { if(confirm("লগআউট?")) { logout(); router.push("/login"); } }} className="w-full bg-red-50 text-red-600 py-3 rounded-xl font-semibold flex items-center justify-center gap-2"><LogOut size={16} /> লগআউট</button>
          </div>
        )}
      </div>

      {/* বুস্ট মোডাল */}
      {boostModal.open && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl p-5 max-w-sm w-full"><h3 className="font-bold text-lg mb-3">বিজ্ঞাপন বুস্ট করুন</h3><p className="text-sm mb-4">আপনার বিজ্ঞাপনটি সবার উপরে দেখাতে ৳২০০ খরচ হবে।</p><div className="flex gap-3"><button onClick={confirmBoost} className="flex-1 bg-orange-500 text-white py-2 rounded-xl">নিশ্চিত</button><button onClick={() => setBoostModal({ open: false, adId: null })} className="flex-1 border border-gray-300 py-2 rounded-xl">বাতিল</button></div></div></div>}

      {/* বিড মোডাল */}
      {auctionModal.open && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><div className="bg-white rounded-2xl p-5 max-w-sm w-full"><h3 className="font-bold text-lg mb-3">বিড করুন</h3><p className="text-sm mb-2">{auctionModal.auction?.name}</p><input type="number" placeholder="আপনার বিডের পরিমাণ" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} className="w-full border rounded-xl p-2 mb-4" /><div className="flex gap-3"><button onClick={confirmBid} className="flex-1 bg-purple-600 text-white py-2 rounded-xl">বিড করুন</button><button onClick={() => setAuctionModal({ open: false, auction: null })} className="flex-1 border border-gray-300 py-2 rounded-xl">বাতিল</button></div></div></div>}
    </div>
  );
}