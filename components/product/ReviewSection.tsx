// components/product/ReviewSection.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Star, Camera, X, ThumbsUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import imageCompression from "browser-image-compression";
import ImageModal from "./ImageModal";

type ReviewImage = {
  id: string;
  url: string;
  file?: File;
};

type Review = {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  images?: ReviewImage[];
  likes: number;
};

type ReviewSectionProps = {
  productId: string;
};

const compressImage = async (file: File): Promise<File> => {
  const options = {
    maxSizeMB: 0.05,
    maxWidthOrHeight: 800,
    useWebWorker: true,
    fileType: "image/jpeg",
  };
  try {
    return await imageCompression(file, options);
  } catch {
    return file;
  }
};

const fetchReviews = async (): Promise<Review[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return [
    {
      id: "1",
      userName: "Rafiqul Islam",
      userAvatar: "https://randomuser.me/api/portraits/men/1.jpg",
      rating: 5,
      comment: "Amazing sound quality! Worth every penny.",
      date: "2024-02-15",
      likes: 24,
    },
    {
      id: "2",
      userName: "Shakila Akter",
      userAvatar: "https://randomuser.me/api/portraits/women/2.jpg",
      rating: 4,
      comment: "Very comfortable and battery lasts long.",
      date: "2024-02-10",
      likes: 12,
    },
  ];
};

export default function ReviewSection({ productId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [uploadedImages, setUploadedImages] = useState<ReviewImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, [productId]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const compressedFiles = await Promise.all(files.map(compressImage));
    const newImages: ReviewImage[] = compressedFiles.map((file, idx) => ({
      id: Date.now().toString() + idx,
      url: URL.createObjectURL(file),
      file,
    }));
    setUploadedImages((prev) => [...prev, ...newImages]);
    setIsUploading(false);
  };

  const removeImage = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleSubmitReview = () => {
    const newReview: Review = {
      id: Date.now().toString(),
      userName: "You",
      userAvatar: "https://randomuser.me/api/portraits/lego/1.jpg",
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString().split("T")[0],
      images: uploadedImages,
      likes: 0,
    };
    setReviews((prev) => [newReview, ...prev]);
    setShowForm(false);
    setNewComment("");
    setUploadedImages([]);
    setNewRating(5);
  };

  if (loading) {
    return <div className="animate-pulse h-40 bg-gray-100 rounded-2xl"></div>;
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-gray-900">⭐ Customer Reviews ({reviews.length})</h3>
          <button
            onClick={() => setShowForm(true)}
            className="bg-black text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition"
          >
            Write a Review
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-8 p-5 bg-gray-50 rounded-2xl"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold">Share your experience</h4>
                <button onClick={() => setShowForm(false)}>
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <button key={i} onClick={() => setNewRating(i + 1)} type="button">
                    <Star
                      size={28}
                      className={`${
                        i < newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      } transition-transform active:scale-90`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full border rounded-xl p-3 text-sm focus:ring-2 focus:ring-black outline-none"
                placeholder="Write your review..."
              />

              {/* Image Preview Grid with Delete Option */}
              <div className="flex flex-wrap gap-2 my-3">
                {uploadedImages.map((img) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      className="w-16 h-16 object-cover rounded-lg cursor-pointer"
                      onClick={() => setModalImage(img.url)}
                    />
                    <button
                      onClick={() => removeImage(img.id)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 shadow-md"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 bg-gray-200 px-3 py-1.5 rounded-xl text-sm"
                >
                  <Camera size={16} /> Add Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />
                {isUploading && <span className="text-sm text-gray-500 animate-pulse">Compressing...</span>}
                <button
                  onClick={handleSubmitReview}
                  className="bg-black text-white px-6 py-1.5 rounded-xl text-sm ml-auto"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-5 last:border-0">
              <div className="flex gap-3">
                <img src={review.userAvatar} className="w-10 h-10 rounded-full" />
                <div className="flex-1">
                  <div className="flex justify-between flex-wrap">
                    <h4 className="font-semibold">{review.userName}</h4>
                    <span className="text-xs text-gray-400">{review.date}</span>
                  </div>
                  <div className="flex gap-0.5 my-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700">{review.comment}</p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {review.images.map((img) => (
                        <img
                          key={img.id}
                          src={img.url}
                          className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80 transition"
                          onClick={() => setModalImage(img.url)}
                        />
                      ))}
                    </div>
                  )}
                  <button className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <ThumbsUp size={12} /> Helpful ({review.likes})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <ImageModal image={modalImage} onClose={() => setModalImage(null)} />
    </>
  );
}