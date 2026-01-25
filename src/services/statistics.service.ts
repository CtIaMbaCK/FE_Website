import api from "./api";

// ==================== TYPES ====================

export interface OverviewStatistics {
  totalVolunteers: number;
  totalBeneficiaries: number;
  totalCampaigns: number;
  ongoingCampaigns: number;
  totalPosts: number;
  newVolunteersThisMonth: number;
  newBeneficiariesThisMonth: number;
}

export interface VolunteerStatistics {
  volunteersByStatus: Array<{
    status: string;
    count: number;
  }>;
  topVolunteersByPoints: Array<{
    userId: string;
    fullName: string;
    avatarUrl?: string;
    points: number;
    totalThanks: number;
  }>;
  topVolunteersByCampaigns: Array<{
    userId: string;
    fullName: string;
    avatarUrl?: string;
    points: number;
    campaignCount: number;
  }>;
  volunteersByDistrict: Array<{
    district: string;
    count: number;
  }>;
}

export interface BeneficiaryStatistics {
  beneficiariesByStatus: Array<{
    status: string;
    count: number;
  }>;
  beneficiariesByVulnerability: Array<{
    vulnerabilityType: string;
    count: number;
  }>;
}

export interface CampaignStatistics {
  campaignsByStatus: Array<{
    status: string;
    count: number;
  }>;
  campaignsByDistrict: Array<{
    district: string;
    count: number;
  }>;
  topCampaignsByRegistrations: Array<{
    id: string;
    title: string;
    currentVolunteers: number;
    maxVolunteers: number;
    targetVolunteers: number;
    status: string;
    startDate: string;
  }>;
  totalRegistrations: number;
}

export interface ActivityStatistics {
  volunteersPerMonth: Array<{
    month: string;
    count: number;
  }>;
  beneficiariesPerMonth: Array<{
    month: string;
    count: number;
  }>;
  campaignsPerMonth: Array<{
    month: string;
    count: number;
  }>;
  postsPerMonth: Array<{
    month: string;
    count: number;
  }>;
}

export interface HelpRequestStatistics {
  helpRequestsByStatus: Array<{
    status: string;
    count: number;
  }>;
  helpRequestsByCategory: Array<{
    category: string;
    count: number;
  }>;
  helpRequestsByDistrict: Array<{
    district: string;
    count: number;
  }>;
  helpRequestsPerMonth: Array<{
    month: string;
    status: string;
    count: number;
  }>;
}

export interface TopVolunteer {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  points: number;
  totalThanks: number;
  organizationName?: string;
}

// ==================== API CALLS ====================

/**
 * [TCXH] Lấy thống kê tổng quan
 */
export const getOverviewStatistics = async (): Promise<OverviewStatistics> => {
  const response = await api.get("/admin-tcxh/statistics/overview");
  return response.data;
};

/**
 * [TCXH] Lấy thống kê tình nguyện viên
 */
export const getVolunteerStatistics = async (): Promise<VolunteerStatistics> => {
  const response = await api.get("/admin-tcxh/statistics/volunteers");
  return response.data;
};

/**
 * [TCXH] Lấy thống kê người cần giúp đỡ
 */
export const getBeneficiaryStatistics = async (): Promise<BeneficiaryStatistics> => {
  const response = await api.get("/admin-tcxh/statistics/beneficiaries");
  return response.data;
};

/**
 * [TCXH] Lấy thống kê chiến dịch
 */
export const getCampaignStatistics = async (): Promise<CampaignStatistics> => {
  const response = await api.get("/admin-tcxh/statistics/campaigns");
  return response.data;
};

/**
 * [TCXH] Lấy thống kê hoạt động theo thời gian
 */
export const getActivityStatistics = async (days?: number): Promise<ActivityStatistics> => {
  const response = await api.get("/admin-tcxh/statistics/activities", {
    params: { days }
  });
  return response.data;
};

/**
 * [TCXH] Lấy thống kê HelpRequest (hoạt động hỗ trợ)
 */
export const getHelpRequestStatistics = async (days?: number): Promise<HelpRequestStatistics> => {
  const response = await api.get("/admin-tcxh/statistics/help-requests", {
    params: { days }
  });
  return response.data;
};

/**
 * [PUBLIC] Top tình nguyện viên toàn hệ thống
 */
export const getTopVolunteersGlobal = async (limit?: number): Promise<TopVolunteer[]> => {
  const response = await api.get("/public-statistics/top-volunteers", {
    params: { limit }
  });
  return response.data;
};
