"use client";

import Button from "@/components/common/Button";
import InfoRow from "@/components/common/InfoRow";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useUserData } from "@/lib/hooks/useUserData";
import { formatDate } from "@/utils/formatDate";
import { formatDateRange } from "@/utils/formatDateRange";
import { useMemo } from "react";
import type { ScheduleSummary } from "./types";

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

export default function Scenario15({
  sourceAccountNumber,
  sourceAccountBank,
  scheduleSummary,
  onEditAmount,
  onEditAccount,
  onEditSchedule,
  onSubmit,
}: Scenario15Props) {

  const { selectedBank, accountNumber, recipientName, amount, } = useTransferFlow();

  const { userName: currentUserName } = useUserData();

  const formattedAmount = useMemo(() => {
    if (typeof amount !== "number") return "0원";
    return `${amount.toLocaleString()}원`;
  }, [amount]);

  const formattedRegisterDate = useMemo(() => formatDate(new Date()), []);
  const inboundBank = selectedBank ?? "국민은행";
  const inboundAccount = accountNumber ? String(accountNumber) : "-";
  const inboundName = recipientName || "받는 분";
  const ownerName = currentUserName ?? "김우리";

  const formattedPeriod = useMemo(
    () => formatDateRange(scheduleSummary.startDate, scheduleSummary.endDate),
    [scheduleSummary.endDate, scheduleSummary.startDate]
  );

  return (
    <div className="flex h-full flex-col">
      <header className="mt-[5px]">
        <h1 className="text-[22px] text-center font-semibold text-gray-900">자동이체 등록정보를 확인해주세요</h1>
      </header>

      <section className="mt-[28px] divide-y divide-gray-200 rounded-[20px] border border-gray-100 bg-[#F5F7FA] px-[20px] py-[24px]">
        <InfoRow label="받는 분" value={inboundName} highlight />
        <InfoRow label="이체금액" value={formattedAmount} highlight />
        <InfoRow label="출금정보" value={`${sourceAccountBank} · ${sourceAccountNumber}`} />
        <InfoRow label="입금정보" value={`${inboundBank} · ${inboundAccount}`} />
        <InfoRow label="이체지정일" value={scheduleSummary.transferDay} highlight />
        <InfoRow label="이체주기" value={scheduleSummary.frequency} highlight />
        <InfoRow label="이체기간" value={formattedPeriod} />
        <InfoRow label="내 통장표기" value={inboundName} />
        <InfoRow label="받는 분 통장표기" value={ownerName} />
        <InfoRow label="이체등록일" value={formattedRegisterDate} />
      </section>

      <section className="mt-[40px] mb-[80px] grid grid-cols-2 gap-[10px]">
        <Button variant="secondary" size="sm" onClick={onEditAmount}>
          금액 재입력
        </Button>
        <Button variant="secondary" size="sm" onClick={onEditAccount}>
          계좌번호 재입력
        </Button>
        <Button variant="secondary" size="sm" onClick={onEditSchedule}>
          날짜 재입력
        </Button>

        <div className="w-full">
          <div className="w-full">
            <Button size="sm" onClick={onSubmit}>
              등록하기
            </Button>
          </div>
        </div>

      </section>
    </div>
  );
}