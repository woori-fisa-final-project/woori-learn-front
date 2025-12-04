"use client";

import React, { useState } from "react";
import AdminHeader from "./AdminHeader";
import MobileSidebar from "./MobileSidebar";
import { useCallback } from "react";

type Section = "users" | "userDetail" | "exchange";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentSection: Section;
  onNavigate: (section: Section) => void;
  onLogout?: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  currentSection,
  onNavigate,
  onLogout,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const handleMenuClose = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* 헤더 */}
      <AdminHeader
        currentSection={currentSection}
        onNavigate={onNavigate}
        onLogout={onLogout}
        onMenuToggle={handleMenuToggle}
      />

      {/* 모바일 사이드바 */}
      <MobileSidebar
        isOpen={isMobileMenuOpen}
        onClose={handleMenuClose}
        currentSection={currentSection}
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* 메인 컨텐츠 영역 */}
      <main className="pt-14 sm:pt-16 w-full min-h-screen bg-white px-4 sm:px-6 md:px-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
