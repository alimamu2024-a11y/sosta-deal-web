// components/social/GiftModal.tsx
"use client";

import { useState } from "react";
import { X, Coins } from "lucide-react";
import { dummyGifts, sendGift, type GiftProduct } from "@/lib/dummyData/gifts";
import { getCurrentUser } from "@/lib/dummyData/users";
import { deductCoins, getUserCoins } from "@/lib/dummyData/coins";

interface GiftModalProps {
  postId: string;
  targetUserId: string;
  onClose: () => void;
  onGiftSent: () => void;
}

export default function GiftModal({ targetUserId, onClose, onGiftSent }: GiftModalProps) {
  const currentUser = getCurrentUser();
  const [selectedGift, setSelectedGift] = useState<GiftProduct | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!currentUser || !selectedGift) return;
    if (!deductCoins(currentUser.id, selectedGift.coin_price)) {
      setError("পর্যাপ্ত কয়েন নেই!");
      return;
    }
    setSending(true);
    sendGift(currentUser.id, targetUserId, selectedGift);
    setSent(true);
    setSending(false);
    setTimeout(() => {
      onGiftSent();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">গিফট পাঠান</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="flex items-center gap-2 mb-4 p-2 bg-gray-100 rounded-lg">
          <Coins size={20} className="text-yellow-500" />
          <span className="font-bold">আপনার কয়েন: {currentUser ? getUserCoins(currentUser.id) : 0}</span>
        </div>
        {error && <div className="mb-3 text-red-500 text-xs text-center">{error}</div>}
        {!sent ? (
          <>
            <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto mb-4">
              {dummyGifts.map((gift) => (
                <button
                  key={gift.id}
                  onClick={() => setSelectedGift(gift)}
                  className={`p-2 rounded-xl border-2 transition ${
                    selectedGift?.id === gift.id ? "border-orange-500 bg-orange-50" : "border-gray-200"
                  }`}
                >
                  <img src={gift.image_url} className="w-full h-24 object-cover rounded-lg" />
                  <p className="text-sm font-semibold mt-1">{gift.name}</p>
                  <p className="text-xs text-orange-600">{gift.coin_price} কয়েন</p>
                </button>
              ))}
            </div>
            <button
              onClick={handleSend}
              disabled={!selectedGift || sending}
              className="w-full bg-orange-500 text-white py-2 rounded-xl font-bold disabled:opacity-50"
            >
              {sending ? "পাঠানো হচ্ছে..." : "গিফট পাঠান"}
            </button>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="text-green-500 text-4xl mb-2">✓</div>
            <p className="font-semibold">গিফট সফলভাবে পাঠানো হয়েছে!</p>
          </div>
        )}
      </div>
    </div>
  );
}