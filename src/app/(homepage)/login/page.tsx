"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { login } from "@/services/auth.service";
import { toast } from "sonner";
import Icon from "@/components/icons";
import { MdOutlineEmail, MdLockOutline } from "react-icons/md";

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSeePassword, setSeePassword] = useState(false);
  const [formData, setFormData] = useState({
    phoneNumber: "",
    password: "",
  });

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Gọi API login thật
      const response = await login({
        phoneNumber: formData.phoneNumber,
        password: formData.password,
      });

      // Hiển thị thông báo thành công
      toast.success("Đăng nhập thành công!");

      // Redirect theo role
      const userRole = response.user.role;

      if (userRole === 'ADMIN') {
        router.push("/admin/dashboard");
      } else if (userRole === 'ORGANIZATION') {
        router.push("/socialorg/dashboard");
      } else if (userRole === 'VOLUNTEER' || userRole === 'BENEFICIARY') {
        // VOLUNTEER và BENEFICIARY chỉ dùng mobile, redirect về HomePage
        router.push("/");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      // Hiển thị lỗi
      const errorMessage =
        error.response?.data?.message ||
        "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] flex flex-col font-sans overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#008080]/10 blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-300/15 blur-[120px]" />
      </div>

      <main className="flex-grow flex items-center justify-center p-4 relative z-10 py-20">
        {/* Soft UI Glass Card */}
        <div 
          className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,128,128,0.08)] border border-white p-10 sm:p-14 w-full max-w-xl relative overflow-hidden"
          data-purpose="login-form-card"
        >
          {/* Decorative Corner Element */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-[#008080]/20 to-[#00A79D]/5 rounded-full blur-2xl"></div>

          <div className="text-center mb-10 relative z-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Mừng trở lại!
            </h1>
            <p className="text-slate-500 font-medium text-sm">
              Đăng nhập để kết nối cùng mạng lưới tình nguyện viên BetterUS.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {/* Phone Input Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-bold text-slate-700 ml-1" 
                htmlFor="phoneNumber"
              >
                Số điện thoại
              </label>
              <div className="relative flex items-center group">
                 <div className="absolute left-4 text-slate-400 group-focus-within:text-[#008080] transition-colors">
                    <MdOutlineEmail className="w-5 h-5" />
                 </div>
                 <input
                  className="w-full pl-12 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] focus:bg-white text-slate-800 text-sm outline-none transition-all duration-300 shadow-sm font-medium placeholder-slate-400"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="Nhập số điện thoại của bạn"
                  required
                  type="text"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input Field */}
            <div className="space-y-2">
              <label 
                className="block text-sm font-bold text-slate-700 ml-1" 
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <div className="relative flex items-center group">
                 <div className="absolute left-4 text-slate-400 group-focus-within:text-[#008080] transition-colors">
                    <MdLockOutline className="w-5 h-5" />
                 </div>
                 <input
                  className="w-full pl-12 pr-12 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-[#008080]/10 focus:border-[#008080] focus:bg-white text-slate-800 text-sm outline-none transition-all duration-300 shadow-sm font-medium placeholder-slate-400"
                  id="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  required
                  type={isSeePassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <button 
                  type="button"
                  className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                  onClick={() => setSeePassword(!isSeePassword)}
                >
                  <Icon icon={isSeePassword ? "seePassword" : "notSeePassword"} className="w-5 h-5 opacity-70" />
                </button>
              </div>
            </div>

            {/* Actions: Remember & Forgot Pass */}
            <div className="flex items-center justify-between pt-2">
               <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#008080] focus:ring-[#008080]" />
                  <span className="text-sm text-slate-500 font-medium select-none">Nhớ tài khoản</span>
               </label>
               <Link
                 className="text-sm font-semibold text-[#008080] hover:text-[#00A79D] transition-colors"
                 href="/forgot-password"
               >
                 Quên mật khẩu?
               </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full mt-4 bg-gradient-to-r from-[#008080] to-[#00A79D] text-white rounded-2xl py-6 font-bold text-base shadow-[0_10px_20px_rgba(0,128,128,0.25)] hover:shadow-[0_15px_30px_rgba(0,128,128,0.4)] hover:-translate-y-1 transition-all duration-300 border-0"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang đăng nhập...
                </span>
              ) : (
                "Đăng nhập"
              )}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-10 text-center relative z-10 pt-8 border-t border-slate-100">
            <p className="text-sm text-slate-500 font-medium">
              Bạn là thành viên mới?{" "}
              <Link
                className="text-[#008080] font-bold hover:text-[#00A79D] transition-colors inline-block hover:-translate-y-0.5"
                href="/register"
              >
                Tạo tài khoản ngay
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
