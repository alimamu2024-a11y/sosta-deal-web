"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Home,
  Zap,
  Flame,
  Award,
  User,
  ArrowLeftCircle,
} from "lucide-react";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: Home, label: "Home", path: "/mall" },
    { icon: Zap, label: "Category", path: "/mall/category" },
    { icon: Flame, label: "Trending", path: "/mall/trending" },
    { icon: Award, label: "New", path: "/mall/new" },
    { icon: User, label: "Me", path: "/mall/me" },
    { icon: ArrowLeftCircle, label: "Exit", path: "/" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[120] h-14 px-2 flex justify-around items-center 
    bg-white/80 backdrop-blur-xl border-t border-gray-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">

      {navItems.map((item) => {
        const isActive = pathname === item.path;
        const isExit = item.label === "Exit";

        return (
          <div
            key={item.label}
            onClick={() => router.push(item.path)}
            className={`flex flex-col items-center justify-center cursor-pointer transition-all duration-300
            ${
              isExit
                ? "text-orange-600"
                : isActive
                ? "text-black scale-105"
                : "text-gray-400 hover:text-black"
            }`}
          >
            {/* 🔥 ICON */}
            <div
              className={`p-1.5 rounded-xl transition-all duration-300
              ${
                isExit
                  ? "bg-orange-100 shadow-md"
                  : isActive
                  ? "bg-gray-100"
                  : ""
              }`}
            >
              <item.icon
                size={18}
                strokeWidth={2.5}
                className={`transition-all
                ${
                  isExit
                    ? "fill-orange-600"
                    : isActive
                    ? "scale-110"
                    : ""
                }`}
              />
            </div>

            {/* 🔥 LABEL */}
            <span
              className={`text-[8px] mt-0.5 uppercase tracking-wide
              ${
                isExit
                  ? "font-black text-orange-600"
                  : isActive
                  ? "font-black"
                  : "font-bold"
              }`}
            >
              {isExit ? "Mall Exit" : item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}