"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, Heart, Share2, ShoppingBag, MessageCircle, 
  Star, Minus, Plus, ShieldCheck, Truck, ChevronRight, Store, 
  Camera, X, ThumbsUp, Send
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import imageCompression from "browser-image-compression";

// চ্যাট ইম্পোর্ট
import UnifiedChat from "@/components/chat/UnifiedChat";
import { getRoomId } from "@/helpers/chat";

import "swiper/css";
import "swiper/css/pagination";

// Banner Slides Data
const BANNER_SLIDES = [
  { id: 1, title: "MEGA SALE", discount: "70% OFF", color: "from-purple-600 to-pink-600" },
  { id: 2, title: "FLASH DEAL", discount: "Limited Time", color: "from-orange-600 to-red-600" },
  { id: 3, title: "NEW ARRIVALS", discount: "50% OFF", color: "from-blue-600 to-cyan-600" },
];

type ReviewImage = {
  id: string;
  url: string;
  file?: File;
};

type Review = {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  images?: ReviewImage[];
  likes: number;
};

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.05,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: "image/jpeg",
  };
  try {
    return await imageCompression(file, options);
  } catch {
    return file;
  }
};

const fetchProduct = async (id: string) => {
  await new Promise((r) => setTimeout(r, 500));
  return {
    id,
    name: "TONO HIME Strawberry Water Based Lubricant Gel",
    price: 82,
    originalPrice: 250,
    images: [
      "https://images.unsplash.com/photo-1556228515-01f6a0215946?w=600",
      "https://images.unsplash.com/photo-1592899677977-9e10cb588fef?w=600",
    ],
    rating: 4.7,
    reviewsCount: 30,
    sold: 440,
    stock: 15,
    description: "TONO HIME Strawberry Water Based Lubricant Gel. Premium quality, body safe, long lasting. Water-soluble basic type. Net: 200ml.",
    seller: {
      id: "seller_123",
      name: "TONO HIME Official Store",
      rating: "98%",
      shipTime: "100%",
      response: "95%",
    }
  };
};

const fetchReviews = async (): Promise<Review[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: "1", userName: "Rafiqul Islam", userAvatar: "", rating: 5, comment: "Amazing product! Worth every penny. Delivery was super fast.", date: "2024-02-15", likes: 24 },
    { id: "2", userName: "Shakila Akter", userAvatar: "", rating: 4, comment: "Very comfortable and long lasting. Highly recommended!", date: "2024-02-10", likes: 12 },
    { id: "3", userName: "Tanvir Hossain", userAvatar: "", rating: 5, comment: "Best purchase this year! Quality is top notch.", date: "2024-02-05", likes: 45 },
  ];
};

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [uploadedImages, setUploadedImages] = useState<ReviewImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // চ্যাট স্টেট
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("sosta_user");
    setIsLoggedIn(!!storedUser);
  }, []);

  useEffect(() => {
    fetchProduct(id as string).then(setProduct);
    fetchReviews().then(setReviews);
  }, [id]);

  // চ্যাট রুম আইডি
  const chatRoomId = getRoomId("tuni_mall", id as string);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setIsUploading(true);
    const compressedFiles = await Promise.all(files.map(compressImage));
    const newImages: ReviewImage[] = compressedFiles.map((file, idx) => ({
      id: Date.now().toString() + idx,
      url: URL.createObjectURL(file),
      file,
    }));
    setUploadedImages(prev => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const removeImage = (id: string) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmitReview = () => {
    const newReview: Review = {
      id: Date.now().toString(),
      userName: "You",
      userAvatar: "",
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split("T")[0],
      images: uploadedImages,
      likes: 0,
    };
    setReviews(prev => [newReview, ...prev]);
    setShowReviewForm(false);
    setNewComment("");
    setUploadedImages([]);
    setNewRating(5);
    alert("✅ Review submitted successfully!");
  };

  const handleOpenChat = () => {
    if (!isLoggedIn) {
      alert("🔐 চ্যাট করতে দয়া করে লগইন করুন।");
      router.push("/login");
      return;
    }
    setShowChat(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("🔗 Link copied to clipboard!");
  };

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
    </div>
  );

  const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        title: product.name,
        price: product.price,
        image: product.images[0],
        category: "Beauty",
      });
    }
    alert(`🛒 ${quantity} item(s) added to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/mall/cart");
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100 pb-28 text-gray-900 font-sans">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-white flex items-center justify-between px-3 py-2 shadow-sm">
          <div className="flex items-center gap-3 flex-1">
            <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft size={22} className="text-gray-700" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-gray-100">
              <Share2 size={20} className="text-gray-700" />
            </button>
            <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-2 rounded-full hover:bg-gray-100">
              <Heart size={20} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-700"} />
            </button>
            <button onClick={() => router.push("/mall/cart")} className="p-2 rounded-full hover:bg-gray-100 relative">
              <ShoppingBag size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        {/* Banner Slider */}
        <div className="h-28 mx-2 mt-2 rounded-xl overflow-hidden">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true, bulletClass: "swiper-pagination-bullet !bg-white" }}
            loop
            className="h-full"
          >
            {BANNER_SLIDES.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className={`relative h-full bg-gradient-to-r ${slide.color}`}>
                  <div className="absolute inset-0 flex flex-col justify-center px-5">
                    <h2 className="text-white text-lg font-black">{slide.title}</h2>
                    <p className="text-yellow-300 text-xs font-bold">{slide.discount}</p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Special Sale Bar */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 flex justify-between items-center text-white mt-2">
          <div>
            <p className="text-[9px] opacity-90 uppercase font-bold">Special Sale Price</p>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-extrabold">৳{product.price}</span>
              <span className="text-[10px] line-through opacity-70">৳{product.originalPrice}</span>
              <span className="text-[10px] font-semibold">-{discountPercent}%</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <Star size={14} className="text-white fill-current" />
              <span className="text-lg font-black">{product.rating}</span>
            </div>
            <p className="text-[9px] opacity-90">🔥 Limited Time Offer</p>
          </div>
        </div>

        {/* Main Image */}
        <div className="bg-white relative flex justify-center items-center py-6 mt-2">
          <img src={product.images[selectedImage]} alt="" className="w-auto h-64 object-contain" />
          <div className="absolute bottom-3 left-3 bg-green-600 text-white text-[10px] font-semibold px-2 py-1 flex items-center gap-1 rounded">
            <Truck size={12} /> FREE DELIVERY
          </div>
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
            {selectedImage + 1}/{product.images.length}
          </div>
        </div>

        {/* Thumbnails */}
        <div className="bg-white pb-3 flex justify-center gap-2">
          {product.images.map((img: string, idx: number) => (
            <button key={idx} onClick={() => setSelectedImage(idx)} className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImage === idx ? 'border-orange-500' : 'border-gray-200'}`}>
              <img src={img} className="w-full h-full object-cover" alt="" />
            </button>
          ))}
        </div>

        {/* Title & Stats */}
        <div className="bg-white p-4 space-y-3 border-b border-gray-100">
          <div className="bg-pink-50 text-pink-600 text-[10px] font-bold px-2 py-0.5 rounded inline-block">
            Buy ৳299, extra 4% OFF
          </div>
          <h1 className="text-base font-bold text-gray-800">{product.name}</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-orange-500 font-bold text-sm">
              <Star size={14} className="fill-current" /> {product.rating} ({product.reviewsCount})
            </div>
            <div className="text-gray-500 text-sm">| {product.sold} sold</div>
          </div>
        </div>

        {/* Action Buttons - Chat, Add to Cart, Buy Now */}
        <div className="bg-white p-4 mt-2 flex gap-3">
          <button onClick={handleOpenChat} className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95">
            <MessageCircle size={18} /> চ্যাট
          </button>
          <button onClick={handleAddToCart} className="flex-1 bg-gray-800 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95">
            <ShoppingBag size={18} /> কার্টে যোগ করুন
          </button>
          <button onClick={handleBuyNow} className="flex-1 bg-yellow-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95">
            <Send size={18} /> এখনই কিনুন
          </button>
        </div>

        {/* Quantity */}
        <div className="bg-white mt-2 p-4 flex items-center justify-between border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">পরিমাণ</span>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center active:scale-95">
              <Minus size={14} />
            </button>
            <span className="w-8 text-center font-semibold">{quantity}</span>
            <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center active:scale-95">
              <Plus size={14} />
            </button>
            <span className="text-xs text-gray-400">{product.stock} items left</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-2 bg-white divide-y divide-gray-100">
          <div className="p-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <ShieldCheck size={18} className="text-orange-500" />
              <span className="text-sm">14 days easy return</span>
            </div>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
          <div className="p-4 flex justify-between items-start">
            <div className="flex gap-3">
              <Truck size={18} className="text-gray-500 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Guaranteed by 8-13 Apr</p>
                <p className="text-xs text-gray-500">Standard Delivery</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">Free</p>
              <p className="text-[9px] text-gray-400">To Banani Road No.12...</p>
            </div>
          </div>
        </div>

        {/* Vouchers */}
        <div className="mt-2 bg-white p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800">ভাউচার</h3>
            <ChevronRight size={16} className="text-gray-300" />
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            <div className="min-w-[140px] border border-orange-200 bg-orange-50 p-2 rounded-md text-center">
              <span className="text-orange-600 font-bold text-base">৳60</span>
              <p className="text-[10px] text-orange-700">Min. Spend ৳199</p>
            </div>
            <div className="min-w-[140px] border border-orange-200 bg-orange-50 p-2 rounded-md text-center">
              <span className="text-orange-600 font-bold text-base">4% OFF</span>
              <p className="text-[10px] text-orange-700">Min. spend ৳299</p>
            </div>
          </div>
        </div>

        {/* Seller Info */}
        <div className="mt-2 bg-white p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center text-white font-bold">
                {product.seller.name[0]}
              </div>
              <div>
                <h4 className="text-sm font-bold">{product.seller.name}</h4>
                <p className="text-[10px] text-gray-500">Chat with seller</p>
              </div>
            </div>
            <button onClick={handleOpenChat} className="border border-orange-500 text-orange-500 px-4 py-1 rounded-full text-xs font-bold active:scale-95">
              মেসেজ
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-gray-100">
            <div><p className="text-[10px] text-gray-400">Positive Seller</p><p className="font-bold text-orange-500">{product.seller.rating}</p></div>
            <div><p className="text-[10px] text-gray-400">Ship on Time</p><p className="font-bold text-orange-500">{product.seller.shipTime}</p></div>
            <div><p className="text-[10px] text-gray-400">Response Rate</p><p className="font-bold text-orange-500">{product.seller.response}</p></div>
          </div>
        </div>

        {/* Product Details */}
        <div className="mt-2 bg-white p-4">
          <h3 className="text-sm font-bold mb-2">পণ্যের বিবরণ</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews Section */}
        <div className="mt-2 bg-white p-4 mb-24">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold">রিভিউ ({reviews.length})</h3>
            <button onClick={() => setShowReviewForm(true)} className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold active:scale-95">
              রিভিউ লিখুন
            </button>
          </div>

          {/* Review Form Modal */}
          {showReviewForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReviewForm(false)}>
              <div className="bg-white rounded-xl max-w-md w-full p-5 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">আপনার রিভিউ দিন</h3>
                  <button onClick={() => setShowReviewForm(false)}><X size={20} /></button>
                </div>
                <div className="flex gap-1 mb-4 justify-center">
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} onClick={() => setNewRating(star)}>
                      <Star size={28} className={star <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                    </button>
                  ))}
                </div>
                <textarea rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full border rounded-lg p-3 text-sm mb-3" placeholder="আপনার মতামত লিখুন..." />
                
                {/* Image Upload */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {uploadedImages.map((img) => (
                    <div key={img.id} className="relative">
                      <img src={img.url} className="w-16 h-16 object-cover rounded-lg" />
                      <button onClick={() => removeImage(img.id)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={10} /></button>
                    </div>
                  ))}
                  <button onClick={() => fileInputRef.current?.click()} className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-orange-500">
                    <Camera size={20} />
                    <span className="text-[9px]">ছবি</span>
                  </button>
                  <input type="file" ref={fileInputRef} accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                </div>
                {isUploading && <p className="text-xs text-gray-500">ছবি কম্প্রেস করা হচ্ছে...</p>}
                <button onClick={handleSubmitReview} className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold active:scale-95">
                  রিভিউ জমা দিন
                </button>
              </div>
            </div>
          )}

          {/* Rating Summary */}
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{product.rating}</div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}
              </div>
            </div>
            <div className="flex-1">
              {[5,4,3].map((star) => (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-6">{star} ★</span>
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full"><div className="h-full bg-yellow-400 rounded-full w-[70%]" /></div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs font-bold">{review.userName[0]}</div>
                      <span className="text-xs font-semibold">{review.userName}</span>
                      <span className="text-[9px] text-gray-400">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 my-1">
                      {[...Array(5)].map((_, i) => <Star key={i} size={10} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />)}
                    </div>
                    <p className="text-xs text-gray-600">{review.comment}</p>
                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {review.images.map((img) => <img key={img.id} src={img.url} className="w-12 h-12 object-cover rounded" />)}
                      </div>
                    )}
                  </div>
                  <button className="text-[9px] text-gray-400 flex items-center gap-1"><ThumbsUp size={10} /> {review.likes}</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Action Bar (Only Wishlist & Chat) */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center px-3 py-2 z-50 shadow-lg gap-2">
          <button onClick={() => setIsWishlisted(!isWishlisted)} className="flex flex-col items-center px-2">
            <Heart size={22} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
            <span className="text-[9px] text-gray-500">পছন্দ</span>
          </button>
          <button onClick={handleOpenChat} className="flex flex-col items-center px-2">
            <MessageCircle size={22} className="text-gray-600" />
            <span className="text-[9px] text-gray-500">চ্যাট</span>
          </button>
        </div>
      </div>

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-[200] bg-black/50 flex items-end md:items-center justify-center" onClick={() => setShowChat(false)}>
          <div className="bg-white w-full md:max-w-md h-[85vh] md:h-[70vh] rounded-t-3xl md:rounded-3xl overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white">
              <div className="flex items-center gap-3">
                <MessageCircle size={20} />
                <div>
                  <h3 className="font-bold">লাইভ চ্যাট</h3>
                  <p className="text-xs opacity-80">{product?.name?.slice(0, 35)}</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="p-2 hover:bg-white/20 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">
              <UnifiedChat roomId={chatRoomId} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}