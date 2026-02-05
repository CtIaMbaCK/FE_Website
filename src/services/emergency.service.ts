import api from './api';

export interface EmergencyRequest {
  id: string;
  beneficiaryId: string;
  status: 'NEW' | 'COMPLETED';
  createdAt: string;
  completedAt?: string;
  beneficiary: {
    userId: string;
    fullName: string;
    avatarUrl?: string;
    vulnerabilityType: string;
    situationDescription?: string;
    healthCondition?: string;
    guardianName?: string;
    guardianPhone?: string;
    user: {
      id: string;
      email: string;
      phoneNumber: string;
      role: string;
      status: string;
    };
  };
}

export const emergencyService = {
  // Lấy danh sách SOS requests
  async getEmergencies(status?: 'NEW' | 'COMPLETED'): Promise<EmergencyRequest[]> {
    const params = status ? { status } : {};
    const response = await api.get('/emergency', { params });
    return response.data;
  },

  // Lấy chi tiết 1 SOS
  async getEmergencyById(id: string): Promise<EmergencyRequest> {
    const response = await api.get(`/emergency/${id}`);
    return response.data;
  },

  // Cập nhật trạng thái SOS
  async updateEmergency(
    id: string,
    data: { status: 'NEW' | 'COMPLETED' }
  ): Promise<EmergencyRequest> {
    const response = await api.patch(`/emergency/${id}`, data);
    return response.data;
  },

  // Đếm số SOS chưa xử lý
  async countPending(): Promise<number> {
    const response = await api.get('/emergency/count/pending');
    return response.data;
  },
};
