"use client";

import Button from "@/components/common/Button";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useMemo } from "react";

type Scenario4Props = {
  onNext: () => void;
  onBack: () => void;
};

const QUICK_AMOUNTS = [
  { label: "+1만", value: 10000 },
  { label: "+5만", value: 50000 },
  { label: "+10만", value: 100000 },
  { label: "+100만", value: 1000000 },
  { label: "전액", value: null },
];

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

const FULL_BALANCE_AMOUNT = 0;

export default function Scenario4({ onNext, onBack }: Scenario4Props) {
  const {
    selectedBank,
    accountNumber,
    recipientName,
    amount,
    setAmount,
    sourceAccountNumber,
  } = useTransferFlow();

  const displayBank = selectedBank ?? "국민은행";
  const displayRecipient = recipientName || "나누구";
  const displayAccount = accountNumber || "-";

  const formattedAmount = useMemo(() => {
    if (!amount) return "0";
    return amount.toLocaleString();
  }, [amount]);

  const handleDigit = (digit: string) => {
    if (digit === "←") {
      onDelete();
      return;
    }

    if (digit === "00") {
      appendDigits("00");
      return;
    }

    appendDigits(digit);
  };

  const appendDigits = (digits: string) => {
    const current = amount ? amount.toString() : "";
    const nextString = `${current}${digits}`.replace(/^0+(\d)/, "$1");
    const sanitized = nextString.replace(/^0+$/, "0");
    const numericValue = Number(sanitized || "0");
    setAmount(numericValue);
  };

  const onDelete = () => {
    const current = amount.toString();
    if (current.length <= 1) {
      setAmount(0);
      return;
    }
    const next = current.slice(0, -1);
    setAmount(Number(next));
  };

  const handleQuickAmount = (value: number | null) => {
    if (value === null) {
      setAmount(FULL_BALANCE_AMOUNT);
      return;
    }
    setAmount(amount + value);
  };

  const handleConfirm = () => {
    if (!amount) return;
    onNext();
  };

  return (
    <div className="flex h-full flex-col">
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

      <div className="mt-[20px] pb-[16px]">
        <Button onClick={handleConfirm} disabled={!amount}>
          확인
        </Button>
      </div>
    </div>
  );
}

