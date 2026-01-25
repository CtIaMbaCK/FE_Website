"use client";

import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/services/cloudinary.service";
import { toast } from "sonner";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadZoneProps {
  label: string;
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
}

export default function ImageUploadZone({
  label,
  currentImageUrl,
  onImageUploaded,
  onImageRemoved,
}: ImageUploadZoneProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setImageUrl(url);
      onImageUploaded(url);
      toast.success("Đã tải ảnh lên thành công");
    } catch (error: any) {
      toast.error(error.message || "Lỗi khi tải ảnh lên");
    } finally {
      setUploading(false);
      // Reset input để có thể chọn lại cùng file
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveImage = () => {
    setImageUrl("");
    if (onImageRemoved) {
      onImageRemoved();
    } else {
      onImageUploaded("");
    }
    toast.info("Đã xóa ảnh");
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium text-gray-700">{label}</Label>

      {/* Upload Zone */}
      {!imageUrl ? (
        <div
          onClick={handleClick}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
            uploading
              ? "border-gray-300 bg-gray-50"
              : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-teal-600 animate-spin" />
              <p className="text-sm text-gray-600 font-medium">Đang tải lên...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Tải ảnh lên</p>
              <p className="text-xs text-gray-400">PNG, JPG (max. 5MB)</p>
            </div>
          )}
        </div>
      ) : (
        /* Image Preview */
        <div className="relative border-2 border-gray-200 rounded-lg overflow-hidden group">
          <img
            src={imageUrl}
            alt={label}
            className="w-full h-48 object-cover"
          />

          {/* Overlay with actions */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleClick}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4" />
              Đổi ảnh
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Xóa
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}
    </div>
  );
}
