import Link from "next/link";
import Image from "next/image";
import {
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdFavorite
} from "react-icons/md";
import { FaFacebook, FaYoutube, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer id="main-footer" className="relative z-10 w-full bg-white mt-auto border-t border-slate-200/60 pt-16 pb-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Cột 1: Brand */}
          <div className="flex flex-col gap-6">
             <Link href="/" className="flex items-center gap-3 group">
               <div className="relative w-12 h-12 overflow-hidden rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center p-1.5 group-hover:scale-105 transition-transform duration-300">
                 <Image src="/images/Logo.png" alt="BetterUS Logo" width={48} height={48} className="object-contain" />
               </div>
               <span className="text-3xl font-black text-slate-900 tracking-tight group-hover:text-[#008080] transition-colors duration-300">BetterUS</span>
             </Link>
             <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
               Nền tảng công nghệ kết nối những ngọn lửa tình nguyện, sưởi ấm cộng đồng bằng tình yêu thương và sự sẻ chia minh bạch.
             </p>
             <div className="flex items-center gap-4">
               <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#008080] hover:text-white transition-colors">
                 <FaFacebook size={20} />
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#008080] hover:text-white transition-colors">
                 <FaYoutube size={20} />
               </a>
               <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#008080] hover:text-white transition-colors">
                 <FaInstagram size={18} />
               </a>
             </div>
          </div>

          {/* Cột 2: Liên kết */}
          <div className="lg:pl-8">
             <h4 className="text-lg font-bold text-slate-900 mb-6">Nền tảng</h4>
             <ul className="flex flex-col gap-4 text-slate-500 font-medium text-sm">
               <li><Link href="/" className="hover:text-[#008080] transition-colors">Về chúng tôi</Link></li>
               <li><Link href="/posts" className="hover:text-[#008080] transition-colors">Tin tức & Sự kiện</Link></li>
               <li><Link href="/download" className="hover:text-[#008080] transition-colors">Tải ứng dụng</Link></li>
               <li><Link href="#" className="hover:text-[#008080] transition-colors">Câu hỏi thường gặp</Link></li>
             </ul>
          </div>

          {/* Cột 3: Pháp lý */}
          <div>
             <h4 className="text-lg font-bold text-slate-900 mb-6">Chính sách</h4>
             <ul className="flex flex-col gap-4 text-slate-500 font-medium text-sm">
               <li><Link href="#" className="hover:text-[#008080] transition-colors">Điều khoản sử dụng</Link></li>
               <li><Link href="#" className="hover:text-[#008080] transition-colors">Chính sách bảo mật</Link></li>
               <li><Link href="#" className="hover:text-[#008080] transition-colors">Quy tắc cộng đồng</Link></li>
               <li><Link href="#" className="hover:text-[#008080] transition-colors">Quy trình xác thực</Link></li>
             </ul>
          </div>

          {/* Cột 4: Liên hệ */}
          <div>
             <h4 className="text-lg font-bold text-slate-900 mb-6">Liên hệ</h4>
             <ul className="flex flex-col gap-4 text-slate-500 font-medium text-sm">
               <li className="flex items-start gap-3">
                 <MdLocationOn className="w-5 h-5 text-[#008080] shrink-0 mt-0.5" />
                 <span className="leading-relaxed">Khu Công nghệ cao, Thành phố Thủ Đức, Thành phố Hồ Chí Minh</span>
               </li>
               <li className="flex items-center gap-3">
                 <MdPhone className="w-5 h-5 text-[#008080] shrink-0" />
                 <a href="tel:0123456789" className="hover:text-[#008080] transition-colors">0123 456 789</a>
               </li>
               <li className="flex items-center gap-3">
                 <MdEmail className="w-5 h-5 text-[#008080] shrink-0" />
                 <a href="mailto:hotro.betterus@gmail.com" className="hover:text-[#008080] transition-colors">hotro.betterus@gmail.com</a>
               </li>
             </ul>
          </div>
        </div>

        {/* Copyright section */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 text-sm text-slate-400 font-medium">
          <p>© 2026 BetterUS. Bản quyền thuộc về BetterUS.</p>
          <div className="flex items-center gap-1 mt-4 md:mt-0">
             Được xây dựng với <MdFavorite className="text-rose-500 mx-1 w-4 h-4" /> vì cộng đồng
          </div>
        </div>
      </div>
    </footer>
  );
}
