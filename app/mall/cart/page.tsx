// app/mall/cart/page.tsx
"use client";

import { useCart } from "@/context/CartContext";  // ← context (singular)
import { useRouter } from "next/navigation";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const router = useRouter();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <ShoppingBag size={64} className="text-gray-300 mb-4" />
        <h2 className="text-xl font-bold mb-2">Your cart is empty</h2>
        <button 
          onClick={() => router.push("/mall")}
          className="bg-black text-white px-6 py-2 rounded-full"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="sticky top-0 bg-white p-4 flex items-center gap-3 border-b">
        <button onClick={() => router.back()} className="p-1">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-bold text-lg">My Cart ({cart.length} items)</h1>
      </div>

      <div className="p-4 space-y-3">
        {cart.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-3 flex gap-3 shadow-sm">
            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm line-clamp-2">{item.title}</p>
              <p className="text-red-600 font-bold text-sm mt-1">
                ৳{item.price.toLocaleString()}
              </p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)} 
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x min-w-[40px] text-center">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)} 
                    className="px-3 py-1 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)} 
                  className="text-red-500"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="fixed bottom-0 w-full bg-white border-t p-4 shadow-lg">
        <div className="flex justify-between mb-3">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-xl">৳{getCartTotal().toLocaleString()}</span>
        </div>
        <button className="w-full bg-black text-white py-3 rounded-full font-semibold active:scale-95 transition-all">
          Proceed to Checkout →
        </button>
      </div>
    </div>
  );
}