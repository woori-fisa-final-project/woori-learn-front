"use client"; // 클라이언트 컴포넌트로 선언하여 입력 상태와 이벤트를 처리합니다.

import Button from "@/components/common/Button"; // 확인 버튼에 사용할 공통 컴포넌트입니다.
import { useTransferFlow } from "@/lib/hooks/useTransferFlow"; // 이체 플로우 상태를 공유하는 커스텀 훅입니다.
import { useMemo } from "react"; // 금액 표시에 사용할 메모이제이션을 위해 React 훅을 불러옵니다.

type Scenario4Props = {
  onNext: () => void; // 금액 입력 후 다음 단계로 전환할 콜백입니다.
  onBack: () => void; // 뒤로가기를 처리할 콜백입니다.
};

// 빠른 금액 선택 버튼에 사용할 라벨과 증가값 목록입니다.
const QUICK_AMOUNTS = [
  { label: "+1만", value: 10000 },
  { label: "+5만", value: 50000 },
  { label: "+10만", value: 100000 },
  { label: "+100만", value: 1000000 },
  { label: "전액", value: null },
];

// 화면 하단 숫자 키패드에 표시할 키 리스트입니다.
const KEYPAD_KEYS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "00",
  "0",
  "←",
];

const FULL_BALANCE_AMOUNT = 0; // 전액 버튼이 눌렸을 때 적용할 임시 잔액 값입니다.

export default function Scenario4({ onNext, onBack }: Scenario4Props) {
  const {
    selectedBank,
    accountNumber,
    recipientName,
    amount,
    setAmount,
    sourceAccountNumber,
  } = useTransferFlow(); // 플로우 전반에서 공유되는 은행, 계좌, 금액 정보를 가져옵니다.

  const displayBank = selectedBank ?? "국민은행"; // 은행 선택이 없으면 기본값을 표시합니다.
  const displayRecipient = recipientName || "나누구"; // 수취인 이름이 비어 있으면 기본명을 사용합니다.
  const displayAccount = accountNumber || "-"; // 계좌번호가 미입력인 경우 대시(-)로 표시합니다.

  const formattedAmount = useMemo(() => {
    if (!amount) return "0";
    return amount.toLocaleString(); // 입력 금액을 천 단위 구분 기호가 포함된 문자열로 변환합니다.
  }, [amount]);

  const handleDigit = (digit: string) => {
    if (digit === "←") {
      onDelete(); // 백스페이스 버튼은 마지막 자리를 삭제합니다.
      return;
    }

    if (digit === "00") {
      appendDigits("00"); // 00 버튼은 두 자리 숫자를 한 번에 추가합니다.
      return;
    }

    appendDigits(digit); // 일반 숫자 버튼은 해당 숫자를 이어 붙입니다.
  };

  const appendDigits = (digits: string) => {
    const current = amount ? amount.toString() : "";
    const nextString = `${current}${digits}`.replace(/^0+(\d)/, "$1");
    const sanitized = nextString.replace(/^0+$/, "0");
    const numericValue = Number(sanitized || "0");
    setAmount(numericValue); // 계산된 숫자 값을 금액 상태에 저장합니다.
  };

  const onDelete = () => {
    const current = amount.toString();
    if (current.length <= 1) {
      setAmount(0); // 한 자리만 남아 있다면 삭제 후 0으로 초기화합니다.
      return;
    }
    const next = current.slice(0, -1);
    setAmount(Number(next)); // 마지막 자리를 제거한 숫자를 금액으로 설정합니다.
  };

  const handleQuickAmount = (value: number | null) => {
    if (value === null) {
      setAmount(FULL_BALANCE_AMOUNT); // 전액 버튼은 미리 정의된 잔액 값으로 설정합니다.
      return;
    }
    setAmount(amount + value); // 빠른 금액 버튼은 현재 금액에 해당 값을 더합니다.
  };

  const handleConfirm = () => {
    if (!amount) return;
    onNext(); // 금액이 입력되어 있으면 다음 단계로 이동합니다.
  };

  return (
    <div className="flex h-full flex-col">
      {/* 보내는 계좌와 받는 계좌 정보를 보여주는 영역 */}
      <section className=" space-y-[20px]">
        <div className="flex items-center gap-[12px]">
          <img
            src="/images/bank1.png"
            alt="우리은행"
            className="h-[32px] w-[32px]"
          />
          <div>
            <p className="text-[15px] font-semibold text-gray-900">우리은행계좌에서</p>
            <p className="mt-[6px] text-[13px] text-gray-500">우리은행 · {sourceAccountNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-[12px]">
          <img
            src="/images/bank3.png"
            alt={displayBank}
            className="h-[32px] w-[32px]"
          />
          <div>
            <p className="text-[15px] font-semibold text-gray-900 whitespace-nowrap">
              {displayRecipient}님 계좌로
            </p>
            <p className="mt-[6px] text-[13px] text-gray-500 whitespace-nowrap">
              {displayBank} · {displayAccount}
            </p>
          </div>
        </div>
      </section>

      {/* 금액 입력 안내와 현재 입력된 금액 표시 */}
      <section className="mt-[28px] space-y-[8px]">
        <h2 className="text-[20px] font-semibold text-gray-900">
          얼마를 이체하시겠어요?
        </h2>
        <p className="text-[13px] text-gray-500">출금가능금액 0원</p>
        <div className="mt-[8px] text-right text-[36px] font-bold text-gray-900">
          {formattedAmount}
          <span className="ml-[4px] text-[20px] font-semibold text-gray-800">원</span>
        </div>
      </section>

      {/* 빠르게 금액을 추가할 수 있는 버튼들 */}
      <div className="mt-[20px] flex flex-nowrap gap-[10px]">
        {QUICK_AMOUNTS.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => handleQuickAmount(item.value)}
            className="flex-1 rounded-[16px] border border-gray-200 px-[12px] py-[10px] text-center text-[11px] font-medium text-gray-600"
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* 숫자 키패드 버튼 목록 */}
      <section className="mt-[24px] grid grid-cols-3 gap-[14px]">
        {KEYPAD_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => handleDigit(key)}
            className="h-[58px] rounded-[16px] bg-white text-[25px] font-semibold text-gray-900"
          >
            {key}
          </button>
        ))}
      </section>

      {/* 입력이 완료된 후 다음 단계로 진행하는 확인 버튼 */}
      <div className="mt-[20px] pb-[16px]">
        <Button onClick={handleConfirm} disabled={!amount}>
          확인
        </Button>
      </div>
    </div>
  );
}

