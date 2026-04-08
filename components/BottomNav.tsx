// components/BottomNav.tsx
"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function BottomNav() {
  const router = useRouter();
  const { getCartCount } = useCart();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md flex justify-around items-center py-2.5 border-t shadow-lg z-50">
      <button onClick={() => router.push("/mall")} className="flex flex-col items-center active:scale-95 transition-all">
        <span className="text-2xl">🏠</span>
        <span className="text-[9px] font-semibold text-gray-600">হোম</span>
      </button>
      <button onClick={() => router.push("/mall/category")} className="flex flex-col items-center active:scale-95 transition-all">
        <span className="text-2xl">📂</span>
        <span className="text-[9px] font-semibold text-gray-600">ক্যাটাগরি</span>
      </button>
      <button onClick={() => router.push("/mall/trending")} className="flex flex-col items-center active:scale-95 transition-all">
        <span className="text-2xl">🔥</span>
        <span className="text-[9px] font-semibold text-gray-600">ট্রেন্ডিং</span>
      </button>
      <button onClick={() => router.push("/mall/cart")} className="flex flex-col items-center active:scale-95 transition-all relative">
        <span className="text-2xl">🛒</span>
        <span className="text-[9px] font-semibold text-gray-600">কার্ট</span>
        {getCartCount() > 0 && (
          <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[8px] font-bold rounded-full min-w-4 h-4 flex items-center justify-center px-1">
            {getCartCount() > 99 ? "99+" : getCartCount()}
          </span>
        )}
      </button>
      <button onClick={() => router.push("/mall/me")} className="flex flex-col items-center active:scale-95 transition-all">
        <span className="text-2xl">👤</span>
        <span className="text-[9px] font-semibold text-gray-600">আমি</span>
      </button>
      <button onClick={() => { if(confirm("মার্কেট প্লেসে ফিরে যাবেন?")) router.push("/"); }} className="flex flex-col items-center active:scale-95 transition-all">
        <span className="text-2xl">🚪</span>
        <span className="text-[9px] font-semibold text-red-500">প্রস্থান</span>
      </button>
    </nav>
  );
}