"use client"; // 클라이언트 컴포넌트로 선언하여 상태와 이벤트를 사용합니다.

import Button from "@/components/common/Button";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useMemo } from "react";
import Image from "next/image";

type Scenario6Props = {
  onConfirm: () => void; // 이체 확정 버튼 클릭 시 호출되는 콜백입니다.
  onReenterAccount: () => void; // 계좌번호 재입력 버튼 클릭 시 콜백입니다.
  onReenterAmount: () => void; // 금액 재입력 버튼 클릭 시 콜백입니다.
  onCancel: () => void; // 이체 취소 버튼 클릭 시 콜백입니다.
  onBack: () => void; // 뒤로가기 처리에 사용할 콜백입니다.
};

export default function Scenario6({
  onConfirm,
  onReenterAccount,
  onReenterAmount,
  onCancel,
  onBack,
}: Scenario6Props) {
  const { selectedBank, accountNumber, recipientName, amount, currentUserName, sourceAccountNumber } = useTransferFlow(); // 플로우 컨텍스트에서 계좌 정보와 금액을 가져옵니다.
  const bankName = selectedBank ?? "국민은행"; // 선택된 은행이 없으면 기본값을 사용합니다.
  const name = recipientName || "나누구"; // 수취인 이름이 없으면 기본 이름을 표시합니다.
  const displayAccount = accountNumber || "-"; // 계좌번호가 비어 있으면 대시(-)로 보여줍니다.
  const senderName = currentUserName ?? "김우리"; // 보낸 사람 이름이 없으면 기본 이름을 사용합니다.

  const formattedAmount = useMemo(() => {
    if (!amount) return "0";
    return amount.toLocaleString(); // 천 단위 구분 기호가 포함된 금액 문자열입니다.
  }, [amount]);

  return (
    <div className="flex h-full flex-col">
      {/* 이체 요약 정보 영역 */}
      <section className="mt-[28px] space-y-[16px]">
        <div className="flex items-center gap-[12px]">
          <Image
            src="/images/bank1.png"
            alt="우리은행"
            className="h-[52px] w-[52px]"
            width={52}
            height={52}
          />
          <Image
            src="/images/bank3.png"
            alt={bankName}
            className="h-[52px] w-[52px]"
            width={52}
            height={52}
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

      {/* 수수료 및 통장 표기 내용을 확인하는 영역 */}
      <section className="mt-[28px] space-y-[12px] rounded-[20px] bg-[#F5F7FA] px-[20px] py-[20px]">
        <ConfirmRow label="수수료" value="면제" />
        <ConfirmRow label="받는 분 통장표기" value={senderName} />
        <ConfirmRow label="내 통장표기" value={name} />
      </section>

      {/* 하단 액션 버튼 묶음 */}
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
      <span className="text-[15px] font-semibold text-gray-800">{value}</span> {/* 값 영역은 굵게 강조합니다. */}
    </div>
  );
}

