"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllBeneficiaries,
  getAllVolunteers,
  getAllOrganizations,
  getAllPosts,
} from "@/services/admin.service";
import { Card } from "@/components/ui/card";
import Breadcrumb from "@/components/Breadcrumb";
import EmergencyDashboard from "@/components/EmergencyDashboard";
import ActivityLog from "@/components/ActivityLog";
import {
  MdPeople,
  MdVolunteerActivism,
  MdBusiness,
  MdArticle,
} from "react-icons/md";

// Component Card thong ke
interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}

function StatsCard({ title, value, icon, color, loading }: StatsCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#008080]"></div>
              <span className="text-gray-400">Đang tải...</span>
            </div>
          ) : (
            <p className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</p>
          )}
        </div>
        <div
          className={`w-14 h-14 rounded-lg flex items-center justify-center text-white ${color}`}
        >
          {icon}
        </div>
      </div>
    </Card>
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
          getAllBeneficiaries(undefined, undefined, 1, 1), // Chi can lay page 1 voi limit 1 de lay total
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
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Tổng quan" }
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-2">
          Thống kê tổng quan hệ thống quản lý
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Người cần giúp đỡ"
          value={stats.beneficiaries}
          icon={<MdPeople size={28} />}
          color="bg-blue-500"
          loading={loading}
        />

        <StatsCard
          title="Tình nguyện viên"
          value={stats.volunteers}
          icon={<MdVolunteerActivism size={28} />}
          color="bg-[#008080]"
          loading={loading}
        />

        <StatsCard
          title="Tổ chức xã hội"
          value={stats.organizations}
          icon={<MdBusiness size={28} />}
          color="bg-purple-500"
          loading={loading}
        />

        <StatsCard
          title="Bài viết"
          value={stats.posts}
          icon={<MdArticle size={28} />}
          color="bg-orange-500"
          loading={loading}
        />
      </div>

      {/* Emergency SOS Section */}
      <EmergencyDashboard />

      {/* Activity Log Section */}
      <ActivityLog />

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <MdPeople size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quản lý NCGĐ</h3>
              <p className="text-sm text-gray-600">
                Xem và quản lý người cần giúp đỡ
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
              <MdVolunteerActivism size={24} className="text-[#008080]" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quản lý TNV</h3>
              <p className="text-sm text-gray-600">
                Xem và quản lý tình nguyện viên
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <MdBusiness size={24} className="text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Quản lý TCXH</h3>
              <p className="text-sm text-gray-600">
                Xem và quản lý tổ chức xã hội
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
