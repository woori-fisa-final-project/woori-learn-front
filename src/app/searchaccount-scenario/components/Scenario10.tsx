"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { TRANSACTION_STORAGE_KEY } from "./Scenario9";
import type { Transaction } from "@/types";


interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 금액 포맷팅
function formatAmount(amount: number) {
  const formatted = Math.abs(amount).toLocaleString();
  return amount > 0 ? `+${formatted}원` : `${formatted}원`;
}

export default function Scenario10() {
  const router = useRouter();
  const { setOnBack, setTitle } = useScenarioHeader();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTitle("거래내역상세");
    setOnBack(() => () => router.push("/searchaccount-scenario?step=9"));
    return () => {
      setOnBack(null);
      setTitle("");
    };
  }, []);

  /** 1) 세션에서 기본 식별값(accountId, date, amount) 가져오기 */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = sessionStorage.getItem(TRANSACTION_STORAGE_KEY);

    if (!stored) {
      router.push("/searchaccount-scenario?step=9");
      return;
    }

    try {
      const basic = JSON.parse(stored) as Transaction;
      setTransaction(basic);

      // 상세 조회 시작
      fetchTransactionDetail(basic);
    } catch (e) {
      router.push("/searchaccount-scenario?step=9");
    }
  }, []);

  /** 2) 백엔드 호출해서 상세 거래내역 찾기 */
  async function fetchTransactionDetail(basic: Transaction) {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      params.append("accountId", String(basic.accountId));
      params.append("period", "1Y");
      params.append("type", "ALL");

      const response = await fetch(
        `/education/accounts/transactions?${params.toString()}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error("조회 실패");

      const json: ApiResponse<any[]> = await response.json();

      // 3) 동일 거래 찾기
      const target = json.data.find((t) => {
        const serverDate = t.transactionDate.slice(0, 10); // YYYY-MM-DD
        const serverAmount = t.amount;
        return (
          serverDate === basic.date &&
          Number(serverAmount) === Number(basic.amount)
        );
      });

      if (target) {
        // 기본 정보 + 서버 상세 합치기
        setTransaction((prev) =>
          prev
            ? {
                ...prev,
                counterpartyName: target.counterpartyName,
                description: target.description,
                displayName: target.displayName,
                transactionDate: target.transactionDate,
              }
            : null
        );
      }

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  const detail = useMemo(() => {
    if (!transaction) return null;

    const dt = transaction.date.replace(/-/g, ".") + " " + transaction.time;

    return {
      title: transaction.description,
      amountText: formatAmount(transaction.amount),
      dateTime: dt,
      category: transaction.amount >= 0 ? "입금" : "출금",
      balance: transaction.runningBalance?.toLocaleString() ?? "0",
      keyword: transaction.description,
    };
  }, [transaction]);

  if (loading || !detail) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        불러오는 중...
      </div>
    );
  }

  return (
    <div className="flex flex-col px-[20px] pb-[32px] pt-[24px]">
      <section className="mt-[24px] space-y-[20px]">
        <div>
          <p className="text-[21px] font-semibold text-gray-900">{detail.title}</p>
          <p className="mt-[12px] text-[28px] font-bold text-gray-900">
            {detail.amountText}
          </p>
        </div>

        <div className="space-y-[10px] text-[14px] text-gray-500">
          <DetailRow label="메모입력" value="메모를 입력해보세요" />
          <DetailRow label="거래일시" value={detail.dateTime} />
          <DetailRow label="거래구분" value={detail.category} />
          <DetailRow label="거래후잔액" value={`${detail.balance}원`} />
        </div>
      </section>

      <section className="mt-[32px]">
        <button className="flex w-full items-center justify-between rounded-[12px] border border-[#E4E8F0] px-[16px] py-[14px] text-[14px] text-gray-600">
          <span>{`'${detail.keyword}' 검색하기`}</span>
          <span className="text-[16px] text-gray-400">›</span>
        </button>
      </section>

      <div className="mt-auto flex gap-[12px] pt-[24px]">
        <button className="flex-1 rounded-[12px] border border-[#D3DCF0] py-[12px] text-[15px] font-medium text-[#2F6FD9]">
          공유
        </button>
        <button
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
