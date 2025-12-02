"use client";

import Scenario11, {
  type AutoTransferInfo,
} from "./components/Scenario11";
import Scenario12 from "./components/Scenario12";
import Scenario18, { type Scenario18Detail } from "./components/Scenario18";
import Scenario19 from "./components/Scenario19";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { getAutoPaymentList, getAutoPaymentDetail, cancelAutoPayment } from "@/lib/api/autoPayment";
import { getAccountList } from "@/lib/api/account";
import type { AutoPayment } from "@/types/autoPayment";
import type { EducationalAccount } from "@/types/account";
import { formatAccountNumber, getAccountSuffix, getRepresentativeAccount } from "@/utils/accountUtils";
import { getBankName } from "@/utils/bankUtils";
import { usePageFocusRefresh } from "@/lib/hooks/usePageFocusRefresh";
import { devLog, devError } from "@/utils/logger";
import { convertToScenario18Detail } from "@/utils/autoPaymentConverter";
import Modal from "@/components/common/Modal";
import { AUTO_PAYMENT } from "@/lib/constants";
import { isApiError, isAbortError } from "@/types/errors";
import { runPromisesInChunks } from "@/utils/promiseUtils";

// 화면 타입 정의
type Screen = "list" | "register" | "detail" | "cancelled";

function convertToAutoTransferInfo(
  payment: AutoPayment,
  account: EducationalAccount
): AutoTransferInfo {
  const statusMap: Record<string, string> = {
    ACTIVE: "정상",
    CANCELLED: "해지",
  };

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
    transferDay: payment.designatedDate.toString(),
    frequency: payment.transferCycle.toString(),
    startDate: payment.startDate,
    endDate: payment.expirationDate,
    ownerName: account.accountName,
    recipientName: payment.counterpartyName,
    registerDate: payment.startDate,
    sourceAccountBank: account.bankName ?? "우리은행",
    sourceAccountNumber: formatAccountNumber(account.accountNumber),
  };
}

function AutomaticPaymentScenarioContent() {
  const router = useRouter();

  // 화면 상태 관리
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
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  // 중복 로딩 방지 & 취소 제어
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 대표 계좌 조회 및 가져오기 (JWT 토큰 기반)
   */
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

  /**
   * 자동이체 목록 Progressive Loading
   */
  const fetchData = useCallback(async () => {
    if (isFetchingRef.current) {
      devLog("[fetchData] 이미 로딩 중 → 중복 호출 차단");
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

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
        {
          educationalAccountId: representativeAccount.id,
          page: 0,
          size: AUTO_PAYMENT.PAGE_SIZE,
        },
        controller.signal
      );

      const convertedFirstPage = firstPage.content.map((payment) =>
        convertToAutoTransferInfo(payment, representativeAccount)
      );

      setAutoTransferList(convertedFirstPage);
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

      if (!firstPageLoaded) {
        setAutoTransferList([]);
      }

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
    return () => {
      abortControllerRef.current?.abort();
    };
  }, [fetchData]);

  // 페이지 포커스 복원 시 자동 새로고침
  usePageFocusRefresh(() => {
    devLog("[usePageFocusRefresh] 포커스 복귀 → 목록 새로고침");
    if (currentScreen === "list") {
      fetchData();
    }
  });

  /** 등록 페이지 이동 */
  const handleNavigateToRegister = () => {
    setIsAfterRegistration(false); // 등록 시작하면 초기화
    setCurrentScreen("register");
  };

  /** 등록 완료 후 목록 새로고침 */
  const handleRegisterComplete = () => {
    setCurrentScreen("list");
    setIsAfterRegistration(true); // ★ 등록 완료 상태 활성화 (손가락 위치 변경용)
    fetchData();
  };

  /** 상세 화면 이동 */
  const handleNavigateToDetail = async (autoPaymentId: number) => {
    // 상세로 진입하면 등록 직후 상태 해제
    setIsAfterRegistration(false); 

    try {
      setIsDetailLoading(true);
      setSelectedAutoPaymentId(autoPaymentId);

      // 상세 정보 + 계좌 정보 병렬 조회
      const [payment, accountsResult] = await Promise.allSettled([
        getAutoPaymentDetail(autoPaymentId),
        getAccountList(),
      ]);

      if (payment.status === "rejected") {
        devError("[handleNavigateToDetail] 상세 조회 실패:", payment.reason);
        setErrorModal({
          isOpen: true,
          message: "자동이체 정보를 불러오지 못했습니다.",
        });
        return;
      }

      setSelectedPayment(payment.value);

      let sourceAccount: EducationalAccount | undefined;

      if (accountsResult.status === "fulfilled") {
        sourceAccount = accountsResult.value.find(
          (acc) => acc.id === payment.value.educationalAccountId
        );
      }

      const convertedDetail = convertToScenario18Detail(
        payment.value,
        sourceAccount
      );
      setDetailData(convertedDetail);
      setCurrentScreen("detail");
    } catch (error) {
      devError("[handleNavigateToDetail] 오류:", error);
      setErrorModal({
        isOpen: true,
        message: "자동이체 정보를 불러오지 못했습니다.",
      });
    } finally {
      setIsDetailLoading(false);
    }
  };

  /** 자동이체 해지 */
  const handleCancelAutoPayment = async () => {
    if (!selectedAutoPaymentId || !selectedPayment) {
      devError("[handleCancelAutoPayment] 정보 없음");
      setErrorModal({
        isOpen: true,
        message: "자동이체 정보를 찾을 수 없습니다.",
      });
      return;
    }

    try {
      await cancelAutoPayment(
        selectedAutoPaymentId,
        selectedPayment.educationalAccountId
      );
      devLog("[handleCancelAutoPayment] 해지 완료");

      const [updatedPayment, accountsResult] = await Promise.allSettled([
        getAutoPaymentDetail(selectedAutoPaymentId),
        getAccountList(),
      ]);

      if (updatedPayment.status === "rejected") {
        devError(
          "[handleCancelAutoPayment] 해지 후 조회 실패:",
          updatedPayment.reason
        );
        setErrorModal({
          isOpen: true,
          message: "해지된 자동이체 정보를 불러오지 못했습니다.",
        });
        return;
      }

      setSelectedPayment(updatedPayment.value);

      let sourceAccount: EducationalAccount | undefined;

      if (accountsResult.status === "fulfilled") {
        sourceAccount = accountsResult.value.find(
          (acc) => acc.id === updatedPayment.value.educationalAccountId
        );
      }

      const converted = convertToScenario18Detail(
        updatedPayment.value,
        sourceAccount
      );
      setDetailData(converted);
      setCurrentScreen("cancelled");
    } catch (error) {
      devError("[handleCancelAutoPayment] 해지 실패:", error);
      setErrorModal({
        isOpen: true,
        message: "자동이체 해지에 실패했습니다. 다시 시도해주세요.",
      });
    }
  };

  /** 해지 완료 → 목록으로 복귀 */
  const handleBackToList = () => {
    setCurrentScreen("list");
    setIsAfterRegistration(false); // 목록으로 돌아올 때 손가락 초기화
    setSelectedAutoPaymentId(null);
    setSelectedPayment(null);
    setDetailData(null);
    fetchData();
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-400">로딩 중...</p>
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
          isAfterRegistration={isAfterRegistration} // ★ 추가된 Prop 전달
        />
      )}

      {currentScreen === "register" && (
        <Scenario12
          onComplete={handleRegisterComplete}
          onCancel={handleBackToList}
        />
      )}

      {currentScreen === "detail" && detailData && (
        <>
          {isDetailLoading ? (
            <div className="flex h-screen items-center justify-center">
              <p className="text-gray-400">로딩 중...</p>
            </div>
          ) : (
            <Scenario18
              detail={detailData}
              onBack={handleBackToList}
              onNavigateToCancelComplete={handleCancelAutoPayment}
            />
          )}
        </>
      )}

      {currentScreen === "cancelled" && detailData && (
        <Scenario19
          detail={detailData}
          onNavigateToQuiz={() => router.push("/quiz?id=2")}
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

export default function AutomaticPaymentScenarioPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <p className="text-gray-400">로딩 중...</p>
        </div>
      }
    >
      <AutomaticPaymentScenarioContent />
    </Suspense>
  );
}