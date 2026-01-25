// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from 'sonner';
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css"; // 1. IMPORT GLOBAL CSS TẠI ĐÂY

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BetterUS",
  description: "Kết nối tình nguyện viên với người cần giúp đơ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        {/* Link CDN cho icon Google Material Symbols */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
      </head>
      <body className={`${inter.variable} font-sans`}>
        <ErrorBoundary>
          {/* Chỉ render children, không đặt Sidebar ở đây nữa */}
          {children}
          <Toaster position="top-right" richColors />
        </ErrorBoundary>
      </body>
    </html>
  );
}