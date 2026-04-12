// components/social/NewsCard.tsx
"use client";

import { useState } from "react";
import { Heart, MessageCircle, Share2, MapPin } from "lucide-react";
import Link from "next/link";

interface NewsCardProps {
  post: any;
  onLike: (postId: string) => void;
  onGift: (postId: string) => void;
}

export default function NewsCard({ post, onLike, onGift }: NewsCardProps) {
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState<number>(post.likes_count);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount((prev: number) => (liked ? prev - 1 : prev + 1));
    onLike(post.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("লিংক কপি হয়েছে!");
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <img
            src={post.user?.avatar_url}
            className="w-10 h-10 rounded-full object-cover"
            alt="avatar"
          />
          <div>
            <p className="font-semibold text-gray-800 text-sm">{post.user?.full_name}</p>
            <p className="text-[10px] text-gray-400 flex items-center gap-1">
              <MapPin size={10} /> {post.location?.upazila}, {post.location?.district}
            </p>
          </div>
        </div>
        <h3 className="font-bold text-gray-900 text-md mb-1">{post.content.split("\n")[0]}</h3>
        {post.images && post.images.length > 0 && (
          <img
            src={post.images[0]}
            className="w-full rounded-xl max-h-64 object-cover my-2"
            alt="news"
          />
        )}
        <div className="flex items-center gap-4 mt-2 text-gray-500">
          <button onClick={handleLike} className="flex items-center gap-1">
            <Heart size={18} className={liked ? "fill-red-500 text-red-500" : ""} /> {likesCount}
          </button>
          <Link href={`/social/post/${post.id}`} className="flex items-center gap-1">
            <MessageCircle size={18} /> {post.comments_count}
          </Link>
          <button onClick={handleShare} className="flex items-center gap-1">
            <Share2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}