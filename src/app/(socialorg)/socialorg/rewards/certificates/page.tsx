"use client";

import { useState, useEffect } from "react";
import {
  getIssuedCertificates,
  issueCertificate,
  getCertificateTemplates,
  type IssuedCertificate,
  type CertificateTemplate,
} from "@/services/volunteer-rewards.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Breadcrumb from "@/components/Breadcrumb";
import { toast } from "sonner";
import { Award, Download, Mail, Users, FileText, TrendingUp } from "lucide-react";

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<IssuedCertificate[]>([]);
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [formData, setFormData] = useState({
    templateId: "",
    volunteerId: "",
    notes: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [certsData, templatesData] = await Promise.all([
        getIssuedCertificates(),
        getCertificateTemplates(),
      ]);
      setCertificates(Array.isArray(certsData) ? certsData : []);
      setTemplates(Array.isArray(templatesData) ? templatesData : []);
    } catch (error: any) {
      toast.error("Lỗi khi tải dữ liệu: " + error.message);
      setCertificates([]);
      setTemplates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setIssuing(true);
    try {
      await issueCertificate(formData);
      toast.success("Cấp chứng nhận thành công! PDF đã được tạo và gửi email.");
      setOpen(false);
      setFormData({ templateId: "", volunteerId: "", notes: "" });
      loadData();
    } catch (error: any) {
      toast.error("Lỗi: " + error.message);
    } finally {
      setIssuing(false);
    }
  };

  // Tính toán thống kê
  const totalCertificates = certificates.length;
  const uniqueVolunteers = new Set(certificates.map((c) => c.volunteerId)).size;
  const emailSentCount = certificates.filter((c) => c.emailSent).length;
  const thisYearCertificates = certificates.filter(
    (c) => new Date(c.issuedAt).getFullYear() === new Date().getFullYear()
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 font-medium">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-10">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Khen thưởng", href: "/socialorg/appreciation" },
          { label: "Chứng nhận đã cấp" },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chứng nhận đã cấp</h1>
          <p className="text-sm text-gray-500 mt-1">
            Quản lý chứng nhận cho tình nguyện viên
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              disabled={templates.length === 0}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Award className="w-4 h-4 mr-2" />
              Cấp chứng nhận mới
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cấp chứng nhận cho TNV</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <Label>Chọn mẫu chứng nhận</Label>
                <Select
                  required
                  value={formData.templateId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, templateId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn mẫu..." />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>ID Tình nguyện viên</Label>
                <Input
                  required
                  placeholder="Nhập ID của TNV"
                  value={formData.volunteerId}
                  onChange={(e) =>
                    setFormData({ ...formData, volunteerId: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>Ghi chú (tùy chọn)</Label>
                <Textarea
                  placeholder="Ghi chú về chứng nhận..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded p-3 text-sm">
                <p className="font-semibold text-blue-900">Lưu ý:</p>
                <ul className="list-disc list-inside text-blue-800 mt-1 space-y-1">
                  <li>Hệ thống sẽ tự động điền tên, điểm, ngày cấp của TNV</li>
                  <li>PDF sẽ được tạo và upload lên Cloudinary</li>
                  <li>Email sẽ được gửi kèm file PDF đến TNV</li>
                </ul>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700"
                  disabled={issuing}
                >
                  {issuing ? "Đang cấp..." : "Cấp chứng nhận"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Hủy
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Tổng số chứng nhận</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {totalCertificates}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">TNV được vinh danh</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{uniqueVolunteers}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Chứng nhận năm nay</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {thisYearCertificates}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Đã gửi email</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{emailSentCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Templates Warning */}
      {templates.length === 0 && (
        <Card className="mb-6">
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">
              Bạn cần tạo mẫu chứng nhận trước khi cấp chứng nhận.
            </p>
            <Button className="mt-3 bg-teal-600 hover:bg-teal-700" asChild>
              <a href="/socialorg/rewards/templates">Đi tới Quản lý mẫu</a>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Certificates List */}
      <div className="grid gap-4">
        {certificates.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              Chưa cấp chứng nhận nào. Hãy cấp chứng nhận đầu tiên!
            </CardContent>
          </Card>
        ) : (
          certificates.map((cert) => (
            <Card key={cert.id}>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex items-center gap-3">
                    {cert.volunteer?.volunteerProfile?.avatarUrl && (
                      <img
                        src={cert.volunteer.volunteerProfile.avatarUrl}
                        alt="Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {cert.volunteer?.volunteerProfile?.fullName || "TNV"}
                      </CardTitle>
                      <p className="text-sm text-gray-500">
                        Mẫu: {cert.template?.name || "N/A"}
                      </p>
                      <p className="text-sm text-gray-400">
                        Cấp ngày:{" "}
                        {new Date(cert.issuedAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-600">
                      {cert.volunteer?.volunteerProfile?.points || 0} điểm
                    </span>
                    {cert.emailSent && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Đã gửi email
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {cert.notes && <p className="text-gray-600 mb-3">{cert.notes}</p>}
                <Button variant="outline" size="sm" asChild>
                  <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" />
                    Tải PDF
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
