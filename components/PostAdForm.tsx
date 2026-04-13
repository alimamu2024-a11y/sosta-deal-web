// components/PostAdForm.tsx
"use client";
import { useState, useRef, useEffect } from 'react';
import { 
  X, Camera, Mic, Trash2, CheckCircle, AlertTriangle, 
  ChevronDown, Info, Image as ImageIcon, FileVideo, 
  Volume2, Plus, MapPin, Phone, DollarSign, Tag, 
  Clock, Shield, Sparkles, Upload, Loader2, Eye, 
  ShoppingBag, Heart, MessageCircle, Share2 
} from 'lucide-react';
import { compressImage, compressAudio, compressVideo } from '../lib/mediaOptimizer';

interface MediaItem {
  url: string;
  file: File;
}

export default function PostAdForm({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [video, setVideo] = useState<MediaItem | null>(null);
  const [audio, setAudio] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [terms, setTerms] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [showCategory, setShowCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const categories = ['মোবাইল', 'ইলেকট্রনিক্স', 'ফ্যাশন', 'গাড়ি', 'জমি', 'চাকরি', 'গ্রামের হাট', 'পোষ্য', 'হোম এপ্লায়েন্সেস', 'বই', 'খেলনা', 'অন্যান্য'];
  const conditions = ['নতুন (বক্স খোলা)', 'নতুন (সিল করা)', 'ব্যবহৃত (ভালো)', 'ব্যবহৃত (মোটামুটি)', 'পুরাতন'];
  const deliveryOptions = ['হোম ডেলিভারি', 'হাতে হাতে', 'কুরিয়ার সার্ভিস', 'যেকোনো'];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (mediaItems.length + files.length > 6) {
      alert('সর্বোচ্চ ৬টি ছবি আপলোড করতে পারবেন');
      return;
    }
    
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 20, 90));
    }, 100);
    
    const compressedItems: MediaItem[] = [];
    for (const file of files) {
      const compressedUrl = await compressImage(file);
      compressedItems.push({ url: compressedUrl, file });
    }
    
    setMediaItems([...mediaItems, ...compressedItems]);
    
    clearInterval(interval);
    setUploadProgress(100);
    setTimeout(() => setUploadProgress(0), 1000);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadProgress(0);
      const interval = setInterval(() => setUploadProgress(prev => Math.min(prev + 10, 90)), 200);
      const compressedUrl = await compressVideo(file);
      setVideo({ url: compressedUrl, file });
      clearInterval(interval);
      setUploadProgress(100);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const compressed = await compressAudio(blob);
        setAudio(URL.createObjectURL(compressed));
        stream.getTracks().forEach(track => track.stop());
      };
      recorder.start();
      setIsRecording(true);
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          setIsRecording(false);
        }
      }, 30000);
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

  const handlePublish = async () => {
    if (!title || !price || !phone || !location || !category || !condition || !terms) {
      alert('সব তথ্য পূরণ করুন (* চিহ্নিত ফিল্ড আবশ্যিক)');
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    const interval = setInterval(() => setUploadProgress(prev => Math.min(prev + 5, 95)), 100);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearInterval(interval);
    setUploadProgress(100);
    setTimeout(() => {
      setIsSubmitting(false);
      alert('✅ আপনার বিজ্ঞাপন সফলভাবে প্রকাশ করা হয়েছে!');
      onClose();
      setMediaItems([]);
      setVideo(null);
      setAudio(null);
      setTitle('');
      setDescription('');
      setPrice('');
      setPhone('');
      setLocation('');
      setCategory('');
      setCondition('');
      setDeliveryOption('');
      setNegotiable(false);
      setTerms(false);
      setUploadProgress(0);
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[3000] flex items-end md:items-center justify-center" onClick={onClose}>
      <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-2xl h-[90%] md:h-auto md:max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b px-5 py-4 flex justify-between items-center z-10">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition">
            <X size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-orange-500" />
            <h2 className="text-xl font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">বিজ্ঞাপন দিন</h2>
          </div>
          <div className="w-10" />
        </div>

        <div className="p-5 space-y-6">
          
          {/* Media Upload Section */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <Camera size={16} className="text-orange-500" /> মিডিয়া আপলোড
              </p>
              <span className="text-[10px] text-gray-400">{mediaItems.length}/6 ছবি</span>
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mb-3">
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 text-center">আপলোড হচ্ছে... {uploadProgress}%</p>
              </div>
            )}
            
            <div className="flex gap-3 overflow-x-auto pb-3">
              {mediaItems.map((item, i) => (
                <div key={i} className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md group">
                  <img src={item.url} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setMediaItems(mediaItems.filter((_, idx) => idx !== i))} 
                    className="absolute top-1 right-1 bg-red-500/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 size={10} className="text-white" />
                  </button>
                </div>
              ))}
              {mediaItems.length < 6 && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition group">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                  <Plus size={24} className="text-gray-400 group-hover:text-orange-500" />
                  <span className="text-[9px] text-gray-400 group-hover:text-orange-500">ছবি যোগ</span>
                </label>
              )}
              {!video && (
                <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-400 hover:bg-orange-50 transition group">
                  <input type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                  <FileVideo size={24} className="text-gray-400 group-hover:text-orange-500" />
                  <span className="text-[9px] text-gray-400 group-hover:text-orange-500">ভিডিও</span>
                </label>
              )}
              <button
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
                onTouchStart={startRecording}
                onTouchEnd={stopRecording}
                className={`w-24 h-24 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all ${
                  isRecording ? 'border-red-500 bg-red-50 shadow-md scale-95' : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
                }`}
              >
                <Mic size={24} className={isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'} />
                <span className="text-[9px] text-gray-400">{isRecording ? 'রেকর্ডিং...' : 'ভয়েস'}</span>
                {isRecording && <div className="w-2 h-2 bg-red-500 rounded-full animate-ping mt-1" />}
              </button>
            </div>
            
            {video && (
              <div className="relative mt-3 rounded-xl overflow-hidden shadow-md">
                <video src={video.url} className="w-full h-44 object-cover" controls />
                <button onClick={() => setVideo(null)} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full shadow-md"><Trash2 size={12} className="text-white" /></button>
              </div>
            )}
            {audio && (
              <div className="mt-3 flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <Volume2 size={20} className="text-orange-500" />
                <audio src={audio} controls className="flex-1 h-8" />
                <button onClick={() => setAudio(null)} className="p-1.5 rounded-full hover:bg-gray-200"><Trash2 size={16} className="text-red-500" /></button>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3">
            <button 
              onClick={() => setShowCategory(true)} 
              className="w-full bg-gray-50 p-4 rounded-xl flex justify-between items-center hover:bg-gray-100 transition border border-transparent hover:border-orange-200"
            >
              <span className={category ? 'text-gray-800 font-medium' : 'text-gray-400'}>
                {category || 'ক্যাটাগরি নির্বাচন করুন *'}
              </span>
              <ChevronDown size={18} className="text-gray-400" />
            </button>
            
            <div className="relative">
              <Tag size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="পণ্যের নাম *" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-500 transition"
              />
            </div>
            
            <textarea 
              placeholder="পণ্যের বিস্তারিত বিবরণ * (ব্র্যান্ড, মডেল, কালার, ওয়ারেন্টি ইত্যাদি)" 
              rows={4} 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
              className="w-full bg-gray-50 p-4 rounded-xl outline-none resize-none focus:ring-2 focus:ring-orange-500 transition"
            />
            
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="number" 
                  placeholder="দাম (৳) *" 
                  value={price} 
                  onChange={(e) => setPrice(e.target.value)} 
                  className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div className="relative">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="tel" 
                  placeholder="মোবাইল নম্বর *" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="লোকেশন * (জেলা/থানা)" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                className="w-full bg-gray-50 pl-12 pr-4 py-4 rounded-xl outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <Info size={16} className="text-orange-500" /> অতিরিক্ত তথ্য
            </p>
            
            <select 
              value={condition} 
              onChange={(e) => setCondition(e.target.value)} 
              className="w-full bg-white p-3 rounded-xl outline-none border border-gray-200 focus:border-orange-400"
            >
              <option value="">পণ্যের অবস্থা *</option>
              {conditions.map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
            
            <select 
              value={deliveryOption} 
              onChange={(e) => setDeliveryOption(e.target.value)} 
              className="w-full bg-white p-3 rounded-xl outline-none border border-gray-200 focus:border-orange-400"
            >
              <option value="">ডেলিভারি অপশন</option>
              {deliveryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={negotiable} 
                onChange={() => setNegotiable(!negotiable)} 
                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="text-sm text-gray-600">দাম negotiable</span>
            </label>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition">
            <input 
              type="checkbox" 
              checked={terms} 
              onChange={() => setTerms(!terms)} 
              className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <div>
              <span className="text-sm font-medium">সকল নিয়ম ও শর্ত মেনে নিচ্ছি</span>
              <p className="text-[10px] text-gray-400">আপনার বিজ্ঞাপন মডারেশন করা হবে</p>
            </div>
          </label>

          {/* Submit Button */}
          <button
            onClick={handlePublish}
            disabled={!terms || isSubmitting}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
              terms && !isSubmitting 
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl active:scale-95' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" /> প্রকাশ করা হচ্ছে...
              </>
            ) : (
              <>
                <CheckCircle size={20} /> বিজ্ঞাপন প্রকাশ করুন
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-gray-400 pb-4">
            আপনার বিজ্ঞাপন ৩০ দিন পর্যন্ত সক্রিয় থাকবে
          </p>
        </div>
      </div>

      {/* Category Modal */}
      {showCategory && (
        <div className="fixed inset-0 bg-black/50 z-[4000] flex items-end md:items-center justify-center" onClick={() => setShowCategory(false)}>
          <div className="bg-white rounded-t-3xl md:rounded-3xl w-full md:max-w-md p-6 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">ক্যাটাগরি নির্বাচন করুন</h3>
              <button onClick={() => setShowCategory(false)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => (
                <button 
                  key={cat} 
                  onClick={() => { setCategory(cat); setShowCategory(false); }} 
                  className={`p-3 rounded-xl text-left transition-all ${
                    category === cat ? 'bg-orange-500 text-white' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}