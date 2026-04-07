// app/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mail, Lock, ArrowRight, Eye, EyeOff, User } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, signup, user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
        router.push("/");
      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }
        await signup(formData.name, formData.email, formData.password);
        router.push("/");
      }
    } catch (error) {
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex flex-col justify-center px-6 py-12">
      
      {/* Logo Section */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-10 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-4xl font-black text-[#FF5722] tracking-tighter">SOSTA</span>
          <div className="bg-[#FF5722] text-white px-4 py-1.5 rounded-2xl flex items-center justify-center transform -skew-x-6">
            <span className="text-2xl font-bold tracking-tight transform skew-x-6 italic">DEAL</span>
          </div>
        </div>
        
        <div className="w-20 h-1.5 bg-[#FF5722] rounded-full shadow-[0_2px_10px_rgba(255,87,34,0.3)]"></div>
        
        <p className="mt-4 text-gray-600 font-medium tracking-tight">
          {isLogin ? "আপনার অ্যাকাউন্টে লগইন করুন" : "নতুন অ্যাকাউন্ট তৈরি করুন"}
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-[0_20px_60px_rgba(0,0,0,0.05)] rounded-[35px] border border-gray-100">
          
          {/* Toggle Buttons */}
          <div className="flex gap-2 bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isLogin ? "bg-[#FF5722] text-white shadow-md" : "text-gray-500"
              }`}
            >
              লগইন
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                !isLogin ? "bg-[#FF5722] text-white shadow-md" : "text-gray-500"
              }`}
            >
              রেজিস্ট্রেশন
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="পূর্ণ নাম"
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF5722] focus:bg-white transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="ইমেইল ঠিকানা"
                className="block w-full pl-11 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF5722] focus:bg-white transition-all"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="পাসওয়ার্ড"
                className="block w-full pl-11 pr-12 py-3.5 border border-gray-100 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF5722] focus:bg-white transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? <EyeOff size={18} className="text-gray-400" /> : <Eye size={18} className="text-gray-400" />}
              </button>
            </div>

            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="পাসওয়ার্ড নিশ্চিত করুন"
                  className="block w-full pl-11 pr-4 py-3.5 border border-gray-100 rounded-xl bg-gray-50 outline-none focus:ring-2 focus:ring-[#FF5722] focus:bg-white transition-all"
                  required={!isLogin}
                />
              </div>
            )}

            {isLogin && (
              <div className="text-right">
                <button type="button" className="text-xs text-[#FF5722] font-medium">
                  পাসওয়ার্ড ভুলে গেছেন?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3.5 rounded-xl text-base font-bold text-white bg-[#FF5722] shadow-[0_10px_25px_rgba(255,87,34,0.25)] hover:shadow-[0_15px_30px_rgba(255,87,34,0.35)] active:scale-[0.97] transition-all disabled:opacity-70"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                <>
                  {isLogin ? "লগইন করুন" : "অ্যাকাউন্ট তৈরি করুন"}
                  <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">অথবা</span>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full flex justify-center items-center py-3.5 border-2 border-gray-50 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-all active:scale-[0.97]">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="h-5 w-5 mr-3" alt="Google" />
              গুগল দিয়ে লগইন করুন
            </button>
          </div>

          <p className="mt-8 text-center text-xs text-gray-500">
            লগইন করার মাধ্যমে আপনি আমাদের{" "}
            <span className="text-[#FF5722] font-medium cursor-pointer">সেবার শর্তাবলী</span> এবং{" "}
            <span className="text-[#FF5722] font-medium cursor-pointer">গোপনীয়তা নীতি</span>{" "}
            মেনে নিচ্ছেন
          </p>
        </div>
      </div>
    </div>
  );
}