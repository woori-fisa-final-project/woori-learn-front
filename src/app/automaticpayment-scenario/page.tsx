"use client";

import Scenario11, {
  type AutoTransferInfo,
} from "./components/Scenario11";
import Scenario12 from "./components/Scenario12";
import Scenario18, { type Scenario18Detail } from "./components/Scenario18";
import Scenario19 from "./components/Scenario19";
import { useEffect, useState, useCallback, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAutoPaymentList, getAutoPaymentDetail, cancelAutoPayment } from "@/lib/api/autoPayment";
import { getAccountList } from "@/lib/api/account";
import type { AutoPayment } from "@/types/autoPayment";
import type { EducationalAccount } from "@/types/account";
import { formatAccountNumber, getAccountSuffix } from "@/utils/accountUtils";
import { getBankName } from "@/utils/bankUtils";
import { getCurrentUserId } from "@/utils/authUtils";
import { usePageFocusRefresh } from "@/lib/hooks/usePageFocusRefresh";
import { devLog, devError } from "@/utils/logger";
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";
import { convertToScenario18Detail } from "@/utils/autoPaymentConverter";
import Modal from "@/components/common/Modal";
import { AUTO_PAYMENT } from "@/lib/constants";
import { isApiError } from "@/types/errors";
import { runPromisesInChunks } from "@/utils/promiseUtils";

// 화면 타입 정의
type Screen = "list" | "register" | "detail" | "cancelled";

// AutoPayment → UI 표시용 데이터 변환 함수
function convertToAutoTransferInfo(
  payment: AutoPayment,
  account: EducationalAccount
): AutoTransferInfo {
  const statusMap = {
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
  const searchParams = useSearchParams();
  const router = useRouter();
  const userId = searchParams.get("user_id");

  // 화면 상태 관리
  const [currentScreen, setCurrentScreen] = useState<Screen>("list");
  const [selectedAutoPaymentId, setSelectedAutoPaymentId] = useState<number | null>(null);

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
   * 대표 계좌 조회 (첫 번째 계좌 기반)
   */
  const getRepresentativeAccount = async (
    userId: number,
    signal?: AbortSignal
  ): Promise<EducationalAccount | undefined> => {
    const accounts = await getAccountList(userId, signal);

    if (accounts.length === 0) {
      devError("[getRepresentativeAccount] 계좌가 없습니다.");
      return undefined;
    }

    return accounts[0];
  };

  /**
   * 모든 자동이체 조회 (페이지네이션 전체 로딩)
   */
  const getAllAutoPayments = async (
    accountId: number,
    signal?: AbortSignal
  ): Promise<AutoPayment[]> => {
    const firstPage = await getAutoPaymentList(
      {
        educationalAccountId: accountId,
        page: 0,
        size: AUTO_PAYMENT.PAGE_SIZE,
      },
      signal
    );

    const totalRemainingPages = Math.max(0, firstPage.totalPages - 1);

    if (totalRemainingPages === 0) {
      return firstPage.content;
    }

    const remainingPromises = Array.from(
      { length: totalRemainingPages },
      (_, i) => () =>
        getAutoPaymentList(
          {
            educationalAccountId: accountId,
            page: i + 1,
            size: AUTO_PAYMENT.PAGE_SIZE,
          },
          signal
        )
    );

    const remainingResults = await runPromisesInChunks(
      remainingPromises,
      AUTO_PAYMENT.API_FETCH_CHUNK_SIZE
    );

    return [
      ...firstPage.content,
      ...remainingResults.flatMap((r) => r.content),
    ];
  };

  /**
   * 자동이체 목록 Progressive Loading
   * - 첫 페이지 즉시 표시
   * - 나머지 페이지는 백그라운드 로딩
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

      // user_id 파라미터 있으면 사용, 아니면 현재 로그인 사용자 ID 사용
      const parsedUserId = userId ? parseInt(userId) : NaN;
      const currentUserId =
        !isNaN(parsedUserId) ? parsedUserId : getCurrentUserId();

      if (userId && isNaN(parsedUserId)) {
        devError("[fetchData] 유효하지 않은 userId:", userId);
      }

      // 1) 대표 계좌 조회
      const representativeAccount = await getRepresentativeAccount(
        currentUserId,
        controller.signal
      );

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

          setAutoTransferList((prev) => [...prev, ...convertedRemaining]);
        } catch (backgroundError: any) {
          if (
            backgroundError.name !== "AbortError" &&
            backgroundError.name !== "CanceledError"
          ) {
            devError(
              "[fetchData] 백그라운드 로드 실패:",
              backgroundError
            );

            const message = isApiError(backgroundError)
              ? backgroundError.message
              : "일부 자동이체 데이터를 불러오지 못했습니다.";

            setErrorModal({ isOpen: true, message });
          }
        }
      }
    } catch (error: any) {
      if (error.name === "AbortError" || error.name === "CanceledError") {
        devLog("[fetchData] 요청 취소됨");
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
  }, [userId]);

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
    setCurrentScreen("register");
  };

  /** 등록 완료 후 목록 새로고침 */
  const handleRegisterComplete = () => {
    setCurrentScreen("list");
    fetchData();
  };

  /** 상세 화면 이동 */
  const handleNavigateToDetail = async (autoPaymentId: number) => {
    try {
      setIsDetailLoading(true);
      setSelectedAutoPaymentId(autoPaymentId);

      // 상세 정보 + 계좌 정보 병렬 조회
      const [payment, accountsResult] = await Promise.allSettled([
        getAutoPaymentDetail(autoPaymentId),
        getAccountList(getCurrentUserId()),
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
        getAccountList(getCurrentUserId()),
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
        />
      )}

      {currentScreen === "register" && (
        <TransferFlowProvider>
          <Scenario12
            onComplete={handleRegisterComplete}
            onCancel={handleBackToList}
          />
        </TransferFlowProvider>
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
