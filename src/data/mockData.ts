// src/data/mockData.ts
export interface NeedyUser {
  id: string; // Hoặc string nếu bạn đã đổi sang UUID
  fullName: string;
  status: 'ACTIVE' | 'PENDING' | 'DENIED' | 'BANNED';
  createdAt: string;
}

export const MOCK_DATA: NeedyUser[] = [
  { id: 'uuid-1', fullName: 'Nguyễn Văn An', status: 'ACTIVE', createdAt: '2023-10-15' },
  { id: 'uuid-2', fullName: 'Trần Thị Bích', status: 'PENDING', createdAt: '2023-10-20' },
  { id: 'uuid-3', fullName: 'Lê Văn Cường', status: 'DENIED', createdAt: '2023-10-22' },
  { id: 'uuid-4', fullName: 'Phạm Thị Dung', status: 'BANNED', createdAt: '2023-10-25' },
  { id: 'uuid-5', fullName: 'Hoàng Văn Em', status: 'PENDING', createdAt: '2023-10-28' },
];
