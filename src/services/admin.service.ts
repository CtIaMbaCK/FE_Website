import api from "./api";

// Types
export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginationResponseWithMeta<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface Beneficiary {
  id: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  bficiaryProfile: {
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
    organizationId?: string;
    organization?: {
      organizationProfiles?: {
        organizationName: string;
      };
    };
  };
}

export interface Volunteer {
  id: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  volunteerProfile: {
    fullName: string;
    avatarUrl?: string;
    skills: string[];
    preferredDistricts: string[];
    points: number;
    experienceYears?: number;
    bio?: string;
    cccdFrontFile?: string;
    cccdBackFile?: string;
    organizationId?: string;
    organization?: {
      organizationProfiles?: {
        organizationName: string;
      };
    };
  };
}

export interface Organization {
  id: string;
  email: string;
  phoneNumber: string;
  status: string;
  createdAt: string;
  organizationProfiles?: {
    organizationName: string;
    avatarUrl?: string;
    representativeName: string;
    district: string;
    addressDetail: string;
    createdAt: string;
  };
}

export interface Post {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  updatedAt?: string;
  organizationId?: string;
  organization: {
    organizationProfiles?: {
      organizationName: string;
      avatarUrl?: string;
    };
  };
}

export interface Campaign {
  id: string;
  title: string;
  status: string;
  startDate: string;
  endDate?: string;
  currentVolunteers: number;
  maxVolunteers: number;
  organizationId?: string;
  createdAt?: string;
  updatedAt?: string;
  organization: {
    organizationProfiles?: {
      organizationName: string;
      avatarUrl?: string;
    };
  };
}

// API Services

// Quan ly NCGD
export const getAllBeneficiaries = async (
  search?: string,
  status?: string,
  page?: number,
  limit?: number
): Promise<PaginationResponse<Beneficiary>> => {
  const response = await api.get("/admin/beneficiaries", {
    params: { search, status, page, limit },
  });
  return response.data;
};

export const getBeneficiaryDetail = async (id: string): Promise<Beneficiary> => {
  const response = await api.get(`/admin/beneficiaries/${id}`);
  return response.data;
};

export const updateBeneficiary = async (
  id: string,
  data: {
    status?: string;
    fullName?: string;
    phoneNumber?: string;
    vulnerabilityType?: string;
    avatarUrl?: string;
    situationDescription?: string;
    healthCondition?: string;
    guardianName?: string;
    guardianPhone?: string;
    guardianRelation?: string;
    cccdFrontFile?: string;
    cccdBackFile?: string;
  }
): Promise<Beneficiary> => {
  const response = await api.patch(`/admin/beneficiaries/${id}`, data);
  return response.data;
};

// Quan ly TNV
export const getAllVolunteers = async (
  search?: string,
  status?: string,
  district?: string,
  page?: number,
  limit?: number
): Promise<PaginationResponse<Volunteer>> => {
  const response = await api.get("/admin/volunteers", {
    params: { search, status, district, page, limit },
  });
  return response.data;
};

export const getVolunteerDetail = async (id: string): Promise<Volunteer> => {
  const response = await api.get(`/admin/volunteers/${id}`);
  return response.data;
};

export const updateVolunteer = async (
  id: string,
  data: {
    status?: string;
    fullName?: string;
    phoneNumber?: string;
    avatarUrl?: string;
    skills?: string[];
    preferredDistricts?: string[];
    experienceYears?: number;
    bio?: string;
    cccdFrontFile?: string;
    cccdBackFile?: string;
  }
): Promise<Volunteer> => {
  const response = await api.patch(`/admin/volunteers/${id}`, data);
  return response.data;
};

// Quan ly TCXH
export const getAllOrganizations = async (
  search?: string,
  status?: string,
  page?: number,
  limit?: number
): Promise<PaginationResponse<Organization>> => {
  const response = await api.get("/admin/organizations", {
    params: { search, status, page, limit },
  });
  return response.data;
};

export const getOrganizationDetail = async (id: string): Promise<Organization> => {
  const response = await api.get(`/admin/organizations/${id}`);
  return response.data;
};

export const updateOrganization = async (
  id: string,
  data: { status?: string; organizationName?: string; phoneNumber?: string; representativeName?: string }
): Promise<Organization> => {
  const response = await api.patch(`/admin/organizations/${id}`, data);
  return response.data;
};

// Quan ly Posts
export const getAllPosts = async (
  search?: string,
  organizationId?: string,
  page?: number,
  limit?: number
): Promise<PaginationResponse<Post>> => {
  const response = await api.get("/admin/content/posts", {
    params: { search, organizationId, page, limit },
  });
  return response.data;
};

// Quan ly Campaigns
export const getAllCampaigns = async (
  search?: string,
  organizationId?: string,
  status?: string,
  page?: number,
  limit?: number
): Promise<PaginationResponse<Campaign>> => {
  const response = await api.get("/admin/content/campaigns", {
    params: { search, organizationId, status, page, limit },
  });
  return response.data;
};

// Quan ly Help Requests
export interface HelpRequest {
  id: string;
  title: string;
  description?: string;
  activityType: string;
  urgencyLevel: string;
  district: string;
  addressDetail: string;
  startDate: string;
  endDate?: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  acceptedAt?: string;
  doneAt?: string;
  activityImages?: string[];
  proofImages?: string[];
  completionNotes?: string;
  requester: {
    id: string;
    email: string;
    phoneNumber: string;
    bficiaryProfile?: {
      fullName: string;
      avatarUrl?: string;
      vulnerabilityType?: string;
    };
  };
  volunteer?: {
    id: string;
    email: string;
    phoneNumber: string;
    volunteerProfile?: {
      fullName: string;
      avatarUrl?: string;
      points: number;
    };
  };
}

export const getAllHelpRequests = async (
  search?: string,
  status?: string,
  district?: string,
  activityType?: string,
  urgencyLevel?: string,
  page?: number,
  limit?: number
): Promise<PaginationResponseWithMeta<HelpRequest>> => {
  const response = await api.get("/admin/help-requests", {
    params: { search, status, district, activityType, urgencyLevel, page, limit },
  });
  return response.data;
};

export const getHelpRequestDetail = async (id: string): Promise<HelpRequest> => {
  const response = await api.get(`/admin/help-requests/${id}`);
  return response.data;
};

// Approve/Reject Campaign
export const approveCampaign = async (
  id: string,
  status: "APPROVED" | "REJECTED"
): Promise<{ message: string; campaign: Campaign }> => {
  const response = await api.patch(`/admin/content/campaigns/${id}/approve`, {
    status,
  });
  return response.data;
};

// Approve/Reject Help Request
export const approveHelpRequest = async (
  id: string,
  status: "APPROVED" | "REJECTED"
): Promise<{ message: string; helpRequest: HelpRequest }> => {
  const response = await api.patch(`/admin/help-requests/${id}/approve`, {
    status,
  });
  return response.data;
};
