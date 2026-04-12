"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Message, Platform, User } from "@/types/chat";

type ChatContextType = {
  messages: Message[];
  sendMessage: (conversationId: string, text: string, imageUrl?: string, audioUrl?: string) => Promise<void>;
  subscribeToConversation: (conversationId: string) => void;
  unsubscribeFromConversation: () => void;
  currentConversation: string | null;
  loading: boolean;
  createOrGetConversation: (platform: Platform, participant2Id: string, platformItemId?: string) => Promise<string | null>;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const channelRef = useRef<any>(null);

  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem("sosta_user");
    if (stored) {
      try {
        return JSON.parse(stored).id;
      } catch { return null; }
    }
    return null;
  };

  // হেল্পার: প্রোফাইলকে User টাইপে কনভার্ট করা
  const profileToUser = (profile: any): User => ({
    id: profile.id,
    email: profile.email || '',  // profiles টেবিলে email না থাকলে খালি
    name: profile.full_name || 'ইউজার',
    avatar: profile.avatar_url || '',
    is_seller: profile.is_seller || false,
  });

  const fetchMessages = async (conversationId: string) => {
    if (!conversationId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`*, sender:profiles!sender_id (id, full_name, avatar_url, email, is_seller)`)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      // কনভার্ট করে সেট করা
      const formatted: Message[] = (data || []).map((msg: any) => ({
        ...msg,
        sender: msg.sender ? profileToUser(msg.sender) : undefined,
      }));
      setMessages(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const subscribeToConversation = (conversationId: string) => {
    if (!conversationId) return;
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    setCurrentConversation(conversationId);
    fetchMessages(conversationId);

    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const newMsg = payload.new as any;
          // সেন্ডারের প্রোফাইল তথ্য fetch
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, full_name, avatar_url, email, is_seller")
            .eq("id", newMsg.sender_id)
            .single();
          
          const fullMessage: Message = {
            ...newMsg,
            sender: profile ? profileToUser(profile) : undefined,
          };
          setMessages((prev) => [...prev, fullMessage]);
        }
      )
      .subscribe();
    channelRef.current = channel;
  };

  const unsubscribeFromConversation = () => {
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setCurrentConversation(null);
    setMessages([]);
  };

  const sendMessage = async (conversationId: string, text: string, imageUrl?: string, audioUrl?: string) => {
    const userId = getUserId();
    if (!userId) return;
    try {
      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: userId,
        message: text || null,
        image_url: imageUrl || null,
        audio_url: audioUrl || null,
        is_read: false,
      });
      // Update last_message in conversations
      await supabase.from("conversations").update({
        last_message: text || (imageUrl ? "📷 ছবি" : "🎵 অডিও"),
        last_message_time: new Date().toISOString(),
      }).eq("id", conversationId);
    } catch (err) {
      console.error(err);
    }
  };

  const createOrGetConversation = async (platform: Platform, participant2Id: string, platformItemId?: string): Promise<string | null> => {
    const userId = getUserId();
    if (!userId) return null;
    try {
      // Check existing
      let query = supabase
        .from("conversations")
        .select("id")
        .eq("platform", platform)
        .or(`participant1.eq.${userId},participant2.eq.${userId}`)
        .or(`participant1.eq.${participant2Id},participant2.eq.${participant2Id}`);
      if (platformItemId) {
        query = query.eq("platform_item_id", platformItemId);
      }
      const { data: existing } = await query.limit(1);
      if (existing && existing.length > 0) return existing[0].id;

      // Create new
      const { data: newConv, error } = await supabase
        .from("conversations")
        .insert({
          platform,
          platform_item_id: platformItemId || null,
          participant1: userId,
          participant2: participant2Id,
          last_message_time: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (error) throw error;
      return newConv.id;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  useEffect(() => {
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [supabase]);

  return (
    <ChatContext.Provider value={{
      messages,
      sendMessage,
      subscribeToConversation,
      unsubscribeFromConversation,
      currentConversation,
      loading,
      createOrGetConversation,
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};