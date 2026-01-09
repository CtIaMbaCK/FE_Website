import StatisticsChart from "@/components/StatisticsChart";

export default function ActivityChart() {
  return (
    <div className="lg:col-span-2 rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col h-full">
      <h2 className="text-gray-900 text-lg font-bold p-6 border-b border-gray-200">
        Tổng quan Hoạt động
      </h2>
      <StatisticsChart></StatisticsChart>
    </div>
  );
}