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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Khen thưởng tình nguyện viên</DialogTitle>
          <DialogDescription>
            Viết lời nhận xét cho <strong>{volunteerName}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Đánh giá sao */}
          <div>
            <Label htmlFor="rating">Đánh giá (Tùy chọn)</Label>
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    rating && rating >= star
                      ? "text-yellow-500"
                      : "text-gray-300"
                  } hover:text-yellow-400`}
                >
                  ★
                </button>
              ))}
              {rating && (
                <button
                  type="button"
                  onClick={() => setRating(undefined)}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                >
                  Xóa
                </button>
              )}
            </div>
          </div>

          {/* Nhận xét */}
          <div>
            <Label htmlFor="comment">Nhận xét *</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Viết lời nhận xét, khen ngợi tình nguyện viên..."
              className="mt-2 min-h-[120px]"
              disabled={loading}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-primary hover:bg-primary/90"
          >
            {loading ? "Đang gửi..." : "Gửi nhận xét"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
