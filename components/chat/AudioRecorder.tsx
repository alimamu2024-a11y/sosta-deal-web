// components/chat/AudioRecorder.tsx
"use client";

import { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface AudioRecorderProps {
  onAudioReady: (audioFile: File) => void;
  isUploading?: boolean;
}

export default function AudioRecorder({ onAudioReady, isUploading }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const audioFile = new File([audioBlob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });
        onAudioReady(audioFile);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Microphone access denied:', error);
      alert('মাইক্রোফোন অ্যাক্সেস প্রয়োজন!');
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
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative">
      {isRecording ? (
        <button
          onClick={stopRecording}
          className="p-2 rounded-full bg-red-500 text-white animate-pulse"
        >
          <Square size={18} />
        </button>
      ) : (
        <button
          onClick={startRecording}
          disabled={isUploading}
          className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 transition"
        >
          {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Mic size={18} />}
        </button>
      )}
      {isRecording && (
        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full whitespace-nowrap">
          🎙️ {formatTime(recordingTime)}
        </span>
      )}
    </div>
  );
}