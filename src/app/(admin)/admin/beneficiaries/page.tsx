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
    <div className="space-y-8 font-sans pb-10">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
        <Breadcrumb items={[{ label: "Quản lý Người cần giúp đỡ" }]} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Người Cần Giúp Đỡ
          </h1>
          <p className="text-slate-500 font-medium mt-1">Tổng cộng: <span className="text-[#008080] font-bold">{total}</span> hồ sơ trên hệ thống</p>
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
              placeholder="Tìm theo tên, email, số điện thoại"
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
              <TableHead className="w-[60px] font-bold text-slate-500 text-xs uppercase tracking-wider pl-6">
                STT
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Người Cần Giúp Đỡ
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Số Điện Thoại
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Tổ Chức Xã Hội
              </TableHead>
              <TableHead className="w-[120px] font-bold text-slate-500 text-xs uppercase tracking-wider">
                Trạng Thái
              </TableHead>
              <TableHead className="w-[110px] font-bold text-slate-500 text-xs uppercase tracking-wider">
                Ngày Tạo
              </TableHead>
              <TableHead className="text-right font-bold text-slate-500 text-xs uppercase tracking-wider w-[220px] pr-6">
                Thao Tác
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
                  className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors"
                >
                  <TableCell className="text-sm text-slate-500 font-medium pl-6">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#008080]/10 flex items-center justify-center text-[#008080] font-bold text-sm ring-1 ring-[#008080]/20">
                        {(beneficiary.bficiaryProfile?.fullName || "?")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div className="font-bold text-slate-800 text-sm">
                        {beneficiary.bficiaryProfile?.fullName ||
                          "Chưa cập nhật"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {beneficiary.email}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {beneficiary.phoneNumber || "Chưa có"}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {beneficiary.bficiaryProfile?.organization
                      ?.organizationProfiles?.organizationName || "Chưa có"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(beneficiary)}
                      disabled={beneficiary.status === "PENDING"}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider transition-all border ${
                        beneficiary.status === "PENDING"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:shadow-sm"
                      } ${
                        beneficiary.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : beneficiary.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-red-50 text-red-600 border-red-100"
                      }`}
                      title={
                        beneficiary.status === "PENDING"
                          ? "Không thể khóa tài khoản đang chờ duyệt"
                          : beneficiary.status === "ACTIVE"
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"
                      }
                    >
                      {beneficiary.status === "ACTIVE"
                        ? "Hoạt động"
                        : beneficiary.status === "PENDING"
                          ? "Chờ duyệt"
                          : "Đã khóa"}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-500">
                    {formatDate(beneficiary.createdAt)}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/admin/beneficiaries/${beneficiary.id}`;
                        }}
                        className="h-9 px-3 rounded-xl border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-white hover:border-[#008080]/30 shadow-sm transition-all text-xs font-bold"
                      >
                        <MdVisibility className="mr-1.5 w-4 h-4" />
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
                        className={`h-9 px-3 rounded-xl shadow-sm text-xs font-bold transition-all ${
                          beneficiary.status === "BANNED"
                            ? "bg-[#008080] hover:bg-[#00A79D] text-white"
                            : "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                        }`}
                        title={
                          beneficiary.status === "PENDING"
                            ? "Không thể khóa tài khoản đang chờ duyệt"
                            : beneficiary.status === "ACTIVE"
                              ? "Khóa tài khoản"
                              : "Mở khóa tài khoản"
                        }
                      >
                        {beneficiary.status === "ACTIVE" ? (
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
