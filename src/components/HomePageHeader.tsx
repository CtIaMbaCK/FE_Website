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
    <header className="flex items-center justify-between border-b border-gray-200 bg-white sticky top-0 h-16 px-6 z-10">

      {/* LEFT: Logo + Brand */}
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-80 transition"
      >
        {/* LOGO */}
        <Image
          src="/images/Logo.png"
          alt="BetterUS Logo"
          width={32}
          height={32}
          className="object-contain"
        />

        {/* TEXT */}
        <h1 className="text-gray-900 text-lg font-bold leading-tight tracking-[-0.015em]">
          BetterUS
        </h1>
      </Link>

      {/* RIGHT: User Info or Login Button */}
      <div className="flex items-center gap-4">
        {loading ? (
          <div className="text-sm text-gray-500">Đang tải...</div>
        ) : user ? (
          <>
            <span className="text-sm text-gray-700">
              Xin chào, <span className="font-semibold">{getUserDisplayName()}</span>
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
            >
              Đăng xuất
            </Button>
          </>
        ) : (
          <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700">
            <Link href="/login">
              Đăng nhập
            </Link>
          </Button>
        )}
      </div>

    </header>
  );
}
