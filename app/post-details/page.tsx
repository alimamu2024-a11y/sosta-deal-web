// app/post-details/page.tsx
"use client";
import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdDetails from '@/components/AdDetails';

function PostDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  // মক ডাটা (আসল ডাটা API থেকে আনতে হবে)
  const ad = {
    id: id || "1",
    title: "iPhone 15 Pro Max",
    price: 129999,
    originalPrice: 159999,
    image: "https://picsum.photos/id/1/400/300",
    images: ["https://picsum.photos/id/1/400/300", "https://picsum.photos/id/2/400/300"],
    location: "কুষ্টিয়া",
    sellerName: "আলিম মাহমুদ",
    sellerVerified: true,
    rating: 4.9,
    reviewCount: 128,
    soldCount: 45,
    description: "ব্র্যান্ড নতুন, ফুল বক্স সহ। ওয়ারেন্টি আছে।",
    category: "মোবাইল",
    urgent: true,
    deliveryTime: "২-৩ দিন",
    returnDays: 14,
  };

  return <AdDetails ad={ad} onClose={() => router.back()} />;
}

export default function PostDetailsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">লোড হচ্ছে...</div>}>
      <PostDetailsContent />
    </Suspense>
  );
}