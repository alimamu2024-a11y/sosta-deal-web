// app/ClientLayout.tsx
"use client";

import { usePathname } from "next/navigation";
import MarketplaceBottomNav from "@/components/MarketplaceBottomNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // মল পেজ, ড্যাশবোর্ড এবং লগইন পেজে নেভিগেশন বার দেখাবে না
  const showMarketplaceNav = !pathname?.startsWith("/mall") 
                            && !pathname?.startsWith("/dashboard") 
                            && pathname !== "/login";

  return (
    <>
      {children}
      {showMarketplaceNav && <MarketplaceBottomNav />}
    </>
  );
}