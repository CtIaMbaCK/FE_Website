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
    <div className="min-h-screen bg-gray-50">
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
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 bg-white border-r border-gray-200`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto flex flex-col">
          {/* Logo va Ten */}
          <div className="flex items-center gap-3 px-3 mb-8 pb-4 border-b border-gray-200">
            <div className="w-10 h-10">
              <Image
                src="/images/Logo.png"
                width={40}
                height={40}
                alt="BetterUS Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900">
                BetterUS
              </span>
              <span className="text-xs text-gray-500">
                Admin Panel
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <ul className="space-y-2 flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-custom-teal text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="text-xl" />
                    <span className="ml-3 font-medium">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Admin Info va Logout o duoi cung */}
          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex items-center gap-3 px-3 mb-3">
              <div className="w-10 h-10 bg-[#008080] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  Administrator
                </p>
                <p className="text-xs text-gray-500">Quản trị viên</p>
              </div>
            </div>

            {/* Nut Logout */}
            <button
              onClick={handleLogout}
              className="flex w-full justify-center items-center gap-10 p-2 bg-[#FFE4E6] text-[#CC4362] rounded-xl hover:bg-[#CC4362] hover:text-white transition-colors"
            >
              <MdLogout className="text-xl" />
              <span className="text-sm font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
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
