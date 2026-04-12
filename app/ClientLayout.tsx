"use client";

import { usePathname } from "next/navigation";
import MarketplaceBottomNav from "@/components/MarketplaceBottomNav";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // লজিক: নিচের পাথগুলোতে মেইন মার্কেটপ্লেস ন্যাভ বারটি হাইড থাকবে
  const showMarketplaceNav = !pathname?.startsWith("/mall") 
                            && !pathname?.startsWith("/dashboard") 
                            && pathname !== "/login"
                            && !pathname?.startsWith("/chat")
                            && !pathname?.startsWith("/social")
                            && !pathname?.startsWith("/grammer-haat"); // এটিও যোগ করতে পারেন

  return (
    <>
      <main>{children}</main>
      {/* শুধুমাত্র নির্দিষ্ট পেজগুলো ছাড়া বাকি সবখানে গ্লোবাল ন্যাভ বার দেখাবে */}
      {showMarketplaceNav && <MarketplaceBottomNav />}
    </>
  );
}