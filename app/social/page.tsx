// app/social/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SocialHomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/social/feed");
  }, [router]);

  return null;
}