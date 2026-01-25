"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getHelpRequestDetail, approveHelpRequest, type HelpRequest } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import { MdArrowBack, MdPerson, MdLocationOn, MdCalendarToday, MdAccessTime, MdCheck, MdClose } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HelpRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await getHelpRequestDetail(id);
      setRequest(response);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết yêu cầu:", error);
      toast.error("Không thể tải thông tin yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (status: "APPROVED" | "REJECTED") => {
    const confirmMessage =
      status === "APPROVED"
        ? "Bạn có chắc chắn muốn duyệt yêu cầu này?"
        : "Bạn có chắc chắn muốn từ chối yêu cầu này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setIsApproving(true);
      const response = await approveHelpRequest(id, status);
      toast.success(response.message);
      // Refresh data
      await fetchRequest();
    } catch (error: any) {
      console.error("Lỗi khi duyệt yêu cầu:", error);
      toast.error(error.response?.data?.message || "Không thể duyệt yêu cầu");
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "Đã duyệt", className: "bg-blue-100 text-blue-800" },
      ONGOING: { label: "Đang thực hiện", className: "bg-purple-100 text-purple-800" },
      COMPLETED: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
      REJECTED: { label: "Từ chối", className: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100" };
    return (
      <Badge className={statusInfo.className} variant="outline">
        {statusInfo.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "Không xác định";
    return new Date(timeString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      EDUCATION: "Giáo dục",
      MEDICAL: "Y tế",
      HOUSE_WORK: "Công việc nhà",
      TRANSPORT: "Đi lại",
      FOOD: "Thực phẩm",
      SHELTER: "Nơi ở",
      OTHER: "Khác",
    };
    return typeMap[type] || type;
  };

  const getDistrictLabel = (district: string) => {
    return district.replace("QUAN_", "Quận ").replace("_", " ");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin</p>
        <Button onClick={() => router.push("/admin/requests")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <Breadcrumb
        items={[
          { label: "Quản lý Yêu cầu", href: "/admin/requests" },
          { label: "Chi tiết" },
        ]}
      />

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/admin/requests")}
          className="flex items-center gap-2"
        >
          <MdArrowBack size={20} />
          Quay lại
        </Button>

        {/* Nút Duyệt/Từ chối - chỉ hiện khi status = PENDING */}
        {request?.status === "PENDING" && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove("APPROVED")}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MdCheck size={20} className="mr-2" />
              {isApproving ? "Đang xử lý..." : "Duyệt yêu cầu"}
            </Button>
            <Button
              onClick={() => handleApprove("REJECTED")}
              disabled={isApproving}
              variant="destructive"
            >
              <MdClose size={20} className="mr-2" />
              Từ chối
            </Button>
          </div>
        )}
      </div>

      {/* Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{request.title}</CardTitle>
            {getStatusBadge(request.status)}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {request.description && (
            <div>
              <p className="text-sm text-gray-500">Mô tả</p>
              <p className="text-gray-900">{request.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Loại hoạt động</p>
              <p className="font-medium">{getActivityTypeLabel(request.activityType)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Mức độ khẩn cấp</p>
              {request.urgencyLevel === "CRITICAL" ? (
                <Badge className="bg-red-500 text-white">Khẩn cấp</Badge>
              ) : (
                <Badge variant="outline">Bình thường</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Quận/Huyện</p>
              <div className="flex items-center gap-2">
                <MdLocationOn className="text-[#008080]" />
                <p className="font-medium">{getDistrictLabel(request.district)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Địa chỉ chi tiết</p>
              <p className="font-medium">{request.addressDetail}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ngày bắt đầu</p>
              <div className="flex items-center gap-2">
                <MdCalendarToday className="text-[#008080]" />
                <p className="font-medium">{formatDate(request.startDate)}</p>
              </div>
            </div>
            {request.endDate && (
              <div>
                <p className="text-sm text-gray-500">Ngày kết thúc</p>
                <div className="flex items-center gap-2">
                  <MdCalendarToday className="text-[#008080]" />
                  <p className="font-medium">{formatDate(request.endDate)}</p>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Giờ bắt đầu</p>
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-[#008080]" />
                <p className="font-medium">{formatTime(request.startTime)}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Giờ kết thúc</p>
              <div className="flex items-center gap-2">
                <MdAccessTime className="text-[#008080]" />
                <p className="font-medium">{formatTime(request.endTime)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin người yêu cầu */}
      <Card>
        <CardHeader>
          <CardTitle>Người yêu cầu</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={request.requester.bficiaryProfile?.avatarUrl} />
              <AvatarFallback className="bg-blue-100 text-blue-600">
                {request.requester.bficiaryProfile?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-lg">
                {request.requester.bficiaryProfile?.fullName || "Chưa có tên"}
              </p>
              <p className="text-sm text-gray-600">{request.requester.email}</p>
              <p className="text-sm text-gray-600">{request.requester.phoneNumber}</p>
              {request.requester.bficiaryProfile?.vulnerabilityType && (
                <Badge variant="outline" className="mt-2">
                  {request.requester.bficiaryProfile.vulnerabilityType}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thông tin tình nguyện viên */}
      {request.volunteer && (
        <Card>
          <CardHeader>
            <CardTitle>Tình nguyện viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={request.volunteer.volunteerProfile?.avatarUrl} />
                <AvatarFallback className="bg-green-100 text-green-600">
                  {request.volunteer.volunteerProfile?.fullName?.charAt(0) || "V"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-lg">
                  {request.volunteer.volunteerProfile?.fullName || "Chưa có tên"}
                </p>
                <p className="text-sm text-gray-600">{request.volunteer.email}</p>
                <p className="text-sm text-gray-600">{request.volunteer.phoneNumber}</p>
                {request.volunteer.volunteerProfile?.points !== undefined && (
                  <Badge variant="outline" className="mt-2">
                    {request.volunteer.volunteerProfile.points} điểm
                  </Badge>
                )}
              </div>
            </div>
            {request.acceptedAt && (
              <div className="mt-4 text-sm text-gray-600">
                Đã nhận yêu cầu vào: {formatDate(request.acceptedAt)} lúc {formatTime(request.acceptedAt)}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Ảnh hoạt động */}
      {request.activityImages && request.activityImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ảnh hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {request.activityImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Ảnh hoạt động ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ảnh minh chứng hoàn thành */}
      {request.proofImages && request.proofImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Ảnh minh chứng hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {request.proofImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`Ảnh minh chứng ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
            {request.completionNotes && (
              <div className="mt-4">
                <p className="text-sm text-gray-500">Ghi chú hoàn thành:</p>
                <p className="text-gray-900">{request.completionNotes}</p>
              </div>
            )}
            {request.doneAt && (
              <div className="mt-2 text-sm text-gray-600">
                Hoàn thành vào: {formatDate(request.doneAt)} lúc {formatTime(request.doneAt)}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Thông tin hệ thống */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin hệ thống</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">ID yêu cầu</p>
              <p className="font-mono text-xs text-gray-900">{request.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ngày tạo</p>
              <p className="text-gray-900">{formatDate(request.createdAt)} lúc {formatTime(request.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
