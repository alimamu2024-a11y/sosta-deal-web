// app/social/notifications/page.tsx
"use client";

import { Bell, Heart, MessageCircle, Gift } from "lucide-react";

const dummyNotifications = [
  { id: 1, type: "like", user: "রাফিয়া খাতুন", message: "আপনার পোস্টে লাইক দিয়েছেন", time: "২ ঘন্টা আগে" },
  { id: 2, type: "comment", user: "মিজানুর রহমান", message: "আপনার পোস্টে মন্তব্য করেছেন", time: "৫ ঘন্টা আগে" },
  { id: 3, type: "gift", user: "শাহিনা আক্তার", message: "আপনাকে গিফট পাঠিয়েছেন", time: "গতকাল" },
];

export default function NotificationsPage() {
  return (
    <div>
      <div className="sticky top-0 z-10 bg-white p-3 border-b">
        <h1 className="text-xl font-bold text-orange-600">নোটিফিকেশন</h1>
      </div>
      <div className="divide-y">
        {dummyNotifications.map((n) => (
          <div key={n.id} className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-full bg-gray-100">
              {n.type === "like" && <Heart size={18} className="text-red-500" />}
              {n.type === "comment" && <MessageCircle size={18} className="text-blue-500" />}
              {n.type === "gift" && <Gift size={18} className="text-orange-500" />}
            </div>
            <div className="flex-1">
              <p className="text-sm">
                <span className="font-semibold">{n.user}</span> {n.message}
              </p>
              <p className="text-xs text-gray-400">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}