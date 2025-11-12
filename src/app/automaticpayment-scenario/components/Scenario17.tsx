"use client";

// 완료 화면에서 사용할 이미지, 버튼 컴포넌트와 일정 요약 타입을 불러온다.
import Image from "next/image";
import Button from "@/components/common/Button";
import type { ScheduleSummary } from "./types";

// 완료 화면에 필요한 모든 정보를 상위에서 전달받는다.
type Scenario17Props = {
  sourceAccountNumber: string;
  sourceAccountBank: string;
  scheduleSummary: ScheduleSummary;
  inboundBank: string;
  inboundAccount: string;
  inboundName: string;
  ownerName: string;
  amount: number;
  onConfirm: () => void;
};

// 자동이체 등록이 완료되었음을 알리고 요약 정보를 보여주는 컴포넌트이다.
export default function Scenario17({
  sourceAccountNumber,
  sourceAccountBank,
  scheduleSummary,
  inboundBank,
  inboundAccount,
  inboundName,
  ownerName,
  amount,
  onConfirm,
}: Scenario17Props) {
  // 금액과 기간, 등록일을 보기 좋은 문자열로 변환한다.
  const formattedAmount = amount > 0 ? `${amount.toLocaleString()}원` : "0원";
  const formattedPeriod = buildPeriod(scheduleSummary);
  const registerDate = formatDate(new Date());

  return (
    <div className="flex h-full flex-col items-center text-center">
      {/* 등록 성공을 시각적으로 알리는 아이콘과 메시지 영역이다. */}
      <div className="mt-[13px] flex flex-col items-center gap-[20px]">
        <Image src="/images/maincheck.png" alt="등록 완료" width={82} height={82} />
        <div>
          <h1 className="text-[24px] font-semibold text-gray-900 tracking-[-0.5px]">
            자동이체를 등록했어요
          </h1>
          <p className="mt-[8px] text-[14px] text-gray-500">
            등록 내역을 확인해 주세요.
          </p>
        </div>
      </div>

      {/* 자동이체 요약 정보를 카드 형태로 정리하여 제공한다. */}
      <section className="mt-[26px] w-full space-y-[14px] rounded-[20px] border border-gray-100 bg-[#F5F7FA] px-[20px] py-[24px] text-left">
        <InfoRow label="받는 분" value={inboundName} highlight />
        <InfoRow label="이체금액" value={formattedAmount} highlight />
        <InfoRow label="출금정보" value={`${sourceAccountBank} · ${sourceAccountNumber}`} />
        <InfoRow label="입금정보" value={`${inboundBank} · ${inboundAccount}`} />
        <InfoRow label="이체지정일" value={scheduleSummary.transferDay} highlight />
        <InfoRow label="이체주기" value={scheduleSummary.frequency} highlight />
        <InfoRow label="이체기간" value={formattedPeriod} />
        <InfoRow label="내 통장표기" value={ownerName} />
        <InfoRow label="받는 분 통장표기" value={inboundName} />
        <InfoRow label="이체등록일" value={registerDate} />
      </section>

      {/* 확인 버튼을 누르면 메인 자동이체 페이지로 되돌아간다. */}
      <div className="mt-[26px] w-full pb-[32px]">
        <Button onClick={onConfirm}>확인</Button>
      </div>
    </div>
  );
}

// 요약 정보 행에 사용할 props를 정의한다.
type InfoRowProps = {
  label: string;
  value: string;
  highlight?: boolean;
};

function InfoRow({ label, value, highlight = false }: InfoRowProps) {
  // 항목 제목과 값을 한 줄로 배치하고 강조 여부에 따라 색상을 조정한다.
  return (
    <div className="flex items-center justify-between py-[5px] text-[13px] text-gray-600 first:pt-0 last:pb-0">
      <span className={highlight ? "text-primary-600" : "text-gray-600"}>{label}</span>
      <span
        className={`text-[15px] ${
          highlight ? "font-semibold text-primary-600" : "font-medium text-gray-900"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function buildPeriod(summary: ScheduleSummary) {
  // 시작일과 종료일을 조합해 기간 문자열을 만든다.
  if (!summary.startDate && !summary.endDate) {
    return "-";
  }
  const start = summary.startDate ? formatDate(new Date(summary.startDate)) : "-";
  const end = summary.endDate ? formatDate(new Date(summary.endDate)) : "미지정";
  return `${start} ~ ${end}`;
}

function formatDate(source: Date | string) {
  // Date 객체나 문자열을 YYYY.MM.DD 형식으로 변환한다.
  const target = source instanceof Date ? source : new Date(source);
  if (Number.isNaN(target.getTime())) {
    if (typeof source === "string") {
      return source.replaceAll("-", ".");
    }
    return "";
  }
  const year = target.getFullYear();
  const month = String(target.getMonth() + 1).padStart(2, "0");
  const day = String(target.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
}

