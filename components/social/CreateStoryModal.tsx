// components/social/CreateStoryModal.tsx
"use client";

import { useState, useRef } from 'react';
import { X, Image as ImageIcon, Camera } from 'lucide-react';
import { addStory } from '@/lib/dummyData/stories';
import { getCurrentUser } from '@/lib/dummyData/users';
import { compressImage } from '@/lib/imageCompression';

interface CreateStoryModalProps {
  onClose: () => void;
  onStoryAdded: () => void;
}

export default function CreateStoryModal({ onClose, onStoryAdded }: CreateStoryModalProps) {
  const [text, setText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentUser = getCurrentUser();

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const compressed = await compressImage(file);
      const preview = URL.createObjectURL(compressed);
      setImageFile(compressed);
      setImagePreview(preview);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!currentUser) return;
    if (!imageFile && !text.trim()) {
      alert('ছবি অথবা টেক্সট দিন');
      return;
    }
    // ডামি আপলোড – এখানে আমরা image_url সিমুলেট করছি (স্থানীয় blob URL)
    const imageUrl = imagePreview ? imagePreview : undefined;
    addStory({
      user_id: currentUser.id,
      image_url: imageUrl,
      text: text.trim() || undefined,
    });
    onStoryAdded();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">স্টোরি তৈরি করুন</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Image preview area */}
        <div
          className="w-full h-48 bg-gray-100 rounded-xl mb-3 flex items-center justify-center cursor-pointer overflow-hidden"
          onClick={() => fileInputRef.current?.click()}
        >
          {imagePreview ? (
            <img src={imagePreview} className="w-full h-full object-cover" alt="preview" />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400">
              <Camera size={32} />
              <span className="text-sm">ছবি তুলুন বা আপলোড করুন</span>
            </div>
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleImageSelect}
        />

        {/* Text input */}
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="লেখুন (ঐচ্ছিক)..."
          className="w-full border rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={handleSubmit}
          disabled={isUploading}
          className="w-full bg-orange-500 text-white py-2 rounded-xl font-bold mt-3 disabled:opacity-50"
        >
          {isUploading ? 'প্রস্তুত হচ্ছে...' : 'স্টোরি শেয়ার করুন'}
        </button>
      </div>
    </div>
  );
}