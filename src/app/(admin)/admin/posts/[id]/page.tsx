"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllPosts, type Post } from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumb from "@/components/Breadcrumb";
import { MdArrowBack } from "react-icons/md";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch post tu list API vi khong co detail endpoint
  const fetchPost = async () => {
    try {
      setLoading(true);
      // Lay tat ca posts va tim post theo id
      const response = await getAllPosts(undefined, undefined, 1, 1000);
      const foundPost = response.items.find((p) => p.id === id);

      if (foundPost) {
        setPost(foundPost);
      } else {
        toast.error("Không tìm thấy bài viết");
      }
    } catch (error) {
      console.error("Loi fetch post:", error);
      toast.error("Không thể tải thông tin bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost();
    }
  }, [id]);

  // Format ngay thang
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Không xác định";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#008080]"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy thông tin</p>
        <Button onClick={() => router.push("/admin/posts")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý bài viết", href: "/admin/posts" },
          { label: "Chi tiết" }
        ]}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/admin/posts")}
          >
            <MdArrowBack className="mr-2" />
            Quay lại
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Chi tiết Bài viết
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Thong tin co ban */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin bài viết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Tiêu đề</p>
              <p className="font-semibold text-lg text-gray-900 mt-1">
                {post.title}
              </p>
            </div>

            {post.content && (
              <div>
                <p className="text-sm text-gray-500">Nội dung</p>
                <p className="text-gray-900 mt-1 whitespace-pre-wrap">
                  {post.content}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <p className="text-sm text-gray-500">Ngày tạo</p>
                <p className="font-medium text-gray-900">
                  {formatDate(post.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày cập nhật</p>
                <p className="font-medium text-gray-900">
                  {formatDate(post.updatedAt)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thong tin to chuc */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tổ chức</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={post.organization.organizationProfiles?.avatarUrl}
                  alt={post.organization.organizationProfiles?.organizationName || "Org"}
                />
                <AvatarFallback className="bg-[#008080] text-white text-xl">
                  {post.organization.organizationProfiles?.organizationName?.charAt(0) || "O"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm text-gray-500">Tên tổ chức</p>
                <p className="font-semibold text-lg text-gray-900">
                  {post.organization.organizationProfiles?.organizationName || "Không rõ"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thong tin ky thuat
        <Card>
          <CardHeader>
            <CardTitle>Thông tin kỹ thuật</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Post ID</p>
                <p className="font-medium text-gray-900 font-mono text-xs">
                  {post.id}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Organization ID</p>
                <p className="font-medium text-gray-900 font-mono text-xs">
                  {post.organizationId}
                </p>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}
