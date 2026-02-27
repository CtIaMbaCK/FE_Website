"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createPost } from "@/services/communication.service";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

export default function CreateBlogPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setCoverImage(null);
    setImagePreview("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    if (!content.trim()) {
      toast.error("Vui lòng nhập nội dung");
      return;
    }

    try {
      setSubmitting(true);
      await createPost({
        title: title.trim(),
        content: content.trim(),
        coverImage: coverImage || undefined,
      });
      toast.success("Đã tạo bài viết thành công!");
      router.push("/socialorg/blogs");
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center mb-4">
          <Breadcrumb
            items={[
              { label: "Quản lý Truyền thông", href: "/socialorg/blogs" },
              { label: "Tạo bài viết mới" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto px-6 mb-4">
        <Link href="/socialorg/blogs">
          <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl h-10 px-4 transition-colors font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại danh sách
          </Button>
        </Link>
      </div>

      <div className="mx-auto px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-2 h-10 bg-gradient-to-b from-purple-600 to-pink-500 rounded-full"></div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Tạo bài viết mới
            </h1>
            <p className="text-sm font-medium text-slate-500 mt-1">
              Chia sẻ hoạt động và câu chuyện của tổ chức
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 space-y-8">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-bold text-slate-700">
                  Tiêu đề <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="h-12 bg-gray-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/10 rounded-xl w-full"
                  required
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">
                  Ảnh bìa
                </Label>
                {imagePreview ? (
                  <div className="relative group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-80 object-cover rounded-2xl border border-slate-200 shadow-sm"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={removeImage}
                        className="bg-white text-red-600 p-3 rounded-xl hover:bg-red-50 font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all"
                      >
                        <X className="w-5 h-5" />
                        Bỏ chọn ảnh
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 bg-slate-50/50 rounded-2xl p-10 text-center hover:border-purple-500 hover:bg-purple-50/50 transition-all duration-300 group">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-slate-400 group-hover:text-purple-500" />
                    </div>
                    <label htmlFor="coverImage" className="cursor-pointer">
                      <span className="text-sm text-purple-600 font-bold hover:text-purple-700">
                        Tải ảnh lên
                      </span>
                      <span className="text-sm text-slate-500 font-medium ml-1">
                        hoặc kéo thả vào đây
                      </span>
                      <input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-slate-400 font-medium mt-2">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-bold text-slate-700">
                  Nội dung <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung bài viết..."
                  rows={12}
                  className="resize-none bg-gray-50/50 border-slate-200 focus:border-purple-500 focus:ring-purple-500/10 rounded-xl w-full p-4"
                  required
                />
                <p className="text-xs font-medium text-slate-500 text-right mt-2">
                  {content.length} ký tự
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/socialorg/blogs")}
                  disabled={submitting}
                  className="h-12 px-6 rounded-xl font-bold bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 transition-all shadow-sm"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="h-12 px-8 rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
                      Đang tạo...
                    </>
                  ) : (
                    "Tạo bài viết"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
