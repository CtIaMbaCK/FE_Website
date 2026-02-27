"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createBeneficiaryAccount } from "@/services/account.service";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Lock,
  Heart,
  Shield,
} from "lucide-react";
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

export default function CreateBeneficiaryPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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

    if (!vulnerabilityType) {
      toast.error("Vui lòng chọn loại đối tượng");
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
        vulnerabilityType: vulnerabilityType,
        situationDescription: situationDescription.trim() || undefined,
        healthCondition: healthCondition.trim() || undefined,
        guardianName: guardianName.trim() || undefined,
        guardianPhone: guardianPhone.trim() || undefined,
        guardianRelation: guardianRelation || undefined,
      };

      await createBeneficiaryAccount(data);
      toast.success("Đã tạo tài khoản người cần giúp đỡ thành công");
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
                { label: "Tạo tài khoản NCGĐ" },
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
            Tạo tài khoản Người cần giúp đỡ
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Nhập thông tin để tạo tài khoản mới cho người cần giúp đỡ
          </p>
        </div>

        {/* Two Column Layout */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Personal Info */}
            <div className="space-y-6">
              {/* Thông tin đăng nhập */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="p-6 border-b border-slate-100 bg-white/50 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#008080] shadow-sm">
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
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="p-6 border-b border-slate-100 bg-white/50 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-[#008080] shadow-sm">
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

              {/* Thông tin hoàn cảnh */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="p-6 border-b border-slate-100 bg-white/50 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-red-500 shadow-sm">
                      <Heart className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Thông tin hoàn cảnh
                    </h2>
                  </div>
                </div>
                <div className="p-6 space-y-5 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="vulnerabilityType" className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      Loại đối tượng <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={vulnerabilityType}
                      onValueChange={setVulnerabilityType}
                      required
                    >
                      <SelectTrigger className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium">
                        <SelectValue placeholder="Chọn loại đối tượng" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
                        {VULNERABILITY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value} className="cursor-pointer">
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="situationDescription" className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      Mô tả tình huống
                    </Label>
                    <Textarea
                      id="situationDescription"
                      value={situationDescription}
                      onChange={(e) => setSituationDescription(e.target.value)}
                      placeholder="Mô tả hoàn cảnh hiện tại..."
                      rows={4}
                      className="resize-none border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="healthCondition" className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      Tình trạng sức khỏe
                    </Label>
                    <Textarea
                      id="healthCondition"
                      value={healthCondition}
                      onChange={(e) => setHealthCondition(e.target.value)}
                      placeholder="Tình trạng sức khỏe..."
                      rows={3}
                      className="resize-none border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin người giám hộ */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-md transition-all duration-300 relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
                <div className="p-6 border-b border-slate-100 bg-white/50 relative z-10 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm">
                      <Shield className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">
                      Thông tin người giám hộ
                    </h2>
                  </div>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold shadow-sm">
                    Nếu có
                  </span>
                </div>
                <div className="p-6 space-y-5 relative z-10">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName" className="text-sm font-bold text-slate-600 uppercase tracking-wider">Tên người giám hộ</Label>
                    <Input
                      id="guardianName"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="Nhập tên người giám hộ"
                      className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone" className="text-sm font-bold text-slate-600 uppercase tracking-wider">
                      Số điện thoại người giám hộ
                    </Label>
                    <Input
                      id="guardianPhone"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianRelation" className="text-sm font-bold text-slate-600 uppercase tracking-wider">Mối quan hệ</Label>
                    <Select
                      value={guardianRelation}
                      onValueChange={setGuardianRelation}
                    >
                      <SelectTrigger className="h-12 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl bg-gray-50/50 shadow-sm font-medium">
                        <SelectValue placeholder="Chọn mối quan hệ" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
                        {GUARDIAN_RELATIONS.map((relation) => (
                          <SelectItem key={relation.value} value={relation.value} className="cursor-pointer">
                            {relation.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Documents */}
            <div className="space-y-6">
              {/* CCCD/CMND */}
              <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden relative">
                <div className="p-6 border-b border-slate-100 bg-white/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shadow-sm">
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
                  className="w-full sm:w-auto bg-[#008080] hover:bg-[#008080]/90 text-white h-12 px-8 rounded-xl font-bold shadow-sm transition-all"
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
