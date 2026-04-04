"use client";

import { useParams } from "next/navigation";

import ImageGallery from "@/components/product/ImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ReviewSection from "@/components/product/ReviewSection";
import RelatedProducts from "@/components/product/RelatedProducts";
import BottomBar from "@/components/product/BottomBar";

export default function ProductPage() {
  const params = useParams();
  const id = params?.id as string;

  return (
    <div className="bg-gray-100 min-h-screen pb-20">

      {/* 🖼 Product Images */}
      <ImageGallery />

      {/* 📦 Product Info */}
      <ProductInfo id={id} />

      {/* ⭐ Review Section (IMPORTANT) */}
      <ReviewSection />

      {/* 🔥 Related Products */}
      <RelatedProducts />

      {/* 🛒 Bottom Bar */}
      <BottomBar />
      
    </div>
  );
}