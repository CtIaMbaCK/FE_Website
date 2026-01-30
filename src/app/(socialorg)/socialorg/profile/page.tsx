"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getMe } from "@/services/auth.service";
import { Upload, X, Save, Building2, User, MapPin, Globe, FileText, Image as ImageIcon } from "lucide-react";
import api from "@/services/api";
import Breadcrumb from "@/components/Breadcrumb";

// Danh sách quận huyện
const DISTRICTS = [
  { value: "QUAN_1", label: "Quận 1" },
  { value: "QUAN_3", label: "Quận 3" },
  { value: "QUAN_4", label: "Quận 4" },
  { value: "QUAN_5", label: "Quận 5" },
  { value: "QUAN_6", label: "Quận 6" },
  { value: "QUAN_7", label: "Quận 7" },
  { value: "QUAN_8", label: "Quận 8" },
  { value: "QUAN_10", label: "Quận 10" },
  { value: "QUAN_11", label: "Quận 11" },
  { value: "QUAN_12", label: "Quận 12" },
  { value: "BINH_TAN", label: "Bình Tân" },
  { value: "BINH_THANH", label: "Bình Thạnh" },
  { value: "GO_VAP", label: "Gò Vấp" },
  { value: "PHU_NHUAN", label: "Phú Nhuận" },
  { value: "TAN_BINH", label: "Tân Bình" },
  { value: "TAN_PHU", label: "Tân Phú" },
  { value: "TP_THU_DUC", label: "TP Thủ Đức" },
];

export default function OrganizationProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    organizationName: "",
    representativeName: "",
    description: "",
    website: "",
    district: "",
    addressDetail: "",
  });

  // Files state
  const [files, setFiles] = useState<{
    avatar: File | null;
    businessLicense: File | null;
    verificationDocs: File[];
  }>({
    avatar: null,
    businessLicense: null,
    verificationDocs: [],
  });

  // Current URLs (từ server)
  const [currentUrls, setCurrentUrls] = useState<{
    avatarUrl: string | null;
    businessLicense: string | null;
    verificationDocs: string[];
  }>({
    avatarUrl: null,
    businessLicense: null,
    verificationDocs: [],
  });

  // Preview URLs (local)
  const [previews, setPreviews] = useState<{
    avatar: string | null;
    businessLicense: string | null;
    verificationDocs: string[];
  }>({
    avatar: null,
    businessLicense: null,
    verificationDocs: [],
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setIsLoading(true);
    try {
      const profile = await getMe();
      if (profile?.organizationProfiles) {
        const org = profile.organizationProfiles;
        setFormData({
          organizationName: org.organizationName || "",
          representativeName: org.representativeName || "",
          description: org.description || "",
          website: org.website || "",
          district: org.district || "",
          addressDetail: org.addressDetail || "",
        });

        setCurrentUrls({
          avatarUrl: org.avatarUrl || null,
          businessLicense: org.businessLicense || null,
          verificationDocs: org.verificationDocs || [],
        });

        setPreviews({
          avatar: org.avatarUrl || null,
          businessLicense: org.businessLicense || null,
          verificationDocs: org.verificationDocs || [],
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      toast.error("Không thể tải thông tin cá nhân");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSingleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "avatar" | "businessLicense"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Chỉ chấp nhận file ảnh (JPEG, JPG, PNG)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Kích thước file không được vượt quá 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      const preview = reader.result as string;
      setFiles((prev) => ({ ...prev, [field]: file }));
      setPreviews((prev) => ({ ...prev, [field]: preview }));
    };
    reader.readAsDataURL(file);
  };

  const handleMultipleImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length === 0) return;

    // Validate each file
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    newFiles.forEach((file) => {
      // Validate type
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name}: Chỉ chấp nhận file ảnh (JPEG, JPG, PNG)`);
        return;
      }

      // Validate size
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`${file.name}: Kích thước file không được vượt quá 5MB`);
        return;
      }

      validFiles.push(file);
    });

    // Create previews
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        validPreviews.push(reader.result as string);

        if (validPreviews.length === validFiles.length) {
          setFiles((prev) => ({
            ...prev,
            verificationDocs: [...prev.verificationDocs, ...validFiles],
          }));
          setPreviews((prev) => ({
            ...prev,
            verificationDocs: [...prev.verificationDocs, ...validPreviews],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveSingleImage = (field: "avatar" | "businessLicense") => {
    setFiles((prev) => ({ ...prev, [field]: null }));
    setPreviews((prev) => ({ ...prev, [field]: null }));
    // Reset current URL to trigger deletion on server
    if (field === "avatar") {
      setCurrentUrls((prev) => ({ ...prev, avatarUrl: null }));
    } else {
      setCurrentUrls((prev) => ({ ...prev, businessLicense: null }));
    }
  };

  const handleRemoveMultipleImage = (index: number, isNewFile: boolean) => {
    if (isNewFile) {
      // Remove from new files
      setFiles((prev) => ({
        ...prev,
        verificationDocs: prev.verificationDocs.filter((_, i) => i !== index - currentUrls.verificationDocs.length),
      }));
      setPreviews((prev) => ({
        ...prev,
        verificationDocs: prev.verificationDocs.filter((_, i) => i !== index),
      }));
    } else {
      // Remove from current URLs
      setCurrentUrls((prev) => ({
        ...prev,
        verificationDocs: prev.verificationDocs.filter((_, i) => i !== index),
      }));
      setPreviews((prev) => ({
        ...prev,
        verificationDocs: prev.verificationDocs.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.organizationName.trim()) {
      toast.error("Vui lòng nhập tên tổ chức");
      return;
    }
    if (!formData.representativeName.trim()) {
      toast.error("Vui lòng nhập tên người đại diện");
      return;
    }
    if (!formData.district) {
      toast.error("Vui lòng chọn quận/huyện");
      return;
    }
    if (!formData.addressDetail.trim()) {
      toast.error("Vui lòng nhập địa chỉ chi tiết");
      return;
    }

    setIsSaving(true);

    try {
      // Tạo FormData để gửi files
      const submitData = new FormData();
      submitData.append("organizationName", formData.organizationName);
      submitData.append("representativeName", formData.representativeName);
      if (formData.description)
        submitData.append("description", formData.description);
      if (formData.website) submitData.append("website", formData.website);
      submitData.append("district", formData.district);
      submitData.append("addressDetail", formData.addressDetail);

      // Thêm files nếu có
      if (files.avatar) submitData.append("avatarUrl", files.avatar);
      if (files.businessLicense)
        submitData.append("businessLicense", files.businessLicense);
      files.verificationDocs.forEach((file) =>
        submitData.append("verificationDocs", file)
      );

      // Thêm URLs hiện tại của verification docs (để backend giữ lại)
      currentUrls.verificationDocs.forEach((url) =>
        submitData.append("keepingVerificationDocs", url)
      );

      // Gọi API update
      const response = await api.patch("/users/profile/organization", submitData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        toast.success("Cập nhật thông tin thành công!");
        await loadProfile(); // Reload profile
      }
    } catch (error: unknown) {
      console.error("Error updating profile:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi cập nhật thông tin: " + errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-[#008080] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Dashboard", href: "/socialorg/dashboard" },
            { label: "Thông tin cá nhân" },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4 group">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#008080] to-teal-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {previews.avatar ? (
                  <img
                    src={previews.avatar}
                    alt="Organization Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-16 h-16" />
                )}
              </div>
              {/* Upload/Remove overlay */}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
              >
                <Upload className="w-8 h-8 text-white" />
                <input
                  id="avatar-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={(e) => handleSingleImageChange(e, "avatar")}
                />
              </label>
              {previews.avatar && (
                <button
                  type="button"
                  onClick={() => handleRemoveSingleImage("avatar")}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {formData.organizationName || "Tổ chức chưa hoàn thiện"}
            </h1>
            <p className="text-sm text-gray-500 mb-1">HỒ SƠ TỔ CHỨC XÃ HỘI</p>
            <div className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
              Đã xác thực
            </div>
            <p className="text-xs text-gray-400 mt-2">
              {formData.district && DISTRICTS.find(d => d.value === formData.district)?.label} • {formData.addressDetail || "Chưa cập nhật địa chỉ"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Left Column - Basic Info */}
            <div className="space-y-6">
              {/* Thông tin cơ bản */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-base">Thông tin tổ chức</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700">
                      Tên tổ chức <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="organizationName"
                      required
                      value={formData.organizationName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          organizationName: e.target.value,
                        })
                      }
                      className="h-10 border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
                      placeholder="Nhập tên đầy đủ của tổ chức"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="representativeName" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      Người đại diện <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="representativeName"
                      required
                      value={formData.representativeName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          representativeName: e.target.value,
                        })
                      }
                      className="h-10 border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
                      placeholder="Họ và tên người đại diện"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Mô tả tổ chức
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="resize-none border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
                      placeholder="Giới thiệu về tổ chức, lĩnh vực hoạt động, mục tiêu..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-gray-400" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="h-10 border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
                      placeholder="https://example.org"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Địa chỉ */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-base">Địa chỉ</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="district" className="text-sm font-medium text-gray-700">
                      Quận/Huyện <span className="text-red-600">*</span>
                    </Label>
                    <select
                      id="district"
                      required
                      className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:border-[#008080] focus:ring-[#008080]/10 focus:outline-none"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                    >
                      <option value="">Chọn quận/huyện</option>
                      {DISTRICTS.map((district) => (
                        <option key={district.value} value={district.value}>
                          {district.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="addressDetail" className="text-sm font-medium text-gray-700">
                      Địa chỉ chi tiết <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="addressDetail"
                      required
                      value={formData.addressDetail}
                      onChange={(e) =>
                        setFormData({ ...formData, addressDetail: e.target.value })
                      }
                      className="h-10 border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Documents */}
            <div className="space-y-6">
              {/* Giấy phép kinh doanh */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-base">Giấy phép kinh doanh</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {previews.businessLicense ? (
                    <div className="relative w-full h-48 group">
                      <img
                        src={previews.businessLicense}
                        alt="Business license"
                        className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSingleImage("businessLicense")}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {/* Replace overlay */}
                      <label
                        htmlFor="business-license-upload"
                        className="absolute inset-0 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                      >
                        <span className="text-white text-sm font-medium">Thay đổi ảnh</span>
                        <input
                          id="business-license-upload"
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleSingleImageChange(e, "businessLicense")}
                        />
                      </label>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#008080] transition-colors bg-gray-50">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 font-medium">Nhấn để chọn ảnh</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG (max 5MB)</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) =>
                          handleSingleImageChange(e, "businessLicense")
                        }
                      />
                    </label>
                  )}
                </CardContent>
              </Card>

              {/* Tài liệu xác minh */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5 text-gray-600" />
                      <CardTitle className="text-base">Tài liệu xác minh</CardTitle>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {previews.verificationDocs.length} tài liệu
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#008080] transition-colors bg-gray-50">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-600 font-medium">Chọn thêm tài liệu</p>
                      <p className="text-xs text-gray-400">PNG, JPG (max 5MB/ảnh)</p>
                    </div>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      accept="image/jpeg,image/jpg,image/png"
                      onChange={handleMultipleImagesChange}
                    />
                  </label>

                  {previews.verificationDocs.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50/50">
                      {previews.verificationDocs.map((preview, index) => (
                        <div key={index} className="relative aspect-square group">
                          <img
                            src={preview}
                            alt={`Document ${index + 1}`}
                            className="w-full h-full object-cover rounded-lg border-2 border-gray-300"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveMultipleImage(
                                index,
                                index >= currentUrls.verificationDocs.length
                              )
                            }
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-lg"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/socialorg/dashboard")}
              className="border-gray-300"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-[#008080] hover:bg-[#006666] text-white px-6"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
