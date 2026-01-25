'use client';

import { useState, useEffect } from 'react';
import { getOrganizationComments, deleteVolunteerComment, createVolunteerComment, type VolunteerComment } from '@/services/volunteer-rewards.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2, Star, MessageSquarePlus } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';

export default function CommentsPage() {
  const [comments, setComments] = useState<VolunteerComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    volunteerId: '',
    comment: '',
    rating: 5,
  });

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      const data = await getOrganizationComments();
      setComments(data);
    } catch (error: any) {
      toast.error('Lỗi khi tải danh sách nhận xét: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createVolunteerComment(formData);
      toast.success('Tạo nhận xét thành công!');
      setOpen(false);
      setFormData({ volunteerId: '', comment: '', rating: 5 });
      loadComments();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa nhận xét này?')) return;
    try {
      await deleteVolunteerComment(id);
      toast.success('Xóa nhận xét thành công!');
      loadComments();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="pb-10">
      <Breadcrumb
        items={[
          { label: "Khen thưởng", href: "/socialorg/rewards" },
          { label: "Nhận xét tình nguyện viên" },
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nhận xét Tình nguyện viên</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý nhận xét và đánh giá TNV</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <MessageSquarePlus className="w-4 h-4 mr-2" />
              Tạo nhận xét mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tạo nhận xét cho TNV</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <Label>ID Tình nguyện viên</Label>
                <Input
                  required
                  placeholder="Nhập ID của TNV"
                  value={formData.volunteerId}
                  onChange={(e) => setFormData({ ...formData, volunteerId: e.target.value })}
                />
              </div>
              <div>
                <Label>Nội dung nhận xét</Label>
                <Textarea
                  required
                  placeholder="Viết nhận xét của bạn..."
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  rows={4}
                />
              </div>
              <div>
                <Label>Đánh giá (1-5 sao)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">Tạo nhận xét</Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Hủy</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {comments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Chưa có nhận xét nào. Hãy tạo nhận xét đầu tiên!
            </CardContent>
          </Card>
        ) : (
          comments.map((comment) => (
            <Card key={comment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {comment.volunteer?.volunteerProfile?.avatarUrl && (
                      <img
                        src={comment.volunteer.volunteerProfile.avatarUrl}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {comment.volunteer?.volunteerProfile?.fullName || 'TNV'}
                      </CardTitle>
                      {comment.rating && (
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < comment.rating!
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(comment.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{comment.comment}</p>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
