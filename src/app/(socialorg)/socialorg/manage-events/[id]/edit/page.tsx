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
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#008080]/20 border-t-[#008080] rounded-full animate-spin"></div>
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return null;
  }

  return (
    <div className="min-h-screen pb-10">
      {/* Breadcrumb */}
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center mb-4">
          <Breadcrumb
            items={[
              { label: "Quản lý chiến dịch", href: "/socialorg/manage-events" },
              { label: campaign.title, href: `/socialorg/manage-events/${campaignId}` },
              { label: "Chỉnh sửa" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Chỉnh sửa chiến dịch</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Cập nhật thông tin cho "{campaign.title}"
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          <CampaignForm
            initialData={campaign}
            onSubmit={handleSubmit}
            submitLabel="Cập nhật chiến dịch"
          />
        </div>
      </div>
    </div>
  );
}
