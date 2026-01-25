"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAllCampaigns, approveCampaign, type Campaign } from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Breadcrumb from "@/components/Breadcrumb";
import { MdSearch, MdVisibility, MdCheck, MdClose } from "react-icons/md";

export default function CampaignsPage() {
  // State quan ly
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const limit = 10;

  // Fetch data tu API
  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await getAllCampaigns(
        search || undefined,
        undefined, // organizationId
        statusFilter === "all" ? undefined : statusFilter,
        page,
        limit
      );
      // Sắp xếp PENDING lên đầu
      const sortedCampaigns = response.items.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0;
      });
      setCampaigns(sortedCampaigns);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Loi fetch campaigns:", error);
      toast.error("Không thể tải danh sách chiến dịch");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lai khi thay doi filter hoac page
  useEffect(() => {
    fetchCampaigns();
  }, [page, statusFilter]);

  // Xu ly search voi debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchCampaigns();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleApprove = async (id: string, status: "APPROVED" | "REJECTED") => {
    const confirmMessage =
      status === "APPROVED"
        ? "Bạn có chắc chắn muốn duyệt chiến dịch này?"
        : "Bạn có chắc chắn muốn từ chối chiến dịch này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setApprovingId(id);
      const response = await approveCampaign(id, status);
      toast.success(response.message);
      // Refresh list
      await fetchCampaigns();
    } catch (error: any) {
      console.error("Lỗi khi duyệt chiến dịch:", error);
      toast.error(error.response?.data?.message || "Không thể duyệt chiến dịch");
    } finally {
      setApprovingId(null);
    }
  };

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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý chiến dịch" }
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Chiến dịch</h1>
        <p className="text-gray-600 mt-2">Tổng số: {total} chiến dịch</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm theo tiêu đề chiến dịch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="ACTIVE">Đang hoạt động</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="COMPLETED">Đã hoàn thành</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Logo</TableHead>
                <TableHead className="min-w-[250px]">Tiêu đề</TableHead>
                <TableHead>Tổ chức XH</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Số TNV</TableHead>
                <TableHead>Ngày bắt đầu</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008080]"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : campaigns.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-gray-500"
                  >
                    Không tìm thấy chiến dịch
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={
                            campaign.organization.organizationProfiles
                              ?.avatarUrl
                          }
                          alt={
                            campaign.organization.organizationProfiles
                              ?.organizationName || "Org"
                          }
                        />
                        <AvatarFallback className="bg-[#008080] text-white">
                          {campaign.organization.organizationProfiles?.organizationName?.charAt(
                            0
                          ) || "O"}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {campaign.title}
                    </TableCell>
                    <TableCell>
                      {campaign.organization.organizationProfiles
                        ?.organizationName || "Không rõ"}
                    </TableCell>
                    <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">
                          {campaign.currentVolunteers}
                        </span>
                        <span className="text-gray-500">
                          / {campaign.maxVolunteers}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(campaign.startDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {/* Nút Duyệt/Từ chối - chỉ hiện khi PENDING */}
                        {campaign.status === "PENDING" && (
                          <>
                            <Button
                              onClick={() => handleApprove(campaign.id, "APPROVED")}
                              disabled={approvingId === campaign.id}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <MdCheck size={16} />
                            </Button>
                            <Button
                              onClick={() => handleApprove(campaign.id, "REJECTED")}
                              disabled={approvingId === campaign.id}
                              size="sm"
                              variant="destructive"
                            >
                              <MdClose size={16} />
                            </Button>
                          </>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.location.href = `/admin/campaigns/${campaign.id}`;
                          }}
                        >
                          <MdVisibility className="mr-1" />
                          Chi tiết
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-gray-600">
              Trang {page} / {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
