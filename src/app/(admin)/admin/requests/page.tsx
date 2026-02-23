"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllHelpRequests, approveHelpRequest, type HelpRequest } from "@/services/admin.service";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import { MdSearch, MdFilterList, MdVisibility, MdCheck, MdClose, MdLocationOn } from "react-icons/md";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

export default function HelpRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<HelpRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState<string[]>([]);
  const [activityTypeFilter, setActivityTypeFilter] = useState("");
  const [urgencyFilter, setUrgencyFilter] = useState("");
  const [approvingId, setApprovingId] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await getAllHelpRequests(
        searchTerm || undefined,
        statusFilter || undefined,
        districtFilter.length > 0 ? districtFilter.join(",") : undefined,
        activityTypeFilter || undefined,
        urgencyFilter || undefined,
        currentPage,
        limit
      );
      // Sắp xếp PENDING lên đầu
      const sortedRequests = response.items.sort((a, b) => {
        if (a.status === "PENDING" && b.status !== "PENDING") return -1;
        if (a.status !== "PENDING" && b.status === "PENDING") return 1;
        return 0;
      });
      setRequests(sortedRequests);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Lỗi khi tải yêu cầu:", error);
      toast.error("Không thể tải danh sách yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentPage, statusFilter, districtFilter.join(","), activityTypeFilter, urgencyFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchRequests();
  };

  const handleApprove = async (id: string, status: "APPROVED" | "REJECTED") => {
    const confirmMessage =
      status === "APPROVED"
        ? "Bạn có chắc chắn muốn duyệt yêu cầu này?"
        : "Bạn có chắc chắn muốn từ chối yêu cầu này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setApprovingId(id);
      const response = await approveHelpRequest(id, status);
      toast.success(response.message);
      // Refresh list
      await fetchRequests();
    } catch (error: any) {
      console.error("Lỗi khi duyệt yêu cầu:", error);
      toast.error(error.response?.data?.message || "Không thể duyệt yêu cầu");
    } finally {
      setApprovingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: "Chờ xử lý", className: "bg-amber-50 text-amber-600 border border-amber-100" },
      APPROVED: { label: "Đã duyệt", className: "bg-blue-50 text-blue-600 border border-blue-100" },
      ONGOING: { label: "Đang thực hiện", className: "bg-purple-50 text-purple-600 border border-purple-100" },
      COMPLETED: { label: "Hoàn thành", className: "bg-emerald-50 text-emerald-600 border border-emerald-100" },
      CANCELLED: { label: "Đã hủy", className: "bg-red-50 text-red-600 border border-red-100" },
      REJECTED: { label: "Từ chối", className: "bg-slate-100 text-slate-700 border border-slate-200" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100" };
    return (
      <span className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getUrgencyBadge = (urgency: string) => {
    if (urgency === "CRITICAL") {
      return <span className="px-3 py-1 bg-red-500 text-white border border-red-600 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">Khẩn cấp</span>;
    }
    return <span className="px-3 py-1 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider">Bình thường</span>;
  };

  const getActivityTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      EDUCATION: "Giáo dục",
      MEDICAL: "Y tế",
      HOUSE_WORK: "Công việc nhà",
      TRANSPORT: "Đi lại",
      FOOD: "Thực phẩm",
      SHELTER: "Nơi ở",
      OTHER: "Khác",
    };
    return typeMap[type] || type;
  };

  const getDistrictLabel = (district: string) => {
    const districtMap: Record<string, string> = {
      QUAN_1: "Quận 1",
      QUAN_2: "Quận 2",
      QUAN_3: "Quận 3",
      QUAN_4: "Quận 4",
      QUAN_5: "Quận 5",
      QUAN_6: "Quận 6",
      QUAN_7: "Quận 7",
      QUAN_8: "Quận 8",
      QUAN_10: "Quận 10",
      QUAN_11: "Quận 11",
      QUAN_12: "Quận 12",
      BINH_TAN: "Quận Bình Tân",
      BINH_THANH: "Quận Bình Thạnh",
      GO_VAP: "Quận Gò Vấp",
      PHU_NHUAN: "Quận Phú Nhuận",
      TAN_BINH: "Quận Tân Bình",
      TAN_PHU: "Quận Tân Phú",
      THU_DUC: "TP Thủ Đức",
      TP_THU_DUC: "TP Thủ Đức",
      HUYEN_BINH_CHANH: "Huyện Bình Chánh",
      HUYEN_CAN_GIO: "Huyện Cần Giờ",
      HUYEN_CU_CHI: "Huyện Củ Chi",
      HUYEN_HOC_MON: "Huyện Hóc Môn",
      HUYEN_NHA_BE: "Huyện Nhà Bè",
    };
    return districtMap[district] || district.replace("QUAN_", "Quận ").replace("_", " ");
  };

  const DISTRICT_OPTIONS = [
    { value: "QUAN_1", label: "Quận 1" },
    { value: "QUAN_2", label: "Quận 2" },
    { value: "QUAN_3", label: "Quận 3" },
    { value: "QUAN_4", label: "Quận 4" },
    { value: "QUAN_5", label: "Quận 5" },
    { value: "QUAN_6", label: "Quận 6" },
    { value: "QUAN_7", label: "Quận 7" },
    { value: "QUAN_8", label: "Quận 8" },
    { value: "QUAN_10", label: "Quận 10" },
    { value: "QUAN_11", label: "Quận 11" },
    { value: "QUAN_12", label: "Quận 12" },
    { value: "BINH_THANH", label: "Quận Bình Thạnh" },
    { value: "TAN_BINH", label: "Quận Tân Bình" },
    { value: "TAN_PHU", label: "Quận Tân Phú" },
    { value: "PHU_NHUAN", label: "Quận Phú Nhuận" },
    { value: "GO_VAP", label: "Quận Gò Vấp" },
    { value: "BINH_TAN", label: "Quận Bình Tân" },
    { value: "THU_DUC", label: "TP Thủ Đức" },
  ];


  return (
    <div className="space-y-8 font-sans pb-10">
      {/* Breadcrumb */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
        <Breadcrumb items={[{ label: "Quản lý Yêu cầu giúp đỡ" }]} />
      </div>

      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Yêu Cầu Giúp Đỡ</h1>
          <p className="text-slate-500 font-medium mt-1">Quản lý tất cả yêu cầu giúp đỡ trong hệ thống</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] shadow-sm border border-slate-100 relative overflow-hidden group">
        <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-3xl opacity-20 bg-[#008080] group-hover:opacity-30 transition-opacity"></div>
        <form onSubmit={handleSearch} className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MdSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 text-xl" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, mô tả..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 h-11 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008080] focus:border-transparent transition-colors"
              />
            </div>
            <Button type="submit" className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#008080] to-[#00A79D] hover:from-[#006666] hover:to-[#008080] text-white font-bold shadow-md transition-all">
              <MdSearch className="mr-2 text-xl" />
              Tìm kiếm
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008080] text-slate-600 font-medium"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chờ xử lý</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="ONGOING">Đang thực hiện</option>
              <option value="COMPLETED">Hoàn thành</option>
              <option value="CANCELLED">Đã hủy</option>
              <option value="REJECTED">Từ chối</option>
            </select>

            <select
              value={activityTypeFilter}
              onChange={(e) => { setActivityTypeFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008080] text-slate-600 font-medium"
            >
              <option value="">Tất cả hoạt động</option>
              <option value="EDUCATION">Giáo dục</option>
              <option value="MEDICAL">Y tế</option>
              <option value="HOUSE_WORK">Công việc nhà</option>
              <option value="TRANSPORT">Đi lại</option>
              <option value="FOOD">Thực phẩm</option>
              <option value="SHELTER">Nơi ở</option>
              <option value="OTHER">Khác</option>
            </select>

            <select
              value={urgencyFilter}
              onChange={(e) => { setUrgencyFilter(e.target.value); setCurrentPage(1); }}
              className="h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#008080] text-slate-600 font-medium"
            >
              <option value="">Tất cả mức độ</option>
              <option value="STANDARD">Bình thường</option>
              <option value="CRITICAL">Khẩn cấp</option>
            </select>

            {/* Multi-select District */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="h-11 px-4 bg-slate-50/50 border border-slate-200 rounded-xl hover:bg-slate-100 focus:ring-2 focus:ring-[#008080] text-slate-600 font-medium justify-between font-normal"
                >
                  <div className="flex items-center gap-2 truncate">
                    <MdLocationOn className="text-[#008080]" />
                    {districtFilter.length === 0
                      ? "Tất cả khu vực"
                      : `Đã chọn ${districtFilter.length} khu vực`}
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
                      {DISTRICT_OPTIONS.map((district) => {
                        const isSelected = districtFilter.includes(district.value);
                        return (
                          <CommandItem
                            key={district.value}
                            onSelect={() => {
                              setDistrictFilter((prev) =>
                                isSelected
                                  ? prev.filter((val) => val !== district.value)
                                  : [...prev, district.value]
                              );
                              setCurrentPage(1);
                            }}
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
                  {districtFilter.length > 0 && (
                     <div className="p-3 border-t border-slate-100 bg-slate-50">
                        <Button 
                           variant="ghost" 
                           size="sm" 
                           onClick={() => { setDistrictFilter([]); setCurrentPage(1); }}
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
        </form>
      </div>

      {/* Results count */}
      <div className="text-sm font-medium text-slate-500 px-2 border-l-2 border-[#008080]">
        Đã tìm thấy <span className="font-bold text-slate-900">{total}</span> yêu cầu phù hợp
      </div>

      {/* Requests list */}
      <div className="relative min-h-[200px]">
        {loading && (
          <div className="absolute inset-x-0 inset-y-0 bg-white/50 backdrop-blur-sm z-10 flex justify-center items-center rounded-[2rem]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
          </div>
        )}
        <div className="grid gap-6">
          {requests.map((request) => (
          <div key={request.id} className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 hover:shadow-md hover:border-teal-100 transition-all p-6 relative overflow-hidden group">
            {request.status === "PENDING" && (
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400 opacity-5 rounded-bl-full translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
            )}
            {request.urgencyLevel === "CRITICAL" && (
              <div className="absolute top-0 left-0 w-2 h-full bg-red-500 rounded-l-[1rem]"></div>
            )}
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 space-y-4">
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#008080] transition-colors line-clamp-2">
                    {request.title}
                  </h3>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {getStatusBadge(request.status)}
                    {getUrgencyBadge(request.urgencyLevel)}
                    <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider">{getActivityTypeLabel(request.activityType)}</span>
                    <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-xl text-xs font-bold uppercase tracking-wider">{getDistrictLabel(request.district)}</span>
                  </div>
                </div>

                {request.description && (
                  <p className="text-slate-600 text-sm line-clamp-2 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-50">{request.description}</p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm mt-4 pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Người yêu cầu</span>
                    <span className="font-semibold text-slate-800 break-all">
                      {request.requester.bficiaryProfile?.fullName || request.requester.email}
                    </span>
                  </div>
                  {request.volunteer && (
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Tình nguyện viên</span>
                      <span className="font-semibold text-slate-800 break-all">
                        {request.volunteer.volunteerProfile?.fullName || request.volunteer.email}
                      </span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Ngày tạo</span>
                    <span className="font-medium text-slate-700">
                      {new Date(request.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  {request.acceptedAt && (
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Ngày nhận</span>
                      <span className="font-medium text-slate-700">
                        {new Date(request.acceptedAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                {/* Nút Duyệt/Từ chối - chỉ hiện khi PENDING */}
                {request.status === "PENDING" && (
                  <div className="flex flex-row md:flex-col gap-2 w-full">
                    <Button
                      onClick={() => handleApprove(request.id, "APPROVED")}
                      disabled={approvingId === request.id}
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded-xl shadow-sm h-10 font-bold"
                    >
                      <MdCheck className="mr-1.5 text-lg" /> Duyệt
                    </Button>
                    <Button
                      onClick={() => handleApprove(request.id, "REJECTED")}
                      disabled={approvingId === request.id}
                      variant="outline"
                      className="flex-1 bg-white border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-xl shadow-sm h-10 font-bold"
                    >
                      <MdClose className="mr-1.5 text-lg" /> Từ chối
                    </Button>
                  </div>
                )}

                <Button
                  onClick={() => router.push(`/admin/requests/${request.id}`)}
                  variant="outline"
                  className="w-full h-10 px-4 rounded-xl border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-teal-50 hover:border-teal-200 shadow-sm transition-all font-bold"
                >
                  <MdVisibility className="mr-1.5 text-lg" />
                  Xem chi tiết
                </Button>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2">
          <div className="text-sm text-slate-500 font-medium">
            Hiển thị{" "}
            <span className="font-bold text-slate-800">
              {(currentPage - 1) * limit + 1}
            </span>{" "}
            đến{" "}
            <span className="font-bold text-slate-800">
              {Math.min(currentPage * limit, total)}
            </span>{" "}
            trên <span className="font-bold text-slate-800">{total}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="h-10 px-4 rounded-xl border-transparent bg-transparent hover:bg-slate-100 text-slate-600 disabled:opacity-40 font-bold transition-colors"
            >
               Trước
            </Button>
            <div className="flex items-center">
              <span className="w-10 h-10 flex items-center justify-center text-sm font-black text-white bg-[#008080] rounded-xl shadow-md">
                {currentPage}
              </span>
              <span className="px-3 text-sm font-bold text-slate-400">/ {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="h-10 px-4 rounded-xl border-transparent bg-transparent hover:bg-slate-100 text-slate-600 disabled:opacity-40 font-bold transition-colors"
            >
              Sau
            </Button>
          </div>
        </div>
      )}

      {requests.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Không tìm thấy yêu cầu nào</p>
        </div>
      )}
    </div>
  );
}
