"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllCampaigns, approveCampaign, type Campaign } from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumb from "@/components/Breadcrumb";
import { MdArrowBack, MdPeople, MdCheck, MdClose } from "react-icons/md";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  // Fetch campaign tu list API vi khong co detail endpoint
  const fetchCampaign = async () => {
    try {
      setLoading(true);
      // Lay tat ca campaigns va tim campaign theo id
      const response = await getAllCampaigns(undefined, undefined, undefined, 1, 1000);
      const foundCampaign = response.items.find((c) => c.id === id);

      if (foundCampaign) {
        setCampaign(foundCampaign);
      } else {
        toast.error("Không tìm thấy chiến dịch");
      }
    } catch (error) {
      console.error("Loi fetch campaign:", error);
      toast.error("Không thể tải thông tin chiến dịch");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (status: "APPROVED" | "REJECTED") => {
    const confirmMessage =
      status === "APPROVED"
        ? "Bạn có chắc chắn muốn duyệt chiến dịch này?"
        : "Bạn có chắc chắn muốn từ chối chiến dịch này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setIsApproving(true);
      const response = await approveCampaign(id, status);
      toast.success(response.message);
      // Refresh data
      await fetchCampaign();
    } catch (error: any) {
      console.error("Lỗi khi duyệt chiến dịch:", error);
      toast.error(error.response?.data?.message || "Không thể duyệt chiến dịch");
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  // Hien thi badge status voi mau sac
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      APPROVED: { label: "Đã duyệt", className: "bg-green-100 text-green-800" },
      PENDING: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
      ONGOING: { label: "Đang thực hiện", className: "bg-blue-100 text-blue-800" },
      COMPLETED: { label: "Đã hoàn thành", className: "bg-purple-100 text-purple-800" },
      CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
      REJECTED: { label: "Từ chối", className: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "" };
    return (
      <Badge className={statusInfo.className} variant="outline">
        {statusInfo.label}
      </Badge>
    );
  };

  // Format ngay thang
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin</p>
        <Button onClick={() => router.push("/admin/campaigns")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý chiến dịch", href: "/admin/campaigns" },
          { label: "Chi tiết" }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/campaigns")}
          >
            <MdArrowBack className="mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Chi tiết Chiến dịch
          </h1>
        </div>

        {/* Nút Duyệt/Từ chối - chỉ hiện khi status = PENDING */}
        {campaign?.status === "PENDING" && (
          <div className="flex gap-2">
            <Button
              onClick={() => handleApprove("APPROVED")}
              disabled={isApproving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <MdCheck size={20} className="mr-2" />
              {isApproving ? "Đang xử lý..." : "Duyệt chiến dịch"}
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

      {/* Main Content */}
      <div className="space-y-6">
        {/* Thong tin co ban */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chiến dịch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Tiêu đề</p>
              <p className="font-semibold text-lg text-gray-900 mt-1">
                {campaign.title}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Trạng thái</p>
              <div className="mt-1">
                {getStatusBadge(campaign.status)}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Ngày bắt đầu</p>
                <p className="font-medium text-gray-900">
                  {formatDate(campaign.startDate)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày kết thúc</p>
                <p className="font-medium text-gray-900">
                  {formatDate(campaign.endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thong tin tinh nguyen vien */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tình nguyện viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                  <MdPeople className="w-6 h-6 text-[#008080]" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Số lượng hiện tại</p>
                  <p className="font-semibold text-2xl text-gray-900">
                    {campaign.currentVolunteers}
                  </p>
                </div>
              </div>
              <div className="text-gray-400 text-2xl">/</div>
              <div>
                <p className="text-sm text-gray-500">Số lượng tối đa</p>
                <p className="font-semibold text-2xl text-gray-900">
                  {campaign.maxVolunteers}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-[#008080] h-3 rounded-full transition-all"
                  style={{
                    width: `${Math.min(
                      (campaign.currentVolunteers / campaign.maxVolunteers) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(
                  (campaign.currentVolunteers / campaign.maxVolunteers) * 100
                )}% đã đăng ký
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Thong tin to chuc */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tổ chức</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={campaign.organization.organizationProfiles?.avatarUrl}
                  alt={campaign.organization.organizationProfiles?.organizationName || "Org"}
                />
                <AvatarFallback className="bg-[#008080] text-white text-xl">
                  {campaign.organization.organizationProfiles?.organizationName?.charAt(0) || "O"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">Tên tổ chức</p>
                <p className="font-semibold text-lg text-gray-900">
                  {campaign.organization.organizationProfiles?.organizationName || "Không rõ"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thong tin ky thuat */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin kỹ thuật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Campaign ID</p>
                <p className="font-medium text-gray-900 font-mono text-xs">
                  {campaign.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Organization ID</p>
                <p className="font-medium text-gray-900 font-mono text-xs">
                  {campaign.organizationId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium text-gray-900">
                  {formatDate(campaign.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày cập nhật</p>
                <p className="font-medium text-gray-900">
                  {formatDate(campaign.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
