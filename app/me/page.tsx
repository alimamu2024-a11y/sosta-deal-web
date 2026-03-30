"use client";

import React from 'react';
import Link from 'next/link';
import { 
  Wallet, Package, Heart, Share2, LogOut, ChevronRight, Award, Star, Zap, 
  UserCheck, MessageCircle, Gavel, LayoutGrid, ArrowLeft, Store, Users, 
  PlusCircle, Settings, Bell, ShieldCheck, CreditCard, Headphones, 
  UserPlus, Eye, BarChart3, Lock, ShieldAlert, Globe
} from 'lucide-react';

export default function SostaUltimateMePage() {
  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-900 font-sans pb-10">
      
      {/* ১. প্রিমিয়াম হেডার ও ব্যাক বাটন */}
      <div className="relative h-56 w-full bg-gradient-to-r from-[#f85606] to-[#ff8c52] overflow-hidden">
        {/* হোম পেজে যাওয়ার ফিক্সড ব্যাক বাটন */}
        <Link href="/">
          <button className="absolute top-6 left-5 p-2.5 bg-white/20 backdrop-blur-md border border-white/30 rounded-full text-white hover:bg-[#f85606] transition-all z-50 shadow-xl">
            <ArrowLeft size={24} />
          </button>
        </Link>

        {/* প্রোফাইল ও ট্রাস্ট সেকশন (Identity) */}
        <div className="absolute bottom-6 left-6 flex items-end gap-5">
          <div className="relative">
            <div className="p-1 bg-white rounded-[32px] shadow-2xl">
              <img 
                src="https://i.pravatar.cc/150?u=rubel" 
                className="w-24 h-24 rounded-[28px] object-cover" 
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-500 p-1.5 rounded-full border-4 border-white shadow-lg">
              <ShieldCheck size={14} className="text-white" fill="currentColor"/>
            </div>
          </div>
          <div className="text-white mb-2">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              Mohammad Rubel Rana
              <span className="bg-blue-400 p-0.5 rounded-full"><ShieldCheck size={12} fill="white"/></span>
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="px-2 py-0.5 bg-white/20 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/20">Level 2 Seller</span>
              <span className="flex items-center gap-1 text-yellow-300 font-bold text-xs"><Star size={12} fill="currentColor"/> 4.9 (Trust: 98%)</span>
            </div>
          </div>
        </div>
      </div>

      <main className="px-5 -mt-5 relative z-10 space-y-4">
        
        {/* ২. মার্কেটপ্লেস কন্ট্রোল সেন্টার (Earnings & Wallet) */}
        <div className="bg-white p-6 rounded-[35px] shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[2px] mb-1">Wallet Balance</p>
            <h3 className="text-3xl font-black text-[#f85606]">৳৪,৫২০.০০</h3>
          </div>
          <button className="bg-[#f85606] text-white px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase shadow-lg shadow-orange-500/20 italic">Top-up</button>
        </div>

        {/* ৩. সোশ্যাল ও কন্টেন্ট গ্রিড (Social & Live Bid) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[30px] border border-gray-100 flex flex-col items-center shadow-sm">
             <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl mb-2"><Gavel size={26}/></div>
             <p className="text-[11px] font-black text-slate-700 uppercase">Live Bid</p>
          </div>
          <div className="bg-white p-5 rounded-[30px] border border-gray-100 flex flex-col items-center shadow-sm border-dashed border-orange-200">
             <div className="p-3 bg-[#f85606] text-white rounded-2xl mb-2"><PlusCircle size={26}/></div>
             <p className="text-[11px] font-black text-[#f85606] uppercase italic">Add Post</p>
          </div>
        </div>

        {/* ৪. মাস্টার বিজনেস কন্ট্রোল (সব লিস্ট) */}
        <div className="bg-white rounded-[35px] overflow-hidden shadow-sm border border-gray-100">
          {[
            { icon: <Zap size={18}/>, label: 'Boost My Ads', desc: 'Featured for income', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: <Package size={18}/>, label: 'Ad Manager', desc: 'Edit or Delete Ads', color: 'text-blue-500', bg: 'bg-blue-50' },
            { icon: <MessageCircle size={18}/>, label: 'Buyer Messages', desc: 'Sellar-Buyer Chat Inbox', color: 'text-green-500', bg: 'bg-green-50' },
            { icon: <LayoutGrid size={18}/>, label: 'Social Archive', desc: 'Voice & Photo Logs', color: 'text-indigo-500', bg: 'bg-indigo-50' },
            { icon: <BarChart3 size={18}/>, label: 'Store Analytics', desc: 'Visitors & Reach', color: 'text-pink-500', bg: 'bg-pink-50' },
            { icon: <Heart size={18}/>, label: 'Saved Wishlist', desc: 'Items you loved', color: 'text-red-500', bg: 'bg-red-50' },
            { icon: <Award size={18}/>, label: 'Membership Plan', desc: 'Unlimited Posting', color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { icon: <Share2 size={18}/>, label: 'Refer & Earn', desc: 'Invite friends for cash', color: 'text-cyan-500', bg: 'bg-cyan-50' },
            { icon: <ShieldAlert size={18}/>, label: 'Verification Request', desc: 'Get Blue-Tick Badge', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: <Headphones size={18}/>, label: 'Help & Support', desc: 'Contact 24/7 Team', color: 'text-emerald-500', bg: 'bg-emerald-50' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-all cursor-pointer">
              <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${item.bg} ${item.color}`}>{item.icon}</div>
                <div>
                  <p className="text-[13px] font-black text-slate-800">{item.label}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight italic">{item.desc}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-slate-300" />
            </div>
          ))}
        </div>

        {/* ৫. ল্যাঙ্গুয়েজ ও সেটিংস */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-center gap-2 text-[11px] font-black text-slate-600 uppercase italic">
            <Globe size={16} /> বাংলা / EN
          </button>
          <button className="bg-white p-4 rounded-[24px] border border-gray-100 flex items-center justify-center gap-2 text-[11px] font-black text-slate-600 uppercase italic">
            <Settings size={16} /> Settings
          </button>
        </div>

        <button className="w-full p-4 bg-white text-red-500 rounded-[30px] border border-red-50 shadow-sm text-[11px] font-black uppercase tracking-[3px] mt-4 mb-8 italic">
          Sign Out Account
        </button>
      </main>
    </div>
  );
}