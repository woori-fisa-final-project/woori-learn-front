"use client";

import { useEffect, useState, useCallback } from "react";
import AdminLayout from "../components/AdminLayout";
import { useRouter } from "next/navigation";
import UserDetail from "./UserDetail";
import ExchangeList from "./ExchangeList";
import axiosInstance from "@/utils/axiosInstance";
import { useAuthStore } from "@/utils/tokenStorage";
import type {
  AdminUser,
  AdminUserListItem,
  ApiResponse,
  AdminUserDetailResponse,
} from "@/types/admin";

type Section = "users" | "userDetail" | "exchange";

const AdminMain = () => {
  const [section, setSection] = useState<Section>("users");
  const router = useRouter();

  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [search, setSearch] = useState("");
  const [userFilter, setUserFilter] = useState("");

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // 로그아웃
  const handleLogout = useCallback(async () => {
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      useAuthStore.getState().clearTokens();
      router.push("/login");
    }
  }, [router]); // router는 의존성 필요함

  // 사용자 목록 API 불러오기
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axiosInstance.get<
          ApiResponse<{ items: AdminUserListItem[] }>
        >("/admin/users", {
          params: { page: 1, size: 10 },
        });

        const items = res.data.data.items;

        const mapped = items
          .filter((u) => u.role === "ROLE_USER")
          .map((u) => ({
            id: u.id,
            userId: u.userId,
            nickname: u.nickname,
            createdAt: u.createdAt,
            points: u.points,
            progressRate: u.progressRate,
          }));

        setUsers(mapped);
      } catch (err) {
        console.error("유저 목록 조회 실패:", err);
        alert("유저 목록을 불러오지 못했습니다.");
      }
    }

    fetchUsers();
  }, []);

  // 🔵 검색 & 필터 적용
  const filteredUsers = users
    .filter((user) => {
      const keyword = search.trim().toLowerCase();
      if (!keyword) return true;

      return (
        user.userId.toLowerCase().includes(keyword) ||
        user.nickname.toLowerCase().includes(keyword)
      );
    })
    .filter((user) => {
      if (!userFilter) return true;

      if (userFilter === "progress-100") return user.progressRate === 100;
      if (userFilter === "progress-incomplete") return user.progressRate < 100;

      return true;
    });

  // 🔵 특정 유저 상세 정보 호출
  const handleUserClick = async (user: AdminUserListItem) => {
    try {
      const res = await axiosInstance.get<ApiResponse<AdminUserDetailResponse>>(
        `/admin/users/${user.id}`
      );
      const data = res.data.data;

      const selected: AdminUser = {
        id: data.id.toString(),
        userId: data.userId,
        name: data.nickname,
        creationDate: data.createdAt,
        points: data.points ?? 0,
        exchangedPoints: data.exchangedPoints ?? 0,
        progress: `${data.progressRate ?? 0}%`,
        account: data.account ?? {
          accountNumber: "",
          createdAt: "",
        },
        scenarios: data.scenarios ?? [],
        pointHistory: (data.historyList ?? []).map((h) => ({
          date: h.createdAt?.slice(0, 10),
          status: h.status,
          amount: h.amount,
          type: h.type,
        })),
      };

      setSelectedUser(selected);
      setSection("userDetail");
    } catch (err) {
      console.error("상세 조회 실패:", err);
      alert("유저 상세 정보를 불러오지 못했습니다.");
    }
  };

  // 🔵 화면 렌더링
  return (
    <AdminLayout
      currentSection={section}
      onNavigate={setSection}
      onLogout={handleLogout}
    >
      <div className="w-full min-h-screen bg-white">
        {/* 🔵 사용자 목록 */}
        {section === "users" && (
          <div className="w-full">
            <h2 className="mt-10 text-2xl font-bold mb-4 text-center">
              회원 목록
            </h2>

            {/* 검색 & 필터 */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between mb-5">
              <input
                type="text"
                placeholder="아이디/이름 검색"
                className="border border-gray-300 rounded px-3 py-2 w-full sm:w-60"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select
                className="border border-gray-300 rounded px-3 py-2"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="">전체</option>
                <option value="progress-100">100% 완료</option>
                <option value="progress-incomplete">미완료</option>
              </select>
            </div>

            {/* 목록 테이블 */}
            <div className="rounded-lg shadow bg-white p-6 overflow-x-auto">
              <table className="table-auto w-full border-collapse border border-gray-200 min-w-[640px]">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-3 text-sm">회원 ID</th>
                    <th className="border px-4 py-3 text-sm">이름</th>
                    <th className="border px-4 py-3 text-sm hidden md:table-cell">
                      생성일자
                    </th>
                    <th className="border px-4 py-3 text-sm">보유 포인트</th>
                    <th className="border px-4 py-3 text-sm">교육 진행률</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.id}
                      className="hover:bg-primary-50 cursor-pointer transition"
                      onClick={() => handleUserClick(user)}
                    >
                      <td className="border px-4 py-3 text-center">
                        {user.userId}
                      </td>
                      <td className="border px-4 py-3 text-center">
                        {user.nickname}
                      </td>
                      <td className="border px-4 py-3 text-center hidden md:table-cell">
                        {user.createdAt}
                      </td>
                      <td className="border px-4 py-3 text-center">
                        {user.points.toLocaleString()}p
                      </td>
                      <td className="border px-4 py-3 text-center">
                        <div className="flex items-center gap-2 justify-center">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-2 bg-primary-500 rounded-full"
                              style={{ width: `${user.progressRate}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold">
                            {user.progressRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🔵 유저 상세 화면 */}
        {section === "userDetail" && selectedUser && (
          <div className="w-full mt-10">
            <UserDetail
              user={selectedUser}
              onBack={() => setSection("users")}
            />
          </div>
        )}

        {/* 🔵 환전 신청 목록 */}
        {section === "exchange" && (
          <div className="w-full mt-10">
            <ExchangeList />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminMain;
