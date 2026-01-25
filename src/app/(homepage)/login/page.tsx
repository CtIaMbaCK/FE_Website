"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { login } from "@/services/auth.service";
import { toast } from "sonner";
import Icon from "@/components/icons";

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
    <div className="bg-brand-background text-brand-text flex flex-col min-h-screen font-sans">
      {/* BEGIN: MainContent */}
      <main className="flex-grow flex items-center justify-center p-4">
        {/* Login Card */}
        <div
          className="bg-white rounded-lg shadow-lg p-8 sm:p-12 w-full max-w-md"
          data-purpose="login-form-card"
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-brand-text">
            Đăng nhập
          </h1>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input Field */}
            <div>
              <label
                className="block text-sm font-medium text-brand-text-light mb-2"
                htmlFor="phoneNumber"
              >
                Số điện thoại
              </label>
              <input
                className="w-full px-4 py-3 border border-brand-teal rounded-lg focus:ring-brand-teal focus:border-brand-teal text-sm outline-none"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Số điện thoại"
                required
                type="text"
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Password Input Field */}
            <div>
              <label
                className="block text-sm font-medium text-brand-text-light mb-2"
                htmlFor="password"
              >
                Mật khẩu
              </label>
              <div className=" flex justify-between w-full px-4 py-3 border border-brand-border rounded-lg focus:ring-brand-teal focus:border-brand-teal text-sm outline-none">
                <input
                  id="password"
                  name="password"
                  placeholder="Mật khẩu"
                  required
                  type={isSeePassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <Icon
                  icon={isSeePassword ? "seePassword" : "notSeePassword"}
                  onClick={() => setSeePassword(!isSeePassword)}
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full text-white"
              disabled={isLoading}
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>

          {/* Additional Links */}
          <div className="mt-8 text-center text-sm space-y-4">
            <Link
              className="text-brand-teal hover:underline"
              href="/forgot-password"
            >
              Quên mật khẩu?
            </Link>
            <p className="text-brand-text-light">
              Chưa có tài khoản?{" "}
              <Link
                className="text-brand-teal font-semibold hover:underline"
                href="/register"
              >
                Đăng ký tài khoản
              </Link>
            </p>
          </div>
        </div>
      </main>
      {/* END: MainContent */}

      {/* BEGIN: PageFooter */}
      <footer className="bg-brand-background py-8 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Footer content container */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12 text-sm text-brand-text-light">
            {/* Phone contact */}
            <div
              className="flex items-center gap-3"
              data-purpose="contact-phone"
            >
              {/* Thay thế bằng icon SVG hoặc ảnh thật */}
              <img
                alt="phone icon"
                className="h-6 w-6"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAk4sSVvGa5IF78TxGDTztPcO1a6jRemVqN_ACXx_haD_IUcaEeub10J4rX7B70E9evey-PJDLNxApVzEKyjQ61qMmZ-SXDhntvdA4fFSRYtwYNmpTW7NWGnedUMDic17F5emE1ExaZiVJuYu9jXuWQLSJRP6GZqfDxRKVKqaFpv-7QJYxx8iVQhAxJ-QsEK_0GvxCicKkDaz0epfDu9QhHITdkRyRDtVYLaapmsNmxdcTIw5HeAe1bUUpme-sTxNA66i4djXnr_qpO"
              />
              <div>
                <p>Điện thoại</p>
                <a
                  className="text-brand-text font-medium hover:text-brand-teal"
                  href="tel:0123458789"
                >
                  0123 458 789
                </a>
              </div>
            </div>
            {/* Email contact */}
            <div
              className="flex items-center gap-3"
              data-purpose="contact-email"
            >
              <img
                alt="email icon"
                className="h-6 w-6"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBDyiCiJf8FZidwO-ZnmMZXHOrwrSbq09shrITu5y18bUwoOF5gAWIkIAl8f5P49BzD4SXzaIRmpZwH6ZB8NNpqZRfNSQyJEUso46IY8K2FOFTGUT2Ipitp-KxQEfUNIL_Oiv57UWCmP57h6jyAqbrbtedVsqpNMeFDycdhvxeOYw0ZrfDV_iPMnDdkELvSaJaiFr7LbTa3-fj69anzKo_6dclNCPFsYqMylBxbTK3HqKE_GnNvN4EK6x7sPyx25eG7MmtAwy1sGBqN"
              />
              <div>
                <p>Email</p>
                <a
                  className="text-brand-text font-medium hover:text-brand-teal"
                  href="mailto:support@example.com"
                >
                  support@example.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* END: PageFooter */}
    </div>
  );
}
