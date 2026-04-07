// components/product/RelatedProducts.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const getRelatedProducts = async (category: string): Promise<Product[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: "rel1", name: "Wireless Earbuds Pro", price: 4999, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200" },
    { id: "rel2", name: "Smart Watch Ultra", price: 8999, image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200" },
    { id: "rel3", name: "Bluetooth Speaker", price: 3499, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200" },
    { id: "rel4", name: "Gaming Headset", price: 6999, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?w=200" },
  ];
};

type RelatedProductsProps = {
  category: string;
  currentProductId: string;
};

export default function RelatedProducts({ category, currentProductId }: RelatedProductsProps) {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRelatedProducts(category).then((data) => {
      setProducts(data.filter((p) => p.id !== currentProductId));
      setLoading(false);
    });
  }, [category, currentProductId]);

  if (loading || products.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">You May Also Like</h3>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/mall/product/${product.id}`)}
            className="min-w-[140px] bg-white rounded-xl p-2 shadow-sm cursor-pointer active:scale-95 transition"
          >
            <img src={product.image} className="w-full h-32 object-cover rounded-lg" alt={product.name} />
            <p className="text-xs font-semibold mt-2 line-clamp-1">{product.name}</p>
            <p className="text-orange-600 font-bold text-sm">৳{product.price.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}