"use client";

import { useState } from "react";
import imageCompression from "browser-image-compression";

export default function ReviewSection() {
  const [images, setImages] = useState<File[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  // 🔥 image handle (100KB + max 2)
  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files) as File[];

    if (files.length + images.length > 2) {
      alert("Maximum 2 images allowed!");
      return;
    }

    const compressedImages: File[] = [];

    for (const file of files) {
      try {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.1, // 🔥 100KB
          maxWidthOrHeight: 600,
          useWebWorker: true,
        });

        compressedImages.push(compressed);
      } catch (err) {
        console.error(err);
      }
    }

    setImages((prev) => [...prev, ...compressedImages]);
  };

  // ⭐ submit (frontend only)
  const handleSubmit = () => {
    console.log({
      rating,
      text,
      images,
    });

    alert("Review Submitted 😎");

    // reset
    setImages([]);
    setText("");
    setRating(5);
  };

  return (
    <div className="bg-white p-4 mt-2">
      <h2 className="font-bold text-lg mb-3">Customer Reviews</h2>

      {/* ⭐ Rating */}
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((num) => (
          <span
            key={num}
            onClick={() => setRating(num)}
            className={`cursor-pointer text-2xl ${
              num <= rating ? "text-orange-500" : "text-gray-300"
            }`}
          >
            ★
          </span>
        ))}
      </div>

      {/* ✍️ Text */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your review..."
        className="w-full border p-2 rounded mb-2"
      />

      {/* 📸 Upload */}
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* 🖼 Preview + Remove */}
      <div className="flex gap-2 mt-2">
        {images.map((img, i) => (
          <div key={i} className="relative">
            <img
              src={URL.createObjectURL(img)}
              className="w-20 h-20 object-cover rounded transition hover:scale-110"
              alt="preview"
            />

            {/* ❌ Remove */}
            <button
              onClick={() =>
                setImages(images.filter((_, index) => index !== i))
              }
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* 🚀 Submit */}
      <button
        onClick={handleSubmit}
        className="mt-3 bg-orange-500 text-white px-4 py-2 rounded w-full"
      >
        Submit Review
      </button>
    </div>
  );
}