// lib/dummyData/gifts.ts

export interface GiftProduct {
  id: string;
  name: string;
  image_url: string;
  coin_price: number;
  category: string;
  is_active: boolean;
}

// ডামি গিফট প্রোডাক্ট (টুনি মল থেকে)
export const dummyGifts: GiftProduct[] = [
  {
    id: "gift_1",
    name: "চমৎকার ফুলের তোড়া",
    image_url: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=200",
    coin_price: 50,
    category: "ফুল",
    is_active: true,
  },
  {
    id: "gift_2",
    name: "হ্যান্ডমেড চকলেট বক্স",
    image_url: "https://images.unsplash.com/photo-1549007953-9f8f1da5b08f?w=200",
    coin_price: 80,
    category: "চকলেট",
    is_active: true,
  },
  {
    id: "gift_3",
    name: "নরম খেলনা পাণ্ডা",
    image_url: "https://images.unsplash.com/photo-1563694983011-6f4d9038be36?w=200",
    coin_price: 120,
    category: "খেলনা",
    is_active: true,
  },
  {
    id: "gift_4",
    name: "বাংলা উপন্যাস সেট",
    image_url: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200",
    coin_price: 150,
    category: "বই",
    is_active: true,
  },
  {
    id: "gift_5",
    name: "হ্যান্ডিক্রাফ্ট ব্যাগ",
    image_url: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200",
    coin_price: 200,
    category: "হস্তশিল্প",
    is_active: true,
  },
  {
    id: "gift_6",
    name: "অর্গানিক চা প্যাক",
    image_url: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?w=200",
    coin_price: 90,
    category: "খাদ্য",
    is_active: true,
  },
  {
    id: "gift_7",
    name: "মুগ সেট (২ পিস)",
    image_url: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=200",
    coin_price: 180,
    category: "গৃহস্থালি",
    is_active: true,
  },
  {
    id: "gift_8",
    name: "বিউটি ক্রিম সেট",
    image_url: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=200",
    coin_price: 250,
    category: "প্রসাধনী",
    is_active: true,
  },
];

// লোকালস্টোরেজ থেকে গিফট হিস্টরি ট্র্যাক করা
export interface GiftTransaction {
  id: string;
  from_user_id: string;
  to_user_id: string;
  gift_id: string;
  gift_name: string;
  coin_spent: number;
  created_at: string;
  status: 'sent' | 'received';
}

let dummyTransactions: GiftTransaction[] = [];

// গিফট পাঠানোর ফাংশন (ডামি)
export const sendGift = (fromUserId: string, toUserId: string, gift: GiftProduct): GiftTransaction | null => {
  // চেক করা যায় ইউজারের কয়েন যথেষ্ট কিনা (পরে ইউজার ডাটা থেকে দেখবে)
  const transaction: GiftTransaction = {
    id: `txn_${Date.now()}`,
    from_user_id: fromUserId,
    to_user_id: toUserId,
    gift_id: gift.id,
    gift_name: gift.name,
    coin_spent: gift.coin_price,
    created_at: new Date().toISOString(),
    status: 'sent',
  };
  dummyTransactions.unshift(transaction);
  return transaction;
};

// নির্দিষ্ট ইউজারের প্রাপ্ত গিফট তালিকা
export const getReceivedGifts = (userId: string): GiftTransaction[] => {
  return dummyTransactions.filter(t => t.to_user_id === userId);
};

// নির্দিষ্ট ইউজারের পাঠানো গিফট তালিকা
export const getSentGifts = (userId: string): GiftTransaction[] => {
  return dummyTransactions.filter(t => t.from_user_id === userId);
};