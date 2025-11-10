"use client"; // 클라이언트 컴포넌트로 선언하여 상태와 라우터 기능을 활용합니다.

import Button from "@/components/common/Button"; // 완료 화면의 확인 버튼에 사용할 공통 컴포넌트입니다.
import { useTransferFlow } from "@/lib/hooks/useTransferFlow"; // 이체 플로우 상태를 공유하는 커스텀 훅입니다.
import { useMemo } from "react"; // 금액 표시를 위해 메모이제이션을 사용합니다.

type Scenario7Props = {
  onRestart: () => void; // 확인 버튼 클릭 시 플로우를 재시작하는 콜백입니다.
};

export default function Scenario7({ onRestart }: Scenario7Props) {
  const { recipientName, amount, selectedBank, accountNumber, currentUserName, sourceAccountNumber } = useTransferFlow(); // 컨텍스트에서 이체 완료 정보를 가져옵니다.

  const displayName = recipientName || "나누구"; // 수취인 이름이 없으면 기본 이름을 사용합니다.
  const formattedAmount = useMemo(() => {
    if (!amount) return "0원";
    return `${amount.toLocaleString()}원`; // 금액을 천 단위 구분 기호가 포함된 문자열로 변환합니다.
  }, [amount]);

  const depositBank = selectedBank ?? "국민은행"; // 선택된 은행이 없으면 기본값을 사용합니다.
  const depositAccount = accountNumber || "000-000-000000"; // 계좌번호가 없으면 기본 계좌번호를 표시합니다.

  return (
    <div className="flex h-full flex-col items-center pt-[80px]">
      {/* 이체 완료를 상징하는 체크 아이콘 */}
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[#E4EEFF]">
         <span className="text-[32px] text-[#2F6FD9]">✔</span>
      </div>

      {/* 완료 메시지 문구 */}
      <div className="mt-[28px] text-center">
        <p className="text-[20px] font-semibold text-gray-900">
          {displayName}님에게
        </p>
        <p className="mt-[8px] text-[20px] font-semibold text-gray-900">
          이체했어요
        </p>
      </div>

      {/* 이체 결과 요약 카드 */}
      <section className="mt-[28px] w-full space-y-[12px] rounded-[20px] bg-[#F5F7FA] px-[24px] py-[24px] text-[14px]">
        <Row label="보내는 분" value={currentUserName} highlight />
        <Row label="이체금액" value={formattedAmount} highlight />
        <Row label="출금정보" value={`우리은행 ${sourceAccountNumber}`} />
        <Row label="입금정보" value={`${depositBank} ${depositAccount}`} />
      </section>

      {/* 확인 버튼: 시나리오 플로우를 재시작하거나 종료합니다. */}
      <div className="mt-auto w-full pb-[32px]">
        <Button onClick={onRestart}>확인</Button>
      </div>
    </div>
  );
}

type RowProps = {
  label: string; // 항목 이름입니다.
  value: string; // 항목 값입니다.
  highlight?: boolean; // 강조 표시 여부입니다.
};

function Row({ label, value, highlight }: RowProps) {
  return (
    <div className="flex items-center justify-between text-gray-600">
      <span>{label}</span>
      <span className={`font-semibold ${highlight ? "text-[#2F6FD9]" : "text-gray-900"}`}>{value}</span> {/* highlight가 true면 포인트 색으로 강조합니다. */}
    </div>
  );
}

