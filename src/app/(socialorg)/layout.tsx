"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/socialorg/Sidebar";
import Header from "@/components/socialorg/Header";
import { getMe } from "@/services/auth.service";

export default function SocialOrgLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const profile = await getMe();
        if (profile.role !== "ORGANIZATION") {
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

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-gray-600">Đang kiểm tra quyền truy cập...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Sidebar cố định bên trái */}
      <Sidebar />

      {/* Phần nội dung chính bên phải */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {/* Header cố định ở trên cùng của phần nội dung */}
        <Header />

        {/* Nội dung thay đổi (Children) */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>
    </div>
  );
}