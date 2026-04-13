// components/chat/UnifiedChat.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { Send, Mic, Square, Image as ImageIcon, X } from 'lucide-react';

export default function UnifiedChat({ roomId }: { roomId: string }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    // মক মেসেজ লোড
    setMessages([
      { id: 1, sender: 'seller', text: 'হ্যালো, পণ্যটি দেখেছেন?', time: '১০:৩০ AM' },
      { id: 2, sender: 'buyer', text: 'হ্যাঁ, দাম কি একটু কমবে?', time: '১০:৩২ AM' },
      { id: 3, sender: 'seller', text: 'আপনি কত দাম দিতে চান?', time: '১০:৩৩ AM' },
    ]);
    scrollToBottom();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'buyer', text: newMessage, time: new Date().toLocaleTimeString() }]);
    setNewMessage('');
    scrollToBottom();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        setMessages(prev => [...prev, { id: Date.now(), sender: 'buyer', text: '🎤 ভয়েস মেসেজ', audio: audioUrl, time: new Date().toLocaleTimeString() }]);
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setIsRecording(true);
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 10000);
    } catch (err) {
      alert('মাইক্রোফোন পারমিশন প্রয়োজন');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'buyer' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] p-3 rounded-2xl ${msg.sender === 'buyer' ? 'bg-orange-500 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-sm'}`}>
              {msg.audio ? (
                <audio src={msg.audio} controls className="h-8 w-40" />
              ) : (
                <p className="text-sm">{msg.text}</p>
              )}
              <p className={`text-[10px] mt-1 ${msg.sender === 'buyer' ? 'text-orange-200' : 'text-gray-400'}`}>{msg.time}</p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="bg-white border-t p-3 flex gap-2 items-center">
        <button className="p-2 text-gray-500"><ImageIcon size={20} /></button>
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`p-2 rounded-full ${isRecording ? 'bg-red-500 text-white' : 'text-gray-500'}`}
        >
          {isRecording ? <Square size={20} /> : <Mic size={20} />}
        </button>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="মেসেজ লিখুন..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none"
        />
        <button onClick={sendMessage} className="bg-orange-500 text-white p-2 rounded-full"><Send size={18} /></button>
      </div>
    </div>
  );
}