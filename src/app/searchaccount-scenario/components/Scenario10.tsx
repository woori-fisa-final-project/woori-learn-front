// 상세 거래 내역 시나리오에서 사용되는 클라이언트 컴포넌트를 선언합니다. 이 컴포넌트는 라우터와 브라우저 저장소 접근이 필요합니다.
"use client"; // 상세 페이지는 라우터 및 스토리지 접근이 필요하므로 클라이언트 컴포넌트로 선언합니다.

// React 훅과 타입을 불러와 상태 관리와 메모이제이션을 구성합니다.
import { useEffect, useMemo, useState, type ReactNode } from "react";
// 페이지 이동을 위해 Next.js 라우터를 사용합니다.
import { useRouter } from "next/navigation";
// 시나리오 헤더에 뒤로가기 동작과 제목을 설정하기 위해 컨텍스트를 활용합니다.
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
// 이전 단계(시나리오 9)에서 저장한 거래 데이터를 읽어오기 위한 키와 타입을 재사용합니다.
import { TRANSACTION_STORAGE_KEY, type Transaction } from "./Scenario9";

// 금액을 양수/음수에 따라 적절한 문자열로 변환하기 위한 헬퍼 함수입니다.
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
  const router = useRouter(); // 페이지 이동을 수행하기 위해 라우터 인스턴스를 가져옵니다.
  const { setOnBack, setTitle } = useScenarioHeader(); // 헤더의 뒤로가기 동작과 제목을 동적으로 제어합니다.
  const [transaction, setTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    setTitle("거래내역상세"); // 헤더 중앙에 노출될 페이지 제목을 지정합니다.
    setOnBack(() => () => {
      router.push("/searchaccount-scenario?step=9"); // 뒤로가기를 누르면 시나리오 9의 거래 목록으로 이동합니다.
    });
    return () => {
      setOnBack(null); // 컴포넌트를 벗어날 때 뒤로가기 핸들러를 초기화합니다.
      setTitle(""); // 다른 페이지에서 제목이 남지 않도록 비워 줍니다.
    };
  }, [router, setOnBack, setTitle]);

  useEffect(() => {
    if (transaction) {
      return; 
    }
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
  }, [router, transaction]);

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
    <div className="flex flex-col px-[20px] pb-[32px] pt-[24px]"> {/* 페이지 전체의 여백과 수직 배치를 정의합니다. */}
      <section className="mt-[24px] space-y-[20px]"> {/* 기본 정보와 상세 항목을 묶어 보여 줍니다. */}
        <div>
          <p className="text-[21px] font-semibold text-gray-900">{detail.title}</p> {/* 거래 제목을 강조합니다. */}
          <p className="mt-[12px] text-[28px] font-bold text-gray-900">{detail.amountText}</p> {/* 거래 금액을 굵게 표시합니다. */}
        </div>

        <div className="space-y-[10px] text-[14px] text-gray-500"> {/* 각 항목별 상세 정보를 행 형식으로 나열합니다. */}
          <DetailRow
            label="메모입력"
            value={
              <button type="button" className="text-left text-[14px] font-medium text-[#2F6FD9]">
                메모를 입력해보세요
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

      <section className="mt-[32px]"> {/* 키워드 검색 버튼을 따로 구분해 보여 줍니다. */}
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-[12px] border border-[#E4E8F0] px-[16px] py-[14px] text-[14px] text-gray-600"
        >
          <span>{`'${detail.keyword}' 검색하기`}</span>
          <span className="text-[16px] text-gray-400">›</span>
        </button>
      </section>

      <div className="mt-auto flex gap-[12px] pt/[24px]"> {/* 하단의 공유/확인 버튼 영역으로 페이지 최하단에 정렬됩니다. */}
        <button
          type="button"
          className="flex-1 rounded-[12px] border border-[#D3DCF0] py/[12px] text-[15px] font-medium text-[#2F6FD9]"
        >
          공유
        </button>
        <button
          type="button"
          onClick={() => router.push("/quiz")}
          className="flex-1 rounded/[12px] bg-[#2F6FD9] py/[12px] text/[15px] font-semibold text-white"
        >
          확인
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-[#EEF1F5] pb/[10px]"> {/* 각 행을 좌우로 배치해 정보를 읽기 쉽게 보여 줍니다. */}
      <span className="text-gray-500">{label}</span> {/* 항목 이름은 회색으로 노출합니다. */}
      <div className="text-right text-gray-900">{value}</div> {/* 항목 값은 오른쪽 정렬하여 강조합니다. */}
    </div>
  );
}

