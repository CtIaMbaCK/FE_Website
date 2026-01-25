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
    <div className="pb-10">
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 lg:p-10">
        <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
          {/* 1. Page Header */}
          <div className="flex flex-wrap justify-between gap-4 items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
              <p className="text-sm text-gray-500 mt-1">
                Xem thống kê hoạt động và xuất báo cáo
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleExportPDF}
              className="gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 font-bold shadow-sm h-10 px-4 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-300"
            >
              <MdDownload className="text-lg" />
              <span className="truncate">Xuất báo cáo PDF</span>
            </Button>
          </div>

          {/* 2. Time Range Filters */}
          <div className="flex gap-2 py-1 overflow-x-auto no-scrollbar">
            <Button
              variant="ghost"
              onClick={() => setSelectedDays(30)}
              className={`h-9 font-medium rounded-lg px-4 ${
                selectedDays === 30
                  ? "bg-custom-teal/20 text-custom-teal hover:bg-custom-teal/30 hover:text-custom-teal"
                  : "bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200"
              }`}
            >
              30 ngày qua
            </Button>
            <Button
              variant="ghost"
              onClick={() => setSelectedDays(null)}
              className={`h-9 font-medium rounded-lg px-4 ${
                selectedDays === null
                  ? "bg-custom-teal/20 text-custom-teal hover:bg-custom-teal/30 hover:text-custom-teal"
                  : "bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100 hover:text-gray-900 border border-transparent hover:border-gray-200"
              }`}
            >
              Tất cả
            </Button>
          </div>

          {/* 3. Summary Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="custom-card border-none bg-white dark:bg-gray-800">
              <CardContent className="p-6 flex flex-col gap-2">
                <p className="text-custom-text-light font-medium text-base">
                  Tổng số Tình nguyện viên
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overview?.totalVolunteers || 0}
                </p>
                {overview && overview.newVolunteersThisMonth > 0 && (
                  <div className="text-green-600 dark:text-green-500 text-sm font-medium flex items-center">
                    <MdArrowUpward className="text-base mr-1" /> +
                    {overview.newVolunteersThisMonth} tháng này
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="custom-card border-none bg-white dark:bg-gray-800">
              <CardContent className="p-6 flex flex-col gap-2">
                <p className="text-custom-text-light font-medium text-base">
                  Tổng người cần giúp đỡ
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overview?.totalBeneficiaries || 0}
                </p>
                {overview && overview.newBeneficiariesThisMonth > 0 && (
                  <div className="text-green-600 dark:text-green-500 text-sm font-medium flex items-center">
                    <MdArrowUpward className="text-base mr-1" /> +
                    {overview.newBeneficiariesThisMonth} tháng này
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="custom-card border-none bg-white dark:bg-gray-800">
              <CardContent className="p-6 flex flex-col gap-2">
                <p className="text-custom-text-light font-medium text-base">
                  Tổng số chiến dịch
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overview?.totalCampaigns || 0}
                </p>
                <p className="text-sm text-gray-600">
                  {overview?.ongoingCampaigns || 0} đang diễn ra
                </p>
              </CardContent>
            </Card>
            <Card className="custom-card border-none bg-white dark:bg-gray-800">
              <CardContent className="p-6 flex flex-col gap-2">
                <p className="text-custom-text-light font-medium text-base">
                  Tổng bài viết
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {overview?.totalPosts || 0}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* 4. Charts Section (Grid 2 columns) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: HelpRequest Statistics */}
            <Card className="custom-card border-none bg-white dark:bg-gray-800 flex flex-col">
              <CardContent className="p-6 flex flex-col gap-4 h-full">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-800 dark:text-gray-200 text-base font-medium">
                    Thống kê hoạt động
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {helpRequests
                      ? helpRequests.helpRequestsByStatus.reduce(
                          (sum: number, item: any) => sum + item.count,
                          0,
                        )
                      : 0}{" "}
                    hoạt động
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
                        PENDING: "bg-yellow-100 text-yellow-800",
                        APPROVED: "bg-blue-100 text-blue-800",
                        ONGOING: "bg-purple-100 text-purple-800",
                        COMPLETED: "bg-green-100 text-green-800",
                        CANCELLED: "bg-gray-100 text-gray-800",
                        REJECTED: "bg-red-100 text-red-800",
                      };
                      return (
                        <div
                          key={item.status}
                          className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                        >
                          <Badge
                            className={`${statusColors[item.status] || "bg-gray-100 text-gray-800"} hover:${statusColors[item.status] || "bg-gray-100"}`}
                          >
                            {statusLabels[item.status] || item.status}
                          </Badge>
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {item.count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">
                    Chưa có dữ liệu hoạt động
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Chart 2: Top Campaigns */}
            <Card className="custom-card border-none bg-white dark:bg-gray-800">
              <CardContent className="p-6 flex flex-col gap-6 h-full">
                <div className="flex flex-col gap-1">
                  <p className="text-gray-800 dark:text-gray-200 text-base font-medium">
                    Chiến dịch nổi bật
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
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
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 dark:text-white text-sm line-clamp-1">
                                {campaign.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {campaign.currentVolunteers} /{" "}
                                {campaign.maxVolunteers} TNV
                              </p>
                            </div>
                            <div className="ml-3 flex items-center gap-2">
                              <Badge
                                className={`text-xs ${
                                  campaign.status === "ONGOING"
                                    ? "bg-blue-100 text-blue-800"
                                    : campaign.status === "COMPLETED"
                                      ? "bg-green-100 text-green-800"
                                      : campaign.status === "PENDING"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
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
                    <p className="text-gray-500 text-sm text-center py-8">
                      Chưa có dữ liệu chiến dịch
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 5. Top Volunteers Table */}
          <Card className="custom-card border-none bg-white dark:bg-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
                Tình nguyện viên tiêu biểu
              </CardTitle>
            </CardHeader>
            <div className="overflow-x-auto ">
              <Table >
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
                    <TableHead className="font-semibold text-gray-500 px-6">
                      Họ và tên
                    </TableHead>
                    <TableHead className="font-semibold text-gray-500 px-6">
                      Điểm tích lũy
                    </TableHead>
                    <TableHead className="font-semibold text-gray-500 px-6">
                      Lời cảm ơn
                    </TableHead>
                    <TableHead className="font-semibold text-gray-500 px-6">
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
                            className="hover:bg-gray-50 dark:hover:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 last:border-0"
                          >
                            <TableCell className="font-medium text-gray-900 dark:text-gray-200 px-6">
                              <div className="flex items-center gap-3">
                                {volunteer.avatarUrl && (
                                  <img
                                    src={volunteer.avatarUrl}
                                    alt={volunteer.fullName}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                )}
                                <span>{volunteer.fullName}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 px-6">
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                {volunteer.points} điểm
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 px-6">
                              {volunteer.totalThanks}
                            </TableCell>
                            <TableCell className="text-gray-600 dark:text-gray-400 px-6">
                              {campaignInfo?.campaignCount || 0}
                            </TableCell>
                          </TableRow>
                        );
                      })
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-8"
                      >
                        Chưa có dữ liệu tình nguyện viên
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
