'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const router = useRouter();

  // বাইপাস লগইন ফাংশন - সরাসরি হোম পেজে পাঠাবে
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/'); 
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12">
      
      {/* লোগো সেকশন - আপনার দেওয়া ডিজাইন অনুযায়ী */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
            {/* SOSTA টেক্সট */}
            <span className="text-4xl font-black text-[#FF5722] tracking-tighter">SOSTA</span>
            {/* DEAL টেক্সট কমলা শেপের ভেতর */}
            <div className="bg-[#FF5722] text-white px-4 py-1.5 rounded-2xl flex items-center justify-center transform -skew-x-6">
                <span className="text-2xl font-bold tracking-tight transform skew-x-6 italic">DEAL</span>
            </div>
        </div>
        
        {/* লোগোর নিচের সেই স্পেশাল কমলা ডিজাইন */}
        <div className="w-20 h-1.5 bg-[#FF5722] rounded-full shadow-[0_2px_10px_rgba(255,87,34,0.3)]"></div>
        
        <p className="mt-4 text-gray-500 font-medium tracking-tight">
          আপনার ডিলগুলো ম্যানেজ করতে লগইন করুন
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[45px] border border-gray-100">
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="ইমেইল ঠিকানা"
                className="block w-full pl-11 pr-4 py-4 border border-gray-100 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF5722] focus:bg-white transition-all"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="পাসওয়ার্ড"
                className="block w-full pl-11 pr-4 py-4 border border-gray-200 rounded-2xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF5722] focus:bg-white transition-all"
              />
            </div>

            {/* আপনার সেই প্রিয় অরেঞ্জ বাটন */}
            <button
              type="submit"
              className="w-full flex justify-center items-center py-4 rounded-2xl text-lg font-bold text-white bg-[#FF5722] shadow-[0_10px_25px_rgba(255,87,34,0.25)] hover:shadow-[0_15px_30px_rgba(255,87,34,0.35)] active:scale-[0.97] transition-all"
            >
              লগইন করুন
              <ArrowRight size={20} className="ml-2" />
            </button>
          </form>

          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-400">অথবা</span></div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => router.push('/')}
              className="w-full flex justify-center items-center py-4 border-2 border-gray-50 rounded-2xl bg-white text-gray-700 font-bold hover:bg-gray-50 transition-all active:scale-[0.97]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5 mr-3" />
              Continue with Google
            </button>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500 font-medium">
            একাউন্ট নেই? <span className="text-[#FF5722] font-bold cursor-pointer hover:underline">ফ্রি রেজিস্ট্রেশন করুন</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;