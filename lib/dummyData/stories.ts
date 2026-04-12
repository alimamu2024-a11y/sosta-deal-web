// lib/dummyData/stories.ts
import { User, dummyUsers } from './users';

export interface Story {
  id: string;
  user_id: string;
  user?: User; // জয়েন করার জন্য
  image_url?: string; // ছবি (ঐচ্ছিক)
  text?: string; // টেক্সট (ঐচ্ছিক) – ছবি বা টেক্সট যেকোনো একটি থাকবেই
  created_at: string;
  expires_at: string; // ২৪ ঘন্টা পরে
  viewed_by?: string[]; // কে কে দেখেছে
}

// ডামি স্টোরি তৈরি (২৪ ঘন্টার মধ্যে তৈরি)
const getRandomUser = () => dummyUsers[Math.floor(Math.random() * (dummyUsers.length - 1))];

const now = new Date();
const twentyFourHoursLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);

export const dummyStories: Story[] = [
  {
    id: "story_1",
    user_id: "user_1",
    image_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400",
    text: "কুষ্টিয়ার নতুন স্টল বসেছে, দেখতে আসুন!",
    created_at: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // ২ ঘন্টা আগে
    expires_at: twentyFourHoursLater.toISOString(),
    viewed_by: ["user_2", "user_3"],
  },
  {
    id: "story_2",
    user_id: "user_2",
    image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
    text: "আজ বাড়িতে পিঠা বানিয়েছি।",
    created_at: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), // ৫ ঘন্টা আগে
    expires_at: twentyFourHoursLater.toISOString(),
    viewed_by: ["user_1"],
  },
  {
    id: "story_3",
    user_id: "user_3",
    image_url: "https://images.unsplash.com/photo-1523580495863-d6fcd22a6d67?w=400",
    text: "গ্রামের প্রাকৃতিক দৃশ্য",
    created_at: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(), // ১০ ঘন্টা আগে
    expires_at: twentyFourHoursLater.toISOString(),
    viewed_by: [],
  },
  {
    id: "story_4",
    user_id: "user_4",
    text: "আজ আমার দোকানে নতুন পণ্য এসেছে। সবার জন্য শুভ কামনা।",
    created_at: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString(), // ১৫ ঘন্টা আগে
    expires_at: twentyFourHoursLater.toISOString(),
    viewed_by: ["user_1", "user_2", "user_3"],
  },
  {
    id: "story_5",
    user_id: "current_user",
    image_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
    text: "আমার প্রথম স্টোরি!",
    created_at: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // ১ ঘন্টা আগে
    expires_at: twentyFourHoursLater.toISOString(),
    viewed_by: [],
  },
];

// স্টোরির সাথে ইউজার ইনফো জয়েন করে দেবে
export const getStoriesWithUsers = (): Story[] => {
  return dummyStories.map(story => ({
    ...story,
    user: dummyUsers.find(u => u.id === story.user_id),
  }));
};

// নির্দিষ্ট ইউজারের স্টোরি পাওয়া
export const getUserStories = (userId: string): Story[] => {
  return dummyStories.filter(story => story.user_id === userId);
};

// নতুন স্টোরি যোগ করা (স্থানীয়ভাবে)
export const addStory = (newStory: Omit<Story, 'id' | 'created_at' | 'expires_at' | 'viewed_by'>) => {
  const now = new Date();
  const story: Story = {
    ...newStory,
    id: `story_${Date.now()}`,
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
    viewed_by: [],
  };
  dummyStories.unshift(story);
  return story;
};

// স্টোরি দেখার রেকর্ড (viewed_by আপডেট)
export const markStoryAsViewed = (storyId: string, userId: string) => {
  const story = dummyStories.find(s => s.id === storyId);
  if (story && !story.viewed_by?.includes(userId)) {
    story.viewed_by = [...(story.viewed_by || []), userId];
  }
};

// মেয়াদ উত্তীর্ণ স্টোরি ফিল্টার (যেগুলো expire হয়ে গেছে)
export const getActiveStories = (): Story[] => {
  const now = new Date();
  return dummyStories.filter(story => new Date(story.expires_at) > now);
};