import type { Metadata } from "next";
import { Inter } from "next/font/google";
import HomeHeader from "@/components/HomePageHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "BetterUS",
  description: "BetterUS cho Tổ chức xã hội",
};

export default function HomePageLayout({
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
      <body className={`${inter.variable} font-display bg-gray-100`}>

          {/* Phần nội dung chính bên phải */}
          <div className="flex flex-col flex-1 h-screen overflow-hidden">
            {/* Header cố định ở trên cùng của phần nội dung */}
            <HomeHeader />
            
            {/* Nội dung thay đổi (Children) */}
            <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
              {children}
            </main>
        </div>
      </body>
    </html>
  );
}