"use client";

export default function BottomBar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3">

      <button className="flex-1 bg-orange-500 text-white py-2 rounded-xl">
        Buy Now
      </button>

      <button className="flex-1 border border-orange-500 text-orange-500 py-2 rounded-xl">
        Add to Cart
      </button>

    </div>
  );
}