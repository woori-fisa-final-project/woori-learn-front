"use client";

import Button from "@/components/common/Button";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useUserData } from "@/lib/hooks/useUserData";
import { useMemo } from "react";

type Scenario7Props = {
  onRestart: () => void;
};

export default function Scenario7({ onRestart }: Scenario7Props) {
  const {
    transferResult,
    recipientName,
    selectedBank,
    accountNumber,
    sourceAccountNumber
  } = useTransferFlow();

  const { userName: currentUserName } = useUserData();

  // transferResult가 없으면 에러 방지
  if (!transferResult) {
    return (
      <div className="flex h-full items-center justify-center flex-col gap-4 text-gray-700">
        <p>이체 정보가 유효하지 않습니다.</p>
        <Button onClick={onRestart}>돌아가기</Button>
      </div>
    );
  }

  const amount = transferResult.amount;
  const balanceAfter = transferResult.balance;
  const formattedFromAccount = transferResult.formattedAccountNumber || sourceAccountNumber;
  const displayName = transferResult.counterpartyName || recipientName || "받는사람";

  const depositAccount =
    transferResult.toAccountNumberFormatted ??
    accountNumber ??
    "000-000-000000";

  const formattedAmount = useMemo(() => {
    return `${amount.toLocaleString()}원`;
  }, [amount]);

  const depositBank = selectedBank ?? "국민은행";

  return (
    <div className="flex h-full flex-col items-center pt-[80px]">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E4EEFF]">
        <span className="text-[32px] text-[#2F6FD9]">✔</span>
      </div>

      <div className="mt-[28px] text-center">
        <p className="text-[20px] font-semibold text-gray-900">
          {displayName}님에게
        </p>
        <p className="mt-[8px] text-[20px] font-semibold text-gray-900">
          이체했어요
        </p>
      </div>

      <section className="mt-[28px] w-full space-y-[12px] rounded-[20px] bg-[#F5F7FA] px-[24px] py-[24px] text-[14px]">
        <Row label="보내는 분" value={currentUserName} highlight />
        <Row label="이체금액" value={formattedAmount} highlight />
        <Row label="출금 계좌" value={`우리은행 ${formattedFromAccount}`} />
        <Row label="입금 계좌" value={`${depositBank} ${depositAccount}`} />
        <Row label="출금 후 잔액" value={`${balanceAfter.toLocaleString()}원`} />
      </section>

      <div className="mt-auto w-full pb-[32px]">
        <Button onClick={onRestart}>확인</Button>
      </div>
    </div>
  );
}

type RowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function Row({ label, value, highlight }: RowProps) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <span>{label}</span>
      <span
        className={`font-semibold ${highlight ? "text-[#2F6FD9]" : "text-gray-900"
          }`}
      >
        {value}
      </span>
    </div>
  );
}