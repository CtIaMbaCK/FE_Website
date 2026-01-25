"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  getAllOrganizations,
  updateOrganization,
  type Organization,
} from "@/services/admin.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Breadcrumb from "@/components/Breadcrumb";
import { MdSearch, MdLock, MdLockOpen, MdVisibility } from "react-icons/md";

export default function OrganizationsPage() {
  // State quan ly
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  // Fetch data tu API
  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await getAllOrganizations(
        search || undefined,
        statusFilter === "all" ? undefined : statusFilter,
        page,
        limit
      );
      setOrganizations(response.items);
      setTotalPages(response.totalPages);
      setTotal(response.total);
    } catch (error) {
      console.error("Loi fetch organizations:", error);
      toast.error("Không thể tải danh sách tổ chức xã hội");
    } finally {
      setLoading(false);
    }
  };

  // Fetch lai khi thay doi filter hoac page
  useEffect(() => {
    fetchOrganizations();
  }, [page, statusFilter]);

  // Xu ly search voi debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchOrganizations();
      } else {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Toggle khoa/mo khoa tai khoan
  const handleToggleStatus = async (organization: Organization) => {
    try {
      const newStatus = organization.status === "ACTIVE" ? "BANNED" : "ACTIVE";
      await updateOrganization(organization.id, { status: newStatus });
      toast.success(
        `Đã ${newStatus === "BANNED" ? "khóa" : "mở khóa"} tài khoản thành công`
      );
      fetchOrganizations();
    } catch (error) {
      console.error("Loi update status:", error);
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // Hien thi badge status voi mau sac
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; className: string }> = {
      ACTIVE: { label: "Hoạt động", className: "bg-green-100 text-green-800" },
      PENDING: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-800" },
      BANNED: { label: "Đã khóa", className: "bg-red-100 text-red-800" },
      DENIED: { label: "Từ chối", className: "bg-red-100 text-red-800" },
    };
    const statusInfo = statusMap[status] || { label: status, className: "" };
    return (
      <Badge className={statusInfo.className} variant="outline">
        {statusInfo.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: "Quản lý tổ chức xã hội" }
        ]}
      />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Quản lý Tổ chức xã hội
        </h1>
        <p className="text-gray-600 mt-2">
          Tổng số: {total} tổ chức xã hội
        </p>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search box */}
          <div className="flex-1 relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm theo tên tổ chức, email, số điện thoại..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="ACTIVE">Hoạt động</SelectItem>
              <SelectItem value="PENDING">Chờ duyệt</SelectItem>
              <SelectItem value="BANNED">Đã khóa</SelectItem>
              <SelectItem value="DENIED">Từ chối</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Avatar</TableHead>
                <TableHead>Tên tổ chức</TableHead>
                <TableHead>Người đại diện</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008080]"></div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : organizations.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Không tìm thấy tổ chức xã hội
                  </TableCell>
                </TableRow>
              ) : (
                organizations.map((organization) => (
                  <TableRow key={organization.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage
                          src={organization.organizationProfiles?.avatarUrl}
                          alt={organization.organizationProfiles?.organizationName || "Org"}
                        />
                        <AvatarFallback className="bg-[#008080] text-white">
                          {organization.organizationProfiles?.organizationName?.charAt(0) || "O"}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {organization.organizationProfiles?.organizationName || "Chưa có tên"}
                    </TableCell>
                    <TableCell>
                      {organization.organizationProfiles?.representativeName || "Chưa có"}
                    </TableCell>
                    <TableCell>{organization.email}</TableCell>
                    <TableCell>{organization.phoneNumber}</TableCell>
                    <TableCell>{getStatusBadge(organization.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            window.location.href = `/admin/organizations/${organization.id}`;
                          }}
                        >
                          <MdVisibility className="mr-1" />
                          Chi tiết
                        </Button>
                        <Button
                          variant={
                            organization.status === "ACTIVE"
                              ? "destructive"
                              : "default"
                          }
                          size="sm"
                          onClick={() => handleToggleStatus(organization)}
                          disabled={organization.status === "PENDING" || organization.status === "DENIED"}
                          className={
                            organization.status !== "ACTIVE"
                              ? "bg-[#008080] hover:bg-[#006666]"
                              : ""
                          }
                        >
                          {organization.status === "ACTIVE" ? (
                            <>
                              <MdLock className="mr-1" />
                              Khóa
                            </>
                          ) : (
                            <>
                              <MdLockOpen className="mr-1" />
                              Mở khóa
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-gray-600">
              Trang {page} / {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                Trước
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
