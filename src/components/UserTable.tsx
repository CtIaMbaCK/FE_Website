'use client';

import { Button } from '@/components/ui/button';
import Toggle from '@/components/ui/toggle'; // Import Toggle của bạn
import { User } from '@/types'; // Import Type từ bước 1
import Link from 'next/link';
import { NeedyUser } from '@/data/mockData';

interface UserTableProps {
  data: NeedyUser[]; 
  onToggleBan: (id: string, status: string) => void;
}

export default function UserTable({ data, onToggleBan }: UserTableProps) {
  
  // Hàm render status chỉ phục vụ hiển thị
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-10">STT</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Họ và tên</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Trạng thái</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ngày tạo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-gray-500" title={user.id}>
                    {index+1}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{user.fullName}</span>
                  </td>
                  <td className="px-6 py-4">{renderStatus(user.status)}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{user.createdAt}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Toggle 
                        checked={user.status === 'BANNED'} 
                        onChange={() => onToggleBan(user.id, user.status)} 
                      />
                      <Link href={`/socialorg/bficiary/${user.id}`}>
                        <Button className='bg-white hover:bg-gray-100 border-2 border-gray-300 text-black'>
                          Xem chi tiết
                        </Button>
                      </Link>
                      <Button className='text-white bg-primary hover:bg-teal-700'>Duyệt</Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
          <p className="text-sm text-gray-500">Hiển thị {data.length} kết quả</p>
          {/* Bạn có thể tách Pagination thành component riêng sau này */}
      </div>
    </div>
  );
}