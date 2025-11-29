"use client";

import { useRouter } from "next/navigation";
import { useUserData } from "@/lib/hooks/useUserData";
import { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/components/common/Modal";
import { ServiceMenuSheet } from "@/components/layout/ServiceMenuSheet";
import { getAccountList } from "@/lib/api/account";
import { formatAccountNumber, getRepresentativeAccount } from "@/utils/accountUtils";
import type { EducationalAccount } from "@/types/account";
import { devError } from "@/utils/logger";
import { isAbortError } from "@/types/errors";

// ✅ Zustand 훅 가져오기 (Provider 필요 없음)
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";

// --- 상수 데이터 (기존과 동일) ---
type NavItem = {
  label: string;
  icon: string;
  route: string;
  active?: boolean;
};

type ServiceItem = {
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { label: "상품", icon: "🛍️", route: "/products" },
  { label: "자산·소비", icon: "💳", route: "/assets" },
  { label: "홈", icon: "🏠", route: "/woorimain", active: true },
  { label: "주식", icon: "📈", route: "/stocks" },
  { label: "혜택", icon: "🎁", route: "/benefits" },
];

const SERVICES: ServiceItem[] = [
  { label: "알뜰폰", icon: "📱" },
  { label: "꿀머니", icon: "🐝" },
  { label: "카드", icon: "💳" },
  { label: "자동차", icon: "🚗" },
  { label: "증권", icon: "📄" },
  { label: "저축은행", icon: "🏦" },
];

const QUICK_MENU = [
  { label: "즉시/예약이체", icon: "💸" },
  { label: "영업점/ATM찾기", icon: "📍" },
  { label: "우리 원더라이프", icon: "🌟" },
  { label: "인증서 관리", icon: "📝" },
  { label: "분실 신고", icon: "🚨" },
];

// --- 하위 컴포넌트들 (기존과 동일) ---
function HeaderUserBar({ userName, onOpenMenu }: { userName?: string; onOpenMenu: () => void }) {
  return (
    <header className="mb-[30px] flex items-center justify-between">
      <p className="text-[20px] font-semibold text-gray-800">
        {userName ? `${userName}님` : "김민영님"}
      </p>
      <div className="flex items-center gap-[14px] text-[20px] text-gray-500">
        <span role="img" aria-label="vehicle">🚗</span>
        <span role="img" aria-label="character">😊</span>
        <span role="img" aria-label="notification">🔔</span>
        <button
          type="button"
          onClick={onOpenMenu}
          className="flex h-[28px] w-[28px] items-center justify-center rounded-full text-[22px] transition hover:bg-gray-100"
          aria-label="전체 메뉴 열기"
        >
          ☰
        </button>
      </div>
    </header>
  );
}

function AccountCard({
  account,
  isLoading,
  onTransfer,
  onViewAll,
}: {
  account: EducationalAccount | null;
  isLoading: boolean;
  onTransfer: () => void;
  onViewAll: () => void;
}) {
  if (isLoading) {
    return (
      <section className="rounded-[16px] bg-white p-5 shadow-sm">
        <p className="text-center text-[14px] text-gray-500">계좌 정보를 불러오는 중...</p>
      </section>
    );
  }

  if (!account) {
    return (
      <section className="rounded-[16px] bg-white p-5 shadow-sm">
        <p className="text-center text-[14px] text-gray-500">등록된 계좌가 없습니다.</p>
      </section>
    );
  }

  const formattedAccountNumber = formatAccountNumber(account.accountNumber);
  const formattedBalance = `${account.balance.toLocaleString()}원`;
  const bankName = account.bankName ?? "우리은행";

  return (
    <section className="rounded-[16px] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-[10px]">
        <Image src="/images/woorilogo.png" alt="Woori Bank" className="h-[20px] w-auto" width={80} height={20} />
        <p className="text-[18px] font-semibold text-gray-900">{account.accountName}</p>
      </div>
      <div className="mt-[14px] flex items-center justify-between">
        <p className="text-[13px] text-gray-600">{bankName} {formattedAccountNumber}</p>
        <span className="rounded-full px-[10px] py-[4px] text-[11px] text-gray-700 border border-gray-300">
          한도제한
        </span>
      </div>
      <div className="mt-[18px] flex items-center justify-between">
        <p className="text-[26px] font-bold text-gray-900">{formattedBalance}</p>
        <button
          type="button"
          onClick={onTransfer}
          className="rounded-[12px] px-[16px] py-[8px] text-[13px] font-semibold text-gray-700 shadow-sm transition hover:bg-primary-600"
        >
          이체
        </button>
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="mt-[16px] w-full rounded-[12px] py-[10px] text-[14px] font-semibold text-gray-700 shadow-sm transition hover:bg-primary-600"
      >
        전체계좌보기
      </button>
    </section>
  );
}

function QuickMenuList() {
  return (
    <section className="rounded-[16px] bg-transparent">
      <div className="flex flex-col gap-[10px]">
        {QUICK_MENU.map((item) => (
          <div key={item.label} className="flex items-center gap-[12px] text-[15px] font-semibold text-gray-800">
            <span className="text-[18px]" role="img" aria-hidden>{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AlertCard() {
  return (
    <section className="flex items-center justify-between rounded-[16px] bg-[#FEECEC] px-[20px] py-[16px]">
      <div>
        <p className="text-[15px] font-semibold text-[#D45454]">잠깐만요!</p>
        <p className="mt-[6px] text-[12px] text-[#7A4040]">
          보이스피싱이 의심된다면 확인하고<br />예방하세요.
        </p>
      </div>
      <span className="text-[34px]" role="img" aria-label="shield">🛡️</span>
    </section>
  );
}

function ServiceGrid() {
  return (
    <section className="space-y-[16px]">
      <h2 className="text-[18px] font-semibold text-gray-800">우리금융그룹 서비스</h2>
      <div className="grid grid-cols-3 gap-[16px]">
        {SERVICES.map((service) => (
          <div key={service.label} className="flex h-[118px] flex-col items-center justify-center rounded-[16px] bg-white p-4 text-[13px] font-semibold text-gray-700 shadow-sm">
            <span className="mb-[10px] text-[26px]" role="img" aria-hidden>{service.icon}</span>
            {service.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomNav({ onNavigate }: { onNavigate: (route: string) => void }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 14px)" }}>
      <div className="mx-auto flex w-full max-w-[390px] items-center justify-between px-[28px] pt-[12px]">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.route)}
            className="flex flex-col items-center gap-[6px]"
          >
            <span className={`text-[18px] ${item.active ? "text-[#2482C5]" : "text-gray-400"}`}>{item.icon}</span>
            <span className={`text-[11px] font-semibold ${item.active ? "text-[#2482C5]" : "text-gray-400"}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// --- 메인 페이지 컴포넌트 ---
export default function WooriMainPage() {
  const router = useRouter();
  const { userName } = useUserData();
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [isNoticeOpen, setNoticeOpen] = useState(false);

  // ✅ Zustand 사용: setSourceAccountNumber(저장), resetFlow(초기화)
  const { setSourceAccountNumber, resetFlow } = useTransferFlow();

  const [representativeAccount, setRepresentativeAccount] = useState<EducationalAccount | null>(null);
  const [isAccountLoading, setIsAccountLoading] = useState(true);

  // ✅ [필수] 메인 페이지 입장 시 "기존 이체 데이터 청소" (이걸 추가해야 안전합니다)
  useEffect(() => {
    console.log("🧹 메인 페이지 입장: 기존 이체 기록 초기화");
    resetFlow(); 
  }, [resetFlow]);

  // 계좌 목록 불러오기 로직
  useEffect(() => {
    const controller = new AbortController();
    const fetchRepresentativeAccount = async () => {
      try {
        const allAccounts = await getAccountList(controller.signal);
        const representativeAccount = getRepresentativeAccount(allAccounts);
        if (!representativeAccount) {
          devError(`[fetchRepresentativeAccount] 계좌가 없습니다.`);
          setRepresentativeAccount(null);
          return;
        }
        setRepresentativeAccount(representativeAccount);
      } catch (error: unknown) {
        if (isAbortError(error)) return;
        devError("[fetchRepresentativeAccount] 대표 계좌 조회 실패:", error);
        setRepresentativeAccount(null);
      } finally {
        setIsAccountLoading(false);
      }
    };
    fetchRepresentativeAccount();
    return () => {
      controller.abort();
    };
  }, []);

  const handleNavigate = (route: string) => router.push(route);
  const handleOpenMenu = () => setMenuOpen(true);
  const handleCloseMenu = () => setMenuOpen(false);
  const handleViewAllAccounts = () => router.push("/searchaccount-scenario");
  const handleOpenNotice = (message: string) => { setNoticeMessage(message); setNoticeOpen(true); };
  const handleCloseNotice = () => setNoticeOpen(false);

  // ✅ 이체 버튼 클릭 시 로직
  const handleTransfer = () => {
    console.log("🖱️ 이체 버튼 클릭됨!");

    if (!representativeAccount) {
      console.error("❌ 대표 계좌 데이터가 없습니다 (null)");
      return;
    }

    console.log("✅ 저장할 계좌번호:", representativeAccount.accountNumber);
    
    // 1. Zustand에 저장 (페이지 이동해도 유지됨)
    setSourceAccountNumber(representativeAccount.accountNumber);

    // 2. 깔끔하게 페이지 이동 (URL 파라미터 필요 없음!)
    console.log("🚀 페이지 이동 시작...");
    router.push("/transfer-scenario");
  };

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FB]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col">
        {/* 사용자 인사 헤더 */}
        <div className="px-[20px] pt-[30px]">
          <HeaderUserBar userName={userName} onOpenMenu={handleOpenMenu} />
        </div>
        <main className="flex-1 overflow-y-auto px-[20px] pb-[100px]">
          <div className="space-y-[24px] pb-[24px]">
            {/* 대표 계좌 카드 */}
            <AccountCard
              account={representativeAccount}
              isLoading={isAccountLoading}
              onTransfer={handleTransfer}
              onViewAll={handleViewAllAccounts}
            />
            {/* 빠른 메뉴 목록 */}
            <QuickMenuList />
            {/* 보이스피싱 안내 카드 */}
            <AlertCard />
            {/* 우리금융그룹 서비스 */}
            <ServiceGrid />
          </div>
        </main>
      </div>
      {/* 하단 네비게이션 */}
      <BottomNav onNavigate={handleNavigate} />
      <ServiceMenuSheet
        isOpen={isMenuOpen}
        onClose={handleCloseMenu}
        userName={userName}
        onNavigate={handleNavigate}
        onOpenNotice={handleOpenNotice}
      />
      <Modal
        isOpen={isNoticeOpen}
        onClose={handleCloseNotice}
        title="서비스 준비 중"
        description={noticeMessage || "서비스 준비 중입니다."}
        confirmText="확인"
        cancelText="닫기"
        onConfirm={handleCloseNotice}
        zIndex="z-[100]"
      />
    </div>
  );
}