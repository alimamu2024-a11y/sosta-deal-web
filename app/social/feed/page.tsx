// app/social/feed/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Bell, Plus, Home, Search, MessageCircle, ImageIcon, Smile } from "lucide-react"; 
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
    setPosts(getPostsWithUsers());
  }, []);

  const rowVirtualizer = useVirtualizer({
    count: posts.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 400,
    overscan: 5,
  });

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      
      {/* --- আধুনিক হেডার (Sosta Deal ব্র্যান্ডিং) --- */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm px-4 py-2 flex justify-between items-center">
        <div className="flex items-center gap-2">
          {/* মেইন হোম বাটন (ই-কমার্স পেজে যাওয়ার জন্য) */}
          <button 
            onClick={() => router.push("/")} 
            className="p-2 bg-orange-50 text-orange-600 rounded-full hover:bg-orange-100 transition"
          >
            <Home size={22} strokeWidth={2.5} />
          </button>
          <h1 className="text-2xl font-black bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent tracking-tighter">
            Sosta Deal
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="p-2 bg-gray-100 rounded-full"><Search size={20}/></button>
          <button onClick={() => router.push("/chat")} className="p-2 bg-gray-100 rounded-full relative">
            <MessageCircle size={20}/>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">5</span>
          </button>
        </div>
      </div>

      {/* --- মেইন বডি --- */}
      <div ref={scrollRef} className="h-[calc(100vh-60px)] overflow-y-auto pb-20">
        
        {/* 'আপনার মনে কি আছে' বক্স - ক্লিন ডিজাইন */}
        <div className="bg-white p-4 mb-2 shadow-sm border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border">
              <img src="https://i.pravatar.cc/150?u=me" alt="user" className="w-full h-full object-cover" />
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-left px-4 py-2.5 rounded-full text-gray-500 text-sm"
            >
              আপনার মনে কি আছে?
            </button>
          </div>
          <div className="flex justify-around mt-3 pt-2 border-t border-gray-50">
             <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 text-gray-600 text-xs font-bold py-1">
                <ImageIcon size={18} className="text-green-500" /> ফটো/ভিডিও
             </button>
             <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 text-gray-600 text-xs font-bold py-1">
                <Smile size={18} className="text-yellow-500" /> ফিলিং
             </button>
             <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 text-gray-600 text-xs font-bold py-1">
                <Plus size={18} className="text-blue-500" /> স্ট্যাটাস
             </button>
          </div>
        </div>

        {/* স্টোরি বক্স */}
        <div className="bg-white py-4 mb-2 shadow-sm">
          <StoriesBox /> 
        </div>

        {/* পোস্ট ফিড (Lazy Loading) */}
        <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const post = posts[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualRow.start}px)`,
                  padding: "0 8px 10px 8px"
                }}
              >
                <PostCard post={post} />
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showCreateModal && (
          <CreatePostModal onClose={() => setShowCreateModal(false)} onPostCreated={() => setPosts(getPostsWithUsers())} />
        )}
      </AnimatePresence>
    </div>
  );
}