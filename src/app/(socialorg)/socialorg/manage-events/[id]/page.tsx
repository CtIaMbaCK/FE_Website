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
} from "lucide-react";
import {
  getCampaignDetail,
  getCampaignRegistrations,
  updateRegistrationStatus,
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
    <div className="pb-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý chiến dịch", href: "/socialorg/manage-events" },
          { label: campaign.title },
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/socialorg/manage-events")}
          className="text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
        <Button
          onClick={() => router.push(`/socialorg/manage-events/${campaignId}/edit`)}
          className="bg-teal-600 hover:bg-teal-700"
          disabled={campaign.status === "ONGOING" || campaign.status === "COMPLETED"}
        >
          <Edit className="w-4 h-4 mr-2" />
          Chỉnh sửa
        </Button>
      </div>

      {/* Campaign Info */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{campaign.title}</CardTitle>
              <CardDescription className="text-base">
                {campaign.description || "Không có mô tả"}
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={`font-medium border-none px-3 py-1 rounded-full ${statusBadge?.color}`}
            >
              {statusBadge?.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Địa điểm */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Địa điểm</p>
                <p className="font-semibold text-gray-900">{districtLabel}</p>
                <p className="text-sm text-gray-600">{campaign.addressDetail}</p>
              </div>
            </div>

            {/* Thời gian */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Thời gian</p>
                <p className="font-semibold text-gray-900">
                  {new Date(campaign.startDate).toLocaleDateString("vi-VN")}
                </p>
                {campaign.endDate && (
                  <p className="text-sm text-gray-600">
                    đến {new Date(campaign.endDate).toLocaleDateString("vi-VN")}
                  </p>
                )}
              </div>
            </div>

            {/* Tình nguyện viên */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500">Tình nguyện viên</p>
                <p className="font-semibold text-gray-900">
                  {campaign.currentVolunteers}/{campaign.maxVolunteers}
                </p>
                <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Mục tiêu */}
            {campaign.goal && (
              <div className="flex items-start gap-3 md:col-span-2 lg:col-span-3">
                <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mục tiêu</p>
                  <p className="font-semibold text-gray-900">{campaign.goal}</p>
                </div>
              </div>
            )}
          </div>

          {/* Cover Image */}
          {campaign.coverImage && (
            <div className="mt-6">
              <img
                src={campaign.coverImage}
                alt={campaign.title}
                className="w-full h-64 object-cover rounded-lg"
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
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registrations List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách tình nguyện viên đã đăng ký</CardTitle>
          <CardDescription>
            Tổng số: {registrations.length} tình nguyện viên
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRegistrations ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin"></div>
              <p className="text-sm text-gray-600 mt-2">Đang tải danh sách...</p>
            </div>
          ) : registrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có tình nguyện viên nào đăng ký
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="w-[50px]">STT</TableHead>
                    <TableHead>Tình nguyện viên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Kỹ năng</TableHead>
                    <TableHead>Ngày đăng ký</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registrations.map((registration, index) => {
                    const StatusIcon = REGISTRATION_STATUS.find(
                      (s) => s.value === registration.status
                    )?.icon || Clock;
                    const statusColor = REGISTRATION_STATUS.find(
                      (s) => s.value === registration.status
                    )?.color || "text-gray-600";

                    return (
                      <TableRow key={registration.id}>
                        <TableCell className="text-center font-medium text-gray-600">
                          {index + 1}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage
                                src={registration.volunteer?.volunteerProfile?.avatarUrl}
                              />
                              <AvatarFallback className="bg-teal-100 text-teal-700">
                                {registration.volunteer?.volunteerProfile?.fullName
                                  ?.charAt(0)
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {registration.volunteer?.volunteerProfile?.fullName ||
                                  "Chưa cập nhật"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {registration.volunteer?.volunteerProfile?.experienceYears}{" "}
                                năm kinh nghiệm
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {registration.volunteer?.email}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {registration.volunteer?.phoneNumber || "Chưa cập nhật"}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {registration.volunteer?.volunteerProfile?.skills
                              ?.slice(0, 2)
                              .map((skill, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            {(registration.volunteer?.volunteerProfile?.skills?.length ||
                              0) > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +
                                {(registration.volunteer?.volunteerProfile?.skills
                                  ?.length || 0) - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {new Date(registration.registeredAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </TableCell>
                        <TableCell>
                          <div className={`flex items-center gap-2 ${statusColor}`}>
                            <StatusIcon className="w-4 h-4" />
                            <span className="font-medium">
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
                            <SelectTrigger className="w-[140px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {REGISTRATION_STATUS.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
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
        </CardContent>
      </Card>
    </div>
  );
}
