import api from "./api";

// ==================== TYPES ====================

export interface VolunteerProfile {
  fullName: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  points: number;
  skills?: string[];
  experienceYears?: number;
  bio?: string;
  preferredDistricts?: string[];
  address?: string;
  district?: string;
  cccdFrontFile?: string;
  cccdBackFile?: string;
}

export interface BeneficiaryProfile {
  fullName: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  address?: string;
  vulnerabilityType?: string;
  situationDescription?: string;
  healthCondition?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  cccdFrontFile?: string;
  cccdBackFile?: string;
}

export interface OrganizationMember {
  id: string;
  email: string;
  status: "PENDING" | "APPROVED" | "REJECTED"; // Organization status
  createdAt: string;
  volunteerProfile?: VolunteerProfile;
  bficiaryProfile?: BeneficiaryProfile;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== VOLUNTEERS ====================

export interface GetVolunteersParams {
  search?: string; // Tìm theo tên, email, SĐT
  status?: "PENDING" | "APPROVED" | "REJECTED"; // Lọc theo trạng thái
  page?: number;
  limit?: number;
  districts?: string[]; // Lọc theo nhiều quận
}

export const getVolunteers = async (
  params?: GetVolunteersParams
): Promise<PaginatedResponse<OrganizationMember>> => {
  const response = await api.get("/organization/volunteers", {
    params: {
      search: params?.search,
      status: params?.status,
      page: params?.page || 1,
      limit: params?.limit || 10,
      districts: params?.districts, // Send as array, axios will handle it
    },
    paramsSerializer: {
      indexes: null, // This makes axios send array as: districts[]=A&districts[]=B
    },
  });
  return response.data;
};

// ==================== BENEFICIARIES ====================

export interface GetBeneficiariesParams {
  search?: string; // Tìm theo tên, email, SĐT
  status?: "PENDING" | "APPROVED" | "REJECTED"; // Lọc theo trạng thái
  page?: number;
  limit?: number;
}

export const getBeneficiaries = async (
  params?: GetBeneficiariesParams
): Promise<PaginatedResponse<OrganizationMember>> => {
  const response = await api.get("/organization/beneficiaries", {
    params: {
      search: params?.search,
      status: params?.status,
      page: params?.page || 1,
      limit: params?.limit || 10,
    },
  });
  return response.data;
};

// ==================== MEMBER DETAIL ====================

export const getMemberDetail = async (
  id: string
): Promise<OrganizationMember> => {
  const response = await api.get(`/organization/member/${id}`);
  return response.data;
};

// ==================== UPDATE MEMBER STATUS ====================

export const updateMemberStatus = async (
  id: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  const response = await api.patch(`/organization/member/${id}/status`, {
    status,
  });
  return response.data;
};

// ==================== UPDATE PROFILES ====================

export interface UpdateVolunteerData {
  fullName: string;
  avatarUrl?: string;
  skills?: string[];
  experienceYears?: number;
  bio?: string;
  preferredDistricts?: string[];
  cccdFrontFile?: string;
  cccdBackFile?: string;
}

export const updateVolunteerProfile = async (
  id: string,
  data: UpdateVolunteerData
) => {
  const response = await api.put(`/organization/volunteer/${id}`, data);
  return response.data;
};

export interface UpdateBeneficiaryData {
  fullName: string;
  avatarUrl?: string;
  vulnerabilityType: string;
  situationDescription?: string;
  healthCondition?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
  cccdFrontFile?: string;
  cccdBackFile?: string;
}

export const updateBeneficiaryProfile = async (
  id: string,
  data: UpdateBeneficiaryData
) => {
  const response = await api.put(`/organization/beneficiary/${id}`, data);
  return response.data;
};
