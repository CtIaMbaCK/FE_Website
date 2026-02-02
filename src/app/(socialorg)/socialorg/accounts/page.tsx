"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import {
  getVolunteers,
  getBeneficiaries,
  updateMemberStatus,
  OrganizationMember,
} from "@/services/organization.service";
import Breadcrumb from "@/components/Breadcrumb";
import { Search, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const STATUS_MAP: Record<string, string> = {
  PENDING: "Chờ duyệt",
  APPROVED: "Đã duyệt",
  REJECTED: "Bị từ chối",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export default function AccountsPage() {
  const router = useRouter();
  const [activeSubTab, setActiveSubTab] = useState<"volunteer" | "beneficiary">(
    "volunteer"
  );

  const [volunteers, setVolunteers] = useState<OrganizationMember[]>([]);
  const [beneficiaries, setBeneficiaries] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadPendingMembers();
  }, [activeSubTab, search, page]);

  const loadPendingMembers = async () => {
    try {
      setLoading(true);

      if (activeSubTab === "volunteer") {
        const response = await getVolunteers({
          search,
          page,
          limit: 10,
        });
        // Lọc chỉ lấy members có status PENDING
        const pendingVolunteers = response.data.filter(
          (v) => v.status === "PENDING"
        );
        setVolunteers(pendingVolunteers);
        setTotalPages(response.meta.totalPages);
      } else {
        const response = await getBeneficiaries({
          search,
          page,
          limit: 10,
        });
        // Lọc chỉ lấy members có status PENDING
        const pendingBeneficiaries = response.data.filter(
          (b) => b.status === "PENDING"
        );
        setBeneficiaries(pendingBeneficiaries);
        setTotalPages(response.meta.totalPages);
      }
    } catch (error: any) {
      toast.error(
        "Lỗi khi tải danh sách: " +
          (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memberId: string) => {
    try {
      await updateMemberStatus(memberId, "APPROVED");
      toast.success("Đã duyệt hồ sơ thành công");
      loadPendingMembers();
    } catch (error: any) {
      toast.error(
        "Lỗi khi duyệt hồ sơ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const handleDeny = async (memberId: string) => {
    try {
      await updateMemberStatus(memberId, "REJECTED");
      toast.success("Đã từ chối hồ sơ");
      loadPendingMembers();
    } catch (error: any) {
      toast.error(
        "Lỗi khi từ chối hồ sơ: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const renderReviewTab = () => {
    const data = activeSubTab === "volunteer" ? volunteers : beneficiaries;

    return (
      <div className="space-y-4">
        {/* Sub-tabs */}
        <div className="flex gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveSubTab("volunteer")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeSubTab === "volunteer"
                ? "border-b-2 border-teal-600 text-teal-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Tình nguyện viên
          </button>
          <button
            onClick={() => setActiveSubTab("beneficiary")}
            className={`px-4 py-2 font-medium text-sm transition-colors ${
              activeSubTab === "beneficiary"
                ? "border-b-2 border-emerald-600 text-emerald-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Người cần giúp đỡ
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-10"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-gray-600 font-medium">
                Đang tải danh sách...
              </p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">
              Không có hồ sơ nào đang chờ duyệt
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Họ và tên</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">
                        {activeSubTab === "volunteer"
                          ? member.volunteerProfile?.fullName
                          : member.bficiaryProfile?.fullName}
                      </TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        {activeSubTab === "volunteer"
                          ? member.volunteerProfile?.phone
                          : member.bficiaryProfile?.phone}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[member.status]
                          }`}
                        >
                          {STATUS_MAP[member.status]}
                        </span>
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(member.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeny(member.id)}
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          Từ chối
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Trước
                </Button>
                <span className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Sau
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderCreateTab = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* tao tk tnv */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-teal-500 hover:shadow-lg transition-all group">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
              <UserPlus className="w-10 h-10 text-teal-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tạo tài khoản Tình nguyện viên
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Tạo tài khoản cho tình nguyện viên mới tham gia tổ chức của bạn
            </p>
            <Button
              onClick={() =>
                router.push("/socialorg/accounts/create-volunteer")
              }
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Tạo tài khoản TNV
            </Button>
          </div>
        </div>

        {/* tao tk ncgd */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 hover:border-teal-500 hover:shadow-lg transition-all group">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-teal-600 transition-colors">
              <UserPlus className="w-10 h-10 text-teal-600 group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Tạo tài khoản Người cần giúp đỡ
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Tạo tài khoản cho người cần giúp đỡ mới được hỗ trợ bởi tổ chức
            </p>
            <Button
              onClick={() =>
                router.push("/socialorg/accounts/create-beneficiary")
              }
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-11"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Tạo tài khoản NCGĐ
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-10">
      <div className=" mx-auto px-6 pt-4">
        <Breadcrumb items={[{ label: "Quản lý tài khoản" }]} />
      </div>

      <div className=" mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý tài khoản
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Duyệt hồ sơ và tạo tài khoản mới cho thành viên tổ chức
          </p>
        </div>

        {/* Section 1: Duyệt hồ sơ */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Duyệt hồ sơ</h2>
            <div className="text-sm text-gray-500">
              Xem và duyệt các hồ sơ đang chờ
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">{renderReviewTab()}</div>
          </div>
        </div>

        {/* Section 2: Tạo tài khoản */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Tạo tài khoản mới
            </h2>
            <div className="text-sm text-gray-500">
              Tạo tài khoản cho TNV hoặc NCGĐ
            </div>
          </div>
          {renderCreateTab()}
        </div>
      </div>
    </div>
  );
}
