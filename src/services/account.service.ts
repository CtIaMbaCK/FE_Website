import api from "./api";
import { OrganizationMember } from "./organization.service";

// ==================== TYPES ====================

export interface CreateVolunteerAccountData {
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  avatarUrl?: string;
  cccdFrontFile?: string;
  cccdBackFile?: string;
  skills?: string[];
  experienceYears?: number;
  bio?: string;
  preferredDistricts?: string[];
}

export interface CreateBeneficiaryAccountData {
  email: string;
  password: string;
  phoneNumber: string;
  fullName: string;
  avatarUrl?: string;
  cccdFrontFile?: string;
  cccdBackFile?: string;
  vulnerabilityType: string;
  situationDescription?: string;
  healthCondition?: string;
  guardianName?: string;
  guardianPhone?: string;
  guardianRelation?: string;
}

// ==================== API CALLS ====================

/**
 * Tạo tài khoản Tình nguyện viên bởi TCXH
 */
export const createVolunteerAccount = async (
  data: CreateVolunteerAccountData
): Promise<OrganizationMember> => {
  const response = await api.post("/organization/create-volunteer", data);
  return response.data;
};

/**
 * Tạo tài khoản Người cần giúp đỡ bởi TCXH
 */
export const createBeneficiaryAccount = async (
  data: CreateBeneficiaryAccountData
): Promise<OrganizationMember> => {
  const response = await api.post("/organization/create-beneficiary", data);
  return response.data;
};
