// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isSeller: boolean;
  phone?: string;
  joinDate?: string;
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
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("sosta_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    
    const newUser: User = {
      id: "1",
      name: email.split("@")[0],
      email: email,
      avatar: `https://ui-avatars.com/api/?name=${email.split("@")[0]}&background=FF5722&color=fff`,
      isSeller: false,
      joinDate: new Date().toLocaleDateString(),
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
      avatar: `https://ui-avatars.com/api/?name=${name}&background=FF5722&color=fff`,
      isSeller: false,
      joinDate: new Date().toLocaleDateString(),
    };
    
    setUser(newUser);
    localStorage.setItem("sosta_user", JSON.stringify(newUser));
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("sosta_user");
    setUser(null);
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