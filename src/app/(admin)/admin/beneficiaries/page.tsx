"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllBeneficiaries,
  updateBeneficiary,
  type Beneficiary,
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

export default function BeneficiariesPage() {
  // State quan ly
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch data tu API
  const fetchBeneficiaries = async () => {
    try {
      setLoading(true);
      const response = await getAllBeneficiaries(
        search || undefined,
        statusFilter === "all" ? undefined : statusFilter,
        page,
        limit,
      );
      setBeneficiaries(response.items);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Loi fetch beneficiaries:", error);
      toast.error("Không thể tải danh sách người cần giúp đỡ");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lai khi thay doi filter hoac page
  useEffect(() => {
    fetchBeneficiaries();
  }, [page, statusFilter]);

  // Xu ly search voi debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchBeneficiaries();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Toggle khoa/mo khoa tai khoan
  const handleToggleStatus = async (beneficiary: Beneficiary) => {
    try {
      const newStatus = beneficiary.status === "ACTIVE" ? "BANNED" : "ACTIVE";
      await updateBeneficiary(beneficiary.id, { status: newStatus });
      toast.success(
        `Đã ${newStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản thành công`,
      );
      fetchBeneficiaries();
    } catch (error) {
      console.error("Loi update status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Hien thi badge status voi mau sac
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "Hoạt động", className: "bg-green-100 text-green-800" },
      PENDING: {
        label: "Chờ duyệt",
        className: "bg-yellow-100 text-yellow-800",
      },
      BANNED: { label: "Đã khóa", className: "bg-red-100 text-red-800" },
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
      <Breadcrumb items={[{ label: "Quản lý người cần giúp đỡ" }]} />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý Người cần giúp đỡ
        </h1>
        <p className="text-gray-600 mt-2">Tổng số: {total} người cần giúp đỡ</p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên, email, số điện thoại..."
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
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="BANNED">Đã khóa</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-b border-gray-200">
              <TableHead className="w-[60px] font-medium text-gray-700 text-xs uppercase tracking-wide">
                STT
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wide">
                Người cần giúp đỡ
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wide">
                Email
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wide">
                Số điện thoại
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wide">
                Tổ chức XH
              </TableHead>
              <TableHead className="w-[120px] font-medium text-gray-700 text-xs uppercase tracking-wide">
                Trạng thái
              </TableHead>
              <TableHead className="w-[110px] font-medium text-gray-700 text-xs uppercase tracking-wide">
                Ngày tạo
              </TableHead>
              <TableHead className="text-right font-medium text-gray-700 text-xs uppercase tracking-wide w-[200px]">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading-row">
                <TableCell
                  colSpan={8}
                  className="text-center py-16 bg-gray-50/30"
                >
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
            ) : beneficiaries.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell
                  colSpan={8}
                  className="text-center py-16 bg-gray-50/30"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg
                        className="w-7 h-7 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        Không tìm thấy người cần giúp đỡ
                      </p>
                      <p className="text-xs text-gray-500">
                        Thử điều chỉnh tìm kiếm của bạn
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              beneficiaries.map((beneficiary, index) => (
                <TableRow
                  key={beneficiary.id}
                  className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <TableCell className="text-sm text-gray-500 font-medium">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                        {(beneficiary.bficiaryProfile?.fullName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="font-medium text-gray-900 text-sm">
                        {beneficiary.bficiaryProfile?.fullName ||
                          "Chưa cập nhật"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {beneficiary.email}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {beneficiary.phoneNumber || "Chưa có"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {beneficiary.bficiaryProfile?.organization
                      ?.organizationProfiles?.organizationName || "Chưa có"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(beneficiary)}
                      disabled={beneficiary.status === "PENDING"}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        beneficiary.status === "PENDING"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:opacity-80"
                      } ${
                        beneficiary.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : beneficiary.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                      title={
                        beneficiary.status === "PENDING"
                          ? "Khong the khoa tai khoan dang cho duyet"
                          : beneficiary.status === "ACTIVE"
                            ? "Khóa tai khoan"
                            : "Mở khóa tai khoan"
                      }
                    >
                      {beneficiary.status === "ACTIVE"
                        ? "Hoạt động"
                        : beneficiary.status === "PENDING"
                          ? "Chờ duyệt"
                          : "Đã khóa"}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {formatDate(beneficiary.createdAt)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/admin/beneficiaries/${beneficiary.id}`;
                        }}
                        className="h-8 text-xs font-medium border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      >
                        <MdVisibility className="mr-1.5 w-3.5 h-3.5" />
                        Chi tiết
                      </Button>
                      <Button
                        variant={
                          beneficiary.status === "ACTIVE"
                            ? "destructive"
                            : "default"
                        }
                        size="sm"
                        onClick={() => handleToggleStatus(beneficiary)}
                        disabled={beneficiary.status === "PENDING"}
                        className={`h-8 text-xs font-medium ${
                          beneficiary.status === "BANNED"
                            ? "bg-[#008080] hover:bg-[#006666]"
                            : ""
                        }`}
                        title={
                          beneficiary.status === "PENDING"
                            ? "Khong the khoa tai khoan dang cho duyet"
                            : beneficiary.status === "ACTIVE"
                              ? "Khóa tai khoan"
                              : "Mở khóa tai khoan"
                        }
                      >
                        {beneficiary.status === "ACTIVE" ? (
                          <>
                            <MdLock className="mr-1.5 w-3.5 h-3.5" />
                            Khóa
                          </>
                        ) : (
                          <>
                            <MdLockOpen className="mr-1.5 w-3.5 h-3.5" />
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
        <div className="flex justify-between items-center mt-6 px-1">
          <div className="text-sm text-gray-600">
            Hiển thị{" "}
            <span className="font-medium text-gray-900">
              {(page - 1) * limit + 1}
            </span>{" "}
            đến{" "}
            <span className="font-medium text-gray-900">
              {Math.min(page * limit, total)}
            </span>{" "}
            trên {total}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Trước
            </Button>
            <div className="flex items-center gap-1">
              <span className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md">
                {page}
              </span>
              <span className="text-sm text-gray-500">/ {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
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
