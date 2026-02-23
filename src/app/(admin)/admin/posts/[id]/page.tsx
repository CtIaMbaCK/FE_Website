"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAllPosts, type Post } from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Breadcrumb from "@/components/Breadcrumb";
import { MdArrowBack, MdCalendarToday, MdOutlineBusiness, MdNotes, MdAccessTime } from "react-icons/md";

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
    <div className="space-y-8 font-sans pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Breadcrumb */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl px-6 py-4 shadow-sm border border-white/50 inline-flex items-center">
          <Breadcrumb
            items={[
              { label: "Quản lý bài viết", href: "/admin/posts" },
              { label: "Chi tiết bài viết" }
            ]}
          />
        </div>

        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => router.push("/admin/posts")}
          className="bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-sm rounded-xl h-11 px-6 font-bold transition-all flex items-center gap-2"
        >
          <MdArrowBack size={20} />
          Quay lại
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Post Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
            
            <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-6">{post.title}</h2>
            
            {post.content && (
              <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 mb-8">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                   <MdNotes className="text-lg" /> Nội dung bài viết
                </h3>
                <p className="text-slate-700 leading-relaxed text-base whitespace-pre-wrap">{post.content}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-100 mt-8">
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MdCalendarToday /> Ngày tạo
                    </p>
                    <p className="text-slate-900 font-medium">{formatDate(post.createdAt)}</p>
                 </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-transparent hover:border-slate-100 transition-colors">
                 <div className="flex-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <MdAccessTime /> Ngày cập nhật
                    </p>
                    <p className="text-slate-900 font-medium">{formatDate(post.updatedAt)}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Organization Info */}
        <div className="space-y-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 p-8 sticky top-24">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6 pb-4 border-b border-slate-100">
              <span className="w-8 h-8 rounded-xl bg-teal-50 flex items-center justify-center text-[#008080]">
                <MdOutlineBusiness size={20} />
              </span>
              Thông tin tổ chức
            </h3>
            
            <div className="flex flex-col items-center text-center space-y-4">
               <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#008080] to-[#00A79D] rounded-full blur-md opacity-20"></div>
                  <Avatar className="w-24 h-24 border-4 border-white shadow-xl relative z-10">
                    <AvatarImage
                      src={post.organization.organizationProfiles?.avatarUrl}
                      alt={post.organization.organizationProfiles?.organizationName || "Org"}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-[#008080] to-[#00A79D] text-white text-3xl font-black">
                      {post.organization.organizationProfiles?.organizationName?.charAt(0) || "O"}
                    </AvatarFallback>
                  </Avatar>
               </div>
               
               <div>
                 <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Tên tổ chức đăng bài</p>
                 <p className="font-extrabold text-xl text-slate-900">
                   {post.organization.organizationProfiles?.organizationName || "Chưa cập nhật"}
                 </p>
               </div>
               
               {/* <div className="w-full h-px bg-slate-100 my-4"></div> */}
               
               {/* Contact details for context if needed */}
               {/* <div className="w-full text-left space-y-3">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                     <p className="text-xs text-slate-500 font-bold mb-1">Email đăng ký</p>
                     <p className="text-sm font-medium text-slate-800 break-all">{post.organization.email || "Chưa có"}</p>
                  </div>
                  {post.organization.phoneNumber && (
                     <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <p className="text-xs text-slate-500 font-bold mb-1">Số điện thoại</p>
                        <p className="text-sm font-medium text-slate-800">{post.organization.phoneNumber}</p>
                     </div>
                  )}
               </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
