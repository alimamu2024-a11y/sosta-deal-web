// components/product/ProductInfo.tsx
"use client";

import { Star, Shield, Truck, RotateCcw, Minus, Plus } from "lucide-react";

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  sold: number;
  stock: number;
  description: string;
};

type ProductInfoProps = {
  product: Product;
  quantity: number;
  onQuantityChange: (qty: number) => void;
};

export default function ProductInfo({ product, quantity, onQuantityChange }: ProductInfoProps) {
  const discountPercent = Math.round((1 - product.price / product.originalPrice) * 100);

  return (
    <div className="space-y-5">
      {/* নাম ও রেটিং */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{product.name}</h1>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <div className="flex items-center gap-0.5">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span className="font-bold ml-1">{product.rating}</span>
          </div>
          <span className="text-gray-400">| {product.reviewsCount} reviews</span>
          <span className="text-gray-400">| Sold: {product.sold}</span>
        </div>
      </div>

      {/* দাম */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-red-600">৳{product.price.toLocaleString()}</span>
        <span className="text-gray-400 line-through">৳{product.originalPrice.toLocaleString()}</span>
        <span className="bg-red-100 text-red-600 text-sm px-2 py-0.5 rounded-full">-{discountPercent}%</span>
      </div>

      {/* কোয়ান্টিটি সিলেক্টর */}
      <div className="flex gap-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="p-2 hover:bg-gray-200 rounded-l-xl transition"
            disabled={quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold">{quantity}</span>
          <button
            onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
            className="p-2 hover:bg-gray-200 rounded-r-xl transition"
            disabled={quantity >= product.stock}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="text-sm text-gray-500 self-center">
          {product.stock} items in stock
        </div>
      </div>

      {/* ডেলিভারি সুবিধা */}
      <div className="grid grid-cols-3 gap-3 text-center text-sm">
        <div className="p-3 bg-gray-50 rounded-xl">
          <Shield size={20} className="mx-auto mb-1" />
          1 Year Warranty
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <Truck size={20} className="mx-auto mb-1" />
          Free Shipping
        </div>
        <div className="p-3 bg-gray-50 rounded-xl">
          <RotateCcw size={20} className="mx-auto mb-1" />
          7 Days Return
        </div>
      </div>

      {/* বিবরণ */}
      <div className="prose prose-sm max-w-none">
        <h3 className="font-bold text-lg">Product Details</h3>
        <p className="text-gray-600">{product.description}</p>
      </div>
    </div>
  );
}