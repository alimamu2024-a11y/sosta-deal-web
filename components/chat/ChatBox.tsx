"use client";

import { useEffect, useRef, useState } from "react";
import { Message } from "@/types/chat";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface ChatBoxProps {
  conversationId: string;
  userId: string;
  messages: Message[];
  onSendMessage: (text: string, imageFile?: File, audioFile?: File) => Promise<void>;
  onLoadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
}

export default function ChatBox({
  conversationId,
  userId,
  messages,
  onSendMessage,
  onLoadMore,
  hasMore,
  isLoading,
}: ChatBoxProps) {
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isAtTop, setIsAtTop] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const handleScroll = () => {
      if (container.scrollTop === 0 && hasMore && !isLoading) {
        setIsAtTop(true);
        onLoadMore();
      }
    };
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [hasMore, isLoading, onLoadMore]);

  useEffect(() => {
    if (isAtTop && containerRef.current && messages.length > 0) {
      const prevHeight = containerRef.current.scrollHeight;
      setTimeout(() => {
        if (containerRef.current) {
          const newHeight = containerRef.current.scrollHeight;
          containerRef.current.scrollTop = newHeight - prevHeight;
        }
        setIsAtTop(false);
      }, 100);
    }
  }, [messages, isAtTop]);

  const handleSend = async (text: string, imageFile?: File, audioFile?: File) => {
    setIsSending(true);
    await onSendMessage(text, imageFile, audioFile);
    setIsSending(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-2">
        {isLoading && (
          <div className="text-center py-2">
            <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-orange-500 border-t-transparent" />
          </div>
        )}
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} isOwn={msg.sender_id === userId} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={handleSend} isSending={isSending} />
    </div>
  );
}