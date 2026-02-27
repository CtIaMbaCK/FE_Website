"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  MdPeople,
  MdVolunteerActivism,
  MdCampaign,
  MdArticle,
} from "react-icons/md";
import Breadcrumb from "@/components/Breadcrumb";
import SocialOrgActivityLog from "@/components/socialorg/SocialOrgActivityLog";
import {
  getOverviewStatistics,
  OverviewStatistics,
} from "@/services/statistics.service";

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
  const [overview, setOverview] = useState<OverviewStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch thong ke
  const fetchStats = async () => {
    try {
      setLoading(true);
      const overviewData = await getOverviewStatistics();
      setOverview(overviewData);
    } catch (error) {
      console.error("Loi fetch stats:", error);
      toast.error("Không thể tải thống kê");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
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
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Tổng quan tổ chức</h1>
          <p className="text-slate-500 font-medium mt-1">
            Theo dõi số lượng và các hoạt động đang diễn ra của tổ chức
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Người cần giúp đỡ"
          value={overview?.totalBeneficiaries || 0}
          icon={<MdPeople />}
          colorClass="bg-blue-500"
          iconBgClass="bg-blue-50 text-blue-600"
          loading={loading}
        />

        <StatsCard
          title="Tình nguyện viên"
          value={overview?.totalVolunteers || 0}
          icon={<MdVolunteerActivism />}
          colorClass="bg-[#008080]"
          iconBgClass="bg-gradient-to-br from-[#008080] to-[#00A79D] text-white shadow-[#008080]/30"
          loading={loading}
        />

        <StatsCard
          title="Tổng chiến dịch"
          value={overview?.totalCampaigns || 0}
          icon={<MdCampaign />}
          colorClass="bg-purple-500"
          iconBgClass="bg-purple-50 text-purple-600"
          loading={loading}
        />

        <StatsCard
          title="Bài viết truyền thông"
          value={overview?.totalPosts || 0}
          icon={<MdArticle />}
          colorClass="bg-amber-500"
          iconBgClass="bg-amber-50 text-amber-600"
          loading={loading}
        />
      </div>

      {/* Layout Option 1: Log (70%) - Quick Links (30%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Cot trai chieu 2 phan cho Nhat ky hoat dong */}
         <div className="lg:col-span-2">
            <SocialOrgActivityLog />
         </div>

         {/* Cot phai chiem 1 phan cho Truy cap nhanh */}
         <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                 Truy cập nhanh
              </h2>
              <div className="flex flex-col gap-4">
                <Link href="/socialorg/bficiary" className="block p-5 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all hover:-translate-y-1 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-blue-500/10 transition-colors"></div>
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <MdPeople className="text-blue-500 text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">Người cần giúp đỡ</h3>
                      <p className="text-sm text-slate-500 font-medium">Truy cập danh sách</p>
                    </div>
                  </div>
                </Link>

                <Link href="/socialorg/volunteers" className="block p-5 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-[#008080]/30 transition-all hover:-translate-y-1 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#008080]/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-[#008080]/10 transition-colors"></div>
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-[#008080]/10 border border-[#008080]/20 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <MdVolunteerActivism className="text-[#008080] text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-[#008080] transition-colors">Tình nguyện viên</h3>
                      <p className="text-sm text-slate-500 font-medium">Báo cáo & phê duyệt</p>
                    </div>
                  </div>
                </Link>

                <Link href="/socialorg/manage-events" className="block p-5 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-purple-200 transition-all hover:-translate-y-1 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-purple-500/10 transition-colors"></div>
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <MdCampaign className="text-purple-500 text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-purple-600 transition-colors">Quản lý chiến dịch</h3>
                      <p className="text-sm text-slate-500 font-medium">Tổ chức sự kiện</p>
                    </div>
                  </div>
                </Link>

                <Link href="/socialorg/blogs" className="block p-5 bg-white/80 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-amber-200 transition-all hover:-translate-y-1 group relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-amber-500/10 transition-colors"></div>
                  <div className="flex items-center gap-5 relative z-10">
                    <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform">
                      <MdArticle className="text-amber-500 text-2xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-amber-600 transition-colors">Quản lý bài viết</h3>
                      <p className="text-sm text-slate-500 font-medium">Truyền thông tin tức</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
         </div>
      </div>
    </div>
  );
}