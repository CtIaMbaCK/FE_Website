'use client';

import React from 'react';
import {
  MdDownload,
  MdCalendarToday,
  MdArrowUpward,
  MdArrowDownward
} from 'react-icons/md';

import StatisticsChart from '@/components/StatisticsChart';

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
  Cell
} from 'recharts';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  { name: 'Tuần 1', value: 45 },
  { name: 'Tuần 2', value: 90 },
  { name: 'Tuần 3', value: 75 },
  { name: 'Tuần 4', value: 150 },
];

const needsChartData = [
  { name: 'Thực phẩm', value: 85 },
  { name: 'Chỗ ở', value: 60 },
  { name: 'Y tế', value: 45 },
  { name: 'Giáo dục', value: 30 },
  { name: 'Quần áo', value: 20 },
];

interface CustomTooltipProps {
  active?: boolean;
  label?: string;
  payload?: {
    value: number;
  }[];
}

// Custom Tooltip cho biểu đồ
const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded shadow-sm">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
          {label}
        </p>
        <p className="text-sm text-custom-teal">
          Số lượng: {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

export default function StatisticsPage() {
  return (
    <div className="pb-10">
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 lg:p-10">
         <div className="w-full max-w-7xl mx-auto flex flex-col gap-8">
            
            {/* 1. Page Header */}
            <div className="flex flex-wrap justify-between gap-4 items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Thống kê</h1>
                    <p className="text-sm text-gray-500 mt-1">Xem thống kê hoạt động và xuất báo cáo</p>
                </div>
               <Button variant="outline" className="gap-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 font-bold shadow-sm h-10 px-4">
                  <MdDownload className="text-lg" />
                  <span className="truncate">Xuất báo cáo</span>
               </Button>
            </div>

            {/* 2. Time Range Filters */}
            <div className="flex gap-2 py-1 overflow-x-auto no-scrollbar">
               <Button variant="ghost" className="h-9 bg-custom-teal/20 text-custom-teal hover:bg-custom-teal/30 hover:text-custom-teal font-medium rounded-lg px-4">
                  7 ngày qua
               </Button>
               <Button variant="ghost" className="h-9 bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium rounded-lg px-4 border border-transparent hover:border-gray-200">
                  30 ngày qua
               </Button>
               <Button variant="ghost" className="h-9 bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium rounded-lg px-4 border border-transparent hover:border-gray-200">
                  90 ngày qua
               </Button>
               <Button variant="ghost" className="h-9 bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium rounded-lg px-4 border border-transparent hover:border-gray-200">
                  Tất cả
               </Button>
               <Button variant="ghost" className="h-9 bg-white dark:bg-gray-800 text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-medium rounded-lg px-4 gap-2 border border-transparent hover:border-gray-200">
                  Tùy chỉnh
                  <MdCalendarToday className="text-lg" />
               </Button>
            </div>

            {/* 3. Summary Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
               <Card className="custom-card border-none bg-white dark:bg-gray-800">
                  <CardContent className="p-6 flex flex-col gap-2">
                     <p className="text-custom-text-light font-medium text-base">Tổng số Tình nguyện viên</p>
                     <p className="text-3xl font-bold text-gray-900 dark:text-white">1,240</p>
                     <div className="text-green-600 dark:text-green-500 text-sm font-medium flex items-center">
                        <MdArrowUpward className="text-base mr-1" /> +5%
                     </div>
                  </CardContent>
               </Card>
               <Card className="custom-card border-none bg-white dark:bg-gray-800">
                  <CardContent className="p-6 flex flex-col gap-2">
                     <p className="text-custom-text-light font-medium text-base">Tổng người cần giúp đỡ</p>
                     <p className="text-3xl font-bold text-gray-900 dark:text-white">5,820</p>
                     <div className="text-red-600 dark:text-red-500 text-sm font-medium flex items-center">
                        <MdArrowDownward className="text-base mr-1" /> -2%
                     </div>
                  </CardContent>
               </Card>
               <Card className="custom-card border-none bg-white dark:bg-gray-800">
                  <CardContent className="p-6 flex flex-col gap-2">
                     <p className="text-custom-text-light font-medium text-base">Hoạt động đã hoàn thành</p>
                     <p className="text-3xl font-bold text-gray-900 dark:text-white">315</p>
                     <div className="text-green-600 dark:text-green-500 text-sm font-medium flex items-center">
                        <MdArrowUpward className="text-base mr-1" /> +10%
                     </div>
                  </CardContent>
               </Card>
            </div>

            {/* 4. Charts Section (Grid 2 columns) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               
               {/* Chart 1: Volunteer Registrations (AREA CHART) */}
               <Card className="custom-card border-none bg-white dark:bg-gray-800 flex flex-col"> 
                     {/* --- Chart --- */}
                     <div className="flex-1 min-h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <StatisticsChart></StatisticsChart>
                        </ResponsiveContainer>
                     </div>
                     {/* ------------------------------------------- */}
               </Card>

               {/* Chart 2: Needs by Category (BAR CHART) */}
               <Card className="custom-card border-none bg-white dark:bg-gray-800">
                  <CardContent className="p-6 flex flex-col gap-6 h-full">
                     <div className="flex flex-col gap-1">
                        <p className="text-gray-800 dark:text-gray-200 text-base font-medium">Nhu cầu theo danh mục</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">Thực phẩm & Nhu yếu phẩm</p>
                        <div className="flex gap-2 items-center text-sm">
                           <span className="text-custom-text-light">danh mục được yêu cầu nhiều nhất</span>
                           <span className="text-green-600 dark:text-green-500 font-medium flex items-center">
                              <MdArrowUpward className="text-base mr-1" /> +3%
                           </span>
                        </div>
                     </div>
                     
                     {/* --- THAY ĐỔI: Sử dụng Recharts BarChart --- */}
                     <div className="flex-1 min-h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart 
                            layout="vertical" 
                            data={needsChartData} 
                            margin={{ top: 0, right: 30, left: 20, bottom: 0 }}
                          >
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={false} 
                              tickLine={false}
                              width={80}
                              tick={{fill: '#718096', fontSize: 12, fontWeight: 600}}
                            />
                            <Tooltip cursor={{fill: 'transparent'}} content={<CustomTooltip />} />
                            <Bar dataKey="value" barSize={12} radius={[4, 4, 4, 4]}>
                               {needsChartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill="#00A79D" />
                               ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                     </div>
                     {/* ------------------------------------------- */}

                  </CardContent>
               </Card>
            </div>

            {/* 5. Recent Activities Table */}
            <Card className="custom-card border-none bg-white dark:bg-gray-800 overflow-hidden">
               <CardHeader className="border-b border-gray-100 dark:border-gray-700 pb-4">
                  <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">Hoạt động gần đây</CardTitle>
               </CardHeader>
               <div className="overflow-x-auto">
                  <Table>
                     <TableHeader>
                        <TableRow className="hover:bg-transparent border-b border-gray-200 dark:border-gray-700">
                           <TableHead className="font-semibold text-gray-500">Tên hoạt động</TableHead>
                           <TableHead className="font-semibold text-gray-500">Ngày</TableHead>
                           <TableHead className="font-semibold text-gray-500">Tình nguyện viên</TableHead>
                           <TableHead className="font-semibold text-gray-500">Trạng thái</TableHead>
                        </TableRow>
                     </TableHeader>
                     <TableBody>
                        {[
                           { name: "Bếp ăn cộng đồng", date: "26-10-2023", vol: "15 / 20", status: "completed", statusLabel: "Đã hoàn thành" },
                           { name: "Quyên góp áo ấm", date: "05-11-2023", vol: "32 / 30", status: "inprogress", statusLabel: "Đang diễn ra" },
                           { name: "Chương trình gia sư", date: "12-11-2023", vol: "8 / 10", status: "upcoming", statusLabel: "Sắp tới" },
                           { name: "Dọn dẹp công viên", date: "15-10-2023", vol: "25 / 25", status: "completed", statusLabel: "Đã hoàn thành" },
                        ].map((activity, index) => {
                           let badgeColor = "";
                           if (activity.status === "completed") badgeColor = "bg-green-100 text-green-800 hover:bg-green-100";
                           else if (activity.status === "inprogress") badgeColor = "bg-blue-100 text-blue-800 hover:bg-blue-100";
                           else badgeColor = "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";

                           return (
                              <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 border-b border-gray-100 dark:border-gray-700 last:border-0">
                                 <TableCell className="font-medium text-gray-900 dark:text-gray-200">{activity.name}</TableCell>
                                 <TableCell className="text-gray-600 dark:text-gray-400">{activity.date}</TableCell>
                                 <TableCell className="text-gray-600 dark:text-gray-400">{activity.vol}</TableCell>
                                 <TableCell>
                                    <Badge variant="secondary" className={`font-medium border-none px-2.5 py-0.5 rounded-full ${badgeColor}`}>
                                       {activity.statusLabel}
                                    </Badge>
                                 </TableCell>
                              </TableRow>
                           )
                        })}
                     </TableBody>
                  </Table>
               </div>
            </Card>

         </div>
      </main>
    </div>
  );
}