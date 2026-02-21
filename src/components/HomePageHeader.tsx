'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getMe, logout } from '@/services/auth.service';

interface UserProfile {
  volunteerProfile?: {
    fullName: string;
  };
  beneficiaryProfile?: {
    fullName: string;
  };
  phoneNumber?: string;
}

export default function HomeHeader() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const profile = await getMe();
        setUser(profile);
      } catch (error) {
        // Chưa đăng nhập
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.push('/');
    router.refresh();
  };

  const getUserDisplayName = () => {
    if (user?.volunteerProfile?.fullName) {
      return user.volunteerProfile.fullName;
    }
    if (user?.beneficiaryProfile?.fullName) {
      return user.beneficiaryProfile.fullName;
    }
    return user?.phoneNumber || 'Người dùng';
  };

  return (
    <header className="bg-white/80 backdrop-blur-xl sticky top-0 h-20 w-full z-50 border-b border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.03)] transition-all duration-300 flex items-center">
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LEFT: Logo + Brand */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-80 transition group"
        >
          {/* LOGO */}
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-300 flex items-center justify-center p-1">
            <Image
              src="/images/Logo.png"
              alt="BetterUS Logo"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>

          {/* TEXT */}
          <h1 className="text-slate-900 text-xl font-black tracking-tight group-hover:text-[#008080] transition-colors duration-300">
            BetterUS
          </h1>
        </Link>

        {/* RIGHT: User Info or Login Button */}
        <div className="flex items-center gap-4">
          {loading ? (
            <div className="text-sm font-medium text-slate-400 animate-pulse bg-slate-100 px-4 py-2 rounded-full">Đang tải...</div>
          ) : user ? (
            <div className="flex items-center gap-3 bg-white/60 p-1 pr-5 rounded-full border border-slate-200/60 shadow-sm backdrop-blur-md">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#008080]/10 to-[#00A79D]/20 text-[#008080] flex items-center justify-center font-bold text-sm border border-[#008080]/20 shadow-inner">
                  {getUserDisplayName().charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-slate-600 font-medium whitespace-nowrap">
                Xin chào, <span className="font-bold text-slate-800">{getUserDisplayName()}</span>
              </span>
              <div className="w-px h-5 bg-slate-200 mx-1"></div>
              <button
                 onClick={handleLogout}
                 className="text-xs font-bold text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-full transition-colors duration-300"
              >
                 Đăng xuất
              </button>
            </div>
          ) : (
            <Button asChild size="default" className="rounded-full bg-gradient-to-r from-[#008080] to-[#00A79D] text-white hover:shadow-[0_8px_15px_rgba(0,128,128,0.2)] hover:-translate-y-0.5 transition-all duration-300 border-0 font-bold px-10 py-2.5 h-auto text-sm">
              <Link href="/login">
                Đăng nhập
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
