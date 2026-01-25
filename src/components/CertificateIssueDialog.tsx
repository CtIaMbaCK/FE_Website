"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  getCertificateTemplates,
  issueCertificate,
  CertificateTemplate,
} from "@/services/volunteer-rewards.service";

interface CertificateIssueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  volunteerId: string;
  volunteerName: string;
}

export default function CertificateIssueDialog({
  open,
  onOpenChange,
  volunteerId,
  volunteerName,
}: CertificateIssueDialogProps) {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // Load templates when dialog opens
  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const data = await getCertificateTemplates();
      // Filter only active templates
      const activeTemplates = data.filter((t: CertificateTemplate) => t.isActive);
      setTemplates(activeTemplates);

      // Auto-select first template if available
      if (activeTemplates.length > 0 && !selectedTemplateId) {
        setSelectedTemplateId(activeTemplates[0].id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
      toast.error("Lỗi khi tải danh sách mẫu: " + errorMessage);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const handleIssue = async () => {
    if (!selectedTemplateId) {
      toast.error("Vui lòng chọn mẫu chứng nhận");
      return;
    }

    try {
      setLoading(true);
      await issueCertificate({
        templateId: selectedTemplateId,
        volunteerId: volunteerId,
        notes: notes.trim() || undefined,
      });

      toast.success(`Đã cấp chứng nhận cho ${volunteerName}`);
      setNotes("");
      setSelectedTemplateId("");
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Cấp chứng nhận</DialogTitle>
          <DialogDescription>
            Cấp chứng nhận cho tình nguyện viên: <span className="font-semibold text-gray-900">{volunteerName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Template Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Chọn mẫu chứng nhận <span className="text-red-500">*</span>
            </label>
            {loadingTemplates ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-600">Đang tải mẫu...</span>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed">
                <p className="text-sm text-gray-600">Chưa có mẫu chứng nhận nào</p>
                <p className="text-xs text-gray-500 mt-1">
                  Vui lòng tạo mẫu chứng nhận trước
                </p>
              </div>
            ) : (
              <>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn mẫu chứng nhận" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Template Preview */}
                {selectedTemplate && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                    <div className="flex gap-3">
                      <img
                        src={selectedTemplate.templateImageUrl}
                        alt={selectedTemplate.name}
                        className="w-24 h-16 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm text-gray-900">
                          {selectedTemplate.name}
                        </p>
                        {selectedTemplate.description && (
                          <p className="text-xs text-gray-600 mt-1">
                            {selectedTemplate.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Ghi chú (tùy chọn)
            </label>
            <Textarea
              placeholder="Nhập ghi chú về chứng nhận này..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            onClick={handleIssue}
            disabled={loading || !selectedTemplateId || templates.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang cấp...
              </>
            ) : (
              "Cấp chứng nhận"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
