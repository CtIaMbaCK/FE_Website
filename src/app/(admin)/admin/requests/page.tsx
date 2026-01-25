"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllHelpRequests, approveHelpRequest, type HelpRequest } from "@/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import { MdSearch, MdFilterList, MdVisibility, MdCheck, MdClose } from "react-icons/md";

export default function HelpRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");
  const [activityTypeFilter, setActivityTypeFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllHelpRequests(
        searchTerm || undefined,
        statusFilter || undefined,
        districtFilter || undefined,
        activityTypeFilter || undefined,
        urgencyFilter || undefined,
        currentPage,
        limit
      );
      // Sắp xếp PENDING lên đầu
      const sortedRequests = response.items.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0;
      });
      setRequests(sortedRequests);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải yêu cầu:", error);
      toast.error("Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter, districtFilter, activityTypeFilter, urgencyFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRequests();
  };

  const handleApprove = async (id: string, status: "APPROVED" | "REJECTED") => {
    const confirmMessage =
      status === "APPROVED"
        ? "Bạn có chắc chắn muốn duyệt yêu cầu này?"
        : "Bạn có chắc chắn muốn từ chối yêu cầu này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setApprovingId(id);
      const response = await approveHelpRequest(id, status);
      toast.success(response.message);
      // Refresh list
      await fetchRequests();
    } catch (error: any) {
      console.error("Lỗi khi duyệt yêu cầu:", error);
      toast.error(error.response?.data?.message || "Không thể duyệt yêu cầu");
    } finally {
      setApprovingId(null);
    }
  };

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

  const getUrgencyBadge = (urgency: string) => {
    if (urgency === "CRITICAL") {
      return <Badge className="bg-red-500 text-white">Khẩn cấp</Badge>;
    }
    return <Badge variant="outline">Bình thường</Badge>;
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
    return district.replace("QUAN_", "Quận ");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Quản lý Yêu cầu giúp đỡ" }]} />

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Yêu cầu giúp đỡ</h1>
          <p className="text-gray-500 mt-1">Quản lý tất cả yêu cầu giúp đỡ trong hệ thống</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Tìm kiếm theo tiêu đề, mô tả..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  />
                </div>
              </div>
              <Button type="submit" className="bg-[#008080] hover:bg-[#006666]">
                <MdSearch size={20} />
                Tìm kiếm
              </Button>
            </div>

            <div className="flex gap-4 flex-wrap">
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008080]"
              >
                <option value="">Tất cả trạng thái</option>
                <option value="PENDING">Chờ xử lý</option>
                <option value="APPROVED">Đã duyệt</option>
                <option value="ONGOING">Đang thực hiện</option>
                <option value="COMPLETED">Hoàn thành</option>
                <option value="CANCELLED">Đã hủy</option>
                <option value="REJECTED">Từ chối</option>
              </select>

              <select
                value={activityTypeFilter}
                onChange={(e) => { setActivityTypeFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008080]"
              >
                <option value="">Tất cả loại hoạt động</option>
                <option value="EDUCATION">Giáo dục</option>
                <option value="MEDICAL">Y tế</option>
                <option value="HOUSE_WORK">Công việc nhà</option>
                <option value="TRANSPORT">Đi lại</option>
                <option value="FOOD">Thực phẩm</option>
                <option value="SHELTER">Nơi ở</option>
                <option value="OTHER">Khác</option>
              </select>

              <select
                value={urgencyFilter}
                onChange={(e) => { setUrgencyFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008080]"
              >
                <option value="">Tất cả mức độ</option>
                <option value="STANDARD">Bình thường</option>
                <option value="CRITICAL">Khẩn cấp</option>
              </select>

              <select
                value={districtFilter}
                onChange={(e) => { setDistrictFilter(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#008080]"
              >
                <option value="">Tất cả quận</option>
                <option value="QUAN_1">Quận 1</option>
                <option value="QUAN_3">Quận 3</option>
                <option value="QUAN_4">Quận 4</option>
                <option value="QUAN_5">Quận 5</option>
                <option value="QUAN_6">Quận 6</option>
                <option value="QUAN_7">Quận 7</option>
                <option value="QUAN_8">Quận 8</option>
                <option value="QUAN_10">Quận 10</option>
                <option value="QUAN_11">Quận 11</option>
                <option value="QUAN_12">Quận 12</option>
                <option value="BINH_THANH">Bình Thạnh</option>
                <option value="TAN_BINH">Tân Bình</option>
                <option value="TAN_PHU">Tân Phú</option>
                <option value="PHU_NHUAN">Phú Nhuận</option>
                <option value="GO_VAP">Gò Vấp</option>
                <option value="BINH_TAN">Bình Tân</option>
                <option value="THU_DUC">Thủ Đức</option>
              </select>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="text-sm text-gray-600">
        Tìm thấy <span className="font-semibold">{total}</span> yêu cầu
      </div>

      {/* Requests list */}
      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {request.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap">
                        {getStatusBadge(request.status)}
                        {getUrgencyBadge(request.urgencyLevel)}
                        <Badge variant="outline">{getActivityTypeLabel(request.activityType)}</Badge>
                        <Badge variant="outline">{getDistrictLabel(request.district)}</Badge>
                      </div>
                    </div>
                  </div>

                  {request.description && (
                    <p className="text-gray-600 text-sm line-clamp-2">{request.description}</p>
                  )}

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Người yêu cầu:</span>
                      <span className="ml-2 font-medium">
                        {request.requester.bficiaryProfile?.fullName || request.requester.email}
                      </span>
                    </div>
                    {request.volunteer && (
                      <div>
                        <span className="text-gray-500">Tình nguyện viên:</span>
                        <span className="ml-2 font-medium">
                          {request.volunteer.volunteerProfile?.fullName || request.volunteer.email}
                        </span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span className="ml-2">
                        {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    {request.acceptedAt && (
                      <div>
                        <span className="text-gray-500">Ngày nhận:</span>
                        <span className="ml-2">
                          {new Date(request.acceptedAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {/* Nút Duyệt/Từ chối - chỉ hiện khi PENDING */}
                  {request.status === "PENDING" && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(request.id, "APPROVED")}
                        disabled={approvingId === request.id}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MdCheck size={16} />
                      </Button>
                      <Button
                        onClick={() => handleApprove(request.id, "REJECTED")}
                        disabled={approvingId === request.id}
                        size="sm"
                        variant="destructive"
                      >
                        <MdClose size={16} />
                      </Button>
                    </div>
                  )}

                  <Button
                    onClick={() => router.push(`/admin/requests/${request.id}`)}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <MdVisibility size={18} />
                    Xem chi tiết
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Trước
          </Button>
          <span className="px-4 py-2">
            Trang {currentPage} / {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            variant="outline"
          >
            Sau
          </Button>
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy yêu cầu nào</p>
        </div>
      )}
    </div>
  );
}
