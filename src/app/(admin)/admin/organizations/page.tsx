"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllOrganizations,
  updateOrganization,
  type Organization,
} from "@/services/admin.service";
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
import { MdSearch, MdLock, MdLockOpen, MdVisibility } from "react-icons/md";

export default function OrganizationsPage() {
  // State quan ly
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch data tu API
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await getAllOrganizations(
        search || undefined,
        statusFilter === "all" ? undefined : statusFilter,
        page,
        limit
      );
      setOrganizations(response.items);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Loi fetch organizations:", error);
      toast.error("Không thể tải danh sách tổ chức xã hội");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lai khi thay doi filter hoac page
  useEffect(() => {
    fetchOrganizations();
  }, [page, statusFilter]);

  // Xu ly search voi debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchOrganizations();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Toggle khoa/mo khoa tai khoan
  const handleToggleStatus = async (organization: Organization) => {
    try {
      const newStatus = organization.status === "ACTIVE" ? "BANNED" : "ACTIVE";
      await updateOrganization(organization.id, { status: newStatus });
      toast.success(
        `Đã ${newStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản thành công`
      );
      fetchOrganizations();
    } catch (error) {
      console.error("Loi update status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Hien thi badge status voi mau sac
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

  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
        <Breadcrumb items={[{ label: "Quản lý Tổ chức xã hội" }]} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Tổ Chức Xã Hội
          </h1>
          <p className="text-slate-500 font-medium mt-1">Tổng cộng: <span className="text-[#008080] font-bold">{total}</span> tổ chức trên hệ thống</p>
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
              placeholder="Tìm theo tên tổ chức, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-slate-50/50 border-slate-200 rounded-xl h-11 focus-visible:ring-[#008080] focus-visible:ring-offset-0 focus-visible:border-[#008080] transition-colors"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-slate-50/50 border-slate-200 rounded-xl h-11 focus:ring-[#008080] focus:ring-offset-0">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-100 shadow-xl">
              <SelectItem value="all" className="rounded-lg">Tất cả trạng thái</SelectItem>
              <SelectItem value="ACTIVE" className="rounded-lg">Hoạt động</SelectItem>
              <SelectItem value="PENDING" className="rounded-lg">Chờ duyệt</SelectItem>
              <SelectItem value="DENIED" className="rounded-lg">Từ chối</SelectItem>
              <SelectItem value="BANNED" className="rounded-lg">Đã khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50/50">
              <TableHead className="w-[80px] font-bold text-slate-500 text-xs uppercase tracking-wider py-4 pl-6">
                STT
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Tổ Chức Xã Hội
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Người Đại Diện
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Số Điện Thoại
              </TableHead>
              <TableHead className="w-[120px] font-bold text-slate-500 text-xs uppercase tracking-wider">
                Trạng Thái
              </TableHead>
              <TableHead className="text-right font-bold text-slate-500 text-xs uppercase tracking-wider w-[220px] pr-6">
                Thao Tác
              </TableHead>
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
                    <span className="text-sm text-gray-500 font-medium">
                      Đang tải dữ liệu...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : organizations.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell colSpan={7} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        Không tìm thấy tổ chức xã hội
                      </p>
                      <p className="text-xs text-gray-500">
                        Thử điều chỉnh tìm kiếm của bạn
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              organizations.map((organization, index) => (
                <TableRow key={organization.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-sm text-gray-500 font-medium pl-6">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-white shadow-sm rounded-full overflow-hidden">
                        <AvatarImage
                          src={organization.organizationProfiles?.avatarUrl}
                          alt={organization.organizationProfiles?.organizationName || "Org"}
                          className="object-cover w-full h-full"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-semibold text-sm w-full h-full flex items-center justify-center">
                          {organization.organizationProfiles?.organizationName?.charAt(0) || "O"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="font-medium text-gray-900 text-sm">
                        {organization.organizationProfiles?.organizationName || "Chưa có tên"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {organization.organizationProfiles?.representativeName || "Chưa có"}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {organization.email}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {organization.phoneNumber || "Chưa có"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(organization)}
                      disabled={organization.status === "PENDING" || organization.status === "DENIED"}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider inline-flex justify-center transition-all border ${
                        organization.status === "PENDING" || organization.status === "DENIED"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:shadow-sm"
                      } ${
                        organization.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : organization.status === "PENDING"
                            ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                            : organization.status === "DENIED"
                              ? "bg-slate-50 text-slate-600 border-slate-200"
                              : "bg-red-50 text-red-600 border-red-100"
                      }`}
                      title={
                        organization.status === "PENDING" || organization.status === "DENIED"
                          ? "Không thể khóa tài khoản đang chờ/từ chối"
                          : organization.status === "ACTIVE"
                          ? "Khóa tài khoản"
                          : "Mở khóa tài khoản"
                      }
                    >
                      {organization.status === "ACTIVE"
                        ? "Hoạt động"
                        : organization.status === "PENDING"
                        ? "Chờ duyệt"
                        : organization.status === "DENIED"
                        ? "Từ chối"
                        : "Đã khóa"}
                    </button>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2 pr-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/admin/organizations/${organization.id}`;
                        }}
                        className="h-9 px-3 rounded-xl border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-white hover:border-[#008080]/30 shadow-sm transition-all text-xs font-bold"
                      >
                        <MdVisibility className="mr-1.5 w-4 h-4" />
                        Chi tiết
                      </Button>
                      <Button
                        variant={
                          organization.status === "ACTIVE"
                            ? "destructive"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleToggleStatus(organization)}
                        disabled={organization.status === "PENDING" || organization.status === "DENIED"}
                        className={`h-9 px-3 rounded-xl shadow-sm text-xs font-bold transition-all ${
                          organization.status === "ACTIVE"
                            ? "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                            : organization.status === "BANNED"
                            ? "bg-[#008080] hover:bg-[#00A79D] text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                        title={
                          organization.status === "PENDING" || organization.status === "DENIED"
                            ? "Không thể khóa tài khoản đang chờ/từ chối"
                            : organization.status === "ACTIVE"
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"
                        }
                      >
                        {organization.status === "ACTIVE" ? (
                          <>
                            <MdLock className="mr-1.5 w-4 h-4" />
                            Khóa
                          </>
                        ) : (
                          <>
                            <MdLockOpen className="mr-1.5 w-4 h-4" />
                            Mở khóa
                          </>
                        )}
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
            Hiển thị{" "}
            <span className="font-bold text-slate-800">
              {(page - 1) * limit + 1}
            </span>{" "}
            đến{" "}
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
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
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
              <svg
                className="w-4 h-4 ml-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
