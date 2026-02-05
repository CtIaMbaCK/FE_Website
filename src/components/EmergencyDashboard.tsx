"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { emergencyService, EmergencyRequest } from "@/services/emergency.service";
import { MdWarning, MdCheckCircle, MdPhone, MdEmail } from "react-icons/md";
import { io, Socket } from "socket.io-client";

export default function EmergencyDashboard() {
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    loadEmergencies();
    connectSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const connectSocket = () => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_BASE_URL?.replace('/api/v1', '') + '/chat', {
      auth: { token },
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('✅ Connected to WebSocket for SOS alerts');
    });

    newSocket.on('sos_alert', (data) => {
      console.log('🚨 New SOS Alert:', data);

      // Hiển thị toast notification
      toast.error(`🚨 SOS KHẨN CẤP từ ${data.beneficiary?.fullName || 'Người cần giúp đỡ'}`, {
        duration: 10000,
        action: {
          label: 'Xem',
          onClick: () => {
            // Reload emergencies
            loadEmergencies();
          },
        },
      });

      // Reload danh sách SOS
      loadEmergencies();
    });

    setSocket(newSocket);
  };

  const loadEmergencies = async () => {
    try {
      setLoading(true);
      const data = await emergencyService.getEmergencies('NEW');
      setEmergencies(data);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách SOS');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      await emergencyService.updateEmergency(id, { status: 'COMPLETED' });
      toast.success('Đã đánh dấu SOS đã xử lý');
      loadEmergencies();
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MdWarning className="text-red-600" size={24} />
          SOS Khẩn Cấp
          {emergencies.length > 0 && (
            <span className="ml-2 px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              {emergencies.length}
            </span>
          )}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={loadEmergencies}
          className="text-gray-600"
        >
          Làm mới
        </Button>
      </div>

      {emergencies.length === 0 ? (
        <div className="text-center py-12">
          <MdCheckCircle className="mx-auto text-green-500 mb-3" size={48} />
          <p className="text-gray-500 font-medium">
            Không có SOS khẩn cấp nào đang chờ xử lý
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {emergencies.map((emergency) => (
            <div
              key={emergency.id}
              className="border-2 border-red-500 rounded-lg p-4 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    {emergency.beneficiary.avatarUrl ? (
                      <img
                        src={emergency.beneficiary.avatarUrl}
                        alt={emergency.beneficiary.fullName}
                        className="w-12 h-12 rounded-full object-cover border-2 border-red-600"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-bold">
                        {emergency.beneficiary.fullName.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-gray-900">
                        {emergency.beneficiary.fullName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(emergency.createdAt).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>

                  {/* Thông tin liên hệ */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MdPhone className="text-red-600" />
                      <a
                        href={`tel:${emergency.beneficiary.user.phoneNumber}`}
                        className="font-medium hover:text-red-600 underline"
                      >
                        {emergency.beneficiary.user.phoneNumber}
                      </a>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MdEmail className="text-red-600" />
                      <a
                        href={`mailto:${emergency.beneficiary.user.email}`}
                        className="font-medium hover:text-red-600 underline text-sm"
                      >
                        {emergency.beneficiary.user.email}
                      </a>
                    </div>
                  </div>

                  {/* Tình trạng */}
                  {emergency.beneficiary.vulnerabilityType && (
                    <div className="mb-2">
                      <span className="text-sm font-semibold text-gray-700">
                        Loại hình:{' '}
                      </span>
                      <span className="text-sm text-gray-600">
                        {emergency.beneficiary.vulnerabilityType}
                      </span>
                    </div>
                  )}

                  {emergency.beneficiary.situationDescription && (
                    <p className="text-sm text-gray-700 mb-2">
                      <span className="font-semibold">Tình trạng: </span>
                      {emergency.beneficiary.situationDescription}
                    </p>
                  )}

                  {/* Người giám hộ */}
                  {emergency.beneficiary.guardianName && (
                    <div className="bg-white rounded p-3 border border-red-200">
                      <p className="text-sm font-semibold text-gray-700 mb-1">
                        Người giám hộ:
                      </p>
                      <p className="text-sm text-gray-600">
                        {emergency.beneficiary.guardianName} -{' '}
                        <a
                          href={`tel:${emergency.beneficiary.guardianPhone}`}
                          className="text-red-600 hover:underline font-medium"
                        >
                          {emergency.beneficiary.guardianPhone}
                        </a>
                      </p>
                    </div>
                  )}
                </div>

                {/* Button xử lý */}
                <div className="ml-4">
                  <Button
                    onClick={() => handleComplete(emergency.id)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <MdCheckCircle className="mr-1" />
                    Đã xử lý
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
