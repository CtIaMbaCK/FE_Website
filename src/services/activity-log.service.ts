import api from './api';

export interface ActivityLogEntry {
  id: string;
  type: string;
  action: string;
  user?: {
    id: string;
    phoneNumber: string;
    role: string;
  };
  metadata?: any;
  createdAt: string;
}

export interface ActivityStats {
  emergencies: number;
  requests: number;
  campaigns: number;
  registrations: number;
  reviews: number;
}

export const activityLogService = {
  // Lấy danh sách activity logs
  async getAllActivities(limit: number = 100): Promise<ActivityLogEntry[]> {
    const response = await api.get('/activity-log', {
      params: { limit },
    });
    return response.data;
  },

  // Lấy thống kê
  async getStats(): Promise<ActivityStats> {
    const response = await api.get('/activity-log/stats');
    return response.data;
  },
};
