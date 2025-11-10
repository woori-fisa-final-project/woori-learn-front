"use client";

import { useRouter } from "next/navigation";
import { useUserData } from "@/lib/hooks/useUserData";

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

function HeaderUserBar({ userName }: { userName?: string }) {
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
        <span role="img" aria-label="menu">
          ☰
        </span>
      </div>
    </header>
  );
}

function AccountCard({ onTransfer, onViewAll }: { onTransfer: () => void; onViewAll: () => void }) {
  return (
    <section className="rounded-[16px] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-[10px]">
        <img src="/images/woorilogo.png" alt="Woori Bank" className="h-[20px] w-auto" />
        <p className="text-[18px] font-semibold text-gray-900">WON 통장</p>
      </div>
      <div className="mt-[14px] flex items-center justify-between">
        <p className="text-[13px] text-gray-600">우리 1002-166-728332</p>
        <span className="rounded-full bg-primary-50 px-[10px] py-[4px] text-[11px] text-primary-500">한도제한</span>
      </div>
      <div className="mt-[18px] flex items-center justify-between">
        <p className="text-[26px] font-bold text-gray-900">0원</p>
        <button
          type="button"
          onClick={onTransfer}
          className="rounded-[12px] bg-primary-500 px-[16px] py-[8px] text-[13px] font-semibold text-white shadow-sm transition hover:bg-primary-600"
        >
          이체
        </button>
      </div>
      <button
        type="button"
        onClick={onViewAll}
        className="mt-[16px] w-full rounded-[12px] border border-gray-300 py-[10px] text-[14px] font-medium text-gray-700"
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
          <div key={item.label} className="flex items-center gap-[12px] text-[15px] font-medium text-gray-800">
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
  return (
    <section className="space-y-[16px]">
      <h2 className="text-[18px] font-semibold text-gray-800">우리금융그룹 서비스</h2>
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
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white" style={{ paddingBottom: "max(env(safe-area-inset-bottom), 14px)" }}>
      <div className="mx-auto flex w-full max-w-[390px] items-center justify-between px-[28px] pt-[12px]">
        {NAV_ITEMS.map((item) => (
          <button key={item.label} type="button" onClick={() => onNavigate(item.route)} className="flex flex-col items-center gap-[6px]">
            <span className={`text-[18px] ${item.active ? "text-[#2482C5]" : "text-gray-400"}`}>{item.icon}</span>
            <span className={`text-[11px] font-medium ${item.active ? "text-[#2482C5]" : "text-gray-400"}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default function WooriMainPage() {
  const router = useRouter();
  const { userName } = useUserData();

  const handleNavigate = (route: string) => {
    router.push(route);
  };

  const handleTransfer = () => {
    router.push("/transfer-scenario");
  };

  const handleViewAllAccounts = () => {
    router.push("/transfer-scenario/scenario8");
  };

  return (
    <div className="min-h-[100dvh] bg-[#F5F7FB]">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col">
        <div className="px-[20px] pt-[60px]">
          <HeaderUserBar userName={userName} />
        </div>
        <main className="flex-1 overflow-y-auto px-[20px] pb-[140px]">
          <div className="space-y-[24px] pb-[24px]">
            <AccountCard onTransfer={handleTransfer} onViewAll={handleViewAllAccounts} />
            <QuickMenuList />
            <AlertCard />
            <ServiceGrid />
          </div>
        </main>
      </div>
      <BottomNav onNavigate={handleNavigate} />
    </div>
  );
}
