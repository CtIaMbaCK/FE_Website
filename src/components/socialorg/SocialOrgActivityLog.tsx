"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { getRecentActivities } from "@/services/statistics.service";
import {
  MdHistory,
  MdPerson,
  MdRefresh,
  MdCheckCircle,
  MdCampaign,
  MdAssignment,
  MdArticle,
  MdPersonAdd,
} from "react-icons/md";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  REQUEST: <MdAssignment className="text-blue-600" />,
  REQUEST_ACCEPTED: <MdCheckCircle className="text-green-600" />,
  REQUEST_COMPLETED: <MdCheckCircle className="text-green-700" />,
  CAMPAIGN: <MdCampaign className="text-purple-600" />,
  CAMPAIGN_REGISTRATION: <MdPersonAdd className="text-indigo-600" />,
  POST: <MdArticle className="text-gray-600" />,
  USER_CREATED: <MdPersonAdd className="text-cyan-600" />,
};

const TYPE_COLORS: Record<string, string> = {
  REQUEST: "bg-blue-100 text-blue-800 border-blue-200",
  REQUEST_ACCEPTED: "bg-green-100 text-green-800 border-green-200",
  REQUEST_COMPLETED: "bg-green-100 text-green-900 border-green-200",
  CAMPAIGN: "bg-purple-100 text-purple-800 border-purple-200",
  CAMPAIGN_REGISTRATION: "bg-indigo-100 text-indigo-800 border-indigo-200",
  POST: "bg-gray-100 text-gray-800 border-gray-200",
  USER_CREATED: "bg-cyan-100 text-cyan-800 border-cyan-200",
};

const TYPE_TRANSLATIONS: Record<string, string> = {
  REQUEST: "Yêu cầu",
  REQUEST_ACCEPTED: "Đã nhận",
  REQUEST_COMPLETED: "Hoàn thành",
  CAMPAIGN: "Chiến dịch",
  CAMPAIGN_REGISTRATION: "Đăng ký Chiến dịch",
  POST: "Bài viết",
  USER_CREATED: "Người dùng mới",
};

const ROLE_TRANSLATIONS: Record<string, string> = {
  VOLUNTEER: "Tình nguyện viên",
  ORGANIZATION: "Tổ chức xã hội",
  BENEFICIARY: "Người cần giúp đỡ",
  ADMIN: "Quản trị viên",
};

export default function SocialOrgActivityLog() {
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    loadActivities();
  }, [limit]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await getRecentActivities(limit);
      setActivities(data);
    } catch (error: any) {
      console.error("Error loading activities:", error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center border border-teal-100">
             <MdHistory size={26} className="text-[#008080]" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
              Nhật Ký Tương Tác
            </h2>
            <p className="text-slate-500 font-medium text-sm mt-0.5">
               {activities.length} hoạt động gần đây liên quan đến Tổ chức
            </p>
          </div>
        </div>

        {/* Lọc và Làm mới */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="h-11 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-[#008080]/30 focus:border-[#008080] outline-none transition-all shadow-sm text-slate-700 flex-1 sm:flex-none cursor-pointer"
          >
            <option value={50}>50 sự kiện</option>
            <option value={100}>100 sự kiện</option>
            <option value={200}>200 sự kiện</option>
          </select>
          <Button
            variant="outline"
            onClick={loadActivities}
            className="rounded-xl bg-white border-slate-200 text-slate-700 hover:text-[#008080] hover:border-[#008080]/50 hover:bg-teal-50 shadow-sm transition-all font-bold px-5 h-11"
          >
            <MdRefresh className="mr-2 w-5 h-5" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Danh sách */}
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#008080]/20 border-t-[#008080] mb-4"></div>
          <p className="font-bold text-slate-500">Đang tải nhật ký...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200 text-center">
          <div className="w-20 h-20 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center mb-4">
            <MdHistory className="text-slate-300" size={40} />
          </div>
          <p className="text-slate-700 font-bold text-lg mb-1">Chưa có hoạt động nào</p>
          <p className="text-slate-500 font-medium text-sm">Các sự kiện và hoạt động của tổ chức sẽ xuất hiện ở đây.</p>
        </div>
      ) : (
        <div className="h-[600px] overflow-y-auto pr-3 custom-scrollbar">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex flex-col sm:flex-row sm:items-start gap-4 p-5 rounded-3xl bg-white border border-slate-100 hover:shadow-md hover:border-[#008080]/30 transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                  {TYPE_ICONS[activity.type] || <MdHistory className="text-slate-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <p className="text-[15px] font-bold text-slate-800 leading-snug">
                        {activity.action}
                      </p>
                      {activity.user && (
                        <div className="flex items-center gap-1.5 mt-2.5 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                          <MdPerson className="text-slate-400 text-sm" />
                          <span className="text-xs font-bold text-slate-700">
                            Người dùng liên quan: {activity.user.phoneNumber} <span className="text-slate-400 font-semibold">({ROLE_TRANSLATIONS[activity.user.role] || activity.user.role})</span>
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Badge Trạng thái hiện tại theo type */}
                    <span
                      className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-black tracking-widest uppercase whitespace-nowrap self-start shadow-sm border ${
                        TYPE_COLORS[activity.type] || "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {TYPE_TRANSLATIONS[activity.type] || activity.type.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-3 mt-3 border-t border-slate-50/80">
                     <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                       {getRelativeTime(activity.createdAt)}
                     </span>
                     {activity.metadata && Object.keys(activity.metadata).length > 0 && activity.metadata.status && (
                       <>
                         <span className="text-xs font-bold text-slate-600 bg-white border border-slate-200 px-2 py-1 rounded-md shadow-sm">
                           Trạng thái: {activity.metadata.status}
                         </span>
                       </>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
