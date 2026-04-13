// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isSeller: boolean;
  joinDate?: string;
  points?: number;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  becomeSeller: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // ডেমো ইউজার (ইনভেস্টরদের জন্য – সব ফিচার দেখতে পাবে)
  const demoUser: User = {
    id: "demo_investor_123",
    name: "ডেমো ইউজার",
    email: "demo@sostadeal.com",
    avatar: "https://ui-avatars.com/api/?name=Demo&background=F97316&color=fff&bold=true",
    isSeller: true,
    joinDate: new Date().toLocaleDateString(),
    points: 5000,
  };

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ডেমো ইউজার অটো লগইন (ইনভেস্টরদের জন্য – কোনো লগইন লাগবে না)
    const storedUser = localStorage.getItem("sosta_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      localStorage.setItem("sosta_user", JSON.stringify(demoUser));
      setUser(demoUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const newUser: User = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=F97316&color=fff`,
      isSeller: false,
      joinDate: new Date().toLocaleDateString(),
      points: 500,
    };
    setUser(newUser);
    localStorage.setItem("sosta_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    const newUser: User = {
      id: Date.now().toString(),
      name: name,
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${name}&background=F97316&color=fff`,
      isSeller: false,
      joinDate: new Date().toLocaleDateString(),
      points: 500,
    };
    setUser(newUser);
    localStorage.setItem("sosta_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("sosta_user");
    // লগআউট করলে আবার ডেমো ইউজার সেট করুন
    localStorage.setItem("sosta_user", JSON.stringify(demoUser));
    setUser(demoUser);
  };

  const becomeSeller = () => {
    if (user) {
      const updatedUser = { ...user, isSeller: true };
      setUser(updatedUser);
      localStorage.setItem("sosta_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, becomeSeller }}>
      {children}
    </AuthContext.Provider>
  );
};