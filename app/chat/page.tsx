"use client";

import { useState, useEffect, useRef } from "react";
import { 
  Send, Image, Mic, Smile, MoreVertical, ArrowLeft, 
  Camera, GalleryHorizontal, X, Check, Clock, 
  Phone, Video, Paperclip, Download, Volume2, 
  Heart, Share2, Copy, Sparkles, ShieldCheck, BadgeCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  type: "text" | "image" | "audio";
  imageUrl?: string;
  audioUrl?: string;
  isRead?: boolean;
  isDelivered?: boolean;
}

// ইমোজি লিস্ট
const EMOJIS = ["😀", "😂", "❤️", "👍", "😢", "😡", "🎉", "🙏", "🔥", "🥰", "😍", "🥺", "😎", "🤣", "😭", "🤔", "😇", "🥳", "😱", "💀"];

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "seller", text: "হ্যালো! 👋 কীভাবে সাহায্য করতে পারি?", time: "১০:৩০ AM", type: "text", isDelivered: true, isRead: true },
    { id: "2", sender: "buyer", text: "পণ্যটি কি স্টকে আছে? 🤔", time: "১০:৩২ AM", type: "text", isDelivered: true, isRead: true },
    { id: "3", sender: "seller", text: "হ্যাঁ, স্টকে আছে! আজই অর্ডার করলে ১০% ছাড় পাবেন 🎉", time: "১০:৩৩ AM", type: "text", isDelivered: true, isRead: false },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId] = useState("buyer");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // টাইপিং ইফেক্ট
  useEffect(() => {
    const timer = setTimeout(() => setIsTyping(false), 1000);
    return () => clearTimeout(timer);
  }, [newMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ক্লিক আউটসাইড
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (mediaOptionsRef.current && !mediaOptionsRef.current.contains(event.target as Node)) {
        setShowMediaOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const mediaOptionsRef = useRef<HTMLDivElement>(null);

  const handleSendText = () => {
    if (!newMessage.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: currentUserId,
      text: newMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
      isDelivered: false,
      isRead: false,
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
    inputRef.current?.focus();
    
    // সিমুলেট ডেলিভারি
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMsg.id ? { ...msg, isDelivered: true } : msg
      ));
    }, 500);
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
        isDelivered: false,
        isRead: false,
      };
      setMessages((prev) => [...prev, newMsg]);
      scrollToBottom();
    };
    reader.readAsDataURL(file);
    setShowMediaOptions(false);
  };

  const addEmoji = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const newMsg: Message = {
          id: Date.now().toString(),
          sender: currentUserId,
          text: "🎤 ভয়েস মেসেজ",
          audioUrl: URL.createObjectURL(audioBlob),
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "audio",
          isDelivered: false,
          isRead: false,
        };
        setMessages(p => [...p, newMsg]);
        scrollToBottom();
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) { 
      alert("মাইক্রোফোন অ্যাক্সেস প্রয়োজন!"); 
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setRecordingTime(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 overflow-hidden">
      
      {/* Premium Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b px-4 py-3 flex items-center gap-3 shadow-lg z-20 shrink-0">
        <button 
          onClick={() => router.back()} 
          className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all hover:bg-gray-200"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        
        <div className="flex items-center gap-3 flex-1">
          <div className="relative">
            <div className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold shadow-md">
              S
            </div>
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-1">
              সাপোর্ট টিম
              <BadgeCheck size={14} className="text-blue-500" />
            </h3>
            <p className="text-[11px] text-green-600 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
              অনলাইন • সাধারণত ১ মিনিটের মধ্যে সাড়া দেয়
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95">
            <Phone size={18} className="text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95">
            <Video size={18} className="text-gray-600" />
          </button>
          <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95">
            <MoreVertical size={18} className="text-gray-600" />
          </button>
        </div>
      </header>

      {/* Chat Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, idx) => {
            const isMe = msg.sender === currentUserId;
            const showAvatar = !isMe && (idx === 0 || messages[idx-1]?.sender !== msg.sender);
            
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
              >
                {!isMe && showAvatar && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow-md shrink-0">
                    S
                  </div>
                )}
                {!isMe && !showAvatar && <div className="w-8 shrink-0" />}
                
                <div className={`relative max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                    isMe 
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-br-sm" 
                      : "bg-white text-gray-800 rounded-bl-sm border border-gray-100"
                  }`}>
                    {msg.type === "image" && msg.imageUrl && (
                      <img 
                        src={msg.imageUrl} 
                        className="rounded-xl mb-1 max-h-56 w-full object-cover cursor-pointer" 
                        alt="shared"
                        onClick={() => window.open(msg.imageUrl)}
                      />
                    )}
                    {msg.type === "audio" && msg.audioUrl && (
                      <audio controls src={msg.audioUrl} className="w-52 h-8" />
                    )}
                    {msg.type === "text" && (
                      <p className="text-sm leading-relaxed break-words">{msg.text}</p>
                    )}
                    <div className={`flex items-center justify-end gap-1 mt-1`}>
                      <span className={`text-[9px] ${isMe ? "text-orange-100" : "text-gray-400"}`}>
                        {msg.time}
                      </span>
                      {isMe && (
                        <>
                          {msg.isDelivered ? (
                            <div className="flex items-center gap-0.5">
                              <Check size={10} className="text-orange-200" />
                              <Check size={10} className="text-orange-200 -ml-1" />
                            </div>
                          ) : (
                            <Clock size={10} className="text-orange-300" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {/* টাইপিং ইন্ডিকেটর */}
        {isTyping && (
          <div className="flex justify-start items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white text-xs font-bold">S</div>
            <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Premium Input Area */}
      <footer className="bg-white/95 backdrop-blur-md border-t p-3 shadow-2xl z-20">
        <div className="flex items-center gap-2 max-w-5xl mx-auto">
          {/* ইমোজি বাটন */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all hover:bg-gray-200"
            >
              <Smile size={20} className="text-gray-600" />
            </button>
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  ref={emojiPickerRef}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border p-3 z-30 w-72"
                >
                  <div className="grid grid-cols-8 gap-2">
                    {EMOJIS.map(emoji => (
                      <button
                        key={emoji}
                        onClick={() => addEmoji(emoji)}
                        className="text-2xl p-1.5 hover:bg-gray-100 rounded-lg transition"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* মিডিয়া বাটন */}
          <div className="relative">
            <button
              onClick={() => setShowMediaOptions(!showMediaOptions)}
              className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-all hover:bg-gray-200"
            >
              <Image size={20} className="text-gray-600" />
            </button>
            <AnimatePresence>
              {showMediaOptions && (
                <motion.div
                  ref={mediaOptionsRef}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border p-2 z-30 flex gap-2"
                >
                  <button
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <GalleryHorizontal size={20} className="text-blue-600" />
                    </div>
                    <span className="text-[10px] text-gray-600">গ্যালারি</span>
                  </button>
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-gray-50 transition"
                  >
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <Camera size={20} className="text-orange-600" />
                    </div>
                    <span className="text-[10px] text-gray-600">ক্যামেরা</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ইনপুট ফিল্ড */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={newMessage}
              onChange={(e) => {
                setNewMessage(e.target.value);
                setIsTyping(true);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              placeholder="মেসেজ লিখুন..."
              className="w-full bg-gray-100 border-0 rounded-2xl px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full hover:bg-gray-200 flex items-center justify-center">
              <Paperclip size={16} className="text-gray-400" />
            </button>
          </div>

          {/* ভয়েস / সেন্ড বাটন */}
          {newMessage.trim() ? (
            <button
              onClick={handleSendText}
              className="w-11 h-11 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md active:scale-95 transition-all flex items-center justify-center"
            >
              <Send size={18} />
            </button>
          ) : (
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`w-11 h-11 rounded-full transition-all flex items-center justify-center ${
                isRecording 
                  ? "bg-red-500 text-white animate-pulse shadow-lg" 
                  : "bg-gray-100 text-gray-600 active:scale-95"
              }`}
            >
              <Mic size={18} />
            </button>
          )}
        </div>

        {/* রেকর্ডিং ইন্ডিকেটর */}
        <AnimatePresence>
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center justify-center gap-3 mt-2"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
              <span className="text-xs text-red-500 font-medium">রেকর্ডিং... {formatTime(recordingTime)}</span>
              <span className="text-xs text-gray-400">ছাড়ার সময় স্টপ হবে</span>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>

      {/* হিডেন ইনপুট ফাইল */}
      <input
        type="file"
        ref={galleryInputRef}
        hidden
        accept="image/*"
        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
      />
      <input
        type="file"
        ref={cameraInputRef}
        hidden
        accept="image/*"
        capture="environment"
        onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
      />
    </div>
  );
}