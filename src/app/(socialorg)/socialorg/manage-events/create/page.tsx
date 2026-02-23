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
    <div className="pb-10 bg-[#f8f9fa] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-5xl mx-auto px-6 pt-4">
        <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
          <Breadcrumb
            items={[
              { label: "Quản lý chiến dịch", href: "/socialorg/manage-events" },
              { label: "Tạo chiến dịch mới" },
            ]}
          />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-6">
        {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tạo chiến dịch mới</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tạo chiến dịch hoặc sự kiện từ thiện mới
        </p>
      </div>

      {/* Form */}
      <div className="mt-6">
        <CampaignForm onSubmit={handleSubmit} submitLabel="Tạo chiến dịch" />
      </div>
    </div>
  </div>
  );
}
