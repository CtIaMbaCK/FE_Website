"use client";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import CampaignForm from "@/components/CampaignForm";
import { createCampaign } from "@/services/campaign.service";
import { toast } from "sonner";

export default function CreateCampaignPage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    await createCampaign(data);
    toast.success("Tạo chiến dịch thành công!");
    router.push("/socialorg/manage-events");
  };

  return (
    <div className="min-h-screen pb-10">
      {/* Breadcrumb */}
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
          <Breadcrumb
            items={[
              { label: "Quản lý chiến dịch", href: "/socialorg/manage-events" },
              { label: "Tạo chiến dịch mới" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tạo chiến dịch mới</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Tạo chiến dịch hoặc sự kiện từ thiện mới
            </p>
          </div>
        </div>

        {/* Form */}
        <div>
          <CampaignForm onSubmit={handleSubmit} submitLabel="Tạo chiến dịch" />
        </div>
      </div>
    </div>
  );
}
