// src/types/index.ts
export interface User {
  id: string; 
  fullName: string;
  status: 'ACTIVE' | 'PENDING' | 'DENIED' | 'BANNED';
  createdAt: string;
}