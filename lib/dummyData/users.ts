// lib/dummyData/users.ts
export interface User {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  cover_url?: string;
  bio?: string;
  location: {
    district: string;
    upazila: string;
    village?: string;
  };
  date_of_birth?: string;
  job_title?: string;
  marital_status?: 'single' | 'married' | 'divorced' | 'widowed';
  is_verified: boolean;
  is_active: boolean;
  coins: number;
  created_at: string;
  total_gifts_received?: number;
  followers_count?: number;
  following_count?: number;
}

// ডামি ইউজার লিস্ট
export const dummyUsers: User[] = [
  {
    id: "user_1",
    full_name: "সাব্বির আহমেদ",
    email: "sabbir@sosta.com",
    avatar_url: "https://ui-avatars.com/api/?name=Sabbir&background=F97316&color=fff&bold=true",
    cover_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    bio: "সফটওয়্যার ইঞ্জিনিয়ার | কুষ্টিয়ার ছেলে | নতুন প্রযুক্তি নিয়ে আড্ডা দিতে ভালোবাসি",
    location: { district: "কুষ্টিয়া", upazila: "কুষ্টিয়া সদর", village: "পোড়াদহ" },
    date_of_birth: "1995-03-15",
    job_title: "Tech Lead at Sosta Deal",
    marital_status: "married",
    is_verified: true,
    is_active: true,
    coins: 1250,
    created_at: "2024-01-01T10:00:00Z",
    total_gifts_received: 12,
    followers_count: 345,
    following_count: 123,
  },
  {
    id: "user_2",
    full_name: "রাফিয়া খাতুন",
    email: "rafia@sosta.com",
    avatar_url: "https://ui-avatars.com/api/?name=Rafia&background=F97316&color=fff&bold=true",
    cover_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800",
    bio: "গৃহিণী | বাচ্চাদের মা | হস্তশিল্প ও বাগান করা আমার শখ",
    location: { district: "কুষ্টিয়া", upazila: "ভেড়ামারা", village: "ভেড়ামারা সদর" },
    date_of_birth: "1998-07-22",
    job_title: "হস্তশিল্প উদ্যোক্তা",
    marital_status: "married",
    is_verified: false,
    is_active: true,
    coins: 520,
    created_at: "2024-02-10T14:30:00Z",
    total_gifts_received: 5,
    followers_count: 89,
    following_count: 110,
  },
  {
    id: "user_3",
    full_name: "মিজানুর রহমান",
    email: "mizan@sosta.com",
    avatar_url: "https://ui-avatars.com/api/?name=Mizan&background=F97316&color=fff&bold=true",
    cover_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    bio: "ছাত্র | ইতিহাস প্রেমী | স্থানীয় সংস্কৃতি নিয়ে কাজ করি",
    location: { district: "কুষ্টিয়া", upazila: "কুমারখালী", village: "কুমারখালী বাজার" },
    date_of_birth: "2002-11-05",
    job_title: "বিশ্ববিদ্যালয় শিক্ষার্থী",
    marital_status: "single",
    is_verified: false,
    is_active: true,
    coins: 210,
    created_at: "2024-03-05T09:15:00Z",
    total_gifts_received: 2,
    followers_count: 45,
    following_count: 78,
  },
  {
    id: "user_4",
    full_name: "শাহিনা আক্তার",
    email: "shahina@sosta.com",
    avatar_url: "https://ui-avatars.com/api/?name=Shahina&background=F97316&color=fff&bold=true",
    cover_url: "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800",
    bio: "কৃষক ও গৃহিণী | নিজের চাষের ফল বিক্রি করি",
    location: { district: "কুষ্টিয়া", upazila: "খোকসা", village: "খোকসা বাজার" },
    date_of_birth: "1990-01-10",
    job_title: "জৈব কৃষক",
    marital_status: "married",
    is_verified: true,
    is_active: true,
    coins: 840,
    created_at: "2024-01-20T11:20:00Z",
    total_gifts_received: 8,
    followers_count: 201,
    following_count: 95,
  },
  {
    id: "current_user",
    full_name: "আপনার নাম",
    email: "you@example.com",
    avatar_url: "https://ui-avatars.com/api/?name=You&background=F97316&color=fff&bold=true",
    cover_url: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800",
    bio: "আমি সোশ্যাল মিডিয়া প্ল্যাটফর্মের সক্রিয় ইউজার।",
    location: { district: "কুষ্টিয়া", upazila: "কুষ্টিয়া সদর", village: "জগতি" },
    date_of_birth: "2000-01-01",
    job_title: "ইউজার",
    marital_status: "single",
    is_verified: false,
    is_active: true,
    coins: 100,
    created_at: new Date().toISOString(),
    total_gifts_received: 0,
    followers_count: 10,
    following_count: 5,
  },
];

// লোকালস্টোরেজ থেকে বর্তমান লগইন ইউজার পাওয়া
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('sosta_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  // ডিফল্ট হিসেবে 'current_user' রিটার্ন করি (লগইন সিমুলেট)
  return dummyUsers.find(u => u.id === 'current_user') || null;
};

// ইউজার ডাটা আপডেট (প্রোফাইল এডিট)
export const updateUser = (updatedUser: User): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('sosta_user', JSON.stringify(updatedUser));
  // এছাড়াও dummyUsers আপডেট করতে চাইলে (রানটাইমে)
  const index = dummyUsers.findIndex(u => u.id === updatedUser.id);
  if (index !== -1) {
    dummyUsers[index] = updatedUser;
  }
};

// ইউজার ডিলিট (সফট ডিলিট – লোকালস্টোরেজ থেকে রিমুভ)
export const deleteUserAccount = (userId: string): boolean => {
  if (typeof window === 'undefined') return false;
  const currentUser = getCurrentUser();
  if (currentUser?.id !== userId) return false;
  localStorage.removeItem('sosta_user');
  return true;
};