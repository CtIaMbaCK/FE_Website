"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  getOrgPosts,
  deletePost,
  CommunicationPost,
} from "@/services/communication.service";
import Breadcrumb from "@/components/Breadcrumb";
import { Search, Plus, Eye, Pencil, Trash2, FileText } from "lucide-react";

export default function BlogsPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<CommunicationPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Delete dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState<CommunicationPost | null>(null);
  const [deleting, setDeleting] = useState(false);

  const limit = 10;

  useEffect(() => {
    loadPosts();
  }, [page, searchTerm]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await getOrgPosts({
        page,
        limit,
        search: searchTerm || undefined,
      });
      setPosts(response.data || []);
      setTotal(response.meta?.total || 0);
      setTotalPages(Math.ceil((response.meta?.total || 0) / limit));
    } catch (error: any) {
      toast.error("Lỗi khi tải danh sách bài viết: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handleDeleteClick = (post: CommunicationPost) => {
    setPostToDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!postToDelete) return;

    try {
      setDeleting(true);
      await deletePost(postToDelete.id);
      toast.success("Đã xóa bài viết thành công");
      setDeleteDialogOpen(false);
      setPostToDelete(null);
      loadPosts();
    } catch (error: any) {
      toast.error("Lỗi khi xóa bài viết: " + error.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-6 pt-4">
        <Breadcrumb items={[{ label: "Quản lý Truyền thông" }]} />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý Truyền thông
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Quản lý các bài viết truyền thông của tổ chức
            </p>
          </div>
          <Button
            onClick={() => router.push("/socialorg/blogs/create")}
            className="gap-2 bg-[#008080] shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tạo bài viết mới
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="p-5">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm bài viết theo tiêu đề..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-10 border-gray-200 focus:border-purple-500 focus:ring-purple-500/10"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute inset-0 w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  <p className="text-sm text-gray-600 font-medium">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <FileText className="w-12 h-12 text-gray-400 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">
                  Chưa có bài viết nào
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Bắt đầu bằng cách tạo bài viết truyền thông đầu tiên
                </p>
                <Button
                  onClick={() => router.push("/socialorg/blogs/create")}
                  size="sm"
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo bài viết mới
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="w-[50px]">STT</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead className="w-[150px]">Ngày tạo</TableHead>
                    <TableHead className="w-[150px]">Cập nhật</TableHead>
                    <TableHead className="text-right w-[280px]">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post, index) => (
                    <TableRow key={post.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium text-gray-500">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-3">
                          {post.coverImage && (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-16 h-12 object-cover rounded-md border border-gray-200"
                            />
                          )}
                          <div>
                            <p className="font-medium text-gray-900 line-clamp-1">
                              {post.title}
                            </p>
                            <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                              {post.content.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium text-purple-700 border-purple-200 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-300"
                            onClick={() =>
                              window.open(`/posts/${post.id}`, "_blank")
                            }
                          >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Xem
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium text-blue-700 border-blue-200 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300"
                            onClick={() =>
                              router.push(`/socialorg/blogs/${post.id}/edit`)
                            }
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1.5" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-3 text-xs font-medium text-red-700 border-red-200 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
                            onClick={() => handleDeleteClick(post)}
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                            Xóa
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Hiển thị {(page - 1) * limit + 1} đến{" "}
                {Math.min(page * limit, total)} trong tổng {total} bài viết
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trước
                </Button>
                <span className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Sau
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa bài viết</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa bài viết "{postToDelete?.title}"? Hành
              động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={deleting}
            >
              Hủy
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDeleteConfirm}
              disabled={deleting}
            >
              {deleting ? "Đang xóa..." : "Xóa"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
