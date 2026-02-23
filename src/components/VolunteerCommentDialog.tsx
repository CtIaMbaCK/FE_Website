"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createVolunteerComment } from "@/services/volunteer-rewards.service";
import { toast } from "sonner";

interface VolunteerCommentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  volunteerId: string;
  volunteerName: string;
}

export default function VolunteerCommentDialog({
  open,
  onOpenChange,
  volunteerId,
  volunteerName,
}: VolunteerCommentDialogProps) {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Vui lòng nhập nhận xét");
      return;
    }

    try {
      setLoading(true);
      await createVolunteerComment({
        volunteerId,
        comment: comment.trim(),
        rating,
      });

      toast.success(`Đã gửi nhận xét cho ${volunteerName}`);
      setComment("");
      setRating(undefined);
      onOpenChange(false);
    } catch (error: any) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-[2rem] p-8">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </span>
            Khen thưởng
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium text-base mt-2">
            Viết lời nhận xét cho <strong className="text-slate-800">{volunteerName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Đánh giá sao */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Đánh giá (Tùy chọn)
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-3xl transition-transform hover:scale-110 ${
                    rating && rating >= star
                      ? "text-amber-400 drop-shadow-sm"
                      : "text-slate-200"
                  }`}
                >
                  ★
                </button>
              ))}
              {rating && (
                <button
                  type="button"
                  onClick={() => setRating(undefined)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-600 ml-3 uppercase tracking-wider underline underline-offset-4"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Nhận xét */}
          <div className="space-y-2">
            <Label htmlFor="comment" className="text-sm font-bold text-slate-600 uppercase tracking-wider">
              Nhận xét <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Viết lời nhận xét, khen ngợi tình nguyện viên..."
              className="mt-1 min-h-[140px] resize-none border-slate-200 focus:border-amber-500 focus:ring-amber-500/10 rounded-xl bg-gray-50/50 text-base shadow-sm"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter className="mt-6 gap-3 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="h-11 px-6 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50 font-bold transition-all w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="h-11 px-8 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-sm transition-all w-full sm:w-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Đang gửi...
              </>
            ) : (
              "Gửi nhận xét"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
