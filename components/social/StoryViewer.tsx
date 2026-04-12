// components/social/StoryViewer.tsx
"use client";

import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { markStoryAsViewed } from '@/lib/dummyData/stories';
import { getCurrentUser } from '@/lib/dummyData/users';
import type { Story } from '@/lib/dummyData/stories';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

export default function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const currentUser = getCurrentUser();

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (currentStory && currentUser) {
      markStoryAsViewed(currentStory.id, currentUser.id);
    }
  }, [currentStory, currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          nextStory();
          return 0;
        }
        return prev + 2;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextStory = () => {
    if (currentIndex + 1 < stories.length) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const prevStory = () => {
    if (currentIndex - 1 >= 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  };

  if (!currentStory) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 text-white">
        <X size={24} />
      </button>
      <button onClick={prevStory} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white">
        <ChevronLeft size={28} />
      </button>
      <button onClick={nextStory} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white">
        <ChevronRight size={28} />
      </button>

      <div className="w-full max-w-md mx-auto relative">
        <div className="absolute top-0 left-0 right-0 flex gap-1 p-2 z-10">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-center h-screen">
          {currentStory.image_url ? (
            <img src={currentStory.image_url} className="max-h-[80vh] max-w-full object-contain rounded-lg" alt="story" />
          ) : (
            <div className="bg-gray-800 text-white p-6 rounded-xl max-w-[80%] text-center">
              <p className="text-lg">{currentStory.text}</p>
            </div>
          )}
          <div className="absolute bottom-8 left-0 right-0 text-center text-white bg-black/40 py-2">
            <p className="text-sm font-medium">{currentStory.user?.full_name}</p>
            {currentStory.text && <p className="text-xs opacity-80">{currentStory.text}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}