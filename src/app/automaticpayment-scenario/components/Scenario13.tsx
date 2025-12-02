"use client";

import Button from "@/components/common/Button";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import Image from "next/image";

type Scenario13Props = {
  sourceAccountName: string;
  sourceAccountNumber: string;
  onNext: () => void;
};

const BANK_IMAGES: Record<string, string> = {
  "우리은행": "/images/bank1.png",
  "농협은행": "/images/bank2.png",
  "국민은행": "/images/bank3.png",
  "카카오뱅크": "/images/bank4.png",
  "신한은행": "/images/bank5.png",
  "하나은행": "/images/bank6.png",
  "기업은행": "/images/bank7.png",
  "토스뱅크": "/images/bank8.png",
  "새마을금고": "/images/bank9.png",
  "케이뱅크": "/images/bank10.png",
  "iM뱅크": "/images/bank11.png",
  "부산은행": "/images/bank12.png",
};

export default function Scenario13({
  sourceAccountName,
  sourceAccountNumber,
  onNext,
}: Scenario13Props) {
  const { selectedBank, accountNumber, amount, recipientName } = useTransferFlow();

  const displayAmount = amount ? `${amount.toLocaleString()}원` : "0원";
  const displayBank = selectedBank ?? "국민은행";
  const bankImage = BANK_IMAGES[displayBank] || "/images/bank3.png"; 
  const displayAccount = accountNumber || "-";
  const displayRecipient = recipientName ? `${recipientName}님 계좌로` : "받는 분 계좌로";

  return (
    <div className="flex h-full flex-col">
      <section className="mt-[32px] space-y-[20px]">
        <div className="flex items-start gap-[12px]">
        <Image
            src="/images/bank1.png"
            alt="우리은행"
            width={32}
            height={32}
          />
          <div className="flex flex-col gap-[6px]">
            <p className="text-[15px] font-semibold text-gray-900">
              {sourceAccountName}에서
            </p>
            <p className="text-[13px] text-gray-500">
              우리은행 · {sourceAccountNumber}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-[12px]">
        <Image
            src={bankImage}
            alt={displayBank}
            width={32}
            height={32}
          />
          <div className="flex flex-col gap-[6px]">
            <p className="text-[15px] font-semibold text-gray-900 whitespace-nowrap">
              {displayRecipient}
            </p>
            <p className="text-[13px] text-gray-500 whitespace-nowrap">
              {displayBank} · {displayAccount}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-[40px] space-y-[12px]">
        <span className="text-[18px] font-semibold text-gray-900">
          이체 금액을 확인해 주세요
        </span>
        <div className="mt-[28px] rounded-[16px] border border-gray-200 bg-white px-[20px] py-[28px] text-center shadow-sm">
          <p className="text-[28px] font-bold text-gray-900">{displayAmount}</p>
          <p className="mt-[8px] text-[14px] text-gray-500">
            자동이체 시 매회 출금될 금액입니다.
          </p>
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-[12px] pb-[24px]">
        <Button onClick={onNext} disabled={!amount}>
          확인
        </Button>
      </div>
    </div>
  );
}

