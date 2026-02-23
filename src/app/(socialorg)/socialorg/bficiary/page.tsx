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
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
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
          status: "APPROVED",
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
    const newStatus = currentStatus === "APPROVED" ? "REJECTED" : "APPROVED";

    try {
      await updateMemberStatus(id, newStatus as "PENDING" | "APPROVED" | "REJECTED");
      toast.success("Đã cập nhật trạng thái");

      // Reload data
      const response = await getBeneficiaries({
        search: search || undefined,
        status: "APPROVED",
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
    <div className="space-y-8 font-sans pb-10">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
        <Breadcrumb items={[{ label: "Quản lý Người cần giúp đỡ" }]} />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">
              Người Cần Giúp Đỡ
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Quản lý danh sách người cần giúp đỡ trong tổ chức
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-5 py-2.5 bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100/50 text-teal-700 rounded-xl text-sm font-bold shadow-sm">
            {beneficiaries.length} người
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-[#008080] group-hover:opacity-30 transition-opacity"></div>
        <div className="flex flex-col sm:flex-row gap-4 relative z-10 w-full xl:w-1/2">
          {/* Search box */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm theo tên, email hoặc số điện thoại..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-12 bg-slate-50/50 border-slate-200 rounded-xl h-11 focus-visible:ring-[#008080] focus-visible:ring-offset-0 focus-visible:border-[#008080] transition-colors"
            />
          </div>
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
                Người cần giúp đỡ
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="w-[120px] font-bold text-slate-500 text-xs uppercase tracking-wider">
                Trạng thái
              </TableHead>
              <TableHead className="w-[110px] font-bold text-slate-500 text-xs uppercase tracking-wider">
                Ngày tạo
              </TableHead>
              <TableHead className="text-right font-bold text-slate-500 text-xs uppercase tracking-wider w-[120px] pr-6">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading-row">
                <TableCell colSpan={6} className="text-center py-16 bg-slate-50/30">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#008080]/20 border-t-[#008080] rounded-full animate-spin"></div>
                    <span className="text-sm font-medium text-slate-500">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : beneficiaries.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell colSpan={6} className="text-center py-24 bg-slate-50/30">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-bold text-slate-700">
                        Không tìm thấy người cần giúp đỡ
                      </p>
                      <p className="text-sm text-slate-500 font-medium">
                        Thử điều chỉnh từ khóa tìm kiếm của bạn
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              beneficiaries.map((beneficiary, index) => (
                <TableRow key={beneficiary.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="text-sm text-slate-500 font-bold pl-6">
                    {(page - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#008080] to-teal-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                        {(beneficiary.bficiaryProfile?.fullName || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="font-bold text-slate-800 text-sm group-hover:text-[#008080] transition-colors">
                        {beneficiary.bficiaryProfile?.fullName || "Chưa cập nhật"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 font-medium">
                    {beneficiary.email}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        handleToggleStatus(beneficiary.id, beneficiary.status)
                      }
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm border ${
                        beneficiary.status === "APPROVED"
                          ? "bg-green-50 text-green-700 border-green-200 hover:shadow-green-500/20"
                          : beneficiary.status === "PENDING"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200 hover:shadow-yellow-500/20"
                          : "bg-red-50 text-red-700 border-red-200 hover:shadow-red-500/20"
                      }`}
                    >
                      {STATUS_MAP[beneficiary.status]}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-slate-500 font-medium">
                    {new Date(beneficiary.createdAt).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric"
                    })}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end content-center">
                      <Link href={`/socialorg/bficiary/${beneficiary.id}/edit`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 px-4 text-xs font-bold text-teal-700 hover:text-white bg-teal-50 hover:bg-teal-600 border-teal-200 hover:border-teal-600 transition-all shadow-sm rounded-xl"
                        >
                          Chỉnh sửa
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
        <div className="flex justify-between items-center mt-6 px-2">
          <div className="text-sm font-medium text-slate-500">
            Hiển thị <span className="font-bold text-[#008080]">{(page - 1) * 10 + 1}</span> đến{" "}
            <span className="font-bold text-[#008080]">
              {Math.min(page * 10, beneficiaries.length + (page - 1) * 10)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-10 px-4 rounded-xl font-bold bg-white border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-all disabled:opacity-50"
            >
              Trước
            </Button>
            <div className="flex items-center gap-2 mx-1">
              <span className="w-10 h-10 flex items-center justify-center text-sm font-bold text-white bg-gradient-to-br from-[#008080] to-[#00A79D] shadow-md rounded-xl">
                {page}
              </span>
              <span className="text-sm font-bold text-slate-400">/ {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-10 px-4 rounded-xl font-bold bg-white border-slate-200 text-slate-600 hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 transition-all disabled:opacity-50"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
