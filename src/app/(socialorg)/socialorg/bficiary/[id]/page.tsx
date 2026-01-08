'use client';

import { MOCK_DATA } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // 1. Import hook này
import { useEffect, useState } from 'react';

export default function EditBeneficiaryPage() {
  // 2. Lấy params thông qua hook thay vì props
  const params = useParams();
  
  // 3. Debug: Kiểm tra xem ID nhận được là gì
  // Mở F12 (Console) trên trình duyệt để xem dòng này in ra gì
  console.log("ID từ URL:", params?.id); 

  // 4. Tìm user
  // Lưu ý: params.id có thể là string hoặc string array, nên ta ép kiểu an toàn
  const userId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const user = MOCK_DATA.find((u) => u.id === userId);

  // 5. Nếu không tìm thấy
  if (!user) {
    return (
        <div className="p-8 text-center">
            <h2 className="text-xl font-bold text-red-600">Không tìm thấy người dùng!</h2>
            <p className="text-gray-500 mt-2">ID đang tìm: {userId || 'Chưa nhận được ID'}</p>
            <div className="mt-4">
                 {/* Lưu ý đường dẫn quay lại */}
                 <Link href="/socialorg/bficiary" className="text-blue-500 hover:underline">Quay lại danh sách</Link>
            </div>
        </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto my-8">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Chỉnh sửa thông tin</h1>
            <p className="text-sm text-gray-500">ID: {user.id}</p>
        </div>
        <Link href="/socialorg/bficiary">
           <Button variant="outline">Quay lại</Button>
        </Link>
      </div>

      <form className="space-y-4">
        {/* --- DỮ LIỆU THẬT --- */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Họ và tên</label>
          <input 
            type="text" 
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary/50 outline-none" 
            defaultValue={user.fullName} 
          />
        </div>

        <div>
           <label className="block text-sm font-medium mb-1 text-gray-700">Trạng thái</label>
           <select 
                className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-primary/50 outline-none" 
                defaultValue={user.status}
           >
              <option value="ACTIVE">Đã xác minh (Active)</option>
              <option value="PENDING">Chờ duyệt (Pending)</option>
              <option value="DENIED">Từ chối (Denied)</option>
              <option value="BANNED">Đã khóa (Banned)</option>
           </select>
        </div>

        <div>
           <label className="block text-sm font-medium mb-1 text-gray-700">Ngày tạo</label>
           <input 
                type="text"
                disabled
                className="w-full border border-gray-200 bg-gray-100 p-2 rounded text-gray-500 cursor-not-allowed"
                defaultValue={user.createdAt}
           />
        </div>

        {/* --- DỮ LIỆU GIẢ --- */}
        <div className="p-4 bg-gray-50 rounded border border-dashed border-gray-300">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Dữ liệu giả lập</h3>
            <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700">Số điện thoại</label>
                <input type="text" className="w-full border border-gray-300 p-2 rounded" defaultValue="0901234567" />
            </div>
             <div className="mb-3">
                <label className="block text-sm font-medium mb-1 text-gray-700">Địa chỉ</label>
                <input type="text" className="w-full border border-gray-300 p-2 rounded" defaultValue="123 Đường Giả Lập" />
            </div>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Button type="button" variant="ghost">Hủy bỏ</Button>
          <Button type="submit" className="bg-primary text-white hover:bg-teal-700">Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  );
}