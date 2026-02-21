"use client";

import Link from "next/link";
import { MdArrowBack, MdGetApp, MdOutlineStarBorder } from "react-icons/md";
import { FaApple, FaGooglePlay } from "react-icons/fa";

export default function DownloadPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#008080]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#00A79D]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl bg-white/60 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_rgba(0,128,128,0.05)] border border-white/80 p-10 md:p-16 text-center animate-fade-in">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-[#008080] to-[#00A79D] rounded-[1.5rem] flex items-center justify-center text-white p-4 shadow-xl mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
           <MdGetApp className="w-12 h-12" />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
          Sẵn sàng kết nối trên di động!
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
          Nền tảng Tình nguyện & Cứu trợ BetterUS hiện đã có mặt trên các cửa hàng ứng dụng. Tải xuống để không bỏ lỡ bất kỳ cơ hội lan tỏa yêu thương nào.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
          <button className="flex items-center gap-4 px-8 py-5 bg-black hover:bg-slate-800 text-white rounded-2xl w-full sm:w-auto transition-all shadow-[0_15px_30px_rgba(0,0,0,0.15)] hover:shadow-lg hover:-translate-y-1 group">
             <FaApple className="w-10 h-10 group-hover:scale-110 transition-transform" />
             <div className="text-left">
                <p className="text-xs text-white/70 uppercase">Tải xuống từ</p>
                <p className="text-xl font-bold">App Store</p>
             </div>
          </button>
          
          <button className="flex items-center gap-4 px-8 py-5 bg-gradient-to-br from-[#008080] to-[#00A79D] hover:from-[#006666] hover:to-[#008080] text-white rounded-2xl w-full sm:w-auto transition-all shadow-[0_15px_30px_rgba(0,128,128,0.25)] hover:shadow-lg hover:-translate-y-1 group">
             <FaGooglePlay className="w-9 h-9 group-hover:scale-110 transition-transform" />
             <div className="text-left">
                <p className="text-xs text-white/70 uppercase">Tải xuống từ</p>
                <p className="text-xl font-bold">Google Play</p>
             </div>
          </button>
        </div>

        {/* Rating Mock */}
        <div className="flex flex-col items-center justify-center pt-8 border-t border-slate-200/60">
           <div className="flex gap-1 text-amber-500 mb-3">
              {[1,2,3,4,5].map(i => <MdOutlineStarBorder key={i} className="fill-current w-6 h-6" />)}
           </div>
           <p className="text-slate-600 font-medium">Được đánh giá <span className="text-slate-900 font-bold">4.9/5</span> dựa trên 10K+ lượt tải</p>
        </div>

        <Link href="/" className="inline-flex items-center justify-center mt-12 text-[#008080] hover:text-[#006666] font-semibold flex gap-2 transition-colors px-6 py-3 bg-[#008080]/5 rounded-full hover:bg-[#008080]/10">
          <MdArrowBack /> Quay lại trang chủ
        </Link>
      </div>
    </div>
  );
}
