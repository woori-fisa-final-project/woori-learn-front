"use client";

import { useRouter } from "next/navigation";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";

const QUICK_FILTERS = [
  { label: "입출금", active: true },
  { label: "우리금융그룹", active: false },
];

const ACCOUNT_CARDS = [
  {
    title: "WON통장",
    bank: "우리",
    accountKey: "source" as const,
    badge: "한도제한",
    balance: "0원",
  },
  {
    title: "WON적금통장",
    bank: "우리",
    accountNumber: "0000-000-000000",
    badge: "자동이체",
    balance: "0원",
  },
];

export default function Scenario8() {
  const router = useRouter();
  const { sourceAccountNumber } = useTransferFlow();

  const renderAccountNumber = (item: (typeof ACCOUNT_CARDS)[number]) => {
    if (item.accountKey === "source") {
      return sourceAccountNumber;
    }
    return item.accountNumber ?? "0000-000-000000";
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col bg-[#F5F7FB]">
      <header className="flex items-center justify-between px-[20px] pt-[60px]">
        <button
          type="button"
          onClick={() => router.back()}
          className="w-[14px] h-[7px] flex items-center justify-center -rotate-90"
          aria-label="뒤로가기"
        >
          <img src="/images/backicon.png" alt="뒤로가기" className="h-full w-full object-contain" />
        </button>
        <h1 className="text-[18px] font-semibold text-gray-900">전체계좌조회</h1>
        <button type="button" className="text-[14px] text-[#2F6FD9]">
          편집
        </button>
      </header>

      <main className="flex-1 overflow-y-auto px-[20px] pb-[40px]">
        <section className="mt-[24px] flex items-center justify-between">
          <nav className="flex items-center gap-[12px] text-[15px] font-semibold">
            <span className="rounded-[16px] bg-[#2F6FD9] px-[14px] py-[6px] text-white">계좌</span>
            <span className="text-gray-400">카드</span>
            <span className="text-gray-400">페이</span>
          </nav>
          <div className="flex items-center gap-[12px] text-[13px] text-gray-500">
            <button type="button" className="flex items-center gap-[6px]">
              우리
              <span className="text-[10px]">⌄</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-[8px]"
              aria-label="총금액 표시 토글"
            >
              <span>총금액</span>
              <span className="relative inline-flex h-[22px] w-[42px] items-center rounded-full bg-[#2F6FD9]">
                <span className="absolute left-[22px] h-[18px] w-[18px] rounded-full bg-white transition" />
              </span>
            </button>
          </div>
        </section>

        <section className="mt-[24px]">
          <p className="text-[28px] font-bold text-gray-900">0원</p>
          <div className="mt-[16px] flex gap-[10px]">
            {QUICK_FILTERS.map((filter) => (
              <button
                key={filter.label}
                type="button"
                className={`rounded-[16px] px-[16px] py-[8px] text-[13px] font-medium ${
                  filter.active ? "bg-[#E4EEFF] text-[#2F6FD9]" : "bg-white text-gray-600"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-[28px] space-y-[24px]">
          <CategoryBlock
            title="입출금 1"
            accounts={[ACCOUNT_CARDS[0]]}
            renderAccountNumber={renderAccountNumber}
          />
          <CategoryBlock
            title="예적금 1"
            accounts={[ACCOUNT_CARDS[1]]}
            renderAccountNumber={renderAccountNumber}
          />
        </section>
      </main>
    </div>
  );
}

type CategoryBlockProps = {
  title: string;
  accounts: Array<(typeof ACCOUNT_CARDS)[number]>;
  renderAccountNumber: (item: (typeof ACCOUNT_CARDS)[number]) => string;
};

function CategoryBlock({ title, accounts, renderAccountNumber }: CategoryBlockProps) {
  return (
    <div>
      <div className="flex items-center justify-between text-[13px] text-gray-500">
        <span>{title}</span>
        <span>0원</span>
      </div>
      <div className="mt-[16px] space-y-[16px]">
        {accounts.map((item) => (
          <div key={item.title} className="rounded-[16px] bg-white p-[18px] shadow-sm">
            <div className="flex items-center gap-[10px]">
              <img src="/images/bank1.png" alt="우리은행" className="h-[28px] w-[28px]" />
              <div>
                <p className="text-[16px] font-semibold text-gray-900">{item.title}</p>
                <p className="mt-[4px] text-[13px] text-gray-500">
                  {item.bank} {renderAccountNumber(item)}
                </p>
              </div>
            </div>
            <div className="mt-[16px] flex items-center justify-between">
              <span className="rounded-[12px] bg-[#E4EEFF] px-[12px] py-[6px] text-[11px] text-[#2F6FD9]">
                {item.badge}
              </span>
              <div className="flex items-center gap-[12px] text-[14px]">
                <span className="text-gray-900">{item.balance}</span>
                <button type="button" className="text-[#2F6FD9]">
                  이체
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
