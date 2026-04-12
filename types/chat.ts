export type Platform = 'marketplace' | 'tuni_mall' | 'gramer_haat' | 'social';

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  is_seller: boolean;
};

export type Conversation = {
  id: string;
  platform: Platform;
  platform_item_id?: string;   // যেমন পণ্যের আইডি, পোস্ট আইডি
  participant1: string;
  participant2: string;
  last_message?: string;
  last_message_time: string;
  created_at: string;
  otherParticipant?: User;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  message?: string;
  image_url?: string;
  audio_url?: string;
  is_read: boolean;
  created_at: string;
  sender?: User;
};