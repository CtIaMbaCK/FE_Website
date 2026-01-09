'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

// --- DỮ LIỆU GIẢ ---
const chartData = [
  { month: "Tháng 1", volunteers: 2400 },
  { month: "Tháng 2", volunteers: 1398 },
  { month: "Tháng 3", volunteers: 9800 },
  { month: "Tháng 4", volunteers: 3908 },
  { month: "Tháng 5", volunteers: 4800 },
  { month: "Tháng 6", volunteers: 3800 },
  { month: "Tháng 7", volunteers: 4300 },
];

// --- CẤU HÌNH CHART (Shadcn Style) ---
const chartConfig = {
  volunteers: {
    label: "Tình nguyện viên",
    // Quy định màu của chart
    color: "#00A79D", 
  },
} satisfies ChartConfig;

interface StatisticsChartProps {
  title?: string;
  description?: string;
  className?: string;
}

export default function StatisticsChart({ 
  title = "Thống kê hoạt động", 
  description = "Số lượng tình nguyện viên tham gia trong 7 tháng qua",
  className 
}: StatisticsChartProps) {
  return (
    <Card className={`custom-card border-none bg-white dark:bg-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </CardTitle>
        <CardDescription className="text-custom-text-light">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Container của Shadcn Chart */}
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: -20, // Căn chỉnh lề trái để số không bị cắt
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#E2E8F0" />
            
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 7)} // Cắt chuỗi nếu cần
              style={{ fill: '#718096', fontSize: '12px' }}
            />

            <YAxis 
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              style={{ fill: '#718096', fontSize: '12px' }}
            />

            {/* Tooltip chuẩn của Shadcn */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />

            {/* Area Chart */}
            <Area
              dataKey="volunteers"
              type="natural" // Hoặc "monotone"
              fill="var(--color-volunteers)" // Biến CSS tự động sinh ra từ config
              fillOpacity={0.2}
              stroke="var(--color-volunteers)"
              strokeWidth={3}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}