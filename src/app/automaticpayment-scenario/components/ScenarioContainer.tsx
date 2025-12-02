"use client";

import Scenario11, { type AutoTransferInfo } from "./Scenario11";
import Scenario12 from "./Scenario12";
import Scenario18, { type Scenario18Detail } from "./Scenario18";
import Scenario19 from "./Scenario19";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { ScenarioStep } from "@/types/scenario";
import { usePageFocusRefresh } from "@/lib/hooks/usePageFocusRefresh";

import { getAutoPaymentList, getAutoPaymentDetail, cancelAutoPayment } from "@/lib/api/autoPayment";
import { getAccountList } from "@/lib/api/account";

import type { AutoPayment } from "@/types/autoPayment";
import type { EducationalAccount } from "@/types/account";
import { formatAccountNumber, getAccountSuffix, getRepresentativeAccount } from "@/utils/accountUtils";
import { getBankName } from "@/utils/bankUtils";
import { convertToScenario18Detail } from "@/utils/autoPaymentConverter";

import Modal from "@/components/common/Modal";
import { AUTO_PAYMENT } from "@/lib/constants";
import { isApiError, isAbortError } from "@/types/errors";
import { runPromisesInChunks } from "@/utils/promiseUtils";
import { devLog, devError } from "@/utils/logger";

// 화면 타입 정의
type Screen = "list" | "register" | "detail" | "cancelled";

type Props = {
    engineStep: ScenarioStep | null;
    onPracticeNext: (nowStepId: number, answer?: number) => Promise<void>;
};

function convertToAutoTransferInfo(payment: AutoPayment, account: EducationalAccount): AutoTransferInfo {
    const statusMap: Record<string, string> = { ACTIVE: "정상", CANCELLED: "해지" };
    const formattedAmount = `${payment.amount.toLocaleString()}원`;
    const schedule = `${payment.designatedDate}일/${payment.transferCycle}개월`;

    return {
        id: payment.id,
        status: statusMap[payment.processingStatus] || payment.processingStatus,
        title: payment.displayName || "자동이체",
        bankName: getBankName(payment.depositBankCode),
        bankAccount: formatAccountNumber(payment.depositNumber),
        amount: formattedAmount,
        schedule,
        transferDay: String(payment.designatedDate),
        frequency: String(payment.transferCycle),
        startDate: payment.startDate,
        endDate: payment.expirationDate,
        ownerName: account.accountName,
        recipientName: payment.counterpartyName,
        registerDate: payment.startDate,
        sourceAccountBank: account.bankName ?? "우리은행",
        sourceAccountNumber: formatAccountNumber(account.accountNumber),
    };
}

/** URL의 stepId를 기반으로, 최초 진입 시 어느 화면을 보여줄지 유추 */
function inferInitialScreenFromStepId(stepId: number): Screen {
    if (stepId >= 1069 && stepId <= 1101) return "register";

    if (stepId >= 1108 && stepId <= 1115) return "detail";

    if (stepId >= 1116) return "cancelled";

    return "list";
}

/**
 * 자동이체 시나리오 컨테이너
 * - API 호출(목록/상세/해지) + 엔진 PRACTICE step 연동을 함께 처리
 */
export default function ScenarioContainer({ engineStep, onPracticeNext }: Props) {
    const searchParams = useSearchParams();

    /** URL의 stepId를 읽어 최초 화면을 유추 */
    const urlStepId = useMemo(() => {
        const raw = searchParams.get("stepId");
        const n = raw ? Number(raw) : NaN;
        return Number.isFinite(n) ? n : 0;
    }, [searchParams]);

    const [currentScreen, setCurrentScreen] = useState<Screen>("list");
    const [selectedAutoPaymentId, setSelectedAutoPaymentId] = useState<number | null>(null);
    // 등록 직후인지 여부를 체크하는 상태
    const [isAfterRegistration, setIsAfterRegistration] = useState(false);
    // 목록 화면 데이터
    const [accountSuffix, setAccountSuffix] = useState("0000");
    const [autoTransferList, setAutoTransferList] = useState<AutoTransferInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    // 상세/해지 화면 데이터
    const [detailData, setDetailData] = useState<Scenario18Detail | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<AutoPayment | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);
    // 에러 모달
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });
    // 중복 로딩 방지 & 취소 제어
    const isFetchingRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const didInitScreenRef = useRef(false);
    useEffect(() => {
        if (didInitScreenRef.current) return;
        didInitScreenRef.current = true;

        const initial = inferInitialScreenFromStepId(urlStepId);
        setCurrentScreen(initial);

        if (initial !== "detail") {
            setSelectedAutoPaymentId(null);
            setSelectedPayment(null);
            setDetailData(null);
        }
    }, [urlStepId]);

    /** 대표 계좌 조회 및 가져오기 (JWT 토큰 기반) */
    const fetchRepresentativeAccount = async (
        signal?: AbortSignal
    ): Promise<EducationalAccount | undefined> => {
        const accounts = await getAccountList(signal);
        const representativeAccount = getRepresentativeAccount(accounts);

        if (!representativeAccount) {
            devError("[fetchRepresentativeAccount] 계좌가 없습니다.");
        }

        return representativeAccount;
    };

    /** 자동이체 목록 데이터 조회 */
    const fetchData = useCallback(async () => {
        if (isFetchingRef.current) {
            devLog("[fetchData] already fetching - skip");
            return;
        }

        if (abortControllerRef.current) abortControllerRef.current.abort();

        const controller = new AbortController();
        abortControllerRef.current = controller;

        let firstPageLoaded = false;

        try {
            isFetchingRef.current = true;
            setIsLoading(true);

            // 1. 대표 계좌 조회
            const representativeAccount = await fetchRepresentativeAccount(controller.signal);

            if (!representativeAccount) {
                setIsLoading(false);
                return;
            }

            // 2) 계좌번호 뒷자리
            const suffix = getAccountSuffix(representativeAccount.accountNumber);
            setAccountSuffix(suffix);

            // 3) 첫 페이지만 먼저 조회 → 즉시 UI 표시
            const firstPage = await getAutoPaymentList(
                { educationalAccountId: representativeAccount.id, page: 0, size: AUTO_PAYMENT.PAGE_SIZE },
                controller.signal
            );

            const convertedFirst = firstPage.content.map((payment) => convertToAutoTransferInfo(payment, representativeAccount));
            setAutoTransferList(convertedFirst);
            firstPageLoaded = true;

            setIsLoading(false);

            // 4) 나머지 페이지 백그라운드 로딩
            const totalRemainingPages = Math.max(0, firstPage.totalPages - 1);
            if (totalRemainingPages > 0) {
                devLog(
                    `[fetchData] 백그라운드 로드 시작 (남은 페이지: ${totalRemainingPages})`
                );

                try {
                    const remainingPromises = Array.from(
                        { length: totalRemainingPages },
                        (_, i) => () =>
                            getAutoPaymentList(
                                {
                                    educationalAccountId: representativeAccount.id,
                                    page: i + 1,
                                    size: AUTO_PAYMENT.PAGE_SIZE,
                                },
                                controller.signal
                            )
                    );

                    const remainingResults = await runPromisesInChunks(
                        remainingPromises,
                        AUTO_PAYMENT.API_FETCH_CHUNK_SIZE
                    );

                    const morePayments = remainingResults.flatMap((r) => r.content);
                    const convertedRemaining = morePayments.map((p) =>
                        convertToAutoTransferInfo(p, representativeAccount)
                    );

                    devLog(`[fetchData] 백그라운드 로드 완료, ${convertedRemaining.length}건 추가`);

                    setAutoTransferList(prev => [...prev, ...convertedRemaining]);
                } catch (backgroundError: unknown) {
                    if (!isAbortError(backgroundError)) {
                        devError("[fetchData] 백그라운드 페이지 로드 실패 (첫 페이지 데이터는 유지):", backgroundError);

                        const message = isApiError(backgroundError)
                            ? backgroundError.message
                            : "일부 자동이체 데이터를 불러오지 못했습니다.";

                        setErrorModal({ isOpen: true, message });
                    }
                }
            }
        } catch (error: unknown) {
            if (isAbortError(error)) {
                devLog("[fetchData] 요청이 취소되었습니다.");
                return;
            }

            devError("[fetchData] 전체 로딩 실패:", error);

            if (!firstPageLoaded) setAutoTransferList([]);

            const errorMessage = isApiError(error)
                ? error.message
                : "자동이체 목록을 불러오는 데 실패했습니다.";

            setErrorModal({ isOpen: true, message: errorMessage });
            setIsLoading(false);
        } finally {
            isFetchingRef.current = false;
        }
    }, []);

    useEffect(() => {
        fetchData();
        return () => abortControllerRef.current?.abort();
    }, [fetchData]);

    usePageFocusRefresh(() => {
        if (currentScreen === "list") fetchData();
    });

    const practiceNext = useCallback(async (nowStepId: number, answer?: number) => onPracticeNext(nowStepId, answer), [
        onPracticeNext,
    ]);

    // 목록 -> 등록 화면 전환
    const handleNavigateToRegister = () => {
        setIsAfterRegistration(false); // 등록 시작하면 초기화
        setCurrentScreen("register");
    }

    /**
     * 등록 완료 시:
     * - 목록 화면으로 돌아가고
     * - 최신 목록을 재조회
     */
    const handleRegisterComplete = () => {
        setCurrentScreen("list");
        setIsAfterRegistration(true); // 등록 완료 상태 활성화 (손가락 위치 변경용)
        fetchData();
    };

    const handleNavigateToDetail = useCallback(
        async (autoPaymentId: number) => {
            // 상세로 진입하면 등록 직후 상태 해제
            setIsAfterRegistration(false);

            try {
                setIsDetailLoading(true);
                setSelectedAutoPaymentId(autoPaymentId);

                const [payment, accountsResult] = await Promise.allSettled([
                    getAutoPaymentDetail(autoPaymentId),
                    getAccountList(),
                ]);

                if (payment.status === "rejected") {
                    devError("[handleNavigateToDetail] payment failed:", payment.reason);
                    setErrorModal({ isOpen: true, message: "자동이체 정보를 불러오지 못했습니다." });
                    return;
                }

                setSelectedPayment(payment.value);

                let sourceAccount: EducationalAccount | undefined;
                if (accountsResult.status === "fulfilled") {
                    sourceAccount = accountsResult.value.find((acc) => acc.id === payment.value.educationalAccountId);
                    if (!sourceAccount) {
                        setErrorModal({
                            isOpen: true,
                            message: "자동이체에 연결된 출금 계좌를 찾을 수 없습니다.\n계좌 정보가 일치하지 않습니다.",
                        });
                    }
                } else {
                    setErrorModal({
                        isOpen: true,
                        message: "계좌 정보를 불러오지 못했습니다.\n출금 계좌 정보가 표시되지 않을 수 있습니다.",
                    });
                }

                setDetailData(convertToScenario18Detail(payment.value, sourceAccount));
                setCurrentScreen("detail");
            } catch (e) {
                devError("[handleNavigateToDetail] unexpected:", e);
                setErrorModal({ isOpen: true, message: "자동이체 정보를 불러오지 못했습니다." });
            } finally {
                setIsDetailLoading(false);
            }
        }, []);

    const handleCancelAutoPayment = useCallback(async () => {
        if (!selectedAutoPaymentId || !selectedPayment) {
            setErrorModal({ isOpen: true, message: "자동이체 정보를 찾을 수 없습니다." });
            return;
        }

        try {
            await cancelAutoPayment(selectedAutoPaymentId, selectedPayment.educationalAccountId);

            const [updatedPayment, accountsResult] = await Promise.allSettled([
                getAutoPaymentDetail(selectedAutoPaymentId),
                getAccountList(),
            ]);

            if (updatedPayment.status === "rejected") {
                devError("[handleCancelAutoPayment] 해지 후 조회 실패:", updatedPayment.reason);
                setErrorModal({ isOpen: true, message: "해지된 자동이체 정보를 불러오지 못했습니다." });
                return;
            }

            setSelectedPayment(updatedPayment.value);

            let sourceAccount: EducationalAccount | undefined;
            if (accountsResult.status === "fulfilled") {
                sourceAccount = accountsResult.value.find((acc) => acc.id === updatedPayment.value.educationalAccountId);
            }

            setDetailData(convertToScenario18Detail(updatedPayment.value, sourceAccount));
            setCurrentScreen("cancelled");
        } catch (e) {
            devError("[handleCancelAutoPayment] failed:", e);
            setErrorModal({ isOpen: true, message: "자동이체 해지에 실패했습니다.\n다시 시도해주세요." });
        }
    }, [selectedAutoPaymentId, selectedPayment]);

    const handleBackToList = () => {
        setCurrentScreen("list");
        setIsAfterRegistration(false);
        setSelectedAutoPaymentId(null);
        setSelectedPayment(null);
        setDetailData(null);
        fetchData();
    };

    if (isLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p className="text-gray-500">로딩 중...</p>
            </div>
        );
    }

    return (
        <>
            {currentScreen === "list" && (
                <Scenario11
                    accountSuffix={accountSuffix}
                    hasAutoTransfer={autoTransferList.length > 0}
                    autoTransferList={autoTransferList}
                    onNavigateToRegister={handleNavigateToRegister}
                    onNavigateToDetail={handleNavigateToDetail}
                    engineStep={engineStep}
                    onPracticeNext={practiceNext}
                    isAfterRegistration={isAfterRegistration}
                />
            )}

            {currentScreen === "register" && (
                <Scenario12 onComplete={handleRegisterComplete} onCancel={handleBackToList} engineStep={engineStep} onPracticeNext={practiceNext} />
            )}

            {currentScreen === "detail" && detailData && (
                <>
                    {isDetailLoading ? (
                        <div className="flex h-screen items-center justify-center">
                            <p className="text-gray-500">로딩 중...</p>
                        </div>
                    ) : (
                        <Scenario18
                            detail={detailData}
                            onBack={handleBackToList}
                            onNavigateToCancelComplete={handleCancelAutoPayment}
                            engineStep={engineStep}
                            onPracticeNext={practiceNext}
                        />
                    )}
                </>
            )}

            {currentScreen === "cancelled" && detailData && (
                <Scenario19
                    detail={detailData}
                    onNavigateToQuiz={async () => {
                        if (engineStep?.type === "PRACTICE") {
                            await practiceNext(engineStep.id);
                            return;
                        }
                    }}
                />
            )}

            <Modal
                isOpen={errorModal.isOpen}
                onClose={() => setErrorModal({ isOpen: false, message: "" })}
                title="오류"
                description={errorModal.message}
                confirmText="확인"
            />
        </>
    );
}
