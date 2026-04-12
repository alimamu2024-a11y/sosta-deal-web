"use client";

import Link from "next/link";
import { Conversation, Platform } from "@/types/chat";
import { formatDistanceToNow } from "date-fns";
import { bn } from "date-fns/locale";
import { useState } from "react";

interface ChatListProps {
  conversations: Conversation[];
  selectedPlatform?: Platform | 'all';
  onPlatformChange?: (platform: Platform | 'all') => void;
}

const platformLabels: Record<Platform, string> = {
  marketplace: "বাজার",
  tuni_mall: "টুনি মল",
  gramer_haat: "গ্রামের হাট",
  social: "সোশ্যাল",
};

export default function ChatList({ conversations = [], selectedPlatform = 'all', onPlatformChange }: ChatListProps) {
  const filtered = selectedPlatform === 'all' 
    ? conversations 
    : conversations.filter(c => c.platform === selectedPlatform);

  if (filtered.length === 0) {
    return <div className="p-8 text-center text-gray-500">কোনো কনভার্সেশন নেই।</div>;
  }

  return (
    <div>
      {/* Platform Filter Tabs */}
      {onPlatformChange && (
        <div className="flex gap-2 p-2 border-b overflow-x-auto">
          {(['all', 'marketplace', 'tuni_mall', 'gramer_haat', 'social'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onPlatformChange(p)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedPlatform === p ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {p === 'all' ? 'সব' : platformLabels[p]}
            </button>
          ))}
        </div>
      )}
      <div className="divide-y">
        {filtered.map((conv) => (
          <Link href={`/chat/${conv.id}?platform=${conv.platform}`} key={conv.id} className="block p-4 hover:bg-gray-50 transition">
            <div className="flex items-center gap-3">
              <img
                src={conv.otherParticipant?.avatar || "https://ui-avatars.com/api/?name=User"}
                className="w-12 h-12 rounded-full object-cover"
                alt="avatar"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-semibold text-gray-800">{conv.otherParticipant?.name || "ইউজার"}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {platformLabels[conv.platform]}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{conv.last_message || "কথা শুরু করুন"}</p>
                <p className="text-xs text-gray-400">
                  {conv.last_message_time &&
                    formatDistanceToNow(new Date(conv.last_message_time), { addSuffix: true, locale: bn })}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}