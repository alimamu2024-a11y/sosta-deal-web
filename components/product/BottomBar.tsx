// components/product/BottomBar.tsx
"use client";

import { ShoppingBag, Heart } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;        // ← image যোগ করতে হবে
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
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex gap-3 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
      {onWishlist && (
        <button
          onClick={onWishlist}
          className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center active:scale-95 transition"
        >
          <Heart size={22} className={isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"} />
        </button>
      )}
      <button
        onClick={onAddToCart}
        className="flex-1 bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 active:scale-95 transition"
      >
        <ShoppingBag size={18} /> Add to Cart • ৳{(product.price * quantity).toLocaleString()}
      </button>
      <button
        onClick={onBuyNow}
        className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-semibold active:scale-95 transition"
      >
        Buy Now
      </button>
    </div>
  );
}