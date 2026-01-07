export default function ActivityChart() {
  return (
    <div className="lg:col-span-2 rounded-lg bg-white border border-gray-200 shadow-sm flex flex-col h-full">
      <h2 className="text-gray-900 text-lg font-bold p-6 border-b border-gray-200">
        Tổng quan Hoạt động
      </h2>
      <div className="p-6 flex-1 flex items-center justify-center bg-gray-50 min-h-[300px]">
        {/* Placeholder cho biểu đồ sau này */}
        <div className="text-center">
          <span className="material-symbols-outlined text-6xl text-gray-300">bar_chart</span>
          <p className="text-gray-400 mt-2">Biểu đồ thống kê sẽ hiển thị tại đây</p>
        </div>
      </div>
    </div>
  );
}