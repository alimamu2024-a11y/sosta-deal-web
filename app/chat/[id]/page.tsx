// app/chat/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Send, Image, Mic, Smile, MoreVertical } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
}

// ডামি ইউজার ডাটা
const dummyUser = {
  id: "current_user",
  email: "user@example.com",
  name: "বর্তমান ইউজার",
  avatar: "https://ui-avatars.com/api/?name=User&background=F97316",
  isSeller: false,
};

export default function ChatDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", senderId: "seller", text: "হ্যালো! কীভাবে সাহায্য করতে পারি?", time: "১০:৩০ AM" },
    { id: "2", senderId: dummyUser.id, text: "পণ্যটি কি স্টকে আছে?", time: "১০:৩২ AM" },
    { id: "3", senderId: "seller", text: "হ্যাঁ, স্টকে আছে। আজই অর্ডার করলে ১০% ছাড় পাবেন।", time: "১০:৩৩ AM" },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: dummyUser.id,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  const conversationId = typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 border-b flex items-center gap-3 shadow-sm">
        <button onClick={() => router.back()} className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
            S
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">সাপোর্ট টিম</h3>
            <p className="text-[10px] text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> অনলাইন
            </p>
          </div>
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.senderId === dummyUser.id;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  isMe
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-orange-100" : "text-gray-400"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white/90 backdrop-blur-sm border-t flex items-center gap-2">
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
          <Smile size={20} />
        </button>
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
          <Image size={20} />
        </button>
        <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition">
          <Mic size={20} />
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="মেসেজ লিখুন..."
          className="flex-1 border-0 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={handleSend}
          disabled={!newMessage.trim()}
          className="p-2.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white disabled:opacity-50 shadow-md"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}