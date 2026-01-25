"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdAdd,
} from "react-icons/md";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Breadcrumb from "@/components/Breadcrumb";
import { toast } from "sonner";
import {
  getCampaigns,
  deleteCampaign,
  type Campaign,
  type FilterCampaignDto,
} from "@/services/campaign.service";

const DISTRICTS = [
  { value: "QUAN_1", label: "Quận 1" },
  { value: "QUAN_2", label: "Quận 2" },
  { value: "QUAN_3", label: "Quận 3" },
  { value: "QUAN_4", label: "Quận 4" },
  { value: "QUAN_5", label: "Quận 5" },
  { value: "QUAN_6", label: "Quận 6" },
  { value: "QUAN_7", label: "Quận 7" },
  { value: "QUAN_8", label: "Quận 8" },
  { value: "QUAN_9", label: "Quận 9" },
  { value: "QUAN_10", label: "Quận 10" },
  { value: "QUAN_11", label: "Quận 11" },
  { value: "QUAN_12", label: "Quận 12" },
  { value: "BINH_THANH", label: "Bình Thạnh" },
  { value: "TAN_BINH", label: "Tân Bình" },
  { value: "TAN_PHU", label: "Tân Phú" },
  { value: "PHU_NHUAN", label: "Phú Nhuận" },
  { value: "GO_VAP", label: "Gò Vấp" },
  { value: "BINH_TAN", label: "Bình Tân" },
  { value: "THU_DUC", label: "Thủ Đức" },
];

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
  { value: "APPROVED", label: "Đã duyệt", color: "bg-blue-100 text-blue-800" },
  { value: "REJECTED", label: "Từ chối", color: "bg-red-100 text-red-800" },
  { value: "ONGOING", label: "Đang diễn ra", color: "bg-green-100 text-green-800" },
  { value: "COMPLETED", label: "Đã hoàn thành", color: "bg-gray-100 text-gray-800" },
  { value: "CANCELLED", label: "Đã hủy", color: "bg-red-100 text-red-800" },
];

const getStatusBadge = (status: string) => {
  const statusOption = STATUS_OPTIONS.find((s) => s.value === status);
  return statusOption || { label: status, color: "bg-gray-100 text-gray-800" };
};

const getProgressColorClass = (percentage: number) => {
  if (percentage >= 100) return "bg-green-500";
  if (percentage >= 50) return "bg-yellow-500";
  return "bg-red-500";
};

export default function ManageCampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCampaigns();
  }, [page, statusFilter, selectedDistricts, searchTerm]);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const filters: FilterCampaignDto = {
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter !== "all" ? [statusFilter] : undefined,
        districts: selectedDistricts.length > 0 ? selectedDistricts : undefined,
      };

      const response = await getCampaigns(filters);
      setCampaigns(response.data || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(Math.ceil((response.meta?.total || 0) / limit));
    } catch (error: any) {
      toast.error("Lỗi khi tải danh sách chiến dịch: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const toggleDistrict = (district: string) => {
    setSelectedDistricts((prev) => {
      const newSelection = prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district];
      return newSelection;
    });
    setPage(1);
  };

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return;

    try {
      setDeleting(true);
      await deleteCampaign(campaignToDelete.id);
      toast.success("Đã xóa chiến dịch thành công");
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
      loadCampaigns();
    } catch (error: any) {
      toast.error("Lỗi khi xóa chiến dịch: " + (error.response?.data?.message || error.message));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="pb-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý chiến dịch & sự kiện" },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý chiến dịch & sự kiện</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý các chiến dịch và sự kiện từ thiện
          </p>
        </div>
        <Button
          onClick={() => router.push("/socialorg/manage-events/create")}
          className="gap-2 bg-teal-600 text-white hover:bg-teal-700 shadow-sm"
        >
          <MdAdd className="text-[20px]" />
          Tạo chiến dịch mới
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* Search & Status on same row */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex-1 w-full relative">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm chiến dịch theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-10 border-gray-200 focus:border-teal-500 focus:ring-teal-500/10"
              />
            </div>
            <div className="w-full sm:w-64">
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}>
                <SelectTrigger className="h-10 bg-white border-gray-300">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                className="text-xs text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1"
              >
                <span>Xóa lọc ({selectedDistricts.length})</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {DISTRICTS.map((district) => (
              <button
                key={district.value}
                onClick={() => toggleDistrict(district.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  selectedDistricts.includes(district.value)
                    ? "bg-teal-600 text-white shadow-sm ring-1 ring-teal-600"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                }`}
              >
                {district.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute inset-0 w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-sm text-gray-600 font-medium">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : campaigns.length === 0 ? (
            <div className="text-center p-12 text-gray-500">
              Không tìm thấy chiến dịch nào
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="w-[50px] font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs text-center">
                    STT
                  </TableHead>
                  <TableHead className="w-[250px] font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs">
                    Tên chiến dịch
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs">
                    Thời gian
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs">
                    Địa điểm
                  </TableHead>
                  <TableHead className="w-[200px] font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs">
                    Tình nguyện viên
                  </TableHead>
                  <TableHead className="font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs">
                    Trạng thái
                  </TableHead>
                  <TableHead className="text-right font-semibold text-gray-700 dark:text-gray-300 uppercase text-xs">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign, index) => {
                  const percentage = (campaign.currentVolunteers / campaign.maxVolunteers) * 100;
                  const statusBadge = getStatusBadge(campaign.status);
                  const districtLabel = DISTRICTS.find((d) => d.value === campaign.district)?.label || campaign.district;

                  return (
                    <TableRow
                      key={campaign.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
                    >
                      <TableCell className="text-center font-medium text-gray-600 dark:text-gray-400">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell
                        className="font-medium text-gray-900 dark:text-white max-w-[250px] truncate"
                        title={campaign.title}
                      >
                        {campaign.title}
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300 text-sm">
                        <div>
                          {new Date(campaign.startDate).toLocaleDateString("vi-VN")}
                          {campaign.endDate && (
                            <>
                              {" - "}
                              {new Date(campaign.endDate).toLocaleDateString("vi-VN")}
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600 dark:text-gray-300 text-sm">
                        {districtLabel}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span>
                              {campaign.currentVolunteers}/{campaign.maxVolunteers}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getProgressColorClass(percentage)}`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`font-medium border-none px-2.5 py-0.5 rounded-full ${statusBadge.color}`}
                        >
                          {statusBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium text-teal-700 border-teal-200 hover:bg-teal-50 hover:text-teal-800 hover:border-teal-300"
                            onClick={() => router.push(`/socialorg/manage-events/${campaign.id}`)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                            
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() =>
                              router.push(`/socialorg/manage-events/${campaign.id}/edit`)
                            }
                            disabled={campaign.status === "ONGOING" || campaign.status === "COMPLETED"}
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
                            onClick={() => handleDeleteClick(campaign)}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Hiển thị {(page - 1) * limit + 1}-
            {Math.min(page * limit, total)} trên {total} chiến dịch
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="h-9 w-9 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MdChevronLeft className="text-xl" />
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`h-8 w-8 p-0 text-sm rounded-lg ${
                    page === pageNum
                      ? "bg-teal-600 hover:bg-teal-700 text-white font-bold"
                      : "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700"
                  }`}
                  variant={page === pageNum ? "default" : "ghost"}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="icon"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="h-9 w-9 border-none bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <MdChevronRight className="text-xl" />
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa chiến dịch</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa chiến dịch "<strong>{campaignToDelete?.title}</strong>"?
              <br />
              <span className="text-red-600 font-medium mt-2 block">
                Lưu ý: Chỉ có thể xóa chiến dịch chưa có tình nguyện viên nào đăng ký.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
