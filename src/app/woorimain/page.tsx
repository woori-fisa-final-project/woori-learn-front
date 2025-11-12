"use client"; // 클라이언트 컴포넌트로 선언하여 라우터와 상태 훅을 활용할 수 있습니다.

import { useRouter } from "next/navigation"; // 페이지 이동을 처리하기 위해 Next.js 라우터를 사용합니다.
import { useUserData } from "@/lib/hooks/useUserData"; // 사용자 이름 등 마이페이지 데이터를 가져옵니다.
import { useState, useEffect } from "react";
import Image from "next/image";
import Modal from "@/components/common/Modal";

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

function HeaderUserBar({ userName, onOpenMenu }: { userName?: string; onOpenMenu: () => void }) {
  // 상단 사용자 인사 영역입니다.
  return (
    <header className="mb-[30px] flex items-center justify-between">
      <p className="text-[20px] font-semibold text-gray-800">
        {userName ? `${userName}님` : "김민영님"}
      </p>
      <div className="flex items-center gap-[14px] text-[20px] text-gray-500">
        <span role="img" aria-label="vehicle">
          🚗
        </span>
        <span role="img" aria-label="character">
          😊
        </span>
        <span role="img" aria-label="notification">
          🔔
        </span>
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

const MENU_TAGS = ["뱅킹", "상품", "생활혜택", "안내지원", "부가서비스"];

const SERVICE_MENU_ITEMS = [
  "이체/출금",
  "즉시/예약이체",
  "다건이체",
  "이체내역조회",
  "자동이체",
  "계좌이동서비스",
  "더치페이",
  "ATM/영업점출금",
  "착오송금반환",
];

function ServiceMenuSheet({
  isOpen,
  onClose,
  userName,
  onNavigate,
  onOpenNotice,
}: {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onNavigate: (route: string) => void;
  onOpenNotice: (message: string) => void;
}) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 220);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[60] flex justify-end bg-black/40 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <button type="button" className="flex-1" aria-label="메뉴 닫기" onClick={onClose} />
      <div
        className={`flex h-full w-2/3 max-w-[260px] flex-col bg-white shadow-2xl transition-transform duration-200 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-[20px] pt-[24px] pb-[12px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴닫기"
            className="flex h-[24px] w-[24px] items-center justify-center"
          >
             <Image
              src="/images/backicon.png"
              alt="메뉴닫기"
              width={12}
              height={12}
              className="-rotate-90 object-contain"
            />
          </button>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-gray-900">
              {userName ? `${userName} 님` : "김우리 님"}
            </p>
          </div>
          <Image
            src="/images/setting.png"
            alt="설정"
            width={16}
            height={16}
          />
        </header>

        <div className="px-[20px]">
          <div className="flex items-center rounded-[12px] border border-gray-200 px-[12px]">
            <Image
              src="/images/readingglasses.png"
              alt="검색"
              width={13}
              height={13}
            />
            <input
              type="text"
              placeholder="메뉴, 상품 등을 검색해 보세요"
              className="ml-[8px] h-[42px] flex-1 bg-transparent text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <div className="mt-[16px] flex flex-wrap gap-[8px] text-[12px]">
            {MENU_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-[12px] bg-gray-100 px-[12px] py-[6px] text-gray-600"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <nav className="mt-[28px] flex-1 overflow-y-auto px-[20px] pb-[24px]">
          <ul className="mt-[16px] space-y-[20px] text-[16px] text-gray-800">
          {SERVICE_MENU_ITEMS.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="w-full cursor-pointer text-left transition hover:text-primary-500"
              onClick={() => {
                    if (item === "자동이체") {
                      onNavigate("/automaticpayment-scenario");
                      onClose();
                      return;
                    }
                    onOpenNotice(`${item} 메뉴는 준비 중입니다.`);
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

function AccountCard({
  onTransfer,
  onViewAll,
}: {
  onTransfer: () => void;
  onViewAll: () => void;
}) {
  // 대표 계좌 요약 카드입니다.
  return (
    <section className="rounded-[16px] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-[10px]">
        <img
          src="/images/woorilogo.png"
          alt="Woori Bank"
          className="h-[20px] w-auto"
        />
        <p className="text-[18px] font-semibold text-gray-900">WON 통장</p>
      </div>
      <div className="mt-[14px] flex items-center justify-between">
        <p className="text-[13px] text-gray-600">우리 1002-166-728332</p>
        <span className="rounded-full bg-primary-400 px-[10px] py-[4px] text-[11px] text-primary-500">
          한도제한
        </span>
      </div>
      <div className="mt-[18px] flex items-center justify-between">
        <p className="text-[26px] font-bold text-gray-900">0원</p>
        <button
          type="button"
          onClick={onTransfer}
          className="rounded-[12px] bg-primary-500 px-[16px] py-[8px] text-[13px] font-semibold text-gray-700 shadow-sm transition hover:bg-primary-600"
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
  // 자주 사용하는 빠른 메뉴 목록입니다.
  return (
    <section className="rounded-[16px] bg-transparent">
      <div className="flex flex-col gap-[10px]">
        {QUICK_MENU.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-[12px] text-[15px] font-medium text-gray-800"
          >
            <span className="text-[18px]" role="img" aria-hidden>
              {item.icon}
            </span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function AlertCard() {
  // 보이스피싱 주의 안내 카드입니다.
  return (
    <section className="flex items-center justify-between rounded-[16px] bg-[#FEECEC] px-[20px] py-[16px]">
      <div>
        <p className="text-[15px] font-semibold text-[#D45454]">잠깐만요!</p>
        <p className="mt-[6px] text-[12px] text-[#7A4040]">
          보이스피싱이 의심된다면 확인하고
          <br />
          예방하세요.
        </p>
      </div>
      <span className="text-[34px]" role="img" aria-label="shield">
        🛡️
      </span>
    </section>
  );
}

function ServiceGrid() {
  // 우리금융그룹의 다양한 서비스를 그리드로 보여줍니다.
  return (
    <section className="space-y-[16px]">
      <h2 className="text-[18px] font-semibold text-gray-800">
        우리금융그룹 서비스
      </h2>
      <div className="grid grid-cols-3 gap-[16px]">
        {SERVICES.map((service) => (
          <div
            key={service.label}
            className="flex h-[118px] flex-col items-center justify-center rounded-[16px] bg-white p-4 text-[13px] font-medium text-gray-700 shadow-sm"
          >
            <span className="mb-[10px] text-[26px]" role="img" aria-hidden>
              {service.icon}
            </span>
            {service.label}
          </div>
        ))}
      </div>
    </section>
  );
}

function BottomNav({ onNavigate }: { onNavigate: (route: string) => void }) {
  // 하단 탭 네비게이션입니다.
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white"
      style={{ paddingBottom: "max(env(safe-area-inset-bottom), 14px)" }}
    >
      <div className="mx-auto flex w-full max-w-[390px] items-center justify-between px-[28px] pt-[12px]">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onNavigate(item.route)}
            className="flex flex-col items-center gap-[6px]"
          >
            <span
              className={`text-[18px] ${
                item.active ? "text-[#2482C5]" : "text-gray-400"
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-[11px] font-medium ${
                item.active ? "text-[#2482C5]" : "text-gray-400"
              }`}
            >
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function WooriMainPage() {
  const router = useRouter(); // 버튼 클릭 시 이동을 처리하기 위해 라우터를 사용합니다.
  const { userName } = useUserData(); // 사용자 이름을 가져와 헤더에 표시합니다.
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [noticeMessage, setNoticeMessage] = useState("");
  const [isNoticeOpen, setNoticeOpen] = useState(false);

  const handleNavigate = (route: string) => {
    router.push(route); // 하단 네비게이션에서 선택한 경로로 이동합니다.
  };

  const handleOpenMenu = () => {
    setMenuOpen(true);
  };

  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  const handleTransfer = () => {
    router.push("/transfer-scenario"); // 이체 시나리오 진입 페이지로 이동합니다.
  };

  const handleViewAllAccounts = () => {
    router.push("/searchaccount-scenario"); // 전체 계좌 조회 시나리오 페이지로 이동합니다.
  };

  const handleOpenNotice = (message: string) => {
    setNoticeMessage(message);
    setNoticeOpen(true);
  };

  const handleCloseNotice = () => {
    setNoticeOpen(false);
  };

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FB]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col">
        {/* 사용자 인사 헤더 */}
        <div className="px-[20px] pt-[60px]">
          <HeaderUserBar userName={userName} onOpenMenu={handleOpenMenu} />
        </div>
        <main className="flex-1 overflow-y-auto px-[20px] pb-[140px]">
          <div className="space-y-[24px] pb-[24px]">
            {/* 대표 계좌 카드 */}
            <AccountCard
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
