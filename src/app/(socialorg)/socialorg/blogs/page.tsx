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
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center mb-4">
          <Breadcrumb items={[{ label: "Quản lý Truyền thông" }]} />
        </div>
      </div>

      <div className="mx-auto px-6 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Quản lý Truyền thông
              </h1>
              <p className="text-sm font-medium text-slate-500 mt-1">
                Quản lý các bài viết truyền thông của tổ chức
              </p>
            </div>
          </div>
          <Button
            onClick={() => router.push("/socialorg/blogs/create")}
            className="gap-2 bg-[#008080] hover:bg-[#00A79D] text-white shadow-sm h-11 px-6 rounded-xl font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            Tạo bài viết mới
          </Button>
        </div>

        {/* Search */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 mb-6 p-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <Input
              placeholder="Tìm kiếm bài viết theo tiêu đề..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-12 h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl w-full font-medium"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-[#008080]/20 border-t-[#008080] rounded-full animate-spin"></div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-500">
                    Đang tải dữ liệu...
                  </p>
                </div>
              </div>
            ) : posts.length === 0 ? (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-10 h-10 text-slate-300" />
                </div>
                <p className="text-lg font-bold text-slate-700 mb-2">
                  Chưa có bài viết nào
                </p>
                <p className="text-sm text-slate-500 mb-6">
                  Bắt đầu bằng cách tạo bài viết truyền thông đầu tiên
                </p>
                <Button
                  onClick={() => router.push("/socialorg/blogs/create")}
                  className="bg-[#008080] hover:bg-[#00A79D] text-white rounded-xl h-11 px-6 font-medium shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo bài viết mới
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-slate-100 hover:bg-transparent">
                    <TableHead className="w-[80px] text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50 py-4">STT</TableHead>
                    <TableHead className="text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50 py-4">Tiêu đề</TableHead>
                    <TableHead className="w-[150px] text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50 py-4">Ngày tạo</TableHead>
                    <TableHead className="w-[150px] text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50 py-4">Cập nhật</TableHead>
                    <TableHead className="text-right w-[280px] text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/50 py-4">
                      Thao tác
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {posts.map((post, index) => (
                    <TableRow key={post.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <TableCell className="font-bold text-slate-500 py-4">
                        <span className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs">
                           {(page - 1) * limit + index + 1}
                        </span>
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex items-start gap-4">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-16 h-16 object-cover rounded-xl border border-slate-100 shadow-sm"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                              <FileText className="w-6 h-6 text-slate-300" />
                            </div>
                          )}
                          <div className="flex flex-col justify-center min-h-[4rem]">
                            <p className="font-bold text-slate-800 line-clamp-1">
                              {post.title}
                            </p>
                            <p className="text-xs font-medium text-slate-500 line-clamp-2 mt-1">
                              {post.content.substring(0, 100)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-600 py-4">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-sm font-medium text-slate-600 py-4">
                        {new Date(post.updatedAt).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="py-4">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 rounded-lg font-bold text-[#008080] border-[#008080]/20 bg-[#008080]/5 hover:bg-[#008080]/10 hover:border-[#008080]/30 transition-all"
                            onClick={() =>
                              window.open(`/posts/${post.id}`, "_blank")
                            }
                          >
                            <Eye className="w-4 h-4 mr-1.5" />
                            Xem
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 rounded-lg font-bold text-indigo-600 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-300 transition-all"
                            onClick={() =>
                              router.push(`/socialorg/blogs/${post.id}/edit`)
                            }
                          >
                            <Pencil className="w-4 h-4 mr-1.5" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-9 px-3 rounded-lg font-bold text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-300 transition-all"
                            onClick={() => handleDeleteClick(post)}
                          >
                            <Trash2 className="w-4 h-4 mr-1.5" />
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
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
              <div className="text-sm font-medium text-slate-500">
                Hiển thị <span className="text-slate-700 font-bold">{(page - 1) * limit + 1}</span> đến{" "}
                <span className="text-slate-700 font-bold">{Math.min(page * limit, total)}</span> trong tổng <span className="text-slate-700 font-bold">{total}</span> bài viết
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg font-medium border-slate-200 hover:bg-slate-100 text-slate-600"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trước
                </Button>
                <div className="h-9 px-4 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-sm font-bold text-slate-700">
                  {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg font-medium border-slate-200 hover:bg-slate-100 text-slate-600"
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
