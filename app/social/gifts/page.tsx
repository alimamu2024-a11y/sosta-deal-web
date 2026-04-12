// app/social/gifts/page.tsx
"use client";
import { useState, useEffect } from "react";
import { getReceivedGifts, getSentGifts } from "@/lib/dummyData/gifts";
import { getCurrentUser } from "@/lib/dummyData/users";
import { Gift } from "lucide-react";

export default function GiftsPage() {
  const [received, setReceived] = useState<any[]>([]);
  const [sent, setSent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setReceived(getReceivedGifts(user.id));
      setSent(getSentGifts(user.id));
    }
    setLoading(false);
  }, []);
  if (loading) return <div className="p-10 text-center">লোড হচ্ছে...</div>;
  return (
    <div>
      <div className="sticky top-0 z-10 bg-white p-3 border-b"><h1 className="text-xl font-bold text-orange-600">গিফট সেন্টার</h1></div>
      <div className="p-4">
        <h2 className="font-semibold">প্রাপ্ত গিফট</h2>
        {received.length===0 && <p>কোনো গিফট পাননি</p>}
        {received.map(g => <div key={g.id} className="flex gap-2 p-2 border-b"><Gift size={20}/><div>{g.gift_name}<br/>{new Date(g.created_at).toLocaleDateString()}</div></div>)}
        <h2 className="font-semibold mt-4">পাঠানো গিফট</h2>
        {sent.length===0 && <p>কোনো গিফট পাঠাননি</p>}
        {sent.map(g => <div key={g.id} className="flex gap-2 p-2 border-b"><Gift size={20}/><div>{g.gift_name}<br/>{new Date(g.created_at).toLocaleDateString()}</div></div>)}
      </div>
    </div>
  );
}