"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Scenario8 from "./Scenario8";
import Scenario9 from "./Scenario9";
import Scenario10 from "./Scenario10";
import type { AccountCard, Transaction } from "@/types";

type ScenarioContainerProps = {
    onPracticeNext: (nowStepId: number, answer?: number) => Promise<void> | void;
    engineStepId?: number | null;
};

const PRACTICE_TO_UI: Record<
    number,
    { step: 8 | 9 | 10; showNextBtn?: boolean }
> = {
    1034: { step: 8, showNextBtn: true }, // 화면 진입 후 "다음" 누르기 같은 용도
    1036: { step: 8 }, // 계좌 선택
    1039: { step: 9 }, // 필터 열기
    1040: { step: 9 }, // 필터 적용
    1043: { step: 9 }, // 거래내역 선택
    1047: { step: 10 }, // 상세 확인 버튼
};

export default function ScenarioContainer({
    onPracticeNext,
    engineStepId,
}: ScenarioContainerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [step, setStep] = useState<8 | 9 | 10>(8);

    // transfer-scenario에서 쓰던 중복 호출 방지 패턴 그대로
    const inFlightRef = useRef(false);
    const handledStepIdRef = useRef<number | null>(null);

    const completePractice = useCallback(
        async (expectedStepId: number, answer?: number) => {
            if (engineStepId == null) return;
            if (engineStepId !== expectedStepId) return;

            if (inFlightRef.current) return;
            if (handledStepIdRef.current === expectedStepId) return;

            inFlightRef.current = true;
            handledStepIdRef.current = expectedStepId;

            try {
                await onPracticeNext(expectedStepId, answer);
            } catch (e) {
                handledStepIdRef.current = null; // 실패 시 재시도 가능
                throw e;
            } finally {
                inFlightRef.current = false;
            }
        },
        [engineStepId, onPracticeNext]
    );

    // URL step 파라미터로 초기 진입도 가능하게(transfer의 scenarioStep과 같은 역할)
    useEffect(() => {
        const stepParam = searchParams.get("step");
        if (!stepParam) return;
        const n = Number(stepParam);
        if (n === 8 || n === 9 || n === 10) setStep(n);
    }, [searchParams]);

    // UI step을 URL에도 반영(선택: 디버깅/직접 접근용)
    const replaceUiStep = useCallback(
        (nextUiStep: 8 | 9 | 10, extra?: Record<string, string>) => {
            const sp = new URLSearchParams(searchParams.toString());
            sp.set("step", String(nextUiStep));
            if (extra) Object.entries(extra).forEach(([k, v]) => sp.set(k, v));
            router.replace(`/searchaccount-scenario?${sp.toString()}`);
            setStep(nextUiStep);
        },
        [router, searchParams]
    );

    const autoDone1034Ref = useRef(false);
    useEffect(() => {
        if (engineStepId !== 1034) return;
        if (autoDone1034Ref.current) return;

        autoDone1034Ref.current = true;
        void completePractice(1034);
    }, [engineStepId, completePractice]);

    // 계좌 선택 -> 거래내역 화면으로 이동 (PRACTICE 1036 완료 후)
    const handlePickDepositAccount = useCallback(
        async (acc: AccountCard) => {
            await completePractice(1036); // 1036 -> 1037(OVERLAY)

            router.push(
                `/searchaccount-scenario?step=9&accountId=${acc.id}&accountNumber=${acc.accountNumber}`
            );
        },
        [completePractice, router]
    );

    // 거래 선택 -> 상세 화면으로 이동 (PRACTICE 1043 완료 후)
    const handlePickTransaction = useCallback(
        async (t: Transaction) => {
            if (engineStepId !== 1043) return;
            await completePractice(1043);
            replaceUiStep(10, { id: String(t.id) });
        },
        [engineStepId, completePractice, replaceUiStep]
    );

    return (
        <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col bg-white">
            {/* step 8 */}
            {step === 8 && <Scenario8 onPickDepositAccount={handlePickDepositAccount} />}

            {/* step 9 */}
            {step === 9 && (
                <Scenario9
                    onOpenFilter={() => completePractice(1039)}
                    onApplyFilter={() => completePractice(1040)}
                    onPickTransaction={handlePickTransaction}
                />
            )}

            {/* step 10 */}
            {step === 10 && <Scenario10 onConfirm={() => completePractice(1047)} />}
        </div>
    );
}
