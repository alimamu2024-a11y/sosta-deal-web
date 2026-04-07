// components/product/ImageModal.tsx
"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type ImageModalProps = {
  image: string | null;
  onClose: () => void;
};

export default function ImageModal({ image, onClose }: ImageModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!image) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center" onClick={onClose}>
      <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full transition">
        <X size={28} />
      </button>
      <img src={image} className="max-w-full max-h-[90vh] object-contain" alt="Full size" />
    </div>
  );
}