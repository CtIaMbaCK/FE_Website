"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { toast } from "sonner";
import {
  getMemberDetail,
  updateBeneficiaryProfile,
  OrganizationMember,
  UpdateBeneficiaryData,
} from "@/services/organization.service";
import { ArrowLeft, User, Mail, Phone, MapPin, Heart, Shield, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import ImageUploadZone from "@/components/ImageUploadZone";

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

export default function EditBeneficiaryPage() {
  const params = useParams();
  const router = useRouter();
  const beneficiaryId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [member, setMember] = useState<OrganizationMember | null>(null);
  const [originalData, setOriginalData] = useState<UpdateBeneficiaryData | null>(null);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [vulnerabilityType, setVulnerabilityType] = useState("");
  const [situationDescription, setSituationDescription] = useState("");
  const [healthCondition, setHealthCondition] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [guardianRelation, setGuardianRelation] = useState("");
  const [cccdFrontFile, setCccdFrontFile] = useState("");
  const [cccdBackFile, setCccdBackFile] = useState("");

  useEffect(() => {
    loadMemberData();
  }, [beneficiaryId]);

  const loadMemberData = async () => {
    try {
      setLoading(true);
      const data = await getMemberDetail(beneficiaryId);
      setMember(data);

      if (data.bficiaryProfile) {
        const profile = data.bficiaryProfile;
        setFullName(profile.fullName || "");
        setAvatarUrl(profile.avatarUrl || "");
        setVulnerabilityType(profile.vulnerabilityType || "");
        setSituationDescription(profile.situationDescription || "");
        setHealthCondition(profile.healthCondition || "");
        setGuardianName(profile.guardianName || "");
        setGuardianPhone(profile.guardianPhone || "");
        setGuardianRelation(profile.guardianRelation || "");
        setCccdFrontFile(profile.cccdFrontFile || "");
        setCccdBackFile(profile.cccdBackFile || "");

        setOriginalData({
          fullName: profile.fullName || "",
          avatarUrl: profile.avatarUrl || "",
          vulnerabilityType: profile.vulnerabilityType || "",
          situationDescription: profile.situationDescription || "",
          healthCondition: profile.healthCondition || "",
          guardianName: profile.guardianName || "",
          guardianPhone: profile.guardianPhone || "",
          guardianRelation: profile.guardianRelation || "",
          cccdFrontFile: profile.cccdFrontFile || "",
          cccdBackFile: profile.cccdBackFile || "",
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi khi tải thông tin: " + errorMessage);
      router.push("/socialorg/bficiary");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    if (!vulnerabilityType) {
      toast.error("Vui lòng chọn loại đối tượng");
      return;
    }

    if (!originalData) {
      toast.error("Dữ liệu gốc không tồn tại");
      return;
    }

    const changedData: Partial<UpdateBeneficiaryData> = {};
    let hasChanges = false;

    if (fullName.trim() !== originalData.fullName) {
      changedData.fullName = fullName.trim();
      hasChanges = true;
    }

    if (avatarUrl.trim() !== (originalData.avatarUrl || "")) {
      changedData.avatarUrl = avatarUrl.trim() || undefined;
      hasChanges = true;
    }

    if (vulnerabilityType !== originalData.vulnerabilityType) {
      changedData.vulnerabilityType = vulnerabilityType;
      hasChanges = true;
    }

    if (situationDescription.trim() !== (originalData.situationDescription || "")) {
      changedData.situationDescription = situationDescription.trim() || undefined;
      hasChanges = true;
    }

    if (healthCondition.trim() !== (originalData.healthCondition || "")) {
      changedData.healthCondition = healthCondition.trim() || undefined;
      hasChanges = true;
    }

    if (guardianName.trim() !== (originalData.guardianName || "")) {
      changedData.guardianName = guardianName.trim() || undefined;
      hasChanges = true;
    }

    if (guardianPhone.trim() !== (originalData.guardianPhone || "")) {
      changedData.guardianPhone = guardianPhone.trim() || undefined;
      hasChanges = true;
    }

    if (guardianRelation !== (originalData.guardianRelation || "")) {
      changedData.guardianRelation = guardianRelation || undefined;
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

      const updateData: UpdateBeneficiaryData = {
        fullName: changedData.fullName || originalData.fullName,
        vulnerabilityType: changedData.vulnerabilityType || originalData.vulnerabilityType,
        ...changedData,
      };

      await updateBeneficiaryProfile(beneficiaryId, updateData);
      toast.success("Đã cập nhật thông tin người cần giúp đỡ");

      // Reload data để hiển thị hình ảnh mới
      await loadMemberData();

      router.push("/socialorg/bficiary");
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
            <div className="absolute inset-0 w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
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
              { label: "Quản lý Người cần giúp đỡ", href: "/socialorg/bficiary" },
              { label: fullName || "Chỉnh sửa" },
            ]}
          />
        </div>
        <Link href="/socialorg/bficiary">
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
                {avatarUrl ? (
                  <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  <span>{fullName.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white flex items-center justify-center shadow-sm"></div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-1 tracking-tight">{fullName}</h1>
            <p className="text-sm font-bold text-[#008080] mb-3 uppercase tracking-widest">HỒ SƠ NGƯỜI CẦN GIÚP ĐỠ</p>
            <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border ${
              member?.status === "APPROVED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
              member?.status === "REJECTED" ? "bg-red-50 text-red-600 border-red-100" :
              "bg-amber-50 text-amber-600 border-amber-100"
            }`}>
              {member?.status === "APPROVED" ? "Đã duyệt" : member?.status === "REJECTED" ? "Bị từ chối" : "Chờ duyệt"}
            </div>
            <p className="text-xs text-slate-500 font-medium mt-3">
              Tham gia: {new Date(member?.createdAt || "").toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>

        {/* Giấy tờ tùy thân (Đưa lên đầu) */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="bg-slate-50/50 border-b border-slate-100 pb-4 pt-5 px-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                <ImageIcon className="w-5 h-5 text-[#008080]" />
              </div>
              <h2 className="text-lg font-bold text-slate-800">Giấy tờ tùy thân</h2>
            </div>
          </div>
          <div className="p-6 pt-6">
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
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Thông tin cá nhân */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-slate-50/50 border-b border-slate-100 pb-4 pt-5 px-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
                    <User className="w-5 h-5 text-[#008080]" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Thông tin cá nhân</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
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
                  <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
                    Họ và tên <span className="text-red-600">*</span>
                  </Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nhập họ và tên đầy đủ"
                    required
                    className="h-10 border-gray-300 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    value={member?.bficiaryProfile?.phone || "Chưa cập nhật"}
                    disabled
                    className="bg-gray-50 border-gray-200"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 flex items-center gap-2">
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

            {/* Thông tin người giám hộ */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-amber-50/30 border-b border-amber-100 pb-4 pt-5 px-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-amber-100">
                    <Shield className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Người giám hộ</h2>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">Nếu có</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4 pt-6">
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
              </div>
            </div>
          </div>

          {/* Right Column - Actions */}
          <div className="space-y-8">
            {/* Thông tin hoàn cảnh */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-rose-50/30 border-b border-rose-100 pb-4 pt-5 px-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-xl shadow-sm border border-rose-100">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Thông tin hoàn cảnh</h2>
                </div>
              </div>
              <div className="p-6 space-y-4 pt-6">
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
              </div>
            </div>

            <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden w-full h-fit sticky top-[100px]">
              <div className="flex flex-col gap-4 p-6 bg-slate-50/50">
                <div className="text-sm font-medium text-slate-500 mb-2">
                  Cập nhật thông tin và thay đổi trạng thái tài khoản.
                </div>
                <div className="flex flex-col gap-3 w-full">
                  <Button
                    onClick={handleSubmit}
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
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/socialorg/bficiary")}
                    disabled={submitting}
                    className="w-full h-12 rounded-xl font-bold shadow-sm transition-all text-sm bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  >
                    Hủy bỏ
                  </Button>
                </div>
              </div>
            </div>
          </div>

            

          </div>

          {/* Right Column - Actions */}
          
          
        </div>
      </div>
    </div>
  );
}
