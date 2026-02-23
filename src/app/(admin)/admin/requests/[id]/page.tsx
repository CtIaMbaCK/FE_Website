"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getHelpRequestDetail, approveHelpRequest, type HelpRequest } from "@/services/admin.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import { MdArrowBack, MdPerson, MdLocationOn, MdCalendarToday, MdAccessTime, MdCheck, MdClose, MdVisibility } from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HelpRequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  const fetchRequest = async () => {
    try {
      setLoading(true);
      const response = await getHelpRequestDetail(id);
      setRequest(response);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết yêu cầu:", error);
      toast.error("Không thể tải thông tin yêu cầu");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (status: "APPROVED" | "REJECTED") => {
    const confirmMessage =
      status === "APPROVED"
        ? "Bạn có chắc chắn muốn duyệt yêu cầu này?"
        : "Bạn có chắc chắn muốn từ chối yêu cầu này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setIsApproving(true);
      const response = await approveHelpRequest(id, status);
      toast.success(response.message);
      // Refresh data
      await fetchRequest();
    } catch (error: any) {
      console.error("Lỗi khi duyệt yêu cầu:", error);
      toast.error(error.response?.data?.message || "Không thể duyệt yêu cầu");
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchRequest();
    }
  }, [id]);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      PENDING: { label: "Chờ xử lý", className: "bg-yellow-100 text-yellow-800" },
      APPROVED: { label: "Đã duyệt", className: "bg-blue-100 text-blue-800" },
      ONGOING: { label: "Đang thực hiện", className: "bg-purple-100 text-purple-800" },
      COMPLETED: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
      REJECTED: { label: "Từ chối", className: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "bg-gray-100" };
    return (
      <span className={`px-4 py-1.5 rounded-xl text-sm font-bold uppercase tracking-wider ${statusInfo.className}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return "Không xác định";
    return new Date(timeString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin</p>
        <Button onClick={() => router.push("/admin/requests")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center">
          <Breadcrumb
            items={[
              { label: "Quản lý Yêu cầu giúp đỡ", href: "/admin/requests" },
              { label: "Chi tiết yêu cầu" },
            ]}
          />
        </div>

        <div className="flex gap-3 items-center">
          {/* Nút Duyệt/Từ chối - chỉ hiện khi status = PENDING */}
          {request?.status === "PENDING" && (
            <>
              <Button
                onClick={() => handleApprove("APPROVED")}
                disabled={isApproving}
                className="bg-green-500 hover:bg-green-600 text-white shadow-sm rounded-xl h-11 px-6 font-bold transition-all"
              >
                <MdCheck size={20} className="mr-2" />
                {isApproving ? "Đang xử lý..." : "Duyệt yêu cầu"}
              </Button>
              <Button
                onClick={() => handleApprove("REJECTED")}
                disabled={isApproving}
                variant="outline"
                className="bg-white hover:bg-red-50 text-red-600 border-red-200 shadow-sm rounded-xl h-11 px-6 font-bold transition-all"
              >
                <MdClose size={20} className="mr-2" />
                Từ chối
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={() => router.push("/admin/requests")}
            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm rounded-xl h-11 px-6 font-bold transition-all flex items-center gap-2"
          >
            <MdArrowBack size={20} />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Thông tin cơ bản */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{request.title}</h2>
          <div className="flex items-center gap-3">
            {getStatusBadge(request.status)}
            {request.urgencyLevel === "CRITICAL" ? (
              <span className="px-4 py-1.5 bg-red-500 text-white border border-red-600 rounded-xl text-sm font-bold uppercase tracking-wider shadow-sm animate-pulse">Khẩn cấp</span>
            ) : (
              <span className="px-4 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-sm font-bold uppercase tracking-wider">Bình thường</span>
            )}
            <span className="px-4 py-1.5 bg-teal-50 text-[#008080] border border-teal-100 rounded-xl text-sm font-bold uppercase tracking-wider">{getActivityTypeLabel(request.activityType)}</span>
          </div>
        </div>

        {request.description && (
          <div className="mb-8 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Mô tả yêu cầu</h3>
            <p className="text-slate-700 leading-relaxed text-base">{request.description}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080]">
                <MdLocationOn size={20} />
              </span>
              Địa điểm
            </h3>
            <div className="space-y-4">
              <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                 <div className="flex-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Quận/Huyện</p>
                    <p className="text-slate-900 font-semibold">{getDistrictLabel(request.district)}</p>
                 </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 bg-slate-50/30">
                 <div className="flex-1">
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Địa chỉ chi tiết</p>
                    <p className="text-slate-900 font-medium">{request.addressDetail}</p>
                 </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <MdCalendarToday size={18} />
              </span>
              Thời gian
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày bắt đầu</p>
                <div className="flex gap-2 items-center text-slate-900 font-semibold"><MdCalendarToday className="text-blue-500" /> {formatDate(request.startDate)}</div>
              </div>
              {request.endDate && (
                <div className="p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Ngày kết thúc</p>
                  <div className="flex gap-2 items-center text-slate-900 font-semibold"><MdCalendarToday className="text-blue-500" /> {formatDate(request.endDate)}</div>
                </div>
              )}
              <div className="p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 bg-slate-50/30">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Giờ bắt đầu</p>
                <div className="flex gap-2 items-center text-slate-900 font-semibold"><MdAccessTime className="text-blue-500" /> {formatTime(request.startTime)}</div>
              </div>
              <div className="p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 bg-slate-50/30">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Giờ kết thúc</p>
                <div className="flex gap-2 items-center text-slate-900 font-semibold"><MdAccessTime className="text-blue-500" /> {formatTime(request.endTime)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thông tin liên quan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Người yêu cầu */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8">
          <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
               <MdPerson size={20} />
            </span>
            Người yêu cầu
          </h3>
          <div className="flex items-start gap-5">
            <Avatar className="h-20 w-20 border-4 border-white shadow-md rounded-full overflow-hidden">
              <AvatarImage 
                src={request.requester.bficiaryProfile?.avatarUrl} 
                className="object-cover w-full h-full"
              />
              <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-xl w-full h-full flex items-center justify-center">
                {request.requester.bficiaryProfile?.fullName?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1.5 pt-1">
              <p className="font-black text-xl text-slate-900">
                {request.requester.bficiaryProfile?.fullName || "Chưa cập nhật tên"}
              </p>
              <p className="text-slate-500 font-medium">Email: <span className="text-slate-700">{request.requester.email}</span></p>
              <p className="text-slate-500 font-medium">SĐT: <span className="text-slate-700">{request.requester.phoneNumber || "Không có"}</span></p>
              {request.requester.bficiaryProfile?.vulnerabilityType && (
                <div className="pt-2">
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold uppercase tracking-wider border border-rose-100">
                    Đối tượng: {request.requester.bficiaryProfile.vulnerabilityType}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tình nguyện viên */}
        {request.volunteer ? (
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 relative overflow-hidden">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-green-50 flex items-center justify-center text-green-600">
                 <MdPerson size={20} />
              </span>
              Tình nguyện viên đảm nhận
            </h3>
            <div className="flex items-start gap-5 relative z-10">
              <Avatar className="h-20 w-20 border-4 border-white shadow-md rounded-full overflow-hidden">
                <AvatarImage 
                  src={request.volunteer.volunteerProfile?.avatarUrl} 
                  className="object-cover w-full h-full"
                />
                <AvatarFallback className="bg-gradient-to-br from-green-400 to-green-600 text-white font-bold text-xl w-full h-full flex items-center justify-center">
                  {request.volunteer.volunteerProfile?.fullName?.charAt(0) || "V"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-1.5 pt-1">
                <p className="font-black text-xl text-slate-900">
                  {request.volunteer.volunteerProfile?.fullName || "Chưa cập nhật tên"}
                </p>
                <p className="text-slate-500 font-medium">Email: <span className="text-slate-700">{request.volunteer.email}</span></p>
                <p className="text-slate-500 font-medium">SĐT: <span className="text-slate-700">{request.volunteer.phoneNumber || "Không có"}</span></p>
                {request.volunteer.volunteerProfile?.points !== undefined && (
                  <div className="pt-2">
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-xl text-xs font-bold uppercase tracking-wider border border-amber-100 flex items-center gap-1 inline-flex w-fit">
                      ⭐ {request.volunteer.volunteerProfile.points} điểm tích lũy
                    </span>
                  </div>
                )}
              </div>
            </div>
            {request.acceptedAt && (
              <div className="mt-6 p-4 rounded-xl bg-green-50/50 border border-green-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600Shrink text-lg"><MdCheck /></div>
                <div>
                   <p className="text-sm font-bold text-green-800">Đã nhận yêu cầu</p>
                   <p className="text-xs text-green-600 font-medium">{formatDate(request.acceptedAt)} lúc {formatTime(request.acceptedAt)}</p>
                </div>
              </div>
            )}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-green-400 opacity-5 rounded-tl-full pointer-events-none"></div>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-[2rem] p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 mb-4 flex items-center justify-center text-slate-300">
              <MdPerson size={32} />
            </div>
            <p className="text-slate-500 font-medium">Chưa có tình nguyện viên nào nhận yêu cầu này.</p>
          </div>
        )}
      </div>

      {/* Images Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ảnh hoạt động */}
        {request.activityImages && request.activityImages.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 h-full">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Ảnh hoạt động</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {request.activityImages.map((image: string, index: number) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
                  <img
                    src={image}
                    alt={`Ảnh hoạt động ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MdVisibility className="text-white text-3xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ảnh minh chứng hoàn thành */}
        {request.proofImages && request.proofImages.length > 0 && (
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 h-full w-full lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
               <h3 className="text-xl font-bold text-slate-800">Ảnh minh chứng hoàn thành</h3>
               {request.doneAt && (
                 <div className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-sm font-bold">Đã hoàn thành: {formatDate(request.doneAt)} lúc {formatTime(request.doneAt)}</span>
                 </div>
               )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 mb-6">
              {request.proofImages.map((image: string, index: number) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden border border-slate-100 shadow-sm relative group">
                  <img
                    src={image}
                    alt={`Ảnh minh chứng ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <MdVisibility className="text-white text-3xl" />
                  </div>
                </div>
              ))}
            </div>
            {request.completionNotes && (
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Ghi chú hoàn thành từ Tình Nguyện Viên:</p>
                <p className="text-slate-800 leading-relaxed italic border-l-4 border-emerald-400 pl-4">{request.completionNotes}</p>
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
