"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MdHistory size={24} />
          Nhật Ký Hoạt Động
          <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
            {activities.length} hoạt động
          </span>
        </h2>
        <div className="flex gap-2">
          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value={50}>50 hoạt động</option>
            <option value={100}>100 hoạt động</option>
            <option value={200}>200 hoạt động</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={loadActivities}
            className="text-gray-600"
          >
            <MdRefresh className="mr-1" />
            Làm mới
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008080]"></div>
        </div>
      ) : activities.length === 0 ? (
        <div className="text-center py-12">
          <MdHistory className="mx-auto text-gray-400 mb-3" size={48} />
          <p className="text-gray-500">Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                {TYPE_ICONS[activity.type] || <MdHistory />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    {activity.user && (
                      <p className="text-xs text-gray-600 mt-1">
                        <MdPerson className="inline mr-1" size={14} />
                        {activity.user.phoneNumber} ({activity.user.role})
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                      TYPE_COLORS[activity.type] || "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {activity.type.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">
                    {getRelativeTime(activity.createdAt)}
                  </span>
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <span className="text-xs text-gray-400">•</span>
                  )}
                  {activity.metadata?.status && (
                    <span className="text-xs text-gray-500">
                      Trạng thái: {activity.metadata.status}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
