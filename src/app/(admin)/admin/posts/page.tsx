"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { getAllPosts, type Post } from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Breadcrumb from "@/components/Breadcrumb";
import { MdSearch, MdVisibility, MdCalendarToday, MdOutlineBusiness, MdNotes } from "react-icons/md";

export default function PostsPage() {
  // State quan ly
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch data tu API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts(
        search || undefined,
        undefined,
        page,
        limit
      );
      setPosts(response.items);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Loi fetch posts:", error);
      toast.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lai khi thay doi page
  useEffect(() => {
    fetchPosts();
  }, [page]);

  // Xu ly search voi debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchPosts();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Format ngay thang
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Cat ngan noi dung
  const truncateContent = (content?: string, maxLength = 100) => {
    if (!content) return "Không có nội dung";
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + "...";
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý bài viết" }
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Quản lý Bài viết</h1>
        <p className="text-gray-600 mt-2">Tổng số: {total} bài viết</p>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tiêu đề bài viết..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Table */}
      <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 border-b border-slate-100 hover:bg-slate-50/50">
              <TableHead className="w-[80px] font-bold text-slate-500 text-xs uppercase tracking-wider py-4 pl-6">Logo</TableHead>
              <TableHead className="min-w-[250px] font-bold text-slate-500 text-xs uppercase tracking-wider">Tiêu đề</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Tổ Chức Xã Hội</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Nội dung</TableHead>
              <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Ngày đăng</TableHead>
              <TableHead className="text-right font-bold text-slate-500 text-xs uppercase tracking-wider pr-6">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow key="loading-row">
                <TableCell colSpan={6} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 border-3 border-gray-200 rounded-full"></div>
                      <div className="absolute inset-0 w-10 h-10 border-3 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">Đang tải dữ liệu...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : posts.length === 0 ? (
              <TableRow key="empty-row">
                <TableCell colSpan={6} className="text-center py-16 bg-gray-50/30">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <MdNotes className="w-7 h-7 text-gray-400" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">
                        Không tìm thấy bài viết nào
                      </p>
                      <p className="text-xs text-gray-500">
                        Thử điều chỉnh tìm kiếm của bạn
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              posts.map((post) => (
                <TableRow key={post.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <TableCell className="pl-6">
                    <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                      <AvatarImage
                        src={post.organization.organizationProfiles?.avatarUrl}
                        alt={post.organization.organizationProfiles?.organizationName || "Org"}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-teal-500 to-teal-600 text-white font-bold text-sm">
                        {post.organization.organizationProfiles?.organizationName?.charAt(0) || "O"}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-800 text-sm line-clamp-2">
                       {post.title}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600">
                    {post.organization.organizationProfiles?.organizationName || "Không rõ"}
                  </TableCell>
                  <TableCell>
                     <p className="text-xs text-slate-500 line-clamp-2 max-w-sm">
                       {truncateContent(post.content, 100)}
                     </p>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-500">
                    {formatDate(post.createdAt)}
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-end gap-2 pr-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          window.location.href = `/admin/posts/${post.id}`;
                        }}
                        className="h-9 px-3 rounded-xl border-slate-200 text-slate-600 hover:text-[#008080] hover:bg-white hover:border-[#008080]/30 shadow-sm transition-all text-xs font-bold"
                      >
                        <MdVisibility className="mr-1.5 w-4 h-4" />
                        Chi tiết
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 px-2">
          <div className="text-sm text-slate-500 font-medium">
            Hiển thị bài viết {" "}
            <span className="font-bold text-slate-800">
              {(page - 1) * limit + 1}
            </span>{" "}
            đến {" "}
            <span className="font-bold text-slate-800">
              {Math.min(page * limit, total)}
            </span>{" "}
            trên <span className="font-bold text-slate-800">{total}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1.5 rounded-2xl border border-slate-100 shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-10 px-4 rounded-xl border-transparent bg-transparent hover:bg-slate-100 text-slate-600 disabled:opacity-40 font-bold transition-colors"
            >
              Trước
            </Button>
            <div className="flex items-center">
              <span className="w-10 h-10 flex items-center justify-center text-sm font-black text-white bg-[#008080] rounded-xl shadow-md">
                {page}
              </span>
              <span className="px-3 text-sm font-bold text-slate-400">/ {totalPages}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="h-10 px-4 rounded-xl border-transparent bg-transparent hover:bg-slate-100 text-slate-600 disabled:opacity-40 font-bold transition-colors"
            >
              Sau
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
