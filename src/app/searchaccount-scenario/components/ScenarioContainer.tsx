"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Scenario8 from "./Scenario8";
import Scenario9 from "./Scenario9";
import Scenario10 from "./Scenario10";
import type { AccountCard, Transaction } from "@/types";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

// 거래내역 상세에서 새로고침/복귀 시에도 선택한 거래를 보여주기 위한 세션스토리지 키
const TRANSACTION_STORAGE_KEY = "searchaccount:lastTransaction";

// SearchAccount 시나리오 UI 단계(8:전체계좌, 9:거래내역조회, 10:거래내역상세)
type UiStep = 8 | 9 | 10;

type ScenarioContainerProps = {
    // PRACTICE 단계(백엔드 시나리오 엔진)의 완료 처리를 위해 호출되는 콜백
    onPracticeNext: (nowStepId: number, answer?: number) => Promise<void> | void;
    // 현재 엔진에서 내려준 stepId
    engineStepId?: number | null;
    onExitToMain: () => void;
};

/**
 * 엔진 PRACTICE stepId -> 현재 UI 화면 및 추가 UI 상태 매핑
 * - 특정 PRACTICE 스텝이 오면 UI를 그 스텝에 맞는 화면으로 강제 동기화
 */
const PRACTICE_TO_UI: Record<number, { step: UiStep; openFilter?: boolean }> = {
    1034: { step: 8 },
    1036: { step: 8 },
    1039: { step: 9 },
    1040: { step: 9, openFilter: true },
    1043: { step: 9 },
    1047: { step: 10 },
};

/** URL 쿼리 파라미터로부터 UI step을 추출 */
function parseUiStep(searchParams: ReturnType<typeof useSearchParams>): UiStep | null {
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

    // 현재 UI 단계. 최초 진입 시 URL 힌트가 있으면 사용, 없으면 8부터 시작
    const [uiStep, setUiStep] = useState<UiStep>(() => parseUiStep(searchParams) ?? 8);
    // 거래내역조회에서 필터 바텀시트 오픈 상태
    const [filterOpen, setFilterOpen] = useState(false);
    // 선택된 계좌
    const [selectedAccount, setSelectedAccount] = useState<{ id: number; accountNumber: string } | null>(null);
    // 선택된 거래내역
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

    /**
     * PRACTICE 완료 중복 호출 방지용 ref
     * - 같은 stepId를 연속해서 두 번 보내거나, 네트워크가 느린 동안 중복 클릭 발생 방지
     */
    const inFlightRef = useRef(false);
    const handledStepIdRef = useRef<number | null>(null);

    /**
     * 특정 PRACTICE stepId가 현재 엔진 stepId와 같을 때만 onPracticeNext를 호출하여 완료 처리
     * - 엔진 stepId가 예상 stepId와 다르면 아무 것도 하지 않음(안전장치)
     * - 한 번 처리한 stepId는 중복 호출하지 않음
     */
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
                handledStepIdRef.current = null;
                throw e;
            } finally {
                inFlightRef.current = false;
            }
        },
        [engineStepId, onPracticeNext]
    );

    /** 현재 URL 쿼리를 유지하면서 일부 키만 patch하여 router.replace로 갱신하는 유틸 */
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

    /** 
     * URL에 accountNumber/accountId가 있으면 선택 계좌를 복원
     * - 새로고침에도 동일한 상태로 보여주기 위함
     */
    useEffect(() => {
        const accountNumber = searchParams.get("accountNumber");
        const accountId = searchParams.get("accountId");
        if (!accountNumber || !accountId) return;

        const id = Number(accountId);
        if (!Number.isFinite(id)) return;

        setSelectedAccount((prev) => prev ?? { id, accountNumber });
    }, [searchParams]);

    /**
     * URL 쿼리 변화로부터 uiStep 힌트를 읽어 화면을 동기화
     * - scenarioStep/step이 변경되면 해당 화면으로 이동
     */
    useEffect(() => {
        const hinted = parseUiStep(searchParams);
        if (hinted) setUiStep(hinted);
    }, [searchParams]);

    /**
     * 엔진 PRACTICE stepId 변화로부터 UI를 동기화
     * - PRACTICE_TO_UI에 매핑된 stepId가 들어오면 uiStep/filterOpen을 세팅
     * - scenario10 진입 시 선택 거래가 없으면 sessionStorage에서 복원
     */
    useEffect(() => {
        handledStepIdRef.current = null;
        inFlightRef.current = false;

        if (engineStepId == null) return;
        const mapped = PRACTICE_TO_UI[engineStepId];
        if (!mapped) return;

        setUiStep(mapped.step);
        setFilterOpen(!!mapped.openFilter);

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


    /**
     * 헤더 타이틀/뒤로가기 동작 등록
     * - 필터가 열려 있으면 먼저 닫기
     * - 10 -> 9, 9 -> 8로 이동하면서 URL 쿼리도 함께 정리
     * - 8에서 뒤로가면 상위로 exit
     */
    useEffect(() => {
        setTitle(headerTitle);

        const onBack = () => {
            if (filterOpen) {
                setFilterOpen(false);
                return;
            }
            if (uiStep === 10) {
                setUiStep(9);
                replaceQuery({ scenarioStep: "2", step: null });
                return;
            }
            if (uiStep === 9) {
                setUiStep(8);
                replaceQuery({ scenarioStep: "1", step: null, accountId: null, accountNumber: null });
                setSelectedTransaction(null);
                return;
            }
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

    /**
     * 입출금 계좌 선택(Scenario8)
     * - 선택 계좌를 state에 저장
     * - 거래내역조회(scenario9)로 이동 + URL을 해당 상태로 갱신
     */
    const handlePickDepositAccount = useCallback(
        async (acc: AccountCard) => {
            setSelectedAccount({ id: acc.id, accountNumber: acc.accountNumber });

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

    /** 필터 열기 요청(Scenario9에서 발생) */
    const requestOpenFilter = useCallback(async () => {
        setFilterOpen(true);
        await completePractice(1039);
    }, [completePractice]);

    /** 필터 적용 요청(Scenario9에서 발생) */
    const requestApplyFilter = useCallback(async () => {
        setFilterOpen(false);
        await completePractice(1040);
    }, [completePractice]);

    /**
     * 거래내역 선택(Scenario9)
     * - 선택 거래를 state에 저장 + sesstionStorage에 저장
     * - 거래내역상세(Scenario10)로 이동 + URL 갱신
     */
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

    /** 상세 확인 버튼(Scenario10) */
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
