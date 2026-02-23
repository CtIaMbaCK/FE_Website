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
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Cấp chứng nhận
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium text-base mt-2">
            Cấp chứng nhận cho: <strong className="text-slate-800">{volunteerName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Template Selection */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Chọn mẫu chứng nhận <span className="text-red-500">*</span>
            </label>
            {loadingTemplates ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-sm text-slate-600 font-bold uppercase tracking-wider">Đang tải mẫu...</span>
              </div>
            ) : templates.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-600 font-bold">Chưa có mẫu chứng nhận nào</p>
                <p className="text-xs text-slate-500 mt-2 font-medium">
                  Vui lòng tạo mẫu chứng nhận trước
                </p>
              </div>
            ) : (
              <>
                <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                  <SelectTrigger className="w-full h-11 border-slate-200 rounded-xl focus:ring-blue-500/10 focus:border-blue-500 bg-gray-50/50 shadow-sm font-medium">
                    <SelectValue placeholder="Chọn mẫu chứng nhận" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-slate-200 shadow-xl font-medium">
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id} className="cursor-pointer">
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Template Preview */}
                {selectedTemplate && (
                  <div className="mt-4 p-4 bg-blue-50/50 rounded-2xl border border-blue-100 shadow-sm transition-all hover:bg-blue-50">
                    <div className="flex gap-4 items-center">
                      <div className="w-24 h-16 rounded-lg overflow-hidden border border-slate-200 shadow-sm shrink-0 bg-white">
                        <img
                          src={selectedTemplate.templateImageUrl}
                          alt={selectedTemplate.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm text-slate-800">
                          {selectedTemplate.name}
                        </p>
                        {selectedTemplate.description && (
                          <p className="text-xs text-slate-500 font-medium mt-1 line-clamp-2 leading-relaxed">
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
          <div className="space-y-3">
            <label className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Ghi chú (tùy chọn)
            </label>
            <Textarea
              placeholder="Nhập ghi chú về chứng nhận này..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="resize-none border-slate-200 focus:border-blue-500 focus:ring-blue-500/10 rounded-xl bg-gray-50/50 shadow-sm"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 gap-3 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-all w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            onClick={handleIssue}
            disabled={loading || !selectedTemplateId || templates.length === 0}
            className="h-11 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all w-full sm:w-auto"
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
