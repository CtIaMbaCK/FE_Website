"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  getBeneficiaries,
  updateMemberStatus,
  OrganizationMember,
} from "@/services/organization.service";
import Breadcrumb from "@/components/Breadcrumb";
import { Search } from "lucide-react";
import Link from "next/link";

const STATUS_MAP: Record<string, string> = {
  PENDING: "Chờ duyệt",
  ACTIVE: "Hoạt động",
  DENIED: "Bị từ chối",
  BANNED: "Bị khóa",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  ACTIVE: "bg-green-100 text-green-800",
  DENIED: "bg-red-100 text-red-800",
  BANNED: "bg-gray-100 text-gray-800",
};

export default function BeneficiariesPage() {
  const [beneficiaries, setBeneficiaries] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  // Load beneficiaries
  useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        setLoading(true);
        const response = await getBeneficiaries({
          search: search || undefined,
          page,
          limit: 10,
        });

        setBeneficiaries(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
        toast.error("Lỗi khi tải danh sách: " + errorMessage);
        setBeneficiaries([]);
      } finally {
        setLoading(false);
      }
    };

    loadBeneficiaries();
  }, [page, search]);

  // Toggle status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";

    try {
      await updateMemberStatus(id, newStatus as "PENDING" | "ACTIVE" | "DENIED" | "BANNED");
      toast.success("Đã cập nhật trạng thái");

      // Reload data
      const response = await getBeneficiaries({
        search: search || undefined,
        page,
        limit: 10,
      });
      setBeneficiaries(response.data);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi: " + errorMessage);
    }
  };


  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Quản lý người cần giúp đỡ" },
          ]}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Quản lý Người cần giúp đỡ
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý danh sách người cần giúp đỡ trong tổ chức
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                {beneficiaries.length} người
              </div>
            </div>
          </div>
        </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-5">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10 h-10 border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/10"
              />
            </div>
          </div>
        </div>
      </div>

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
              <TableHead className="w-[120px] font-medium text-gray-700 text-xs uppercase tracking-wide">
                Trạng thái
              </TableHead>
              <TableHead className="w-[110px] font-medium text-gray-700 text-xs uppercase tracking-wide">
                Ngày tạo
              </TableHead>
              <TableHead className="text-right font-medium text-gray-700 text-xs uppercase tracking-wide w-[120px]">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading-row">
                <TableCell colSpan={6} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 border-3 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : beneficiaries.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell colSpan={6} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
                <TableRow key={beneficiary.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-sm text-gray-500 font-medium">
                    {(page - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm">
                        {(beneficiary.bficiaryProfile?.fullName || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="font-medium text-gray-900 text-sm">
                        {beneficiary.bficiaryProfile?.fullName || "Chưa cập nhật"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {beneficiary.email}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        handleToggleStatus(beneficiary.id, beneficiary.status)
                      }
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all hover:opacity-80 ${
                        STATUS_COLORS[beneficiary.status]
                      }`}
                    >
                      {STATUS_MAP[beneficiary.status]}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(beneficiary.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end">
                      <Link href={`/socialorg/bficiary/${beneficiary.id}/edit`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-medium border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                        >
                          <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Sửa
                        </Button>
                      </Link>
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
            Hiển thị <span className="font-medium text-gray-900">{(page - 1) * 10 + 1}</span> đến{" "}
            <span className="font-medium text-gray-900">
              {Math.min(page * 10, beneficiaries.length + (page - 1) * 10)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 px-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
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
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
