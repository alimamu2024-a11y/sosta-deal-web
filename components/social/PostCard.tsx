// components/social/PostCard.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, MessageCircle, Gift, Share2, MapPin, MoreHorizontal } from "lucide-react";
import Poll from "./Poll";
import type { Post } from "@/lib/dummyData/posts";
import type { User } from "@/lib/dummyData/users";
import { getCurrentUser } from "@/lib/dummyData/users";
import { votePoll } from "@/lib/dummyData/posts";
import GiftModal from "./GiftModal";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onGift?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onGift }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked || false);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showGiftModal, setShowGiftModal] = useState(false);
  const currentUser = getCurrentUser();

  const handleLike = () => {
    if (!currentUser) return;
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : prev - 1));
    if (onLike) onLike(post.id);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("লিংক কপি হয়েছে!");
  };

  const handleVote = (optionId: string) => {
    if (!currentUser) return;
    votePoll(post.id, optionId, currentUser.id);
    window.location.reload();
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-3">
          <Link href={`/social/profile/${post.user_id}`} className="flex items-center gap-2">
            <img
              src={post.user?.avatar_url || "https://ui-avatars.com/api/?name=User&background=F97316&color=fff"}
              className="w-10 h-10 rounded-full object-cover"
              alt="avatar"
            />
            <div>
              <p className="font-semibold text-gray-800 text-sm">{post.user?.full_name}</p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1">
                <MapPin size={10} />
                {post.location?.upazila}, {post.location?.district}
              </p>
            </div>
          </Link>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <MoreHorizontal size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-3 pb-2">
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{post.content}</p>
          {post.images && post.images.length > 0 && (
            <div className={`grid gap-1 mt-3 ${post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
              {post.images.map((img, idx) => (
                <img key={idx} src={img} className="rounded-xl w-full object-cover max-h-64" alt="post" />
              ))}
            </div>
          )}
          {post.poll && (
            <Poll
              question={post.poll.question}
              options={post.poll.options}
              totalVotes={post.poll.total_votes}
              userVoted={post.poll.userVoted}
              onVote={handleVote}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-around border-t border-gray-100 pt-2 pb-1">
          <button onClick={handleLike} className="flex items-center gap-1 px-4 py-1 rounded-full hover:bg-gray-100 transition">
            <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-gray-500"} />
            <span className="text-xs font-medium text-gray-600">{likesCount}</span>
          </button>
          <Link href={`/social/post/${post.id}`} className="flex items-center gap-1 px-4 py-1 rounded-full hover:bg-gray-100 transition">
            <MessageCircle size={18} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-600">{post.comments_count}</span>
          </Link>
          <button onClick={() => setShowGiftModal(true)} className="flex items-center gap-1 px-4 py-1 rounded-full hover:bg-gray-100 transition">
            <Gift size={18} className="text-gray-500" />
            <span className="text-xs font-medium text-gray-600">{post.gift_count || 0}</span>
          </button>
          <button onClick={handleShare} className="flex items-center gap-1 px-4 py-1 rounded-full hover:bg-gray-100 transition">
            <Share2 size={18} className="text-gray-500" />
          </button>
        </div>
      </div>

      {showGiftModal && post.user_id && (
        <GiftModal
          postId={post.id}
          targetUserId={post.user_id}
          onClose={() => setShowGiftModal(false)}
          onGiftSent={() => {
            alert("গিফট পাঠানো হয়েছে!");
            window.location.reload();
          }}
        />
      )}
    </>
  );
}