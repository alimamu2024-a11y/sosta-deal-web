// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";   // ← নতুন যোগ করুন
import { CartProvider } from "@/context/CartContext";   // ← আগের মতো
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sosta Deal",
  description: "Daraz style marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="min-h-screen bg-gray-50 antialiased">
        <AuthProvider>       {/* ← এই লাইন যোগ করুন */}
          <CartProvider>     {/* ← আগের মতো */}
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}