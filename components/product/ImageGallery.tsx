"use client";

import Image from "next/image";
import { useState } from "react";

const images = [
  "/p1.jpg",
  "/p2.jpg",
  "/p3.jpg"
];

export default function ImageGallery() {
  const [active, setActive] = useState(0);

  return (
    <div className="bg-white p-2">
      
      <Image
        src={images[active]}
        alt="product"
        width={500}
        height={400}
        className="w-full h-[250px] object-cover rounded-xl"
      />

      <div className="flex gap-2 mt-2">
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            alt=""
            width={60}
            height={60}
            onClick={() => setActive(i)}
            className={`rounded-lg cursor-pointer border ${
              active === i ? "border-orange-500" : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
}