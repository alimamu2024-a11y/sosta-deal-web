// components/social/ProfileHeader.tsx
"use client";

import { useState } from "react";
import { MapPin, Briefcase, Calendar, Heart, Edit2, Camera } from "lucide-react";
import type { User } from "@/lib/dummyData/users";
import EditProfileModal from "./EditProfileModal";

interface ProfileHeaderProps {
  user: User;
  isOwnProfile: boolean;
  onProfileUpdate: () => void;
}

export default function ProfileHeader({ user, isOwnProfile, onProfileUpdate }: ProfileHeaderProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <>
      <div className="relative bg-white rounded-b-3xl shadow-sm overflow-hidden">
        {/* Cover photo */}
        <div className="h-44 w-full overflow-hidden bg-gradient-to-r from-orange-400 to-red-500">
          <img
            src={user.cover_url || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800"}
            className="w-full h-full object-cover opacity-90"
            alt="cover"
          />
        </div>

        {/* Profile Stats & Avatar Area */}
        <div className="relative px-4">
          {/* Avatar - Adjusted positioning to be higher */}
          <div className="absolute -top-14 left-4">
            <div className="w-28 h-28 rounded-full border-4 border-white bg-gray-100 overflow-hidden shadow-xl">
              <img src={user.avatar_url} className="w-full h-full object-cover" alt="avatar" />
            </div>
            {isOwnProfile && (
              <button
                onClick={() => setShowEditModal(true)}
                className="absolute bottom-1 right-1 bg-orange-500 p-2 rounded-full border-2 border-white shadow-lg active:scale-90 transition-transform"
              >
                <Camera size={14} className="text-white" />
              </button>
            )}
          </div>

          {/* Edit button (top right) */}
          {isOwnProfile && (
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute -top-40 right-4 p-2 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md shadow-sm transition-colors"
            >
              <Edit2 size={18} className="text-white" />
            </button>
          )}

          {/* Info section - Reduced top padding to move text up */}
          <div className="pt-16 pb-4"> 
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-gray-900 leading-tight">{user.full_name}</h2>
              {user.is_verified && (
                <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">ভেরিফাইড</span>
              )}
            </div>
            <p className="text-[13px] text-gray-600 mt-1 font-medium leading-relaxed italic">
              {user.bio || "আমি সোশ্যাল মিডিয়া প্ল্যাটফর্মের সক্রিয় ইউজার।"}
            </p>

            {/* Badges/Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {user.location?.village && (
                <span className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-orange-100">
                  <MapPin size={12} /> {user.location.village}, {user.location.district}
                </span>
              )}
              {user.marital_status && (
                <span className="flex items-center gap-1 bg-pink-50 text-pink-600 px-3 py-1.5 rounded-xl text-[11px] font-bold border border-pink-100">
                  <Heart size={12} /> {user.marital_status === "married" ? "বিবাহিত" : "অবিবাহিত"}
                </span>
              )}
            </div>

            {/* Stats Row - Professional Look */}
            <div className="flex justify-between items-center mt-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner">
              <div className="text-center flex-1 border-r border-gray-200">
                <p className="text-lg font-black text-gray-900">{user.followers_count || 0}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ফলোয়ার</p>
              </div>
              <div className="text-center flex-1 border-r border-gray-200">
                <p className="text-lg font-black text-gray-900">{user.following_count || 0}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">ফলোইং</p>
              </div>
              <div className="text-center flex-1 border-r border-gray-200">
                <p className="text-lg font-black text-gray-900">{user.total_gifts_received || 0}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">গিফট</p>
              </div>
              <div className="text-center flex-1">
                <p className="text-lg font-black text-gray-900 text-orange-600">{user.coins || 0}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">কয়েন</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onUpdate={onProfileUpdate} />
      )}
    </>
  );
}