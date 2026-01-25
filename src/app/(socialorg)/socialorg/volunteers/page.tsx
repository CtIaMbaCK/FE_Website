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
  getVolunteers,
  updateMemberStatus,
  OrganizationMember,
} from "@/services/organization.service";
import VolunteerCommentDialog from "@/components/VolunteerCommentDialog";
import CertificateIssueDialog from "@/components/CertificateIssueDialog";
import Breadcrumb from "@/components/Breadcrumb";
import { Search } from "lucide-react";
import Link from "next/link";

// Danh sách quận TP.HCM
const DISTRICTS = [
  "QUAN_1",
  "QUAN_3",
  "QUAN_4",
  "QUAN_5",
  "QUAN_6",
  "QUAN_7",
  "QUAN_8",
  "QUAN_10",
  "QUAN_11",
  "QUAN_12",
  "BINH_TAN",
  "BINH_THANH",
  "GO_VAP",
  "PHU_NHUAN",
  "TAN_BINH",
  "TAN_PHU",
  "TP_THU_DUC",
];

const DISTRICT_NAMES: Record<string, string> = {
  QUAN_1: "Quận 1",
  QUAN_3: "Quận 3",
  QUAN_4: "Quận 4",
  QUAN_5: "Quận 5",
  QUAN_6: "Quận 6",
  QUAN_7: "Quận 7",
  QUAN_8: "Quận 8",
  QUAN_10: "Quận 10",
  QUAN_11: "Quận 11",
  QUAN_12: "Quận 12",
  BINH_TAN: "Bình Tân",
  BINH_THANH: "Bình Thạnh",
  GO_VAP: "Gò Vấp",
  PHU_NHUAN: "Phú Nhuận",
  TAN_BINH: "Tân Bình",
  TAN_PHU: "Tân Phú",
  TP_THU_DUC: "TP Thủ Đức",
};

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

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Comment dialog state
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] =
    useState<OrganizationMember | null>(null);

  // Certificate dialog state
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [selectedVolunteerForCert, setSelectedVolunteerForCert] =
    useState<OrganizationMember | null>(null);


  // Load volunteers
  useEffect(() => {
    const loadVolunteers = async () => {
      try {
        setLoading(true);
        const response = await getVolunteers({
          search: search || undefined,
          districts:
            selectedDistricts.length > 0 ? selectedDistricts : undefined,
          page,
          limit: 10,
        });
        setVolunteers(response.data);
        setTotalPages(response.meta.totalPages);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Đã xảy ra lỗi";
        toast.error("Lỗi khi tải danh sách: " + errorMessage);
        setVolunteers([]);
      } finally {
        setLoading(false);
      }
    };

    loadVolunteers();
  }, [page, search, selectedDistricts]);

  // Toggle status
  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "ACTIVE" ? "BANNED" : "ACTIVE";

    try {
      await updateMemberStatus(
        id,
        newStatus as "PENDING" | "ACTIVE" | "DENIED" | "BANNED"
      );
      toast.success("Đã cập nhật trạng thái");

      // Reload data
      const response = await getVolunteers({
        search: search || undefined,
        districts: selectedDistricts.length > 0 ? selectedDistricts : undefined,
        page,
        limit: 10,
      });
      setVolunteers(response.data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi: " + errorMessage);
    }
  };

  // Toggle district selection
  const toggleDistrict = (district: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
    setPage(1); // Reset về trang 1 khi filter
  };

  // Open comment dialog
  const openCommentDialog = (volunteer: OrganizationMember) => {
    setSelectedVolunteer(volunteer);
    setCommentDialogOpen(true);
  };

  // Open certificate dialog
  const openCertificateDialog = (volunteer: OrganizationMember) => {
    setSelectedVolunteerForCert(volunteer);
    setCertificateDialogOpen(true);
  };


  return (
    <div className="min-h-screen pb-10">
      <div className="mx-auto px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Quản lý tình nguyện viên" },
          ]}
        />
      </div>

      <div className="mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Tình nguyện viên
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Quản lý danh sách tình nguyện viên trong tổ chức
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                {volunteers.length} tình nguyện viên
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-5 border-b border-gray-100">
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
                className="pl-10 h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500/10"
              />
            </div>
          </div>
        </div>

        {/* District Filter */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              Lọc theo khu vực
            </label>
            {selectedDistricts.length > 0 && (
              <button
                onClick={() => setSelectedDistricts([])}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                <span>Xóa lọc ({selectedDistricts.length})</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {DISTRICTS.map((district) => (
              <button
                key={district}
                onClick={() => toggleDistrict(district)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedDistricts.includes(district)
                    ? "bg-blue-600 text-white shadow-sm ring-1 ring-blue-600"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {DISTRICT_NAMES[district]}
              </button>
            ))}
          </div>
        </div>
      </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50 border-b border-gray-200">
              <TableHead className="w-[60px] font-bold text-gray-700 text-md uppercase tracking-wide">
                STT
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-md uppercase tracking-wide">
                Tình nguyện viên
              </TableHead>
              <TableHead className="font-bold text-gray-700 text-md uppercase tracking-wide">
                Email
              </TableHead>
              <TableHead className="w-[100px] font-bold text-gray-700 text-md uppercase tracking-wide">
                Điểm
              </TableHead>
              <TableHead className="w-[120px] font-bold text-gray-700 text-md uppercase tracking-wide">
                Trạng thái
              </TableHead>
              <TableHead className="w-[110px] font-bold text-gray-700 text-md uppercase tracking-wide">
                Ngày tạo
              </TableHead>
              <TableHead className="text-right font-bold text-gray-700 text-md uppercase tracking-wide w-[360px]">
                Thao tác
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
                      <div className="absolute inset-0 w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : volunteers.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell
                  colSpan={7}
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
                        Không tìm thấy tình nguyện viên
                      </p>
                      <p className="text-xs text-gray-500">
                        Thử điều chỉnh bộ lọc hoặc tìm kiếm của bạn
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              volunteers.map((volunteer, index) => (
                <TableRow key={volunteer.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-sm text-gray-500 font-medium">
                    {(page - 1) * 10 + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {(volunteer.volunteerProfile?.fullName || "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="font-medium text-gray-900 text-sm">
                        {volunteer.volunteerProfile?.fullName || "Chưa cập nhật"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {volunteer.email}
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      {volunteer.volunteerProfile?.points || 0}
                    </div>
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        handleToggleStatus(volunteer.id, volunteer.status)
                      }
                      className={`px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer transition-all hover:opacity-80 ${
                        STATUS_COLORS[volunteer.status]
                      }`}
                    >
                      {STATUS_MAP[volunteer.status]}
                    </button>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500">
                    {new Date(volunteer.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Link href={`/socialorg/volunteers/${volunteer.id}/edit`}>
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

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCommentDialog(volunteer)}
                        className="h-8 text-xs font-medium text-amber-700 border-amber-200 hover:bg-amber-50 hover:border-amber-300"
                      >
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Nhận xét
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openCertificateDialog(volunteer)}
                        className="h-8 text-xs font-medium text-blue-700 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                      >
                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Chứng nhận
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
            Hiển thị <span className="font-medium text-gray-900">{(page - 1) * 10 + 1}</span> đến{" "}
            <span className="font-medium text-gray-900">
              {Math.min(page * 10, volunteers.length + (page - 1) * 10)}
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

      {/* Comment Dialog */}
      {selectedVolunteer && (
        <VolunteerCommentDialog
          open={commentDialogOpen}
          onOpenChange={setCommentDialogOpen}
          volunteerId={selectedVolunteer.id}
          volunteerName={
            selectedVolunteer.volunteerProfile?.fullName || "Tình nguyện viên"
          }
        />
      )}

      {/* Certificate Dialog */}
      {selectedVolunteerForCert && (
        <CertificateIssueDialog
          open={certificateDialogOpen}
          onOpenChange={setCertificateDialogOpen}
          volunteerId={selectedVolunteerForCert.id}
          volunteerName={
            selectedVolunteerForCert.volunteerProfile?.fullName || "Tình nguyện viên"
          }
        />
      )}
    </div>
  );
}
