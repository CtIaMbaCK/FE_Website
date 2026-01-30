"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getMe, logout } from "@/services/auth.service";
import Image from "next/image";
import { MdLogout } from "react-icons/md";
import { User } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [orgName, setOrgName] = useState<string>("");
  const [orgAvatar, setOrgAvatar] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Ham xu ly logout
  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const loadOrgProfile = async () => {
      try {
        // Kiểm tra token trước
        const token = localStorage.getItem("access_token");
        if (!token) {
          router.push("/login");
          return;
        }

        const profile = await getMe();

        // organizationProfiles là object (1-1), không phải array
        if (profile?.organizationProfiles) {
          const orgName = profile.organizationProfiles.organizationName || "";
          const orgAvatar = profile.organizationProfiles.avatarUrl || "";

          setOrgName(orgName);
          setOrgAvatar(orgAvatar);
        } else {
          console.warn("⚠️ Không tìm thấy organizationProfiles trong profile");
          router.push("/login");
        }
      } catch (error: any) {
        console.error("❌ Lỗi khi lấy thông tin tổ chức:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    loadOrgProfile();
  }, [router]);

  // 4. Định nghĩa danh sách menu tại đây cho gọn
  const menuItems = [
    {
      name: "Dashboard",
      href: "/socialorg/dashboard",
      icon: "dashboard",
    },
    {
      name: "Quản lý Người cần giúp đỡ",
      href: "/socialorg/bficiary",
      icon: "account_child_invert",
    },
    {
      name: "Quản lý Tình nguyện viên",
      href: "/socialorg/volunteers",
      icon: "group",
    },
    {
      name: "Quản lý tài khoản",
      href: "/socialorg/accounts",
      icon: "person_add",
    },
    // {
    //   name: 'Quản lý hoạt động',
    //   href: '/socialorg/requests',
    //   icon: 'volunteer_activism'
    // },
    // {
    //   name: "Khen thưởng Tình nguyện viên",
    //   href: "/socialorg/appreciation",
    //   icon: "military_tech",
    // },
    {
      name: "Nhận xét TNV",
      href: "/socialorg/rewards/comments",
      icon: "comment",
    },
    {
      name: "Mẫu Chứng nhận",
      href: "/socialorg/rewards/templates",
      icon: "workspace_premium",
    },
    {
      name: "Cấp Chứng nhận",
      href: "/socialorg/rewards/certificates",
      icon: "award_star",
    },
    {
      name: "Quản lý Chiến dịch - sự kiện",
      href: "/socialorg/manage-events",
      icon: "campaign",
    },
    {
      name: "Quản lý Truyền thông",
      href: "/socialorg/blogs",
      icon: "perm_media",
    },
    {
      name: "Thống kê",
      href: "/socialorg/analysis",
      icon: "bar_chart",
    },
    // Thêm phần tử cho sidebar...
  ];

  return (
    <aside className="flex w-64 flex-col bg-white text-gray-800 border-r border-gray-200 h-screen sticky top-0">
      <div className="flex h-16 shrink-0 items-center gap-3 px-6 border-b border-gray-200">
        <div className="text-primary size-7">
          <Image
            src="/images/Logo.png"
            width={64}
            height={64}
            alt="BetterUS Logo"
          />
        </div>
        <Link href={"/socialorg/dashboard"}>
          <h2 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
            BetterUS
          </h2>
        </Link>
      </div>

      <nav className="flex flex-col flex-1 p-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {/* 5. Dùng vòng lặp map để render menu */}
          {menuItems.map((item) => {
            // Kiểm tra xem link này có đang active không
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? "bg-primary text-white" // Style khi đang Active
                    : "text-gray-500 hover:bg-primary/10 hover:text-primary" // Style khi bình thường
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <p className="text-sm font-medium leading-normal">
                  {item.name}
                </p>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Organization Info at Bottom */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar/Logo */}
          {loading ? (
            <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
              <span className="text-xs text-gray-500">...</span>
            </div>
          ) : orgAvatar ? (
            <img
              src={orgAvatar}
              alt={orgName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-10 h-10 bg-gray-800 text-white rounded-full font-semibold">
              {orgName ? orgName.charAt(0).toUpperCase() : "O"}
            </div>
          )}

          {/* Org Info */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <p className="text-sm text-gray-400">Đang tải...</p>
            ) : orgName ? (
              <>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {orgName}
                </p>
                <p className="text-xs text-gray-500">Tổ chức xã hội</p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-gray-900 truncate">
                  Tổ chức chưa hoàn thiện hồ sơ
                </p>
                <Link
                  href="/socialorg/profile"
                  className="text-xs text-blue-500 hover:text-blue-600 hover:underline"
                >
                  Hoàn thiện hồ sơ →
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Nut Thong tin ca nhan */}
        <button
          onClick={() => router.push("/socialorg/profile")}
          className="flex w-full justify-center items-center gap-10 p-2 mb-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-colors"
        >
          <User className="w-5 h-5" />
          <span className="text-sm font-medium">Thông tin cá nhân</span>
        </button>

        {/* Nut Logout */}
        <button
          onClick={handleLogout}
          className="flex w-full justify-center items-center gap-10 p-2 bg-[#FFE4E6] text-[#CC4362] rounded-xl hover:bg-[#CC4362] hover:text-white transition-colors"
        >
          <MdLogout className="text-xl" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
