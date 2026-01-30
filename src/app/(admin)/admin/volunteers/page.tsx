"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllVolunteers,
  updateVolunteer,
  issueAdminCertificate,
  createAdminComment,
  getVolunteerComments,
  type Volunteer,
  type VolunteerComment,
} from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Award, MessageSquare, Star, Trash2 } from "lucide-react";

// Enum cac quan trong TPHCM
const DISTRICTS = [
  "Quan_1", "Quan_2", "Quan_3", "Quan_4", "Quan_5", "Quan_6", "Quan_7",
  "Quan_8", "Quan_9", "Quan_10", "Quan_11", "Quan_12",
  "Quan_Binh_Thanh", "Quan_Tan_Binh", "Quan_Tan_Phu", "Quan_Phu_Nhuan",
  "Quan_Binh_Tan", "Quan_Go_Vap", "Quan_Thu_Duc",
  "Huyen_Binh_Chanh", "Huyen_Hoc_Mon", "Huyen_Cu_Chi", "Huyen_Nha_Be", "Huyen_Can_Gio"
];

export default function VolunteersPage() {
  // State quan ly
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Comment Dialog State
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [commentText, setCommentText] = useState("");
  const [commentRating, setCommentRating] = useState<number>(5);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [viewCommentsDialogOpen, setViewCommentsDialogOpen] = useState(false);
  const [volunteerComments, setVolunteerComments] = useState<VolunteerComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  // Certificate Dialog State
  const [certificateDialogOpen, setCertificateDialogOpen] = useState(false);
  const [certificateNotes, setCertificateNotes] = useState("");
  const [issuingCertificate, setIssuingCertificate] = useState(false);

  // Fetch data tu API
  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await getAllVolunteers(
        search || undefined,
        statusFilter === "all" ? undefined : statusFilter,
        districtFilter === "all" ? undefined : districtFilter,
        page,
        limit
      );
      setVolunteers(response.items);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Loi fetch volunteers:", error);
      toast.error("Không thể tải danh sách tình nguyện viên");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lai khi thay doi filter hoac page
  useEffect(() => {
    fetchVolunteers();
  }, [page, statusFilter, districtFilter]);

  // Xu ly search voi debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchVolunteers();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Toggle khoa/mo khoa tai khoan
  const handleToggleStatus = async (volunteer: Volunteer) => {
    try {
      const newStatus = volunteer.status === "ACTIVE" ? "BANNED" : "ACTIVE";
      await updateVolunteer(volunteer.id, { status: newStatus });
      toast.success(
        `Đã ${newStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản thành công`
      );
      fetchVolunteers();
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
    };
    const statusInfo = statusMap[status] || { label: status, className: "" };
    return (
      <Badge className={statusInfo.className} variant="outline">
        {statusInfo.label}
      </Badge>
    );
  };

  // Format ten quan huyen
  const formatDistrict = (district: string) => {
    return district.replace(/_/g, " ");
  };

  // Xu ly mo dialog nhan xet
  const handleOpenCommentDialog = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setCommentText("");
    setCommentRating(5);
    setCommentDialogOpen(true);
  };

  // Xu ly tao nhan xet
  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer || !commentText.trim()) {
      toast.error("Vui lòng nhập nội dung nhận xét");
      return;
    }

    try {
      setSubmittingComment(true);
      await createAdminComment({
        volunteerId: selectedVolunteer.id,
        comment: commentText.trim(),
        rating: commentRating,
      });
      toast.success("Đã tạo nhận xét thành công!");
      setCommentDialogOpen(false);
      setCommentText("");
      setCommentRating(5);
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmittingComment(false);
    }
  };

  // Xu ly xem nhan xet
  const handleViewComments = async (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setViewCommentsDialogOpen(true);
    setLoadingComments(true);
    try {
      const comments = await getVolunteerComments(volunteer.id);
      setVolunteerComments(comments);
    } catch (error: any) {
      toast.error("Lỗi khi tải nhận xét: " + (error.response?.data?.message || error.message));
    } finally {
      setLoadingComments(false);
    }
  };

  // Xu ly mo dialog cap chung nhan
  const handleOpenCertificateDialog = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
    setCertificateNotes("");
    setCertificateDialogOpen(true);
  };

  // Xu ly cap chung nhan
  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVolunteer) return;

    try {
      setIssuingCertificate(true);
      await issueAdminCertificate({
        volunteerId: selectedVolunteer.id,
        notes: certificateNotes.trim() || undefined,
      });
      toast.success("Đã cấp chứng nhận thành công!");
      setCertificateDialogOpen(false);
      setCertificateNotes("");
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setIssuingCertificate(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý tình nguyện viên" }
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý Tình nguyện viên
        </h1>
        <p className="text-gray-600 mt-2">
          Tổng số: {total} tình nguyện viên
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col gap-4">
          {/* Search box */}
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Status filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="ACTIVE">Hoạt động</SelectItem>
                <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                <SelectItem value="BANNED">Đã khóa</SelectItem>
              </SelectContent>
            </Select>

            {/* District filter */}
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Lọc theo quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả quận/huyện</SelectItem>
                {DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district}>
                    {formatDistrict(district)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                Tình nguyện viên
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wide">
                Email
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wide">
                Số điện thoại
              </TableHead>
              <TableHead className="w-[100px] font-medium text-gray-700 text-xs uppercase tracking-wide">
                Điểm
              </TableHead>
              <TableHead className="font-medium text-gray-700 text-xs uppercase tracking-wide">
                Tổ chức XH
              </TableHead>
              <TableHead className="w-[120px] font-medium text-gray-700 text-xs uppercase tracking-wide">
                Trạng thái
              </TableHead>
              <TableHead className="text-right font-medium text-gray-700 text-xs uppercase tracking-wide w-[200px]">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading-row">
                <TableCell colSpan={8} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 border-3 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : volunteers.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell colSpan={8} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        Không tìm thấy tình nguyện viên
                      </p>
                      <p className="text-xs text-gray-500">
                        Thử điều chỉnh tìm kiếm của bạn
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              volunteers.map((volunteer, index) => (
                <TableRow key={volunteer.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="text-sm text-gray-500 font-medium">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
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
                  <TableCell className="text-sm text-gray-600">
                    {volunteer.phoneNumber || "Chưa có"}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-teal-100 text-teal-800">
                      {volunteer.volunteerProfile?.points || 0} điểm
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {volunteer.volunteerProfile?.organization
                      ?.organizationProfiles?.organizationName || "Chưa có"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(volunteer)}
                      disabled={volunteer.status === "PENDING"}
                      className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                        volunteer.status === "PENDING"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:opacity-80"
                      } ${
                        volunteer.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : volunteer.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      title={
                        volunteer.status === "PENDING"
                          ? "Khong the khoa tai khoan dang cho duyet"
                          : volunteer.status === "ACTIVE"
                          ? "Khóa tai khoan"
                          : "Mở khóa tai khoan"
                      }
                    >
                      {volunteer.status === "ACTIVE"
                        ? "Hoạt động"
                        : volunteer.status === "PENDING"
                        ? "Chờ duyệt"
                        : "Đã khóa"}
                    </button>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCommentDialog(volunteer)}
                        className="h-8 text-xs font-medium border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
                        title="Nhận xét TNV"
                      >
                        <MessageSquare className="mr-1.5 w-3.5 h-3.5" />
                        Nhận xét
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCertificateDialog(volunteer)}
                        className="h-8 text-xs font-medium border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white"
                        title="Cấp chứng nhận"
                      >
                        <Award className="mr-1.5 w-3.5 h-3.5" />
                        Chứng nhận
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/admin/volunteers/${volunteer.id}`;
                        }}
                        className="h-8 text-xs font-medium border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                      >
                        <MdVisibility className="mr-1.5 w-3.5 h-3.5" />
                        Chi tiết
                      </Button>
                      <Button
                        variant={
                          volunteer.status === "ACTIVE"
                            ? "destructive"
                            : "default"
                        }
                        size="sm"
                        onClick={() => handleToggleStatus(volunteer)}
                        disabled={volunteer.status === "PENDING"}
                        className={`h-8 text-xs font-medium ${
                          volunteer.status === "BANNED"
                            ? "bg-[#008080] hover:bg-[#006666]"
                            : ""
                        }`}
                        title={
                          volunteer.status === "PENDING"
                            ? "Khong the khoa tai khoan dang cho duyet"
                            : volunteer.status === "ACTIVE"
                            ? "Khóa tai khoan"
                            : "Mở khóa tai khoan"
                        }
                      >
                        {volunteer.status === "ACTIVE" ? (
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

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nhận xét Tình nguyện viên</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateComment} className="space-y-4">
            <div className="space-y-2">
              <Label>Tình nguyện viên</Label>
              <Input
                value={selectedVolunteer?.volunteerProfile?.fullName || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Điểm hiện tại</Label>
              <Input
                value={`${selectedVolunteer?.volunteerProfile?.points || 0} điểm`}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">
                Đánh giá <span className="text-red-600">*</span>
              </Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCommentRating(star)}
                    className="transition-all"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= commentRating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {commentRating}/5 sao
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">
                Nội dung nhận xét <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="comment"
                placeholder="Nhập nội dung nhận xét về tình nguyện viên..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="resize-none"
                required
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-[#008080] hover:bg-[#006666]"
                disabled={submittingComment || !commentText.trim()}
              >
                {submittingComment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang gửi...
                  </>
                ) : (
                  <>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Gửi nhận xét
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCommentDialogOpen(false)}
                disabled={submittingComment}
              >
                Hủy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Certificate Dialog */}
      <Dialog open={certificateDialogOpen} onOpenChange={setCertificateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Cấp chứng nhận cho TNV
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIssueCertificate} className="space-y-4">
            <div className="space-y-2">
              <Label>Tình nguyện viên</Label>
              <Input
                value={selectedVolunteer?.volunteerProfile?.fullName || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={selectedVolunteer?.email || ""}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label>Điểm hiện tại</Label>
              <Input
                value={`${selectedVolunteer?.volunteerProfile?.points || 0} điểm`}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
              <Textarea
                id="notes"
                placeholder="Thêm ghi chú về chứng nhận này..."
                value={certificateNotes}
                onChange={(e) => setCertificateNotes(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
              <p className="font-semibold text-blue-900 mb-1">ℹ️ Lưu ý:</p>
              <ul className="list-disc list-inside text-blue-800 space-y-1">
                <li>Hệ thống sẽ tự động điền tên TNV vào chứng nhận</li>
                <li>Sử dụng mẫu chứng nhận mặc định của BetterUS</li>
                <li>Chứng nhận sẽ được tạo dưới dạng ảnh PNG</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                type="submit"
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                disabled={issuingCertificate}
              >
                {issuingCertificate ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang cấp...
                  </>
                ) : (
                  <>
                    <Award className="mr-2 h-4 w-4" />
                    Cấp chứng nhận
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setCertificateDialogOpen(false)}
                disabled={issuingCertificate}
              >
                Hủy
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 px-1">
          <div className="text-sm text-gray-600">
            Hiển thị <span className="font-medium text-gray-900">{(page - 1) * limit + 1}</span> đến{" "}
            <span className="font-medium text-gray-900">
              {Math.min(page * limit, total)}
            </span> trên {total}
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
  );
}
