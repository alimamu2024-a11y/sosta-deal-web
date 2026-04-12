// components/social/SocialBottomNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Gift, MessageCircle, User, Newspaper } from "lucide-react";

export default function SocialBottomNav() {
  const pathname = usePathname();

  const items = [
    { name: "হোম", href: "/social/feed", icon: Home },
    { name: "এক্সপ্লোর", href: "/social/explore", icon: Compass },
    { name: "গিফট", href: "/social/gifts", icon: Gift },
    { name: "নিউজ", href: "/social/news", icon: Newspaper },
    { name: "চ্যাট", href: "/chat", icon: MessageCircle },
    { name: "প্রোফাইল", href: "/social/profile/current_user", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t flex justify-around items-center py-2 px-3 z-50 shadow-lg">
      {items.map((item) => {
        const active = pathname === item.href || pathname?.startsWith(item.href + '/');
        return (
          <Link key={item.name} href={item.href} className="flex flex-col items-center gap-0.5 group">
            <div className={`p-2 rounded-full transition-all ${active ? "bg-orange-100" : "group-hover:bg-gray-100"}`}>
              <item.icon size={22} className={active ? "text-orange-500" : "text-gray-500"} />
            </div>
            <span className={`text-[10px] font-medium ${active ? "text-orange-500" : "text-gray-500"}`}>{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}