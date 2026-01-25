import api from "./api";

// ==================== TYPES ====================

export interface Campaign {
  id: string;
  organizationId: string;
  title: string;
  description?: string;
  goal?: string;
  district: string;
  addressDetail: string;
  startDate: string;
  endDate?: string;
  coverImage?: string;
  images: string[];
  targetVolunteers: number;
  maxVolunteers: number;
  currentVolunteers: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  organization?: {
    id: string;
    email: string;
    organizationProfiles?: {
      organizationName: string;
      avatarUrl?: string;
    };
  };
  _count?: {
    registrations: number;
  };
}

export interface CampaignRegistration {
  id: string;
  campaignId: string;
  volunteerId: string;
  status: "REGISTERED" | "ATTENDED" | "CANCELLED";
  notes?: string;
  registeredAt: string;
  volunteer?: {
    id: string;
    email: string;
    phoneNumber?: string;
    volunteerProfile?: {
      fullName: string;
      avatarUrl?: string;
      skills?: string[];
      experienceYears?: number;
      preferredDistricts?: string[];
    };
  };
}

export interface FilterCampaignDto {
  search?: string;
  status?: string[];
  districts?: string[];
  createdFrom?: string;
  createdTo?: string;
  startFrom?: string;
  startTo?: string;
  page?: number;
  limit?: number;
}

export interface CreateCampaignDto {
  title: string;
  description?: string;
  goal?: string;
  district: string;
  addressDetail: string;
  startDate: string;
  endDate?: string;
  targetVolunteers: number;
  maxVolunteers: number;
  coverImage?: File;
  images?: File[];
}

export interface UpdateCampaignDto {
  title?: string;
  description?: string;
  goal?: string;
  district?: string;
  addressDetail?: string;
  startDate?: string;
  endDate?: string;
  targetVolunteers?: number;
  maxVolunteers?: number;
  coverImage?: File;
  images?: File[];
}

// ==================== API CALLS ====================

/**
 * Tạo campaign mới
 */
export const createCampaign = async (data: CreateCampaignDto) => {
  const formData = new FormData();

  formData.append("title", data.title);
  if (data.description) formData.append("description", data.description);
  if (data.goal) formData.append("goal", data.goal);
  formData.append("district", data.district);
  formData.append("addressDetail", data.addressDetail);
  formData.append("startDate", data.startDate);
  if (data.endDate) formData.append("endDate", data.endDate);
  formData.append("targetVolunteers", data.targetVolunteers.toString());
  formData.append("maxVolunteers", data.maxVolunteers.toString());

  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api.post("/admin-tcxh/campaigns", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Lấy danh sách campaigns với filter
 */
export const getCampaigns = async (filters?: FilterCampaignDto) => {
  const response = await api.get("/admin-tcxh/campaigns", {
    params: filters,
    paramsSerializer: {
      indexes: null, // Gửi array đúng format: status[]=A&status[]=B&districts[]=X&districts[]=Y
    },
  });
  return response.data;
};

/**
 * Lấy chi tiết campaign
 */
export const getCampaignDetail = async (id: string) => {
  const response = await api.get(`/admin-tcxh/campaigns/${id}`);
  return response.data;
};

/**
 * Cập nhật campaign
 */
export const updateCampaign = async (id: string, data: UpdateCampaignDto) => {
  const formData = new FormData();

  if (data.title) formData.append("title", data.title);
  if (data.description !== undefined) formData.append("description", data.description);
  if (data.goal !== undefined) formData.append("goal", data.goal);
  if (data.district) formData.append("district", data.district);
  if (data.addressDetail) formData.append("addressDetail", data.addressDetail);
  if (data.startDate) formData.append("startDate", data.startDate);
  if (data.endDate !== undefined) formData.append("endDate", data.endDate);
  if (data.targetVolunteers !== undefined) formData.append("targetVolunteers", data.targetVolunteers.toString());
  if (data.maxVolunteers !== undefined) formData.append("maxVolunteers", data.maxVolunteers.toString());

  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  if (data.images && data.images.length > 0) {
    data.images.forEach((image) => {
      formData.append("images", image);
    });
  }

  const response = await api.patch(`/admin-tcxh/campaigns/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Xóa campaign (chỉ được phép nếu chưa có TNV nào đăng ký)
 */
export const deleteCampaign = async (id: string) => {
  const response = await api.delete(`/admin-tcxh/campaigns/${id}`);
  return response.data;
};

/**
 * Lấy danh sách TNV đã đăng ký campaign
 */
export const getCampaignRegistrations = async (
  campaignId: string,
  page?: number,
  limit?: number
) => {
  const response = await api.get(`/admin-tcxh/campaigns/${campaignId}/registrations`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Cập nhật trạng thái đăng ký (ATTENDED để cộng điểm)
 */
export const updateRegistrationStatus = async (
  registrationId: string,
  status: "REGISTERED" | "ATTENDED" | "CANCELLED"
) => {
  const response = await api.patch(
    `/admin-tcxh/campaigns/registrations/${registrationId}/status`,
    { status }
  );
  return response.data;
};
