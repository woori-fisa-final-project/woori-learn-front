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
    // 이미 transaction 상태가 존재한다면
    // → sessionStorage를 다시 읽을 필요가 없으므로 effect 실행을 중단.
    if (transaction) {
      return;
    }

    // Next.js는 SSR(서버 사이드 렌더링)을 하기 때문에
    // window, sessionStorage 같은 브라우저 전용 객체는 서버에서 undefined.
    // → 이 코드는 브라우저 환경에서만 실행되도록 조건을 걸어줌.
    if (typeof window === "undefined") {
      return;
    }

    // 세션 스토리지에서 TRANSACTION_STORAGE_KEY라는 키로 저장된 데이터 읽기.
    // (거래 정보 JSON 문자열이 저장되어 있음)
    const stored = sessionStorage.getItem(TRANSACTION_STORAGE_KEY);

    // 세션에 해당 데이터가 없으면 (= 사용자가 직접 10단계로 접근했거나 세션이 초기화됨)
    // 이전 단계(9단계)로 리다이렉트 시킴.
    if (!stored) {
      router.push("/searchaccount-scenario?step=9");
      return;
    }

    try {
      // 세션에 저장된 JSON 문자열을 실제 객체로 변환
      const parsed: Transaction = JSON.parse(stored);

      // 변환된 거래 데이터를 상태로 저장 (→ UI나 로직에서 사용 가능)
      setTransaction(parsed);
    } catch (error) {
      // JSON 파싱이 실패할 경우 (데이터 손상 등)
      // 콘솔에 에러를 출력하고, 다시 이전 단계(9단계)로 이동시킴.
      console.error("Failed to parse transaction detail", error);
      router.push("/searchaccount-scenario?step=9");
    }

    // 의존성 배열: router 또는 transaction이 바뀔 때만 실행됨.
    // transaction이 이미 세팅되어 있으면 위의 if(transaction)에서 조기 종료.
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
    <div className="flex flex-col px-[20px] pb-[32px] pt-[24px]">
      <section className="mt-[24px] space-y-[20px]">
        <div>
          <p className="text-[21px] font-semibold text-gray-900">
            {detail.title}
          </p>
          <p className="mt-[12px] text-[28px] font-bold text-gray-900">
            {detail.amountText}
          </p>
        </div>

        <div className="space-y-[10px] text-[14px] text-gray-500">
          <DetailRow
            label="메모입력"
            value={
              <button
                type="button"
                className="text-left text-[14px] font-medium text-[#2F6FD9]"
              >
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
