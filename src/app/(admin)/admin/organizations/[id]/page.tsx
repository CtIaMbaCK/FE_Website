"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  getOrganizationDetail,
  updateOrganization,
  type Organization,
} from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Breadcrumb from "@/components/Breadcrumb";
import {
  MdArrowBack,
  MdEdit,
  MdSave,
  MdCancel,
  MdLock,
  MdLockOpen,
  MdCampaign,
  MdArticle,
} from "react-icons/md";

// Type cho Organization co them campaigns va posts
interface OrganizationWithDetails extends Organization {
  campaigns?: Array<{
    id: string;
    title: string;
    status: string;
    startDate: string;
    endDate?: string;
    currentVolunteers: number;
    maxVolunteers: number;
  }>;
  communicationPosts?: Array<{
    id: string;
    title: string;
    createdAt: string;
  }>;
}

export default function OrganizationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [organization, setOrganization] =
    useState<OrganizationWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    organizationName: "",
    representativeName: "",
    phoneNumber: "",
  });

  // Fetch chi tiet TCXH
  const fetchOrganization = async () => {
    try {
      setLoading(true);
      const data = (await getOrganizationDetail(id)) as OrganizationWithDetails;
      setOrganization(data);
      setEditForm({
        organizationName: data.organizationProfiles?.organizationName || "",
        representativeName: data.organizationProfiles?.representativeName || "",
        phoneNumber: data.phoneNumber || "",
      });
    } catch (error) {
      console.error("Loi fetch organization:", error);
      toast.error("Không thể tải thông tin tổ chức xã hội");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrganization();
    }
  }, [id]);

  // Xu ly luu thong tin
  const handleSave = async () => {
    try {
      await updateOrganization(id, editForm);
      toast.success("Cập nhật thông tin thành công");
      setIsEditing(false);
      fetchOrganization();
    } catch (error) {
      console.error("Loi update:", error);
      toast.error("Không thể cập nhật thông tin");
    }
  };

  // Xu ly khoa/mo khoa
  const handleToggleStatus = async () => {
    if (!organization) return;
    try {
      const newStatus = organization.status === "ACTIVE" ? "BANNED" : "ACTIVE";
      await updateOrganization(id, { status: newStatus });
      toast.success(
        `Đã ${newStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản thành công`
      );
      fetchOrganization();
    } catch (error) {
      console.error("Loi update status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Hien thi badge status
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "Hoạt động", className: "bg-green-100 text-green-800" },
      PENDING: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
      BANNED: { label: "Đã khóa", className: "bg-red-100 text-red-800" },
      DENIED: { label: "Từ chối", className: "bg-red-100 text-red-800" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "" };
    return (
      <Badge className={statusInfo.className} variant="outline">
        {statusInfo.label}
      </Badge>
    );
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

  // Format ten quan huyen
  const formatDistrict = (district: string) => {
    return district.replace(/_/g, " ");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
      </div>
    );
  }

  if (!organization) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin</p>
        <Button onClick={() => router.push("/admin/organizations")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý tổ chức xã hội", href: "/admin/organizations" },
          { label: "Chi tiết" }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/organizations")}
          >
            <MdArrowBack className="mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Chi tiết Tổ chức xã hội
          </h1>
        </div>

        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="bg-white"
              >
                <MdEdit className="mr-2" />
                Chỉnh sửa
              </Button>
              <Button
                variant={
                  organization.status === "ACTIVE" ? "destructive" : "default"
                }
                onClick={handleToggleStatus}
                disabled={
                  organization.status === "PENDING" ||
                  organization.status === "DENIED"
                }
                className={
                  organization.status !== "ACTIVE"
                    ? "bg-[#008080] hover:bg-[#006666]"
                    : ""
                }
              >
                {organization.status === "ACTIVE" ? (
                  <>
                    <MdLock className="mr-2" />
                    Khóa tài khoản
                  </>
                ) : (
                  <>
                    <MdLockOpen className="mr-2" />
                    Mở khóa
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setEditForm({
                    organizationName:
                      organization.organizationProfiles?.organizationName || "",
                    representativeName:
                      organization.organizationProfiles?.representativeName || "",
                    phoneNumber: organization.phoneNumber || "",
                  });
                }}
              >
                <MdCancel className="mr-2" />
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="bg-[#008080] hover:bg-[#006666]"
              >
                <MdSave className="mr-2" />
                Lưu
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content - 2 columns on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Avatar and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <Avatar className="w-32 h-32 mb-4">
                  <AvatarImage
                    src={organization.organizationProfiles?.avatarUrl || undefined}
                    alt={
                      organization.organizationProfiles?.organizationName ||
                      "Organization"
                    }
                  />
                  <AvatarFallback className="bg-[#008080] text-white text-4xl">
                    {organization.organizationProfiles?.organizationName?.charAt(
                      0
                    ) || "O"}
                  </AvatarFallback>
                </Avatar>

                {/* Name and Status */}
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {organization.organizationProfiles?.organizationName ||
                    "Chưa có tên"}
                </h2>
                <div className="mb-4">{getStatusBadge(organization.status)}</div>

                {/* Basic Info */}
                <div className="w-full space-y-3 text-left">
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">{organization.email}</p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium text-gray-900">
                      {organization.phoneNumber || "Chưa có"}
                    </p>
                  </div>
                  <div className="border-t pt-3">
                    <p className="text-sm text-gray-500">Ngày tạo</p>
                    <p className="font-medium text-gray-900">
                      {formatDate(organization.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thong ke nhanh */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdCampaign className="text-blue-600 text-xl" />
                  <span className="text-sm font-medium text-gray-700">
                    Chiến dịch
                  </span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {organization.campaigns?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MdArticle className="text-green-600 text-xl" />
                  <span className="text-sm font-medium text-gray-700">
                    Bài viết
                  </span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {organization.communicationPosts?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Thong tin co ban */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="organizationName">Tên tổ chức</Label>
                    <Input
                      id="organizationName"
                      value={editForm.organizationName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          organizationName: e.target.value,
                        })
                      }
                      placeholder="Nhập tên tổ chức"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="representativeName">Người đại diện</Label>
                    <Input
                      id="representativeName"
                      value={editForm.representativeName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          representativeName: e.target.value,
                        })
                      }
                      placeholder="Nhập tên người đại diện"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Số điện thoại</Label>
                    <Input
                      id="phoneNumber"
                      value={editForm.phoneNumber}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phoneNumber: e.target.value })
                      }
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Tên tổ chức</p>
                      <p className="font-medium text-gray-900">
                        {organization.organizationProfiles?.organizationName ||
                          "Chưa có"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Người đại diện</p>
                      <p className="font-medium text-gray-900">
                        {organization.organizationProfiles?.representativeName ||
                          "Chưa có"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Dia chi */}
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Quận/Huyện</p>
                  <p className="font-medium text-gray-900">
                    {organization.organizationProfiles?.district
                      ? formatDistrict(organization.organizationProfiles.district)
                      : "Chưa có"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Địa chỉ chi tiết</p>
                  <p className="font-medium text-gray-900">
                    {organization.organizationProfiles?.addressDetail || "Chưa có"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cac chien dich gan day */}
          {organization.campaigns && organization.campaigns.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Các chiến dịch gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {organization.campaigns.slice(0, 5).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {campaign.title}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {campaign.currentVolunteers}/{campaign.maxVolunteers} TNV
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          campaign.status === "ACTIVE"
                            ? "bg-green-100 text-green-800"
                            : campaign.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Cac bai viet gan day */}
          {organization.communicationPosts &&
            organization.communicationPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Các bài viết gần đây</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {organization.communicationPosts.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="flex items-start justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{post.title}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

          {/* Thong tin tai khoan */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin tài khoản</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Trạng thái</p>
                  {getStatusBadge(organization.status)}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày đăng ký</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(organization.createdAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
