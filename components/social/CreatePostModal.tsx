// components/social/CreatePostModal.tsx
"use client";

import { useState, useRef } from "react";
import { X, Image as ImageIcon, Plus, Trash2, BarChart2 } from "lucide-react";
import { addPost } from "@/lib/dummyData/posts";
import { getCurrentUser } from "@/lib/dummyData/users";
import { compressImage } from "@/lib/imageCompression";

interface CreatePostModalProps {
  onClose: () => void;
  onPostCreated: () => void;
}

export default function CreatePostModal({ onClose, onPostCreated }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [pollMode, setPollMode] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUser = getCurrentUser();

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      alert("সর্বোচ্চ ৫টি ছবি আপলোড করতে পারবেন");
      return;
    }
    setIsUploading(true);
    const compressedFiles = await Promise.all(files.map(compressImage));
    const newPreviews = compressedFiles.map((f) => URL.createObjectURL(f));
    setImages((prev) => [...prev, ...compressedFiles]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setIsUploading(false);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) setPollOptions([...pollOptions, ""]);
  };

  const updatePollOption = (idx: number, value: string) => {
    const newOpts = [...pollOptions];
    newOpts[idx] = value;
    setPollOptions(newOpts);
  };

  const handleSubmit = async () => {
    if (!currentUser) return;
    if (!content.trim() && images.length === 0 && !pollMode) {
      alert("কিছু লিখুন বা ছবি দিন");
      return;
    }

    const imageUrls = imagePreviews; // ডেভেলপমেন্টে preview URL ব্যবহার করছি

    let pollData = undefined;
    if (pollMode && pollQuestion.trim() && pollOptions.filter((o) => o.trim()).length >= 2) {
      pollData = {
        question: pollQuestion,
        options: pollOptions
          .filter((o) => o.trim())
          .map((opt, idx) => ({
            id: `opt_${Date.now()}_${idx}`,
            text: opt,
            votes: 0,
          })),
        total_votes: 0,
      };
    }

    const newPost = {
      user_id: currentUser.id,
      content: content.trim(),
      images: imageUrls,
      poll: pollData,
      type: pollData ? "poll" : "text",
      location: currentUser.location,
    };
    addPost(newPost as any);
    onPostCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="font-bold text-lg">নতুন পোস্ট তৈরি করুন</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="আপনার মনের কথা লিখুন..."
            className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          {imagePreviews.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {imagePreviews.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={url} className="w-full h-full object-cover" alt="preview" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-0 right-0 bg-black/50 p-1 rounded-bl-lg"
                  >
                    <Trash2 size={12} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPollMode(!pollMode)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                pollMode ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"
              }`}
            >
              <BarChart2 size={16} /> পোল তৈরি করুন
            </button>
          </div>

          {pollMode && (
            <div className="border rounded-xl p-3 space-y-3">
              <input
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="পোলের প্রশ্ন লিখুন"
                className="w-full border-b pb-1 text-sm focus:outline-none"
              />
              {pollOptions.map((opt, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={opt}
                  onChange={(e) => updatePollOption(idx, e.target.value)}
                  placeholder={`অপশন ${idx + 1}`}
                  className="w-full border rounded-lg p-2 text-sm"
                />
              ))}
              {pollOptions.length < 4 && (
                <button onClick={addPollOption} className="text-orange-500 text-sm font-medium flex items-center gap-1">
                  <Plus size={14} /> আরও অপশন যোগ করুন
                </button>
              )}
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 text-gray-700 text-sm font-medium"
            >
              <ImageIcon size={18} /> ছবি যোগ করুন
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleImageSelect}
            />
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="px-5 py-2 bg-orange-500 text-white rounded-full font-bold disabled:opacity-50"
            >
              পোস্ট করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}