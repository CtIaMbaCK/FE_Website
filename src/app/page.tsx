import StatsGrid from "@/components/StatsGrid";
import ActivityChart from "@/components/ActivityChart";
import PendingList from "@/components/PendingList";

export default function Dashboard() {
  return (
    <div className="pb-10"> 
      {/* 1. Phần thống kê (Stats Grid) */}
      <StatsGrid />

      {/* 2. Phần lưới chia cột cho Biểu đồ và Danh sách chờ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái chiếm 2 phần */}
        <ActivityChart />

        {/* Cột phải chiếm 1 phần */}
        <PendingList />
      </div>
    </div>
  );
}