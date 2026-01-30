"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getVolunteerDetail,
  updateVolunteer,
  issueAdminCertificate,
  type Volunteer,
} from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Breadcrumb from "@/components/Breadcrumb";
import ImageUploadZone from "@/components/ImageUploadZone";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Award,
  Briefcase,
  Star,
  Lock,
  LockOpen,
} from "lucide-react";
import Link from "next/link";
import { uploadImage } from "@/services/cloudinary.service";

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

export default function VolunteerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Certificate dialog
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [issuingCertificate, setIssuingCertificate] = useState(false);
  const [certificateNotes, setCertificateNotes] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [bio, setBio] = useState("");
  const [preferredDistricts, setPreferredDistricts] = useState<string[]>([]);
  const [cccdFrontFile, setCccdFrontFile] = useState("");
  const [cccdBackFile, setCccdBackFile] = useState("");

  // Fetch chi tiet TNV
  const fetchVolunteer = async () => {
    try {
      setLoading(true);
      const data = await getVolunteerDetail(id);
      setVolunteer(data);

      // Set form values
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
      }
    } catch (error) {
      console.error("Loi fetch volunteer:", error);
      toast.error("Không thể tải thông tin tình nguyện viên");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchVolunteer();
    }
  }, [id]);

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

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const url = await uploadImage(file);
      setAvatarUrl(url);
      toast.success("Đã tải ảnh đại diện lên thành công");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải ảnh lên");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Xu ly luu thong tin
  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    try {
      setSubmitting(true);

      const updateData = {
        fullName: fullName.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
        skills: skills.length > 0 ? skills : undefined,
        experienceYears: experienceYears > 0 ? experienceYears : undefined,
        bio: bio.trim() || undefined,
        preferredDistricts: preferredDistricts.length > 0 ? preferredDistricts : undefined,
        cccdFrontFile: cccdFrontFile || undefined,
        cccdBackFile: cccdBackFile || undefined,
      };

      await updateVolunteer(id, updateData);
      toast.success("Đã cập nhật thông tin tình nguyện viên");

      // Reload data
      await fetchVolunteer();
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Xu ly khoa/mo khoa
  const handleToggleStatus = async () => {
    if (!volunteer) return;
    try {
      const newStatus = volunteer.status === "ACTIVE" ? "BANNED" : "ACTIVE";
      await updateVolunteer(id, { status: newStatus });
      toast.success(
        `Đã ${newStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản thành công`
      );
      fetchVolunteer();
    } catch (error) {
      console.error("Loi update status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Xu ly cap chung nhan
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuingCertificate(true);
    try {
      await issueAdminCertificate({
        volunteerId: id,
        notes: certificateNotes.trim() || undefined,
      });
      toast.success("Đã cấp chứng nhận thành công!");
      setCertificateDialogOpen(false);
      setCertificateNotes("");
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setIssuingCertificate(false);
    }
  };

  if (loading) {
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

  if (!volunteer) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin</p>
        <Button onClick={() => router.push("/admin/volunteers")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Quản lý tình nguyện viên", href: "/admin/volunteers" },
            { label: fullName || "Chi tiết" },
          ]}
        />
      </div>

      {/* Top Actions Bar */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <Link href="/admin/volunteers">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
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
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#008080] to-teal-600 flex items-center justify-center text-white text-4xl font-bold overflow-hidden">
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
              {/* Upload avatar button */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 w-10 h-10 bg-[#008080] rounded-full border-4 border-white flex items-center justify-center cursor-pointer hover:bg-[#006666] transition-colors"
              >
                {uploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
              </label>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{fullName}</h1>
            <p className="text-sm text-gray-500 mb-1">HỒ SƠ TÌNH NGUYỆN VIÊN</p>
            <div className="inline-flex items-center px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-medium">
              {volunteer.status === "ACTIVE" ? "Đang hoạt động" : volunteer.status === "BANNED" ? "Đã khóa" : "Chờ duyệt"}
            </div>
            {/* Points badge */}
            <div className="flex items-center gap-2 mt-3 bg-[#008080] text-white px-4 py-2 rounded-full">
              <Star className="w-5 h-5" />
              <span className="font-bold text-lg">
                {volunteer.volunteerProfile?.points || 0} điểm
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Tham gia: {new Date(volunteer.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Personal Info */}
          <div className="space-y-6">
            {/* Thông tin cá nhân */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-base">Thông tin cá nhân</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={volunteer.email}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Họ và tên <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                    className="h-10 border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    value={volunteer.phoneNumber || "Chưa cập nhật"}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Tổ chức quản lý
                  </Label>
                  <Input
                    value={
                      volunteer.volunteerProfile?.organization
                        ?.organizationProfiles?.organizationName || "Chưa có"
                    }
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Kỹ năng chuyên môn */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-gray-600" />
                    <CardTitle className="text-base">Kỹ năng chuyên môn</CardTitle>
                  </div>
                  <span className="text-xs text-gray-500 font-medium">
                    {skills.length} kỹ năng
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill.value}
                      type="button"
                      onClick={() => toggleSkill(skill.value)}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                        skills.includes(skill.value)
                          ? "bg-[#008080] text-white shadow-sm"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                      }`}
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Kinh nghiệm */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-gray-600" />
                  <CardTitle className="text-base">Kinh nghiệm</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="experienceYears" className="text-sm font-medium text-gray-700">
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
                    className="h-10 border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-sm font-medium text-gray-700">
                    Tiểu sử
                  </Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Giới thiệu về bản thân, kinh nghiệm và mong muốn..."
                    rows={4}
                    className="resize-none border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
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
                            ? "bg-[#008080] text-white shadow-sm"
                            : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                      >
                        {district.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Documents */}
          <div className="space-y-6">
            {/* CCCD/CMND */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Giấy tờ tùy thân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-start gap-3">
                <Button
                  onClick={handleSave}
                  disabled={submitting}
                  className="bg-[#008080] hover:bg-[#006666] text-white px-6"
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
                  variant={volunteer.status === "ACTIVE" ? "destructive" : "default"}
                  onClick={handleToggleStatus}
                  disabled={volunteer.status === "PENDING" || submitting}
                  className={
                    volunteer.status !== "ACTIVE"
                      ? "bg-[#008080] hover:bg-[#006666]"
                      : ""
                  }
                >
                  {volunteer.status === "ACTIVE" ? (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Khóa tài khoản
                    </>
                  ) : (
                    <>
                      <LockOpen className="mr-2 h-4 w-4" />
                      Mở khóa
                    </>
                  )}
                </Button>
              </div>

              {/* Certificate Button */}
              <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
                  >
                    <Award className="mr-2 h-4 w-4" />
                    Cấp chứng nhận
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Cấp chứng nhận cho TNV</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleIssueCertificate} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Tình nguyện viên</Label>
                      <Input value={fullName} disabled className="bg-gray-50" />
                    </div>

                    <div className="space-y-2">
                      <Label>Điểm hiện tại</Label>
                      <Input
                        value={`${volunteer?.volunteerProfile?.points || 0} điểm`}
                        disabled
                        className="bg-gray-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Thêm ghi chú về chứng nhận này..."
                        value={certificateNotes}
                        onChange={(e) => setCertificateNotes(e.target.value)}
                        rows={3}
                        className="resize-none"
                      />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
                      <p className="font-semibold text-blue-900 mb-1">ℹ️ Lưu ý:</p>
                      <ul className="list-disc list-inside text-blue-800 space-y-1">
                        <li>Hệ thống sẽ tự động điền tên TNV vào chứng nhận</li>
                        <li>Sử dụng mẫu chứng nhận mặc định của BetterUS</li>
                        <li>Chứng nhận sẽ được tạo dưới dạng ảnh PNG</li>
                      </ul>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button
                        type="submit"
                        className="flex-1 bg-[#008080] hover:bg-[#006666]"
                        disabled={issuingCertificate}
                      >
                        {issuingCertificate ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Đang cấp...
                          </>
                        ) : (
                          <>
                            <Award className="mr-2 h-4 w-4" />
                            Cấp chứng nhận
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCertificateDialogOpen(false)}
                        disabled={issuingCertificate}
                      >
                        Hủy
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
