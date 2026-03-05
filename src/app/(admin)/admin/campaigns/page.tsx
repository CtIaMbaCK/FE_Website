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
import { MdSearch, MdVisibility, MdCheck, MdClose, MdCampaign } from "react-icons/md";

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
    <div className="space-y-8 font-sans pb-10">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center">
        <Breadcrumb items={[{ label: "Quản lý chiến dịch" }]} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Chiến Dịch</h1>
          <p className="text-slate-500 font-medium mt-1">Tổng cộng: <span className="text-[#008080] font-bold">{total}</span> chiến dịch</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-[#008080] group-hover:opacity-30 transition-opacity"></div>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full xl:w-2/3">
          {/* Search box */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl" />
            <Input
              placeholder="Tìm kiếm theo tiêu đề chiến dịch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-slate-50/50 border-slate-200 rounded-xl h-11 focus-visible:ring-[#008080] focus-visible:ring-offset-0 focus-visible:border-[#008080] transition-colors"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-slate-50/50 border-slate-200 rounded-xl h-11 focus:ring-[#008080] focus:ring-offset-0">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="all" className="rounded-lg">Tất cả trạng thái</SelectItem>
              <SelectItem value="ONGOING" className="rounded-lg">Đang thực hiện</SelectItem>
              <SelectItem value="PENDING" className="rounded-lg">Chờ duyệt</SelectItem>
              <SelectItem value="COMPLETED" className="rounded-lg">Đã hoàn thành</SelectItem>
              <SelectItem value="CANCELLED" className="rounded-lg">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50/50">
              <TableHead className="w-[80px] font-bold text-slate-500 text-xs uppercase tracking-wider py-4 pl-6">Logo</TableHead>
              <TableHead className="min-w-[250px] font-bold text-slate-500 text-xs uppercase tracking-wider">Tiêu đề</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Tổ Chức Xã Hội</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Trạng thái</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Số TNV</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Ngày bắt đầu</TableHead>
              <TableHead className="text-right font-bold text-slate-500 text-xs uppercase tracking-wider pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading-row">
                <TableCell colSpan={7} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 border-3 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : campaigns.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell colSpan={7} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <MdCampaign className="w-7 h-7 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        Không tìm thấy chiến dịch
                      </p>
                      <p className="text-xs text-gray-500">
                        Thử điều chỉnh tìm kiếm của bạn
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((campaign) => (
                <TableRow key={campaign.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6">
                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={campaign.organization.organizationProfiles?.avatarUrl}
                        alt={campaign.organization.organizationProfiles?.organizationName || "Org"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-sm">
                        {campaign.organization.organizationProfiles?.organizationName?.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-800 text-sm line-clamp-2">
                       {campaign.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {campaign.organization.organizationProfiles?.organizationName || "Không rõ"}
                  </TableCell>
                  <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold ring-1 ring-amber-200">
                      <MdCampaign className="text-amber-500" />
                      <span>{campaign.currentVolunteers}</span>
                      <span className="text-amber-400 font-normal">/ {campaign.maxVolunteers}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-500">
                     {formatDate(campaign.startDate)}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2 pr-2">
                      {campaign.status === "PENDING" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(campaign.id, "APPROVED")}
                            disabled={approvingId === campaign.id}
                            className="h-9 px-3 rounded-xl border-slate-200 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 hover:border-emerald-200 shadow-sm transition-all text-xs font-bold"
                            title="Duyệt"
                          >
                            <MdCheck className="w-5 h-5 mr-1" /> Duyệt
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(campaign.id, "REJECTED")}
                            disabled={approvingId === campaign.id}
                            className="h-9 px-3 rounded-xl border-slate-200 text-red-600 hover:text-red-700 hover:bg-red-50 hover:border-red-200 shadow-sm transition-all text-xs font-bold"
                            title="Từ chối"
                          >
                            <MdClose className="w-5 h-5 mr-1" /> Từ chối
                          </Button>
                        </>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/admin/campaigns/${campaign.id}`;
                        }}
                        className="h-9 px-3 rounded-xl border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-white hover:border-[#008080]/30 shadow-sm transition-all text-xs font-bold"
                      >
                        <MdVisibility className="mr-1.5 w-4 h-4" />
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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2">
          <div className="text-sm text-slate-500 font-medium">
            Hiển thị chiến dịch {" "}
            <span className="font-bold text-slate-800">
              {(page - 1) * limit + 1}
            </span>{" "}
            đến {" "}
            <span className="font-bold text-slate-800">
              {Math.min(page * limit, total)}
            </span>{" "}
            trên <span className="font-bold text-slate-800">{total}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-10 px-4 rounded-xl border-transparent bg-transparent hover:bg-slate-100 text-slate-600 disabled:opacity-40 font-bold transition-colors"
            >
              Trước
            </Button>
            <div className="flex items-center">
              <span className="w-10 h-10 flex items-center justify-center text-sm font-black text-white bg-[#008080] rounded-xl shadow-md">
                {page}
              </span>
              <span className="px-3 text-sm font-bold text-slate-400">/ {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-10 px-4 rounded-xl border-transparent bg-transparent hover:bg-slate-100 text-slate-600 disabled:opacity-40 font-bold transition-colors"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
