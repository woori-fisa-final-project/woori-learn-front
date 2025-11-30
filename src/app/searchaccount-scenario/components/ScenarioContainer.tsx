"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Scenario8 from "./Scenario8";
import Scenario9 from "./Scenario9";
import Scenario10 from "./Scenario10";
import type { AccountCard, Transaction } from "@/types";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

const TRANSACTION_STORAGE_KEY = "searchaccount:lastTransaction";

type UiStep = 8 | 9 | 10;

type ScenarioContainerProps = {
    onPracticeNext: (nowStepId: number, answer?: number) => Promise<void> | void;
    engineStepId?: number | null;
    onExitToMain: () => void;
};

const PRACTICE_TO_UI: Record<number, { step: UiStep; openFilter?: boolean }> = {
    1034: { step: 8 }, // 진입
    1036: { step: 8 }, // 계좌 선택
    1039: { step: 9 }, // 필터 클릭
    1040: { step: 9, openFilter: true }, // 필터 적용
    1043: { step: 9 }, // 거래내역 선택
    1047: { step: 10 }, // 상세 확인 버튼
};

function parseUiStep(searchParams: ReturnType<typeof useSearchParams>): UiStep | null {
    // transfer처럼 "scenarioStep=1,2,3"도 지원 + 기존 "step=8,9,10"도 지원
    const scenarioStep = Number(searchParams.get("scenarioStep"));
    if (scenarioStep === 2) return 9;
    if (scenarioStep === 3) return 10;
    if (scenarioStep === 1) return 8;

    const legacyStep = Number(searchParams.get("step"));
    if (legacyStep === 9) return 9;
    if (legacyStep === 10) return 10;
    if (legacyStep === 8) return 8;

    return null;
}

export default function ScenarioContainer({ onPracticeNext, engineStepId, onExitToMain }: ScenarioContainerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { setTitle, setOnBack } = useScenarioHeader();

    const [uiStep, setUiStep] = useState<UiStep>(() => parseUiStep(searchParams) ?? 8);
    const [filterOpen, setFilterOpen] = useState(false);

    const [selectedAccount, setSelectedAccount] = useState<{ id: number; accountNumber: string } | null>(null);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

    const replaceQuery = useCallback(
        (patch: Record<string, string | null>) => {
            const sp = new URLSearchParams(searchParams.toString());
            Object.entries(patch).forEach(([k, v]) => {
                if (v == null) sp.delete(k);
                else sp.set(k, v);
            });
            router.replace(`/searchaccount-scenario?${sp.toString()}`);
        },
        [router, searchParams]
    );

    // URL step 파라미터로 초기 진입도 가능하게(transfer의 scenarioStep과 같은 역할)
    useEffect(() => {
        const accountNumber = searchParams.get("accountNumber");
        const accountId = searchParams.get("accountId");
        if (!accountNumber || !accountId) return;

        const id = Number(accountId);
        if (!Number.isFinite(id)) return;

        setSelectedAccount((prev) => prev ?? { id, accountNumber });
    }, [searchParams]);

    useEffect(() => {
        const hinted = parseUiStep(searchParams);
        if (hinted) setUiStep(hinted);
    }, [searchParams]);

    useEffect(() => {
        handledStepIdRef.current = null;
        inFlightRef.current = false;

        if (engineStepId == null) return;
        const mapped = PRACTICE_TO_UI[engineStepId];
        if (!mapped) return;

        setUiStep(mapped.step);
        setFilterOpen(!!mapped.openFilter);

        // step10으로 리줌될 수 있으니 transaction 세션 복구
        if (mapped.step === 10 && !selectedTransaction && typeof window !== "undefined") {
            const stored = sessionStorage.getItem(TRANSACTION_STORAGE_KEY);
            if (stored) {
                try {
                    setSelectedTransaction(JSON.parse(stored) as Transaction);
                } catch {
                    // ignore
                }
            }
        }
    }, [engineStepId, selectedTransaction]);

    const headerTitle = useMemo(() => {
        if (uiStep === 8) return "전체계좌";
        if (uiStep === 9) return "거래내역조회";
        return "거래내역상세";
    }, [uiStep]);


    useEffect(() => {
        setTitle(headerTitle);

        const onBack = () => {
            // 필터가 열려있으면 먼저 닫기
            if (filterOpen) {
                setFilterOpen(false);
                return;
            }
            // 10 -> 9
            if (uiStep === 10) {
                setUiStep(9);
                replaceQuery({ scenarioStep: "2", step: null }); // scenarioStep=2는 UI9 의미
                return;
            }
            // 9 -> 8
            if (uiStep === 9) {
                setUiStep(8);
                replaceQuery({ scenarioStep: "1", step: null, accountId: null, accountNumber: null });
                setSelectedTransaction(null);
                return;
            }
            // 8 -> 메인으로 나가기
            onExitToMain();
        };

        setOnBack(() => onBack);

        return () => {
            setOnBack(null);
            setTitle("");
        };
    }, [filterOpen, headerTitle, onExitToMain, replaceQuery, setOnBack, setTitle, uiStep]);

    const autoDone1034Ref = useRef(false);
    useEffect(() => {
        if (engineStepId !== 1034) return;
        if (autoDone1034Ref.current) return;

        autoDone1034Ref.current = true;
        void completePractice(1034);
    }, [engineStepId, completePractice]);

    const handlePickDepositAccount = useCallback(
        async (acc: AccountCard) => {
            setSelectedAccount({ id: acc.id, accountNumber: acc.accountNumber });

            // URL도 보존(새로고침 대비) — 여기서 절대 "맨몸 URL" 만들지 말고 기존 쿼리 patch만!
            replaceQuery({
                scenarioStep: "2",
                step: null,
                accountId: String(acc.id),
                accountNumber: acc.accountNumber,
            });

            setUiStep(9);
            await completePractice(1036);
        },
        [completePractice, replaceQuery]
    );

    const requestOpenFilter = useCallback(async () => {
        setFilterOpen(true);
        await completePractice(1039);
    }, [completePractice]);

    const requestApplyFilter = useCallback(async () => {
        setFilterOpen(false);
        await completePractice(1040);
    }, [completePractice]);

    const handlePickTransaction = useCallback(
        async (t: Transaction) => {
            setSelectedTransaction(t);
            if (typeof window !== "undefined") {
                sessionStorage.setItem(TRANSACTION_STORAGE_KEY, JSON.stringify(t));
            }
            replaceQuery({ scenarioStep: "3", step: null, txId: String(t.id) });
            setUiStep(10);
            await completePractice(1043);
        },
        [completePractice, replaceQuery]
    );

    const handleConfirmDetail = useCallback(async () => {
        await completePractice(1047);
    }, [completePractice]);

    const accountNumber = selectedAccount?.accountNumber ?? "";

    return (
        <div className="relative mx-auto flex h-full w-full max-w-[430px] flex-col bg-white">
            {/* step 8 */}
            {uiStep === 8 && <Scenario8 onPickDepositAccount={handlePickDepositAccount} />}

            {/* step 9 */}
            {uiStep === 9 && (
                <Scenario9
                    accountNumber={accountNumber}
                    filterOpen={filterOpen}
                    onRequestOpenFilter={requestOpenFilter}
                    onRequestCloseFilter={() => setFilterOpen(false)}
                    onRequestApplyFilter={requestApplyFilter}
                    onPickTransaction={handlePickTransaction}
                />
            )}

            {/* step 10 */}
            {uiStep === 10 && (
                <Scenario10
                    transaction={selectedTransaction}
                    onConfirm={handleConfirmDetail}
                />
            )}
        </div>
    );
}
