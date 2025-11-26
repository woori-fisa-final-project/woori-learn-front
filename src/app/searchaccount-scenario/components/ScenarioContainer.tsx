"use client";
                                                                                                                                            
  import { useCallback, useEffect, useMemo, useRef, useState } from "react";
  import { useRouter, useSearchParams } from "next/navigation";
  import type { ScenarioStep } from "@/types/scenario";
  import type { AccountCard, Transaction } from "@/types";
  import Scenario8 from "../../(education)/scenario/components/practice/searchaccount/Scenario8";
  import Scenario9 from "../../(education)/scenario/components/practice/searchaccount/Scenario9";
  import Scenario10 from "../../(education)/scenario/components/practice/searchaccount/Scenario10";

  type ScenarioContainerProps = {
    currentStep: ScenarioStep | null;
    onPracticeNext: () => Promise<void> | void;
  }

  type Stage = 8 | 9 | 10;

  export default function ScenarioContainer({ currentStep, onPracticeNext }: ScenarioContainerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [stage, setStage] = useState<Stage>(() => {
      const stepParam = Number(searchParams.get("step"));
      if (stepParam === 9 || stepParam === 10) return stepParam as Stage;
      return 8;
    });

    const practiceFlagsRef = useRef<Set<number>>(new Set());

    // 쿼리 변경 시 stage 동기화
    useEffect(() => {
      const stepParam = Number(searchParams.get("step"));
      if (stepParam === 9 || stepParam === 10) {
        setStage(stepParam as Stage);
      } else {
        setStage(8);
      }
    }, [searchParams]);

    // 중복 호출 방지
    const callPracticeNextOnce = useCallback(
      async (key: number) => {
        if (practiceFlagsRef.current.has(key)) return;
        practiceFlagsRef.current.add(key);
        await onPracticeNext();
      },
      [onPracticeNext],
    );

    // 1034 PRACTICE: 계좌 목록 화면 진입만으로 1회 처리
    useEffect(() => {
      if (currentStep?.id === 1034) {
        void callPracticeNextOnce(1034);
      }
    }, [currentStep, callPracticeNextOnce]);

    const makeUrl = useCallback(
      (params: Record<string, string | number | undefined>) => {
        const next = new URLSearchParams(searchParams.toString());
        Object.entries(params).forEach(([k, v]) => {
          if (v === undefined) next.delete(k);
          else next.set(k, String(v));
        });
        return `/searchaccount-scenario?${next.toString()}`;
      },
      [searchParams],
    );

    const handleSelectAccount = useCallback(
      async (acc: AccountCard) => {
        setStage(9);
        await callPracticeNextOnce(1036); // 계좌 선택
        router.push(makeUrl({ step: 9, accountId: acc.id, accountNumber: acc.accountNumber }));
      },
      [callPracticeNextOnce, makeUrl, router],
    );

    const handleOpenFilter = useCallback(async () => {
      await callPracticeNextOnce(1039); // 필터 열기
    }, [callPracticeNextOnce]);

    const handleApplyFilter = useCallback(async () => {
      await callPracticeNextOnce(1040); // 필터 적용
    }, [callPracticeNextOnce]);

    const handleSelectTransaction = useCallback(
      async (tx: Transaction) => {
        setStage(10);
        await callPracticeNextOnce(1043); // 거래 선택
        router.push(makeUrl({ step: 10, id: tx.id, accountId: tx.accountId }));
      },
      [callPracticeNextOnce, makeUrl, router],
    );

    const handleDetailComplete = useCallback(async () => {
      await callPracticeNextOnce(1047); // 상세 확인 완료
      router.push("/woorimain?scenarioId=1&stepId=1049");
    }, [callPracticeNextOnce, router]);

    const handleBackToList = useCallback(() => {
      setStage(8);
      router.push("/searchaccount-scenario");
    }, [router]);

    const handleBackToTransactions = useCallback(() => {
      setStage(9);
      router.back(); // step=10 → step=9 로 되돌아감
    }, [router]);

    const content = useMemo(() => {
      if (stage === 9) {
        return (
          <Scenario9
            onOpenFilter={handleOpenFilter}
            onApplyFilter={handleApplyFilter}
            onSelectTransaction={handleSelectTransaction}
            onBackToList={handleBackToList}
          />
        );
      }
      if (stage === 10) {
        return <Scenario10 onComplete={handleDetailComplete} onBackToTransactions={handleBackToTransactions} />;
      }
      return <Scenario8 onSelectAccount={handleSelectAccount} />;
    }, [
      stage,
      handleSelectAccount,
      handleOpenFilter,
      handleApplyFilter,
      handleSelectTransaction,
      handleBackToList,
      handleBackToTransactions,
      handleDetailComplete,
    ]);

    return <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col bg-white">{content}</div>;
  }