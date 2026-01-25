import api from "./api";

// ==================== TYPES ====================

export interface CommunicationPost {
  id: string;
  organizationId: string;
  title: string;
  content: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
  organization?: {
    organizationProfiles?: {
      organizationName: string;
      avatarUrl?: string;
    };
  };
}

export interface FilterPostDto {
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreatePostData {
  title: string;
  content: string;
  coverImage?: File;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  coverImage?: File;
}

export interface PostsResponse {
  data: CommunicationPost[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ==================== API CALLS ====================

/**
 * [TCXH] Tạo bài viết truyền thông mới
 */
export const createPost = async (data: CreatePostData): Promise<CommunicationPost> => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  if (data.coverImage) {
    formData.append("coverImage", data.coverImage);
  }

  const response = await api.post("/admin-tcxh/posts", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * [TCXH] Lấy danh sách bài viết của tổ chức
 */
export const getOrgPosts = async (filters?: FilterPostDto): Promise<PostsResponse> => {
  const response = await api.get("/admin-tcxh/posts", {
    params: filters,
  });
  return response.data;
};

/**
 * [TCXH] Lấy chi tiết bài viết
 */
export const getPostDetail = async (postId: string): Promise<CommunicationPost> => {
  const response = await api.get(`/admin-tcxh/posts/${postId}`);
  return response.data;
};

/**
 * [TCXH] Cập nhật bài viết
 */
export const updatePost = async (
  postId: string,
  data: UpdatePostData
): Promise<CommunicationPost> => {
  const formData = new FormData();
  if (data.title) formData.append("title", data.title);
  if (data.content) formData.append("content", data.content);
  if (data.coverImage) formData.append("coverImage", data.coverImage);

  const response = await api.patch(`/admin-tcxh/posts/${postId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * [TCXH] Xóa bài viết
 */
export const deletePost = async (postId: string): Promise<void> => {
  await api.delete(`/admin-tcxh/posts/${postId}`);
};

/**
 * [Public] Lấy tất cả bài viết (không cần đăng nhập)
 */
export const getAllPublicPosts = async (filters?: FilterPostDto): Promise<PostsResponse> => {
  const response = await api.get("/posts", {
    params: filters,
  });
  return response.data;
};

/**
 * [Public] Lấy chi tiết bài viết public (không cần đăng nhập)
 */
export const getPublicPostDetail = async (postId: string): Promise<CommunicationPost> => {
  const response = await api.get(`/posts/${postId}`);
  return response.data;
};
