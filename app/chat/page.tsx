// app/chat/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Image, Mic, Smile, MoreVertical, Camera, GalleryHorizontal, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  type: "text" | "image" | "audio";
  imageUrl?: string;
  audioUrl?: string;
}

// ডামি মেসেজ জেনারেটর (পেজিনেশনের জন্য)
const generateMockMessages = (page: number, limit: number): Message[] => {
  const total = 50;
  const start = (page - 1) * limit;
  const end = start + limit;
  const messages: Message[] = [];
  for (let i = start; i < Math.min(end, total); i++) {
    messages.push({
      id: `msg_${i}`,
      sender: i % 2 === 0 ? "seller" : "buyer",
      text: `এটি একটি ডামি মেসেজ #${i + 1}`,
      time: new Date(Date.now() - (total - i) * 60000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    });
  }
  return messages;
};

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId] = useState("buyer");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const loadMessages = useCallback(async (pageNum: number) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMessages = generateMockMessages(pageNum, 5);
    if (pageNum === 1) {
      setMessages(newMessages);
    } else {
      setMessages(prev => [...newMessages, ...prev]);
    }
    setHasMore(newMessages.length === 5);
    setLoading(false);
    isLoadingRef.current = false;
  }, []);

  useEffect(() => {
    loadMessages(1);
  }, []);

  const handleScroll = useCallback(() => {
    if (!messagesContainerRef.current) return;
    const { scrollTop } = messagesContainerRef.current;
    if (scrollTop === 0 && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadMessages(nextPage);
    }
  }, [hasMore, loading, page, loadMessages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendText = () => {
    if (!newMessage.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: currentUserId,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      const newMsg: Message = {
        id: Date.now().toString(),
        sender: currentUserId,
        text: "📷 ছবি",
        imageUrl: imgUrl,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        type: "image",
      };
      setMessages(prev => [...prev, newMsg]);
    };
    reader.readAsDataURL(file);
    setShowMediaOptions(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        const newMsg: Message = {
          id: Date.now().toString(),
          sender: currentUserId,
          text: "🎤 ভয়েস মেসেজ",
          audioUrl: audioUrl,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "audio",
        };
        setMessages(prev => [...prev, newMsg]);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone not allowed", err);
      alert("মাইক্রোফোন অ্যাক্সেস প্রয়োজন!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const commonEmojis = ["😀", "😂", "❤️", "👍", "😢", "😡", "🎉", "🙏", "🔥", "🥰"];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* হেডার – ব্যাক বাটন যোগ করা হয়েছে */}
      <div className="bg-white/90 backdrop-blur-md px-4 py-3 border-b flex items-center justify-between shadow-sm sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 transition"
            aria-label="পেছনে যান"
          >
            <ArrowLeft size={22} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-3">
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
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100 transition">
          <MoreVertical size={20} className="text-gray-500" />
        </button>
      </div>

      {/* মেসেজ লিস্ট – পেজিনেশন সহ */}
      <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
        {loading && page > 1 && <div className="text-center text-gray-400 text-xs">পুরোনো মেসেজ লোড হচ্ছে...</div>}
        {messages.map((msg) => {
          const isMe = msg.sender === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} animate-fadeIn`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 shadow-sm ${
                  isMe
                    ? "bg-orange-500 text-white rounded-br-sm"
                    : "bg-white text-gray-800 rounded-bl-sm border border-gray-200"
                }`}
              >
                {msg.type === "image" && msg.imageUrl && (
                  <img
                    src={msg.imageUrl}
                    alt="shared"
                    className="max-w-full rounded-lg max-h-48 cursor-pointer"
                    onClick={() => window.open(msg.imageUrl)}
                  />
                )}
                {msg.type === "audio" && msg.audioUrl && (
                  <audio controls src={msg.audioUrl} className="max-w-full h-8 rounded-full" />
                )}
                {msg.type === "text" && (
                  <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                )}
                <p className={`text-[10px] mt-1 ${isMe ? "text-orange-100" : "text-gray-400"}`}>
                  {msg.time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
        {loading && page === 1 && <div className="text-center text-gray-400 text-xs">লোড হচ্ছে...</div>}
      </div>

      {/* ইনপুট এলাকা */}
      <div className="p-3 bg-white/90 backdrop-blur-sm border-t flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* ইমোজি পিকার */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition"
            >
              <Smile size={22} />
            </button>
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-12 left-0 bg-white rounded-xl shadow-lg p-2 flex gap-2 flex-wrap w-64 border z-20"
              >
                {commonEmojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => addEmoji(emoji)}
                    className="text-2xl p-1 hover:bg-gray-100 rounded transition"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* মিডিয়া বাটন */}
          <div className="relative">
            <button
              onClick={() => setShowMediaOptions(!showMediaOptions)}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition"
            >
              <Image size={22} />
            </button>
            {showMediaOptions && (
              <div className="absolute bottom-12 left-0 bg-white rounded-xl shadow-lg p-2 flex gap-2 z-20 border">
                <button
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  <Camera size={22} className="text-orange-500" />
                  <span className="text-[10px] mt-1">ক্যামেরা</span>
                </button>
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="flex flex-col items-center p-2 hover:bg-gray-100 rounded-lg"
                >
                  <GalleryHorizontal size={22} className="text-blue-500" />
                  <span className="text-[10px] mt-1">গ্যালারি</span>
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={cameraInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
              }}
            />
            <input
              type="file"
              accept="image/*"
              ref={galleryInputRef}
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleImageUpload(e.target.files[0]);
              }}
            />
          </div>

          {/* ভয়েস রেকর্ডার */}
          <div className="relative">
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="p-2 rounded-full bg-red-500 text-white animate-pulse"
              >
                <Mic size={22} />
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 transition"
              >
                <Mic size={22} />
              </button>
            )}
            {isRecording && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-black text-white px-2 py-0.5 rounded-full whitespace-nowrap">
                🎙️ {formatTime(recordingTime)}
              </span>
            )}
          </div>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendText()}
            placeholder="মেসেজ লিখুন..."
            className="flex-1 border-0 bg-gray-100 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
          />
          <button
            onClick={handleSendText}
            disabled={!newMessage.trim()}
            className="p-2.5 rounded-full bg-orange-500 text-white disabled:opacity-50 shadow-md hover:shadow-lg transition"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}