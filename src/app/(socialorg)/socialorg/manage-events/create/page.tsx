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
    <div className="pb-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý chiến dịch", href: "/socialorg/manage-events" },
          { label: "Tạo chiến dịch mới" },
        ]}
      />

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tạo chiến dịch mới</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tạo chiến dịch hoặc sự kiện từ thiện mới
        </p>
      </div>

      {/* Form */}
      <CampaignForm onSubmit={handleSubmit} submitLabel="Tạo chiến dịch" />
    </div>
  );
}
