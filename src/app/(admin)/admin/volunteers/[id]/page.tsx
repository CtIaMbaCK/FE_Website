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
    <div className="min-h-screen pb-12">
      {/* Breadcrumb & Back */}
      <div className="max-w-7xl mx-auto px-6 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <Breadcrumb
            items={[
              { label: "Quản lý tình nguyện viên", href: "/admin/volunteers" },
              { label: fullName || "Chi tiết" },
            ]}
          />
          <Link href="/admin/volunteers">
            <Button variant="ghost" size="sm" className="text-slate-500 hover:bg-slate-100 hover:text-slate-900 rounded-xl h-9 px-4">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Quay lại
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col items-center relative z-10">
            <div className="relative mb-5">
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-[#008080] text-5xl font-black overflow-hidden shadow-sm border-4 border-white ring-1 ring-slate-100 relative group pointer-events-auto cursor-pointer" onClick={() => document.getElementById("avatar-upload")?.click()}>
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{fullName.charAt(0).toUpperCase()}</span>
                )}
                <div 
                  className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {uploadingAvatar ? (
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <User className="w-6 h-6 mb-1" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Thay ảnh</span>
                    </>
                  )}
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </div>
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm"></div>
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{fullName}</h1>
            <p className="text-sm font-bold text-[#008080] mb-3 uppercase tracking-widest">Hồ Sơ Tình Nguyện Viên</p>
            
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
              volunteer.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
              volunteer.status === "BANNED" ? "bg-red-50 text-red-600 border-red-100" :
              "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
              {volunteer.status === "ACTIVE" ? "Đang hoạt động" : volunteer.status === "BANNED" ? "Đã khóa" : "Chờ duyệt"}
            </div>
            
            {/* Points badge */}
            <div className="flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-2xl shadow-sm border border-amber-300">
              <Star className="w-5 h-5 fill-white text-white" />
              <span className="font-black text-lg">
                {volunteer.volunteerProfile?.points || 0} điểm
              </span>
            </div>

            <p className="text-xs text-slate-500 font-medium mt-4">
              Tham gia từ: {new Date(volunteer.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Giấy tờ tùy thân (Đưa lên đầu) */}
        <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <Briefcase className="w-5 h-5 text-[#008080]" />
              </div>
              <CardTitle className="text-lg font-bold text-slate-800">Giấy tờ tùy thân</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
          </CardContent>
        </Card>

        {/* Two Column Layout (Thông tin còn lại) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Thông tin cá nhân */}
            <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    <User className="w-5 h-5 text-[#008080]" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Thông tin cá nhân</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={volunteer.email}
                    disabled
                    className="bg-gray-50 border-gray-200 rounded-xl h-11"
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
                    className="h-11 rounded-xl border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
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
                    className="bg-gray-50 border-gray-200 rounded-xl h-11"
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
                    className="bg-gray-50 border-gray-200 rounded-xl h-11"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Kỹ năng chuyên môn */}
            <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <CardHeader className="bg-sky-50/30 border-b border-sky-100 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm border border-sky-100">
                      <Award className="w-5 h-5 text-sky-500" />
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-800">Kỹ năng chuyên môn</CardTitle>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 bg-sky-100 text-sky-700 rounded-full">
                    {skills.length} kỹ năng
                  </span>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill.value}
                      type="button"
                      onClick={() => toggleSkill(skill.value)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        skills.includes(skill.value)
                          ? "bg-[#008080] border-[#008080] text-white shadow-md shadow-teal-500/20 hover:bg-[#006666]"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      {skill.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Kinh nghiệm */}
            <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <CardHeader className="bg-indigo-50/30 border-b border-indigo-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-indigo-100">
                    <Briefcase className="w-5 h-5 text-indigo-500" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Kinh nghiệm & Khu vực</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
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
                    className="h-11 rounded-xl border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
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
                    className="resize-none rounded-xl border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">
                      Khu vực ưu tiên hoạt động
                    </Label>
                    <span className="text-xs font-bold px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full">
                      {preferredDistricts.length} khu vực
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 p-5 border border-slate-200 rounded-2xl bg-slate-50/50 max-h-[250px] overflow-y-auto custom-scrollbar">
                    {DISTRICTS.map((district) => (
                      <button
                        key={district.value}
                        type="button"
                        onClick={() => toggleDistrict(district.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          preferredDistricts.includes(district.value)
                            ? "bg-indigo-500 border-indigo-500 text-white shadow-sm"
                            : "bg-white text-slate-600 hover:bg-slate-100 border-slate-300"
                        }`}
                      >
                        {district.label}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons Section */}
            <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex flex-col gap-4 p-6 bg-slate-50/50">
                <div className="text-sm font-medium text-slate-500 text-center sm:text-left">
                  Cập nhật thông tin và cấp chứng nhận.
                </div>
                
                <div className="flex flex-col gap-3 w-full">
                  <Button
                    onClick={handleSave}
                    disabled={submitting}
                    className="w-full bg-[#008080] hover:bg-[#00A79D] text-white h-12 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all text-sm"
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
                  
                  <div className="flex gap-3">
                    <Button
                      variant={volunteer.status === "ACTIVE" ? "destructive" : "outline"}
                      onClick={handleToggleStatus}
                      disabled={volunteer.status === "PENDING" || submitting}
                      className={`flex-1 h-12 rounded-xl font-bold shadow-sm transition-all text-sm ${
                        volunteer.status === "ACTIVE"
                          ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700" 
                          : volunteer.status === "BANNED" 
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
                            : "bg-slate-100 text-slate-400 border-slate-200"
                      }`}
                    >
                      {volunteer.status === "ACTIVE" ? (
                        <>
                          <Lock className="mr-2 h-4 w-4" /> Khóa
                        </>
                      ) : volunteer.status === "BANNED" ? (
                        <>
                          <LockOpen className="mr-2 h-4 w-4" /> Mở khóa
                        </>
                      ) : (
                        "Chờ duyệt"
                      )}
                    </Button>

                    <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex-1 h-12 rounded-xl font-bold shadow-sm transition-all text-sm border-amber-200 text-amber-600 bg-amber-50 hover:bg-amber-100 hover:border-amber-300"
                        >
                          <Award className="mr-2 h-4 w-4" />
                          Cấp chứng nhận
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md rounded-3xl p-6">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-400">
                            <Award className="w-6 h-6 text-amber-500" />
                            Cấp chứng nhận
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleIssueCertificate} className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-slate-600 font-medium">Tình nguyện viên</Label>
                            <Input value={fullName} disabled className="bg-slate-50 rounded-xl h-11 border-slate-200" />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-slate-600 font-medium">Điểm hiện tại</Label>
                            <Input
                              value={`${volunteer?.volunteerProfile?.points || 0} điểm`}
                              disabled
                              className="bg-slate-50 rounded-xl h-11 border-slate-200"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes" className="text-slate-600 font-medium">Ghi chú (tùy chọn)</Label>
                            <Textarea
                              id="notes"
                              placeholder="Thêm ghi chú về chứng nhận này..."
                              value={certificateNotes}
                              onChange={(e) => setCertificateNotes(e.target.value)}
                              rows={3}
                              className="resize-none rounded-xl border-slate-200 focus:border-amber-500 focus:ring-amber-500/20"
                            />
                          </div>

                          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm mt-2">
                            <p className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                              <Star className="w-4 h-4" /> Lưu ý:
                            </p>
                            <ul className="list-disc list-inside text-amber-700/80 space-y-1 font-medium ml-1">
                              <li>Hệ thống tự động dùng tên TNV</li>
                              <li>Sử dụng mẫu chứng nhận mặc định BetterUS</li>
                            </ul>
                          </div>

                          <div className="flex gap-3 pt-4">
                            <Button
                              type="submit"
                              className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl h-12 font-bold shadow-md hover:shadow-lg transition-all"
                              disabled={issuingCertificate}
                            >
                              {issuingCertificate ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                  Đang cấp...
                                </>
                              ) : (
                                <>
                                  <Award className="mr-2 h-4 w-4" /> Xác nhận
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setCertificateDialogOpen(false)}
                              disabled={issuingCertificate}
                              className="rounded-xl h-12 px-6 font-bold border-slate-200 hover:bg-slate-50 text-slate-600"
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
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
