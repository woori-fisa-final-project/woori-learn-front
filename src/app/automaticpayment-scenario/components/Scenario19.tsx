"use client";

import Button from "@/components/common/Button";
import InfoRow from "@/components/common/InfoRow";
import Image from "next/image";
import { useMemo } from "react";
import type { Scenario18Detail } from "./Scenario18";

type Scenario19Props = {
  detail: Scenario18Detail;
  onNavigateToQuiz: () => void;
};

export default function Scenario19({ detail, onNavigateToQuiz }: Scenario19Props) {
  const rows = useMemo(() => [
    { label: "상태", value: detail.status },
    { label: "받는 분", value: detail.recipientName, highlight: true },
    { label: "이체금액", value: detail.amount, highlight: true },
    { label: "출금정보", value: detail.sourceAccount },
    { label: "입금정보", value: detail.inboundAccount },
    { label: "이체지정일", value: detail.transferDay },
    { label: "이체주기", value: detail.frequency },
    { label: "이체기간", value: detail.period },
    { label: "내 통장표기", value: detail.ownerName },
    { label: "이체등록일", value: detail.registerDate },
  ], [detail]);

  return (
    <div className="mx-auto flex h-[110dvh] w-full max-w-[390px] flex-col overflow-hidden bg-white px-[20px] py-[24px]">
      <main className="flex flex-1 flex-col gap-[24px]">
        <div className="flex flex-col items-center gap-[12px] text-center">
          <Image src="/images/maincheck.png" alt="등록 완료" width={66} height={66} />
          <h2 className="text-[20px] font-semibold text-gray-900">자동이체를 해지했어요</h2>
          <p className="text-[13px] text-gray-500">
            자동이체가 해지되었는지
            <br />
            다시 한 번 확인해 주세요.
          </p>
        </div>

        <section className="rounded-[20px] border border-gray-100 bg-[#F5F7FA] px-[20px] py-[20px]">
          <div className="mt-[20px] space-y-[8px]">
            {rows.map((row) => (
              <InfoRow
                key={row.label}
                label={row.label}
                value={row.value}
                highlight={Boolean(row.highlight)}
              />
            ))}
          </div>
        </section>

        <Button className="mt-[24px]" onClick={onNavigateToQuiz}>
          확인
        </Button>
      </main>
    </div>
  );
}


