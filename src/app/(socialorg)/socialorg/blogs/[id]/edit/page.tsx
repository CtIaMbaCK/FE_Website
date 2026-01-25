"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { getPostDetail, updatePost } from "@/services/communication.service";
import Breadcrumb from "@/components/Breadcrumb";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [currentCoverImage, setCurrentCoverImage] = useState<string>("");

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await getPostDetail(postId);
      setTitle(data.title);
      setContent(data.content);
      if (data.coverImage) {
        setCurrentCoverImage(data.coverImage);
        setImagePreview(data.coverImage);
      }
    } catch (error: any) {
      toast.error("Lỗi khi tải bài viết: " + error.message);
      router.push("/socialorg/blogs");
    } finally {
      setLoading(false);
    }
  };

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
    setCurrentCoverImage("");
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
      await updatePost(postId, {
        title: title.trim(),
        content: content.trim(),
        coverImage: coverImage || undefined,
      });
      toast.success("Đã cập nhật bài viết thành công!");
      router.push("/socialorg/blogs");
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-5xl mx-auto px-6 pt-4">
        <Breadcrumb
          items={[
            { label: "Quản lý Truyền thông", href: "/socialorg/blogs" },
            { label: "Chỉnh sửa bài viết" },
          ]}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 py-4">
        <Link href="/socialorg/blogs">
          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Quay lại
          </Button>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-4">
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-8 mb-8">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white/10 backdrop-blur-sm rounded-xl">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white">
                  Chỉnh sửa bài viết
                </h1>
                <p className="text-purple-100 text-sm mt-1">
                  Cập nhật thông tin bài viết của bạn
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="p-6 sm:p-8 space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Tiêu đề <span className="text-red-600">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                  className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500/10"
                  required
                />
              </div>

              {/* Cover Image */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Ảnh bìa
                </Label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover rounded-lg border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <label htmlFor="coverImage" className="cursor-pointer">
                      <span className="text-sm text-purple-600 font-medium hover:text-purple-700">
                        Tải ảnh lên
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
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
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF tối đa 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                  Nội dung <span className="text-red-600">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Nhập nội dung bài viết..."
                  rows={12}
                  className="resize-none border-gray-300 focus:border-purple-500 focus:ring-purple-500/10"
                  required
                />
                <p className="text-xs text-gray-500">
                  {content.length} ký tự
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/socialorg/blogs")}
                  disabled={submitting}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    "Cập nhật bài viết"
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
