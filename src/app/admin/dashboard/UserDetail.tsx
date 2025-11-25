"use client";

import React from "react";
import { type AdminUser } from "@/types/admin";

interface UserDetailProps {
  user: AdminUser;
  onBack: () => void;
}

const UserDetail: React.FC<UserDetailProps> = ({ user, onBack }) => {
  return (
    <div className="p-4 sm:p-6 md:p-8 border border-gray-200 rounded-lg bg-white w-full">
      <button
        className="mb-3 sm:mb-4 font-semibold text-primary-400 hover:underline text-sm sm:text-base"
        onClick={onBack}
      >
        &larr; 회원 목록으로
      </button>

      <h2 className="text-xl sm:text-2xl md:text-2xl font-bold mb-4 sm:mb-5 md:mb-6">
        회원 상세정보
      </h2>

      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
        <div>
          <div className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">회원 ID:</span> {user.userId}
          </div>
          <div className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">이름:</span> {user.name}
          </div>
          <div className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">생성일자:</span> {user.creationDate}
          </div>

          {/* 진행률 */}
          <div className="mb-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <span className="font-semibold text-sm sm:text-base">
              교육 진행률:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="w-24 sm:w-28 md:w-32 h-2 sm:h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 sm:h-3 bg-primary-500 rounded-full transition-all duration-300"
                  style={{ width: user.progress }}
                ></div>
              </div>
              <span className="text-xs text-gray-700 font-semibold min-w-8 text-right">
                {user.progress}
              </span>
            </div>
          </div>
        </div>

        {/* 포인트 / 계좌 정보 */}
        <div>
          <div className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">보유 포인트:</span>{" "}
            {user.points.toLocaleString()}p
          </div>
          <div className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">환전한 포인트:</span>{" "}
            {user.exchangedPoints.toLocaleString()}p
          </div>
          <div className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">계좌번호:</span>{" "}
            {user.account.accountNumber}
          </div>
          <div className="mb-2 text-sm sm:text-base">
            <span className="font-semibold">계좌 연동일시:</span>{" "}
            {user.account.createdAt}
          </div>
        </div>
      </div>

      {/* 시나리오 완료 여부 */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <h3 className="text-base sm:text-lg md:text-lg font-bold mb-2 sm:mb-3">
          시나리오 완료 여부
        </h3>
        <ul className="list-disc pl-4 sm:pl-5 md:pl-6">
          {user.scenarios.map((s) => (
            <li
              key={s.name}
              className={`text-sm sm:text-base ${
                s.completed ? "text-green-600" : "text-gray-400"
              }`}
            >
              {s.name} {s.completed ? "(완료)" : "(미완료)"}
            </li>
          ))}
        </ul>
      </div>

      {/* 포인트 내역 */}
      <div>
        <h3 className="text-base sm:text-lg md:text-lg font-bold mb-2 sm:mb-3">
          포인트 적립/출금 내역
        </h3>

        <div className="flex flex-col gap-2 sm:gap-3">
          {user.pointHistory.map((h, idx) => (
            <div
              key={`${h.date}-${idx}`}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 border-b border-gray-100 pb-2 last:border-b-0"
            >
              <span className="text-xs sm:text-sm text-gray-500 w-full sm:w-28">
                {h.date}
              </span>
              <span className="text-xs sm:text-sm w-full sm:w-32">
                {h.status}
              </span>
              <span
                className={`text-sm sm:text-base font-semibold ${
                  h.type === "earn" ? "text-primary-600" : "text-red-500"
                }`}
              >
                {h.amount}p
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
