"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Home, Flame, User, Zap } from "lucide-react";

export default function MallLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F4F4F4] pb-16">

      {/* CONTENT */}
      {children}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 h-14 bg-white flex justify-around items-center border-t z-50">
        <button onClick={() => router.push("/mall")} className="flex flex-col items-center text-xs">
          <Home size={20} />
          Home
        </button>

        <button onClick={() => router.push("/mall/trending")} className="flex flex-col items-center text-xs">
          <Flame size={20} />
          Trending
        </button>

        <button onClick={() => router.push("/mall/new")} className="flex flex-col items-center text-xs">
          <Zap size={20} />
          New
        </button>

        <button onClick={() => router.push("/mall/me")} className="flex flex-col items-center text-xs">
          <User size={20} />
          Me
        </button>
      </nav>
    </div>
  );
}