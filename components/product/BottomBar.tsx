"use client";

import { ShoppingBag, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
};

type BottomBarProps = {
  product: Product;
  quantity: number;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isWishlisted?: boolean;
  onWishlist?: () => void;
};

export default function BottomBar({
  product,
  quantity,
  onAddToCart,
  onBuyNow,
  isWishlisted = false,
  onWishlist,
}: BottomBarProps) {
  const totalPrice = product.price * quantity;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-4 py-3 flex gap-3 z-50 shadow-[0_-8px_25px_rgba(0,0,0,0.08)]">
      {/* উইশলিস্ট বাটন - 3D */}
      {onWishlist && (
        <motion.button
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={onWishlist}
          className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md flex items-center justify-center active:scale-95 transition-all duration-200 border border-gray-200/50"
        >
          <Heart
            size={22}
            className={isWishlisted ? "fill-red-500 text-red-500 drop-shadow-sm" : "text-gray-500"}
          />
          {isWishlisted && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
          )}
        </motion.button>
      )}

      {/* অ্যাড টু কার্ট বাটন - গ্রেডিয়েন্ট */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddToCart}
        className="flex-1 bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
      >
        <ShoppingBag size={18} className="text-white/80" />
        <span>কার্টে যোগ করুন</span>
        <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs font-mono">
          ৳{totalPrice.toLocaleString()}
        </span>
      </motion.button>

      {/* বাই নাও বাটন - গ্রেডিয়েন্ট + জ্যাপ আইকন */}
      <motion.button
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onBuyNow}
        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
      >
        <Zap size={16} className="text-yellow-200" />
        <span>এখনই কিনুন</span>
      </motion.button>
    </div>
  );
}