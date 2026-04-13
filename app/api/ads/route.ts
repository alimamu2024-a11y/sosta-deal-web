// app/api/ads/route.ts
import { NextResponse } from 'next/server';

// সম্পূর্ণ মক ডাটা (১২টি অ্যাড সহ)
const allAds = [
  { id: "1", title: "iPhone 15 Pro Max 256GB", price: 129999, originalPrice: 159999, discount: 18, image: "https://picsum.photos/id/1/400/300", images: ["https://picsum.photos/id/1/400/300", "https://picsum.photos/id/2/400/300"], location: "কুষ্টিয়া", time: "২ মিনিট আগে", sellerName: "আলিম মাহমুদ", sellerAvatar: "", sellerVerified: true, rating: 4.9, reviewCount: 128, soldCount: 45, description: "ব্র্যান্ড নতুন, ফুল বক্স সহ। ওয়ারেন্টি আছে। দাম একটু কমাতে পারি।", category: "মোবাইল", urgent: true, deliveryTime: "২-৩ দিন", returnDays: 14, warranty: true },
  { id: "2", title: "Samsung S24 Ultra 5G", price: 119999, originalPrice: 144999, discount: 17, image: "https://picsum.photos/id/2/400/300", images: ["https://picsum.photos/id/2/400/300"], location: "ঢাকা", time: "৫ মিনিট আগে", sellerName: "সাব্বির আহমেদ", sellerVerified: true, rating: 4.8, reviewCount: 95, soldCount: 32, description: "স্যামসাং এস২৪ আলট্রা, ১২জিবি র্যাম, ২৫৬জিবি স্টোরেজ।", category: "মোবাইল", urgent: false, deliveryTime: "৩-৪ দিন", returnDays: 7, warranty: true },
  { id: "3", title: "Nike Air Max 2024", price: 8999, originalPrice: 12999, discount: 30, image: "https://picsum.photos/id/3/400/300", images: ["https://picsum.photos/id/3/400/300"], location: "চট্টগ্রাম", time: "১০ মিনিট আগে", sellerName: "রিয়াদ হোসেন", sellerVerified: false, rating: 4.5, reviewCount: 67, soldCount: 120, description: "অরিজিনাল নাইকি জুতা, সাইজ ৮-১০।", category: "ফ্যাশন", urgent: true, deliveryTime: "৪-৫ দিন", returnDays: 14, warranty: false },
  { id: "4", title: "PlayStation 5 Digital", price: 54999, originalPrice: 64999, discount: 15, image: "https://picsum.photos/id/4/400/300", images: ["https://picsum.photos/id/4/400/300"], location: "রাজশাহী", time: "১৫ মিনিট আগে", sellerName: "গেমিং জোন", sellerVerified: true, rating: 4.9, reviewCount: 234, soldCount: 89, description: "পিএস৫ ডিজিটাল এডিশন, ২টি কন্ট্রোলার সহ।", category: "গেমিং", urgent: false, deliveryTime: "২-৩ দিন", returnDays: 7, warranty: true },
  { id: "5", title: "MacBook Pro M3", price: 199999, originalPrice: 229999, discount: 13, image: "https://picsum.photos/id/5/400/300", images: ["https://picsum.photos/id/5/400/300"], location: "সিলেট", time: "২০ মিনিট আগে", sellerName: "টেক স্টোর", sellerVerified: true, rating: 5.0, reviewCount: 56, soldCount: 23, description: "এম৩ চিপ, ৮জিবি র্যাম, ৫১২জিবি এসএসডি।", category: "ল্যাপটপ", urgent: false, deliveryTime: "৫-৭ দিন", returnDays: 14, warranty: true },
  { id: "6", title: "OnePlus 12 5G", price: 74999, originalPrice: 89999, discount: 16, image: "https://picsum.photos/id/6/400/300", images: ["https://picsum.photos/id/6/400/300"], location: "খুলনা", time: "২৫ মিনিট আগে", sellerName: "মোবাইল হাউস", sellerVerified: true, rating: 4.7, reviewCount: 89, soldCount: 56, description: "ওয়ানপ্লাস ১২, ১৬জিবি র্যাম, ২৫৬জিবি স্টোরেজ।", category: "মোবাইল", urgent: true, deliveryTime: "২-৩ দিন", returnDays: 7, warranty: true },
  { id: "7", title: "Realme Narzo 70 Pro", price: 24999, originalPrice: 29999, discount: 16, image: "https://picsum.photos/id/7/400/300", images: ["https://picsum.photos/id/7/400/300"], location: "বরিশাল", time: "৩০ মিনিট আগে", sellerName: "স্মার্ট গ্যাজেট", sellerVerified: false, rating: 4.3, reviewCount: 234, soldCount: 345, description: "৮জিবি র্যাম, ১২৮জিবি স্টোরেজ।", category: "মোবাইল", urgent: false, deliveryTime: "৩-৪ দিন", returnDays: 7, warranty: false },
  { id: "8", title: "Xiaomi Pad 6", price: 42999, originalPrice: 49999, discount: 14, image: "https://picsum.photos/id/8/400/300", images: ["https://picsum.photos/id/8/400/300"], location: "ময়মনসিংহ", time: "৩৫ মিনিট আগে", sellerName: "ট্যাব জোন", sellerVerified: true, rating: 4.6, reviewCount: 78, soldCount: 45, description: "শাওমি প্যাড ৬, ৮জিবি র্যাম, ২৫৬জিবি স্টোরেজ, পেন সহ।", category: "ট্যাবলেট", urgent: false, deliveryTime: "৪-৫ দিন", returnDays: 14, warranty: true },
  { id: "9", title: " দেশী মুরগি (জোড়া)", price: 800, originalPrice: 1200, discount: 33, image: "https://picsum.photos/id/9/400/300", images: ["https://picsum.photos/id/9/400/300"], location: "কুষ্টিয়া", time: "৪০ মিনিট আগে", sellerName: "হাট ব্যবসায়ী", sellerVerified: false, rating: 4.8, reviewCount: 45, soldCount: 234, description: "গৃহপালিত দেশী মুরগি, ওজন ২.৫-৩ কেজি।", category: "গ্রামের হাট", urgent: true, deliveryTime: "১ দিন", returnDays: 1, warranty: false },
  { id: "10", title: "গাভীর খাঁটি দুধ (লিটার)", price: 80, originalPrice: 100, discount: 20, image: "https://picsum.photos/id/10/400/300", images: ["https://picsum.photos/id/10/400/300"], location: "কুমারখালী", time: "৪৫ মিনিট আগে", sellerName: "দুধ ব্যবসায়ী", sellerVerified: false, rating: 4.9, reviewCount: 234, soldCount: 567, description: "খাঁটি গাভীর দুধ, সকালে তোলা।", category: "গ্রামের হাট", urgent: false, deliveryTime: "১ দিন", returnDays: 0, warranty: false },
  { id: "11", title: "তাজা পাবদা মাছ (কেজি)", price: 500, originalPrice: 700, discount: 28, image: "https://picsum.photos/id/11/400/300", images: ["https://picsum.photos/id/11/400/300"], location: "খোকসা", time: "৫০ মিনিট আগে", sellerName: "মাছ ব্যবসায়ী", sellerVerified: false, rating: 4.7, reviewCount: 89, soldCount: 345, description: "নদীর পাবদা মাছ, সাইজ মাঝারি।", category: "গ্রামের হাট", urgent: true, deliveryTime: "১ দিন", returnDays: 0, warranty: false },
  { id: "12", title: "সোনালী ব্যাংক জমি", price: 2500000, originalPrice: 3000000, discount: 16, image: "https://picsum.photos/id/12/400/300", images: ["https://picsum.photos/id/12/400/300"], location: "কুষ্টিয়া সদর", time: "১ ঘন্টা আগে", sellerName: "রিয়েল এস্টেট", sellerVerified: true, rating: 4.9, reviewCount: 23, soldCount: 12, description: "সোনালী ব্যাংকের পাশে ৫ কাঠা জমি, রেজিস্ট্রেশন রেডি।", category: "জমি", urgent: false, deliveryTime: "৩০ দিন", returnDays: 0, warranty: false },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '5');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  
  let filteredAds = [...allAds];
  
  if (search) {
    filteredAds = filteredAds.filter(ad => ad.title.toLowerCase().includes(search.toLowerCase()));
  }
  
  if (category) {
    filteredAds = filteredAds.filter(ad => ad.category === category);
  }
  
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedAds = filteredAds.slice(start, end);
  
  return NextResponse.json({
    ads: paginatedAds,
    total: filteredAds.length,
    hasMore: end < filteredAds.length,
    page,
    limit
  });
}