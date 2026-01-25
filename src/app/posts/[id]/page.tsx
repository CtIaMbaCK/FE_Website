"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPublicPostDetail, CommunicationPost } from "@/services/communication.service";
import { toast } from "sonner";
import { ArrowLeft, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<CommunicationPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, [postId]);

  const loadPost = async () => {
    try {
      setLoading(true);
      const data = await getPublicPostDetail(postId);
      setPost(data);
    } catch (error: any) {
      toast.error("Lỗi khi tải bài viết: " + error.message);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
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

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/">
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Quay lại trang chủ
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Post Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
            {post.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            {post.organization?.organizationProfiles?.organizationName && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                <span className="font-medium">
                  {post.organization.organizationProfiles.organizationName}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <time dateTime={post.createdAt}>
                {new Date(post.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.coverImage && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        {/* Post Content */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <div className="text-gray-800 leading-relaxed whitespace-pre-line">
              {post.content}
            </div>
          </div>
        </div>

        {/* Organization Info */}
        {post.organization?.organizationProfiles && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              {post.organization.organizationProfiles.avatarUrl && (
                <img
                  src={post.organization.organizationProfiles.avatarUrl}
                  alt={post.organization.organizationProfiles.organizationName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                />
              )}
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổ chức</p>
                <p className="text-lg font-semibold text-gray-900">
                  {post.organization.organizationProfiles.organizationName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Cập nhật lần cuối:{" "}
              {new Date(post.updatedAt).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
            <Link href="/">
              <Button variant="outline" size="sm">
                Xem thêm bài viết khác
              </Button>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
