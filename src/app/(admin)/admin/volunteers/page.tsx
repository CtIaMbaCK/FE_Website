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
    const districtMap: Record<string, string> = {
      Quan_1: "Quận 1",
      Quan_2: "Quận 2",
      Quan_3: "Quận 3",
      Quan_4: "Quận 4",
      Quan_5: "Quận 5",
      Quan_6: "Quận 6",
      Quan_7: "Quận 7",
      Quan_8: "Quận 8",
      Quan_9: "Quận 9",
      Quan_10: "Quận 10",
      Quan_11: "Quận 11",
      Quan_12: "Quận 12",
      Quan_Binh_Thanh: "Quận Bình Thạnh",
      Quan_Tan_Binh: "Quận Tân Bình",
      Quan_Tan_Phu: "Quận Tân Phú",
      Quan_Phu_Nhuan: "Quận Phú Nhuận",
      Quan_Binh_Tan: "Quận Bình Tân",
      Quan_Go_Vap: "Quận Gò Vấp",
      Quan_Thu_Duc: "TP Thủ Đức",
      Huyen_Binh_Chanh: "Huyện Bình Chánh",
      Huyen_Hoc_Mon: "Huyện Hóc Môn",
      Huyen_Cu_Chi: "Huyện Củ Chi",
      Huyen_Nha_Be: "Huyện Nhà Bè",
      Huyen_Can_Gio: "Huyện Cần Giờ",
    };
    return districtMap[district] || district.replace(/_/g, " ");
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
    <div className="space-y-8 font-sans pb-10">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
        <Breadcrumb items={[{ label: "Quản lý Tình nguyện viên" }]} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            Tình Nguyện Viên
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
              placeholder="Tìm theo tên, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-12 bg-slate-50/50 border-slate-200 rounded-xl h-11 focus-visible:ring-[#008080] focus-visible:ring-offset-0 focus-visible:border-[#008080] transition-colors"
            />
          </div>

          {/* Filters row */}
          <div className="flex flex-col sm:flex-row gap-4">
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

            {/* District filter */}
            <Select value={districtFilter} onValueChange={setDistrictFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-slate-50/50 border-slate-200 rounded-xl h-11 focus:ring-[#008080] focus:ring-offset-0">
                <SelectValue placeholder="Lọc quận/huyện" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                <SelectItem value="all" className="rounded-lg">Tất cả quận/huyện</SelectItem>
                {DISTRICTS.map((district) => (
                  <SelectItem key={district} value={district} className="rounded-lg">
                    {formatDistrict(district)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50/50">
              <TableHead className="w-[60px] font-bold text-slate-500 text-xs uppercase tracking-wider py-4 pl-6">
                STT
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Tình Nguyện Viên
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Email
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Số Điện Thoại
              </TableHead>
              <TableHead className="w-[100px] font-bold text-slate-500 text-xs uppercase tracking-wider">
                Điểm
              </TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                Tổ Chức Xã Hội
              </TableHead>
              <TableHead className="w-[120px] font-bold text-slate-500 text-xs uppercase tracking-wider">
                Trạng Thái
              </TableHead>
              <TableHead className="text-right font-bold text-slate-500 text-xs uppercase tracking-wider w-[240px] pr-6">
                Thao Tác
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
                  <TableCell className="text-sm font-medium text-slate-600">
                    {volunteer.email}
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {volunteer.phoneNumber || "Chưa có"}
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold ring-1 ring-amber-200">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      {volunteer.volunteerProfile?.points || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {volunteer.volunteerProfile?.organization
                      ?.organizationProfiles?.organizationName || "Chưa có"}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleStatus(volunteer)}
                      disabled={volunteer.status === "PENDING"}
                      className={`px-3 py-1.5 rounded-xl text-[11px] font-bold uppercase tracking-wider inline-flex justify-center transition-all border ${
                        volunteer.status === "PENDING"
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:shadow-sm"
                      } ${
                        volunteer.status === "ACTIVE"
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                          : volunteer.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : "bg-red-50 text-red-600 border-red-100"
                      }`}
                      title={
                        volunteer.status === "PENDING"
                          ? "Không thể khóa tài khoản đang chờ duyệt"
                          : volunteer.status === "ACTIVE"
                          ? "Khóa tài khoản"
                          : "Mở khóa tài khoản"
                      }
                    >
                      {volunteer.status === "ACTIVE"
                        ? "Hoạt động"
                        : volunteer.status === "PENDING"
                        ? "Chờ duyệt"
                        : "Đã khóa"}
                    </button>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2 pr-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCommentDialog(volunteer)}
                        className="h-9 px-3 rounded-xl border-slate-200 text-teal-600 hover:text-teal-700 hover:bg-teal-50 hover:border-teal-200 shadow-sm transition-all text-xs font-bold"
                        title="Nhận xét TNV"
                      >
                        <MessageSquare className="mr-1.5 w-4 h-4" />
                        Nhận xét
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenCertificateDialog(volunteer)}
                        className="h-9 px-3 rounded-xl border-slate-200 text-amber-600 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-200 shadow-sm transition-all text-xs font-bold"
                        title="Cấp chứng nhận"
                      >
                        <Award className="mr-1.5 w-4 h-4" />
                        Chứng nhận
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/admin/volunteers/${volunteer.id}`;
                        }}
                        className="h-9 px-3 rounded-xl border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-white hover:border-[#008080]/30 shadow-sm transition-all text-xs font-bold"
                      >
                        <MdVisibility className="mr-1.5 w-4 h-4" />
                        Chi tiết
                      </Button>
                      <Button
                        variant={
                          volunteer.status === "ACTIVE"
                            ? "destructive"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handleToggleStatus(volunteer)}
                        disabled={volunteer.status === "PENDING"}
                        className={`h-9 px-3 rounded-xl shadow-sm text-xs font-bold transition-all ${
                          volunteer.status === "ACTIVE"
                            ? "bg-white border border-red-200 text-red-600 hover:bg-red-50"
                            : volunteer.status === "BANNED"
                            ? "bg-[#008080] hover:bg-[#00A79D] text-white"
                            : "bg-slate-100 text-slate-400"
                        }`}
                        title={
                          volunteer.status === "PENDING"
                            ? "Không thể khóa tài khoản đang chờ duyệt"
                            : volunteer.status === "ACTIVE"
                            ? "Khóa tài khoản"
                            : "Mở khóa tài khoản"
                        }
                      >
                        {volunteer.status === "ACTIVE" ? (
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

      {/* Comment Dialog */}
      <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
        <DialogContent className="sm:max-w-lg rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#008080] to-teal-500">Nhận xét Tình nguyện viên</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateComment} className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label className="text-slate-600 font-medium">Tình nguyện viên</Label>
              <Input
                value={selectedVolunteer?.volunteerProfile?.fullName || ""}
                disabled
                className="bg-slate-50 border-slate-200 rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 font-medium">Điểm hiện tại</Label>
              <Input
                value={`${selectedVolunteer?.volunteerProfile?.points || 0} điểm`}
                disabled
                className="bg-slate-50 border-slate-200 rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating" className="text-slate-600 font-medium">
                Đánh giá <span className="text-red-600">*</span>
              </Label>
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setCommentRating(star)}
                    className="transition-all hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        star <= commentRating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm font-bold text-slate-700 bg-white px-3 py-1 rounded-full shadow-sm">
                  {commentRating}/5 sao
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="text-slate-600 font-medium">
                Nội dung nhận xét <span className="text-red-600">*</span>
              </Label>
              <Textarea
                id="comment"
                placeholder="Nhập nội dung nhận xét về tình nguyện viên..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                rows={4}
                className="resize-none border-slate-200 rounded-xl focus:border-[#008080] focus:ring-[#008080]/20"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#008080] to-teal-500 hover:from-[#006666] hover:to-[#008080] text-white rounded-xl h-12 font-bold shadow-md hover:shadow-lg transition-all"
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
                className="rounded-xl h-12 px-6 font-bold border-slate-200 hover:bg-slate-50 text-slate-600"
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
        <DialogContent className="sm:max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-400">
              <Award className="w-6 h-6 text-amber-500" />
              Cấp chứng nhận cho TNV
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleIssueCertificate} className="space-y-5 mt-2">
            <div className="space-y-2">
              <Label className="text-slate-600 font-medium">Tình nguyện viên</Label>
              <Input
                value={selectedVolunteer?.volunteerProfile?.fullName || ""}
                disabled
                className="bg-slate-50 border-slate-200 rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 font-medium">Email</Label>
              <Input
                value={selectedVolunteer?.email || ""}
                disabled
                className="bg-slate-50 border-slate-200 rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-600 font-medium">Điểm hiện tại</Label>
              <Input
                value={`${selectedVolunteer?.volunteerProfile?.points || 0} điểm`}
                disabled
                className="bg-slate-50 border-slate-200 rounded-xl h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-slate-600 font-medium">Ghi chú (tùy chọn)</Label>
              <Textarea
                id="notes"
                placeholder="Thêm ghi chú về chứng nhận này..."
                value={certificateNotes}
                onChange={(e) => setCertificateNotes(e.target.value)}
                rows={3}
                className="resize-none border-slate-200 rounded-xl focus:border-amber-500 focus:ring-amber-500/20"
              />
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
              <p className="font-bold text-amber-800 mb-1 flex items-center gap-1">
                <Star className="w-4 h-4" /> Lưu ý:
              </p>
              <ul className="list-disc list-inside text-amber-700/80 space-y-1 font-medium ml-1">
                <li>Hệ thống tự động dùng tên TNV</li>
                <li>Sử dụng mẫu chứng nhận mặc định BetterUS</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl h-12 font-bold shadow-md hover:shadow-lg transition-all"
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
                className="rounded-xl h-12 px-6 font-bold border-slate-200 hover:bg-slate-50 text-slate-600"
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
