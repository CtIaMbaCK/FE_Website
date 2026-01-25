import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// Tạo axios instance với config từ .env
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "69420",
  },
  timeout: 120000, // 2 phút timeout (để tạo PDF và upload)
});

// Request Interceptor - Tự động thêm token vào header
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig | any) => {
    // Lấy token từ localStorage (nếu có)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Xử lý lỗi tập trung
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Trả về data trực tiếp
    return response;
  },
  (error: AxiosError) => {
    // Xử lý lỗi
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        case 401:
          // Unauthorized - Token hết hạn hoặc không hợp lệ
          if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            window.location.href = '/login';
          }
          break;

        case 403:
          // Forbidden - Không có quyền truy cập
          console.error("Bạn không có quyền truy cập tài nguyên này.");
          break;

        case 404:
          // Not Found
          console.error("Không tìm thấy tài nguyên.");
          break;

        case 500:
        case 502:
        case 503:
          // Server Error
          console.error("Lỗi server. Vui lòng thử lại sau.");
          break;

        default:
          console.error("Có lỗi xảy ra:", error.response.data);
      }
    } else if (error.request) {
      // Request được gửi nhưng không nhận được response
      console.error(
        "Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng."
      );
    } else {
      // Lỗi khác
      console.error("Lỗi:", error.message);
    }

    return Promise.reject(error);
  }
);

// ============ API FUNCTIONS ============

// Hàm lấy danh sách yêu cầu giúp đỡ
export const getRequests = async () => {
  const response = await apiClient.get("/request");
  return response.data;
};

// Export apiClient để sử dụng cho các API khác
export default apiClient;
