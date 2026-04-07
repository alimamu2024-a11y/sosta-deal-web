// components/product/ImageGallery.tsx
"use client";

import { useState } from "react";
import ImageModal from "./ImageModal";

type ImageGalleryProps = {
  images: string[];
};

export default function ImageGallery({ images }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalImage, setModalImage] = useState<string | null>(null);

  // ✅ ভুল ফিক্স: !images চেক করতে হবে
  if (!images || images.length === 0) return null;

  return (
    <>
      <div className="space-y-3">
        {/* বড় ছবি */}
        <div
          className="aspect-square rounded-2xl overflow-hidden bg-gray-100 relative group cursor-pointer"
          onClick={() => setModalImage(images[selectedIndex])}
        >
          <img
            src={images[selectedIndex]}
            className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
            alt="Product"
          />
          <button className="absolute bottom-4 right-4 bg-black/70 text-white p-2 rounded-full text-xs backdrop-blur-sm">
            📸 View All
          </button>
        </div>

        {/* থাম্বনেইল */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                selectedIndex === idx ? "border-black shadow-md" : "border-transparent opacity-70"
              }`}
            >
              <img src={img} className="w-full h-full object-cover" alt={`Thumb ${idx + 1}`} />
            </button>
          ))}
        </div>
      </div>

      <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
    </>
  );
}