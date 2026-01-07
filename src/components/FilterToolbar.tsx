'use client';

interface FilterToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  // Bạn có thể thêm props cho Filter Status sau này
}

export default function FilterToolbar({ searchTerm, onSearchChange }: FilterToolbarProps) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
      <div className="relative w-full sm:w-96">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
        <input 
          type="text" 
          placeholder="Tìm kiếm theo tên" 
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="flex gap-3 w-full sm:w-auto">
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Đã xác minh</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="DENNIED">Chờ duyệt</option>
          <option value="BANNED">Từ chối</option>
        </select>
      </div>
    </div>
  );
}