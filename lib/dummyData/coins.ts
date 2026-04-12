// lib/dummyData/coins.ts
export interface CoinTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: "earn" | "spend" | "gift_sent" | "gift_received" | "free_monthly";
  description: string;
  created_at: string;
}

const STORAGE_KEY = "sosta_coins";

export const getUserCoins = (userId: string): number => {
  if (typeof window === "undefined") return 0;
  const stored = localStorage.getItem(STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : {};
  return data[userId] || 100; // ডিফল্ট 100 কয়েন
};

export const updateUserCoins = (userId: string, amount: number): void => {
  if (typeof window === "undefined") return;
  const stored = localStorage.getItem(STORAGE_KEY);
  const data = stored ? JSON.parse(stored) : {};
  data[userId] = (data[userId] || 100) + amount;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const deductCoins = (userId: string, amount: number): boolean => {
  const current = getUserCoins(userId);
  if (current < amount) return false;
  updateUserCoins(userId, -amount);
  return true;
};

export const addCoins = (userId: string, amount: number): void => {
  updateUserCoins(userId, amount);
};