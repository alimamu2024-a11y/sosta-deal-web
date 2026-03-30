"use client";

import React, { useState, useEffect, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { v4 as uuidv4 } from 'uuid';
import { 
  MessageSquare, Send, X, CheckCircle2, Trash2, ThumbsUp, Share2, 
  Search, Bell, Image as ImageIcon, Camera, BarChart3, Globe, Plus
} from 'lucide-react';

export default function SostaSocialFinalBuild() {
  // ডাটা স্টেট
  const [allPosts, setAllPosts] = useState<any[]>([]); 
  const [displayedPosts, setDisplayedPosts] = useState<any[]>([]); 
  const [page, setPage] = useState(1);
  const postsPerPage = 10;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  
  const [showPollInput, setShowPollInput] = useState(false);
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const loaderRef = useRef(null);

  // লোকাল স্টোরেজ হ্যান্ডলিং
  useEffect(() => {
    const saved = localStorage.getItem('sosta_final_v22');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAllPosts(parsed);
      setDisplayedPosts(parsed.slice(0, postsPerPage));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('sosta_final_v22', JSON.stringify(allPosts));
  }, [allPosts]);

  // ১. Lazy Loading লজিক
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && displayedPosts.length < allPosts.length) {
        const nextBatch = allPosts.slice(0, (page + 1) * postsPerPage);
        setDisplayedPosts(nextBatch);
        setPage(prev => prev + 1);
      }
    }, { threshold: 1.0 });

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [displayedPosts, allPosts, page]);

  // ২. ইমেজ কম্প্রেশন (০.১ এমবি)
  const handleImageInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsCompressing(true);
    const options = { maxSizeMB: 0.1, maxWidthOrHeight: 1200, useWebWorker: true };
    try {
      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = () => { setPreviewUrl(reader.result as string); setIsCompressing(false); };
    } catch (e) { setIsCompressing(false); }
  };

  // ৩. পোস্ট পাবলিশ
  const handlePublish = () => {
    if(!postContent && !previewUrl && !showPollInput) return;
    const newPost = {
      id: uuidv4(),
      user: "Mohammad Rubel Rana",
      avatar: "https://i.pravatar.cc/150?u=rubel",
      time: "Just now",
      content: postContent,
      image: previewUrl,
      poll: showPollInput ? pollOptions.filter(o => o.trim() !== '').map(o => ({ text: o, votes: 0 })) : null,
      likes: 0,
      myReaction: null,
      comments: []
    };
    const updated = [newPost, ...allPosts];
    setAllPosts(updated);
    setDisplayedPosts(updated.slice(0, page * postsPerPage));
    setIsModalOpen(false); setPostContent(''); setPreviewUrl(null); setShowPollInput(false); setPollOptions(['', '']);
  };

  // ৪. কমেন্ট হ্যান্ডলিং (Auto-close সহ)
  const handleAddComment = (postId: string) => {
    if (!commentText.trim()) return;
    const updated = allPosts.map(p => p.id === postId ? { 
      ...p, comments: [...(p.comments || []), { id: uuidv4(), text: commentText }] 
    } : p);
    setAllPosts(updated);
    setDisplayedPosts(updated.slice(0, page * postsPerPage));
    setCommentText('');
    setActiveCommentId(null); // কমেন্ট বক্স অটো অফ
  };

  // ৫. পোল ভোট রেজাল্ট লজিক
  const handleVote = (postId: string, optIndex: number) => {
    const updated = allPosts.map(p => {
      if(p.id === postId && p.poll) {
        const newPoll = [...p.poll];
        newPoll[optIndex].votes += 1;
        return { ...p, poll: newPoll };
      }
      return p;
    });
    setAllPosts(updated);
    setDisplayedPosts(updated.slice(0, page * postsPerPage));
  };

  return (
    <div className="bg-[#F0F2F5] min-h-screen font-sans overflow-x-hidden">
      
      {/* হেডার */}
      {/* 🌑 ULTRA MODERN DARK GLASS HEADER */}
{/* 🛰️ ULTRA-UNIQUE ASYMMETRIC HEADER */}
<header className="sticky top-0 z-[500] w-full">
  {/* Glass Background with Bottom Curve */}
  <div className="absolute inset-0 bg-[#0b0f1a]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_10px_30px_rgba(0,0,0,0.5)] [clip-path:ellipse(120%_100%_at_50%_0%)]"></div>

  <div className="relative px-6 py-5 flex justify-between items-center max-w-[650px] mx-auto">
    {/* Logo Area with unique 'Deal' Badge */}
    <div className="flex flex-col group cursor-pointer">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-[1000] tracking-tighter bg-gradient-to-r from-[#f85606] via-[#ff8c00] to-[#f85606] bg-clip-text text-transparent italic animate-gradient-x">
          SOSTA
        </h1>
        <div className="bg-[#f85606] text-[#0b0f1a] text-[10px] font-black px-2 py-0.5 rounded-br-xl rounded-tl-xl shadow-[0_0_15px_rgba(248,86,6,0.4)]">
          DEAL
        </div>
      </div>
      <div className="flex items-center gap-1 mt-1 opacity-60 group-hover:opacity-100 transition-opacity">
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
        <span className="text-[8px] font-black uppercase tracking-[3px] text-slate-400">
          Global Marketplace
        </span>
      </div>
    </div>

    {/* Modern Icon Group with 'Floating Island' Style */}
    <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
      <button className="p-2.5 text-slate-400 hover:text-white hover:bg-[#f85606] rounded-[14px] transition-all duration-500 shadow-inner">
        <Search size={20} strokeWidth={2.5}/>
      </button>
      
      <div className="w-[1px] h-5 bg-white/10 mx-1"></div>

      <div className="relative group">
        <button className="p-2.5 text-slate-400 group-hover:text-[#ffae42] transition-all">
          <Bell size={20} strokeWidth={2.5}/>
          {/* Glowing Notification Dot */}
          <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-[#f85606] rounded-full border-2 border-[#0b0f1a] shadow-[0_0_10px_#f85606]"></span>
        </button>
      </div>

      <div className="w-[1px] h-5 bg-white/10 mx-1"></div>

      {/* Profile with Hexagon or Unique Shape */}
      <div className="p-0.5 bg-gradient-to-tr from-[#f85606] to-pink-500 rounded-xl cursor-pointer hover:rotate-6 transition-transform">
         <img 
           src="https://i.pravatar.cc/100?u=rubel" 
           className="w-9 h-9 object-cover rounded-[10px] border-2 border-[#0b0f1a]" 
           alt="Profile"
         />
      </div>
    </div>
  </div>

  {/* Sub-Header: Quick Stats or Categories (Optional) */}
  <div className="relative px-6 py-2 flex gap-4 overflow-x-auto no-scrollbar max-w-[650px] mx-auto">
      {['All Deals', 'Mobile', 'Laptops', 'Offers'].map((item) => (
        <span key={item} className="text-[10px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap hover:text-[#f85606] cursor-pointer transition-colors">
          #{item}
        </span>
      ))}
  </div>
</header>
      <main className="w-full md:max-w-[650px] mx-auto space-y-2">
        
        {/* রাইটিং বক্স */}
        <div className="bg-white p-4 border-b">
          <div className="flex gap-3 items-center">
            <img src="https://i.pravatar.cc/150?u=rubel" className="w-10 h-10 rounded-full border" />
            <button onClick={() => setIsModalOpen(true)} className="flex-1 text-left py-2.5 px-5 bg-slate-100 rounded-full text-slate-500 text-sm">
              আপনার মনে কি আছে?
            </button>
          </div>
        </div>

        {/* পোস্ট ফিড */}
        <div className="space-y-2 pb-10">
          {displayedPosts.map((post) => (
            <div key={post.id} className="bg-white border-y shadow-sm overflow-hidden">
              <div className="p-3 flex justify-between items-center">
                <div className="flex gap-3 items-center font-bold text-sm">
                  <img src={post.avatar} className="w-10 h-10 rounded-full" />
                  <div>
                    <p className="flex items-center gap-1">{post.user} <CheckCircle2 size={12} className="text-[#1877F2]" fill="currentColor"/></p>
                    <p className="text-[10px] text-slate-400">{post.time} • Global</p>
                  </div>
                </div>
                {/* ডিলেট বাটন */}
                <button onClick={() => {
                  const up = allPosts.filter(p => p.id !== post.id);
                  setAllPosts(up); setDisplayedPosts(up.slice(0, page * postsPerPage));
                }} className="text-slate-200 hover:text-red-500 p-2"><Trash2 size={18}/></button>
              </div>
              
              <div className="px-4 pb-3 text-[15px]">{post.content}</div>

              {/* পোল ভোট ও রেজাল্ট */}
              {post.poll && (
                <div className="px-4 pb-4 space-y-2">
                  {post.poll.map((opt: any, i: number) => {
                    const total = post.poll.reduce((acc: any, curr: any) => acc + curr.votes, 0);
                    const pct = total === 0 ? 0 : Math.round((opt.votes / total) * 100);
                    return (
                      <button key={i} onClick={() => handleVote(post.id, i)} className="w-full relative bg-slate-50 border rounded-xl overflow-hidden py-3 px-4 text-left">
                        <div className="absolute inset-y-0 left-0 bg-orange-100/50" style={{ width: `${pct}%` }} />
                        <div className="relative flex justify-between text-xs font-bold">
                          <span>{opt.text}</span>
                          <span className="text-[#f85606]">{pct}%</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {post.image && <img src={post.image} className="w-full h-auto object-cover border-y" />}
              
              <div className="flex border-t">
                {/* লাইক ও রিঅ্যাকশন */}
                <div className="flex-1 relative">
                  <button onClick={() => setActiveReactionId(activeReactionId === post.id ? null : post.id)} className="w-full py-3 text-xs font-bold text-slate-500 flex justify-center items-center gap-2">
                    {post.myReaction ? <span className="text-xl">{post.myReaction}</span> : <ThumbsUp size={18}/>} Like
                  </button>
                  {activeReactionId === post.id && (
                    <div className="absolute bottom-full left-2 mb-2 flex bg-white shadow-xl rounded-full p-2 gap-2 z-[300] border">
                      {['❤️','😆','😮','😢','😡','🔥'].map(e => (
                        <button key={e} onClick={() => {
                          const up = allPosts.map(p => p.id === post.id ? {...p, myReaction: e} : p);
                          setAllPosts(up); setDisplayedPosts(up.slice(0, page * postsPerPage));
                          setActiveReactionId(null);
                        }} className="text-2xl hover:scale-125 transition-transform">{e}</button>
                      ))}
                    </div>
                  )}
                </div>

                <button onClick={() => setActiveCommentId(activeCommentId === post.id ? null : post.id)} className="flex-1 border-x py-3 text-xs font-bold text-slate-500 flex justify-center items-center gap-2">
                  <MessageSquare size={18}/> Comment
                </button>

                <button onClick={() => alert("Shared!")} className="flex-1 py-3 text-xs font-bold text-slate-500 flex justify-center items-center gap-2">
                  <Share2 size={18}/> Share
                </button>
              </div>

              {activeCommentId === post.id && (
                <div className="p-3 bg-slate-50 border-t">
                  <div className="flex gap-2">
                    <input autoFocus value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="কমেন্ট লিখুন..." className="flex-1 bg-white border rounded-full px-4 py-2 text-xs outline-none" />
                    <button onClick={() => handleAddComment(post.id)} className="bg-[#f85606] p-2 rounded-full text-white"><Send size={16}/></button>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {/* Lazy Loading ট্রিগার */}
          <div ref={loaderRef} className="h-20 flex items-center justify-center text-slate-400 text-xs font-bold">
            {displayedPosts.length < allPosts.length ? "নতুন পোস্ট লোড হচ্ছে..." : "সব পোস্ট দেখা শেষ!"}
          </div>
        </div>
      </main>

      {/* ক্রিয়েট পোস্ট মোডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] flex flex-col bg-white">
          <div className="flex items-center justify-between p-4 border-b">
            <button onClick={() => setIsModalOpen(false)}><X size={24}/></button>
            <h2 className="font-bold">নতুন পোস্ট</h2>
            <button onClick={handlePublish} disabled={isCompressing} className="bg-[#f85606] text-white px-6 py-1.5 rounded-full font-bold">
              {isCompressing ? "..." : "পোস্ট"}
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
             <div className="p-4 flex gap-3">
                <img src="https://i.pravatar.cc/150?u=rubel" className="w-12 h-12 rounded-full border shadow-sm" />
                <div className="flex-1">
                   <p className="font-bold text-sm">Mohammad Rubel Rana</p>
                   {/* ক্যামেরা, গ্যালারি, পোল বাটন */}
                   <div className="flex gap-2 mt-2">
                      <button onClick={() => cameraRef.current?.click()} className="flex items-center gap-1 bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-blue-100"><Camera size={14}/> Camera</button>
                      <button onClick={() => galleryRef.current?.click()} className="flex items-center gap-1 bg-green-50 text-green-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-green-100"><ImageIcon size={14}/> Gallery</button>
                      <button onClick={() => setShowPollInput(!showPollInput)} className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-full text-[10px] font-bold border border-orange-100"><BarChart3 size={14}/> Poll</button>
                   </div>
                </div>
             </div>
             
             <textarea autoFocus value={postContent} onChange={(e) => setPostContent(e.target.value)} className="w-full px-5 text-xl outline-none resize-none min-h-[120px]" placeholder="আপনার মনে কি আছে?" />
             
             {showPollInput && (
                <div className="px-5 space-y-2 mb-4">
                  {pollOptions.map((opt, i) => (
                    <input key={i} value={opt} onChange={(e)=>{let n=[...pollOptions]; n[i]=e.target.value; setPollOptions(n);}} placeholder={`Option ${i+1}`} className="w-full p-3 bg-slate-50 border rounded-xl text-sm outline-none" />
                  ))}
                  <button onClick={()=>setPollOptions([...pollOptions, ''])} className="text-xs font-bold text-[#f85606]">+ আরও যোগ করুন</button>
                </div>
             )}
             
             {previewUrl && <div className="p-4"><img src={previewUrl} className="w-full rounded-2xl border" /></div>}
          </div>

          <input type="file" ref={galleryRef} onChange={handleImageInput} accept="image/*" className="hidden" />
          <input type="file" ref={cameraRef} capture="environment" onChange={handleImageInput} accept="image/*" className="hidden" />
        </div>
      )}
    </div>
  );
}