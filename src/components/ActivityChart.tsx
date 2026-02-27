"use client";

import dynamic from "next/dynamic";

const StatisticsChart = dynamic(() => import("@/components/StatisticsChart"), { ssr: false });

export default function ActivityChart() {
  return (
    <div className="lg:col-span-2 rounded-[2rem] bg-white/80 backdrop-blur-xl border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-slate-100/60 bg-slate-50/30">
        <h2 className="text-slate-900 text-lg font-black tracking-tight">
          Tổng quan Hoạt động
        </h2>
      </div>
      <div className="p-6 flex-1">
        <StatisticsChart />
      </div>
    </div>
  );
}