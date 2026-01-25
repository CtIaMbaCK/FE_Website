import api from "./api";

export interface VolunteerComment {
  id: string;
  volunteerId: string;
  organizationId: string;
  comment: string;
  rating?: number;
  createdAt: string;
  updatedAt: string;
  volunteer?: {
    volunteerProfile: {
      fullName: string;
      avatarUrl?: string;
    };
  };
}

export interface CertificateTemplate {
  id: string;
  organizationId: string;
  name: string;
  description?: string;
  templateImageUrl: string;
  textBoxConfig: any;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IssuedCertificate {
  id: string;
  templateId: string;
  volunteerId: string;
  organizationId: string;
  certificateData: any;
  pdfUrl: string;
  emailSent: boolean;
  emailSentAt?: string;
  notes?: string;
  issuedAt: string;
  volunteer?: {
    volunteerProfile: {
      fullName: string;
      avatarUrl?: string;
      points: number;
    };
  };
  template?: CertificateTemplate;
}

export interface PointHistory {
  id: string;
  volunteerId: string;
  points: number;
  source: "HELP_REQUEST" | "CAMPAIGN" | "MANUAL" | "BONUS";
  description?: string;
  helpRequestId?: string;
  campaignId?: string;
  createdAt: string;
}

// ==================== COMMENTS ====================

export const createVolunteerComment = async (data: {
  volunteerId: string;
  comment: string;
  rating?: number;
}) => {
  const response = await api.post("/volunteer-rewards/comments", data);
  return response.data;
};

export const getVolunteerComments = async (volunteerId: string) => {
  const response = await api.get(
    `/volunteer-rewards/comments/volunteer/${volunteerId}`
  );
  return response.data;
};

export const getOrganizationComments = async () => {
  const response = await api.get("/volunteer-rewards/comments/organization");
  return response.data;
};

export const updateVolunteerComment = async (
  id: string,
  data: { comment?: string; rating?: number }
) => {
  const response = await api.put(`/volunteer-rewards/comments/${id}`, data);
  return response.data;
};

export const deleteVolunteerComment = async (id: string) => {
  const response = await api.delete(`/volunteer-rewards/comments/${id}`);
  return response.data;
};

// ==================== TEMPLATES ====================

export const uploadCertificateImage = async (
  file: File
): Promise<{ imageUrl: string }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    "/volunteer-rewards/templates/upload-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const createCertificateTemplate = async (data: {
  name: string;
  description?: string;
  templateImageUrl: string;
  textBoxConfig: any;
}) => {
  const response = await api.post("/volunteer-rewards/templates", data);
  return response.data;
};

export const getCertificateTemplates = async () => {
  const response = await api.get("/volunteer-rewards/templates");
  return response.data;
};

export const getCertificateTemplate = async (id: string) => {
  const response = await api.get(`/volunteer-rewards/templates/${id}`);
  return response.data;
};

export const updateCertificateTemplate = async (id: string, data: any) => {
  const response = await api.put(`/volunteer-rewards/templates/${id}`, data);
  return response.data;
};

export const deleteCertificateTemplate = async (id: string) => {
  const response = await api.delete(`/volunteer-rewards/templates/${id}`);
  return response.data;
};

// ==================== CERTIFICATES ====================

export const issueCertificate = async (data: {
  templateId: string;
  volunteerId: string;
  additionalData?: any;
  notes?: string;
}) => {
  const response = await api.post(
    "/volunteer-rewards/certificates/issue",
    data
  );
  return response.data;
};

export const getIssuedCertificates = async () => {
  const response = await api.get("/volunteer-rewards/certificates/issued");
  return response.data;
};

export const getVolunteerCertificates = async (volunteerId: string) => {
  const response = await api.get(
    `/volunteer-rewards/certificates/volunteer/${volunteerId}`
  );
  return response.data;
};

// ==================== POINTS ====================

export const getPointHistory = async (volunteerId: string) => {
  const response = await api.get(
    `/volunteer-rewards/points/history/${volunteerId}`
  );
  return response.data;
};
