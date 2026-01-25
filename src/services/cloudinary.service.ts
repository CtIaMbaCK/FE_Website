import api from "./api";

/**
 * Upload một file ảnh lên Cloudinary thông qua backend
 * @param file File ảnh cần upload (JPEG, JPG, PNG, max 5MB)
 * @returns URL của ảnh đã upload
 */
export const uploadImage = async (file: File): Promise<string> => {
  // Validate file type
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Chỉ chấp nhận file ảnh (JPEG, JPG, PNG)");
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("Kích thước file không được vượt quá 5MB");
  }

  // Create FormData
  const formData = new FormData();
  formData.append("file", file);

  // Upload to backend
  const response = await api.post<{ url: string }>("/cloudinary/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.url;
};
