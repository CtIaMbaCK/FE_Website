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
      {/* Top Actions Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center">
            <Breadcrumb
              items={[
                { label: "Quản lý tình nguyện viên", href: "/socialorg/volunteers" },
                { label: fullName || "Chỉnh sửa" },
              ]}
            />
          </div>

          <div className="flex gap-3 items-center">
            <Link href="/socialorg/volunteers">
              <Button
                variant="outline"
                className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm rounded-xl h-11 px-6 font-bold transition-all flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                Quay lại
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 mb-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="flex flex-col items-center relative z-10">
            <div className="relative mb-4">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-md bg-gradient-to-br from-[#008080] to-[#00A79D] flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
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
              <div className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-1">
              {fullName}
            </h1>
            <div className="inline-flex items-center px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-wider border border-emerald-100 mt-2">
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Đã xác minh hồ sơ
            </div>
            <p className="text-sm text-slate-500 font-medium mt-3">
              Tham gia:{" "}
              {new Date(member?.createdAt || "").toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Giấy tờ tùy thân (Full Width) */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 mb-6 overflow-hidden">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                </svg>
              </span>
              Giấy tờ tùy thân
            </h2>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CCCD Mặt trước */}
              <div className="space-y-3">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">CCCD Mặt trước</p>
                 <ImageUploadZone
                   label="Mặt trước"
                   currentImageUrl={cccdFrontFile}
                   onImageUploaded={(url) => setCccdFrontFile(url)}
                   onImageRemoved={() => setCccdFrontFile("")}
                 />
              </div>

              {/* CCCD Mặt sau */}
              <div className="space-y-3">
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">CCCD Mặt sau</p>
                 <ImageUploadZone
                   label="Mặt sau"
                   currentImageUrl={cccdBackFile}
                   onImageUploaded={(url) => setCccdBackFile(url)}
                   onImageRemoved={() => setCccdBackFile("")}
                 />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Thông tin cá nhân */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <User className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-bold text-slate-800">
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
                    className="bg-gray-50 border-gray-200 rounded-xl max-w-full"
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
                    className="h-11 border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
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
                    className="bg-gray-50 border-gray-200 rounded-xl"
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
                    className="bg-gray-50 border-gray-200 resize-none rounded-xl"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            
            {/* Kỹ năng chuyên môn */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
                      <Award className="w-5 h-5" />
                    </span>
                    <h2 className="text-lg font-bold text-slate-800">
                      Kỹ năng chuyên môn
                    </h2>
                  </div>
                  <span className="text-xs text-slate-500 font-bold uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
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
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        skills.includes(skill.value)
                          ? "bg-[#008080] text-white shadow-sm"
                          : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                      }`}
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Experience & Action */}
          <div className="space-y-6">
            {/* Kinh nghiệm */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                     <Briefcase className="w-5 h-5" />
                  </span>
                  <h2 className="text-lg font-bold text-slate-800">
                    Kinh nghiệm & Khu vực
                  </h2>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="space-y-2">
                  <Label
                    htmlFor="experienceYears"
                    className="text-sm font-bold text-slate-600 uppercase tracking-wider"
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
                    className="h-11 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="bio"
                    className="text-sm font-bold text-slate-600 uppercase tracking-wider"
                  >
                    Tiểu sử
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Giới thiệu về bản thân, kinh nghiệm và mong muốn..."
                    rows={4}
                    className="resize-none border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      Khu vực ưu tiên hoạt động
                    </Label>
                    <span className="text-xs text-slate-500 font-bold bg-white px-2 py-1 rounded-md border border-slate-200 shadow-sm">
                      {preferredDistricts.length} khu vực
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-4 border border-slate-200 rounded-2xl bg-slate-50/50 max-h-[200px] overflow-y-auto">
                    {DISTRICTS.map((district) => (
                      <button
                        key={district.value}
                        type="button"
                        onClick={() => toggleDistrict(district.value)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                          preferredDistricts.includes(district.value)
                            ? "bg-[#008080] text-white shadow-sm"
                            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200"
                        }`}
                      >
                        {district.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Thao tác lưu */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 text-center sm:text-left transition-all">
              <h2 className="text-xl font-bold text-slate-800 mb-2">Hoàn tất chỉnh sửa</h2>
              <p className="text-slate-500 text-sm font-medium mb-6">Lưu lại các thay đổi hoặc quay lại danh sách</p>
              <div className="flex flex-col sm:flex-row items-center sm:justify-start gap-4">
                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-[#008080] hover:bg-[#00A79D] text-white rounded-xl h-11 px-8 font-bold shadow-sm w-full sm:w-auto transition-all"
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
                  className="h-11 px-8 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold w-full sm:w-auto transition-all bg-white"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
