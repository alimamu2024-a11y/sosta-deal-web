// app/social/profile/[userId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import ProfileHeader from "@/components/social/ProfileHeader";
import PostCard from "@/components/social/PostCard";
import { dummyUsers, type User, getCurrentUser } from "@/lib/dummyData/users";
import { getPostsWithUsers, type Post } from "@/lib/dummyData/posts";
import { getPrivateRoomId } from "@/helpers/chat";

export default function ProfilePage() {
  const { userId } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    // লোকালস্টোরেজ থেকে বর্তমান লগইন করা ইউজার
    const storedCurrent = getCurrentUser();
    setCurrentUser(storedCurrent);

    let targetUserId = userId as string;

    // যদি URL এ "current_user" থাকে, তাহলে সেটিকে আসল ইউজার আইডিতে রূপান্তর করো
    if (targetUserId === "current_user") {
      if (storedCurrent) {
        targetUserId = storedCurrent.id;
      } else {
        // লগইন না থাকলে হোমপেজে পাঠিয়ে দাও
        router.push("/login");
        return;
      }
    }

    // dummyUsers থেকে ইউজার খোঁজো
    let foundUser = dummyUsers.find((u) => u.id === targetUserId);
    
    // যদি না পাওয়া যায়, তাহলে default হিসেবে current_user দেখাও (যদি থাকে)
    if (!foundUser && storedCurrent) {
      foundUser = storedCurrent;
    }
    
    // এখনও না পেলে error মেসেজ
    if (!foundUser) {
      setUser(null);
      return;
    }

    setUser(foundUser);
    setIsOwnProfile(storedCurrent?.id === foundUser.id);

    // পোস্ট লোড করো
    const allPosts = getPostsWithUsers();
    setUserPosts(allPosts.filter((p) => p.user_id === foundUser.id));
  }, [userId, router]);

  const handleProfileUpdate = () => {
    window.location.reload();
  };

  const handleSendMessage = () => {
    if (!currentUser || !user) return;
    const roomId = getPrivateRoomId(currentUser.id, user.id);
    router.push(`/chat/private/${roomId}`);
  };

  if (!user) {
    return <div className="p-10 text-center text-gray-500">ইউজার পাওয়া যায়নি।</div>;
  }

  return (
    <div>
      <ProfileHeader user={user} isOwnProfile={isOwnProfile} onProfileUpdate={handleProfileUpdate} />

      {!isOwnProfile && (
        <div className="px-4 mt-2">
          <button
            onClick={handleSendMessage}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <MessageCircle size={18} /> মেসেজ পাঠান
          </button>
        </div>
      )}

      <div className="p-3 space-y-3">
        {userPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
        {userPosts.length === 0 && (
          <p className="text-center text-gray-500 py-8">কোনো পোস্ট নেই</p>
        )}
      </div>
    </div>
  );
}