"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Upload, X, Calendar, MapPin, Users, Image as ImageIcon } from "lucide-react";
import type { Campaign } from "@/services/campaign.service";

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

interface CampaignFormProps {
  initialData?: Campaign;
  onSubmit: (data: any) => Promise<void>;
  submitLabel?: string;
}

export default function CampaignForm({
  initialData,
  onSubmit,
  submitLabel = "Tạo chiến dịch",
}: CampaignFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [goal, setGoal] = useState("");
  const [district, setDistrict] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [targetVolunteers, setTargetVolunteers] = useState(0);
  const [maxVolunteers, setMaxVolunteers] = useState(0);

  // Images
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  // Load initial data khi edit
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setGoal(initialData.goal || "");
      setDistrict(initialData.district || "");
      setAddressDetail(initialData.addressDetail || "");

      // Format dates for input[type="date"]
      if (initialData.startDate) {
        const start = new Date(initialData.startDate);
        setStartDate(start.toISOString().split("T")[0]);
      }
      if (initialData.endDate) {
        const end = new Date(initialData.endDate);
        setEndDate(end.toISOString().split("T")[0]);
      }

      setTargetVolunteers(initialData.targetVolunteers || 0);
      setMaxVolunteers(initialData.maxVolunteers || 0);

      // Set existing images
      if (initialData.coverImage) {
        setCoverImagePreview(initialData.coverImage);
      }
      if (initialData.images && initialData.images.length > 0) {
        setExistingImages(initialData.images);
        setImagePreviews(initialData.images);
      }
    }
  }, [initialData]);

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate total images (max 10)
    if (imageFiles.length + files.length > 10) {
      toast.error("Tối đa 10 ảnh");
      return;
    }

    // Validate each file
    const validFiles: File[] = [];
    const newPreviews: string[] = [];

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} không phải là file ảnh`);
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} vượt quá 5MB`);
        return;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews.push(reader.result as string);
        if (newPreviews.length === validFiles.length) {
          setImagePreviews([...imagePreviews, ...newPreviews]);
        }
      };
      reader.readAsDataURL(file);
    });

    setImageFiles([...imageFiles, ...validFiles]);
  };

  const removeCoverImage = () => {
    setCoverImageFile(null);
    setCoverImagePreview("");
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Vui lòng nhập tên chiến dịch");
      return;
    }

    if (!district) {
      toast.error("Vui lòng chọn quận/huyện");
      return;
    }

    if (!addressDetail.trim()) {
      toast.error("Vui lòng nhập địa chỉ chi tiết");
      return;
    }

    if (!startDate) {
      toast.error("Vui lòng chọn ngày bắt đầu");
      return;
    }

    if (targetVolunteers <= 0) {
      toast.error("Số lượng tình nguyện viên mục tiêu phải lớn hơn 0");
      return;
    }

    if (maxVolunteers < targetVolunteers) {
      toast.error("Số lượng tối đa phải lớn hơn hoặc bằng số lượng mục tiêu");
      return;
    }

    if (endDate && new Date(startDate) > new Date(endDate)) {
      toast.error("Ngày kết thúc phải sau ngày bắt đầu");
      return;
    }

    try {
      setSubmitting(true);

      const formData = {
        title: title.trim(),
        description: description.trim() || undefined,
        goal: goal.trim() || undefined,
        district,
        addressDetail: addressDetail.trim(),
        startDate,
        endDate: endDate || undefined,
        targetVolunteers,
        maxVolunteers,
        coverImage: coverImageFile || undefined,
        images: imageFiles.length > 0 ? imageFiles : undefined,
      };

      await onSubmit(formData);
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Thông tin cơ bản */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden p-8 hover:border-[#008080]/30 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-teal-100">
            <MapPin className="w-6 h-6 text-teal-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Thông tin cơ bản</h2>
        </div>
        
        <div className="space-y-6">
          {/* Tên chiến dịch */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-bold text-slate-700">
              Tên chiến dịch <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chung tay dọn dẹp bãi biển"
              className="h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
              required
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-bold text-slate-700">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết về chiến dịch..."
              rows={4}
              className="bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
            />
          </div>

          {/* Mục tiêu */}
          <div className="space-y-2">
            <Label htmlFor="goal" className="text-sm font-bold text-slate-700">Mục tiêu</Label>
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="VD: Trao 500 phần quà cho người nghèo"
              className="h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quận/Huyện */}
            <div className="space-y-2">
              <Label htmlFor="district" className="text-sm font-bold text-slate-700">
                Quận/Huyện <span className="text-red-500">*</span>
              </Label>
              <Select value={district} onValueChange={setDistrict} required>
                <SelectTrigger className="h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl">
                  <SelectValue placeholder="Chọn quận/huyện" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
                  {DISTRICTS.map((d) => (
                    <SelectItem key={d.value} value={d.value} className="cursor-pointer">
                      {d.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Địa chỉ chi tiết */}
            <div className="space-y-2">
              <Label htmlFor="addressDetail" className="text-sm font-bold text-slate-700">
                Địa chỉ chi tiết <span className="text-red-500">*</span>
              </Label>
              <Input
                id="addressDetail"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
                placeholder="VD: 123 Đường ABC, Phường XYZ"
                className="h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
                required
              />
            </div>
          </div>
        </div>
      </div>

      {/* Thời gian và số lượng */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden p-8 hover:border-[#008080]/30 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-blue-100">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Thời gian và số lượng</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ngày bắt đầu */}
          <div className="space-y-2">
            <Label htmlFor="startDate" className="text-sm font-bold text-slate-700">
              Ngày bắt đầu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
              required
            />
          </div>

          {/* Ngày kết thúc */}
          <div className="space-y-2">
            <Label htmlFor="endDate" className="text-sm font-bold text-slate-700">Ngày kết thúc</Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
            />
          </div>

          {/* Số lượng mục tiêu */}
          <div className="space-y-2">
            <Label htmlFor="targetVolunteers" className="text-sm font-bold text-slate-700">
              Số lượng TNV mục tiêu <span className="text-red-500">*</span>
            </Label>
            <Input
              id="targetVolunteers"
              type="number"
              min="1"
              value={targetVolunteers}
              onChange={(e) => setTargetVolunteers(parseInt(e.target.value) || 0)}
              placeholder="50"
              className="h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
              required
            />
          </div>

          {/* Số lượng tối đa */}
          <div className="space-y-2">
            <Label htmlFor="maxVolunteers" className="text-sm font-bold text-slate-700">
              Số lượng tối đa <span className="text-red-500">*</span>
            </Label>
            <Input
              id="maxVolunteers"
              type="number"
              min="1"
              value={maxVolunteers}
              onChange={(e) => setMaxVolunteers(parseInt(e.target.value) || 0)}
              placeholder="100"
              className="h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
              required
            />
          </div>
        </div>
      </div>

      {/* Hình ảnh */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] shadow-sm overflow-hidden p-8 hover:border-[#008080]/30 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center flex-shrink-0 shadow-sm border border-purple-100">
            <ImageIcon className="w-6 h-6 text-purple-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Hình ảnh</h2>
        </div>
        
        <div className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Ảnh bìa</Label>
            {!coverImagePreview ? (
              <div
                onClick={() => document.getElementById("coverImage")?.click()}
                className="border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-2xl p-10 text-center cursor-pointer hover:border-[#008080] hover:bg-[#008080]/5 transition-all duration-300 group"
              >
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                  <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#008080]" />
                </div>
                <p className="text-sm font-bold text-slate-600">Click để tải ảnh bìa lên</p>
                <p className="text-xs font-medium text-slate-400 mt-2">PNG, JPG (max. 5MB)</p>
              </div>
            ) : (
              <div className="relative group">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-80 object-cover rounded-2xl shadow-sm border border-slate-100"
                />
                <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeCoverImage}
                    className="bg-white text-red-600 p-3 rounded-xl hover:bg-red-50 font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
                  >
                    <X className="w-5 h-5" />
                    Bỏ chọn ảnh
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <Label className="text-sm font-bold text-slate-700">Ảnh bổ sung (Tối đa 10 ảnh)</Label>
            <div
              onClick={() => document.getElementById("images")?.click()}
              className="border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-2xl p-8 text-center cursor-pointer hover:border-[#008080] hover:bg-[#008080]/5 transition-all duration-300 group"
            >
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-slate-400 group-hover:text-[#008080]" />
              </div>
              <p className="text-sm font-bold text-slate-600">Click để thêm nhiều ảnh</p>
              <p className="text-xs font-medium text-slate-400 mt-1">PNG, JPG (max. 5MB mỗi ảnh)</p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-36 object-cover rounded-xl shadow-sm border border-slate-100"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-white border border-slate-200 text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shadow-sm"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4 mt-8">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/socialorg/manage-events")}
          disabled={submitting}
          className="h-12 px-6 rounded-xl font-bold bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm"
        >
          Hủy bỏ
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="h-12 px-8 rounded-xl font-bold bg-[#008080] hover:bg-[#00A79D] text-white shadow-sm transition-all"
        >
          {submitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
              Đang xử lý...
            </>
          ) : (
            submitLabel
          )}
        </Button>
      </div>
    </form>
  );
}
