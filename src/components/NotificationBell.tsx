"use client";

import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import api from "@/services/api";
import { getMe } from "@/services/auth.service";

// Cập nhật URL đúng của backend NestJS
const SOCKET_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api/v1", "") || "http://localhost:8080";

interface Notification {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    let isMounted = true;
    let socketInstanceRef: Socket | null = null;

    // 1. Fetch unread count & recent notifications list
    const fetchNotifications = async () => {
      try {
        const [unreadRes, listRes] = await Promise.all([
          api.get("/notifications/unread-count"),
          api.get("/notifications?limit=10"),
        ]);
        if (isMounted) {
          setUnreadCount(unreadRes.data.count || 0);
          setNotifications(listRes.data || []);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông báo:", error);
      }
    };

    fetchNotifications();

    // 2. Connect to Socket.IO
    const connectSocket = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      try {
        const user = await getMe();
        if (!user || !user.id || !isMounted) return;

        socketInstanceRef = io(`${SOCKET_URL}/notifications`, {
          auth: { token },
          query: { userId: user.id },
          transports: ["websocket"],
        });

        if (isMounted) {
          setSocket(socketInstanceRef);
        }

        socketInstanceRef.on("connect", () => {
          console.log("Đã kết nối Socket.IO tới Backend Notifications");
        });

        socketInstanceRef.on("new_notification", (newNotif: Notification) => {
          console.log("Có thông báo mới:", newNotif);
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);
        });
      } catch (error) {
        console.error("Lỗi khi kết nối socket:", error);
      }
    };

    connectSocket();

    return () => {
      isMounted = false;
      if (socketInstanceRef) {
        socketInstanceRef.disconnect();
      }
    };
  }, []);

  const handleOpenClick = async () => {
    setIsOpen(!isOpen);
    // Nếu mở ra thì tự động mark-read các thông báo chưa đọc
    if (!isOpen && unreadCount > 0) {
      try {
        await api.patch("/notifications/mark-read");
        setUnreadCount(0);
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      } catch (error) {
        console.error("Lỗi khi đánh dấu đã đọc:", error);
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleOpenClick}
        className="relative flex items-center justify-center size-10 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <div className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border border-white"></div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 mt-2 w-80 bg-white border border-gray-200 shadow-lg rounded-xl overflow-hidden z-50">
          <div className="p-4 border-b border-gray-100">
            <h3 className="text-gray-900 font-bold">Thông báo</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-gray-500">
                Không có thông báo mới
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${
                    !notif.isRead ? "bg-blue-50/50" : ""
                  }`}
                >
                  <p className="text-sm text-gray-800">{notif.message}</p>
                  <span className="text-xs text-gray-400 mt-1 block">
                    {new Date(notif.createdAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
