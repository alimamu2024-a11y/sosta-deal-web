"use client";

import { useState } from "react";
import Image from "next/image";

const images = [
  "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
  "https://images.unsplash.com/photo-1517336714731-489689fd1ca8",
  "https://images.unsplash.com/photo-1585386959984-a41552231658",
];

export default function ImageGallery() {
  const [active, setActive] = useState(0);

  return (
    <div className="bg-white p-4">

      {/* 🔥 Main Image */}
      <div className="relative w-full h-64 mb-3 rounded overflow-hidden">
        <Image
          src={images[active]}
          alt="product"
          fill
          className="object-cover transition duration-300"
        />
      </div>

      {/* 🧠 Thumbnail */}
      <div className="flex gap-2">
        {images.map((img, i) => (
          <div
            key={i}
            onClick={() => setActive(i)}
            className={`w-16 h-16 rounded overflow-hidden border cursor-pointer ${
              active === i ? "border-orange-500" : "border-gray-300"
            }`}
          >
            <Image src={img} alt="thumb" width={64} height={64} />
          </div>
        ))}
      </div>
    </div>
  );
}