// src/types/index.ts
export interface User {
  id: number;
  fullName: string;
  status: 'ACTIVE' | 'PENDING' | 'DENIED' | 'BANNED';
  createdAt: string;
}