"use client";

import React, { useState, useEffect } from "react";
import {
  MdDownload,
  MdCalendarToday,
  MdArrowUpward,
  MdArrowDownward,
} from "react-icons/md";
import { toast } from "sonner";

import StatisticsChart from "@/components/StatisticsChart";
import {
  getOverviewStatistics,
  getVolunteerStatistics,
  getBeneficiaryStatistics,
  getCampaignStatistics,
  getActivityStatistics,
  getHelpRequestStatistics,
  OverviewStatistics,
  VolunteerStatistics,
  BeneficiaryStatistics,
  CampaignStatistics,
  ActivityStatistics,
  HelpRequestStatistics,
} from "@/services/statistics.service";

// Import Recharts
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Breadcrumb from "@/components/Breadcrumb";

// --- DỮ LIỆU MẪU CHO BIỂU ĐỒ ---
const volunteerChartData = [
  { name: "Tuần 1", value: 45 },
  { name: "Tuần 2", value: 90 },
  { name: "Tuần 3", value: 75 },
  { name: "Tuần 4", value: 150 },
];

const needsChartData = [
  { name: "Thực phẩm", value: 85 },
  { name: "Chỗ ở", value: 60 },
  { name: "Y tế", value: 45 },
  { name: "Giáo dục", value: 30 },
  { name: "Quần áo", value: 20 },
];

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: {
    value: number;
  }[];
}

// Custom Tooltip cho biểu đồ
const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
          {label}
        </p>
        <p className="text-sm text-custom-teal">Số lượng: {payload[0].value}</p>
      </div>
    );
  }

  return null;
};

export default function StatisticsPage() {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState<OverviewStatistics | null>(null);
  const [volunteers, setVolunteers] = useState<VolunteerStatistics | null>(
    null,
  );
  const [beneficiaries, setBeneficiaries] =
    useState<BeneficiaryStatistics | null>(null);
  const [campaigns, setCampaigns] = useState<CampaignStatistics | null>(null);
  const [activities, setActivities] = useState<ActivityStatistics | null>(null);
  const [helpRequests, setHelpRequests] =
    useState<HelpRequestStatistics | null>(null);

  const [selectedDays, setSelectedDays] = useState<number | null>(30);

  useEffect(() => {
    loadAllStatistics();
  }, [selectedDays]);

  const loadAllStatistics = async () => {
    try {
      setLoading(true);
      const [
        overviewData,
        volunteersData,
        beneficiariesData,
        campaignsData,
        activitiesData,
        helpRequestsData,
      ] = await Promise.all([
        getOverviewStatistics(),
        getVolunteerStatistics(),
        getBeneficiaryStatistics(),
        getCampaignStatistics(),
        getActivityStatistics(selectedDays || undefined),
        getHelpRequestStatistics(selectedDays || undefined),
      ]);

      setOverview(overviewData);
      setVolunteers(volunteersData);
      setBeneficiaries(beneficiariesData);
      setCampaigns(campaignsData);
      setActivities(activitiesData);
      setHelpRequests(helpRequestsData);
    } catch (error: any) {
      toast.error("Lỗi khi tải dữ liệu thống kê: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = () => {
    // Sử dụng browser print để xuất PDF
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Không thể mở cửa sổ in. Vui lòng cho phép popup.");
      return;
    }

    const currentDate = new Date().toLocaleDateString("vi-VN");
    const filterText = selectedDays
      ? `${selectedDays} ngày qua`
      : "Tất cả thời gian";

    printWindow.document.write(`
      <html>
        <head>
          <title>Báo cáo thống kê - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #008080; text-align: center; }
            h2 { color: #333; border-bottom: 2px solid #008080; padding-bottom: 5px; margin-top: 30px; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin: 20px 0; }
            .stat-card { border: 1px solid #ddd; padding: 15px; border-radius: 8px; }
            .stat-label { font-size: 14px; color: #666; }
            .stat-value { font-size: 32px; font-weight: bold; color: #333; margin: 10px 0; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #008080; color: white; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            @media print {
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          <h1>BÁO CÁO THỐNG KÊ TỔ CHỨC</h1>
          <p style="text-align: center; color: #666;">Ngày xuất: ${currentDate} | Bộ lọc: ${filterText}</p>

          <h2>Tổng quan</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Tổng TNV</div>
              <div class="stat-value">${overview?.totalVolunteers || 0}</div>
              <div class="stat-label" style="color: #22c55e;">+${overview?.newVolunteersThisMonth || 0} tháng này</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Tổng NCGĐ</div>
              <div class="stat-value">${overview?.totalBeneficiaries || 0}</div>
              <div class="stat-label" style="color: #22c55e;">+${overview?.newBeneficiariesThisMonth || 0} tháng này</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Tổng chiến dịch</div>
              <div class="stat-value">${overview?.totalCampaigns || 0}</div>
              <div class="stat-label">${overview?.ongoingCampaigns || 0} đang diễn ra</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Tổng bài viết</div>
              <div class="stat-value">${overview?.totalPosts || 0}</div>
            </div>
          </div>

          <h2>Top 5 Tình nguyện viên tiêu biểu</h2>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ tên</th>
                <th>Điểm tích lũy</th>
                <th>Lời cảm ơn</th>
              </tr>
            </thead>
            <tbody>
              ${
                volunteers?.topVolunteersByPoints
                  .slice(0, 5)
                  .map(
                    (v, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${v.fullName}</td>
                  <td>${v.points}</td>
                  <td>${v.totalThanks}</td>
                </tr>
              `,
                  )
                  .join("") ||
                '<tr><td colspan="4" style="text-align: center;">Chưa có dữ liệu</td></tr>'
              }
            </tbody>
          </table>

          <h2>Top 5 Chiến dịch nổi bật</h2>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên chiến dịch</th>
                <th>Số TNV đăng ký</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              ${
                campaigns?.topCampaignsByRegistrations
                  .slice(0, 5)
                  .map(
                    (c, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td>${c.title}</td>
                  <td>${c.currentVolunteers} / ${c.maxVolunteers}</td>
                  <td>${c.status === "ONGOING" ? "Đang diễn ra" : c.status === "COMPLETED" ? "Hoàn thành" : c.status}</td>
                </tr>
              `,
                  )
                  .join("") ||
                '<tr><td colspan="4" style="text-align: center;">Chưa có dữ liệu</td></tr>'
              }
            </tbody>
          </table>

          <div class="footer">
            <p>Báo cáo được tạo tự động từ hệ thống BetterUS</p>
            <p>© ${new Date().getFullYear()} BetterUS. All rights reserved.</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Đang tải thống kê...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10 min-h-screen">
      {/* Breadcrumb */}
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center mb-4">
          <Breadcrumb items={[{ label: "Báo cáo thống kê" }]} />
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col px-6">
        <div className="w-full mx-auto flex flex-col gap-8">
          {/* 1. Page Header */}
          <div className="flex flex-wrap justify-between gap-4 items-center">
            <div className="flex items-center gap-4">
              <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Thống kê</h1>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Xem thống kê hoạt động và xuất báo cáo
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="gap-2 bg-white/80 backdrop-blur-xl text-slate-700 border-slate-200 font-bold shadow-sm h-11 px-6 rounded-xl hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-all"
            >
              <MdDownload className="text-lg" />
              <span className="truncate">Xuất báo cáo PDF</span>
            </Button>
          </div>

          {/* 2. Time Range Filters */}
          <div className="flex gap-2 py-1 overflow-x-auto no-scrollbar bg-white/60 backdrop-blur-md p-1.5 rounded-2xl w-fit border border-slate-100 shadow-sm">
            <Button
              variant="ghost"
              onClick={() => setSelectedDays(30)}
              className={`h-10 font-bold rounded-xl px-5 transition-all ${
                selectedDays === 30
                  ? "bg-white text-[#008080] shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              30 ngày qua
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedDays(null)}
              className={`h-10 font-bold rounded-xl px-5 transition-all ${
                selectedDays === null
                  ? "bg-white text-[#008080] shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              Tất cả
            </Button>
          </div>

          {/* 3. Summary Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-16 h-16 bg-[#008080] rounded-full blur-2xl"></div>
               </div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Tổng TNV
              </p>
              <p className="text-4xl font-black text-slate-800">
                {overview?.totalVolunteers || 0}
              </p>
              {overview && overview.newVolunteersThisMonth > 0 && (
                <div className="text-teal-600 font-bold text-sm flex items-center mt-auto pt-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-teal-100 mr-1.5">
                     <MdArrowUpward className="text-xs" />
                  </span>
                  +{overview.newVolunteersThisMonth} tháng này
                </div>
              )}
            </div>
            
            <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-16 h-16 bg-orange-500 rounded-full blur-2xl"></div>
               </div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Tổng NCGĐ
              </p>
              <p className="text-4xl font-black text-slate-800">
                {overview?.totalBeneficiaries || 0}
              </p>
              {overview && overview.newBeneficiariesThisMonth > 0 && (
                <div className="text-orange-500 font-bold text-sm flex items-center mt-auto pt-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 mr-1.5">
                     <MdArrowUpward className="text-xs" />
                  </span>
                  +{overview.newBeneficiariesThisMonth} tháng này
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-16 h-16 bg-blue-500 rounded-full blur-2xl"></div>
               </div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Tổng chiến dịch
              </p>
              <p className="text-4xl font-black text-slate-800">
                {overview?.totalCampaigns || 0}
              </p>
              <p className="text-sm font-bold text-blue-500 mt-auto pt-2 flex items-center">
                 <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                {overview?.ongoingCampaigns || 0} đang diễn ra
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] p-6 shadow-sm flex flex-col gap-2 hover:shadow-md transition-shadow relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <div className="w-16 h-16 bg-purple-500 rounded-full blur-2xl"></div>
               </div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wider">
                Tổng bài viết
              </p>
              <p className="text-4xl font-black text-slate-800">
                {overview?.totalPosts || 0}
              </p>
            </div>
          </div>

          {/* 4. Charts Section (Grid 2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: HelpRequest Statistics */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-sm flex flex-col p-6 h-full">
                <div className="flex flex-col gap-1 mb-6">
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
                    Thống kê hoạt động
                  </p>
                  <p className="text-2xl font-black text-slate-800">
                    {helpRequests
                      ? helpRequests.helpRequestsByStatus.reduce(
                          (sum: number, item: any) => sum + item.count,
                          0,
                        )
                      : 0}{" "}
                    <span className="text-lg font-bold text-slate-500">hoạt động</span>
                  </p>
                </div>

                {helpRequests &&
                helpRequests.helpRequestsByStatus.length > 0 ? (
                  <div className="flex-1 space-y-3">
                    {helpRequests.helpRequestsByStatus.map((item: any) => {
                      const statusLabels: Record<string, string> = {
                        PENDING: "Chờ xử lý",
                        APPROVED: "Đã duyệt",
                        ONGOING: "Đang diễn ra",
                        COMPLETED: "Hoàn thành",
                        CANCELLED: "Đã hủy",
                        REJECTED: "Từ chối",
                      };
                      const statusColors: Record<string, string> = {
                        PENDING: "bg-yellow-50 text-yellow-600 border-yellow-200",
                        APPROVED: "bg-blue-50 text-blue-600 border-blue-200",
                        ONGOING: "bg-purple-50 text-purple-600 border-purple-200",
                        COMPLETED: "bg-green-50 text-green-600 border-green-200",
                        CANCELLED: "bg-slate-50 text-slate-600 border-slate-200",
                        REJECTED: "bg-red-50 text-red-600 border-red-200",
                      };
                      return (
                        <div
                          key={item.status}
                          className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-shadow"
                        >
                          <Badge
                            className={`px-3 py-1 font-bold ${statusColors[item.status] || "bg-slate-50 text-slate-600 border-slate-200"} hover:${statusColors[item.status] || "bg-slate-50"} border shadow-none uppercase tracking-wide text-xs`}
                          >
                            {statusLabels[item.status] || item.status}
                          </Badge>
                          <span className="text-xl font-black text-slate-800">
                            {item.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                     <p className="text-slate-400 font-medium text-center">
                       Chưa có dữ liệu hoạt động
                     </p>
                  </div>
                )}
            </div>

            {/* Chart 2: Top Campaigns */}
            <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-sm flex flex-col p-6 h-full">
                <div className="flex flex-col gap-1 mb-6">
                  <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">
                    Chiến dịch nổi bật
                  </p>
                  <p className="text-2xl font-black text-slate-800">
                    Top TNV đăng ký
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {campaigns?.topCampaignsByRegistrations &&
                  campaigns.topCampaignsByRegistrations.length > 0 ? (
                    <div className="space-y-3">
                      {campaigns.topCampaignsByRegistrations
                        .slice(0, 5)
                        .map((campaign, index) => (
                          <div
                            key={campaign.id}
                            className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl hover:shadow-sm transition-shadow group"
                          >
                            <div className="flex-1 min-w-0 pr-4">
                              <p className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-teal-600 transition-colors">
                                {campaign.title}
                              </p>
                              <div className="flex items-center gap-4 mt-2">
                                <p className="text-xs font-bold text-slate-500 bg-slate-50 px-2 py-1 rounded-md">
                                  {campaign.currentVolunteers} /{" "}
                                  {campaign.maxVolunteers} TNV
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center shrink-0">
                              <Badge
                                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 ${
                                  campaign.status === "ONGOING"
                                    ? "bg-blue-50 text-blue-600 hover:bg-blue-50"
                                    : campaign.status === "COMPLETED"
                                      ? "bg-green-50 text-green-600 hover:bg-green-50"
                                      : campaign.status === "PENDING"
                                        ? "bg-yellow-50 text-yellow-600 hover:bg-yellow-50"
                                        : "bg-slate-50 text-slate-600 hover:bg-slate-50"
                                } shadow-none`}
                              >
                                {campaign.status === "ONGOING"
                                  ? "Đang diễn ra"
                                  : campaign.status === "COMPLETED"
                                    ? "Hoàn thành"
                                    : campaign.status === "PENDING"
                                      ? "Chờ duyệt"
                                      : campaign.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 h-full">
                       <p className="text-slate-400 font-medium text-center">
                         Chưa có dữ liệu chiến dịch
                       </p>
                    </div>
                  )}
                </div>
            </div>
          </div>

          {/* 5. Top Volunteers Table */}
          <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100/60 bg-slate-50/30">
              <h2 className="text-lg font-black text-slate-800">
                Tình nguyện viên tiêu biểu
              </h2>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-slate-100/60 bg-slate-50/30">
                    <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs px-6 py-4">
                      Họ và tên
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs px-6 py-4">
                      Điểm tích lũy
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs px-6 py-4">
                      Lời cảm ơn
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 uppercase tracking-wider text-xs px-6 py-4">
                      Số chiến dịch
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {volunteers?.topVolunteersByPoints &&
                  volunteers.topVolunteersByPoints.length > 0 ? (
                    volunteers.topVolunteersByPoints
                      .slice(0, 5)
                      .map((volunteer, index) => {
                        const campaignInfo =
                          volunteers.topVolunteersByCampaigns.find(
                            (v) => v.userId === volunteer.userId,
                          );
                        return (
                          <TableRow
                            key={volunteer.userId}
                            className="hover:bg-slate-50/50 border-b border-slate-50 last:border-0 transition-colors"
                          >
                            <TableCell className="font-bold text-slate-800 px-6 py-4">
                              <div className="flex items-center gap-3">
                                {volunteer.avatarUrl ? (
                                  <img
                                    src={volunteer.avatarUrl}
                                    alt={volunteer.fullName}
                                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-slate-100"
                                  />
                                ) : (
                                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-[#008080] text-white flex items-center justify-center font-bold shadow-sm">
                                      {volunteer.fullName.charAt(0)}
                                   </div>
                                )}
                                <span>{volunteer.fullName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="px-6 py-4">
                              <Badge className="bg-purple-50 text-purple-600 hover:bg-purple-50 font-bold px-2.5 py-1 shadow-none">
                                {volunteer.points} điểm
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-600 font-medium px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                 <span className="w-5 h-5 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-xs">♥</span>
                                 {volunteer.totalThanks}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600 font-medium px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                 <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center text-xs">★</span>
                                 {campaignInfo?.campaignCount || 0}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-12"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                           <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                              <span className="text-2xl text-slate-300">📊</span>
                           </div>
                           <p className="font-medium">Chưa có dữ liệu tình nguyện viên</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
