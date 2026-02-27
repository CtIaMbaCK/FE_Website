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
    <div className="min-h-screen pb-10">
      {/* Breadcrumb */}
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center mb-2">
          <Breadcrumb
            items={[
               { label: "Thông tin cá nhân" },
            ]}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col px-6 mx-auto w-full">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 mb-8 relative overflow-hidden flex items-center gap-8">
          <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
             <div className="w-64 h-64 bg-teal-300 rounded-full blur-3xl"></div>
          </div>
          <div className="flex items-center gap-8 relative z-10 w-full">
            <div className="relative group shrink-0">
              <div className="w-32 h-32 rounded-[2rem] bg-gradient-to-br from-[#008080] to-teal-600 flex items-center justify-center text-white text-4xl font-black shadow-md overflow-hidden rotate-3 hover:rotate-0 transition-transform">
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
                className="absolute inset-0 bg-slate-900/60 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center rotate-3 hover:rotate-0"
              >
                <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                   <Upload className="w-6 h-6 text-white" />
                </div>
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
                  className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg z-20"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <div className="flex flex-col flex-1 min-w-0">
               <div className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-lg text-xs font-bold uppercase tracking-wider mb-2 w-fit border border-teal-100">
                 Đã xác thực
               </div>
               <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1 truncate">
                 {formData.organizationName || "Tổ chức chưa hoàn thiện"}
               </h1>
               <p className="text-slate-500 flex items-center gap-2 mt-2 font-medium">
                  <MapPin className="w-4 h-4" />
                 {formData.district && DISTRICTS.find(d => d.value === formData.district)?.label} • {formData.addressDetail || "Chưa cập nhật địa chỉ"}
               </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-4">
            {/* Left Column - Basic Info */}
            <div className="space-y-8">
              {/* Thông tin cơ bản */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden">
                <div className="p-6 border-b border-slate-100/60 bg-slate-50/30 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-sm border border-teal-100/50">
                       <Building2 className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black text-slate-800">Thông tin tổ chức</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="organizationName" className="text-sm font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                      Tên tổ chức <span className="text-red-500">*</span>
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
                      className="h-12 border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl outline-none text-sm transition-all"
                      placeholder="Nhập tên đầy đủ của tổ chức"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="representativeName" className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2 w-fit">
                      <User className="w-4 h-4 text-slate-400" />
                      Người đại diện <span className="text-red-500">*</span>
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
                      className="h-12 border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl outline-none text-sm transition-all"
                      placeholder="Họ và tên người đại diện"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="description" className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Mô tả tổ chức
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      rows={4}
                      className="resize-none border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl outline-none text-sm transition-all py-3"
                      placeholder="Giới thiệu về tổ chức, lĩnh vực hoạt động, mục tiêu..."
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="website" className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Globe className="w-4 h-4 text-slate-400" />
                      Website
                    </Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) =>
                        setFormData({ ...formData, website: e.target.value })
                      }
                      className="h-12 border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl outline-none text-sm transition-all"
                      placeholder="https://example.org"
                    />
                  </div>
                </div>
              </div>

              {/* Địa chỉ */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden">
                <div className="p-6 border-b border-slate-100/60 bg-slate-50/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm border border-orange-100/50">
                     <MapPin className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-slate-800">Địa chỉ</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="district" className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Quận/Huyện <span className="text-red-500">*</span>
                    </Label>
                    <select
                      id="district"
                      required
                      className="w-full h-12 px-4 border border-slate-200 rounded-xl text-sm focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-all outline-none bg-white font-medium"
                      value={formData.district}
                      onChange={(e) =>
                        setFormData({ ...formData, district: e.target.value })
                      }
                    >
                      <option value="">Chọn quận/huyện</option>
                      {DISTRICTS.map((district) => (
                        <option key={district.value} value={district.value} className="py-2">
                          {district.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="addressDetail" className="text-[11px] text-slate-700 font-bold uppercase tracking-wider">
                      Địa chỉ chi tiết <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="addressDetail"
                      required
                      value={formData.addressDetail}
                      onChange={(e) =>
                        setFormData({ ...formData, addressDetail: e.target.value })
                      }
                      className="h-12 border-slate-200 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 rounded-xl outline-none text-sm transition-all"
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Documents */}
            <div className="space-y-8">
              {/* Giấy phép kinh doanh */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden">
                <div className="p-6 border-b border-slate-100/60 bg-slate-50/30 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm border border-blue-100/50">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-black text-slate-800">Giấy phép hoạt động</h2>
                </div>
                <div className="p-6">
                  {previews.businessLicense ? (
                    <div className="relative w-full aspect-video rounded-2xl group overflow-hidden border border-slate-200">
                      <img
                        src={previews.businessLicense}
                        alt="Business license"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveSingleImage("businessLicense")}
                        className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg z-20"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      {/* Replace overlay */}
                      <label
                        htmlFor="business-license-upload"
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
                      >
                        <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md flex flex-col items-center gap-2">
                            <Upload className="text-white w-6 h-6" />
                            <span className="text-white text-sm font-bold">Thay đổi ảnh</span>
                        </div>
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
                    <label className="flex flex-col items-center justify-center w-full aspect-video border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all bg-slate-50 relative group">
                      <div className="flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform">
                          <Upload className="w-8 h-8 text-teal-500" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Tải ảnh lên hoặc kéo thả vào đây</p>
                        <p className="text-xs font-medium text-slate-400 mt-2">PNG, JPG (tối đa 5MB)</p>
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
                </div>
              </div>

              {/* Tài liệu xác minh */}
              <div className="bg-white/80 backdrop-blur-xl border border-slate-100 rounded-[2rem] shadow-sm relative overflow-hidden">
                <div className="p-6 border-b border-slate-100/60 bg-slate-50/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm border border-purple-100/50">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-black text-slate-800">Tài liệu xác minh</h2>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-teal-600 font-bold bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
                    {previews.verificationDocs.length} tài liệu
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <label className="flex flex-col items-center justify-center w-full min-h-36 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-teal-500 hover:bg-teal-50/50 transition-all bg-slate-50 group">
                    <div className="flex flex-col items-center justify-center py-6">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 group-hover:-translate-y-1 transition-transform">
                         <Upload className="w-6 h-6 text-teal-500" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Chọn thêm tài liệu (*)</p>
                      <p className="text-xs font-medium text-slate-400 mt-1">Nhiều ảnh, tối đa 5MB/ảnh</p>
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
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                      {previews.verificationDocs.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-2xl group overflow-hidden border border-slate-200">
                          <img
                            src={preview}
                            alt={`Document ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                             <button
                               type="button"
                               onClick={() =>
                                 handleRemoveMultipleImage(
                                   index,
                                   index >= currentUrls.verificationDocs.length
                                 )
                               }
                               className="bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg scale-75 group-hover:scale-100"
                             >
                               <X className="w-5 h-5" />
                             </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4 mb-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/socialorg/dashboard")}
              className="h-12 border-slate-200 font-bold text-slate-600 rounded-xl hover:bg-slate-50 px-8"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
              className="h-12 bg-gradient-to-r from-[#008080] to-teal-500 hover:from-[#006666] hover:to-[#008080] text-white px-8 rounded-xl font-bold tracking-wide shadow-md hover:shadow-lg transition-all"
            >
              {isSaving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Lưu thay đổi hồ sơ
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
