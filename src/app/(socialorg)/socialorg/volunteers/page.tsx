'use client';

import { useState } from 'react';
import FilterToolbar from '@/components/FilterToolbar';
import UserTable from '@/components/UserTable';
import { User } from '@/types';

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
  const [users, setUsers] = useState<User[]>(MOCK_DATA);

  // Logic Toggle Ban (Xử lý Data)
  const handleToggleBan = (id: string, currentStatus: string) => {
    setUsers((prevUsers) => 
      prevUsers.map((user) => {
        // So sánh string với string
        if (user.id === id) {
          const newStatus = currentStatus === 'BANNED' ? 'ACTIVE' : 'BANNED';
          return { ...user, status: newStatus as User['status'] };
        }
        return user;
      })
    );
  };

  // Logic Filter (Xử lý tìm kiếm trước khi truyền xuống Table)
  const filteredUsers = users.filter((user) => 
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tình nguyện viên</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý danh sách Tình nguyện viên</p>
        </div>
        <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors shadow-sm font-medium">
          <span className="material-symbols-outlined text-[20px]">add</span>
          Thêm Tình nguyện viên
        </button>
      </div>

      {/* Component Toolbar */}
      <FilterToolbar 
        searchTerm={searchTerm} 
        onSearchChange={setSearchTerm} 
      />

      {/* Component Table */}
      <UserTable 
        data={filteredUsers} 
        onToggleBan={handleToggleBan} 
      />
    </div>
  );
}