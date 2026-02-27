"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getMe, logout } from "@/services/auth.service";
import Image from "next/image";
import { 
  MdDashboard, 
  MdPeopleOutline, 
  MdVolunteerActivism, 
  MdPersonAddAlt, 
  MdCampaign, 
  MdPermMedia, 
  MdWorkspacePremium, 
  MdChat, 
  MdBarChart,
  MdLogout 
} from "react-icons/md";
import { User, Building2 } from "lucide-react";

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
      name: "Tổng quan",
      href: "/socialorg/dashboard",
      icon: MdDashboard,
    },
    {
      name: "Quản lý Người cần giúp đỡ",
      href: "/socialorg/bficiary",
      icon: MdPeopleOutline,
    },
    {
      name: "Quản lý Tình nguyện viên",
      href: "/socialorg/volunteers",
      icon: MdVolunteerActivism,
    },
    {
      name: "Quản lý tài khoản",
      href: "/socialorg/accounts",
      icon: MdPersonAddAlt,
    },
    {
      name: "Quản lý Chiến dịch - sự kiện",
      href: "/socialorg/manage-events",
      icon: MdCampaign,
    },
    {
      name: "Quản lý Truyền thông",
      href: "/socialorg/blogs",
      icon: MdPermMedia,
    },
    {
      name: "Mẫu Chứng nhận",
      href: "/socialorg/rewards/templates",
      icon: MdWorkspacePremium,
    },
    {
      name: "Tin nhắn",
      href: "/socialorg/chat",
      icon: MdChat,
    },
    {
      name: "Thống kê",
      href: "/socialorg/analysis",
      icon: MdBarChart,
    },
  ];

  return (
    <aside className="flex w-72 flex-col bg-white/80 backdrop-blur-2xl border-r border-slate-100 shadow-[4px_0_24px_rgba(0,0,0,0.02)] h-screen sticky top-0 z-40 relative">
      <div className="flex h-[88px] shrink-0 items-center gap-3 px-6 border-b border-slate-100/60 pb-2">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 p-2 flex items-center justify-center">
          <Image
            src="/images/Logo.png"
            width={40}
            height={40}
            alt="BetterUS Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <Link href={"/socialorg/dashboard"} className="flex flex-col">
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#008080] to-teal-600 tracking-tight">
            BetterUS
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Tổ chức xã hội
          </span>
        </Link>
      </div>

      <nav className="flex flex-col flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
        <ul className="space-y-2 flex-col flex">
          {/* 5. Dùng vòng lặp map để render menu */}
          {menuItems.map((item) => {
            // Cải tiến: Active khi pathname bắt đầu bằng href của menu
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href + "/") && item.href !== "/socialorg");

            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
                    isActive
                      ? "bg-gradient-to-r from-[#008080] to-teal-500 text-white shadow-md shadow-teal-500/20 font-bold"
                      : "text-slate-500 hover:bg-teal-50/50 hover:text-teal-700 font-medium"
                  }`}
                >
                  {isActive && (
                     <div className="absolute top-0 right-0 w-16 h-16 bg-white/20 rounded-bl-full -z-10"></div>
                  )}
                  <Icon className={`text-[22px] transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
                  <span className="ml-3.5 text-sm">
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Organization Info at Bottom */}
      <div className="border-t border-slate-100/60 pt-6 mt-2 pb-6 px-4 shrink-0">
        <div className="flex items-center gap-3 px-3 mb-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-100/50">
          {/* Avatar/Logo */}
          {loading ? (
            <div className="flex items-center justify-center w-10 h-10 bg-slate-200 rounded-xl animate-pulse">
            </div>
          ) : orgAvatar ? (
            <img
              src={orgAvatar}
              alt={orgName}
              className="w-10 h-10 rounded-xl object-cover shadow-sm bg-white"
            />
          ) : (
             <div className="w-10 h-10 bg-gradient-to-br from-[#008080] to-teal-500 rounded-xl flex items-center justify-center shadow-sm text-white">
               <Building2 className="w-5 h-5" />
             </div>
          )}

          {/* Org Info */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="h-4 bg-slate-200 rounded w-20 mb-1 animate-pulse"></div>
            ) : orgName ? (
              <>
                <p className="text-sm font-bold text-slate-800 truncate" title={orgName}>
                  {orgName}
                </p>
                <p className="text-[10px] uppercase font-bold text-slate-400">Tổ chức xã hội</p>
              </>
            ) : (
              <>
                <p className="text-[11px] font-bold text-slate-600 truncate mb-0.5">
                  Chưa hoàn thiện hồ sơ
                </p>
                <Link
                  href="/socialorg/profile"
                  className="text-[10px] uppercase font-bold text-teal-600 hover:text-teal-700"
                >
                  Hoàn thiện →
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons Container */}
        <div className="flex items-center gap-2">
           {/* Nut Thong tin ca nhan */}
           <button
             onClick={() => router.push("/socialorg/profile")}
             className="flex-1 flex justify-center items-center gap-2 p-3 bg-blue-50/50 text-blue-600 rounded-2xl hover:bg-blue-500 hover:text-white hover:shadow-md hover:shadow-blue-500/20 transition-all font-bold text-sm group"
             title="Thông tin tổ chức"
           >
             <User className="w-4 h-4 group-hover:scale-110 transition-transform" />
             <span>Hồ sơ</span>
           </button>
   
           {/* Nut Logout */}
           <button
             onClick={handleLogout}
             className="flex-1 flex justify-center items-center gap-2 px-3 py-3 bg-red-50/50 text-red-600 rounded-2xl hover:bg-red-500 hover:text-white hover:shadow-md hover:shadow-red-500/20 transition-all font-bold text-sm shrink-0 group"
             title="Đăng xuất"
           >
             <MdLogout className="text-[18px] group-hover:scale-110 transition-transform" />
             <span>Đăng xuất</span>
           </button>
        </div>
      </div>
    </aside>
  );
}
