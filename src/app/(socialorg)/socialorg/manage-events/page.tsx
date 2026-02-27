"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdSearch,
  MdChevronLeft,
  MdChevronRight,
  MdAdd,
  MdLocationOn,
} from "react-icons/md";
import { Eye, Pencil, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
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
  autoTransitionCampaigns,
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
    // Gọi ngầm auto-transition để chuyển trạng thái campaign nếu đến ngày bắt đầu/kết thúc
    autoTransitionCampaigns().catch(console.error);
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
    <div className="min-h-screen pb-10">
      {/* Breadcrumb */}
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
          <Breadcrumb
            items={[
              { label: "Quản lý chiến dịch & sự kiện" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Quản lý chiến dịch & sự kiện</h1>
            <p className="text-slate-500 font-medium mt-2">
              Quản lý các chiến dịch và sự kiện từ thiện
            </p>
          </div>
          <Button
            onClick={() => router.push("/socialorg/manage-events/create")}
            className="h-12 px-6 rounded-xl font-bold bg-[#008080] hover:bg-[#00A79D] text-white shadow-sm transition-all flex items-center gap-2"
          >
            <MdAdd className="text-[20px]" />
            Tạo chiến dịch mới
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-6 mb-8 relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-[#008080] group-hover:opacity-30 transition-opacity"></div>
          <div className="flex flex-col md:flex-row items-center gap-4 relative z-10">
            <div className="flex-1 w-full relative">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                placeholder="Tìm kiếm chiến dịch theo tên hoặc mô tả..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-12 h-12 bg-white border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl w-full font-medium shadow-sm transition-all"
              />
            </div>

            <div className="w-full md:w-64">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="h-12 bg-white border-slate-200 hover:border-[#008080] focus:ring-[#008080]/10 rounded-xl w-full font-medium shadow-sm transition-all justify-between"
                  >
                     <div className="flex items-center gap-2 truncate">
                        <MdLocationOn className="text-[#008080] text-lg shrink-0" />
                        <span className="truncate">
                            {selectedDistricts.length === 0
                            ? "Tất cả khu vực"
                            : `Đã chọn ${selectedDistricts.length} khu vực`}
                        </span>
                     </div>
                     <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0 rounded-2xl border-slate-100 shadow-xl overflow-hidden backdrop-blur-3xl bg-white/90">
                  <Command>
                     <CommandInput placeholder="Tìm kiếm quận/huyện..." className="h-11" />
                     <CommandList className="max-h-[300px] overflow-y-auto custom-scrollbar">
                        <CommandEmpty>Không tìm thấy quận/huyện nào.</CommandEmpty>
                        <CommandGroup>
                           {DISTRICTS.map((district) => {
                              const isSelected = selectedDistricts.includes(district.value);
                              return (
                                 <CommandItem
                                    key={district.value}
                                    onSelect={() => toggleDistrict(district.value)}
                                    className="flex items-center gap-2 px-4 py-2 hover:bg-teal-50/50 cursor-pointer"
                                 >
                                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#008080] border-[#008080] text-white' : 'border-slate-300'}`}>
                                       {isSelected && <Check className="h-3.5 w-3.5" />}
                                    </div>
                                    <span className={isSelected ? 'font-bold text-slate-900' : 'text-slate-700'}>{district.label}</span>
                                 </CommandItem>
                              );
                           })}
                        </CommandGroup>
                     </CommandList>
                     {selectedDistricts.length > 0 && (
                        <div className="p-3 border-t border-slate-100 bg-slate-50">
                           <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => { setSelectedDistricts([]); setPage(1); }}
                              className="w-full text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl h-8"
                           >
                              Xóa bộ lọc khu vực
                           </Button>
                        </div>
                     )}
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="w-full md:w-64">
              <Select value={statusFilter} onValueChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}>
                <SelectTrigger className="h-12 bg-white border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl w-full font-medium shadow-sm transition-all">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
                  <SelectItem value="all" className="cursor-pointer">Tất cả trạng thái</SelectItem>
                  {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status.value} value={status.value} className="cursor-pointer">
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-16">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#008080]/20 border-t-[#008080] rounded-full animate-spin"></div>
                  <p className="text-sm text-slate-500 font-bold uppercase tracking-wider">Đang tải dữ liệu...</p>
                </div>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center p-16 text-slate-500 font-medium">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MdSearch className="w-8 h-8 text-slate-400" />
                </div>
                Không tìm thấy chiến dịch nào phù hợp
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100 hover:bg-transparent">
                    <TableHead className="w-[60px] font-bold text-slate-700 uppercase tracking-wider text-xs text-center">
                      STT
                    </TableHead>
                    <TableHead className="w-[280px] font-bold text-slate-700 uppercase tracking-wider text-xs">
                      Tên chiến dịch
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">
                      Thời gian
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">
                      Địa điểm
                    </TableHead>
                    <TableHead className="w-[180px] font-bold text-slate-700 uppercase tracking-wider text-xs">
                      Tình nguyện viên
                    </TableHead>
                    <TableHead className="font-bold text-slate-700 uppercase tracking-wider text-xs">
                      Trạng thái
                    </TableHead>
                    <TableHead className="text-right font-bold text-slate-700 uppercase tracking-wider text-xs">
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
                        className="hover:bg-slate-50/50 transition-colors border-slate-100 group"
                      >
                        <TableCell className="text-center font-bold text-slate-500">
                          {(page - 1) * limit + index + 1}
                        </TableCell>
                        <TableCell
                          className="font-bold text-slate-800 max-w-[280px] truncate group-hover:text-[#008080] transition-colors"
                          title={campaign.title}
                        >
                          {campaign.title}
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium text-sm">
                          <div className="flex flex-col gap-1">
                            <span>{new Date(campaign.startDate).toLocaleDateString("vi-VN")}</span>
                            {campaign.endDate && (
                              <span className="text-xs text-slate-400">
                                đến {new Date(campaign.endDate).toLocaleDateString("vi-VN")}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600 font-medium text-sm">
                          {districtLabel}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-slate-600">
                                {campaign.currentVolunteers} / {campaign.maxVolunteers}
                              </span>
                              <span className="text-[#008080]">{Math.round(percentage)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden shrink-0">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${getProgressColorClass(percentage)}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={`font-bold border-none px-3 py-1 rounded-xl shadow-sm ${statusBadge.color}`}
                          >
                            {statusBadge.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-3 text-xs font-bold text-slate-600 bg-white border-slate-200 hover:bg-slate-50 shadow-sm rounded-xl transition-all"
                              onClick={() => router.push(`/socialorg/manage-events/${campaign.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-9 px-4 text-xs font-bold text-blue-600 bg-blue-50/50 border-blue-100 hover:bg-blue-100 hover:border-blue-200 shadow-sm rounded-xl transition-all disabled:opacity-50"
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
                              className="h-9 px-4 text-xs font-bold text-rose-600 bg-rose-50/50 border-rose-100 hover:bg-rose-100 hover:border-rose-200 shadow-sm rounded-xl transition-all"
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
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4 bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50">
            <span className="text-sm font-bold text-slate-500">
              Hiển thị {(page - 1) * limit + 1} - {Math.min(page * limit, total)} trên tổng số {total}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm"
              >
                <MdChevronLeft className="text-2xl" />
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
                    className={`h-10 w-10 p-0 text-sm font-bold rounded-xl shadow-sm transition-all ${
                      page === pageNum
                        ? "bg-[#008080] hover:bg-[#00A79D] text-white border-transparent"
                        : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
                    }`}
                    variant={page === pageNum ? "default" : "outline"}
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
                className="h-10 w-10 rounded-xl border-slate-200 bg-white hover:bg-slate-50 text-slate-600 shadow-sm"
              >
                <MdChevronRight className="text-2xl" />
              </Button>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem] p-6 border-slate-100 shadow-xl bg-white/90 backdrop-blur-xl">
            <DialogHeader className="mb-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center mb-4 mx-auto">
                <Trash2 className="w-6 h-6 text-rose-500" />
              </div>
              <DialogTitle className="text-xl font-bold text-center text-slate-800">Xác nhận xóa chiến dịch</DialogTitle>
              <DialogDescription className="text-center font-medium text-slate-500 mt-2">
                Bạn có chắc chắn muốn xóa chiến dịch <br/>
                <strong className="text-slate-800">"{campaignToDelete?.title}"</strong>?
                <br />
                <span className="text-rose-500 font-bold mt-4 block p-3 bg-rose-50 rounded-xl text-xs">
                  Lưu ý: Chỉ có thể xóa chiến dịch chưa có tình nguyện viên nào đăng ký.
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-3 sm:gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
                className="w-full sm:w-1/2 h-11 rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-600 shadow-sm"
              >
                Hủy
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="w-full sm:w-1/2 h-11 rounded-xl font-bold bg-rose-500 hover:bg-rose-600 text-white shadow-sm"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Đang xóa...
                  </>
                ) : (
                  "Xóa chiến dịch"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
