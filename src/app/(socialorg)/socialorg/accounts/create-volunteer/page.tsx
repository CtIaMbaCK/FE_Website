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
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Quản lý tài khoản", href: "/socialorg/accounts" },
            { label: "Tạo tài khoản TNV" },
          ]}
        />
      </div>

      {/* Top Actions Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link href="/socialorg/accounts">
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
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Tạo tài khoản Tình nguyện viên
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Nhập thông tin để tạo tài khoản mới cho tình nguyện viên
          </p>
        </div>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              {/* Thông tin đăng nhập */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Thông tin đăng nhập
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
                      Email <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email"
                      required
                      className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4 text-gray-400" />
                      Mật khẩu <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                      required
                      className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500/10"
                    />
                  </div>
                </div>
              </div>

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
                      htmlFor="phoneNumber"
                      className="text-sm font-medium text-gray-700 flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4 text-gray-400" />
                      Số điện thoại <span className="text-red-600">*</span>
                    </Label>
                    <Input
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      required
                      className="h-10 border-gray-300 focus:border-teal-500 focus:ring-teal-500/10"
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
              <div className="flex items-center justify-start gap-3">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
                  className="px-6"
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
