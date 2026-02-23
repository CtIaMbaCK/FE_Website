"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getBeneficiaryDetail,
  updateBeneficiary,
  type Beneficiary,
} from "@/services/admin.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumb from "@/components/Breadcrumb";
import ImageUploadZone from "@/components/ImageUploadZone";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Heart,
  Shield,
  Image as ImageIcon,
  Lock,
  LockOpen,
} from "lucide-react";
import Link from "next/link";

const VULNERABILITY_TYPES = [
  { value: "POOR", label: "Nghèo khó" },
  { value: "DISABLED", label: "Người khuyết tật" },
  { value: "ELDERLY", label: "Người cao tuổi" },
  { value: "SICKNESS", label: "Bệnh tật" },
  { value: "ORPHAN", label: "Trẻ mồ côi" },
  { value: "OTHER", label: "Khác" },
];

const GUARDIAN_RELATIONS = [
  { value: "PARENT", label: "Cha/Mẹ" },
  { value: "SIBLING", label: "Anh/Chị/Em" },
  { value: "GRANDPARENT", label: "Ông/Bà" },
  { value: "RELATIVE", label: "Họ hàng" },
  { value: "GUARDIAN", label: "Người giám hộ" },
  { value: "OTHER", label: "Khác" },
];

export default function BeneficiaryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [vulnerabilityType, setVulnerabilityType] = useState("");
  const [situationDescription, setSituationDescription] = useState("");
  const [healthCondition, setHealthCondition] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("");
  const [cccdFrontFile, setCccdFrontFile] = useState("");
  const [cccdBackFile, setCccdBackFile] = useState("");

  // Fetch chi tiet NCGD
  const fetchBeneficiary = async () => {
    try {
      setLoading(true);
      const data = await getBeneficiaryDetail(id);
      setBeneficiary(data);

      // Set form values
      if (data.bficiaryProfile) {
        const profile = data.bficiaryProfile;
        setFullName(profile.fullName || "");
        setVulnerabilityType(profile.vulnerabilityType || "");
        setSituationDescription(profile.situationDescription || "");
        setHealthCondition(profile.healthCondition || "");
        setGuardianName(profile.guardianName || "");
        setGuardianPhone(profile.guardianPhone || "");
        setGuardianRelation(profile.guardianRelation || "");
        setCccdFrontFile(profile.cccdFrontFile || "");
        setCccdBackFile(profile.cccdBackFile || "");
      }
    } catch (error) {
      console.error("Loi fetch beneficiary:", error);
      toast.error("Không thể tải thông tin người cần giúp đỡ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBeneficiary();
    }
  }, [id]);

  // Xu ly luu thong tin
  const handleSave = async () => {
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    if (!vulnerabilityType) {
      toast.error("Vui lòng chọn loại đối tượng");
      return;
    }

    try {
      setSubmitting(true);

      const updateData = {
        fullName: fullName.trim(),
        vulnerabilityType,
        situationDescription: situationDescription.trim() || undefined,
        healthCondition: healthCondition.trim() || undefined,
        guardianName: guardianName.trim() || undefined,
        guardianPhone: guardianPhone.trim() || undefined,
        guardianRelation: guardianRelation || undefined,
        cccdFrontFile: cccdFrontFile || undefined,
        cccdBackFile: cccdBackFile || undefined,
      };

      await updateBeneficiary(id, updateData);
      toast.success("Đã cập nhật thông tin người cần giúp đỡ");

      // Reload data
      await fetchBeneficiary();
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  // Xu ly khoa/mo khoa
  const handleToggleStatus = async () => {
    if (!beneficiary) return;
    try {
      const newStatus = beneficiary.status === "ACTIVE" ? "BANNED" : "ACTIVE";
      await updateBeneficiary(id, { status: newStatus });
      toast.success(
        `Đã ${newStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản thành công`
      );
      fetchBeneficiary();
    } catch (error) {
      console.error("Loi update status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Format ngay thang
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (!beneficiary) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin</p>
        <Button onClick={() => router.push("/admin/beneficiaries")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-12 font-sans">
      {/* Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center">
          <Breadcrumb
            items={[
              { label: "Quản lý Người cần giúp đỡ", href: "/admin/beneficiaries" },
              { label: fullName || "Chi tiết" },
            ]}
          />
        </div>
        <Link href="/admin/beneficiaries">
          <Button variant="outline" className="rounded-xl border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-white shadow-sm transition-all font-bold h-11 px-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 mb-8 relative overflow-hidden">
          <div className="flex flex-col items-center relative z-10">
            <div className="relative mb-5">
              <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-[#008080] text-5xl font-black overflow-hidden shadow-sm border-4 border-white ring-1 ring-slate-100">
                {beneficiary.bficiaryProfile?.avatarUrl ? (
                  <img
                    src={beneficiary.bficiaryProfile.avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{fullName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm"></div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{fullName}</h1>
            <p className="text-sm font-bold text-[#008080] mb-3 uppercase tracking-widest">Hồ Sơ Người Cần Giúp Đỡ</p>
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
              beneficiary.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
              beneficiary.status === "BANNED" ? "bg-red-50 text-red-600 border-red-100" :
              "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
              {beneficiary.status === "ACTIVE" ? "Đang hoạt động" : beneficiary.status === "BANNED" ? "Đã khóa" : "Chờ duyệt"}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-3">
              Tham gia từ: {new Date(beneficiary.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Giấy tờ tùy thân (Đưa lên đầu) */}
        <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <ImageIcon className="w-5 h-5 text-[#008080]" />
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
                    value={beneficiary.email}
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
                    value={beneficiary.phoneNumber || "Chưa cập nhật"}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    Tổ chức quản lý
                  </Label>
                  <Input
                    id="organization"
                    value={
                      beneficiary.bficiaryProfile?.organization
                        ?.organizationProfiles?.organizationName || "Chưa có"
                    }
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Thông tin người giám hộ */}
            <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <CardHeader className="bg-amber-50/30 border-b border-amber-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-amber-100">
                    <Shield className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-slate-800">Người giám hộ</CardTitle>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Tùy chọn (Nếu có)</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="guardianName" className="font-medium text-slate-700">Tên người giám hộ</Label>
                  <Input
                    id="guardianName"
                    value={guardianName}
                    onChange={(e) => setGuardianName(e.target.value)}
                    placeholder="Nhập tên người giám hộ"
                    className="h-10 border-slate-200 focus:ring-[#008080] focus:border-[#008080] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianPhone" className="font-medium text-slate-700">Số điện thoại người giám hộ</Label>
                  <Input
                    id="guardianPhone"
                    value={guardianPhone}
                    onChange={(e) => setGuardianPhone(e.target.value)}
                    placeholder="Nhập số điện thoại"
                    className="h-10 border-slate-200 focus:ring-[#008080] focus:border-[#008080] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guardianRelation" className="font-medium text-slate-700">Mối quan hệ</Label>
                  <Select value={guardianRelation} onValueChange={setGuardianRelation}>
                    <SelectTrigger className="h-10 border-slate-200 focus:ring-[#008080] focus:border-[#008080] rounded-xl">
                      <SelectValue placeholder="Chọn mối quan hệ" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {GUARDIAN_RELATIONS.map((relation) => (
                        <SelectItem key={relation.value} value={relation.value} className="rounded-lg">
                          {relation.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Thông tin hoàn cảnh */}
            <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <CardHeader className="bg-rose-50/30 border-b border-rose-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-rose-100">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800">Thông tin hoàn cảnh</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="vulnerabilityType" className="font-medium text-slate-700">
                    Loại đối tượng <span className="text-red-600">*</span>
                  </Label>
                  <Select value={vulnerabilityType} onValueChange={setVulnerabilityType} required>
                    <SelectTrigger className="h-10 border-slate-200 focus:ring-[#008080] focus:border-[#008080] rounded-xl">
                      <SelectValue placeholder="Chọn loại đối tượng" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {VULNERABILITY_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value} className="rounded-lg">
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="situationDescription" className="font-medium text-slate-700">Mô tả tình huống</Label>
                  <Textarea
                    id="situationDescription"
                    value={situationDescription}
                    onChange={(e) => setSituationDescription(e.target.value)}
                    placeholder="Mô tả hoàn cảnh hiện tại..."
                    rows={4}
                    className="resize-none border-slate-200 focus:ring-[#008080] focus:border-[#008080] rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="healthCondition" className="font-medium text-slate-700">Tình trạng sức khỏe</Label>
                  <Textarea
                    id="healthCondition"
                    value={healthCondition}
                    onChange={(e) => setHealthCondition(e.target.value)}
                    placeholder="Tình trạng sức khỏe..."
                    rows={3}
                    className="resize-none border-slate-200 focus:ring-[#008080] focus:border-[#008080] rounded-xl"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons Section */}
            <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="flex flex-col gap-4 p-6 bg-slate-50/50">
                <div className="text-sm font-medium text-slate-500 text-center sm:text-left">
                  Cập nhật thông tin và thay đổi trạng thái tài khoản.
                </div>
                <div className="flex items-center gap-3 w-full">
                  <Button
                    onClick={handleSave}
                    disabled={submitting}
                    className="flex-1 bg-[#008080] hover:bg-[#00A79D] text-white h-12 rounded-xl font-bold shadow-md hover:-translate-y-0.5 transition-all text-sm"
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
                    variant={beneficiary.status === "ACTIVE" ? "destructive" : "outline"}
                    onClick={handleToggleStatus}
                    disabled={beneficiary.status === "PENDING" || submitting}
                    className={`flex-1 h-12 rounded-xl font-bold shadow-sm transition-all text-sm ${
                      beneficiary.status === "ACTIVE"
                        ? "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700" 
                        : beneficiary.status === "BANNED" 
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100 hover:text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {beneficiary.status === "ACTIVE" ? (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Khóa
                      </>
                    ) : beneficiary.status === "BANNED" ? (
                      <>
                        <LockOpen className="mr-2 h-4 w-4" />
                        Mở khóa
                      </>
                    ) : (
                      "Chờ duyệt"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
