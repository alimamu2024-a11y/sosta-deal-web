// app/social/post/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import PostCard from "@/components/social/PostCard";
import CommentSection from "@/components/social/CommentSection";
import { getPostsWithUsers, type Post } from "@/lib/dummyData/posts";

export default function PostDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<any[]>([]);

  useEffect(() => {
    const allPosts = getPostsWithUsers();
    const found = allPosts.find((p) => p.id === id);
    setPost(found || null);
    setComments([
      {
        id: "c1",
        user_id: "user_2",
        user_name: "রাফিয়া",
        user_avatar: "https://ui-avatars.com/api/?name=Rafia",
        content: "দারুণ পোস্ট!",
        created_at: new Date().toISOString(),
      },
    ]);
  }, [id]);

  const handleAddComment = (postId: string, content: string) => {
    const newComment = {
      id: Date.now().toString(),
      user_id: "current_user",
      user_name: "আপনি",
      user_avatar: "https://ui-avatars.com/api/?name=You",
      content,
      created_at: new Date().toISOString(),
    };
    setComments((prev) => [...prev, newComment]);
  };

  if (!post) return <div className="p-10 text-center text-gray-500">পোস্ট পাওয়া যায়নি</div>;

  return (
    <div className="p-3">
      <PostCard post={post} />
      <CommentSection postId={post.id} comments={comments} onAddComment={handleAddComment} />
    </div>
  );
}