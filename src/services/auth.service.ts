import apiClient from "./api";

// ============ TYPES ============

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    phoneNumber: string;
    role: string;
  };
}

export interface RegisterRequest {
  email: string;
  phoneNumber: string;
  password: string;
  role: "VOLUNTEER" | "BENEFICIARY" | "ORGANIZATION";
}

export interface RegisterResponse {
  accessToken: string;
  role: string;
}

// log in
export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await apiClient.post("/auth/login", credentials);

  // Lưu token vào localStorage
  if (response.data.accessToken) {
    localStorage.setItem("access_token", response.data.accessToken);
  }

  return response.data;
};

//  Đăng ký tài khoản mới
//  post /api/v1/auth/register
export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post("/auth/register", data);

  // Tự động lưu token sau khi đăng ký
  if (response.data.accessToken) {
    localStorage.setItem("access_token", response.data.accessToken);
  }

  return response.data;
};

// log out
export const logout = async (): Promise<void> => {
  try {
    // Xóa token khỏi localStorage
    localStorage.removeItem("access_token");

    // Redirect về trang login
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Lỗi khi đăng xuất:", error);
  }
};

// getMe() thong tin user
export const getMe = async () => {
  const response = await apiClient.get("users/me");
  return response.data;
};

// kiem tra dang nhap
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("access_token");
  return !!token;
};

// Get token
export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
};
