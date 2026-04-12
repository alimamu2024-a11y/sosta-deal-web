// app/login/page.tsx (Skip বাটন কাজ করবে)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion } from "framer-motion";
import { Loader2, Shield, Zap, Sparkles, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) router.push("/");
    };
    checkUser();
  }, [router, supabase]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    }
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200/30 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-100/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-orange-100">
              <span className="text-3xl font-black text-orange-600">SOSTA</span>
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-xl transform -skew-x-6 shadow-md">
                <span className="text-lg font-bold italic skew-x-6">DEAL</span>
              </div>
            </div>
            <p className="text-gray-500 mt-3 text-sm font-medium">
              Bangladesh's largest marketplace
            </p>
          </motion.div>

          {/* Main Card */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-orange-100"
          >
            {/* Badge */}
            <div className="flex justify-center mb-6">
              <div className="bg-gradient-to-r from-orange-100 to-red-100 px-4 py-1.5 rounded-full border border-orange-200">
                <p className="text-xs font-bold text-orange-600 flex items-center gap-1">
                  <Shield size={12} /> সিকিউর লগইন
                </p>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              স্বাগতম!
            </h2>
            <p className="text-gray-500 text-center mb-8">
              চালিয়ে যেতে আপনার Google অ্যাকাউন্ট ব্যবহার করুন
            </p>

            {/* Features */}
            <div className="flex justify-center gap-4 mb-8">
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Zap size={12} className="text-orange-500" />
                <span>দ্রুত লগইন</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Shield size={12} className="text-green-500" />
                <span>নিরাপদ</span>
              </div>
              <div className="w-px h-4 bg-gray-300" />
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Sparkles size={12} className="text-purple-500" />
                <span>ফ্রি</span>
              </div>
            </div>

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-xl text-sm text-center"
              >
                ⚠️ {errorMsg}
              </motion.div>
            )}

            {/* Google Login Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border-2 border-orange-200 py-4 rounded-xl font-semibold text-gray-700 hover:border-orange-400 hover:shadow-lg hover:bg-orange-50 transition-all duration-300 disabled:opacity-60 group"
            >
              {loading ? (
                <Loader2 size={22} className="animate-spin text-orange-500" />
              ) : (
                <>
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-base font-semibold">Continue with Google</span>
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-400">অথবা</span>
              </div>
            </div>

            {/* Skip Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSkip}
              className="w-full flex items-center justify-center gap-2 bg-gray-100 border border-gray-200 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-200 transition-all duration-300"
            >
              <span>এড়িয়ে যান</span>
              <ArrowRight size={16} />
            </motion.button>

            {/* Terms */}
            <p className="text-center text-[10px] text-gray-400 mt-8 leading-relaxed">
              চালিয়ে যাওয়ার মাধ্যমে, আপনি আমাদের সেবার শর্তাবলী এবং গোপনীয়তা নীতিতে সম্মত হচ্ছেন
            </p>
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-gray-400 text-xs mt-6"
          >
            © 2025 Sosta Deal. All rights reserved.
          </motion.p>
        </div>
      </div>
    </div>
  );
}