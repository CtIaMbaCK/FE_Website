import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Hàm lấy danh sách yêu cầu giúp đỡ
export const getRequests = async () => {
  const response = await apiClient.get('/request'); // Gọi vào endpoint /request
  return response.data;
};

export default apiClient;