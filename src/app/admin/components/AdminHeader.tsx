"use client";

import React from "react";

type Section = "users" | "userDetail" | "exchange";

interface AdminHeaderProps {
  currentSection: Section;
  onNavigate: (section: Section) => void;
  onLogout?: () => void;
  onMenuToggle: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  currentSection,
  onNavigate,
  onLogout,
  onMenuToggle,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4 sm:px-6 md:px-8">
      {/* 로고 영역 */}
      <div className="flex items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary-400">
          woorilearn 관리자 페이지
        </h1>
      </div>

      {/* 데스크톱 메뉴 (lg 이상에서만 표시) */}
      <nav className="hidden lg:flex items-center gap-4">
        <button
          className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
            currentSection === "users"
              ? "bg-primary-500 text-white"
              : "text-gray-700 hover:bg-primary-50"
          }`}
          onClick={() => onNavigate("users")}
        >
          회원 목록
        </button>
        <button
          className={`px-4 py-2 rounded transition-colors text-sm font-medium ${
            currentSection === "exchange"
              ? "bg-primary-500 text-white"
              : "text-gray-700 hover:bg-primary-50"
          }`}
          onClick={() => onNavigate("exchange")}
        >
          포인트 환전 신청
        </button>
        {onLogout && (
          <button
            className="px-4 py-2 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-sm font-semibold"
            onClick={onLogout}
          >
            로그아웃
          </button>
        )}
      </nav>

      {/* 햄버거 버튼 (lg 미만에서만 표시) */}
      <button
        className="lg:hidden p-2 rounded hover:bg-gray-100 transition-colors"
        onClick={onMenuToggle}
        aria-label="메뉴 열기"
      >
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </header>
  );
};

export default AdminHeader;
