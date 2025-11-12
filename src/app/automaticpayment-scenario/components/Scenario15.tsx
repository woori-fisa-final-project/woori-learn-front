"use client";

// 자동이체 확인 단계에서 필요한 공통 컴포넌트와 상태 훅을 불러온다.
import Button from "@/components/common/Button";
import InfoRow from "@/components/common/InfoRow";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { formatDate } from "@/lib/utils/formatDate";
import { useMemo } from "react";
import type { ScheduleSummary } from "./types";

// 확인 화면에서 사용하는 데이터와 콜백을 명시한다.
type Scenario15Props = {
  sourceAccountName: string;
  sourceAccountNumber: string;
  sourceAccountBank: string;
  scheduleSummary: ScheduleSummary;
  onEditAmount: () => void;
  onEditAccount: () => void;
  onEditSchedule: () => void;
  onSubmit: () => void;
};

// 자동이체 등록 직전 정보를 검토하고 수정하도록 안내하는 컴포넌트이다.
export default function Scenario15({
  sourceAccountName,
  sourceAccountNumber,
  sourceAccountBank,
  scheduleSummary,
  onEditAmount,
  onEditAccount,
  onEditSchedule,
  onSubmit,
}: Scenario15Props) {
  // 이전 단계에서 입력된 은행, 계좌, 금액, 수취인 정보를 가져온다.
  const {
    selectedBank,
    accountNumber,
    recipientName,
    amount,
    currentUserName,
  } = useTransferFlow();

  // 금액과 등록일, 기간 정보를 보기 좋은 문자열로 가공한다.
  const formattedAmount = useMemo(() => {
    if (!amount) return "0원";
    return `${amount.toLocaleString()}원`;
  }, [amount]);

  const formattedRegisterDate = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return formatDate(`${year}-${month}-${day}`);
  }, []);

  const inboundBank = selectedBank ?? "국민은행";
  const inboundAccount = accountNumber || "-";
  const inboundName = recipientName || "받는 분";
  const ownerName = currentUserName ?? "김우리";

  // 일정 요약에 있는 시작일과 종료일을 표시용 문자열로 변환한다.
  const formattedPeriod = useMemo(() => {
    if (!scheduleSummary.startDate && !scheduleSummary.endDate) {
      return "";
    }
    const start = formatDate(scheduleSummary.startDate);
    const end = scheduleSummary.endDate
      ? formatDate(scheduleSummary.endDate)
      : "미지정";
    return `${start} ~ ${end}`;
  }, [scheduleSummary.endDate, scheduleSummary.startDate]);

  return (
    <div className="flex h-full flex-col">
      <header className="mt-[28px]">
        <h1 className="text-[22px] text-center font-semibold text-gray-900">
          자동이체 등록정보를 확인해주세요
        </h1>
      </header>

      {/* 자동이체에 필요한 모든 정보를 표 형태로 정리한다. */}
      <section className="mt-[28px] divide-y divide-gray-200 rounded-[20px] border border-gray-100 bg-[#F5F7FA] px-[20px] py-[24px]">
        <InfoRow label="받는 분" value={inboundName} highlight />
        <InfoRow label="이체금액" value={formattedAmount} highlight />
        <InfoRow label="출금정보" value={`${sourceAccountBank} · ${sourceAccountNumber}`} />
        <InfoRow label="입금정보" value={`${inboundBank} · ${inboundAccount}`} />
        <InfoRow label="이체지정일" value={scheduleSummary.transferDay} highlight />
        <InfoRow label="이체주기" value={scheduleSummary.frequency} highlight />
        <InfoRow label="이체기간" value={formattedPeriod} />
        <InfoRow label="내 통장표기" value={ownerName} />
        <InfoRow label="받는 분 통장표기" value={inboundName} />
        <InfoRow label="이체등록일" value={formattedRegisterDate} />
      </section>

      {/* 사용자가 특정 정보를 다시 수정하거나 등록을 확정할 수 있는 버튼 영역이다. */}
      <section className="mt-[40px] grid grid-cols-2 gap-[10px]">
        <Button variant="secondary" size="sm" onClick={onEditAmount}>
          금액 재입력
        </Button>
        <Button variant="secondary" size="sm" onClick={onEditAccount}>
          계좌번호 재입력
        </Button>
        <Button variant="secondary" size="sm" onClick={onEditSchedule}>
          날짜 재입력
        </Button>
        <Button size="sm" onClick={onSubmit}>
          등록하기
        </Button>
      </section>
    </div>
  );
}
