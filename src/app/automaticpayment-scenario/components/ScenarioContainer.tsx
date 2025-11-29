"use client";

import Scenario11, { type AutoTransferInfo } from "./Scenario11";
import Scenario12 from "./Scenario12";
import Scenario18, { type Scenario18Detail } from "./Scenario18";
import Scenario19 from "./Scenario19";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { ScenarioStep } from "@/types/scenario";
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";
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

export default function ScenarioContainer({ engineStep, onPracticeNext }: Props) {
    const router = useRouter();

    // 화면 상태
    const [currentScreen, setCurrentScreen] = useState<Screen>("list");
    const [selectedAutoPaymentId, setSelectedAutoPaymentId] = useState<number | null>(null);

    // 목록 데이터
    const [accountSuffix, setAccountSuffix] = useState("0000");
    const [autoTransferList, setAutoTransferList] = useState<AutoTransferInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // 상세/해지 데이터
    const [detailData, setDetailData] = useState<Scenario18Detail | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<AutoPayment | null>(null);
    const [isDetailLoading, setIsDetailLoading] = useState(false);

    // 에러 모달
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: "" });

    const isFetchingRef = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const fetchRepresentativeAccount = useCallback(async (signal?: AbortSignal) => {
        const accounts = await getAccountList(signal);
        const representative = getRepresentativeAccount(accounts);
        if (!representative) devError("[fetchRepresentativeAccount] 계좌가 없습니다.");
        return representative;
    }, []);

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

            const account = await fetchRepresentativeAccount(controller.signal);
            if (!account) {
                setIsLoading(false);
                return;
            }

            setAccountSuffix(getAccountSuffix(account.accountNumber));

            const firstPage = await getAutoPaymentList(
                { educationalAccountId: account.id, page: 0, size: AUTO_PAYMENT.PAGE_SIZE },
                controller.signal
            );

            const convertedFirst = firstPage.content.map((p) => convertToAutoTransferInfo(p, account));
            setAutoTransferList(convertedFirst);
            firstPageLoaded = true;

            setIsLoading(false);

            const totalRemainingPages = Math.max(0, firstPage.totalPages - 1);
            if (totalRemainingPages > 0) {
                const remainingPromises = Array.from({ length: totalRemainingPages }, (_, i) => () =>
                    getAutoPaymentList(
                        { educationalAccountId: account.id, page: i + 1, size: AUTO_PAYMENT.PAGE_SIZE },
                        controller.signal
                    )
                );

                try {
                    const remainingResults = await runPromisesInChunks(remainingPromises, AUTO_PAYMENT.API_FETCH_CHUNK_SIZE);
                    const remainingPayments = remainingResults.flatMap((r) => r.content);
                    const convertedRemaining = remainingPayments.map((p) => convertToAutoTransferInfo(p, account));
                    setAutoTransferList((prev) => [...prev, ...convertedRemaining]);
                } catch (bgErr) {
                    if (!isAbortError(bgErr)) {
                        devError("[fetchData] background load failed:", bgErr);
                        setErrorModal({
                            isOpen: true,
                            message: isApiError(bgErr) ? `일부 데이터 로드 실패: ${bgErr.message}` : "일부 자동이체 데이터를 불러오지 못했습니다.",
                        });
                    }
                }
            }
        } catch (err) {
            if (isAbortError(err)) return;

            devError("[fetchData] failed:", err);
            if (!firstPageLoaded) setAutoTransferList([]);

            setErrorModal({
                isOpen: true,
                message: isApiError(err) ? err.message : "자동이체 목록을 불러오는 데 실패했습니다.",
            });
            setIsLoading(false);
        } finally {
            isFetchingRef.current = false;
        }
    }, [fetchRepresentativeAccount]);

    useEffect(() => {
        fetchData();
        return () => abortControllerRef.current?.abort();
    }, [fetchData]);

    usePageFocusRefresh(() => {
        if (currentScreen === "list") fetchData();
    });

    // PRACTICE 소비(컨테이너 -> page로 올라간 onPracticeNext 호출)
    const practiceNext = useCallback(
        async (nowStepId: number, answer?: number): Promise<void> => {
            await onPracticeNext(nowStepId, answer);
        },
        [onPracticeNext]
    );

    // 화면 이동
    const handleNavigateToRegister = () => setCurrentScreen("register");
    const handleRegisterComplete = () => {
        setCurrentScreen("list");
        fetchData();
    };

    const handleNavigateToDetail = useCallback(async (autoPaymentId: number) => {
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
                />
            )}

            {currentScreen === "register" && (
                <TransferFlowProvider>
                    <Scenario12
                        onComplete={handleRegisterComplete}
                        onCancel={handleBackToList}
                        engineStep={engineStep}
                        onPracticeNext={practiceNext}
                    />
                </TransferFlowProvider>
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
                        // 퀴즈로 넘어가기 전에, PRACTICE면 한 번 소비해주는 패턴 유지
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
