// app/social/explore/page.tsx
"use client";

import { useState, useEffect } from "react";
import PostCard from "@/components/social/PostCard";
import { getPostsWithUsers, type Post } from "@/lib/dummyData/posts";

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const allPosts = getPostsWithUsers();
    setPosts(allPosts);
  }, []);

  return (
    <div>
      <div className="sticky top-0 z-10 bg-white p-3 border-b">
        <h1 className="text-xl font-bold text-orange-600">এক্সপ্লোর</h1>
      </div>
      <div className="p-3 space-y-3">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}