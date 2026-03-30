"use client";
import React, { useState, useRef, useEffect } from 'react';
import {
  X, Video, Trash2, CheckCircle, MapPin, 
  ChevronDown, Camera, Info, List, AlertTriangle, Navigation,
  Mic, Square, Volume2, CheckCircle2
} from 'lucide-react';

const PostAdForm = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showCategoryDrawer, setShowCategoryDrawer] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("ক্যাটাগরি নির্বাচন করুন");
  const [location, setLocation] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // --- ভয়েস রেকর্ডিং লজিক ---
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
        setAudioURL(URL.createObjectURL(blob));
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("মাইক্রোফোন পারমিশন দিন!");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };
  // --- ভয়েস রেকর্ডিং লজিক শেষ ---

  // 🔥 ইমেজ অটোমেটিক ২০০ কেবি করার লজিক
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800; 
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * (MAX_WIDTH / img.width);
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
          // কোয়ালিটি ০.৪ দিলে ৫ এমবি ফাইল ২০০ কেবি-র নিচে চলে আসে
          resolve(canvas.toDataURL('image/jpeg', 0.4));
        };
      };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (selectedImages.length + files.length > 6) return alert("সর্বোচ্চ ৬টি ছবি!");
    setIsCompressing(true);
    const results = await Promise.all(files.map(file => compressImage(file)));
    setSelectedImages(prev => [...prev, ...results]);
    setIsCompressing(false);
  };

  // 🔥 ভিডিও ১০ সেকেন্ড লিমিট লজিক
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        if (video.duration > 10.5) { // ১০ সেকেন্ডের বেশি হলে
          alert("দুঃখিত! ভিডিওটি অবশ্যই ১০ সেকেন্ডের কম হতে হবে।");
          e.target.value = ""; 
          return;
        }
        setVideoPreview(URL.createObjectURL(file));
      };
      video.src = URL.createObjectURL(file);
    }
  };

  const handlePublish = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000); // ৩ সেকেন্ড পর বন্ধ হবে
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-[3000] flex items-end justify-center backdrop-blur-sm" onClick={onClose}>
      <div className="w-full bg-white rounded-t-[45px] p-6 h-[95%] overflow-y-auto no-scrollbar relative animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
        
        {/* হেডার */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="text-gray-400 font-bold flex items-center gap-1 active:scale-90 transition-transform"><X size={20} /> বন্ধ করুন</button>
          <div className="text-center">
            <h2 className="text-xl font-black text-[#f85606] italic">বিজ্ঞাপন দিন</h2>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Sosta Deal Premium</p>
          </div>
          <Info size={22} className="text-orange-200" />
        </div>

        {/* মিডিয়া সেকশন */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-3 overflow-x-auto no-scrollbar py-2">
            {selectedImages.map((img, i) => (
              <div key={i} className="relative min-w-[90px] h-[90px] rounded-[25px] overflow-hidden border border-gray-100 shadow-sm">
                <img src={img} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedImages(prev => prev.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-red-500 p-1.5 rounded-full text-white"><Trash2 size={12} /></button>
              </div>
            ))}
            {selectedImages.length < 6 && (
              <label className="min-w-[90px] h-[90px] border-2 border-dashed border-orange-200 rounded-[25px] flex flex-col items-center justify-center bg-orange-50/10 cursor-pointer active:scale-95">
                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                <Camera size={26} className="text-orange-400" />
                <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase">ছবি দিন</span>
              </label>
            )}
            {!videoPreview && (
              <label className="min-w-[90px] h-[90px] border-2 border-dashed border-sky-200 rounded-[25px] flex flex-col items-center justify-center bg-sky-50/10 cursor-pointer active:scale-95">
                <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                <Video size={26} className="text-sky-400" />
                <span className="text-[10px] font-bold text-sky-400 mt-1 uppercase italic">১০ সেকেন্ড</span>
              </label>
            )}
          </div>
          {videoPreview && (
            <div className="relative h-40 rounded-[30px] overflow-hidden border shadow-inner">
              <video src={videoPreview} className="w-full h-full object-cover" autoPlay muted loop />
              <button onClick={() => setVideoPreview(null)} className="absolute top-3 right-3 bg-red-500 p-2 rounded-full text-white"><Trash2 size={16} /></button>
            </div>
          )}
          {/* ২. অডিও রেকর্ড বাটন (নতুন যোগ করা হয়েছে) */}
<button 
  onMouseDown={startRecording} 
  onMouseUp={stopRecording}
  onTouchStart={startRecording} 
  onTouchEnd={stopRecording}
  className={`flex-shrink-0 w-24 h-24 border-2 border-dashed rounded-[25px] flex flex-col items-center justify-center transition-all ${isRecording ? 'border-red-500 bg-red-50' : 'border-purple-200 bg-purple-50/30'}`}
>
  <div className={`p-2 rounded-xl shadow-sm mb-2 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-purple-600'}`}>
    {/* Mic আইকন ইমপোর্ট করা না থাকলে lucide-react থেকে Mic ইমপোর্ট করুন */}
    <Mic size={24} strokeWidth={2.5} />
  </div>
  <span className={`text-[10px] font-black ${isRecording ? 'text-red-600' : 'text-purple-600'}`}>
    {isRecording ? "রেকর্ড হচ্ছে..." : "ভয়েস দিন"}
  </span >
</button>

{/* অডিও প্রিভিউ (রেকর্ড শেষ হলে এখানে দেখাবে) */}
{audioURL && (
  <div className="mx-4 mt-2 p-3 bg-slate-50 border rounded-2xl flex items-center justify-between animate-in slide-in-from-top-2">
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span className="text-[10px] font-bold text-slate-500 uppercase">অডিও রেকর্ড হয়েছে</span>
    </div>
    <audio src={audioURL} controls className="h-8 w-32 scale-90" />
    <button onClick={() => setAudioURL(null)} className="text-red-400 p-1">
      {/* Trash2 আইকন ইমপোর্ট করা না থাকলে lucide-react থেকে Trash2 ইমপোর্ট করুন */}
      <Trash2 size={16} />
    </button>
  </div>
)}
        </div>

        {/* ইনপুট ফিল্ডস */}
        <div className="space-y-4 mb-8">
          <button onClick={() => setShowCategoryDrawer(true)} className="w-full bg-gray-50 p-5 rounded-[22px] flex justify-between items-center text-sm font-bold text-gray-600 shadow-sm active:bg-orange-50 transition-colors">
            <span className="flex items-center gap-3"><List size={18} className="text-[#f85606]" /> {selectedCategory}</span>
            <ChevronDown size={18} />
          </button>
          
          <input type="text" placeholder="পণ্যের নাম *" className="w-full bg-gray-50 p-5 rounded-[22px] text-sm font-bold outline-none shadow-sm focus:bg-white" />
          
          <textarea rows={3} placeholder="বিস্তারিত বিবরণ *" className="w-full bg-gray-50 p-5 rounded-[22px] text-sm font-bold outline-none shadow-sm resize-none" />

          <div className="grid grid-cols-2 gap-3">
            <input type="number" placeholder="দাম (৳) *" className="bg-gray-50 p-5 rounded-[22px] text-sm font-bold outline-none shadow-sm" />
            <input type="tel" placeholder="মোবাইল নম্বর *" className="bg-gray-50 p-5 rounded-[22px] text-sm font-bold outline-none shadow-sm" />
          </div>

          <input 
            type="text" 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="লোকেশন হাতে লিখুন *" 
            className="w-full bg-gray-50 p-5 rounded-[22px] text-sm font-bold outline-none shadow-sm" 
          />
        </div>

        {/* শর্তাবলী ও নিরাপত্তা বক্স */}
        <div className="space-y-4 mb-6">
          <label className="flex items-center justify-center gap-3 cursor-pointer">
            <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="w-5 h-5 accent-[#f85606] rounded-md" />
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-tighter italic">আমি সকল নিয়ম ও শর্ত মেনে নিচ্ছি</span>
          </label>

          <div className="bg-orange-50 border border-orange-100 p-5 rounded-[30px] flex gap-4 items-start">
            <AlertTriangle size={20} className="text-orange-500 mt-1" />
            <div>
              <h4 className="text-[12px] font-black text-gray-800 uppercase tracking-tighter">নিরাপত্তা সতর্কতা</h4>
              <p className="text-[10px] font-bold text-gray-500 leading-relaxed italic">লেনদেনের আগে পণ্য যাচাই করুন। SostaDeal-এ অগ্রিম টাকা দেওয়া থেকে বিরত থাকুন।</p>
            </div>
          </div>
        </div>

        {/* পাবলিশ বাটন (সবার নিচে) */}
        <div className="pb-10">
          <button 
            onClick={handlePublish}
            disabled={!termsAccepted || isCompressing}
            className={`w-full py-5 rounded-[28px] font-black text-lg uppercase tracking-wider flex items-center justify-center gap-3 transition-all ${termsAccepted ? 'bg-[#f85606] text-white shadow-[0_10px_30px_rgba(248,86,6,0.3)] active:scale-95' : 'bg-gray-100 text-gray-300'}`}
          >
            <CheckCircle size={24} /> {isCompressing ? 'ছবি প্রসেসিং হচ্ছে...' : 'বিজ্ঞাপন প্রকাশ করুন'}
          </button>
        </div>

        {/* সাকসেস পপ-আপ (গ্রীন কালার) */}
        {showSuccess && (
          <div className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[40px] p-8 w-full max-w-sm text-center shadow-2xl scale-in-center animate-in zoom-in duration-300">
              <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={45} />
              </div>
              <h3 className="text-xl font-black text-gray-800 mb-2">অভিনন্দন!</h3>
              <p className="text-gray-500 font-bold text-sm leading-relaxed mb-6">আপনার বিজ্ঞাপনটি সফলভাবে পাবলিশ হয়েছে। কিছুক্ষণের মধ্যেই এটি লাইভ হবে।</p>
              <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-progress"></div>
              </div>
            </div>
          </div>
        )}

        {/* ক্যাটাগরি ড্রয়ার */}
        {showCategoryDrawer && (
          <div className="fixed inset-0 bg-black/50 z-[4000] flex items-end" onClick={() => setShowCategoryDrawer(false)}>
            <div className="w-full bg-white rounded-t-[40px] p-8 h-[60%] animate-in slide-in-from-bottom" onClick={e => e.stopPropagation()}>
              <div className="w-12 h-1 bg-gray-200 rounded-full mx-auto mb-8" />
              <div className="space-y-2 overflow-y-auto h-[85%] no-scrollbar">
                {["মোবাইল", "বাইক", "ল্যান্ড/জমি", "ইলেক্ট্রনিক্স", "ফ্যাশন", "চাকরি", "অন্যান্য"].map(c => (
                  <button key={c} onClick={() => {setSelectedCategory(c); setShowCategoryDrawer(false);}} className="w-full text-left p-5 bg-gray-50 rounded-2xl font-bold text-gray-700 active:bg-orange-50 transition-colors">{c}</button>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress {
          animation: progress 3s linear forwards;
        }
      `}</style>
    </div>
  );
};

export default PostAdForm;