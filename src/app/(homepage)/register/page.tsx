"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { register } from "@/services/auth.service";
import { toast } from "sonner";
import Icon from "@/components/icons";
import { ChevronLeft, ChevronRight, Upload, X } from "lucide-react";
import { uploadImage } from "@/services/cloudinary.service";

type UserRole = "VOLUNTEER" | "BENEFICIARY" | "ORGANIZATION";

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

// Kỹ năng cho TNV
const SKILLS = [
  { value: "TEACHING", label: "Giảng dạy" },
  { value: "MEDICAL", label: "Y tế" },
  { value: "PSYCHOLOGICAL", label: "Tâm lý" },
  { value: "LEGAL", label: "Pháp lý" },
  { value: "SOCIAL_WORK", label: "Công tác xã hội" },
  { value: "DISASTER_RELIEF", label: "Cứu trợ thảm họa" },
  { value: "FUNDRAISING", label: "Gây quỹ" },
  { value: "LOGISTICS", label: "Hậu cần" },
  { value: "COMMUNICATION", label: "Truyền thông" },
  { value: "IT_SUPPORT", label: "Hỗ trợ IT" },
  { value: "OTHER", label: "Khác" },
];

// Loại hoàn cảnh khó khăn
const VULNERABILITY_TYPES = [
  { value: "POOR", label: "Hộ nghèo" },
  { value: "NEAR_POOR", label: "Hộ cận nghèo" },
  { value: "DISABILITY", label: "Người khuyết tật" },
  { value: "ELDERLY_ALONE", label: "Người cao tuổi sống một mình" },
  { value: "ORPHAN", label: "Trẻ em mồ côi" },
  { value: "SINGLE_PARENT", label: "Gia đình đơn thân" },
  { value: "CHRONIC_ILLNESS", label: "Bệnh hiểm nghèo" },
  { value: "DISASTER_VICTIM", label: "Nạn nhân thiên tai" },
  { value: "OTHER", label: "Khác" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Profile Info
  const [isLoading, setIsLoading] = useState(false);
  const [isSeePassword, setSeePassword] = useState(false);
  const [isSeeConfirmPassword, setIsSeeConfirmPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  // Step 1: Thông tin cơ bản (User table)
  const [basicData, setBasicData] = useState({
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Step 2: Thông tin profile theo role
  const [volunteerData, setVolunteerData] = useState({
    fullName: "",
    bio: "",
    experienceYears: 0,
    skills: [] as string[],
    preferredDistricts: [] as string[],
  });

  const [beneficiaryData, setBeneficiaryData] = useState({
    fullName: "",
    vulnerabilityType: "",
    situationDescription: "",
    healthCondition: "",
    guardianName: "",
    guardianPhone: "",
    guardianRelation: "",
  });

  const [organizationData, setOrganizationData] = useState({
    organizationName: "",
    representativeName: "",
    description: "",
    website: "",
    district: "",
    addressDetail: "",
  });

  // State cho file ảnh
  const [volunteerFiles, setVolunteerFiles] = useState<{
    avatar: File | null;
    cccdFront: File | null;
    cccdBack: File | null;
  }>({
    avatar: null,
    cccdFront: null,
    cccdBack: null,
  });

  const [beneficiaryFiles, setBeneficiaryFiles] = useState<{
    avatar: File | null;
    cccdFront: File | null;
    cccdBack: File | null;
    proofFiles: File[];
  }>({
    avatar: null,
    cccdFront: null,
    cccdBack: null,
    proofFiles: [],
  });

  const [organizationFiles, setOrganizationFiles] = useState<{
    avatar: File | null;
    businessLicense: File | null;
    verificationDocs: File[];
  }>({
    avatar: null,
    businessLicense: null,
    verificationDocs: [],
  });

  // State cho preview ảnh
  const [volunteerPreviews, setVolunteerPreviews] = useState<{
    avatar: string | null;
    cccdFront: string | null;
    cccdBack: string | null;
  }>({
    avatar: null,
    cccdFront: null,
    cccdBack: null,
  });

  const [beneficiaryPreviews, setBeneficiaryPreviews] = useState<{
    avatar: string | null;
    cccdFront: string | null;
    cccdBack: string | null;
    proofFiles: string[];
  }>({
    avatar: null,
    cccdFront: null,
    cccdBack: null,
    proofFiles: [],
  });

  const [organizationPreviews, setOrganizationPreviews] = useState<{
    avatar: string | null;
    businessLicense: string | null;
    verificationDocs: string[];
  }>({
    avatar: null,
    businessLicense: null,
    verificationDocs: [],
  });

  // Hàm xử lý chọn file ảnh đơn
  const handleSingleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    role: "volunteer" | "beneficiary" | "organization",
    field: string
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

      if (role === "volunteer") {
        setVolunteerFiles((prev) => ({ ...prev, [field]: file }));
        setVolunteerPreviews((prev) => ({ ...prev, [field]: preview }));
      } else if (role === "beneficiary") {
        setBeneficiaryFiles((prev) => ({ ...prev, [field]: file }));
        setBeneficiaryPreviews((prev) => ({ ...prev, [field]: preview }));
      } else if (role === "organization") {
        setOrganizationFiles((prev) => ({ ...prev, [field]: file }));
        setOrganizationPreviews((prev) => ({ ...prev, [field]: preview }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Hàm xử lý chọn nhiều file (proof files, verification docs)
  const handleMultipleImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    role: "beneficiary" | "organization",
    field: string
  ) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate each file
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    files.forEach((file) => {
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
          if (role === "beneficiary") {
            setBeneficiaryFiles((prev) => ({
              ...prev,
              proofFiles: [...prev.proofFiles, ...validFiles],
            }));
            setBeneficiaryPreviews((prev) => ({
              ...prev,
              proofFiles: [...prev.proofFiles, ...validPreviews],
            }));
          } else if (role === "organization") {
            setOrganizationFiles((prev) => ({
              ...prev,
              verificationDocs: [...prev.verificationDocs, ...validFiles],
            }));
            setOrganizationPreviews((prev) => ({
              ...prev,
              verificationDocs: [...prev.verificationDocs, ...validPreviews],
            }));
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Hàm xóa ảnh đơn
  const handleRemoveSingleImage = (
    role: "volunteer" | "beneficiary" | "organization",
    field: string
  ) => {
    if (role === "volunteer") {
      setVolunteerFiles((prev) => ({ ...prev, [field]: null }));
      setVolunteerPreviews((prev) => ({ ...prev, [field]: null }));
    } else if (role === "beneficiary") {
      setBeneficiaryFiles((prev) => ({ ...prev, [field]: null }));
      setBeneficiaryPreviews((prev) => ({ ...prev, [field]: null }));
    } else if (role === "organization") {
      setOrganizationFiles((prev) => ({ ...prev, [field]: null }));
      setOrganizationPreviews((prev) => ({ ...prev, [field]: null }));
    }
  };

  // Hàm xóa ảnh từ mảng
  const handleRemoveMultipleImage = (
    role: "beneficiary" | "organization",
    field: string,
    index: number
  ) => {
    if (role === "beneficiary") {
      setBeneficiaryFiles((prev) => ({
        ...prev,
        proofFiles: prev.proofFiles.filter((_, i) => i !== index),
      }));
      setBeneficiaryPreviews((prev) => ({
        ...prev,
        proofFiles: prev.proofFiles.filter((_, i) => i !== index),
      }));
    } else if (role === "organization") {
      setOrganizationFiles((prev) => ({
        ...prev,
        verificationDocs: prev.verificationDocs.filter((_, i) => i !== index),
      }));
      setOrganizationPreviews((prev) => ({
        ...prev,
        verificationDocs: prev.verificationDocs.filter((_, i) => i !== index),
      }));
    }
  };

  // Chuyển step
  const handleNextStep = () => {
    if (!selectedRole) {
      toast.error("Vui lòng chọn loại tài khoản");
      return;
    }

    if (basicData.password !== basicData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    if (basicData.password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    setStep(2);
  };

  const handleBackStep = () => {
    setStep(1);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validation theo role
    if (selectedRole === "VOLUNTEER" && !volunteerData.fullName.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    if (selectedRole === "BENEFICIARY") {
      if (!beneficiaryData.fullName.trim()) {
        toast.error("Vui lòng nhập họ tên");
        return;
      }
      if (!beneficiaryData.vulnerabilityType) {
        toast.error("Vui lòng chọn loại hoàn cảnh");
        return;
      }
    }

    if (selectedRole === "ORGANIZATION") {
      if (!organizationData.organizationName.trim()) {
        toast.error("Vui lòng nhập tên tổ chức");
        return;
      }
      if (!organizationData.representativeName.trim()) {
        toast.error("Vui lòng nhập tên người đại diện");
        return;
      }
      if (!organizationData.district) {
        toast.error("Vui lòng chọn quận/huyện");
        return;
      }
      if (!organizationData.addressDetail.trim()) {
        toast.error("Vui lòng nhập địa chỉ chi tiết");
        return;
      }
    }

    setIsLoading(true);

    try {
      // Bước 1: Đăng ký tài khoản cơ bản
      const registerResponse = await register({
        phoneNumber: basicData.phoneNumber,
        email: basicData.email,
        password: basicData.password,
        role: selectedRole!,
      });

      toast.success("Đăng ký tài khoản thành công!");

      // Lấy token từ response
      const token = registerResponse.accessToken;
      localStorage.setItem("access_token", token);

      // Bước 2: Tạo FormData và gửi files trực tiếp đến backend
      toast.info("Đang xử lý hồ sơ...");

      const profileEndpoint =
        selectedRole === "VOLUNTEER"
          ? "/auth/profile/tnv"
          : selectedRole === "BENEFICIARY"
            ? "/auth/profile/ncgd"
            : "/auth/profile/organization";

      const formData = new FormData();

      // Thêm text fields theo role
      if (selectedRole === "VOLUNTEER") {
        formData.append("fullName", volunteerData.fullName);
        if (volunteerData.bio) formData.append("bio", volunteerData.bio);
        formData.append(
          "experienceYears",
          volunteerData.experienceYears.toString(),
        );
        volunteerData.skills.forEach((skill) => formData.append("skills", skill));
        volunteerData.preferredDistricts.forEach((district) =>
          formData.append("preferredDistricts", district),
        );

        // Thêm files
        if (volunteerFiles.avatar)
          formData.append("avatarUrl", volunteerFiles.avatar);
        if (volunteerFiles.cccdFront)
          formData.append("cccdFront", volunteerFiles.cccdFront);
        if (volunteerFiles.cccdBack)
          formData.append("cccdBack", volunteerFiles.cccdBack);
      } else if (selectedRole === "BENEFICIARY") {
        formData.append("fullName", beneficiaryData.fullName);
        formData.append(
          "vulnerabilityType",
          beneficiaryData.vulnerabilityType,
        );
        if (beneficiaryData.situationDescription)
          formData.append(
            "situationDescription",
            beneficiaryData.situationDescription,
          );
        if (beneficiaryData.healthCondition)
          formData.append("healthCondition", beneficiaryData.healthCondition);
        if (beneficiaryData.guardianName)
          formData.append("guardianName", beneficiaryData.guardianName);
        if (beneficiaryData.guardianPhone)
          formData.append("guardianPhone", beneficiaryData.guardianPhone);
        if (beneficiaryData.guardianRelation)
          formData.append("guardianRelation", beneficiaryData.guardianRelation);

        // Thêm files
        if (beneficiaryFiles.avatar)
          formData.append("avatarUrl", beneficiaryFiles.avatar);
        if (beneficiaryFiles.cccdFront)
          formData.append("cccdFront", beneficiaryFiles.cccdFront);
        if (beneficiaryFiles.cccdBack)
          formData.append("cccdBack", beneficiaryFiles.cccdBack);
        beneficiaryFiles.proofFiles.forEach((file) =>
          formData.append("proofFiles", file),
        );
      } else if (selectedRole === "ORGANIZATION") {
        formData.append("organizationName", organizationData.organizationName);
        formData.append(
          "representativeName",
          organizationData.representativeName,
        );
        if (organizationData.description)
          formData.append("description", organizationData.description);
        if (organizationData.website)
          formData.append("website", organizationData.website);
        formData.append("district", organizationData.district);
        formData.append("addressDetail", organizationData.addressDetail);

        // Thêm files
        if (organizationFiles.avatar)
          formData.append("avatarUrl", organizationFiles.avatar);
        if (organizationFiles.businessLicense)
          formData.append("businessLicense", organizationFiles.businessLicense);
        organizationFiles.verificationDocs.forEach((file) =>
          formData.append("verificationDocs", file),
        );
      }

      // Gửi profile data
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}${profileEndpoint}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!response.ok) {
        throw new Error("Lỗi khi tạo hồ sơ");
      }

      toast.success("Hoàn thiện hồ sơ thành công!");

      // Redirect theo role
      if (selectedRole === "VOLUNTEER" || selectedRole === "BENEFICIARY") {
        toast.info("Vui lòng tải ứng dụng di động để trải nghiệm đầy đủ!", {
          duration: 5000,
        });
        setTimeout(() => {
          localStorage.removeItem("access_token");
          router.push("/");
        }, 2000);
      } else if (selectedRole === "ORGANIZATION") {
        toast.info("Tài khoản đang chờ Admin duyệt", {
          duration: 5000,
        });
        setTimeout(() => {
          localStorage.removeItem("access_token");
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC] overflow-hidden flex flex-col font-sans">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#008080]/10 blur-[120px]" />
        <div className="absolute top-[20%] -right-[15%] w-[45%] h-[55%] rounded-full bg-blue-300/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-[#008080]/15 blur-[150px]" />
      </div>

      <main className="relative z-10 flex-grow flex items-center justify-center p-4 py-8 lg:py-16">
        <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-[2.5rem] shadow-[0_30px_60px_rgba(0,128,128,0.12)] w-full max-w-4xl overflow-hidden">
          {/* Header minimalist */}
          <div className="px-8 py-8 border-b border-white/40 bg-white/40 backdrop-blur-md">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Đăng ký tài khoản
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {step === 1
                ? "Bước 1: Thông tin cơ bản"
                : "Bước 2: Hoàn thiện hồ sơ"}
            </p>
          </div>

          {/* Progress bar minimalist */}
          <div className="px-8 py-4 bg-white/20 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div
                className={`h-2 flex-1 rounded-full transition-all duration-500 shadow-inner ${
                  step >= 1 ? "bg-gradient-to-r from-[#008080] to-[#00A79D]" : "bg-slate-200/50"
                }`}
              />
              <div
                className={`h-2 flex-1 rounded-full transition-all duration-500 shadow-inner ${
                  step >= 2 ? "bg-gradient-to-r from-[#008080] to-[#00A79D]" : "bg-slate-200/50"
                }`}
              />
            </div>
          </div>

          {/* Animated Form Container */}
          <div className="px-6 py-8 sm:px-10">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out items-start"
                style={{ transform: `translateX(-${(step - 1) * 100}%)` }}
              >
                {/* STEP 1: Basic Info */}
                <div className={`w-full shrink-0 px-1 transition-all duration-500 ${step === 1 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleNextStep();
                    }}
                    className="space-y-5"
                  >
                    {/* Role Selection */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-4">
                        Chọn loại tài khoản *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button
                          type="button"
                          onClick={() => setSelectedRole("VOLUNTEER")}
                          className={`relative p-5 border-2 rounded-2xl transition-all duration-300 ${
                            selectedRole === "VOLUNTEER"
                              ? "border-[#008080] bg-gradient-to-br from-[#008080]/10 to-[#00A79D]/5 shadow-[0_10px_20px_rgba(0,128,128,0.1)] scale-[1.02]"
                              : "border-slate-200 bg-white/50 hover:border-[#008080]/50 hover:bg-white hover:shadow-md"
                          }`}
                        >
                          <div className="text-center group">
                            <div className="text-4xl mb-3 transform transition-transform group-hover:scale-110">🙋‍♂️</div>
                            <div
                              className={`font-bold text-base mb-1 ${
                                selectedRole === "VOLUNTEER"
                                  ? "text-[#008080]"
                                  : "text-slate-700"
                              }`}
                            >
                              Tình nguyện viên
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              Tham gia hoạt động
                            </div>
                          </div>
                          {selectedRole === "VOLUNTEER" && (
                            <div className="absolute top-3 right-3 bg-gradient-to-tr from-[#008080] to-[#00A79D] text-white rounded-full p-1 shadow-sm animate-fade-in">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRole("BENEFICIARY")}
                          className={`relative p-5 border-2 rounded-2xl transition-all duration-300 ${
                            selectedRole === "BENEFICIARY"
                              ? "border-[#008080] bg-gradient-to-br from-[#008080]/10 to-[#00A79D]/5 shadow-[0_10px_20px_rgba(0,128,128,0.1)] scale-[1.02]"
                              : "border-slate-200 bg-white/50 hover:border-[#008080]/50 hover:bg-white hover:shadow-md"
                          }`}
                        >
                          <div className="text-center group">
                            <div className="text-4xl mb-3 transform transition-transform group-hover:scale-110">🤝</div>
                            <div
                              className={`font-bold text-base mb-1 ${
                                selectedRole === "BENEFICIARY"
                                  ? "text-[#008080]"
                                  : "text-slate-700"
                              }`}
                            >
                              Người cần hỗ trợ
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              Nhận sự giúp đỡ
                            </div>
                          </div>
                          {selectedRole === "BENEFICIARY" && (
                            <div className="absolute top-3 right-3 bg-gradient-to-tr from-[#008080] to-[#00A79D] text-white rounded-full p-1 shadow-sm animate-fade-in">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => setSelectedRole("ORGANIZATION")}
                          className={`relative p-5 border-2 rounded-2xl transition-all duration-300 ${
                            selectedRole === "ORGANIZATION"
                              ? "border-[#008080] bg-gradient-to-br from-[#008080]/10 to-[#00A79D]/5 shadow-[0_10px_20px_rgba(0,128,128,0.1)] scale-[1.02]"
                              : "border-slate-200 bg-white/50 hover:border-[#008080]/50 hover:bg-white hover:shadow-md"
                          }`}
                        >
                          <div className="text-center group">
                            <div className="text-4xl mb-3 transform transition-transform group-hover:scale-110">🏢</div>
                            <div
                              className={`font-bold text-base mb-1 ${
                                selectedRole === "ORGANIZATION"
                                  ? "text-[#008080]"
                                  : "text-slate-700"
                              }`}
                            >
                              Tổ chức xã hội
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              Quản lý hoạt động
                            </div>
                          </div>
                          {selectedRole === "ORGANIZATION" && (
                            <div className="absolute top-3 right-3 bg-gradient-to-tr from-[#008080] to-[#00A79D] text-white rounded-full p-1 shadow-sm animate-fade-in">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-6">
                      {/* Phone */}
                      <div>
                        <Label
                          htmlFor="phoneNumber"
                          className="text-slate-800 font-semibold text-sm"
                        >
                          Số điện thoại *
                        </Label>
                        <Input
                          id="phoneNumber"
                          required
                          type="text"
                          placeholder="0123456789"
                          value={basicData.phoneNumber}
                          onChange={(e) =>
                            setBasicData({
                              ...basicData,
                              phoneNumber: e.target.value,
                            })
                          }
                          disabled={isLoading}
                          className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                        />
                      </div>

                      {/* Email */}
                      <div>
                        <Label
                          htmlFor="email"
                          className="text-slate-800 font-semibold text-sm"
                        >
                          Email *
                        </Label>
                        <Input
                          id="email"
                          required
                          type="email"
                          placeholder="example@email.com"
                          value={basicData.email}
                          onChange={(e) =>
                            setBasicData({
                              ...basicData,
                              email: e.target.value,
                            })
                          }
                          disabled={isLoading}
                          className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                        />
                      </div>
                    </div>

                    {/* Password */}
                    <div className="mt-5">
                      <Label
                        htmlFor="password"
                        className="text-slate-800 font-semibold text-sm"
                      >
                        Mật khẩu *
                      </Label>
                      <div className="mt-2 flex items-center gap-2 w-full px-4 h-12 bg-white/60 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-[#008080]/50 focus-within:ring-4 focus-within:ring-[#008080]/10 transition-all">
                        <input
                          className="flex-1 outline-none bg-transparent text-sm placeholder:text-slate-400"
                          id="password"
                          required
                          type={isSeePassword ? "text" : "password"}
                          placeholder="Tối thiểu 6 ký tự"
                          value={basicData.password}
                          onChange={(e) =>
                            setBasicData({
                              ...basicData,
                              password: e.target.value,
                            })
                          }
                          disabled={isLoading}
                        />
                        <Icon
                          icon={
                            isSeePassword ? "seePassword" : "notSeePassword"
                          }
                          onClick={() => setSeePassword(!isSeePassword)}
                          className="cursor-pointer text-slate-400 hover:text-[#008080] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="mt-5">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-slate-800 font-semibold text-sm"
                      >
                        Xác nhận mật khẩu *
                      </Label>

                      <div className="mt-2 flex items-center gap-2 w-full px-4 h-12 bg-white/60 border border-slate-200 rounded-xl focus-within:bg-white focus-within:border-[#008080]/50 focus-within:ring-4 focus-within:ring-[#008080]/10 transition-all">
                        <input
                          className="flex-1 outline-none bg-transparent text-sm placeholder:text-slate-400"
                          type={isSeeConfirmPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu"
                          value={basicData.confirmPassword}
                          onChange={(e) =>
                            setBasicData({
                              ...basicData,
                              confirmPassword: e.target.value,
                            })
                          }
                          disabled={isLoading}
                        />
                        <Icon
                          icon={
                            isSeeConfirmPassword
                              ? "seePassword"
                              : "notSeePassword"
                          }
                          onClick={() =>
                            setIsSeeConfirmPassword(!isSeeConfirmPassword)
                          }
                          className="cursor-pointer text-slate-400 hover:text-[#008080] transition-colors"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-12 mt-8 bg-gradient-to-r from-[#008080] to-[#00A79D] hover:shadow-[0_15px_30px_rgba(0,128,128,0.2)] hover:-translate-y-0.5 transition-all duration-300 text-white font-bold text-base rounded-full"
                      disabled={!selectedRole}
                    >
                      Tiếp theo <ChevronRight className="ml-1.5 w-5 h-5" />
                    </Button>
                  </form>
                </div>

                {/* STEP 2: Profile Info */}
                <div className={`w-full shrink-0 px-1 transition-all duration-500 ${step === 2 ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* TNV Profile */}
                    {selectedRole === "VOLUNTEER" && (
                      <>
                        <div>
                          <Label
                            htmlFor="fullName"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Họ và tên *
                          </Label>
                          <Input
                            id="fullName"
                            required
                            placeholder="Nguyễn Văn A"
                            value={volunteerData.fullName}
                            onChange={(e) =>
                              setVolunteerData({
                                ...volunteerData,
                                fullName: e.target.value,
                              })
                            }
                            className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="bio"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Giới thiệu bản thân
                          </Label>
                          <Textarea
                            id="bio"
                            placeholder="Chia sẻ về bản thân..."
                            value={volunteerData.bio}
                            onChange={(e) =>
                              setVolunteerData({
                                ...volunteerData,
                                bio: e.target.value,
                              })
                            }
                            rows={3}
                            className="mt-2 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all text-sm resize-none"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="experienceYears"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Số năm kinh nghiệm
                          </Label>
                          <Input
                            id="experienceYears"
                            type="number"
                            min="0"
                            placeholder="0"
                            value={volunteerData.experienceYears}
                            onChange={(e) =>
                              setVolunteerData({
                                ...volunteerData,
                                experienceYears: parseInt(e.target.value) || 0,
                              })
                            }
                            className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                          />
                        </div>

                        <div>
                          <Label className="text-slate-800 font-semibold text-sm">
                            Kỹ năng
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {SKILLS.map((skill) => (
                              <button
                                key={skill.value}
                                type="button"
                                onClick={() => {
                                  if (
                                    volunteerData.skills.includes(skill.value)
                                  ) {
                                    setVolunteerData({
                                      ...volunteerData,
                                      skills: volunteerData.skills.filter(
                                        (s) => s !== skill.value,
                                      ),
                                    });
                                  } else {
                                    setVolunteerData({
                                      ...volunteerData,
                                      skills: [
                                        ...volunteerData.skills,
                                        skill.value,
                                      ],
                                    });
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                                  volunteerData.skills.includes(skill.value)
                                    ? "bg-gradient-to-r from-[#008080] to-[#00A79D] text-white border-transparent shadow-md transform scale-105"
                                    : "bg-white/60 text-slate-600 border-slate-200 hover:border-[#008080]/50 hover:bg-white hover:text-[#008080] hover:shadow-sm"
                                }`}
                              >
                                {skill.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <Label className="text-slate-800 font-semibold text-sm">
                            Khu vực hoạt động
                          </Label>
                          <div className="flex flex-wrap gap-2 mt-2 max-h-40 overflow-y-auto p-3 border border-slate-200/60 rounded-2xl bg-white/40 shadow-inner">
                            {DISTRICTS.map((district) => (
                              <button
                                key={district.value}
                                type="button"
                                onClick={() => {
                                  if (
                                    volunteerData.preferredDistricts.includes(
                                      district.value,
                                    )
                                  ) {
                                    setVolunteerData({
                                      ...volunteerData,
                                      preferredDistricts:
                                        volunteerData.preferredDistricts.filter(
                                          (d) => d !== district.value,
                                        ),
                                    });
                                  } else {
                                    setVolunteerData({
                                      ...volunteerData,
                                      preferredDistricts: [
                                        ...volunteerData.preferredDistricts,
                                        district.value,
                                      ],
                                    });
                                  }
                                }}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                                  volunteerData.preferredDistricts.includes(
                                    district.value,
                                  )
                                    ? "bg-gradient-to-r from-[#008080] to-[#00A79D] text-white border-transparent shadow-md transform scale-105"
                                    : "bg-white/60 text-slate-600 border-slate-200 hover:border-[#008080]/50 hover:bg-white hover:text-[#008080] hover:shadow-sm"
                                }`}
                              >
                                {district.label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Upload ảnh cho Volunteer */}
                        <div className="border-t border-slate-200/60 pt-6 mt-6 space-y-4">
                          <h3 className="text-base font-bold text-slate-800">
                            Hình ảnh (không bắt buộc)
                          </h3>

                          {/* Avatar */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              Ảnh đại diện
                            </Label>
                            <div className="mt-2">
                              {volunteerPreviews.avatar ? (
                                <div className="relative w-32 h-32">
                                  <img
                                    src={volunteerPreviews.avatar}
                                    alt="Avatar preview"
                                    className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSingleImage(
                                        "volunteer",
                                        "avatar",
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                    <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                      Nhấn để chọn ảnh
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                      PNG, JPG (max 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) =>
                                      handleSingleImageChange(
                                        e,
                                        "volunteer",
                                        "avatar",
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* CCCD Front */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              CCCD mặt trước
                            </Label>
                            <div className="mt-2">
                              {volunteerPreviews.cccdFront ? (
                                <div className="relative w-full h-40">
                                  <img
                                    src={volunteerPreviews.cccdFront}
                                    alt="CCCD front"
                                    className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSingleImage(
                                        "volunteer",
                                        "cccdFront",
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                    <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                      Nhấn để chọn ảnh
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                      PNG, JPG (max 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) =>
                                      handleSingleImageChange(
                                        e,
                                        "volunteer",
                                        "cccdFront",
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* CCCD Back */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              CCCD mặt sau
                            </Label>
                            <div className="mt-2">
                              {volunteerPreviews.cccdBack ? (
                                <div className="relative w-full h-40">
                                  <img
                                    src={volunteerPreviews.cccdBack}
                                    alt="CCCD back"
                                    className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSingleImage(
                                        "volunteer",
                                        "cccdBack",
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                    <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                      Nhấn để chọn ảnh
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                      PNG, JPG (max 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) =>
                                      handleSingleImageChange(
                                        e,
                                        "volunteer",
                                        "cccdBack",
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* NCGĐ Profile */}
                    {selectedRole === "BENEFICIARY" && (
                      <>
                        <div>
                          <Label
                            htmlFor="fullName"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Họ và tên *
                          </Label>
                          <Input
                            id="fullName"
                            required
                            placeholder="Nguyễn Văn A"
                            value={beneficiaryData.fullName}
                            onChange={(e) =>
                              setBeneficiaryData({
                                ...beneficiaryData,
                                fullName: e.target.value,
                              })
                            }
                            className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="vulnerabilityType"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Loại hoàn cảnh *
                          </Label>
                          <select
                            id="vulnerabilityType"
                            required
                            className="mt-2 w-full h-12 px-4 bg-white/60 border border-slate-200 focus:bg-white focus:border-[#008080]/50 focus:ring-4 focus:ring-[#008080]/10 rounded-xl transition-all text-sm outline-none"
                            value={beneficiaryData.vulnerabilityType}
                            onChange={(e) =>
                              setBeneficiaryData({
                                ...beneficiaryData,
                                vulnerabilityType: e.target.value,
                              })
                            }
                          >
                            <option value="">Chọn loại hoàn cảnh</option>
                            {VULNERABILITY_TYPES.map((type) => (
                              <option key={type.value} value={type.value}>
                                {type.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <Label
                            htmlFor="situationDescription"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Mô tả hoàn cảnh
                          </Label>
                          <Textarea
                            id="situationDescription"
                            placeholder="Chia sẻ về hoàn cảnh..."
                            value={beneficiaryData.situationDescription}
                            onChange={(e) =>
                              setBeneficiaryData({
                                ...beneficiaryData,
                                situationDescription: e.target.value,
                              })
                            }
                            rows={3}
                            className="mt-2 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all text-sm resize-none"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="healthCondition"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Tình trạng sức khỏe
                          </Label>
                          <Textarea
                            id="healthCondition"
                            placeholder="Mô tả tình trạng sức khỏe..."
                            value={beneficiaryData.healthCondition}
                            onChange={(e) =>
                              setBeneficiaryData({
                                ...beneficiaryData,
                                healthCondition: e.target.value,
                              })
                            }
                            rows={2}
                            className="mt-2 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all text-sm resize-none"
                          />
                        </div>

                        <div className="border-t border-slate-200/60 pt-6 mt-6">
                          <h3 className="text-base font-bold text-slate-800 mb-3">
                            Thông tin người giám hộ (nếu có)
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label
                                htmlFor="guardianName"
                                className="text-slate-800 font-semibold text-sm"
                              >
                                Tên người giám hộ
                              </Label>
                              <Input
                                id="guardianName"
                                placeholder="Nhập tên"
                                value={beneficiaryData.guardianName}
                                onChange={(e) =>
                                  setBeneficiaryData({
                                    ...beneficiaryData,
                                    guardianName: e.target.value,
                                  })
                                }
                                className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                              />
                            </div>

                            <div>
                              <Label
                                htmlFor="guardianPhone"
                                className="text-slate-800 font-semibold text-sm"
                              >
                                Số điện thoại
                              </Label>
                              <Input
                                id="guardianPhone"
                                placeholder="0123456789"
                                value={beneficiaryData.guardianPhone}
                                onChange={(e) =>
                                  setBeneficiaryData({
                                    ...beneficiaryData,
                                    guardianPhone: e.target.value,
                                  })
                                }
                                className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                              />
                            </div>

                            <div className="sm:col-span-2">
                              <Label
                                htmlFor="guardianRelation"
                                className="text-slate-800 font-semibold text-sm"
                              >
                                Mối quan hệ
                              </Label>
                              <select
                                id="guardianRelation"
                                className="mt-2 w-full h-12 px-4 bg-white/60 border border-slate-200 focus:bg-white focus:border-[#008080]/50 focus:ring-4 focus:ring-[#008080]/10 rounded-xl transition-all text-sm outline-none"
                                value={beneficiaryData.guardianRelation}
                                onChange={(e) =>
                                  setBeneficiaryData({
                                    ...beneficiaryData,
                                    guardianRelation: e.target.value,
                                  })
                                }
                              >
                                <option value="">Chọn quan hệ</option>
                                <option value="PARENT">Cha/Mẹ</option>
                                <option value="SIBLING">Anh/Chị/Em</option>
                                <option value="CHILD">Con</option>
                                <option value="SPOUSE">Vợ/Chồng</option>
                                <option value="RELATIVE">Họ hàng</option>
                                <option value="CAREGIVER">
                                  Người chăm sóc
                                </option>
                                <option value="OTHER">Khác</option>
                              </select>
                            </div>
                          </div>
                        </div>

                        {/* Upload ảnh cho Beneficiary */}
                        <div className="border-t border-slate-200/60 pt-6 mt-6 space-y-4">
                          <h3 className="text-base font-bold text-slate-800">
                            Hình ảnh (không bắt buộc)
                          </h3>

                          {/* Avatar */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              Ảnh đại diện
                            </Label>
                            <div className="mt-2">
                              {beneficiaryPreviews.avatar ? (
                                <div className="relative w-32 h-32">
                                  <img
                                    src={beneficiaryPreviews.avatar}
                                    alt="Avatar preview"
                                    className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSingleImage(
                                        "beneficiary",
                                        "avatar",
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                    <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                      Nhấn để chọn ảnh
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                      PNG, JPG (max 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) =>
                                      handleSingleImageChange(
                                        e,
                                        "beneficiary",
                                        "avatar",
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* CCCD Front */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              CCCD mặt trước
                            </Label>
                            <div className="mt-2">
                              {beneficiaryPreviews.cccdFront ? (
                                <div className="relative w-full h-40">
                                  <img
                                    src={beneficiaryPreviews.cccdFront}
                                    alt="CCCD front"
                                    className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSingleImage(
                                        "beneficiary",
                                        "cccdFront",
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                    <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                      Nhấn để chọn ảnh
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                      PNG, JPG (max 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) =>
                                      handleSingleImageChange(
                                        e,
                                        "beneficiary",
                                        "cccdFront",
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* CCCD Back */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              CCCD mặt sau
                            </Label>
                            <div className="mt-2">
                              {beneficiaryPreviews.cccdBack ? (
                                <div className="relative w-full h-40">
                                  <img
                                    src={beneficiaryPreviews.cccdBack}
                                    alt="CCCD back"
                                    className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSingleImage(
                                        "beneficiary",
                                        "cccdBack",
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                    <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                      Nhấn để chọn ảnh
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                      PNG, JPG (max 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) =>
                                      handleSingleImageChange(
                                        e,
                                        "beneficiary",
                                        "cccdBack",
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* Proof Files (Multiple) */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              Ảnh minh chứng hoàn cảnh (có thể chọn nhiều ảnh)
                            </Label>
                            <div className="mt-2">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                  <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                    Nhấn để chọn ảnh
                                  </p>
                                  <p className="text-xs text-slate-500 mt-2 font-medium">
                                    PNG, JPG (max 5MB mỗi ảnh)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  multiple
                                  className="hidden"
                                  accept="image/jpeg,image/jpg,image/png"
                                  onChange={(e) =>
                                    handleMultipleImagesChange(
                                      e,
                                      "beneficiary",
                                      "proofFiles",
                                    )
                                  }
                                />
                              </label>

                              {beneficiaryPreviews.proofFiles.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                                  {beneficiaryPreviews.proofFiles.map(
                                    (preview, index) => (
                                      <div
                                        key={index}
                                        className="relative aspect-square"
                                      >
                                        <img
                                          src={preview}
                                          alt={`Proof ${index + 1}`}
                                          className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveMultipleImage(
                                              "beneficiary",
                                              "proofFiles",
                                              index,
                                            )
                                          }
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* TCXH Profile */}
                    {selectedRole === "ORGANIZATION" && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="organizationName"
                              className="text-slate-800 font-semibold text-sm"
                            >
                              Tên tổ chức *
                            </Label>
                            <Input
                              id="organizationName"
                              required
                              placeholder="VD: Hội Chữ thập đỏ"
                              value={organizationData.organizationName}
                              onChange={(e) =>
                                setOrganizationData({
                                  ...organizationData,
                                  organizationName: e.target.value,
                                })
                              }
                              className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                            />
                          </div>

                          <div>
                            <Label
                              htmlFor="representativeName"
                              className="text-slate-800 font-semibold text-sm"
                            >
                              Người đại diện *
                            </Label>
                            <Input
                              id="representativeName"
                              required
                              placeholder="Nguyễn Văn A"
                              value={organizationData.representativeName}
                              onChange={(e) =>
                                setOrganizationData({
                                  ...organizationData,
                                  representativeName: e.target.value,
                                })
                              }
                              className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="description"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Mô tả tổ chức
                          </Label>
                          <Textarea
                            id="description"
                            placeholder="Giới thiệu về tổ chức..."
                            value={organizationData.description}
                            onChange={(e) =>
                              setOrganizationData({
                                ...organizationData,
                                description: e.target.value,
                              })
                            }
                            rows={3}
                            className="mt-2 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all text-sm resize-none"
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="website"
                            className="text-slate-800 font-semibold text-sm"
                          >
                            Website
                          </Label>
                          <Input
                            id="website"
                            type="url"
                            placeholder="https://example.org"
                            value={organizationData.website}
                            onChange={(e) =>
                              setOrganizationData({
                                ...organizationData,
                                website: e.target.value,
                              })
                            }
                            className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="district"
                              className="text-slate-800 font-semibold text-sm"
                            >
                              Quận/Huyện *
                            </Label>
                            <select
                              id="district"
                              required
                              className="mt-2 w-full h-12 px-4 bg-white/60 border border-slate-200 focus:bg-white focus:border-[#008080]/50 focus:ring-4 focus:ring-[#008080]/10 rounded-xl transition-all text-sm outline-none"
                              value={organizationData.district}
                              onChange={(e) =>
                                setOrganizationData({
                                  ...organizationData,
                                  district: e.target.value,
                                })
                              }
                            >
                              <option value="">Chọn quận/huyện</option>
                              {DISTRICTS.map((district) => (
                                <option
                                  key={district.value}
                                  value={district.value}
                                >
                                  {district.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <Label
                              htmlFor="addressDetail"
                              className="text-slate-800 font-semibold text-sm"
                            >
                              Địa chỉ chi tiết *
                            </Label>
                            <Input
                              id="addressDetail"
                              required
                              placeholder="Số nhà, tên đường..."
                              value={organizationData.addressDetail}
                              onChange={(e) =>
                                setOrganizationData({
                                  ...organizationData,
                                  addressDetail: e.target.value,
                                })
                              }
                              className="mt-2 h-12 bg-white/60 border-slate-200 focus-visible:bg-white focus-visible:border-[#008080]/50 focus-visible:ring-[#008080]/20 rounded-xl transition-all"
                            />
                          </div>
                        </div>

                        {/* Upload ảnh cho Organization */}
                        <div className="border-t border-slate-200/60 pt-6 mt-6 space-y-4">
                          <h3 className="text-base font-bold text-slate-800">
                            Hình ảnh (không bắt buộc)
                          </h3>

                          {/* Avatar */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              Logo tổ chức
                            </Label>
                            <div className="mt-2">
                              {organizationPreviews.avatar ? (
                                <div className="relative w-32 h-32">
                                  <img
                                    src={organizationPreviews.avatar}
                                    alt="Logo preview"
                                    className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSingleImage(
                                        "organization",
                                        "avatar",
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                    <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                      Nhấn để chọn ảnh
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                      PNG, JPG (max 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) =>
                                      handleSingleImageChange(
                                        e,
                                        "organization",
                                        "avatar",
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* Business License */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              Giấy phép hoạt động
                            </Label>
                            <div className="mt-2">
                              {organizationPreviews.businessLicense ? (
                                <div className="relative w-full h-40">
                                  <img
                                    src={organizationPreviews.businessLicense}
                                    alt="Business license"
                                    className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveSingleImage(
                                        "organization",
                                        "businessLicense",
                                      )
                                    }
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                    <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                      Nhấn để chọn ảnh
                                    </p>
                                    <p className="text-xs text-slate-500 mt-2 font-medium">
                                      PNG, JPG (max 5MB)
                                    </p>
                                  </div>
                                  <input
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg,image/jpg,image/png"
                                    onChange={(e) =>
                                      handleSingleImageChange(
                                        e,
                                        "organization",
                                        "businessLicense",
                                      )
                                    }
                                  />
                                </label>
                              )}
                            </div>
                          </div>

                          {/* Verification Docs (Multiple) */}
                          <div>
                            <Label className="text-slate-800 font-semibold text-sm">
                              Tài liệu xác minh (có thể chọn nhiều ảnh)
                            </Label>
                            <div className="mt-2">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 bg-white/50 rounded-2xl cursor-pointer hover:border-[#008080]/50 hover:bg-white/80 transition-all group">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-10 h-10 text-slate-400 mb-3 group-hover:text-[#008080] group-hover:scale-110 transition-all duration-300" />
                                  <p className="text-white bg-slate-400 font-semibold rounded px-2 py-0.5 mt-1">
                                    Nhấn để chọn ảnh
                                  </p>
                                  <p className="text-xs text-slate-500 mt-2 font-medium">
                                    PNG, JPG (max 5MB mỗi ảnh)
                                  </p>
                                </div>
                                <input
                                  type="file"
                                  multiple
                                  className="hidden"
                                  accept="image/jpeg,image/jpg,image/png"
                                  onChange={(e) =>
                                    handleMultipleImagesChange(
                                      e,
                                      "organization",
                                      "verificationDocs",
                                    )
                                  }
                                />
                              </label>

                              {organizationPreviews.verificationDocs.length >
                                0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                                  {organizationPreviews.verificationDocs.map(
                                    (preview, index) => (
                                      <div
                                        key={index}
                                        className="relative aspect-square"
                                      >
                                        <img
                                          src={preview}
                                          alt={`Document ${index + 1}`}
                                          className="w-full h-full object-cover rounded-2xl border-2 border-white/60 shadow-md"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveMultipleImage(
                                              "organization",
                                              "verificationDocs",
                                              index,
                                            )
                                          }
                                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ),
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex gap-4 pt-6 mt-8 border-t border-slate-200/60">
                      <Button
                        type="button"
                        onClick={handleBackStep}
                        className="flex-1 h-12 bg-white/80 border border-slate-200 hover:bg-white hover:text-[#008080] hover:shadow-md text-slate-600 font-semibold rounded-full transition-all"
                      >
                        <ChevronLeft className="mr-1.5 w-5 h-5" /> Quay lại
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 h-12 bg-gradient-to-r from-[#008080] to-[#00A79D] hover:shadow-[0_15px_30px_rgba(0,128,128,0.2)] hover:-translate-y-0.5 transition-all duration-300 text-white font-bold text-base rounded-full"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Đang xử lý...
                          </>
                        ) : (
                          "Hoàn tất đăng ký"
                        )}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="px-8 py-6 bg-white/30 backdrop-blur-md border-t border-white/40 text-center">
            <p className="text-sm text-slate-600 font-medium">
              Đã có tài khoản?{" "}
              <Link
                className="text-[#008080] font-bold hover:text-[#00A79D] transition-colors"
                href="/login"
              >
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer minimalist */}
      <footer className="relative z-10 w-full py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2 text-slate-500 font-medium bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <svg
                className="h-5 w-5 text-[#008080]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <a
                className="hover:text-[#008080] transition-colors"
                href="tel:0123458789"
              >
                0123 458 789
              </a>
            </div>
            
            <div className="flex items-center gap-2 text-slate-500 font-medium bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/60 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
              <svg
                className="h-5 w-5 text-[#008080]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <a
                className="hover:text-[#008080] transition-colors"
                href="mailto:support@betterus.com"
              >
                support@betterus.com
              </a>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-sm font-medium text-slate-400">© 2025 BetterUS. Kiến tạo giá trị vì cộng đồng.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
