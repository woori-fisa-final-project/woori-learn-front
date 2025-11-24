"use client";

import React, { useEffect } from "react";

type Section = "users" | "userDetail" | "exchange";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentSection: Section;
  onNavigate: (section: Section) => void;
  onLogout?: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  isOpen,
  onClose,
  currentSection,
  onNavigate,
  onLogout,
}) => {
  // ESC 키로 사이드바 닫기
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // 사이드바가 열릴 때 body 스크롤 방지
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleNavigate = (section: Section) => {
    onNavigate(section);
    onClose();
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
    onClose();
  };

  return (
    <>
      {/* Overlay 배경 */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* 사이드바 */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* 헤더 (닫기 버튼 포함) */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-primary-400">
            관리자 메뉴
          </h2>
          <button
            className="p-2 rounded hover:bg-gray-100 transition-colors text-gray-700"
            onClick={onClose}
            aria-label="메뉴 닫기"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 메뉴 목록 */}
        <nav className="flex-1 flex flex-col p-4 sm:p-5 gap-2">
          <button
            className={`text-left px-4 py-3 rounded transition-colors text-sm sm:text-base font-medium ${
              currentSection === "users"
                ? "bg-primary-400 text-white"
                : "text-gray-700 hover:bg-primary-50"
            }`}
            onClick={() => handleNavigate("users")}
          >
            회원 목록
          </button>
          <button
            className={`text-left px-4 py-3 rounded transition-colors text-sm sm:text-base font-medium ${
              currentSection === "exchange"
                ? "bg-primary-400 text-white"
                : "text-gray-700 hover:bg-primary-50"
            }`}
            onClick={() => handleNavigate("exchange")}
          >
            포인트 환전 신청 목록
          </button>
        </nav>

        {/* 로그아웃 버튼 */}
        {onLogout && (
          <div className="p-4 sm:p-5 border-t border-gray-200">
            <button
              className="w-full px-4 py-3 rounded bg-red-100 text-red-600 hover:bg-red-200 transition-colors text-sm sm:text-base font-semibold"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default MobileSidebar;
