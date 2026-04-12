// lib/dummyData/notifications.ts
export interface Notification {
  id: string;
  user_id: string;
  type: "like" | "comment" | "gift" | "follow";
  from_user_name: string;
  from_user_avatar: string;
  message: string;
  post_id?: string;
  read: boolean;
  created_at: string;
}

export const dummyNotifications: Notification[] = [
  {
    id: "1",
    user_id: "current_user",
    type: "like",
    from_user_name: "রাফিয়া খাতুন",
    from_user_avatar: "https://ui-avatars.com/api/?name=Rafia&background=F97316",
    message: "আপনার পোস্টে লাইক দিয়েছেন",
    post_id: "post_1",
    read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    user_id: "current_user",
    type: "comment",
    from_user_name: "মিজানুর রহমান",
    from_user_avatar: "https://ui-avatars.com/api/?name=Mizan",
    message: "আপনার পোস্টে মন্তব্য করেছেন",
    post_id: "post_2",
    read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "3",
    user_id: "current_user",
    type: "gift",
    from_user_name: "শাহিনা আক্তার",
    from_user_avatar: "https://ui-avatars.com/api/?name=Shahina",
    message: "আপনাকে একটি গিফট পাঠিয়েছেন",
    read: true,
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
];