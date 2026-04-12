// app/social/feed/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Bell, Plus, Home, Search, MessageCircle, Image as ImageIcon, Video } from "lucide-react"; 
import StoriesBox from "@/components/social/StoriesBox";
import PostCard from "@/components/social/PostCard";
import CreatePostModal from "@/components/social/CreatePostModal";
import { getPostsWithUsers, type Post } from "@/lib/dummyData/posts";
import { motion, AnimatePresence } from "framer-motion";

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ইনিশিয়াল ডাটা লোড
    setPosts(getPostsWithUsers());
  }, []);

  // ⚡ Lazy Loading / Virtualization Engine
  const rowVirtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 450, // পোস্টের আনুমানিক হাইট
    overscan: 5, // মেমোরিতে আগেভাগে ৫টি পোস্ট লোড করে রাখবে
  });

  return (
    <div className="bg-[#f0f2f5] min-h-screen overflow-x-hidden selection:bg-blue-100">
      
      {/* --- ফিক্সড হেডার (Facebook Blue Style) --- */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex justify-between items-center px-4 py-2">
          <h1 className="text-3xl font-black text-[#1877F2] tracking-tighter">facebook</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-gray-100 rounded-full active:scale-90 transition">
              <Search size={20} className="text-black" />
            </button>
            <button onClick={() => router.push("/chat")} className="p-2 bg-gray-100 rounded-full active:scale-90 transition relative">
              <MessageCircle size={20} className="text-black" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] px-1.5 rounded-full font-bold">3</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- মেইন স্ক্রল এরিয়া --- */}
      <div 
        ref={scrollRef} 
        className="h-[calc(100vh-60px)] overflow-y-auto pb-24 scrollbar-hide"
      >
        
        {/* 1. What's on your mind (ফেসবুক এর মতো বাইরে) */}
        <div className="bg-white p-4 mb-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-gray-100 flex-shrink-0 overflow-hidden">
              <img src="https://i.pravatar.cc/150?u=rubel" alt="user" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex-1 bg-[#f0f2f5] hover:bg-gray-200 text-left px-4 py-2.5 rounded-full text-gray-600 text-[15px] transition-colors"
            >
              আপনার মনে কি আছে?
            </button>
          </div>
          
          <div className="flex justify-between mt-3 pt-3 border-t border-gray-100">
             <button onClick={() => setShowCreateModal(true)} className="flex-1 flex items-center justify-center gap-2 text-gray-500 text-sm font-semibold py-2 hover:bg-gray-50 rounded-lg">
                <Video size={20} className="text-red-500" /> লাইভ
             </button>
             <button onClick={() => setShowCreateModal(true)} className="flex-1 flex items-center justify-center gap-2 text-gray-500 text-sm font-semibold py-2 hover:bg-gray-50 rounded-lg">
                <ImageIcon size={20} className="text-green-500" /> ফটো
             </button>
             <button onClick={() => setShowCreateModal(true)} className="flex-1 flex items-center justify-center gap-2 text-gray-500 text-sm font-semibold py-2 hover:bg-gray-50 rounded-lg">
                <Plus size={20} className="text-blue-500" /> স্ট্যাটাস
             </button>
          </div>
        </div>

        {/* 2. স্টোরি সেকশন (একসাথে ৫-৬টা দেখার উপযোগী) */}
        <div className="bg-white py-4 mb-3 shadow-sm overflow-hidden">
          <StoriesBox /> 
        </div>

        {/* 3. পোস্ট ফিড (Lazzy Load / Virtual List) */}
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const post = posts[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                className="w-full max-w-full"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: "8px"
                }}
              >
                <PostCard post={post} />
              </div>
            );
          })}
        </div>

        {/* লোডার ইন্ডিকেটর */}
        {posts.length > 0 && (
          <div className="flex justify-center py-5">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* ক্রিয়েট পোস্ট মোডাল */}
      <AnimatePresence>
        {showCreateModal && (
          <CreatePostModal 
            onClose={() => setShowCreateModal(false)} 
            onPostCreated={() => setPosts(getPostsWithUsers())} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}