"use client"; // 클라이언트 컴포넌트로 선언하여 라우터와 상태를 사용할 수 있도록 합니다.

import { useRouter } from "next/navigation"; // 다른 페이지로 이동하기 위해 Next.js 라우터를 불러옵니다.
import { useTransferFlow } from "@/lib/hooks/useTransferFlow"; // 이체 플로우에서 공유하는 상태(출금 계좌 번호 등)를 가져옵니다.

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
    badge: "한도제한",
    balance: "0원",
  },
];

export default function Scenario8() {
  const router = useRouter(); // 다른 시나리오 단계로 이동시 사용합니다.
  const { sourceAccountNumber } = useTransferFlow(); // 사용자가 선택한 출금 계좌 번호를 가져옵니다.

  const renderAccountNumber = (item: (typeof ACCOUNT_CARDS)[number]) => {
    if (item.accountKey === "source") {
      return sourceAccountNumber; // 출금 계좌 카드일 때는 컨텍스트에 저장된 계좌번호를 사용합니다.
    }
    return item.accountNumber ?? "0000-000-000000"; // 그 외에는 카드에 정의된 계좌번호를 표시합니다.
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col">
      <main className="flex-1 overflow-y-auto px-[20px] pb-[40px]">
        {/* 탭 네비게이션 영역 */}
        <section className="mt-[24px] flex items-center justify-between">
          <nav className="flex items-center gap-[12px] text-[15px] font-semibold">
            <span className="rounded-[16px] bg-[#2F6FD9] px-[14px] py-[6px] text-white">계좌</span>
            <span className="text-gray-400">카드</span>
            <span className="text-gray-400">페이</span>
          </nav>
          
        </section>

        {/* 총 자산과 퀵 필터 버튼 영역 */}
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

        {/* 카테고리별 계좌 카드 리스트 */}
        <section className="mt-[28px] space-y-[24px]">
          <CategoryBlock
            title="입출금 1"
            accounts={[ACCOUNT_CARDS[0]]}
            renderAccountNumber={renderAccountNumber}
            onTransfer={(account) => {
              if (account.balance !== "0원") {
                router.push("/transfer-scenario");
              }
            }}
          />
          <CategoryBlock
            title="예적금 1"
            accounts={[ACCOUNT_CARDS[1]]}
            renderAccountNumber={renderAccountNumber}
            onTransfer={(account) => {
              if (account.balance !== "0원") {
                router.push("/transfer-scenario");
              }
            }}
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
  onTransfer: (account: (typeof ACCOUNT_CARDS)[number]) => void;
};

function CategoryBlock({ title, accounts, renderAccountNumber, onTransfer }: CategoryBlockProps) {
  return (
    <div>
      {/* 카테고리 헤더 */}
      <div className="flex items-center justify-between text-[13px] text-gray-500">
        <span>{title}</span>
        <span>0원</span>
      </div>
      <div className="mt-[16px] space-y-[16px]">
        {accounts.map((item) => (
          <div key={item.title} className="rounded-[16px] bg-white p-[18px] shadow-sm">
            <div className="flex items-center justify-between gap-[10px]">
              <div className="flex items-center gap-[10px]">
                <img src="/images/bank1.png" alt="우리은행" className="h-[28px] w-[28px]" />
                <div>
                  <p className="text-[16px] font-semibold text-gray-900">{item.title}</p>
                  <p className="mt-[4px] text-[13px] text-gray-500">
                    {item.bank} {renderAccountNumber(item)}
                  </p>
                </div>
              </div>
              {/* 추가 옵션 버튼 */}
              <button
                type="button"
                aria-label="추가 옵션"
                className="flex h-[24px] w-[24px] items-center justify-center text-[18px] text-gray-400"
              >
                ···
              </button>
            </div>
            <div className="mt-[16px] flex items-center justify-between">
              <span className="rounded-[12px] bg-[#E4EEFF] px-[12px] py-[6px] text-[11px] text-[#2F6FD9]">
                {item.badge}
              </span>
              <span className="text-[18px] font-semibold text-gray-900">{item.balance}</span>
            </div>
            {/* 이체 버튼: 잔액이 존재할 때만 시나리오 전환 */}
            <button
              type="button"
              onClick={() => onTransfer(item)}
              className="mt-[14px] w-full rounded-[12px] border border-[#D8E5FB] py-[10px] text-center text-[14px] font-semibold text-[#2F6FD9] transition hover:bg-[#E4EEFF]/60"
            >
              이체
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
