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
    <div className="pb-10">
      <Breadcrumb
        items={[
          { label: "Khen thưởng", href: "/socialorg/rewards" },
          { label: "Quản lý mẫu chứng nhận" },
        ]}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mẫu Chứng nhận</h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý các mẫu chứng nhận cho TNV</p>
        </div>

        <Dialog open={open} onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button>
              <FilePlus className="w-4 h-4 mr-2" />
              Tạo mẫu mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tạo mẫu chứng nhận</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              {/* Bước 1: Thông tin cơ bản */}
              <div className="space-y-3">
                <h3 className="font-semibold text-base">Bước 1: Thông tin mẫu</h3>
                <div>
                  <Label>Tên mẫu *</Label>
                  <Input
                    required
                    placeholder="VD: Chứng nhận TNV xuất sắc"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Mô tả</Label>
                  <Textarea
                    placeholder="Mô tả về mẫu chứng nhận..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={2}
                  />
                </div>
              </div>

              {/* Bước 2: Upload ảnh */}
              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold text-base">Bước 2: Upload ảnh template *</h3>
                <div>
                  <Label htmlFor="image-upload">Chọn file ảnh (JPEG, PNG, WEBP - Tối đa 5MB)</Label>
                  <div className="flex gap-2 items-center mt-1">
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="flex-1"
                    />
                    {uploading && <span className="text-sm text-gray-500">Đang upload...</span>}
                  </div>
                  {uploadedImageUrl && (
                    <div className="mt-2">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <Upload className="w-4 h-4" />
                        Upload thành công!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bước 3: Drag-drop editor */}
              {uploadedImageUrl && (
                <div className="space-y-3 border-t pt-4">
                  <h3 className="font-semibold text-base">Bước 3: Thiết lập vị trí text *</h3>
                  <p className="text-sm text-gray-600">
                    Kéo thả các hộp text trên ảnh để chọn vị trí hiển thị thông tin trên chứng nhận
                  </p>
                  <CertificateEditor
                    imageUrl={uploadedImageUrl}
                    onConfigChange={setTextBoxConfig}
                  />
                </div>
              )}

              {/* Submit buttons */}
              <div className="flex gap-2 border-t pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!uploadedImageUrl || !textBoxConfig}
                >
                  Tạo mẫu
                </Button>
                <Button type="button" variant="outline" onClick={() => handleDialogChange(false)}>
                  Hủy
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="p-6 text-center text-gray-500">
              Chưa có mẫu nào. Hãy tạo mẫu đầu tiên!
            </CardContent>
          </Card>
        ) : (
          templates.map((template) => (
            <Card key={template.id}>
              <CardHeader>
                <CardTitle className="text-lg">{template.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <img
                  src={template.templateImageUrl}
                  alt={template.name}
                  className="w-full h-48 object-cover rounded border"
                />
                {template.description && (
                  <p className="text-sm text-gray-600">{template.description}</p>
                )}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={template.templateImageUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-4 h-4 mr-1" />
                      Xem
                    </a>
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(template.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
