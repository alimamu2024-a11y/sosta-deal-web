"use client";

import BottomNav from "./BottomNav";

export default function MallLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-16"> {/* 🔥 bottom nav এর জন্য space */}
      {children}
      <BottomNav /> {/* 🔥 এইটা না থাকলে কিছুই দেখাবে না */}
    </div>
  );
}