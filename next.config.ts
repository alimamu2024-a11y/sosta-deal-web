import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // আপনার আগের সেটিং রাখলাম
  },
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*',  // সব ডোমেইন এর জন্য (development এর জন্য)
      },
    ],
    // development এ unoptimized (error কমাতে)
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;