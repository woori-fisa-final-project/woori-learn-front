"use client";

import Button from "@/components/common/Button";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useMemo } from "react";

type Scenario6Props = {
  onConfirm: () => void;
  onReenterAccount: () => void;
  onReenterAmount: () => void;
  onCancel: () => void;
  onBack: () => void;
};

export default function Scenario6({
  onConfirm,
  onReenterAccount,
  onReenterAmount,
  onCancel,
  onBack,
}: Scenario6Props) {
  const { selectedBank, accountNumber, recipientName, amount, currentUserName, sourceAccountNumber } = useTransferFlow();
  const bankName = selectedBank ?? "국민은행";
  const name = recipientName || "나누구";
  const displayAccount = accountNumber || "-";
  const senderName = currentUserName ?? "김우리";

  const formattedAmount = useMemo(() => {
    if (!amount) return "0";
    return amount.toLocaleString();
  }, [amount]);

  return (
    <div className="flex h-full flex-col">
      <section className="mt-[28px] space-y-[16px]">
        <div className="flex items-center gap-[12px]">
          <img
            src="/images/bank1.png"
            alt="우리은행"
            className="h-[52px] w-[52px]"
          />
          <img
            src="/images/bank3.png"
            alt={bankName}
            className="h-[52px] w-[52px]"
          />
        </div>

        <div >
          <p className="text-[25px] font-semibold text-gray-700">{name} 님에게</p>
          <p className="text-[26px] font-bold text-[#2F6FD9]">{formattedAmount}원</p>
          <p className="text-[25px] font-semibold text-gray-700">이체하시겠어요?</p>
          <p className="text-[18px] text-gray-500">
            {bankName} {displayAccount} 계좌로 보냅니다.
          </p>
        </div>
      </section>

      <section className="mt-[28px] space-y-[12px] rounded-[20px] bg-[#F5F7FA] px-[20px] py-[20px]">
        <ConfirmRow label="수수료" value="면제" />
        <ConfirmRow label="받는 분 통장표기" value={senderName} />
        <ConfirmRow label="내 통장표기" value={name} />
      </section>

      <div className="mt-auto flex gap-[12px] pb-[24px]">
        <button
          type="button"
          onClick={onReenterAccount}
          className="flex-1 rounded-[14px] bg-[#E7EFFD] py-[14px] text-[15px] font-semibold text-[#2F6FD9]"
        >
          계좌번호 재입력
        </button>
        <button
          type="button"
          onClick={onReenterAmount}
          className="flex-1 rounded-[14px] bg-[#E7EFFD] py-[14px] text-[15px] font-semibold text-[#2F6FD9]"
        >
          금액 재입력
        </button>
        <Button onClick={onConfirm} className="flex-1" fullWidth={false}>
          이체
        </Button>
      </div>
    </div>
  );
}

type ConfirmRowProps = {
  label: string;
  value: string;
};

function ConfirmRow({ label, value }: ConfirmRowProps) {
  return (
    <div className="flex items-center justify-between text-[13px] text-gray-600">
      <span>{label}</span>
      <span className="text-[15px] font-semibold text-gray-800">{value}</span>
    </div>
  );
}

