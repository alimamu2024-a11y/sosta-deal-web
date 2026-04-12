"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import AudioRecorder from "./AudioRecorder";
import ImageUpload from "./ImageUpload";

interface MessageInputProps {
  onSendMessage: (text: string, imageFile?: File, audioFile?: File) => void;
  isSending?: boolean;
}

export default function MessageInput({ onSendMessage, isSending }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleImageSelected = async (file: File) => {
    setUploadingImage(true);
    await onSendMessage("", file);
    setUploadingImage(false);
  };

  const handleAudioReady = async (file: File) => {
    setUploadingAudio(true);
    await onSendMessage("", undefined, file);
    setUploadingAudio(false);
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white border-t">
      <ImageUpload onImageSelected={handleImageSelected} isUploading={uploadingImage} />
      <AudioRecorder onAudioReady={handleAudioReady} isUploading={uploadingAudio} />
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="মেসেজ লিখুন..."
        className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
        disabled={isSending}
      />
      <button
        onClick={handleSend}
        disabled={!message.trim() || isSending}
        className="p-2 rounded-full bg-orange-500 text-white disabled:opacity-50"
      >
        <Send size={18} />
      </button>
    </div>
  );
}