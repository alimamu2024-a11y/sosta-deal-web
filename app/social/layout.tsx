// app/social/layout.tsx
"use client";

import SocialBottomNav from "@/components/social/SocialBottomNav";

export default function SocialLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {children}
      <SocialBottomNav />
    </div>
  );
}