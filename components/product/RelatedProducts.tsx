"use client";

import Image from "next/image";

export default function RelatedProducts() {
  return (
    <div className="bg-white p-4 mt-3">

      <h2 className="font-semibold mb-3">Related Products</h2>

      <div className="grid grid-cols-2 gap-3">

        {[1,2,3,4].map((item) => (
          <div key={item} className="border rounded-xl p-2">

            <Image
              src="/p1.jpg"
              alt=""
              width={200}
              height={150}
              className="rounded-lg"
            />

            <p className="text-sm mt-1">
              Product {item}
            </p>

            <span className="text-red-500 font-semibold">
              ৳ 999
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}