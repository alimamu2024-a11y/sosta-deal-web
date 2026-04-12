// app/chat/private/[roomId]/page.tsx
"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MoreVertical } from "lucide-react";
import UnifiedChat from "@/components/chat/UnifiedChat";

export default function PrivateChatPage() {
  const { roomId } = useParams();
  const router = useRouter();
  
  const chatRoomId = typeof roomId === "string" ? roomId : Array.isArray(roomId) ? roomId[0] : "";

  if (!chatRoomId) {
    return <div className="p-10 text-center text-red-500">চ্যাট রুম আইডি পাওয়া যায়নি</div>;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b flex items-center gap-3 shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 transition">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md">💬</div>
          <div>
            <h3 className="font-semibold text-gray-800">প্রাইভেট চ্যাট</h3>
            <p className="text-[10px] text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> সরাসরি
            </p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition"><MoreVertical size={20} className="text-gray-500" /></button>
      </div>
      <div className="flex-1 overflow-hidden">
        <UnifiedChat roomId={chatRoomId} />
      </div>
    </div>
  );
}