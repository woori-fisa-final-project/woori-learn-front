"use client"; // 클라이언트 컴포넌트로 선언하여 라우터와 상태를 사용할 수 있도록 합니다.

import { useEffect } from "react"; // 헤더 뒤로가기 동작을 설정하기 위해 effect 훅을 사용합니다.
import { useRouter } from "next/navigation"; // 다른 페이지로 이동하기 위해 Next.js 라우터를 불러옵니다.
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext"; // 시나리오 헤더의 뒤로가기 버튼 동작을 커스터마이징합니다.
import { useTransferFlow } from "@/lib/hooks/useTransferFlow"; // 이체 플로우에서 공유하는 상태(출금 계좌 번호 등)를 가져옵니다.

const QUICK_FILTERS = [
  // 빠르게 필터를 토글할 수 있도록 라벨과 활성 여부를 정리한 배열입니다.
  { label: "입출금", active: true },
  { label: "우리금융그룹", active: false },
];

const ACCOUNT_CARDS = [
  // 화면에 노출될 각 계좌 카드를 정의하고, 필요 시 추가 정보를 포함합니다.
  {
    title: "WON통장",
    bank: "우리",
    accountKey: "source" as const,
    badge: "한도제한",
    balance: "0원",
    transferAvailable: true, // 입출금 계좌는 이체 시나리오 9로 이동할 수 있습니다.
  },
  {
    title: "WON적금통장",
    bank: "우리",
    accountNumber: "0000-000-000000",
    badge: "한도제한",
    balance: "0원",
    transferAvailable: false, // 예적금 계좌는 학습 시나리오상 이체가 제한되어 있음을 안내합니다.
    disabledMessage: "예적금 계좌에서는 이체를 이용할 수 없습니다.", // 눌렀을 때 안내로 사용할 메시지입니다.
  },
];

export default function Scenario8() {
  const router = useRouter(); // 다른 시나리오 단계로 이동시 사용합니다.
  const { setOnBack, setTitle } = useScenarioHeader(); // 헤더 뒤로가기 버튼을 메인 화면으로 연결하기 위해 컨텍스트를 사용합니다.
  const { sourceAccountNumber } = useTransferFlow(); // 사용자가 선택한 출금 계좌 번호를 가져옵니다.

  useEffect(() => {
    setTitle("전체계좌"); // 목록 화면이라는 것을 헤더에서 명확히 보여 줍니다.
    setOnBack(() => () => {
      router.push("/woorimain"); // 시나리오 8에서 뒤로가기를 누르면 항상 우리메인 화면으로 이동하도록 고정합니다.
    });

    return () => {
      setTitle("");
      setOnBack(null); // 시나리오 8을 벗어날 때는 뒤로가기 설정을 초기화합니다.
    };
  }, [router, setOnBack, setTitle]);

  const renderAccountNumber = (item: (typeof ACCOUNT_CARDS)[number]) => {
    // 출금 계좌 카드를 렌더링할 때는 컨텍스트에서 최신 번호를 꺼내고, 그렇지 않으면 카드에 정의된 값을 표시합니다.
    if (item.accountKey === "source") {
      return sourceAccountNumber; // 출금 계좌 카드일 때는 컨텍스트에 저장된 계좌번호를 사용합니다.
    }
    return item.accountNumber ?? "0000-000-000000"; // 그 외에는 카드에 정의된 계좌번호를 표시합니다.
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col"> {/* 모바일 해상도를 기준으로 한 가운데 정렬된 래퍼입니다. */}
      <main className="flex-1 overflow-y-auto px-[20px] pb-[40px]"> {/* 스크롤 가능한 실제 콘텐츠 영역입니다. */}
        {/* 탭 네비게이션 영역 */}
        <section className="mt-[24px] flex items-center justify-between">
          <nav className="flex items-center gap-[12px] text-[15px] font-semibold">
            <span className="rounded-[16px] bg-[#2F6FD9] px-[14px] py-[6px] text-white">
              계좌
            </span>
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
                  filter.active
                    ? "bg-[#E4EEFF] text-[#2F6FD9]"
                    : "bg-white text-gray-600"
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
              router.push("/searchaccount-scenario?step=9"); // 입출금 계좌에서는 거래내역 조회(시나리오 9) 화면으로 이동합니다.
            }}
          />
          <CategoryBlock
            title="예적금 1"
            accounts={[ACCOUNT_CARDS[1]]}
            renderAccountNumber={renderAccountNumber}
            onTransfer={(account) => {
              if (!account.transferAvailable) {
                window.alert(account.disabledMessage ?? "해당 계좌에서는 이체를 이용할 수 없습니다."); // 예적금 계좌에서는 제한 메시지를 출력합니다.
                // 추후에 위비 말풍선으로 대체하기
                return;
              }
              router.push("/searchaccount-scenario?step=9"); // 향후 조건이 충족되면 동일한 경로로 이동할 수 있습니다.
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

function CategoryBlock({
  title,
  accounts,
  renderAccountNumber,
  onTransfer,
}: CategoryBlockProps) {
  return (
    <div>
      {/* 카테고리 헤더 */}
      <div className="flex items-center justify-between text-[13px] text-gray-500">
        <span>{title}</span>
        <span>0원</span>
      </div>
      <div className="mt-[16px] space-y-[16px]">
        {accounts.map((item) => (
          <div
            key={item.title}
            className="rounded-[16px] bg-white p-[18px] shadow-sm"
          >
            <div className="flex items-center justify-between gap-[10px]">
              <div className="flex items-center gap-[10px]">
                <img
                  src="/images/bank1.png"
                  alt="우리은행"
                  className="h-[28px] w-[28px]"
                />
                <div>
                  <p className="text-[16px] font-semibold text-gray-900">
                    {item.title}
                  </p>
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
              <span className="text-[18px] font-semibold text-gray-900">
                {item.balance}
              </span>
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
