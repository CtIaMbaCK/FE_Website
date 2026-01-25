"use client";

import { useState, useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TextBox {
  x: number;
  y: number;
  width: number;
  height: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  align: "left" | "center" | "right";
}

interface TextBoxConfig {
  volunteerName: TextBox;
  points?: TextBox;
  issueDate?: TextBox;
}

interface CertificateEditorProps {
  imageUrl: string;
  onConfigChange: (config: TextBoxConfig) => void;
}

export default function CertificateEditor({
  imageUrl,
  onConfigChange,
}: CertificateEditorProps) {
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [activeField, setActiveField] = useState<
    "volunteerName" | "points" | "issueDate" | null
  >("volunteerName");
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const [textBoxes, setTextBoxes] = useState<TextBoxConfig>({
    volunteerName: {
      x: 150,
      y: 300,
      width: 500,
      height: 80,
      fontSize: 80, // Tăng lên 48 để tên to hơn
      fontFamily: "Arial",
      color: "#000000",
      align: "center",
    },
    // Bỏ points và issueDate - chỉ hiển thị tên TNV
  });

  // Load image dimensions
  useEffect(() => {
    if (imageRef.current && imageRef.current.complete) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  }, [imageUrl]);

  // Update parent component
  useEffect(() => {
    console.log(
      "📝 CertificateEditor: Sending textBoxes to parent:",
      textBoxes,
    );
    onConfigChange(textBoxes);
  }, [textBoxes, onConfigChange]);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  };

  const handleMouseDown = (e: React.MouseEvent, field: keyof TextBoxConfig) => {
    if (!activeField || activeField !== field) {
      setActiveField(field);
      return;
    }

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const scaleX = imageDimensions.width / rect.width;
    const scaleY = imageDimensions.height / rect.height;

    const relativeX = (e.clientX - rect.left) * scaleX;
    const relativeY = (e.clientY - rect.top) * scaleY;

    // Check if clicking on resize handle (bottom-right corner)
    const box = textBoxes[field];
    if (!box) return;

    const resizeHandleSize = 20;
    const isOnResizeHandle =
      relativeX >= box.x + box.width - resizeHandleSize &&
      relativeX <= box.x + box.width &&
      relativeY >= box.y + box.height - resizeHandleSize &&
      relativeY <= box.y + box.height;

    if (isOnResizeHandle) {
      setIsResizing(true);
    } else {
      setIsDragging(true);
    }

    setDragStart({
      x: relativeX - box.x,
      y: relativeY - box.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if ((!isDragging && !isResizing) || !activeField) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const scaleX = imageDimensions.width / rect.width;
    const scaleY = imageDimensions.height / rect.height;

    const relativeX = (e.clientX - rect.left) * scaleX;
    const relativeY = (e.clientY - rect.top) * scaleY;

    setTextBoxes((prev) => {
      const box = prev[activeField];
      if (!box) return prev;

      if (isResizing) {
        // Resize box
        const newWidth = Math.max(100, relativeX - box.x);
        const newHeight = Math.max(30, relativeY - box.y);

        return {
          ...prev,
          [activeField]: {
            ...box,
            width: newWidth,
            height: newHeight,
          },
        };
      } else {
        // Drag box
        const newX = Math.max(
          0,
          Math.min(imageDimensions.width - box.width, relativeX - dragStart.x),
        );
        const newY = Math.max(
          0,
          Math.min(
            imageDimensions.height - box.height,
            relativeY - dragStart.y,
          ),
        );

        return {
          ...prev,
          [activeField]: {
            ...box,
            x: newX,
            y: newY,
          },
        };
      }
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const updateTextBox = (
    field: keyof TextBoxConfig,
    updates: Partial<TextBox>,
  ) => {
    setTextBoxes((prev) => ({
      ...prev,
      [field]: {
        ...prev[field],
        ...updates,
      },
    }));
  };

  return (
    <div className="space-y-4">
      {/* Image Preview with Draggable Boxes */}
      <div className="border rounded-lg overflow-hidden bg-gray-50">
        <div
          ref={containerRef}
          className="relative inline-block w-full"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Certificate Template"
            className="w-full h-auto"
            onLoad={handleImageLoad}
          />

          {/* Render Text Boxes */}
          {imageDimensions.width > 0 &&
            Object.entries(textBoxes).map(([field, box]) => {
              const rect = containerRef.current?.getBoundingClientRect();
              if (!rect) return null;

              const scaleX = rect.width / imageDimensions.width;
              const scaleY = rect.height / imageDimensions.height;

              const isActive = activeField === field;

              return (
                <div
                  key={field}
                  className={`absolute cursor-move border-2 ${
                    isActive
                      ? "border-blue-500 bg-blue-100/30"
                      : "border-gray-400 bg-gray-200/30"
                  } flex items-center justify-center text-sm font-semibold`}
                  style={{
                    left: `${box.x * scaleX}px`,
                    top: `${box.y * scaleY}px`,
                    width: `${box.width * scaleX}px`,
                    height: `${box.height * scaleY}px`,
                  }}
                  onMouseDown={(e) =>
                    handleMouseDown(e, field as keyof TextBoxConfig)
                  }
                >
                  <span className="pointer-events-none">
                    {field === "volunteerName"
                      ? "Tên TNV"
                      : field === "points"
                        ? "Điểm"
                        : "Ngày cấp"}
                  </span>

                  {/* Resize Handle */}
                  {isActive && (
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize"
                      style={{ borderTopLeftRadius: "2px" }}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Control Panel */}
      <div className="border rounded-lg p-4 bg-white space-y-4">
        <div>
          <Label className="text-base font-semibold">
            Chỉnh sửa vị trí tên tình nguyện viên
          </Label>
          <p className="text-sm text-gray-500 mt-1">
            Kéo thả khung màu xanh trên ảnh để đặt vị trí tên TNV
          </p>
        </div>

        {activeField && textBoxes[activeField] && (
          <div className="space-y-3 border-t pt-3">
            <h4 className="font-semibold">Cài đặt hiển thị tên</h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Vị trí X</Label>
                <Input
                  type="number"
                  value={Math.round(textBoxes[activeField]?.x ?? 0)}
                  onChange={(e) =>
                    updateTextBox(activeField, {
                      x: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Vị trí Y</Label>
                <Input
                  type="number"
                  value={Math.round(textBoxes[activeField]?.y ?? 0)}
                  onChange={(e) =>
                    updateTextBox(activeField, {
                      y: parseInt(e.target.value) || 0,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Chiều rộng</Label>
                <Input
                  type="number"
                  value={Math.round(textBoxes[activeField]?.width ?? 0)}
                  onChange={(e) =>
                    updateTextBox(activeField, {
                      width: parseInt(e.target.value) || 100,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Chiều cao</Label>
                <Input
                  type="number"
                  value={Math.round(textBoxes[activeField]?.height ?? 0)}
                  onChange={(e) =>
                    updateTextBox(activeField, {
                      height: parseInt(e.target.value) || 30,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Cỡ chữ</Label>
                <Input
                  type="number"
                  value={textBoxes[activeField]?.fontSize ?? 16}
                  onChange={(e) =>
                    updateTextBox(activeField, {
                      fontSize: parseInt(e.target.value) || 16,
                    })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Màu chữ</Label>
                <Input
                  type="color"
                  value={textBoxes[activeField]?.color ?? "#000000"}
                  onChange={(e) =>
                    updateTextBox(activeField, { color: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="text-xs">Căn lề</Label>
                <select
                  className="w-full border rounded px-2 py-1 text-sm"
                  value={textBoxes[activeField]?.align ?? "center"}
                  onChange={(e) =>
                    updateTextBox(activeField, {
                      align: e.target.value as "left" | "center" | "right",
                    })
                  }
                >
                  <option value="left">Trái</option>
                  <option value="center">Giữa</option>
                  <option value="right">Phải</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-gray-500">
              💡 Kéo thả hộp trên ảnh để di chuyển, kéo góc dưới phải để thay
              đổi kích thước
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
