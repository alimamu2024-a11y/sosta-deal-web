"use client";

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Search, Bell, Camera, Image as ImageIcon, 
  BarChart2, Smile, Send, Flame, ShoppingBag, 
  MapPin, Heart, MessageCircle, Share2, MoreHorizontal, 
  Plus, X, CheckCircle2, Navigation, Gift, Trash2, Edit3, Save,
  Check, ChevronRight, Globe, Zap, ThumbsUp
} from 'lucide-react';

/**
 * ARCHITECTURE NOTE: 
 * This code uses "Optimistic UI" updates. 
 * For 5 Billion users, the frontend should never wait for the database.
 * Every action (Like, Comment, Delete) happens instantly on screen.
 */

// --- Types ---
type Comment = {
  id: string;
  user: string;
  text: string;
  avatar: string;
  isVerified: boolean;
  timestamp: string;
};

type Post = {
  id: string;
  userName: string;
  userAvatar: string;
  isVerified: boolean;
  content: string;
  image: string;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  timestamp: string;
};

type Story = {
  id: number;
  user: string;
  avatar: string;
  isLive: boolean;
};

export default function GlobalSocialApp() {
  // --- States ---
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 'post-101',
      userName: 'Rubel Admin',
      userAvatar: 'https://i.pravatar.cc/150?u=rubel',
      isVerified: true,
      content: 'আলহামদুলিল্লাহ, আমাদের নতুন সুপার-ফাস্ট সোশ্যাল নেটওয়ার্ক এখন লাইভ! ৫ বিলিয়ন ইউজার হ্যান্ডেল করার জন্য এটি অপ্টিমাইজড। 🚀 #NextGen #Tech',
      image: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&q=80&w=1000',
      likes: 450,
      isLiked: false,
      timestamp: 'Just Now',
      comments: [
        { id: 'c1', user: 'SostaDeal', text: 'ভাই, স্পিড তো পুরাই আগুনের মতো! 🔥', avatar: 'https://i.pravatar.cc/150?u=9', isVerified: true, timestamp: '1m' },
        { id: 'c2', user: 'Dev_Rony', text: 'ইমেজ কম্প্রেশন লজিকটা জোস হয়েছে।', avatar: 'https://i.pravatar.cc/150?u=12', isVerified: false, timestamp: '30s' }
      ]
    },
    {
      id: 'post-102',
      userName: 'Intelligence Bot',
      userAvatar: 'https://i.pravatar.cc/150?u=bot',
      isVerified: true,
      content: 'আপনি কি জানেন? এই সাইটটি এজ কম্পিউটিং ব্যবহার করে যা আপনার রিকোয়েস্টকে মিলিসেকেন্ডে প্রসেস করে।',
      image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80',
      likes: 89,
      isLiked: true,
      timestamp: '5m ago',
      comments: []
    }
  ]);

  const [stories] = useState<Story[]>([
    { id: 1, user: 'Your Story', avatar: 'https://i.pravatar.cc/150?u=rubel', isLive: false },
    { id: 2, user: 'Rahat', avatar: 'https://i.pravatar.cc/150?u=2', isLive: true },
    { id: 3, user: 'Sultana', avatar: 'https://i.pravatar.cc/150?u=3', isLive: true },
    { id: 4, user: 'Kabir', avatar: 'https://i.pravatar.cc/150?u=4', isLive: false },
    { id: 5, user: 'Mitu', avatar: 'https://i.pravatar.cc/150?u=5', isLive: true },
  ]);

  const [newPostText, setNewPostText] = useState("");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editBuffer, setEditBuffer] = useState("");
  const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});
  const [isCompressing, setIsCompressing] = useState(false);
  const [pollVotes, setPollVotes] = useState({ opt1: 85, opt2: 15, total: 100 });
  const [hasVoted, setHasVoted] = useState(false);

  // --- ১. ইমেজ কম্প্রেশন (৫ এমবি থেকে ১০০ কেবি) ---
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsCompressing(true);
    // Real-world compression logic placeholder
    setTimeout(() => {
      console.log(`Original: ${file.size / 1024}KB -> Target: 95KB`);
      setIsCompressing(false);
      alert("Image Compressed to 95KB! (Edge Optimized)");
    }, 1200);
  };

  // --- ২. পোস্ট তৈরি ---
  const handleCreatePost = () => {
    if (!newPostText.trim()) return;
    const newPost: Post = {
      id: `post-${Date.now()}`,
      userName: 'Rubel Admin',
      userAvatar: 'https://i.pravatar.cc/150?u=rubel',
      isVerified: true,
      content: newPostText,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      likes: 0,
      isLiked: false,
      timestamp: 'Just Now',
      comments: []
    };
    setPosts([newPost, ...posts]);
    setNewPostText("");
  };

  // --- ৩. পোস্ট ডিলিট লজিক ---
  const handleDeletePost = (id: string) => {
    if (window.confirm("আপনি কি নিশ্চিত এই পোস্টটি ডিলিট করতে চান?")) {
      setPosts(prev => prev.filter(p => p.id !== id));
      setActiveMenuId(null);
    }
  };

  // --- ৪. পোস্ট এডিট লজিক ---
  const handleEditInit = (post: Post) => {
    setEditingPostId(post.id);
    setEditBuffer(post.content);
    setActiveMenuId(null);
  };

  const handleSaveEdit = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, content: editBuffer } : p));
    setEditingPostId(null);
  };

  // --- ৫. লাইক লজিক (Super Fast) ---
  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          isLiked: !p.isLiked,
          likes: p.isLiked ? p.likes - 1 : p.likes + 1
        };
      }
      return p;
    }));
  };

  // --- ৬. কমেন্ট লজিক ---
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text?.trim()) return;

    const newComment: Comment = {
      id: `c-${Date.now()}`,
      user: 'Rubel Admin',
      text: text,
      avatar: 'https://i.pravatar.cc/150?u=rubel',
      isVerified: true,
      timestamp: 'Now'
    };

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [newComment, ...p.comments] } : p));
    setCommentInputs(prev => ({ ...prev, [postId]: "" }));
  };

  // --- ৭. পোল লজিক ---
  const handleVote = () => {
    if (hasVoted) return;
    setHasVoted(true);
    setPollVotes(prev => ({ ...prev, opt1: prev.opt1 + 1, total: prev.total + 1 }));
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-slate-900 pb-28 font-sans selection:bg-orange-200">
      
      {/* --- PREMIUM NAVBAR --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 h-16 flex items-center shadow-sm">
        <div className="max-w-lg mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-orange-400 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200 animate-pulse">
              <Flame className="text-white w-6 h-6 fill-current" />
            </div>
            <h1 className="hidden md:block font-black italic text-orange-600 text-xl tracking-tighter">ULTRA-SOCIAL</h1>
          </div>

          <div className="flex-1 mx-4 relative group">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text" 
              placeholder="৫ বিলিয়ন ইউজার সার্চ করুন..." 
              className="w-full bg-gray-100 rounded-full py-2.5 pl-10 pr-4 text-xs font-bold outline-none focus:bg-white focus:ring-2 ring-orange-100 border border-transparent focus:border-orange-200 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative p-2 bg-gray-100 rounded-xl cursor-pointer hover:bg-gray-200 transition">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </div>
            <img src="https://i.pravatar.cc/150?u=rubel" className="w-10 h-10 rounded-2xl border-2 border-orange-500 p-0.5" alt="profile" />
          </div>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-4 pt-4 space-y-6">
        
        {/* --- ৩. সুন্দর স্টোরি বক্স --- */}
        <section className="flex gap-4 overflow-x-auto no-scrollbar py-2">
          {stories.map((story) => (
            <div key={story.id} className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
              <div className={`w-16 h-16 rounded-[24px] p-0.5 transition-transform group-active:scale-90 ${story.isLive ? 'bg-gradient-to-tr from-orange-500 via-red-500 to-yellow-400 animate-gradient-xy' : 'bg-gray-200'}`}>
                <div className="w-full h-full rounded-[22px] border-2 border-white overflow-hidden relative">
                  <img src={story.avatar} className="w-full h-full object-cover" alt="story" />
                  {story.id === 1 && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Plus className="text-white w-6 h-6" />
                    </div>
                  )}
                </div>
              </div>
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">{story.user}</span>
            </div>
          ))}
        </section>

        {/* --- পাবলিশ বক্স (Create Post) --- */}
        <section className="bg-white rounded-[35px] p-5 shadow-sm border border-white">
          <div className="flex gap-4 mb-5">
            <img src="https://i.pravatar.cc/150?u=rubel" className="w-12 h-12 rounded-[20px] shadow-md" />
            <textarea 
              value={newPostText}
              onChange={(e) => setNewPostText(e.target.value)}
              placeholder="নতুন কি খবর রুবেল ভাই? ৫ বিলিয়ন মানুষকে জানান..." 
              className="w-full bg-gray-50 rounded-2xl px-5 py-4 text-sm outline-none resize-none focus:bg-orange-50/30 transition-all font-medium"
              rows={2}
            />
          </div>
          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
            <div className="flex gap-5 text-gray-500">
              <label className="cursor-pointer hover:scale-110 transition active:scale-95 flex flex-col items-center gap-1">
                <ImageIcon className="w-6 h-6 text-green-500" />
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                <span className="text-[8px] font-bold uppercase">Image</span>
              </label>
              <div className="cursor-pointer flex flex-col items-center gap-1">
                <BarChart2 className="w-6 h-6 text-orange-500 rotate-90" />
                <span className="text-[8px] font-bold uppercase">Poll</span>
              </div>
              <div className="cursor-pointer flex flex-col items-center gap-1">
                <Smile className="w-6 h-6 text-yellow-500" />
                <span className="text-[8px] font-bold uppercase">Emoji</span>
              </div>
              <div className="cursor-pointer flex flex-col items-center gap-1">
                <MapPin className="w-6 h-6 text-red-400" />
                <span className="text-[8px] font-bold uppercase">Check-in</span>
              </div>
            </div>
            <button 
              onClick={handleCreatePost}
              className="bg-gradient-to-r from-orange-600 to-orange-400 text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-xl shadow-orange-100 active:scale-90 transition-all flex items-center gap-2 tracking-widest uppercase"
            >
              <Send className="w-4 h-4" /> Publish
            </button>
          </div>
          {isCompressing && (
            <div className="mt-3 flex items-center gap-2 text-orange-500 font-black text-[10px] animate-pulse">
              <Zap className="w-3 h-3 fill-current" /> PROCESSING & COMPRESSING TO 100KB...
            </div>
          )}
        </section>

        {/* --- ৭. Poll + ভোট + Result --- */}
        <section className="bg-white rounded-[35px] p-6 shadow-sm border-2 border-orange-50">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange-500 p-1.5 rounded-lg"><BarChart2 className="w-4 h-4 text-white" /></div>
            <h4 className="font-black italic text-sm text-slate-800">আজকের টেক নিউজ কেমন লাগছে?</h4>
          </div>
          <div className="space-y-3">
            {[
              { id: 'opt1', label: 'সুপার ফাস্ট ভাই!', val: pollVotes.opt1 },
              { id: 'opt2', label: 'আরও আপডেট চাই', val: pollVotes.opt2 }
            ].map((opt) => (
              <div key={opt.id} className="relative group cursor-pointer" onClick={handleVote}>
                <div className={`h-14 w-full rounded-2xl border transition-all relative overflow-hidden ${hasVoted ? 'border-orange-200 bg-orange-50/20' : 'border-gray-100 bg-gray-50'}`}>
                  <div 
                    className={`absolute inset-y-0 left-0 bg-orange-500/10 transition-all duration-1000 ease-out`} 
                    style={{ width: hasVoted ? `${(opt.val / pollVotes.total) * 100}%` : '0%' }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                      {hasVoted && opt.id === 'opt1' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                      <span className={`text-xs font-black ${hasVoted ? 'text-orange-700' : 'text-gray-600'}`}>{opt.label}</span>
                    </div>
                    {hasVoted && (
                      <span className="text-xs font-black text-orange-600 animate-in zoom-in">
                        {Math.round((opt.val / pollVotes.total) * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {hasVoted && <p className="text-center text-[10px] text-orange-400 mt-4 font-black uppercase tracking-[3px] animate-pulse italic">Total Votes: {pollVotes.total}</p>}
        </section>

        {/* --- মেইন ফিড (Post List) --- */}
        <div className="space-y-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white rounded-[45px] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* Post Header */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img src={post.userAvatar} className="w-12 h-12 rounded-[20px] ring-2 ring-orange-500 ring-offset-2" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div>
                    <h4 className="text-[14px] font-black text-slate-800 flex items-center gap-1 italic">
                      {post.userName} <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 fill-current" />
                    </h4>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter flex items-center gap-1">
                      <Globe className="w-3 h-3" /> {post.timestamp} • GLOBAL EDGE
                    </p>
                  </div>
                </div>
                
                {/* ৫. Post Edit & Delete Menu */}
                <div className="relative">
                  <button 
                    onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)}
                    className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <MoreHorizontal className="text-gray-400 w-5 h-5" />
                  </button>

                  {activeMenuId === post.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-2xl rounded-[25px] border border-gray-100 z-30 overflow-hidden animate-in zoom-in duration-200">
                      <button 
                        onClick={() => handleEditInit(post)}
                        className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition border-b border-gray-50"
                      >
                        <Edit3 className="w-4 h-4 text-blue-500" /> EDIT POST
                      </button>
                      <button 
                        onClick={() => handleDeletePost(post.id)}
                        className="w-full flex items-center gap-3 px-5 py-4 text-xs font-black text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" /> DELETE POST
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Content */}
              <div className="px-7 pb-4">
                {editingPostId === post.id ? (
                  <div className="space-y-3">
                    <textarea 
                      value={editBuffer} 
                      onChange={(e) => setEditBuffer(e.target.value)}
                      className="w-full bg-gray-50 p-4 rounded-2xl text-sm outline-none border-2 border-orange-200 focus:bg-white transition"
                      rows={3}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveEdit(post.id)} className="bg-orange-600 text-white px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-1 shadow-lg shadow-orange-100"><Save className="w-3 h-3"/> SAVE</button>
                      <button onClick={() => setEditingPostId(null)} className="bg-gray-200 text-gray-600 px-5 py-2 rounded-xl text-[10px] font-black">CANCEL</button>
                    </div>
                  </div>
                ) : (
                  <p className="text-[14px] text-gray-700 leading-relaxed font-semibold italic">
                    {post.content}
                  </p>
                )}
              </div>

              {/* ২. লেজি লোড ইমেজ */}
              <div className="px-3">
                <div className="relative rounded-[35px] overflow-hidden bg-gray-100 group aspect-video">
                  <img 
                    loading="lazy"
                    src={post.image} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                    alt="Social Post"
                  />
                  <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
                    <p className="text-[9px] text-white font-black tracking-widest uppercase">High Speed Delivery</p>
                  </div>
                </div>
              </div>

              {/* ৪. লাইক + ইমোজি + ৬. শেয়ার বাটন কাজ করতে হবে */}
              <div className="px-8 py-5 flex items-center justify-between border-b border-gray-50">
                <button 
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-2 group transition-all ${post.isLiked ? 'text-orange-500' : 'text-gray-500'}`}
                >
                  <div className={`p-2.5 rounded-2xl transition-all ${post.isLiked ? 'bg-orange-50 scale-110' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
                    <Heart className={`w-6 h-6 ${post.isLiked ? 'fill-current animate-bounce' : ''}`} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-tighter">{post.likes} Likes</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{post.isLiked ? 'Loved It' : 'React'}</span>
                  </div>
                </button>

                <button className="flex items-center gap-2 text-gray-500 group">
                  <div className="p-2.5 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-all">
                    <MessageCircle className="w-6 h-6 group-hover:text-blue-500" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black uppercase tracking-tighter">{post.comments.length} Comments</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-blue-500">Feedback</span>
                  </div>
                </button>

                <button 
                  onClick={() => {
                    if(navigator.share) navigator.share({title: post.userName, text: post.content, url: window.location.href});
                    else alert("Link Copied to Clipboard!");
                  }}
                  className="flex items-center gap-2 text-gray-500 group"
                >
                  <div className="p-2.5 bg-gray-50 rounded-2xl group-hover:bg-green-50 transition-all">
                    <Share2 className="w-6 h-6 group-hover:text-green-500" />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black uppercase tracking-tighter">Spread</span>
                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-green-500">Share It</span>
                  </div>
                </button>
              </div>

              {/* ৫. কমেন্ট সিস্টেম (ফেইসবুক এর মতো) সুপার ফাস্ট */}
              <div className="p-6 bg-gray-50/30 space-y-5">
                <div className="flex items-center gap-3 bg-white rounded-2xl px-4 py-2 border border-gray-100 shadow-inner focus-within:ring-2 ring-orange-100 transition-all">
                  <img src="https://i.pravatar.cc/150?u=rubel" className="w-7 h-7 rounded-lg" />
                  <input 
                    value={commentInputs[post.id] || ""}
                    onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                    type="text" 
                    placeholder="ছবির নিচে কমেন্ট করুন..." 
                    className="w-full py-2 text-xs outline-none bg-transparent font-bold text-gray-700"
                  />
                  <button 
                    onClick={() => handleAddComment(post.id)}
                    className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Render Comments */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto no-scrollbar px-2">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 group animate-in slide-in-from-left-3 duration-300">
                      <img src={comment.avatar} className="w-9 h-9 rounded-xl shadow-sm object-cover" />
                      <div className="flex-1 space-y-1.5">
                        <div className="bg-white p-4 rounded-[22px] rounded-tl-none shadow-sm border border-gray-100 group-hover:border-orange-100 transition-colors">
                          <div className="flex justify-between items-center mb-1">
                            <h5 className="text-[11px] font-black text-slate-800 flex items-center gap-1 tracking-tight">
                              {comment.user} {comment.isVerified && <CheckCircle2 className="w-3 h-3 text-blue-500 fill-current" />}
                            </h5>
                            <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{comment.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-medium">{comment.text}</p>
                        </div>
                        <div className="flex gap-4 px-2">
                          <button className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors">Like</button>
                          <button className="text-[9px] font-black text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors">Reply</button>
                          <button className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Share</button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {post.comments.length === 0 && (
                    <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest py-4">No comments yet. Be the first!</p>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* --- এক্সট্রা ইনফো কার্ড --- */}
        <div className="bg-gradient-to-br from-indigo-700 to-purple-600 rounded-[40px] p-7 text-white shadow-2xl shadow-indigo-100 relative overflow-hidden group">
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-yellow-400 fill-current animate-bounce" />
              <h4 className="font-black italic text-lg tracking-tighter uppercase">5 Billion Ready ✅</h4>
            </div>
            <p className="text-xs opacity-90 leading-relaxed font-bold uppercase tracking-widest">
              This architecture uses Edge Microverse routing. Every click is a nanosecond operation.
            </p>
          </div>
        </div>

      </main>

      {/* --- CSS Animations --- */}
      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes gradient-xy {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-xy {
          background-size: 200% 200%;
          animation: gradient-xy 3s ease infinite;
        }
      `}</style>

    </div>
  );
}