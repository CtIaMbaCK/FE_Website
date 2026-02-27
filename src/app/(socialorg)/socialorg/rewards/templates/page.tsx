'use client';

import { useState, useEffect } from 'react';
import {
  getCertificateTemplates,
  deleteCertificateTemplate,
  createCertificateTemplate,
  uploadCertificateImage,
  type CertificateTemplate,
} from '@/services/volunteer-rewards.service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Trash2, FilePlus, Eye, Upload } from 'lucide-react';
import Breadcrumb from '@/components/Breadcrumb';
import CertificateEditor from '@/components/CertificateEditor';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [textBoxConfig, setTextBoxConfig] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const data = await getCertificateTemplates();
      console.log('📋 Templates data:', data);
      setTemplates(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error('❌ Lỗi khi tải templates:', error);
      toast.error('Lỗi khi tải danh sách mẫu: ' + error.message);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Kiểm tra file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    // Kiểm tra file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    try {
      setUploading(true);
      const result = await uploadCertificateImage(file);
      setUploadedImageUrl(result.imageUrl);
      toast.success('Upload ảnh thành công!');
    } catch (error: any) {
      toast.error('Lỗi khi upload ảnh: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!uploadedImageUrl) {
      toast.error('Vui lòng upload ảnh template trước');
      return;
    }

    if (!textBoxConfig) {
      toast.error('Vui lòng thiết lập vị trí text box trên ảnh');
      return;
    }

    // 🔍 DEBUG: Log textBoxConfig trước khi gửi
    console.log('📤 Sending textBoxConfig:', JSON.stringify(textBoxConfig, null, 2));

    try {
      await createCertificateTemplate({
        name: formData.name,
        description: formData.description,
        templateImageUrl: uploadedImageUrl,
        textBoxConfig,
      });

      toast.success('Tạo mẫu chứng nhận thành công!');
      setOpen(false);
      resetForm();
      loadTemplates();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
    });
    setUploadedImageUrl('');
    setTextBoxConfig(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa mẫu này?')) return;
    try {
      await deleteCertificateTemplate(id);
      toast.success('Xóa mẫu thành công!');
      loadTemplates();
    } catch (error: any) {
      toast.error('Lỗi: ' + error.message);
    }
  };

  const handleDialogChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      resetForm();
    }
  };

  if (loading) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen pb-10">
      <div className="mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center mb-4">
          <Breadcrumb
            items={[
              { label: "Khen thưởng", href: "/socialorg/rewards" },
              { label: "Quản lý mẫu chứng nhận" },
            ]}
          />
        </div>
      </div>

      <div className="mx-auto px-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-2 h-10 bg-gradient-to-b from-[#008080] to-[#00A79D] rounded-full"></div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mẫu Chứng nhận</h1>
              <p className="text-sm font-medium text-slate-500 mt-1">Quản lý các mẫu chứng nhận cho TNV</p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={handleDialogChange}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-[#008080] hover:bg-[#00A79D] text-white shadow-sm h-11 px-6 rounded-xl font-medium transition-all">
                <FilePlus className="w-4 h-4" />
                Tạo mẫu mới
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 shadow-xl">
              <DialogHeader>
                <DialogTitle className="text-xl font-black text-slate-800">Tạo mẫu chứng nhận mới</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6 mt-4">
                {/* Bước 1: Thông tin cơ bản */}
                <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#008080]/10 text-[#008080] text-sm">1</span>
                    Thông tin mẫu
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-slate-700">Tên mẫu <span className="text-red-500">*</span></Label>
                      <Input
                        required
                        placeholder="VD: Chứng nhận TNV xuất sắc"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="h-11 bg-white border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-bold text-slate-700">Mô tả</Label>
                      <Textarea
                        placeholder="Mô tả về mẫu chứng nhận..."
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={2}
                        className="resize-none bg-white border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* Bước 2: Upload ảnh */}
                <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#008080]/10 text-[#008080] text-sm">2</span>
                    Upload ảnh template <span className="text-red-500">*</span>
                  </h3>
                  <div>
                    <Label htmlFor="image-upload" className="text-sm font-medium text-slate-600 block mb-2">Chọn file ảnh (JPEG, PNG, WEBP - Tối đa 5MB)</Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        className="flex-1 h-11 bg-white border-slate-200 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#008080]/10 file:text-[#008080] hover:file:bg-[#008080]/20 rounded-xl cursor-pointer"
                      />
                      {uploading && <span className="text-sm font-bold text-[#008080] flex items-center gap-2"><div className="w-4 h-4 border-2 border-[#008080] border-t-transparent rounded-full animate-spin"></div>Đang tải...</span>}
                    </div>
                    {uploadedImageUrl && (
                      <div className="mt-3 inline-flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm font-bold gap-1.5">
                        <Upload className="w-4 h-4" />
                        Đã tải ảnh thành công!
                      </div>
                    )}
                  </div>
                </div>

                {/* Bước 3: Drag-drop editor */}
                {uploadedImageUrl && (
                  <div className="space-y-4 bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#008080]/10 text-[#008080] text-sm">3</span>
                      Thiết lập vị trí text <span className="text-red-500">*</span>
                    </h3>
                    <p className="text-sm font-medium text-slate-500">
                      Kéo thả các hộp text trên ảnh để chọn vị trí hiển thị thông tin trên chứng nhận
                    </p>
                    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      <CertificateEditor
                        imageUrl={uploadedImageUrl}
                        onConfigChange={setTextBoxConfig}
                      />
                    </div>
                  </div>
                )}

                {/* Submit buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                  <Button type="button" variant="outline" onClick={() => handleDialogChange(false)} className="h-11 px-6 rounded-xl font-bold border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all">
                    Hủy bỏ
                  </Button>
                  <Button
                    type="submit"
                    className="h-11 px-8 rounded-xl font-bold bg-[#008080] hover:bg-[#00A79D] text-white shadow-sm transition-all"
                    disabled={!uploadedImageUrl || !textBoxConfig}
                  >
                    Tạo mẫu chứng nhận
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mx-auto px-6">
        {templates.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-8 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
               <FilePlus className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-lg font-bold text-slate-700 mb-2">Chưa có mẫu chứng nhận nào</p>
            <p className="text-sm text-slate-500 mb-6">Hãy tạo mẫu đầu tiên để bắt đầu cấp chứng nhận cho tình nguyện viên</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white/90 backdrop-blur-md rounded-2xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col">
                <div className="relative overflow-hidden aspect-[4/3] bg-slate-50">
                  <img
                    src={template.templateImageUrl}
                    alt={template.name}
                    className="w-full h-full object-cover border-b border-slate-100 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
                    <Button variant="secondary" size="sm" className="bg-white/90 hover:bg-white text-slate-800 rounded-lg font-bold shadow-lg" asChild>
                      <a href={template.templateImageUrl} target="_blank" rel="noopener noreferrer">
                        <Eye className="w-4 h-4 mr-1.5" />
                        Xem trước
                      </a>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-500/90 hover:bg-red-500 rounded-lg shadow-lg"
                      onClick={() => handleDelete(template.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1 mb-1">{template.name}</h3>
                  {template.description ? (
                    <p className="text-sm text-slate-500 line-clamp-2 mt-auto">{template.description}</p>
                  ) : (
                     <p className="text-sm text-slate-400 italic mt-auto">Không có mô tả</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
