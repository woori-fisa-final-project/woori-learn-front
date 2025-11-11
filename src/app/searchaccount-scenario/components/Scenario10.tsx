"use client"; // 상세 페이지는 라우터 및 스토리지 접근이 필요하므로 클라이언트 컴포넌트로 선언합니다.

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { TRANSACTION_STORAGE_KEY, type Transaction } from "./Scenario9";

function formatAmount(amount: number) {
  const formatted = Math.abs(amount).toLocaleString();
  if (amount > 0) {
    return `+${formatted}원`;
  }
  if (amount < 0) {
    return `-${formatted}원`;
  }
  return "0원";
}

export default function Scenario10() {
  const router = useRouter();
  const { setOnBack, setTitle } = useScenarioHeader();
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    setTitle("거래내역상세");
    setOnBack(() => () => {
      router.push("/searchaccount-scenario?step=9");
    });
    return () => {
      setOnBack(null);
      setTitle("");
    };
  }, [router, setOnBack, setTitle]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const stored = sessionStorage.getItem(TRANSACTION_STORAGE_KEY);
    if (!stored) {
      router.push("/searchaccount-scenario?step=9");
      return;
    }
    try {
      const parsed: Transaction = JSON.parse(stored);
      setTransaction(parsed);
    } catch (error) {
      console.error("Failed to parse transaction detail", error);
      router.push("/searchaccount-scenario?step=9");
    }
  }, [router]);

  const detail = useMemo(() => {
    if (!transaction) {
      return null;
    }
    return {
      title: transaction.description,
      amountText: formatAmount(transaction.amount),
      rawAmount: transaction.amount,
      dateTime: `${transaction.date.replace(/-/g, ".")} ${transaction.time}`,
      category: transaction.amount >= 0 ? "입금" : "출금",
      balance: (transaction.runningBalance ?? 0).toLocaleString(),
      keyword: transaction.description,
    };
  }, [transaction]);

  if (!detail) {
    return null;
  }

  return (
    <div className="flex flex-col px-[20px] pb-[32px] pt-[24px]">
      <section className="mt-[24px] space-y-[20px]">
        <div>
          <p className="text-[21px] font-semibold text-gray-900">{detail.title}</p>
          <p className="mt-[12px] text-[28px] font-bold text-gray-900">{detail.amountText}</p>
        </div>

        <div className="space-y-[10px] text-[14px] text-gray-500">
          <DetailRow
            label="메모입력"
            value={
              <button type="button" className="text-left text-[14px] font-medium text-[#2F6FD9]">
                메모를입력해보세요
              </button>
            }
          />
          <DetailRow label="거래일시" value={detail.dateTime} />
          <DetailRow label="거래구분" value={detail.category} />
          <DetailRow label="거래후잔액" value={`${detail.balance}원`} />
          <DetailRow label="수표금액" value="0원" />
          <DetailRow label="관리점" value="디지털영업부" />
        </div>
      </section>

      <section className="mt-[32px]">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-[12px] border border-[#E4E8F0] px-[16px] py-[14px] text-[14px] text-gray-600"
        >
          <span>{`'${detail.keyword}' 검색하기`}</span>
          <span className="text-[16px] text-gray-400">›</span>
        </button>
      </section>

      <div className="mt-auto flex gap-[12px] pt-[24px]">
        <button
          type="button"
          className="flex-1 rounded-[12px] border border-[#D3DCF0] py-[12px] text-[15px] font-medium text-[#2F6FD9]"
        >
          공유
        </button>
        <button
          type="button"
          onClick={() => router.push("/quiz")}
          className="flex-1 rounded-[12px] bg-[#2F6FD9] py-[12px] text-[15px] font-semibold text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[#EEF1F5] pb-[10px]">
      <span className="text-gray-500">{label}</span>
      <div className="text-right text-gray-900">{value}</div>
    </div>
  );
}

