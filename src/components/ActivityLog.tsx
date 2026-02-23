"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  activityLogService,
  ActivityLogEntry,
} from "@/services/activity-log.service";
import {
  MdHistory,
  MdPerson,
  MdRefresh,
  MdWarning,
  MdCheckCircle,
  MdCampaign,
  MdAssignment,
  MdStar,
  MdCardGiftcard,
  MdArticle,
  MdPersonAdd,
} from "react-icons/md";

const TYPE_ICONS: Record<string, React.ReactNode> = {
  EMERGENCY_SOS: <MdWarning className="text-red-600" />,
  REQUEST: <MdAssignment className="text-blue-600" />,
  REQUEST_ACCEPTED: <MdCheckCircle className="text-green-600" />,
  REQUEST_COMPLETED: <MdCheckCircle className="text-green-700" />,
  CAMPAIGN: <MdCampaign className="text-purple-600" />,
  CAMPAIGN_REGISTRATION: <MdPersonAdd className="text-indigo-600" />,
  REVIEW: <MdStar className="text-yellow-600" />,
  APPRECIATION: <MdCardGiftcard className="text-pink-600" />,
  POINTS: <MdCardGiftcard className="text-orange-600" />,
  CERTIFICATE: <MdCardGiftcard className="text-teal-600" />,
  POST: <MdArticle className="text-gray-600" />,
  USER_CREATED: <MdPersonAdd className="text-cyan-600" />,
};

const TYPE_COLORS: Record<string, string> = {
  EMERGENCY_SOS: "bg-red-100 text-red-800",
  REQUEST: "bg-blue-100 text-blue-800",
  REQUEST_ACCEPTED: "bg-green-100 text-green-800",
  REQUEST_COMPLETED: "bg-green-100 text-green-900",
  CAMPAIGN: "bg-purple-100 text-purple-800",
  CAMPAIGN_REGISTRATION: "bg-indigo-100 text-indigo-800",
  REVIEW: "bg-yellow-100 text-yellow-800",
  APPRECIATION: "bg-pink-100 text-pink-800",
  POINTS: "bg-orange-100 text-orange-800",
  CERTIFICATE: "bg-teal-100 text-teal-800",
  POST: "bg-gray-100 text-gray-800",
  USER_CREATED: "bg-cyan-100 text-cyan-800",
};

export default function ActivityLog() {
  const [activities, setActivities] = useState<ActivityLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(50);

  useEffect(() => {
    loadActivities();
  }, [limit]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityLogService.getAllActivities(limit);
      setActivities(data);
    } catch (error: any) {
      console.error("Error loading activities:", error);
      // Không hiển thị toast error để tránh spam, chỉ log
      if (error?.response?.status !== 401) {
        // Chỉ log lỗi không phải unauthorized
        console.error("Failed to load activity log");
      }
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
    <div className="flex flex-col h-full bg-slate-50/50 rounded-3xl p-6 border border-slate-100 shadow-[inset_0_2px_10px_rgba(0,0,0,0.02)]">
      
      {/* Cấu trúc Header xếp cùng 1 hàng */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* Nhóm Tiêu đề & Badge */}
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MdHistory size={26} className="text-[#008080]" />
            Nhật Ký Hoạt Động
          </h2>
          <span className="px-3 py-1 bg-white border border-slate-200 text-slate-600 rounded-full text-xs font-semibold shadow-sm">
            {activities.length} hoạt động
          </span>
        </div>

        {/* Nhóm Lọc và Làm mới */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-[#008080]/20 focus:border-[#008080] outline-none transition-all shadow-sm text-slate-700 flex-1 sm:flex-none"
          >
            <option value={50}>50 dòng</option>
            <option value={100}>100 dòng</option>
            <option value={200}>200 dòng</option>
          </select>
          <Button
            variant="outline"
            onClick={loadActivities}
            className="rounded-lg border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-slate-50 shadow-sm transition-all font-semibold px-4 py-2 h-auto"
          >
            <MdRefresh className="mr-1.5 w-4 h-4" />
            Làm mới
          </Button>
        </div>
      </div>

      {/* Danh sách */}
      {loading ? (
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#008080]/20 border-t-[#008080]"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <MdHistory className="text-slate-300" size={40} />
          </div>
          <p className="text-slate-500 font-medium">Chưa có hoạt động nào được ghi nhận</p>
        </div>
      ) : (
        <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-slate-200 transition-all duration-300"
              >
                {/* Icon */}
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-sm">
                  {TYPE_ICONS[activity.type] || <MdHistory className="text-slate-400" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-2">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-800 leading-snug">
                        {activity.action}
                      </p>
                      {activity.user && (
                        <div className="flex items-center gap-1.5 mt-2 bg-slate-50 w-fit px-2 py-1 rounded-md border border-slate-100">
                          <MdPerson className="text-slate-400" size={14} />
                          <span className="text-xs font-medium text-slate-600">
                            {activity.user.phoneNumber} <span className="text-slate-400">({activity.user.role})</span>
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Badge Trạng thái */}
                    <span
                      className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase whitespace-nowrap border self-start ${
                        TYPE_COLORS[activity.type]?.includes("text-red-800") ? "bg-red-50 text-red-600 border-red-100" :
                        TYPE_COLORS[activity.type]?.includes("text-blue-800") ? "bg-blue-50 text-blue-600 border-blue-100" :
                        TYPE_COLORS[activity.type]?.includes("text-green-800") ? "bg-green-50 text-green-600 border-green-100" :
                        TYPE_COLORS[activity.type]?.includes("text-green-900") ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        TYPE_COLORS[activity.type]?.includes("text-purple-800") ? "bg-purple-50 text-purple-600 border-purple-100" :
                        TYPE_COLORS[activity.type]?.includes("text-indigo-800") ? "bg-indigo-50 text-indigo-600 border-indigo-100" :
                        TYPE_COLORS[activity.type]?.includes("text-yellow-800") ? "bg-amber-50 text-amber-600 border-amber-100" :
                        TYPE_COLORS[activity.type]?.includes("text-pink-800") ? "bg-pink-50 text-pink-600 border-pink-100" :
                        TYPE_COLORS[activity.type]?.includes("text-orange-800") ? "bg-orange-50 text-orange-600 border-orange-100" :
                        TYPE_COLORS[activity.type]?.includes("text-teal-800") ? "bg-teal-50 text-teal-600 border-teal-100" :
                        TYPE_COLORS[activity.type]?.includes("text-cyan-800") ? "bg-cyan-50 text-cyan-600 border-cyan-100" :
                        "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {activity.type.replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-50">
                    <span className="text-xs font-medium text-slate-400">
                      {getRelativeTime(activity.createdAt)}
                    </span>
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && activity.metadata.status && (
                      <>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
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
