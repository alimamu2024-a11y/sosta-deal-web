"use client";
import React, { useState, useRef, useEffect } from 'react';
import { 
  Mic, Play, Phone, MapPin, Radio, Volume2, 
  UserCircle2, ChevronLeft, ShoppingBag, Square, Trash2, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

// স্লাইডার এবং লাইভ ভিজ্যুয়ালাইজেশনের জন্য ডেটা
const slides = [
  { id: 1, title: "দেশি মুরগি - জোড়া ৮০০৳", location: "খোকসা হাট", time: "৫ মিনিট আগে", signal: [0.8, 0.4, 0.9, 0.6] },
  { id: 2, title: "তাজা পাবদা মাছ - ৫০০৳/কেজি", location: "কুষ্টিয়া সদর", time: "১০ মিনিট আগে", signal: [0.6, 0.9, 0.3, 0.7] },
  { id: 3, title: "গাভীর খাঁটি দুধ - ৮০৳/লিটার", location: "कुमारখালী", time: "২ মিনিট আগে", signal: [0.9, 0.2, 0.8, 0.5] },
];

const GrammerHaatPage = () => {
  // ১. স্টেট ম্যানেজমেন্ট
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0); // রেকর্ডিং টাইমার
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ২. অটো স্লাইডার লজিক
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000); // ৪ সেকেন্ড পর পর স্লাইড বদলাবে
    return () => clearInterval(timer);
  }, []);

  // ৩. ভয়েস রেকর্ডিং লজিক (৩০ সেকেন্ড লিমিট ও OPUS Codec সহ)
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // ছোট সাইজের জন্য Opus Codec ব্যবহার
      const options = { mimeType: 'audio/webm;codecs=opus' };
      const mediaRecorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      
      setAudioURL(null);
      setRecordingTime(0);

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioURL(URL.createObjectURL(blob));
        clearInterval(timerRef.current!); // টাইমার বন্ধ
      };

      mediaRecorder.start();
      setIsRecording(true);

      // টাইমার এবং ৩০ সেকেন্ড লিমিট লজিক
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= 29) { // ২৯ সেকেন্ডে স্টপ লজিক কল হবে
            stopRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);

    } catch (err) {
      alert("মাইক্রোফোন পারমিশন দিন!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerRef.current!); // টাইমার বন্ধ
    }
  };

  return (
    <div className="bg-[#fcfcfc] min-h-screen pb-32">
      {/* --- হেডার সেকশন --- */}
      <div className="bg-[#f85606] px-5 pt-12 pb-6 rounded-b-[35px] shadow-lg sticky top-0 z-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Link href="/" className="bg-white/20 p-2 rounded-xl text-white">
                <ChevronLeft size={20} />
             </Link>
             <h1 className="text-xl font-[1000] text-white italic tracking-tighter uppercase">গ্রামের হাট</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-red-500 text-white text-[8px] font-black px-2.5 py-1 rounded-full uppercase italic animate-pulse">Live</span>
            <Radio className="text-white/40 animate-pulse" size={20} />
          </div>
        </div>
      </div>

      {/* --- হেডারে নতুন লাইভ স্লাইডার (visualizer সহ) --- */}
      <div className="px-5 mt-4 h-28overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-gray-950 to-gray-800 rounded-[25px] p-5 shadow-2xl border-b-4 border-orange-600 h-full flex items-center justify-between relative overflow-hidden"
          >
            <div className="space-y-1 z-10">
               <span className="bg-[#f85606] text-white text-[8px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest flex items-center gap-1.5 w-fit">
                 <Zap size={10} className="animate-pulse" /> সেরা অফার
               </span>
               <h3 className="text-white text-sm font-[1000] italic uppercase leading-tight mt-1.5">{slides[currentSlide].title}</h3>
               <p className="text-white/60 text-[9px] font-bold uppercase tracking-tighter">{slides[currentSlide].location} • {slides[currentSlide].time}</p>
            </div>
            
            {/* লাইভ অডিও ভিজ্যুয়ালাইজেশন ইফেক্ট */}
            <div className="flex items-end gap-1.5 h-12 w-16 opacity-30 z-0">
               {slides[currentSlide].signal.map((h, i) => (
                 <motion.div
                   key={i}
                   initial={{ height: 5 }}
                   animate={{ height: `${h * 100}%` }}
                   transition={{ duration: 0.2, repeat: Infinity, repeatType: "reverse", delay: i * 0.05 }}
                   className="w-1.5 bg-[#f85606] rounded-full"
                 />
               ))}
            </div>
            
            <ShoppingBag className="absolute -right-5 -bottom-5 text-white/5 w-24 h-24 -rotate-12" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- প্রোডাক্ট ফিড (ইউজারদের ডাক) --- */}
      <div className="px-5 mt-6 space-y-5">
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] px-1 italic">সাম্প্রতিক ডাক (Voices)</p>
        
        {[1, 2, 3].map((i) => (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            key={i} 
            className="bg-white rounded-[35px] p-5 shadow-sm border border-gray-100 relative"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-2xl flex items-center justify-center border border-orange-100">
                  <UserCircle2 size={24} className="text-[#f85606]" />
                </div>
                <div>
                  <h4 className="text-[11px] font-[1000] text-gray-800 uppercase italic leading-none">সোহেল ব্যাপারী</h4>
                  <p className="text-[8px] font-black text-gray-400 flex items-center gap-1 uppercase mt-1">
                    <MapPin size={8} /> কুষ্টিয়া বাজার
                  </p>
                </div>
              </div>
              <a href="tel:017" className="bg-gray-100 text-gray-800 p-2.5 rounded-xl border border-gray-200 active:scale-90 transition-all">
                <Phone size={14} />
              </a>
            </div>

            <div className="bg-gray-50 p-4 rounded-[22px] flex items-center gap-4 border border-gray-100 relative">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#f85606] shadow-sm border border-orange-100 active:scale-90">
                <Play size={16} fill="currentColor" className="ml-0.5" />
              </button>
              <div className="flex-1 space-y-1">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <motion.div animate={{ width: "60%" }} className="h-full bg-[#f85606]"></motion.div>
                </div>
                <div className="flex justify-between text-[8px] font-black text-gray-400 italic">
                  <span>০০:১৫</span>
                  <Volume2 size={10} />
                </div>
              </div>
            </div>

            <p className="text-[10px] font-bold text-gray-500 italic mt-4 px-2 leading-relaxed">
              "ভাই ৫ মন পেঁয়াজ আছে, ভালো দামে ছাড়বো। কথা বলতে নিচের বাটনে চাপ দিন।"
            </p>

            <button className="w-full mt-4 bg-orange-50/50 border border-dashed border-orange-200 py-3 rounded-2xl text-[9px] font-[1000] text-[#f85606] uppercase flex items-center justify-center gap-2 active:bg-orange-100 transition-all">
              <Mic size={12} /> উত্তর দিতে ডাক দিন
            </button>
          </motion.div>
        ))}
      </div>

      {/* --- ফিক্সড ছোট 'ডাক দিন' বাটন --- */}
      <div className="fixed bottom-24 right-5 z-50">
        <button 
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-4 rounded-[22px] shadow-2xl flex items-center gap-2 transition-all active:scale-95 border-b-4 ${
            isRecording ? 'bg-red-500 border-red-800 animate-pulse' : 'bg-gray-900 border-black'
          }`}
        >
           {isRecording ? <Square size={18} className="text-white" /> : <Mic size={18} className="text-[#f85606]" />}
           <span className="text-white font-black uppercase text-[10px] tracking-widest italic">
             {isRecording ? `${30 - recordingTime}s` : 'ডাক দিন'}
           </span>
        </button>
      </div>

      {/* --- অডিও প্রিভিউ এবং ডিলিট (রেকর্ডিং শেষে) --- */}
      <AnimatePresence>
        {audioURL && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-36 left-5 right-5 z-40 bg-white p-3.5 rounded-2xl shadow-2xl border-2 border-[#f85606] flex items-center gap-3"
          >
             <audio src={audioURL} controls className="h-8 flex-1 scale-90 -ml-4" />
             <button 
               onClick={() => setAudioURL(null)}
               className="bg-red-50 text-red-500 p-2.5 rounded-full"
             >
               <Trash2 size={18} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GrammerHaatPage;