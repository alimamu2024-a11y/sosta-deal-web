// components/social/NewsFeed.tsx
"use client";
import { useState, useEffect } from "react";
import { getPostsWithUsers, type Post } from "@/lib/dummyData/posts";
import NewsCard from "./NewsCard";

interface NewsFeedProps {
  district?: string;
  upazila?: string;
  village?: string;
}

export default function NewsFeed({ district, upazila, village }: NewsFeedProps) {
  const [newsPosts, setNewsPosts] = useState<Post[]>([]);
  useEffect(() => {
    const allPosts = getPostsWithUsers();
    let filtered = allPosts.filter(p => p.type === "news");
    if (district) filtered = filtered.filter(p => p.location?.district === district);
    if (upazila) filtered = filtered.filter(p => p.location?.upazila === upazila);
    if (village) filtered = filtered.filter(p => p.location?.village === village);
    setNewsPosts(filtered);
  }, [district, upazila, village]);
  if (newsPosts.length === 0) return <div className="text-center text-gray-500 py-8">এই এলাকায় কোনো নিউজ পোস্ট নেই। প্রথম নিউজটি শেয়ার করুন!</div>;
  return <div className="space-y-4">{newsPosts.map(post => <NewsCard key={post.id} post={post} onLike={()=>{}} onGift={()=>{}} />)}</div>;
}