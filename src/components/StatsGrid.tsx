export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Card 1 */}
      <div className="flex flex-col gap-2 rounded-lg p-6 bg-white border border-gray-200 shadow-sm">
        <p className="text-gray-600 text-sm font-medium leading-normal">Tổng số Tình nguyện viên</p>
        <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">1,234</p>
        <p className="text-green-600 text-sm font-medium leading-normal">+2.5% so với tháng trước</p>
      </div>

      {/* Card 2 */}
      <div className="flex flex-col gap-2 rounded-lg p-6 bg-white border border-gray-200 shadow-sm">
        <p className="text-gray-600 text-sm font-medium leading-normal">Yêu cầu đang mở</p>
        <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">56</p>
        <p className="text-red-600 text-sm font-medium leading-normal">-1.2% so với tháng trước</p>
      </div>

      {/* Card 3 */}
      <div className="flex flex-col gap-2 rounded-lg p-6 bg-white border border-gray-200 shadow-sm">
        <p className="text-gray-600 text-sm font-medium leading-normal">Kết nối thành công</p>
        <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">892</p>
        <p className="text-green-600 text-sm font-medium leading-normal">+5.0% so với tháng trước</p>
      </div>

      {/* Card 4 */}
      <div className="flex flex-col gap-2 rounded-lg p-6 bg-white border border-gray-200 shadow-sm">
        <p className="text-gray-600 text-sm font-medium leading-normal">Đăng ký mới (7 ngày)</p>
        <p className="text-gray-900 tracking-tight text-3xl font-bold leading-tight">42</p>
        <p className="text-green-600 text-sm font-medium leading-normal">+15% so với tuần trước</p>
      </div>
    </div>
  );
}