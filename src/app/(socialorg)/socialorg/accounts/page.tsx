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
          status: "PENDING", // Chỉ lấy PENDING từ backend
          page,
          limit: 10,
        });
        setVolunteers(response.data);
        setTotalPages(response.meta.totalPages);
      } else {
        const response = await getBeneficiaries({
          search,
          status: "PENDING", // Chỉ lấy PENDING từ backend
          page,
          limit: 10,
        });
        setBeneficiaries(response.data);
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
      <div className="space-y-6">
        {/* Sub-tabs */}
        <div className="flex gap-4 border-b border-slate-100">
          <button
            onClick={() => setActiveSubTab("volunteer")}
            className={`px-4 py-3 font-bold text-sm transition-all relative ${
              activeSubTab === "volunteer"
                ? "text-[#008080]"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl"
            }`}
          >
            Tình nguyện viên
            {activeSubTab === "volunteer" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#008080] rounded-t-full"></div>
            )}
          </button>
          <button
            onClick={() => setActiveSubTab("beneficiary")}
            className={`px-4 py-3 font-bold text-sm transition-all relative ${
              activeSubTab === "beneficiary"
                ? "text-[#008080]"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-t-xl"
            }`}
          >
            Người cần giúp đỡ
            {activeSubTab === "beneficiary" && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#008080] rounded-t-full"></div>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Tìm kiếm theo tên, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-12 h-12 bg-gray-50/50 border-slate-200 focus:border-[#008080] focus:ring-[#008080]/10 rounded-xl w-full max-w-md shadow-sm"
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
                <div className="absolute inset-0 w-12 h-12 border-4 border-[#008080] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <p className="text-sm text-slate-500 font-medium">
                Đang tải danh sách...
              </p>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-16 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-sm">
              <Users className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 font-bold">
              Không có hồ sơ nào đang chờ duyệt
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow>
                    <TableHead className="font-bold text-slate-700">Họ và tên</TableHead>
                    <TableHead className="font-bold text-slate-700">Email</TableHead>
                    <TableHead className="font-bold text-slate-700">Số điện thoại</TableHead>
                    <TableHead className="font-bold text-slate-700">Trạng thái</TableHead>
                    <TableHead className="text-right font-bold text-slate-700">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((member) => (
                    <TableRow key={member.id} className="hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-800">
                        {activeSubTab === "volunteer"
                          ? member.volunteerProfile?.fullName
                          : member.bficiaryProfile?.fullName}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">{member.email}</TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {activeSubTab === "volunteer"
                          ? member.volunteerProfile?.phone
                          : member.bficiaryProfile?.phone}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
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
                          className="bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100/80 font-bold rounded-xl shadow-sm transition-all px-4"
                        >
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeny(member.id)}
                          className="text-rose-600 border border-rose-200 hover:bg-rose-50 font-bold rounded-xl shadow-sm transition-all px-4 bg-rose-50/30"
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
              <div className="flex items-center justify-center gap-3 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-xl font-bold text-slate-600 hover:bg-slate-50 border-slate-200 h-9 px-4"
                >
                  Trước
                </Button>
                <div className="px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-sm font-bold text-slate-600">
                  Trang {page} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-xl font-bold text-slate-600 hover:bg-slate-50 border-slate-200 h-9 px-4"
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
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 hover:border-[#008080] hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 border border-teal-100 group-hover:bg-[#008080] transition-colors shadow-sm">
              <UserPlus className="w-10 h-10 text-[#008080] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">
              Tạo tài khoản Tình nguyện viên
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Tạo tài khoản cho tình nguyện viên mới tham gia tổ chức của bạn
            </p>
            <Button
              onClick={() =>
                router.push("/socialorg/accounts/create-volunteer")
              }
              className="w-full bg-[#008080] hover:bg-[#00A79D] text-white h-12 rounded-xl font-bold shadow-sm transition-all"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Tạo tài khoản TNV
            </Button>
          </div>
        </div>

        {/* tao tk ncgd */}
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[2rem] p-8 hover:border-[#008080] hover:shadow-xl transition-all duration-300 group relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full opacity-50 -z-10 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="flex flex-col items-center text-center relative z-10">
            <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 border border-emerald-100 group-hover:bg-[#008080] transition-colors shadow-sm">
              <UserPlus className="w-10 h-10 text-[#008080] group-hover:text-white transition-colors" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">
              Tạo tài khoản Người cần giúp đỡ
            </h3>
            <p className="text-sm text-slate-500 font-medium mb-8">
              Tạo tài khoản cho người cần giúp đỡ mới được hỗ trợ bởi tổ chức
            </p>
            <Button
              onClick={() =>
                router.push("/socialorg/accounts/create-beneficiary")
              }
              className="w-full bg-[#008080] hover:bg-[#008080]/90 text-white h-12 rounded-xl font-bold shadow-sm transition-all"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Tạo tài khoản NCGĐ
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="bg-white/60 backdrop-blur-md rounded-[2rem] px-6 py-4 shadow-sm border border-white/50 inline-flex items-center justify-center">
          <Breadcrumb items={[{ label: "Quản lý tài khoản" }]} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Quản lý tài khoản
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Duyệt hồ sơ và tạo tài khoản mới cho thành viên tổ chức
          </p>
        </div>

        {/* Section 1: Duyệt hồ sơ */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">Duyệt hồ sơ</h2>
            <div className="text-sm font-medium text-slate-500">
              Xem và duyệt các hồ sơ đang chờ
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8">{renderReviewTab()}</div>
          </div>
        </div>

        {/* Section 2: Tạo tài khoản */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              Tạo tài khoản mới
            </h2>
            <div className="text-sm font-medium text-slate-500">
              Tạo tài khoản cho TNV hoặc NCGĐ
            </div>
          </div>
          {renderCreateTab()}
        </div>
      </div>
    </div>
  );
}
