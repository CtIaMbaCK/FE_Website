"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createVolunteerAccount } from "@/services/account.service";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
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

export default function CreateVolunteerPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [bio, setBio] = useState("");
  const [preferredDistricts, setPreferredDistricts] = useState<string[]>([]);
  const [cccdFrontFile, setCccdFrontFile] = useState("");
  const [cccdBackFile, setCccdBackFile] = useState("");

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

    // Validation
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    if (!password.trim() || password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!phoneNumber.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    try {
      setSubmitting(true);

      const data = {
        email: email.trim(),
        password: password.trim(),
        phoneNumber: phoneNumber.trim(),
        fullName: fullName.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        cccdFrontFile: cccdFrontFile || undefined,
        cccdBackFile: cccdBackFile || undefined,
        skills: skills.length > 0 ? skills : undefined,
        experienceYears: experienceYears > 0 ? experienceYears : undefined,
        bio: bio.trim() || undefined,
        preferredDistricts:
          preferredDistricts.length > 0 ? preferredDistricts : undefined,
      };

      await createVolunteerAccount(data);
      toast.success("Đã tạo tài khoản tình nguyện viên thành công");
      router.push("/socialorg/accounts");
    } catch (error: any) {
      toast.error(
        "Lỗi: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Top Actions Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center">
            <Breadcrumb
              items={[
                { label: "Quản lý tài khoản", href: "/socialorg/accounts" },
                { label: "Tạo tài khoản TNV" },
              ]}
            />
          </div>

          <div className="flex gap-3 items-center">
            <Link href="/socialorg/accounts">
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
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Tạo tài khoản Tình nguyện viên
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Nhập thông tin để tạo tài khoản mới cho tình nguyện viên
          </p>
        </div>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              {/* Thông tin đăng nhập */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="p-6 border-b border-slate-100 bg-white/50 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080] shadow-sm">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Thông tin đăng nhập
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-5 relative z-10">
                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 text-slate-400" />
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email"
                      required
                      className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-slate-400" />
                      Mật khẩu <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                      required
                      className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin cá nhân */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="p-6 border-b border-slate-100 bg-white/50 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080] shadow-sm">
                      <User className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Thông tin cá nhân
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-5 relative z-10">
                  <div className="space-y-2">
                    <Label
                      htmlFor="fullName"
                      className="text-sm font-bold text-slate-600 uppercase tracking-wider"
                    >
                      Họ và tên <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nhập họ và tên đầy đủ"
                      required
                      className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="phoneNumber"
                      className="text-sm font-bold text-slate-600 uppercase tracking-wider flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-slate-400" />
                      Số điện thoại <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      required
                      className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Kỹ năng chuyên môn */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all duration-300 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-50 -z-10 bg-opacity-30 pointer-events-none"></div>
                <div className="p-6 border-b border-slate-100 bg-white/50 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080] shadow-sm">
                        <Award className="w-5 h-5" />
                      </div>
                      <h2 className="text-lg font-bold text-slate-800">
                        Kỹ năng chuyên môn
                      </h2>
                    </div>
                    <span className="px-3 py-1 bg-teal-50 text-[#008080] rounded-xl text-xs font-bold shadow-sm">
                      {skills.length} kỹ năng
                    </span>
                  </div>
                </div>
                <div className="p-6 relative z-10">
                  <div className="flex flex-wrap gap-2.5">
                    {SKILLS.map((skill) => (
                      <button
                        key={skill.value}
                        type="button"
                        onClick={() => toggleSkill(skill.value)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                          skills.includes(skill.value)
                            ? "bg-[#008080] text-white shadow-sm ring-2 ring-[#008080]/20 ring-offset-1"
                            : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm"
                        }`}
                      >
                        {skill.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kinh nghiệm */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="p-6 border-b border-slate-100 bg-white/50 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080] shadow-sm">
                      <Briefcase className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Kinh nghiệm
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-5 relative z-10">
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
                      className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
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
                      className="resize-none border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                        Khu vực ưu tiên hoạt động
                      </Label>
                      <span className="px-3 py-1 bg-teal-50 text-[#008080] rounded-xl text-xs font-bold shadow-sm">
                        {preferredDistricts.length} khu vực
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2.5 p-5 border border-slate-100 rounded-[1.5rem] bg-slate-50/50 max-h-[200px] overflow-y-auto shadow-inner">
                      {DISTRICTS.map((district) => (
                        <button
                          key={district.value}
                          type="button"
                          onClick={() => toggleDistrict(district.value)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all ${
                            preferredDistricts.includes(district.value)
                              ? "bg-[#008080] text-white shadow-sm ring-2 ring-[#008080]/20 ring-offset-1"
                              : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300 shadow-sm"
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

            {/* Right Column - Documents & Action */}
            <div className="space-y-6">
              {/* CCCD/CMND */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="p-6 border-b border-slate-100 bg-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080] shadow-sm">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h3m-6 0a3.001 3.001 0 00-2.83-2" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Giấy tờ tùy thân
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-5">
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
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row items-center gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-[#008080] hover:bg-[#00A79D] text-white h-12 px-8 rounded-xl font-bold shadow-sm transition-all"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo tài khoản"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/socialorg/accounts")}
                  disabled={submitting}
                  className="w-full sm:w-auto h-12 px-8 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-all bg-white shadow-sm"
                >
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
