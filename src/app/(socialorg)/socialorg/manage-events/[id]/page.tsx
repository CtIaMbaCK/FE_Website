"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/components/Breadcrumb";
import { toast } from "sonner";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  Target,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  UploadCloud,
  Trash2,
  X,
} from "lucide-react";
import {
  getCampaignDetail,
  getCampaignRegistrations,
  updateRegistrationStatus,
  completeCampaign,
  type Campaign,
  type CampaignRegistration,
} from "@/services/campaign.service";

const DISTRICTS = [
  { value: "QUAN_1", label: "Quận 1" },
  { value: "QUAN_2", label: "Quận 2" },
  { value: "QUAN_3", label: "Quận 3" },
  { value: "QUAN_4", label: "Quận 4" },
  { value: "QUAN_5", label: "Quận 5" },
  { value: "QUAN_6", label: "Quận 6" },
  { value: "QUAN_7", label: "Quận 7" },
  { value: "QUAN_8", label: "Quận 8" },
  { value: "QUAN_9", label: "Quận 9" },
  { value: "QUAN_10", label: "Quận 10" },
  { value: "QUAN_11", label: "Quận 11" },
  { value: "QUAN_12", label: "Quận 12" },
  { value: "BINH_THANH", label: "Bình Thạnh" },
  { value: "TAN_BINH", label: "Tân Bình" },
  { value: "TAN_PHU", label: "Tân Phú" },
  { value: "PHU_NHUAN", label: "Phú Nhuận" },
  { value: "GO_VAP", label: "Gò Vấp" },
  { value: "BINH_TAN", label: "Bình Tân" },
  { value: "THU_DUC", label: "Thủ Đức" },
];

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
  { value: "APPROVED", label: "Đã duyệt", color: "bg-blue-100 text-blue-800" },
  { value: "ONGOING", label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
  { value: "COMPLETED", label: "Đã hoàn thành", color: "bg-gray-100 text-gray-800" },
];

const REGISTRATION_STATUS = [
  { value: "REGISTERED", label: "Đã đăng ký", icon: Clock, color: "text-blue-600" },
  { value: "ATTENDED", label: "Đã tham gia", icon: CheckCircle, color: "text-green-600" },
  { value: "CANCELLED", label: "Đã hủy", icon: XCircle, color: "text-red-600" },
];

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [registrations, setRegistrations] = useState<CampaignRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  // Complete Campaign Modal State
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false);
  const [proofImages, setProofImages] = useState<File[]>([]);
  const [submittingComplete, setSubmittingComplete] = useState(false);

  useEffect(() => {
    loadCampaignData();
    loadRegistrations();
  }, [campaignId]);

  const loadCampaignData = async () => {
    try {
      setLoading(true);
      const data = await getCampaignDetail(campaignId);
      setCampaign(data);
    } catch (error: any) {
      toast.error("Lỗi khi tải thông tin chiến dịch: " + error.message);
      router.push("/socialorg/manage-events");
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    try {
      setLoadingRegistrations(true);
      const response = await getCampaignRegistrations(campaignId);
      setRegistrations(response.data || []);
    } catch (error: any) {
      toast.error("Lỗi khi tải danh sách đăng ký: " + error.message);
    } finally {
      setLoadingRegistrations(false);
    }
  };

  const handleStatusChange = async (
    registrationId: string,
    newStatus: "REGISTERED" | "ATTENDED" | "CANCELLED"
  ) => {
    try {
      setUpdatingStatus(registrationId);
      await updateRegistrationStatus(registrationId, newStatus);
      toast.success("Đã cập nhật trạng thái thành công");
      loadRegistrations();
    } catch (error: any) {
      toast.error("Lỗi khi cập nhật trạng thái: " + error.message);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (proofImages.length + filesArray.length > 10) {
        toast.error("Chỉ được tải lên tối đa 10 ảnh minh chứng");
        return;
      }
      setProofImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setProofImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitCompleteCampaign = async () => {
    if (proofImages.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 ảnh minh chứng");
      return;
    }
    
    try {
      setSubmittingComplete(true);
      await completeCampaign(campaignId, proofImages);
      toast.success("Thành công! Toàn bộ tình nguyện viên tham gia đã được cộng 10 điểm.");
      setCompleteDialogOpen(false);
      setProofImages([]);
      loadCampaignData();
    } catch (error: any) {
      toast.error("Lỗi khi báo cáo hoàn thành: " + error.message);
    } finally {
      setSubmittingComplete(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  const statusBadge = STATUS_OPTIONS.find((s) => s.value === campaign.status);
  const districtLabel = DISTRICTS.find((d) => d.value === campaign.district)?.label || campaign.district;
  const percentage = (campaign.currentVolunteers / campaign.maxVolunteers) * 100;

  return (
    <div className="min-h-screen pb-10">
      {/* Breadcrumb */}
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center mb-4">
          <Breadcrumb
            items={[
              { label: "Quản lý chiến dịch", href: "/socialorg/manage-events" },
              { label: campaign.title },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/socialorg/manage-events")}
            className="w-fit text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="font-bold">Quay lại</span>
          </Button>
          
          <div className="flex items-center gap-3">
            {(campaign.status === "APPROVED" || campaign.status === "ONGOING") && (
              <Button
                onClick={() => setCompleteDialogOpen(true)}
                className="h-12 px-6 rounded-xl font-bold bg-green-600 hover:bg-green-700 text-white shadow-sm transition-all flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Báo cáo Hoàn thành
              </Button>
            )}
            <Button
              onClick={() => router.push(`/socialorg/manage-events/${campaignId}/edit`)}
              className="h-12 px-6 rounded-xl font-bold bg-[#008080] hover:bg-[#00A79D] text-white shadow-sm transition-all flex items-center gap-2"
              disabled={campaign.status === "ONGOING" || campaign.status === "COMPLETED"}
            >
              <Edit className="w-4 h-4" />
              Chỉnh sửa
            </Button>
          </div>
        </div>

        {/* Campaign Info */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden mb-8">
          <div className="p-8 border-b border-slate-100">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">{campaign.title}</h2>
                <p className="text-slate-500 font-medium">
                  {campaign.description || "Không có mô tả"}
                </p>
              </div>
              <Badge
                variant="secondary"
                className={`font-bold border-none px-4 py-1.5 rounded-xl shadow-sm shrink-0 h-fit ${statusBadge?.color}`}
              >
                {statusBadge?.label}
              </Badge>
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Địa điểm */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-100">
                  <MapPin className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Địa điểm</p>
                  <p className="font-bold text-slate-800">{districtLabel}</p>
                  <p className="text-sm font-medium text-slate-500 mt-0.5">{campaign.addressDetail}</p>
                </div>
              </div>

              {/* Thời gian */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Thời gian</p>
                  <p className="font-bold text-slate-800">
                    {new Date(campaign.startDate).toLocaleDateString("vi-VN")}
                  </p>
                  {campaign.endDate && (
                    <p className="text-sm font-medium text-slate-500 mt-0.5">
                      đến {new Date(campaign.endDate).toLocaleDateString("vi-VN")}
                    </p>
                  )}
                </div>
              </div>

              {/* Tình nguyện viên */}
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-emerald-100">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Tình nguyện viên</p>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="font-bold text-slate-800">
                      {campaign.currentVolunteers} / {campaign.maxVolunteers}
                    </p>
                    <span className="text-xs font-bold text-emerald-600">{Math.round(percentage)}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Mục tiêu */}
              {campaign.goal && (
                <div className="flex items-start gap-4 md:col-span-2 lg:col-span-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-purple-100">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Mục tiêu</p>
                    <p className="font-bold text-slate-800">{campaign.goal}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Cover Image */}
            {campaign.coverImage && (
              <div className="mt-8">
                <img
                  src={campaign.coverImage}
                  alt={campaign.title}
                  className="w-full h-72 object-cover rounded-[1.5rem] shadow-sm border border-slate-100"
                />
              </div>
            )}

            {/* Additional Images */}
            {campaign.images && campaign.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {campaign.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${campaign.title} - ${index + 1}`}
                    className="w-full h-36 object-cover rounded-[1rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform duration-300"
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Registrations List */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Danh sách tình nguyện viên đã đăng ký</h2>
            <p className="text-sm font-medium text-slate-500">
              Tổng số: {registrations.length} tình nguyện viên
            </p>
          </div>
          
          <div className="p-8">
            {loadingRegistrations ? (
              <div className="text-center py-12">
                <div className="inline-block w-10 h-10 border-4 border-[#008080]/20 border-t-[#008080] rounded-full animate-spin mb-4"></div>
                <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Đang tải danh sách...</p>
              </div>
            ) : registrations.length === 0 ? (
              <div className="text-center py-12 text-slate-500 font-medium">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-slate-400" />
                </div>
                Chưa có tình nguyện viên nào đăng ký
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-slate-100 hover:bg-transparent">
                      <TableHead className="w-[60px] font-bold text-slate-700 uppercase tracking-wider text-xs text-center">STT</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Tình nguyện viên</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Liên hệ</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Kỹ năng</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Ngày đăng ký</TableHead>
                      <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">Trạng thái</TableHead>
                      <TableHead className="text-right font-bold text-slate-700 uppercase tracking-wider text-xs">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registrations.map((registration, index) => {
                      const StatusIcon = REGISTRATION_STATUS.find(
                        (s) => s.value === registration.status
                      )?.icon || Clock;
                      const statusColor = REGISTRATION_STATUS.find(
                        (s) => s.value === registration.status
                      )?.color || "text-slate-600";

                      return (
                        <TableRow key={registration.id} className="hover:bg-slate-50/50 transition-colors border-slate-100">
                          <TableCell className="text-center font-bold text-slate-500">
                            {index + 1}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-4">
                              <Avatar className="w-12 h-12 border border-slate-200 shadow-sm rounded-2xl">
                                <AvatarImage
                                  src={registration.volunteer?.volunteerProfile?.avatarUrl}
                                  className="rounded-2xl object-cover"
                                />
                                <AvatarFallback className="bg-teal-50 text-teal-700 font-bold rounded-2xl">
                                  {registration.volunteer?.volunteerProfile?.fullName
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-bold text-slate-800">
                                  {registration.volunteer?.volunteerProfile?.fullName ||
                                    "Chưa cập nhật"}
                                </p>
                                <p className="text-xs font-medium text-slate-500 mt-0.5">
                                  {registration.volunteer?.volunteerProfile?.experienceYears || 0}{" "}
                                  năm kinh nghiệm
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-medium text-slate-700">{registration.volunteer?.email}</span>
                              <span className="text-xs font-medium text-slate-500">{registration.volunteer?.phoneNumber || "Chưa cập nhật SĐT"}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                              {registration.volunteer?.volunteerProfile?.skills
                                ?.slice(0, 2)
                                .map((skill, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs font-bold bg-blue-50/50 text-blue-700 border-blue-200 rounded-lg px-2 py-0.5"
                                  >
                                    {skill}
                                  </Badge>
                                ))}
                              {(registration.volunteer?.volunteerProfile?.skills?.length ||
                                0) > 2 && (
                                <Badge variant="outline" className="text-xs font-bold bg-slate-50 text-slate-600 border-slate-200 rounded-lg px-2 py-0.5">
                                  +
                                  {(registration.volunteer?.volunteerProfile?.skills
                                    ?.length || 0) - 2}
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600 font-medium text-sm">
                            {new Date(registration.registeredAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </TableCell>
                          <TableCell>
                            <div className={`flex items-center gap-2 ${statusColor} bg-${statusColor.split('-')[1]}-50 px-3 py-1.5 rounded-xl w-fit`}>
                              <StatusIcon className="w-4 h-4" />
                              <span className="font-bold text-xs uppercase tracking-wider">
                                {REGISTRATION_STATUS.find(
                                  (s) => s.value === registration.status
                                )?.label}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Select
                              value={registration.status}
                              onValueChange={(value) =>
                                handleStatusChange(
                                  registration.id,
                                  value as "REGISTERED" | "ATTENDED" | "CANCELLED"
                                )
                              }
                              disabled={updatingStatus === registration.id}
                            >
                              <SelectTrigger className="w-[150px] ml-auto h-10 bg-white border-slate-200 hover:border-[#008080] rounded-xl font-medium shadow-sm transition-all text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
                                {REGISTRATION_STATUS.map((status) => (
                                  <SelectItem key={status.value} value={status.value} className="cursor-pointer text-xs">
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Complete Campaign Dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white/95 backdrop-blur-xl border border-slate-200 shadow-2xl rounded-[2rem]">
          <div className="px-8 pt-8 pb-6 bg-gradient-to-br from-green-50 to-emerald-50/20 border-b border-green-100/50 relative">
            <div className="w-14 h-14 bg-white shadow-sm border border-green-100 rounded-2xl flex items-center justify-center mb-6">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-black text-slate-800 tracking-tight">
              Báo cáo Hoàn thành
            </DialogTitle>
            <DialogDescription className="text-slate-500 font-medium mt-2">
              Tải lên hình ảnh minh chứng sự kiện để kết thúc chiến dịch. <br/>
              <span className="text-green-600 font-bold">Hệ thống sẽ tự động cộng 10 điểm cho tất cả Tình nguyện viên tham gia.</span>
            </DialogDescription>
          </div>

          <div className="p-8 space-y-6">
            <div>
              <label className="text-sm font-bold text-slate-700 block mb-3">
                Ảnh minh chứng (Tối đa 10 ảnh) <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {proofImages.map((file, index) => (
                  <div key={index} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="w-8 h-8 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {proofImages.length < 10 && (
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#008080] hover:bg-teal-50/50 transition-colors rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer aspect-square">
                    <UploadCloud className="w-6 h-6 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Tải ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                      disabled={submittingComplete}
                    />
                  </label>
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex gap-3 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setCompleteDialogOpen(false)}
              className="flex-1 sm:flex-none font-bold text-slate-600 hover:bg-slate-200 rounded-xl px-6 h-12"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={submitCompleteCampaign}
              disabled={submittingComplete || proofImages.length === 0}
              className="flex-1 sm:flex-none font-bold bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-sm px-6 h-12"
            >
              {submittingComplete ? "Đang xử lý..." : "Xác nhận & Cộng điểm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
