// components/social/StoriesBox.tsx
"use client";

import { useState, useEffect } from 'react';
import { Plus, Play } from 'lucide-react';
import { getStoriesWithUsers, getActiveStories, type Story } from '@/lib/dummyData/stories';
import { getCurrentUser } from '@/lib/dummyData/users';
import StoryViewer from './StoryViewer';
import CreateStoryModal from './CreateStoryModal';

export default function StoriesBox() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const activeStories = getActiveStories();
    const storiesWithUsers = getStoriesWithUsers().filter(s => activeStories.includes(s));
    setStories(storiesWithUsers);
  }, []);

  const handleStoryClick = (index: number) => {
    setSelectedStoryIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedStoryIndex(null);
  };

  const handleStoryAdded = () => {
    // রিফ্রেশ স্টোরি লিস্ট
    const activeStories = getActiveStories();
    const storiesWithUsers = getStoriesWithUsers().filter(s => activeStories.includes(s));
    setStories(storiesWithUsers);
  };

  return (
    <>
      <div className="bg-white py-3 border-b border-gray-100 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-3">
          {/* নিজের স্টোরি অ্যাড বাটন */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex flex-col items-center gap-1 shrink-0"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-orange-400">
              <Plus size={24} className="text-orange-500" />
            </div>
            <span className="text-[10px] font-medium text-gray-600">তৈরি করুন</span>
          </button>

          {/* অন্যের স্টোরি */}
          {stories.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => handleStoryClick(idx)}
              className="flex flex-col items-center gap-1 shrink-0"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-orange-400 to-red-500">
                  <img
                    src={story.user?.avatar_url || 'https://ui-avatars.com/api/?name=User&background=F97316&color=fff'}
                    className="w-full h-full rounded-full object-cover border-2 border-white"
                    alt="story"
                  />
                </div>
                {story.viewed_by?.includes(currentUser?.id || '') === false && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                )}
              </div>
              <span className="text-[10px] font-medium text-gray-700 truncate w-16">
                {story.user?.full_name?.split(' ')[0]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStoryIndex !== null && stories[selectedStoryIndex] && (
        <StoryViewer
          stories={stories}
          initialIndex={selectedStoryIndex}
          onClose={handleCloseViewer}
        />
      )}

      {/* Create Story Modal */}
      {showCreateModal && (
        <CreateStoryModal
          onClose={() => setShowCreateModal(false)}
          onStoryAdded={handleStoryAdded}
        />
      )}
    </>
  );
}