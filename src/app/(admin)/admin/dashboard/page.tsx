"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllBeneficiaries,
  getAllVolunteers,
  getAllOrganizations,
  getAllPosts,
} from "@/services/admin.service";
import Breadcrumb from "@/components/Breadcrumb";
import EmergencyDashboard from "@/components/EmergencyDashboard";
import ActivityLog from "@/components/ActivityLog";
import {
  MdPeople,
  MdVolunteerActivism,
  MdBusiness,
  MdArticle,
} from "react-icons/md";
import Link from "next/link";

// Component Card thong ke Soft UI
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorClass: string;
  iconBgClass: string;
  loading?: boolean;
}

function StatsCard({ title, value, icon, colorClass, iconBgClass, loading }: StatsCardProps) {
  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-slate-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group flex flex-col justify-center">
      
      <div className="flex items-center justify-between z-10">
        <div className="flex-1">
          <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">{title}</p>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#008080]/20 border-t-[#008080]"></div>
              <span className="text-slate-400 text-sm font-medium">Đang tải...</span>
            </div>
          ) : (
            <p className="text-4xl font-black text-slate-800 tracking-tight">{value.toLocaleString()}</p>
          )}
        </div>
        <div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-sm ${iconBgClass}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  // State de luu tong so cua tung loai
  const [stats, setStats] = useState({
    beneficiaries: 0,
    volunteers: 0,
    organizations: 0,
    posts: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch tat ca du lieu thong ke
  const fetchStats = async () => {
    try {
      setLoading(true);

      // Goi tat ca API song song de lay total count
      const [beneficiariesRes, volunteersRes, organizationsRes, postsRes] =
        await Promise.all([
          getAllBeneficiaries(undefined, undefined, 1, 1),
          getAllVolunteers(undefined, undefined, undefined, 1, 1),
          getAllOrganizations(undefined, undefined, 1, 1),
          getAllPosts(undefined, undefined, 1, 1),
        ]);

      setStats({
        beneficiaries: beneficiariesRes.total,
        volunteers: volunteersRes.total,
        organizations: organizationsRes.total,
        posts: postsRes.total,
      });
    } catch (error) {
      console.error("Loi fetch stats:", error);
      toast.error("Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  // Fetch khi component mount
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
        <Breadcrumb
          items={[
            { label: "Tổng quan" }
          ]}
        />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan hệ thống</h1>
          <p className="text-slate-500 font-medium mt-1">
            Theo dõi số lượng và các hoạt động đang diễn ra
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Người cần giúp đỡ"
          value={stats.beneficiaries}
          icon={<MdPeople />}
          colorClass="bg-blue-500"
          iconBgClass="bg-blue-50 text-blue-600"
          loading={loading}
        />

        <StatsCard
          title="Tình nguyện viên"
          value={stats.volunteers}
          icon={<MdVolunteerActivism />}
          colorClass="bg-[#008080]"
          iconBgClass="bg-gradient-to-br from-[#008080] to-[#00A79D] text-white shadow-[#008080]/30"
          loading={loading}
        />

        <StatsCard
          title="Tổ chức xã hội"
          value={stats.organizations}
          icon={<MdBusiness />}
          colorClass="bg-purple-500"
          iconBgClass="bg-purple-50 text-purple-600"
          loading={loading}
        />

        <StatsCard
          title="Bài viết truyền thông"
          value={stats.posts}
          icon={<MdArticle />}
          colorClass="bg-amber-500"
          iconBgClass="bg-amber-50 text-amber-600"
          loading={loading}
        />
      </div>

      {/* Emergency & Activity Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
               <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">SOS Mới nhất</h2>
               <div className="bg-rose-50/50 rounded-2xl p-1 overflow-hidden border border-rose-100/50">
                 <EmergencyDashboard />
               </div>
            </div>
         </div>
         <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] shadow-sm border border-slate-100 h-full flex flex-col">
               <div className="flex-1">
                 <ActivityLog />
               </div>
            </div>
         </div>
      </div>

      {/* Quick Links */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 mt-4">Truy cập nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/beneficiaries" className="block p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all hover:-translate-y-1 group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MdPeople className="text-blue-500 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Quản lý NCGĐ</h3>
                <p className="text-sm text-slate-500 font-medium">Truy cập danh sách</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/volunteers" className="block p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-[#008080]/30 transition-all hover:-translate-y-1 group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MdVolunteerActivism className="text-[#008080] text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Quản lý TNV</h3>
                <p className="text-sm text-slate-500 font-medium">Báo cáo & phê duyệt</p>
              </div>
            </div>
          </Link>

          <Link href="/admin/organizations" className="block p-6 bg-white/80 backdrop-blur-md rounded-3xl shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all hover:-translate-y-1 group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MdBusiness className="text-purple-500 text-2xl" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Quản lý TCXH</h3>
                <p className="text-sm text-slate-500 font-medium">Đối tác thiện nguyện</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
