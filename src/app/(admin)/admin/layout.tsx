"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  MdDashboard,
  MdPeople,
  MdVolunteerActivism,
  MdBusiness,
  MdArticle,
  MdCampaign,
  MdMenu,
  MdClose,
  MdLogout,
  MdHelpOutline,
  MdChat,
} from "react-icons/md";
import { logout, getMe } from "@/services/auth.service";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const profile = await getMe();
        if (profile.role !== "ADMIN") {
          router.push("/login");
        }
      } catch (error) {
        router.push("/login");
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  // Ham xu ly logout
  const handleLogout = async () => {
    await logout();
  };

  // Show loading while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  const menuItems = [
    { href: "/admin/dashboard", icon: MdDashboard, label: "Tổng quan" },
    { href: "/admin/beneficiaries", icon: MdPeople, label: "Người cần giúp đỡ" },
    { href: "/admin/volunteers", icon: MdVolunteerActivism, label: "Tình nguyện viên" },
    { href: "/admin/organizations", icon: MdBusiness, label: "Tổ chức xã hội" },
    { href: "/admin/requests", icon: MdHelpOutline, label: "Yêu cầu giúp đỡ" },
    { href: "/admin/posts", icon: MdArticle, label: "Bài viết" },
    { href: "/admin/campaigns", icon: MdCampaign, label: "Chiến dịch" },
    { href: "/admin/chat", icon: MdChat, label: "Tin nhắn" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-lg text-gray-700 hover:bg-gray-100"
        >
          {sidebarOpen ? <MdClose size={24} /> : <MdMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 w-72 h-screen transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-white/80 backdrop-blur-2xl border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
      >
        <div className="h-full px-4 py-6 overflow-y-auto flex flex-col scrollbar-hide">
          {/* Logo va Ten */}
          <div className="flex items-center gap-3 px-4 mb-8 pb-6 border-b border-slate-100/60 mt-2">
            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 p-2 flex items-center justify-center">
              <Image
                src="/images/Logo.png"
                width={40}
                height={40}
                alt="BetterUS Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-[#008080] tracking-tight">
                BetterUS
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin/dashboard" &&
                  pathname.startsWith(item.href + "/"));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-r from-teal-500 to-[#008080] text-white shadow-md shadow-teal-500/20 font-bold"
                        : "text-slate-500 hover:bg-teal-50/50 hover:text-teal-700 font-medium"
                    }`}
                  >
                    {isActive && (
                       <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full -z-10"></div>
                    )}
                    <Icon className={`text-2xl transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                    <span className="ml-3.5">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Admin Info va Logout o duoi cung */}
          <div className="border-t border-slate-100/60 pt-6 mt-4 pb-2 px-2">
            <div className="flex items-center gap-3 px-3 mb-4 p-2 rounded-2xl bg-slate-50 border border-slate-100/50">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-[#008080] rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-black text-lg">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-800 truncate">
                  Administrator
                </p>
                <p className="text-xs font-medium text-slate-500">Quản trị viên</p>
              </div>
            </div>

            {/* Nut Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full justify-center items-center gap-2 p-3 bg-red-50/50 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/20 transition-all font-bold text-sm"
            >
              <MdLogout className="text-lg" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-72 transition-all duration-300">
        <main className="p-4 sm:p-6 md:p-8">{children}</main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
