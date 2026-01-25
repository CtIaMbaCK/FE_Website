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
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Thông tin cơ bản */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" />
            Thông tin cơ bản
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Tên chiến dịch */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Tên chiến dịch <span className="text-red-600">*</span>
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="VD: Chung tay dọn dẹp bãi biển"
              required
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả chi tiết về chiến dịch..."
              rows={4}
            />
          </div>

          {/* Mục tiêu */}
          <div className="space-y-2">
            <Label htmlFor="goal">Mục tiêu</Label>
            <Input
              id="goal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="VD: Trao 500 phần quà cho người nghèo"
            />
          </div>

          {/* Quận/Huyện */}
          <div className="space-y-2">
            <Label htmlFor="district">
              Quận/Huyện <span className="text-red-600">*</span>
            </Label>
            <Select value={district} onValueChange={setDistrict} required>
              <SelectTrigger>
                <SelectValue placeholder="Chọn quận/huyện" />
              </SelectTrigger>
              <SelectContent>
                {DISTRICTS.map((d) => (
                  <SelectItem key={d.value} value={d.value}>
                    {d.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Địa chỉ chi tiết */}
          <div className="space-y-2">
            <Label htmlFor="addressDetail">
              Địa chỉ chi tiết <span className="text-red-600">*</span>
            </Label>
            <Input
              id="addressDetail"
              value={addressDetail}
              onChange={(e) => setAddressDetail(e.target.value)}
              placeholder="VD: 123 Đường ABC, Phường XYZ"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Thời gian và số lượng */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            Thời gian và số lượng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ngày bắt đầu */}
            <div className="space-y-2">
              <Label htmlFor="startDate">
                Ngày bắt đầu <span className="text-red-600">*</span>
              </Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            {/* Ngày kết thúc */}
            <div className="space-y-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Số lượng mục tiêu */}
            <div className="space-y-2">
              <Label htmlFor="targetVolunteers">
                Số lượng tình nguyện viên mục tiêu <span className="text-red-600">*</span>
              </Label>
              <Input
                id="targetVolunteers"
                type="number"
                min="1"
                value={targetVolunteers}
                onChange={(e) => setTargetVolunteers(parseInt(e.target.value) || 0)}
                placeholder="50"
                required
              />
            </div>

            {/* Số lượng tối đa */}
            <div className="space-y-2">
              <Label htmlFor="maxVolunteers">
                Số lượng tối đa <span className="text-red-600">*</span>
              </Label>
              <Input
                id="maxVolunteers"
                type="number"
                min="1"
                value={maxVolunteers}
                onChange={(e) => setMaxVolunteers(parseInt(e.target.value) || 0)}
                placeholder="100"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hình ảnh */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-purple-600" />
            Hình ảnh
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Cover Image */}
          <div className="space-y-2">
            <Label>Ảnh bìa</Label>
            {!coverImagePreview ? (
              <div
                onClick={() => document.getElementById("coverImage")?.click()}
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-teal-500 transition-colors"
              >
                <input
                  id="coverImage"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverImageChange}
                  className="hidden"
                />
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click để tải ảnh bìa lên</p>
                <p className="text-xs text-gray-400 mt-1">PNG, JPG (max. 5MB)</p>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={coverImagePreview}
                  alt="Cover preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeCoverImage}
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Additional Images */}
          <div className="space-y-2">
            <Label>Ảnh bổ sung (Tối đa 10 ảnh)</Label>
            <div
              onClick={() => document.getElementById("images")?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-teal-500 transition-colors"
            >
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImagesChange}
                className="hidden"
              />
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click để tải nhiều ảnh lên</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG (max. 5MB mỗi ảnh)</p>
            </div>

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/socialorg/manage-events")}
          disabled={submitting}
        >
          Hủy
        </Button>
        <Button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700"
          disabled={submitting}
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
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
