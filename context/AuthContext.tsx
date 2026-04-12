// context/AuthContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { User } from "@supabase/supabase-js";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  becomeSeller: () => Promise<void>;
  isSeller: boolean;
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
  const [isSeller, setIsSeller] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      // চেক করুন ইউজার সেলার কিনা
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_seller")
          .eq("id", user.id)
          .single();
        setIsSeller(profile?.is_seller || false);
      }
      setIsLoading(false);
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_seller")
          .eq("id", session.user.id)
          .single();
        setIsSeller(profile?.is_seller || false);
      } else {
        setIsSeller(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const login = async (email: string) => {
    setIsLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
    setIsLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const becomeSeller = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({ is_seller: true })
      .eq("id", user.id);
    
    if (!error) {
      setIsSeller(true);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, becomeSeller, isSeller }}>
      {children}
    </AuthContext.Provider>
  );
};