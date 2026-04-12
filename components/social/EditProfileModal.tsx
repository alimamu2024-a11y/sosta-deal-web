// components/social/EditProfileModal.tsx
"use client";

import { useState, useRef } from "react";
import { X, Camera } from "lucide-react";
import { updateUser, type User } from "@/lib/dummyData/users";
import { compressImage } from "@/lib/imageCompression";
import LocationInput from "./LocationInput";

interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditProfileModal({ user, onClose, onUpdate }: EditProfileModalProps) {
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    bio: user.bio || "",
    job_title: user.job_title || "",
    date_of_birth: user.date_of_birth || "",
    marital_status: user.marital_status || "single",
    location: user.location,
  });
  const [avatarPreview, setAvatarPreview] = useState(user.avatar_url);
  const [coverPreview, setCoverPreview] = useState(user.cover_url || "");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, type: "avatar" | "cover") => {
    const file = e.target.files?.[0];
    if (!file) return;
    const compressed = await compressImage(file);
    const preview = URL.createObjectURL(compressed);
    if (type === "avatar") setAvatarPreview(preview);
    else setCoverPreview(preview);
  };

  const handleSubmit = () => {
    const updatedUser = {
      ...user,
      full_name: formData.full_name,
      bio: formData.bio,
      job_title: formData.job_title,
      date_of_birth: formData.date_of_birth,
      marital_status: formData.marital_status as any,
      location: formData.location,
      avatar_url: avatarPreview,
      cover_url: coverPreview,
    };
    updateUser(updatedUser);
    onUpdate();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">প্রোফাইল এডিট করুন</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} /></button>
        </div>
        <div className="p-4 space-y-4">
          {/* কভার ফটো */}
          <div className="relative h-32 bg-gray-200 rounded-xl overflow-hidden">
            <img src={coverPreview} className="w-full h-full object-cover" alt="cover" />
            <button onClick={() => coverInputRef.current?.click()} className="absolute bottom-2 right-2 bg-black/50 p-2 rounded-full">
              <Camera size={16} className="text-white" />
            </button>
            <input type="file" ref={coverInputRef} accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "cover")} />
          </div>
          {/* এভাটার */}
          <div className="flex justify-center -mt-10">
            <div className="relative w-20 h-20 rounded-full border-4 border-white bg-gray-100 overflow-hidden">
              <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar" />
              <button onClick={() => avatarInputRef.current?.click()} className="absolute bottom-0 right-0 bg-orange-500 p-1 rounded-full">
                <Camera size={12} className="text-white" />
              </button>
              <input type="file" ref={avatarInputRef} accept="image/*" className="hidden" onChange={(e) => handleImageChange(e, "avatar")} />
            </div>
          </div>

          <input type="text" value={formData.full_name} onChange={(e) => setFormData({...formData, full_name: e.target.value})} className="w-full border rounded-xl p-2 text-sm" placeholder="পূর্ণ নাম" />
          <textarea rows={2} value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} className="w-full border rounded-xl p-2 text-sm" placeholder="বায়ো" />
          <input type="text" value={formData.job_title} onChange={(e) => setFormData({...formData, job_title: e.target.value})} className="w-full border rounded-xl p-2 text-sm" placeholder="পেশা" />
          <input type="date" value={formData.date_of_birth} onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})} className="w-full border rounded-xl p-2 text-sm" />
          <select value={formData.marital_status} onChange={(e) => setFormData({...formData, marital_status: e.target.value as any})} className="w-full border rounded-xl p-2 text-sm">
            <option value="single">অবিবাহিত</option>
            <option value="married">বিবাহিত</option>
            <option value="divorced">ডিভোর্সড</option>
            <option value="widowed">বিধবা/বিধুর</option>
          </select>
          <LocationInput
            initialDistrict={formData.location.district}
            initialUpazila={formData.location.upazila}
            initialVillage={formData.location.village}
            onChange={(district, upazila, village) => setFormData({...formData, location: { district, upazila, village }})}
          />
          <button onClick={handleSubmit} className="w-full bg-orange-500 text-white py-2 rounded-xl font-bold">সেভ করুন</button>
        </div>
      </div>
    </div>
  );
}