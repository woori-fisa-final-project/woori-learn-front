"use client";

// 금액 확인 단계에서 버튼과 이체 흐름 상태를 사용하기 위해 필요한 모듈을 가져온다.
import Button from "@/components/common/Button";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import Image from "next/image";

// 상위에서 전달받을 계좌 정보와 다음 단계 콜백을 정의한다.
type Scenario13Props = {
  sourceAccountName: string;
  sourceAccountNumber: string;
  onNext: () => void;
};

// 금액 확인 단계 화면을 렌더링하여 사용자가 정보를 검토하도록 돕는다.
export default function Scenario13({
  sourceAccountName,
  sourceAccountNumber,
  onNext,
}: Scenario13Props) {
  // 앞선 단계에서 입력된 은행과 계좌, 금액, 수취인 정보를 불러온다.
  const { selectedBank, accountNumber, amount, recipientName } = useTransferFlow();

  // 화면에 보여줄 수 있도록 금액과 은행 정보를 보기 좋은 문자열로 변환한다.
  const displayAmount = amount ? `${amount.toLocaleString()}원` : "0원";
  const displayBank = selectedBank ?? "국민은행";
  const displayAccount = accountNumber || "-";
  const displayRecipient = recipientName ? `${recipientName}님 계좌로` : "받는 분 계좌로";

  return (
    <div className="flex h-full flex-col">
      {/* 출금 계좌와 입금 계좌 정보를 나란히 보여준다. */}
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
            src="/images/bank3.png"
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
        {/* 카드 형태로 이번 단계에서 확인해야 할 이체 금액을 강조한다. */}
        <div className="mt-[28px] rounded-[16px] border border-gray-200 bg-white px-[20px] py-[28px] text-center shadow-sm">
          <p className="text-[28px] font-bold text-gray-900">{displayAmount}</p>
          <p className="mt-[8px] text-[14px] text-gray-500">
            자동이체 시 매회 출금될 금액입니다.
          </p>
        </div>
      </section>

      <div className="mt-auto flex flex-col gap-[12px] pb-[24px]">
        {/* 금액 정보가 유효할 때만 다음 단계로 이동할 수 있도록 버튼을 제어한다. */}
        <Button onClick={onNext} disabled={!amount}>
          확인
        </Button>
      </div>
    </div>
  );
}

