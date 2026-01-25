"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import CampaignForm from "@/components/CampaignForm";
import {
  getCampaignDetail,
  updateCampaign,
  type Campaign,
} from "@/services/campaign.service";
import { toast } from "sonner";

export default function EditCampaignPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    try {
      setLoading(true);
      const data = await getCampaignDetail(campaignId);

      // Kiểm tra status - không cho sửa nếu ONGOING hoặc COMPLETED
      if (data.status === "ONGOING" || data.status === "COMPLETED") {
        toast.error("Không thể chỉnh sửa chiến dịch đang diễn ra hoặc đã hoàn thành");
        router.push("/socialorg/manage-events");
        return;
      }

      setCampaign(data);
    } catch (error: any) {
      toast.error("Lỗi khi tải thông tin chiến dịch: " + error.message);
      router.push("/socialorg/manage-events");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: any) => {
    await updateCampaign(campaignId, data);
    toast.success("Cập nhật chiến dịch thành công!");
    router.push(`/socialorg/manage-events/${campaignId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Đang tải thông tin chiến dịch...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Quản lý chiến dịch", href: "/socialorg/manage-events" },
            { label: campaign.title, href: `/socialorg/manage-events/${campaignId}` },
            { label: "Chỉnh sửa" },
          ]}
        />

        {/* Header with gradient */}
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 to-cyan-600 rounded-2xl shadow-lg p-8 mb-8 mt-6">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">Chỉnh sửa chiến dịch</h1>
                <p className="text-teal-100 text-sm mt-1">
                  Cập nhật thông tin cho "{campaign.title}"
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mt-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              Đang chỉnh sửa
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Form with enhanced card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="p-6 sm:p-8">
            <CampaignForm
              initialData={campaign}
              onSubmit={handleSubmit}
              submitLabel="Cập nhật chiến dịch"
            />
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
