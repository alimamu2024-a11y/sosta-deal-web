"use client";

import { Message } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: bn });

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[80%] rounded-2xl p-3 shadow-sm ${isOwn ? "bg-orange-500 text-white" : "bg-white border border-gray-100"}`}>
        {message.message && <p className="text-sm break-words">{message.message}</p>}
        {message.image_url && <img src={message.image_url} alt="Shared" className="mt-2 rounded-lg max-w-full" />}
        {message.audio_url && (
          <audio controls className="mt-2 h-8 max-w-[200px]"><source src={message.audio_url} type="audio/webm" /></audio>
        )}
        <div className={`text-[10px] mt-1 ${isOwn ? "text-orange-200" : "text-gray-400"} text-right`}>{timeAgo}</div>
      </div>
    </div>
  );
}