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
    const districtMap: Record<string, string> = {
      QUAN_1: "Quận 1",
      QUAN_2: "Quận 2",
      QUAN_3: "Quận 3",
      QUAN_4: "Quận 4",
      QUAN_5: "Quận 5",
      QUAN_6: "Quận 6",
      QUAN_7: "Quận 7",
      QUAN_8: "Quận 8",
      QUAN_10: "Quận 10",
      QUAN_11: "Quận 11",
      QUAN_12: "Quận 12",
      BINH_TAN: "Quận Bình Tân",
      BINH_THANH: "Quận Bình Thạnh",
      GO_VAP: "Quận Gò Vấp",
      PHU_NHUAN: "Quận Phú Nhuận",
      TAN_BINH: "Quận Tân Bình",
      TAN_PHU: "Quận Tân Phú",
      TP_THU_DUC: "TP Thủ Đức",
      HUYEN_BINH_CHANH: "Huyện Bình Chánh",
      HUYEN_CAN_GIO: "Huyện Cần Giờ",
      HUYEN_CU_CHI: "Huyện Củ Chi",
      HUYEN_HOC_MON: "Huyện Hóc Môn",
      HUYEN_NHA_BE: "Huyện Nhà Bè",
    };
    return districtMap[district] || district.replace(/_/g, " ");
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
    <div className="min-h-screen pb-12 font-sans space-y-6 max-w-7xl mx-auto px-6 pt-8">
      {/* Breadcrumb & Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center">
          <Breadcrumb
            items={[
              { label: "Quản lý Tổ chức xã hội", href: "/admin/organizations" },
              { label: organization.organizationProfiles?.organizationName || "Chi tiết" }
            ]}
          />
        </div>
        
        <div className="flex gap-2">
          {!isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-white shadow-sm transition-all font-bold"
              >
                <MdEdit className="mr-2 h-4 w-4" />
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
                className={`h-11 px-6 rounded-xl font-bold shadow-sm transition-all ${
                  organization.status !== "ACTIVE"
                    ? "bg-[#008080] hover:bg-[#00A79D] text-white"
                    : "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                }`}
              >
                {organization.status === "ACTIVE" ? (
                  <>
                    <MdLock className="mr-2 h-4 w-4" />
                    Khóa tài khoản
                  </>
                ) : (
                  <>
                    <MdLockOpen className="mr-2 h-4 w-4" />
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
                className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-bold"
              >
                <MdCancel className="mr-2 h-4 w-4" />
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#008080] to-[#00A79D] text-white font-bold hover:from-[#006666] hover:to-[#008080] shadow-md"
              >
                <MdSave className="mr-2 h-4 w-4" />
                Lưu Thay Đổi
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content - Soft UI Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - Avatar and Basic Info */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Header Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 relative overflow-hidden">
            <div className="flex flex-col items-center relative z-10">
              <div className="relative mb-5">
                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center text-[#008080] text-5xl font-black overflow-hidden shadow-sm border-4 border-white ring-1 ring-slate-100">
                  {organization.organizationProfiles?.avatarUrl ? (
                    <img
                      src={organization.organizationProfiles.avatarUrl}
                      alt={organization.organizationProfiles.organizationName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{(organization.organizationProfiles?.organizationName || "O").charAt(0).toUpperCase()}</span>
                  )}
                </div>
              </div>

              <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight text-center">
                {organization.organizationProfiles?.organizationName || "Chưa có tên"}
              </h1>
              <p className="text-sm font-bold text-[#008080] mb-4 uppercase tracking-widest text-center">Tổ Chức Xã Hội</p>
              
              <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm border mb-6 ${
                organization.status === "ACTIVE" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                organization.status === "BANNED" ? "bg-red-50 text-red-600 border-red-100" :
                organization.status === "DENIED" ? "bg-slate-50 text-slate-600 border-slate-200" :
                "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                {organization.status === "ACTIVE" ? "Đang hoạt động" : 
                 organization.status === "BANNED" ? "Đã khóa" : 
                 organization.status === "DENIED" ? "Từ chối" : "Chờ duyệt"}
              </div>

              {/* Basic Info list in card */}
              <div className="w-full space-y-4 text-left border-t border-slate-100 pt-5 mt-2">
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Email</p>
                  <p className="font-medium text-slate-800 break-all">{organization.email}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Số điện thoại</p>
                  <p className="font-medium text-slate-800">
                    {organization.phoneNumber || "Chưa có"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Ngày tham gia</p>
                  <p className="font-medium text-slate-800">
                    {formatDate(organization.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Thong ke nhanh */}
          <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Thống kê hoạt động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center justify-between p-4 bg-teal-50/50 rounded-2xl border border-teal-100 hover:bg-teal-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 text-teal-600 rounded-xl">
                    <MdCampaign className="text-xl" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    Chiến dịch đã tạo
                  </span>
                </div>
                <span className="text-xl font-black text-teal-600">
                  {organization.campaigns?.length || 0}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-amber-50/50 rounded-2xl border border-amber-100 hover:bg-amber-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                    <MdArticle className="text-xl" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">
                    Bài viết truyền thông
                  </span>
                </div>
                <span className="text-xl font-black text-amber-600">
                  {organization.communicationPosts?.length || 0}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          {/* Thong tin co ban */}
          <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <CardTitle className="text-lg font-bold text-slate-800">Thông tin cơ bản</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-6 tracking-wide">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="font-bold text-slate-700">Tên tổ chức</Label>
                    <Input
                      id="organizationName"
                      value={editForm.organizationName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          organizationName: e.target.value,
                        })
                      }
                      className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080]"
                      placeholder="Nhập tên tổ chức"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="representativeName" className="font-bold text-slate-700">Người đại diện</Label>
                    <Input
                      id="representativeName"
                      value={editForm.representativeName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          representativeName: e.target.value,
                        })
                      }
                      className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080]"
                      placeholder="Nhập tên người đại diện"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="font-bold text-slate-700">Số điện thoại liên hệ</Label>
                    <Input
                      id="phoneNumber"
                      value={editForm.phoneNumber}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phoneNumber: e.target.value })
                      }
                      className="h-11 rounded-xl bg-slate-50 border-slate-200 focus-visible:ring-[#008080] focus-visible:border-[#008080]"
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Tên tổ chức</p>
                    <p className="font-semibold text-slate-800 text-lg">
                      {organization.organizationProfiles?.organizationName ||
                        "Chưa có"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Người đại diện</p>
                    <p className="font-semibold text-slate-800 text-lg">
                      {organization.organizationProfiles?.representativeName ||
                        "Chưa có"}
                    </p>
                  </div>
                  
                  {/* Địa chỉ */}
                  <div className="col-span-1 md:col-span-2 space-y-1 border-t border-slate-100 pt-6">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Quận/Huyện hoạt động</p>
                    <p className="font-semibold text-slate-800 text-lg">
                      {organization.organizationProfiles?.district
                        ? formatDistrict(organization.organizationProfiles.district)
                        : "Chưa có"}
                    </p>
                  </div>
                  <div className="col-span-1 md:col-span-2 space-y-1 mt-2">
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Địa chỉ chi tiết</p>
                    <p className="font-semibold text-slate-800 text-lg">
                      {organization.organizationProfiles?.addressDetail || "Chưa có"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Các chiến dịch gần đây */}
          {organization.campaigns && organization.campaigns.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                <CardTitle className="text-lg font-bold text-slate-800">Các chiến dịch gần đây</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {organization.campaigns.slice(0, 5).map((campaign) => (
                    <div
                      key={campaign.id}
                      className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white hover:border-teal-200 hover:shadow-sm transition-all shadow-sm"
                    >
                      <div className="flex-1 pr-4">
                        <p className="font-bold text-slate-800 truncate">
                          {campaign.title}
                        </p>
                        <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-1">
                          <span className="text-teal-600 font-bold">{campaign.currentVolunteers}</span> / {campaign.maxVolunteers} TNV tham gia
                        </p>
                      </div>
                      <div className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                          campaign.status === "ACTIVE" || campaign.status === "ONGOING"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : campaign.status === "COMPLETED"
                            ? "bg-blue-50 text-blue-600 border border-blue-100"
                            : "bg-slate-50 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {campaign.status === "ONGOING" ? "Đang diễn ra" : campaign.status === "COMPLETED" ? "Đã xong" : campaign.status}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Các bài viết truyền thông gần đây */}
          {organization.communicationPosts &&
            organization.communicationPosts.length > 0 && (
              <Card className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
                  <CardTitle className="text-lg font-bold text-slate-800">Bài viết truyền thông gần đây</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {organization.communicationPosts.slice(0, 5).map((post) => (
                      <div
                        key={post.id}
                        className="flex items-center justify-between p-4 border border-slate-100 rounded-2xl bg-white hover:border-teal-200 hover:shadow-sm transition-all shadow-sm"
                      >
                        <div className="flex-1 pr-4">
                          <p className="font-bold text-slate-800 truncate">{post.title}</p>
                          <p className="text-sm font-medium text-slate-500 mt-1">
                            {formatDate(post.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
        </div>
      </div>
    </div>
  );
}
