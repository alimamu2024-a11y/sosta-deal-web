"use client";

import { Star } from "lucide-react";

export default function ProductInfo({ id }: { id: string }) {
  return (
    <div className="bg-white p-4 space-y-3">

      {/* Title */}
      <h1 className="text-lg font-semibold">
        Premium Wireless Headphone #{id}
      </h1>

      {/* Rating */}
      <div className="flex items-center gap-1 text-orange-500">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill="orange" />
        ))}
        <span className="text-gray-500 text-sm ml-2">(120 reviews)</span>
      </div>

      {/* Price */}
      <div className="text-2xl font-bold text-red-500">
        ৳ 1,999
      </div>

      {/* Old Price */}
      <div className="text-sm text-gray-400 line-through">
        ৳ 2,999
      </div>

      {/* Discount */}
      <div className="text-green-600 text-sm">
        -33% OFF
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-4">
        <button className="flex-1 bg-orange-500 text-white py-2 rounded-xl">
          Buy Now
        </button>
        <button className="flex-1 border border-orange-500 text-orange-500 py-2 rounded-xl">
          Add to Cart
        </button>
      </div>

    </div>
  );
}