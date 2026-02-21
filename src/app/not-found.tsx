"use client";

import Link from "next/link";
import { MdErrorOutline, MdArrowBack } from "react-icons/md";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[20%] w-[30%] h-[30%] rounded-full bg-slate-200/50 blur-[100px]" />
        <div className="absolute bottom-[20%] right-[20%] w-[30%] h-[30%] rounded-full bg-[#008080]/5 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center animate-fade-in max-w-2xl px-4">
         <div className="relative w-40 h-40 mx-auto mb-8">
            <div className="absolute inset-0 bg-slate-200/60 rounded-full animate-pulse blur-xl"></div>
            <div className="relative w-full h-full bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center shadow-lg">
               <span className="text-6xl font-black text-slate-300">404</span>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-rose-100 text-rose-500 w-16 h-16 rounded-2xl flex items-center justify-center border-4 border-[#F8FAFC] shadow-sm rotate-12">
               <MdErrorOutline className="w-8 h-8" />
            </div>
         </div>

         <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
            Lạc đường yêu thương?
         </h1>
         <p className="text-lg text-slate-500 mb-12 leading-relaxed">
            Trang bạn đang tìm kiếm dường như đã được di chuyển hoặc không còn tồn tại trên bản đồ tình nguyện của BetterUS.
         </p>

         <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
               href="/" 
               className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#008080] text-white font-bold shadow-[0_10px_20px_rgba(0,128,128,0.2)] hover:shadow-lg hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center"
            >
               <MdArrowBack className="w-5 h-5" /> Về trang chủ
            </Link>
            <Link 
               href="/download" 
               className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-slate-700 font-bold border border-slate-200 shadow-sm hover:text-[#008080] hover:border-[#008080]/30 hover:shadow-md hover:-translate-y-1 transition-all duration-300 w-full sm:w-auto justify-center"
            >
               Tải ứng dụng
            </Link>
         </div>
      </div>
    </div>
  );
}
