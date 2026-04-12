// lib/dummyData/posts.ts
import { User, dummyUsers } from './users';

export interface PollOption {
  id: string;
  text: string;
  votes: number; // কতজন ভোট দিয়েছে
}

export interface Poll {
  question: string;
  options: PollOption[];
  total_votes: number;
  userVoted?: boolean; // বর্তমান ইউজার ভোট দিয়েছে কিনা (ক্লায়েন্ট সাইডে সেট হবে)
}

export interface Post {
  id: string;
  user_id: string;
  user?: User; // জয়েন করার জন্য
  content: string;
  images?: string[]; // সর্বোচ্চ ৫টি ছবির ইউআরএল
  poll?: Poll;
  location?: {
    district: string;
    upazila: string;
    village?: string;
  };
  likes_count: number;
  comments_count: number;
  gift_count?: number;
  isLiked?: boolean; // ক্লায়েন্ট সাইডে ট্র্যাকিং
  created_at: string;
  type: 'text' | 'poll' | 'news'; // নিউজ টাইপ আলাদা রাখলাম
}

// ডামি পোস্ট তৈরি
const getRandomUser = () => dummyUsers[Math.floor(Math.random() * (dummyUsers.length - 1))]; // current_user বাদে

export const dummyPosts: Post[] = [
  {
    id: "post_1",
    user_id: "user_1",
    content: "আজ কুষ্টিয়ার মজারপুরে বড় মেলা বসেছে। সবাই আসতে পারেন! সাথে থাকছে নানা রকম হস্তশিল্প ও পিঠাপুলির আয়োজন।",
    images: ["https://images.unsplash.com/photo-1523580495863-d6fcd22a6d67?w=600"],
    location: { district: "কুষ্টিয়া", upazila: "কুষ্টিয়া সদর", village: "মজারপুর" },
    likes_count: 45,
    comments_count: 12,
    gift_count: 3,
    created_at: "2025-04-09T10:30:00Z",
    type: "text",
  },
  {
    id: "post_2",
    user_id: "user_2",
    content: "আমার বাড়ির আঙ্গিনায় ফুল ফুটেছে। দেখতে কেমন লাগছে?",
    images: ["https://images.unsplash.com/photo-1490750967868-88aa4476d33b?w=600"],
    location: { district: "কুষ্টিয়া", upazila: "ভেড়ামারা", village: "ভেড়ামারা সদর" },
    likes_count: 89,
    comments_count: 23,
    gift_count: 7,
    created_at: "2025-04-09T09:15:00Z",
    type: "text",
  },
  {
    id: "post_3",
    user_id: "user_3",
    content: "আপনার এলাকায় সবচেয়ে বড় সমস্যা কি? ভোট দিয়ে জানান।",
    poll: {
      question: "আপনার এলাকায় সবচেয়ে বড় সমস্যা কি?",
      options: [
        { id: "opt1", text: "রাস্তা যোগাযোগ", votes: 34 },
        { id: "opt2", text: "বন্যা/জলাবদ্ধতা", votes: 28 },
        { id: "opt3", text: "শিক্ষার অভাব", votes: 19 },
        { id: "opt4", text: "স্বাস্থ্যসেবা", votes: 15 },
      ],
      total_votes: 96,
    },
    location: { district: "কুষ্টিয়া", upazila: "কুমারখালী", village: "কুমারখালী বাজার" },
    likes_count: 67,
    comments_count: 45,
    created_at: "2025-04-08T20:00:00Z",
    type: "poll",
  },
  {
    id: "post_4",
    user_id: "user_4",
    content: "জৈব পদ্ধতিতে চাষ করা লাউ ও বেগুন এখন সস্তায় বিক্রি হচ্ছে। আগ্রহীরা যোগাযোগ করুন।",
    images: [
      "https://images.unsplash.com/photo-1577211831690-5d9b3d95f1b8?w=600",
      "https://images.unsplash.com/photo-1601493700613-6f7e8c5dbded?w=600",
    ],
    location: { district: "কুষ্টিয়া", upazila: "খোকসা", village: "খোকসা বাজার" },
    likes_count: 120,
    comments_count: 30,
    gift_count: 5,
    created_at: "2025-04-08T14:45:00Z",
    type: "text",
  },
  {
    id: "post_5",
    user_id: "user_1",
    content: "কুষ্টিয়া সদরে আজ বিকাল ৫টায় স্বেচ্ছায় রক্তদান কর্মসূচি। সবাই অংশগ্রহণ করুন।",
    images: ["https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=600"],
    location: { district: "কুষ্টিয়া", upazila: "কুষ্টিয়া সদর", village: "পোড়াদহ" },
    likes_count: 210,
    comments_count: 52,
    gift_count: 12,
    created_at: "2025-04-07T08:00:00Z",
    type: "news",
  },
  {
    id: "post_6",
    user_id: "current_user",
    content: "আমার প্রথম পোস্ট। সোশ্যাল প্ল্যাটফর্মটি চমৎকার হচ্ছে!",
    images: [],
    likes_count: 5,
    comments_count: 2,
    created_at: new Date().toISOString(),
    type: "text",
  },
];

// পোস্টের ইউজার ইনফো জয়েন করে দেবার ফাংশন (ক্লায়েন্ট সাইডে ব্যবহার)
export const getPostsWithUsers = (): Post[] => {
  return dummyPosts.map(post => ({
    ...post,
    user: dummyUsers.find(u => u.id === post.user_id),
  }));
};

// নতুন পোস্ট যোগ করার ফাংশন (লোকালস্টোরেজ বা রিয়েল টাইম আপডেট)
export const addPost = (newPost: Omit<Post, 'id' | 'created_at' | 'likes_count' | 'comments_count'>) => {
  const post: Post = {
    ...newPost,
    id: `post_${Date.now()}`,
    created_at: new Date().toISOString(),
    likes_count: 0,
    comments_count: 0,
    gift_count: 0,
  };
  dummyPosts.unshift(post); // শীর্ষে যোগ হবে
  // পরে localStorage-এ sync করতে পারি, কিন্তু ডেভেলপমেন্টের জন্য dummy array ই যথেষ্ট
  return post;
};

// পোল ভোট দেওয়ার ফাংশন (ডামি)
export const votePoll = (postId: string, optionId: string, userId: string): boolean => {
  const post = dummyPosts.find(p => p.id === postId);
  if (!post || !post.poll) return false;
  const option = post.poll.options.find(opt => opt.id === optionId);
  if (!option) return false;
  // ডাবল ভোট ঠেকানো সহজ করার জন্য একটি সেট রাখতে পারি, এখানে শুধু ভোট বাড়াচ্ছি
  option.votes += 1;
  post.poll.total_votes += 1;
  return true;
};