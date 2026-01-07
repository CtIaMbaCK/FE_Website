'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import '@/components/ui/toggle'
import Toggle from '@/components/ui/toggle';

// 1. Định nghĩa kiểu dữ liệu cho Người cần giúp đỡ
interface NeedyUser {
  id: number;
  fullName: string;
  status: 'ACTIVE' | 'PENDING' | 'DENIED' | 'BANNED'; // Đã xác minh | Chờ duyệt | Từ chối
  createdAt: string;
}

// 2. Dữ liệu mẫu (Sau này sẽ thay bằng API gọi từ NestJS)
const MOCK_DATA: NeedyUser[] = [
  { id: 1, fullName: 'Nguyễn Văn An', status: 'ACTIVE', createdAt: '2023-10-15' },
  { id: 2, fullName: 'Trần Thị Bích', status: 'PENDING', createdAt: '2023-10-20' },
  { id: 3, fullName: 'Lê Văn Cường', status: 'DENIED', createdAt: '2023-10-22' },
  { id: 4, fullName: 'Phạm Thị Dung', status: 'BANNED', createdAt: '2023-10-25' },
  { id: 5, fullName: 'Hoàng Văn Em', status: 'PENDING', createdAt: '2023-10-28' },
];

export default function NeedyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  //Đưa dữ liệu vào State để có thể chỉnh sửa ---
  const [users, setUsers] = useState<NeedyUser[]>(MOCK_DATA);

  //Hàm xử lý Toggle cho từng dòng ---
  const handleToggleBan = (id: number, currentStatus: string) => {
    setUsers((prevUsers) => 
      prevUsers.map((user) => {
        if (user.id === id) {
          // Logic: Nếu đang bị BANNED thì mở lại (ACTIVE), ngược lại thì BANNED
          // Lưu ý: Logic này có thể tùy chỉnh (ví dụ: khôi phục về trạng thái cũ)
          const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
    
    // (Optional) Tại đây bạn có thể gọi API cập nhật lên Server NestJS
    // updateStatusAPI(id, newStatus)...
  };

  // Hàm render trạng thái với màu sắc tương ứng
  const renderStatus = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Đã xác minh</span>;
      case 'PENDING':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Chờ duyệt</span>;
      case 'DENIED':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Từ chối</span>;
      case 'BANNED':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Khóa tài khoản</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">Không rõ</span>;
    }
  };

  return (
    <div className="pb-10">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Người cần giúp đỡ</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh sách Người cần giúp đỡ</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Thêm Người cần giúp đỡ
        </button>
      </div>

      {/* --- TOOLBAR (SEARCH & FILTER) --- */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc SĐT..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white">
            <option value="">Tất cả trạng thái</option>
            <option value="VERIFIED">Đã xác minh</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="REJECTED">Từ chối</option>
          </select>
        </div>
      </div>

      {/* --- DATA TABLE --- */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ và tên</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {MOCK_DATA.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500">#{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {renderStatus(user.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-900">{user.createdAt}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* --- Gắn logic vào Toggle --- */}
                      <Toggle 
                        // Checked = true nếu trạng thái là BANNED
                        checked={user.status === 'BANNED'} 
                        // Khi click, gọi hàm xử lý cho ID cụ thể này
                        onChange={() => handleToggleBan(user.id, user.status)} 
                      />
                      <Button className='bg-white hover:bg-gray-100 border-2 border-gray-300'>Xem chi tiết</Button>
                      <Button className='text-white'>Duyệt</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION (Footer của bảng) --- */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">
            Hiển thị <span className="font-medium">1</span> đến <span className="font-medium">5</span> trong số <span className="font-medium">20</span> kết quả
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white disabled:opacity-50 text-sm text-gray-600">Trước</button>
            <button className="px-3 py-1 border border-primary bg-primary text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white text-sm text-gray-600">2</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white text-sm text-gray-600">3</button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-white text-sm text-gray-600">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}