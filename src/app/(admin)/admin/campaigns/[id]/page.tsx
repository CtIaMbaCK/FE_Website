"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllCampaigns, approveCampaign, type Campaign } from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumb from "@/components/Breadcrumb";
import { MdArrowBack, MdPeople, MdCheck, MdClose, MdOutlineBusiness, MdCalendarToday, MdAccessTime, MdNotes, MdImage } from "react-icons/md";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);

  // Fetch campaign tu list API vi khong co detail endpoint
  const fetchCampaign = async () => {
    try {
      setLoading(true);
      // Lay tat ca campaigns va tim campaign theo id
      const response = await getAllCampaigns(undefined, undefined, undefined, 1, 1000);
      const foundCampaign = response.items.find((c) => c.id === id);

      if (foundCampaign) {
        setCampaign(foundCampaign);
      } else {
        toast.error("Không tìm thấy chiến dịch");
      }
    } catch (error) {
      console.error("Loi fetch campaign:", error);
      toast.error("Không thể tải thông tin chiến dịch");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (status: "APPROVED" | "REJECTED") => {
    const confirmMessage =
      status === "APPROVED"
        ? "Bạn có chắc chắn muốn duyệt chiến dịch này?"
        : "Bạn có chắc chắn muốn từ chối chiến dịch này?";

    if (!window.confirm(confirmMessage)) return;

    try {
      setIsApproving(true);
      const response = await approveCampaign(id, status);
      toast.success(response.message);
      // Refresh data
      await fetchCampaign();
    } catch (error: any) {
      console.error("Lỗi khi duyệt chiến dịch:", error);
      toast.error(error.response?.data?.message || "Không thể duyệt chiến dịch");
    } finally {
      setIsApproving(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchCampaign();
    }
  }, [id]);

  // Hien thi badge status voi mau sac
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      APPROVED: { label: "Đã duyệt", className: "bg-green-100 text-green-800" },
      PENDING: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
      ONGOING: { label: "Đang thực hiện", className: "bg-blue-100 text-blue-800" },
      COMPLETED: { label: "Đã hoàn thành", className: "bg-purple-100 text-purple-800" },
      CANCELLED: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
      REJECTED: { label: "Từ chối", className: "bg-gray-100 text-gray-800" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "" };
    return (
      <Badge className={statusInfo.className} variant="outline">
        {statusInfo.label}
      </Badge>
    );
  };

  // Format ngay thang
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin</p>
        <Button onClick={() => router.push("/admin/campaigns")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center">
          <Breadcrumb
            items={[
              { label: "Quản lý chiến dịch", href: "/admin/campaigns" },
              { label: "Chi tiết chiến dịch" }
            ]}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Nút Duyệt/Từ chối - chỉ hiện khi status = PENDING */}
          {campaign?.status === "PENDING" && (
            <>
              <Button
                onClick={() => handleApprove("APPROVED")}
                disabled={isApproving}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-sm hover:shadow h-11 px-5 font-bold transition-all"
              >
                <MdCheck size={20} className="mr-2" />
                {isApproving ? "Đang xử lý..." : "Duyệt chiến dịch"}
              </Button>
              <Button
                onClick={() => handleApprove("REJECTED")}
                disabled={isApproving}
                variant="destructive"
                className="rounded-xl shadow-sm hover:shadow h-11 px-5 font-bold transition-all"
              >
                <MdClose size={20} className="mr-2" />
                Từ chối
              </Button>
            </>
          )}

          <Button
            variant="outline"
            onClick={() => router.push("/admin/campaigns")}
            className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm rounded-xl h-11 px-5 font-bold transition-all flex items-center gap-2"
          >
            <MdArrowBack size={20} />
            Quay lại
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Post Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Cover Image */}
          <div className="w-full h-64 md:h-80 rounded-[2rem] overflow-hidden shadow-sm relative group bg-slate-100">
             <img 
               src={campaign.coverImage} 
               alt="Campaign Cover" 
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
             <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                <div className="space-y-2">
                   {getStatusBadge(campaign.status)}
                   <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-lg leading-tight">{campaign.title}</h2>
                </div>
             </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
            
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <span className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080]">
                <MdNotes size={20} />
              </span>
              Mô tả chiến dịch
            </h3>

            <div className="prose prose-slate max-w-none text-slate-600 mb-8 leading-relaxed">
               {campaign.description ? (
                  <p className="whitespace-pre-line">{campaign.description}</p>
               ) : (
                  <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-6 text-center">
                     <MdNotes className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                     <p className="text-slate-500 font-medium">Chiến dịch này hiện chưa có nội dung mô tả chi tiết.</p>
                  </div>
               )}
            </div>
            
            {/* Thong tin tinh nguyen vien */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                 <MdPeople className="text-lg" /> Tình nguyện viên tham gia
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center gap-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#008080] to-teal-400 flex items-center justify-center text-white shadow-md">
                    <MdPeople className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-baseline gap-2">
                      <p className="font-black text-3xl text-slate-800">
                        {campaign.currentVolunteers}
                      </p>
                      <span className="text-slate-400 font-bold text-xl">/ {campaign.maxVolunteers}</span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold mt-1">Số lượng đăng ký</p>
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <div className="w-full bg-slate-200/60 rounded-full h-3 mb-2 overflow-hidden border border-slate-200/50">
                    <div
                      className="bg-gradient-to-r from-[#008080] to-teal-400 h-full rounded-full transition-all duration-1000 ease-out relative"
                      style={{
                        width: `${Math.min((campaign.currentVolunteers / campaign.maxVolunteers) * 100, 100)}%`,
                      }}
                    >
                      <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/20 overflow-hidden after:content-[''] after:absolute after:top-0 after:left-[-100%] after:w-full after:h-full after:bg-gradient-to-r after:from-transparent after:via-white/40 after:to-transparent after:animate-[shimmer_2s_infinite]"></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                    <span>Đã đạt {Math.round((campaign.currentVolunteers / campaign.maxVolunteers) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-slate-100">
              <div className="flex gap-4 p-5 rounded-2xl bg-teal-50/50 border border-teal-100">
                 <div className="w-10 h-10 rounded-full bg-white flex justify-center items-center shadow-sm text-teal-600">
                    <MdCalendarToday size={18} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-bold text-teal-600/70 uppercase tracking-wider mb-1">Ngày bắt đầu</p>
                    <p className="text-teal-900 font-bold text-lg">{formatDate(campaign.startDate)}</p>
                 </div>
              </div>
              <div className="flex gap-4 p-5 rounded-2xl bg-orange-50/50 border border-orange-100">
                 <div className="w-10 h-10 rounded-full bg-white flex justify-center items-center shadow-sm text-orange-600">
                    <MdCalendarToday size={18} />
                 </div>
                 <div className="flex-1">
                    <p className="text-xs font-bold text-orange-600/70 uppercase tracking-wider mb-1">Ngày kết thúc</p>
                    <p className="text-orange-900 font-bold text-lg">{formatDate(campaign.endDate)}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Organization Info */}
        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <span className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080]">
                <MdOutlineBusiness size={20} />
              </span>
              Thông tin tổ chức
            </h3>
            
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#008080] to-[#00A79D] rounded-full blur-md opacity-20"></div>
                  <Avatar className="w-24 h-24 border-4 border-white shadow-xl relative z-10">
                    <AvatarImage
                      src={campaign.organization.organizationProfiles?.avatarUrl}
                      alt={campaign.organization.organizationProfiles?.organizationName || "Org"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#008080] to-[#00A79D] text-white text-3xl font-black">
                      {campaign.organization.organizationProfiles?.organizationName?.charAt(0) || "O"}
                    </AvatarFallback>
                  </Avatar>
               </div>
               
               <div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Đơn vị chủ quản</p>
                 <p className="font-extrabold text-xl text-slate-900">
                   {campaign.organization.organizationProfiles?.organizationName || "Chưa cập nhật"}
                 </p>
               </div>
               
               <div className="w-full h-px bg-slate-100 my-4"></div>
               
               {/* Metadata */}
               <div className="w-full text-left space-y-3">
                  <div className="flex flex-col space-y-1">
                     <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><MdAccessTime /> Ngày tạo hệ thống</p>
                     <p className="text-sm font-medium text-slate-700">{formatDate(campaign.createdAt)}</p>
                  </div>
                  <div className="flex flex-col space-y-1">
                     <p className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><MdAccessTime /> Ngày cập nhật cuối</p>
                     <p className="text-sm font-medium text-slate-700">{formatDate(campaign.updatedAt)}</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
