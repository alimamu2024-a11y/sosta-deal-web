// components/chat/ImageUpload.tsx
"use client";

import { useRef } from 'react';
import { Image, Loader2 } from 'lucide-react';
import { compressImage } from '@/lib/imageCompression';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  isUploading?: boolean;
}

export default function ImageUpload({ onImageSelected, isUploading }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('video/')) {
      alert('ভিডিও আপলোড করা যাবে না। শুধু ছবি আপলোড করুন!');
      return;
    }

    const compressed = await compressImage(file);
    onImageSelected(compressed);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition"
      >
        {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Image size={18} />}
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleImageSelect}
      />
    </>
  );
}