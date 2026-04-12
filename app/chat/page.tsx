"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Image, Mic, Smile, MoreVertical, ArrowLeft, Camera, GalleryHorizontal } from "lucide-react";
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

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "seller", text: "হ্যালো! কীভাবে সাহায্য করতে পারি?", time: "১০:৩০ AM", type: "text" },
    { id: "2", sender: "buyer", text: "পণ্যটি কি স্টকে আছে?", time: "১০:৩২ AM", type: "text" },
    { id: "3", sender: "seller", text: "হ্যাঁ, স্টকে আছে। আজই অর্ডার করলে ১০% ছাড় পাবেন।", time: "১০:৩৩ AM", type: "text" },
  ]);
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // অটো স্ক্রল টু বটম
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  };

  // ইমেজ হ্যান্ডলার
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
      setMessages((prev) => [...prev, newMsg]);
    };
    reader.readAsDataURL(file);
    setShowMediaOptions(false);
  };

  // ভয়েস মেসেজ লজিক (সংক্ষিপ্ত)
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
          time: "সদ্য",
          type: "audio",
        };
        setMessages(p => [...p, newMsg]);
      };
      mediaRecorder.start();
      setIsRecording(true);
      timerRef.current = setInterval(() => setRecordingTime(p => p + 1), 1000);
    } catch (err) { alert("মাইক্রোফোন পারমিশন দিন"); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    clearInterval(timerRef.current!);
    setRecordingTime(0);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#f0f2f5] overflow-hidden">
      {/* Header - Fixed */}
      <header className="bg-white px-4 py-2 border-b flex items-center gap-3 shadow-sm z-20 shrink-0">
        <button onClick={() => router.back()} className="p-1.5 rounded-full active:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shadow-inner relative">
            S
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm text-gray-800 leading-tight">সাপোর্ট টিম</h3>
            <p className="text-[11px] text-green-600 font-medium">অনলাইন</p>
          </div>
        </div>
        <MoreVertical size={20} className="text-gray-400" />
      </header>

      {/* Message Area - Scrollable */}
      <main className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-contain">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-1`}>
              {!isMe && <div className="w-6 h-6 rounded-full bg-gray-300 text-[10px] flex items-center justify-center shrink-0 mb-1">S</div>}
              <div className={`max-w-[75%] px-3 py-2 shadow-sm relative ${
                isMe ? "bg-[#f85606] text-white rounded-2xl rounded-tr-none" 
                     : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-100"
              }`}>
                {msg.type === "image" && <img src={msg.imageUrl} className="rounded-lg mb-1 max-h-60 w-full object-cover" alt="upload" />}
                {msg.type === "audio" && <audio controls src={msg.audioUrl} className="w-48 h-8 scale-90 origin-left" />}
                <p className="text-[13px] leading-snug">{msg.text}</p>
                <span className={`text-[9px] block text-right mt-1 opacity-70`}>{msg.time}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area - Fixed at bottom */}
      <footer className="bg-white p-2 pb-safe border-t shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-20">
        <div className="flex items-center gap-1.5 max-w-4xl mx-auto">
          <div className="flex items-center bg-gray-100 rounded-2xl px-2 flex-1 border border-transparent focus-within:border-orange-200 transition-all">
            <button className="p-2 text-gray-500" onClick={() => setShowMediaOptions(!showMediaOptions)}>
              <Camera size={20} />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendText()}
              placeholder="মেসেজ লিখুন..."
              className="flex-1 bg-transparent border-none py-2.5 text-sm outline-none placeholder:text-gray-400"
            />
            <button className="p-2 text-gray-500">
              <Smile size={20} />
            </button>
          </div>

          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`p-3 rounded-full transition-all ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 text-gray-600 active:scale-90"}`}
          >
            <Mic size={20} />
          </button>

          <button
            onClick={handleSendText}
            disabled={!newMessage.trim()}
            className="p-3 rounded-full bg-[#f85606] text-white shadow-md active:scale-95 disabled:opacity-50 disabled:grayscale transition-all"
          >
            <Send size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Media Popup */}
        {showMediaOptions && (
          <div className="absolute bottom-16 left-4 bg-white rounded-2xl shadow-xl border p-2 flex gap-4 animate-in fade-in slide-in-from-bottom-2">
            <button onClick={() => galleryInputRef.current?.click()} className="flex flex-col items-center gap-1 p-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"><GalleryHorizontal size={20}/></div>
              <span className="text-[10px]">গ্যালারি</span>
            </button>
            <input type="file" ref={galleryInputRef} hidden accept="image/*" onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])} />
          </div>
        )}
      </footer>
    </div>
  );
}