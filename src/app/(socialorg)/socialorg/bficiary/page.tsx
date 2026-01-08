'use client';

import { useState } from 'react';
import FilterToolbar from '@/components/FilterToolbar';
import UserTable from '@/components/UserTable';
import Link from "next/link";
import { Button } from "@/components/ui/button";

// --- THAY ĐỔI: Import từ file dữ liệu chung ---
import { MOCK_DATA, NeedyUser } from '@/data/mockData';

export default function NeedyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // --- THAY ĐỔI: Sử dụng MOCK_DATA và Type từ file chung ---
  const [users, setUsers] = useState<NeedyUser[]>(MOCK_DATA);

  // Logic Toggle Ban (Xử lý Data)
  const handleToggleBan = (id: string, currentStatus: string) => {
    setUsers((prevUsers) => 
      prevUsers.map((user) => {
        if (user.id === id) {
          const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
          // Ép kiểu về status của NeedyUser
          return { ...user, status: newStatus as User['status'] };
        }
        return user;
      })
    );
  };

  // Logic Filter
  const filteredUsers = users.filter((user) => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Người cần giúp đỡ</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh sách Người cần giúp đỡ</p>
        </div>
        
        {/* Link chuyển sang trang tạo mới */}
        <Link href="/socialorg/bficiary/create">
          <Button className="gap-2 bg-primary text-white hover:bg-teal-700 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm Người cần giúp đỡ
          </Button>
        </Link>
      </div>

      {/* Component Toolbar */}
      <FilterToolbar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {/* Component Table */}
      {/* Lưu ý: Đảm bảo UserTable chấp nhận prop data kiểu NeedyUser[] */}
      <UserTable 
        data={filteredUsers} 
        onToggleBan={handleToggleBan} 
      />
    </div>
  );
}