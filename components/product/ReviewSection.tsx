"use client";

import { Star } from "lucide-react";

export default function ReviewSection() {
  return (
    <div className="bg-white p-4 mt-3">

      <h2 className="font-semibold mb-2">Customer Reviews</h2>

      {[1,2,3].map((item) => (
        <div key={item} className="border-b py-3">

          <div className="flex items-center gap-1 text-orange-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={14} fill="orange" />
            ))}
          </div>

          <p className="text-sm mt-1">
            Very good product! Totally worth it 🔥
          </p>

          <span className="text-xs text-gray-400">
            User {item}
          </span>

        </div>
      ))}

    </div>
  );
}