"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getMemberDetail,
  updateVolunteerProfile,
  OrganizationMember,
  UpdateVolunteerData,
} from "@/services/organization.service";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ImageUploadZone from "@/components/ImageUploadZone";

const SKILLS = [
  { value: "TEACHING", label: "Giảng dạy" },
  { value: "EDUCATION", label: "Giáo dục" },
  { value: "MEDICAL", label: "Y tế" },
  { value: "PSYCHOLOGICAL", label: "Tâm lý" },
  { value: "LEGAL", label: "Pháp lý" },
  { value: "SOCIAL_WORK", label: "Công tác xã hội" },
  { value: "DISASTER_RELIEF", label: "Cứu trợ thảm họa" },
  { value: "FUNDRAISING", label: "Gây quỹ" },
  { value: "LOGISTICS", label: "Hậu cần" },
  { value: "COMMUNICATION", label: "Truyền thông" },
  { value: "TRANSLATION", label: "Phiên dịch" },
  { value: "IT_SUPPORT", label: "Hỗ trợ IT" },
  { value: "OTHER", label: "Khác" },
];

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

export default function EditVolunteerPage() {
  const params = useParams();
  const router = useRouter();
  const volunteerId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [member, setMember] = useState<OrganizationMember | null>(null);
  const [originalData, setOriginalData] = useState<UpdateVolunteerData | null>(
    null
  );

  // Form fields
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [bio, setBio] = useState("");
  const [preferredDistricts, setPreferredDistricts] = useState<string[]>([]);
  const [cccdFrontFile, setCccdFrontFile] = useState("");
  const [cccdBackFile, setCccdBackFile] = useState("");

  useEffect(() => {
    loadMemberData();
  }, [volunteerId]);

  const loadMemberData = async () => {
    try {
      setLoading(true);
      const data = await getMemberDetail(volunteerId);
      setMember(data);

      if (data.volunteerProfile) {
        const profile = data.volunteerProfile;
        setFullName(profile.fullName || "");
        setAvatarUrl(profile.avatarUrl || "");
        setSkills(profile.skills || []);
        setExperienceYears(profile.experienceYears || 0);
        setBio(profile.bio || "");
        setPreferredDistricts(profile.preferredDistricts || []);
        setCccdFrontFile(profile.cccdFrontFile || "");
        setCccdBackFile(profile.cccdBackFile || "");

        setOriginalData({
          fullName: profile.fullName || "",
          avatarUrl: profile.avatarUrl || "",
          skills: profile.skills || [],
          experienceYears: profile.experienceYears || 0,
          bio: profile.bio || "",
          preferredDistricts: profile.preferredDistricts || [],
          cccdFrontFile: profile.cccdFrontFile || "",
          cccdBackFile: profile.cccdBackFile || "",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi khi tải thông tin: " + errorMessage);
      router.push("/socialorg/volunteers");
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const toggleDistrict = (district: string) => {
    setPreferredDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    if (!originalData) {
      toast.error("Dữ liệu gốc không tồn tại");
      return;
    }

    const changedData: Partial<UpdateVolunteerData> = {};
    let hasChanges = false;

    if (fullName.trim() !== originalData.fullName) {
      changedData.fullName = fullName.trim();
      hasChanges = true;
    }

    if (avatarUrl.trim() !== (originalData.avatarUrl || "")) {
      changedData.avatarUrl = avatarUrl.trim() || undefined;
      hasChanges = true;
    }

    if (JSON.stringify(skills) !== JSON.stringify(originalData.skills || [])) {
      changedData.skills = skills.length > 0 ? skills : undefined;
      hasChanges = true;
    }

    if (experienceYears !== (originalData.experienceYears || 0)) {
      changedData.experienceYears =
        experienceYears > 0 ? experienceYears : undefined;
      hasChanges = true;
    }

    if (bio.trim() !== (originalData.bio || "")) {
      changedData.bio = bio.trim() || undefined;
      hasChanges = true;
    }

    if (
      JSON.stringify(preferredDistricts) !==
      JSON.stringify(originalData.preferredDistricts || [])
    ) {
      changedData.preferredDistricts =
        preferredDistricts.length > 0 ? preferredDistricts : undefined;
      hasChanges = true;
    }

    if (cccdFrontFile !== (originalData.cccdFrontFile || "")) {
      changedData.cccdFrontFile = cccdFrontFile || undefined;
      hasChanges = true;
    }

    if (cccdBackFile !== (originalData.cccdBackFile || "")) {
      changedData.cccdBackFile = cccdBackFile || undefined;
      hasChanges = true;
    }

    if (!hasChanges) {
      toast.info("Không có thay đổi nào để cập nhật");
      return;
    }

    try {
      setSubmitting(true);

      const updateData: UpdateVolunteerData = {
        fullName: changedData.fullName || originalData.fullName,
        ...changedData,
      };

      await updateVolunteerProfile(volunteerId, updateData);
      toast.success("Đã cập nhật thông tin tình nguyện viên");

      // Reload data để hiển thị hình ảnh mới
      await loadMemberData();

      router.push("/socialorg/volunteers");
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">
            Đang tải thông tin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Quản lý tình nguyện viên", href: "/socialorg/volunteers" },
            { label: fullName || "Chỉnh sửa" },
          ]}
        />
      </div>

      {/* Top Actions Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link href="/socialorg/volunteers">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Quay lại
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{fullName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute bottom-0 right-0 w-8 h-8 bg-teal-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {fullName}
            </h1>
            <p className="text-sm text-gray-500 mb-1">HỒ SƠ TÊN</p>
            <div className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
              Đã xác minh
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Tham gia:{" "}
              {new Date(member?.createdAt || "").toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Thông tin cá nhân */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Thông tin cá nhân
                  </h2>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={member?.email || ""}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="fullName"
                    className="text-sm font-medium text-gray-700"
                  >
                    Họ và tên <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                    className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="phone"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-gray-400" />
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    value={member?.volunteerProfile?.phone || "Chưa cập nhật"}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="address"
                    className="text-sm font-medium text-gray-700 flex items-center gap-2"
                  >
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Địa chỉ
                  </Label>
                  <Textarea
                    id="address"
                    value="Chưa cập nhật"
                    disabled
                    className="bg-gray-50 border-gray-200 resize-none"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Kỹ năng chuyên môn */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-600" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Kỹ năng chuyên môn
                    </h2>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {skills.length} kỹ năng
                  </span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill.value}
                      type="button"
                      onClick={() => toggleSkill(skill.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        skills.includes(skill.value)
                          ? "bg-teal-600 text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kinh nghiệm */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  <h2 className="text-base font-semibold text-gray-900">
                    Kinh nghiệm
                  </h2>
                </div>
              </div>
              <div className="p-5 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="experienceYears"
                    className="text-sm font-medium text-gray-700"
                  >
                    Số năm kinh nghiệm
                  </Label>
                  <Input
                    id="experienceYears"
                    type="number"
                    min="0"
                    value={experienceYears}
                    onChange={(e) =>
                      setExperienceYears(parseInt(e.target.value) || 0)
                    }
                    className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tiểu sử
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Giới thiệu về bản thân, kinh nghiệm và mong muốn..."
                    rows={4}
                    className="resize-none border-gray-300 focus:border-teal-500 focus:ring-teal-500/10"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      Khu vực ưu tiên hoạt động
                    </Label>
                    <span className="text-xs text-gray-500 font-medium">
                      {preferredDistricts.length} khu vực
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 border border-gray-200 rounded-lg bg-gray-50/50 max-h-[200px] overflow-y-auto">
                    {DISTRICTS.map((district) => (
                      <button
                        key={district.value}
                        type="button"
                        onClick={() => toggleDistrict(district.value)}
                        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          preferredDistricts.includes(district.value)
                            ? "bg-teal-600 text-white shadow-sm"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {district.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Documents */}
          <div className="space-y-6">
            {/* CCCD/CMND */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-5 border-b border-gray-100">
                <h2 className="text-base font-semibold text-gray-900">
                  Giấy tờ tùy thân
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {/* CCCD Mặt trước */}
                <ImageUploadZone
                  label="CCCD Mặt trước"
                  currentImageUrl={cccdFrontFile}
                  onImageUploaded={(url) => setCccdFrontFile(url)}
                  onImageRemoved={() => setCccdFrontFile("")}
                />

                {/* CCCD Mặt sau */}
                <ImageUploadZone
                  label="CCCD Mặt sau"
                  currentImageUrl={cccdBackFile}
                  onImageUploaded={(url) => setCccdBackFile(url)}
                  onImageRemoved={() => setCccdBackFile("")}
                />
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex items-center justify-start gap-3 border-gray-100 mt-6">
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6"
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/socialorg/volunteers")}
                disabled={submitting}
                className="px-6"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
