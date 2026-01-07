export default function PendingList() {
  return (
    <div className="rounded-lg bg-white border border-gray-200 shadow-sm h-full">
      <h2 className="text-gray-900 text-lg font-bold p-6 border-b border-gray-200">
        Chờ phê duyệt
      </h2>
      <div className="p-6 flex flex-col gap-4">
        
        {/* Item 1 */}
        <div className="flex items-center gap-4">
          <div className="bg-blue-100 text-blue-600 rounded-full size-10 flex items-center justify-center font-bold">
            J
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-medium text-sm">Jane Doe</p>
            <p className="text-gray-500 text-sm">Đơn tình nguyện viên mới</p>
          </div>
          <div className="flex gap-2">
            <button className="size-8 rounded-md bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
              <span className="material-symbols-outlined text-base">check</span>
            </button>
            <button className="size-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Item 2 */}
        <div className="flex items-center gap-4">
          <div className="bg-purple-100 text-purple-600 rounded-full size-10 flex items-center justify-center font-bold">
            J
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-medium text-sm">John Smith</p>
            <p className="text-gray-500 text-sm">Đơn tình nguyện viên mới</p>
          </div>
          <div className="flex gap-2">
            <button className="size-8 rounded-md bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
              <span className="material-symbols-outlined text-base">check</span>
            </button>
            <button className="size-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Item 3 */}
        <div className="flex items-center gap-4">
          <div className="bg-yellow-100 text-yellow-600 rounded-full size-10 flex items-center justify-center font-bold">
            E
          </div>
          <div className="flex-1">
            <p className="text-gray-900 font-medium text-sm">Emily White</p>
            <p className="text-gray-500 text-sm">Đơn tình nguyện viên mới</p>
          </div>
          <div className="flex gap-2">
            <button className="size-8 rounded-md bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-200 transition-colors">
              <span className="material-symbols-outlined text-base">check</span>
            </button>
            <button className="size-8 rounded-md bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-colors">
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        <button className="w-full mt-2 text-sm font-semibold text-primary hover:underline">
          Xem tất cả
        </button>
      </div>
    </div>
  );
}