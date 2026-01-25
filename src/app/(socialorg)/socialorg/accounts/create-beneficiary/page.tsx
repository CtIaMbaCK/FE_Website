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
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Quản lý tài khoản", href: "/socialorg/accounts" },
            { label: "Tạo tài khoản NCGĐ" },
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
            Tạo tài khoản Người cần giúp đỡ
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Nhập thông tin để tạo tài khoản mới cho người cần giúp đỡ
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
                      className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
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
                      className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
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
                      className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
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
                      className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin hoàn cảnh */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-gray-600" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Thông tin hoàn cảnh
                    </h2>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="vulnerabilityType">
                      Loại đối tượng <span className="text-red-600">*</span>
                    </Label>
                    <Select
                      value={vulnerabilityType}
                      onValueChange={setVulnerabilityType}
                      required
                    >
                      <SelectTrigger className="h-10 border-gray-300 focus:border-emerald-500">
                        <SelectValue placeholder="Chọn loại đối tượng" />
                      </SelectTrigger>
                      <SelectContent>
                        {VULNERABILITY_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="situationDescription">
                      Mô tả tình huống
                    </Label>
                    <Textarea
                      id="situationDescription"
                      value={situationDescription}
                      onChange={(e) => setSituationDescription(e.target.value)}
                      placeholder="Mô tả hoàn cảnh hiện tại..."
                      rows={4}
                      className="resize-none border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="healthCondition">
                      Tình trạng sức khỏe
                    </Label>
                    <Textarea
                      id="healthCondition"
                      value={healthCondition}
                      onChange={(e) => setHealthCondition(e.target.value)}
                      placeholder="Tình trạng sức khỏe..."
                      rows={3}
                      className="resize-none border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                    />
                  </div>
                </div>
              </div>

              {/* Thông tin người giám hộ */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gray-600" />
                    <h2 className="text-base font-semibold text-gray-900">
                      Thông tin người giám hộ
                    </h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">Nếu có</p>
                </div>
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">Tên người giám hộ</Label>
                    <Input
                      id="guardianName"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                      placeholder="Nhập tên người giám hộ"
                      className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">
                      Số điện thoại người giám hộ
                    </Label>
                    <Input
                      id="guardianPhone"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      placeholder="Nhập số điện thoại"
                      className="h-10 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/10"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="guardianRelation">Mối quan hệ</Label>
                    <Select
                      value={guardianRelation}
                      onValueChange={setGuardianRelation}
                    >
                      <SelectTrigger className="h-10 border-gray-300 focus:border-emerald-500">
                        <SelectValue placeholder="Chọn mối quan hệ" />
                      </SelectTrigger>
                      <SelectContent>
                        {GUARDIAN_RELATIONS.map((relation) => (
                          <SelectItem key={relation.value} value={relation.value}>
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6"
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
