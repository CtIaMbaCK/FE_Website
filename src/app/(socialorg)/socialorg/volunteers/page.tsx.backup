'use client';

import { useState } from 'react';
import FilterToolbar from '@/components/FilterToolbar';
import UserTable from '@/components/UserTable';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dữ liệu mẫu (Hoặc gọi API ở đây)
const MOCK_DATA: User[] = [
  { id: 'uuid-1', fullName: 'Nguyễn Văn An', status: 'ACTIVE', createdAt: '2023-10-15' },
  { id: 'uuid-2', fullName: 'Trần Thị Bích', status: 'PENDING', createdAt: '2023-10-20' },
  { id: 'uuid-3', fullName: 'Lê Văn Cường', status: 'DENIED', createdAt: '2023-10-22' },
  { id: 'uuid-4', fullName: 'Phạm Thị Dung', status: 'BANNED', createdAt: '2023-10-25' },
  { id: 'uuid-5', fullName: 'Hoàng Văn Em', status: 'PENDING', createdAt: '2023-10-28' },
];

export default function NeedyPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // 1. THÊM STATE CHO STATUS FILTER (Mặc định là 'ALL')
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [users, setUsers] = useState<User[]>(MOCK_DATA);

  // Logic Toggle Ban
  const handleToggleBan = (id: string, currentStatus: string) => {
    setUsers((prevUsers) => 
      prevUsers.map((user) => {
        if (user.id === id) {
          const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
          return { ...user, status: newStatus as User['status'] };
        }
        return user;
      })
    );
  };

  // 2. LOGIC FILTER (Kết hợp Tìm kiếm + Status)
  const filteredUsers = users.filter((user) => {
    // Điều kiện 1: Tìm theo tên
    const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Điều kiện 2: Lọc theo trạng thái (Nếu chọn ALL thì luôn đúng, ngược lại phải khớp status)
    const matchesStatus = statusFilter === 'ALL' || user.status === statusFilter;

    // Cả 2 điều kiện phải cùng đúng
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tình nguyện viên</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh sách Tình nguyện viên</p>
        </div>
        <Button className="gap-2 bg-primary text-white hover:bg-teal-700 shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Thêm Tình nguyện viên
        </Button>
      </div>

      {/* Component Toolbar */}
      <FilterToolbar searchTerm={searchTerm} onSearchChange={setSearchTerm}>
        {/* Bất cứ thứ gì đặt ở đây sẽ hiện bên phải thanh tìm kiếm */}
        <div className="w-full md:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white border-custom-gray-border h-10">
                    <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">Tất cả</SelectItem>
                    <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                    <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                    <SelectItem value="DENIED">Bị từ chối</SelectItem>
                    <SelectItem value="BANNED">Bị khóa</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </FilterToolbar>

      {/* Component Table */}
      <UserTable 
        data={filteredUsers} 
        onToggleBan={handleToggleBan} 
      />
    </div>
  );
}