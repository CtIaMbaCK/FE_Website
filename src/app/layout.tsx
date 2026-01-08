// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
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
      <body className={`${inter.variable} font-sans`}>
        {/* Chỉ render children, không đặt Sidebar ở đây nữa */}
        {children}
      </body>
    </html>
  );
}