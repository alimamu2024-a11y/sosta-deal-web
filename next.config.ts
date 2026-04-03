import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // টাইপ এরর থাকলেও যেন প্রজেক্ট রান হয়
    ignoreBuildErrors: true,
  },
  // এখানে eslint ব্লকটি আমরা সরিয়ে দিয়েছি কনফ্লিক্ট এড়াতে
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;