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
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";
import { convertToScenario18Detail } from "@/utils/autoPaymentConverter";
import Modal from "@/components/common/Modal";
import { AUTO_PAYMENT } from "@/lib/constants";
import { isApiError } from "@/types/errors";
import { runPromisesInChunks } from "@/utils/promiseUtils";

// 화면 타입 정의
type Screen = "list" | "register" | "detail" | "cancelled";

// AutoPayment를 AutoTransferInfo로 변환하는 함수
function convertToAutoTransferInfo(
  payment: AutoPayment,
  account: EducationalAccount
): AutoTransferInfo {
  // 상태 한글 변환
  const statusMap = {
    ACTIVE: "정상",
    CANCELLED: "해지",
  };

  // 금액 포맷팅
  const formattedAmount = `${payment.amount.toLocaleString()}원`;

  // 이체일자/주기 포맷팅
  const schedule = `${payment.designatedDate}일/${payment.transferCycle}개월`;

  return {
    id: payment.id,
    status: statusMap[payment.processingStatus] || payment.processingStatus,
    title: payment.displayName || "자동이체",
    bankName: getBankName(payment.depositBankCode),
    bankAccount: formatAccountNumber(payment.depositNumber),
    amount: formattedAmount,
    schedule: schedule,
    transferDay: payment.designatedDate.toString(),
    frequency: payment.transferCycle.toString(),
    startDate: payment.startDate,
    endDate: payment.expirationDate,
    ownerName: account.accountName, // API에서 제공되는 계좌명
    recipientName: payment.counterpartyName,
    registerDate: payment.startDate, // 등록일 (API에 별도 필드가 없어 시작일 사용)
    sourceAccountBank: account.bankName ?? "우리은행", // 계좌의 은행명 (API가 제공하지 않으면 기본값)
    sourceAccountNumber: formatAccountNumber(account.accountNumber), // API에서 제공되는 계좌번호
  };
}

function AutomaticPaymentScenarioContent() {
  const router = useRouter();

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
  const [errorModal, setErrorModal] = useState<{ isOpen: boolean; message: string }>({
    isOpen: false,
    message: "",
  });

  // Race condition 방지 (중복 데이터 로딩 방지)
  const isFetchingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 대표 계좌 조회 및 가져오기 (JWT 토큰 기반)
   * @param signal - AbortSignal
   * @returns ID가 가장 작은 계좌 (대표계좌) 또는 undefined
   */
  const fetchRepresentativeAccount = async (signal?: AbortSignal): Promise<EducationalAccount | undefined> => {
    const accounts = await getAccountList(signal);

    const representativeAccount = getRepresentativeAccount(accounts);

    if (!representativeAccount) {
      devError("[fetchRepresentativeAccount] 계좌가 없습니다.");
    }

    return representativeAccount;
  };

  /**
   * 모든 자동이체 조회 (페이지네이션 처리)
   * @param accountId - 교육용 계좌 ID
   * @param signal - AbortSignal
   * @returns 모든 페이지의 자동이체 목록
   */
  const getAllAutoPayments = async (accountId: number, signal?: AbortSignal): Promise<AutoPayment[]> => {
    const firstPage = await getAutoPaymentList({
      educationalAccountId: accountId,
      page: 0,
      size: AUTO_PAYMENT.PAGE_SIZE,
    }, signal);

    const totalRemainingPages = Math.max(0, firstPage.totalPages - 1);

    // 첫 페이지만 있는 경우
    if (totalRemainingPages === 0) {
      return firstPage.content;
    }

    // 나머지 페이지들을 청크 단위로 조회
    const remainingPromises = Array.from(
      { length: totalRemainingPages },
      (_, i) => () => getAutoPaymentList({
        educationalAccountId: accountId,
        page: i + 1,
        size: AUTO_PAYMENT.PAGE_SIZE,
      }, signal)
    );

    const remainingResults = await runPromisesInChunks(
      remainingPromises,
      AUTO_PAYMENT.API_FETCH_CHUNK_SIZE
    );

    // 모든 페이지의 content를 하나로 합치기
    return [
      ...firstPage.content,
      ...remainingResults.flatMap(r => r.content)
    ];
  };

  /**
   * 자동이체 목록 데이터 조회 및 상태 업데이트 (Progressive Loading)
   * 첫 페이지를 먼저 표시하고, 나머지 페이지는 백그라운드에서 로드
   */
  const fetchData = useCallback(async () => {
    // Race condition 방지: 이미 로딩 중이면 중복 실행 차단
    if (isFetchingRef.current) {
      devLog("[fetchData] 이미 로딩 중이므로 중복 실행 차단");
      return;
    }

    // 이전 요청이 있으면 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새로운 AbortController 생성
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // 첫 페이지 로딩 성공 여부 플래그
    let firstPageLoaded = false;

    try {
      isFetchingRef.current = true;
      setIsLoading(true);

      // 1. 대표 계좌 조회 (JWT 토큰 기반)
      const representativeAccount = await fetchRepresentativeAccount(controller.signal);

      if (!representativeAccount) {
        setIsLoading(false);
        return;
      }

      // 2. 계좌번호 뒷자리 4자리 추출
      const suffix = getAccountSuffix(representativeAccount.accountNumber);
      setAccountSuffix(suffix);

      // 3. 첫 페이지만 먼저 조회
      const firstPage = await getAutoPaymentList({
        educationalAccountId: representativeAccount.id,
        page: 0,
        size: AUTO_PAYMENT.PAGE_SIZE,
      }, controller.signal);

      // 4. 첫 페이지 데이터를 즉시 화면에 표시 (로딩 종료)
      if (firstPage.content.length > 0) {
        devLog(`[fetchData] 첫 페이지 ${firstPage.content.length}건 즉시 표시 (전체: ${firstPage.totalElements}건)`);
        const convertedFirstPage = firstPage.content.map(payment => {
          devLog(`- ID ${payment.id}: ${payment.processingStatus}`);
          return convertToAutoTransferInfo(payment, representativeAccount);
        });
        setAutoTransferList(convertedFirstPage);
        firstPageLoaded = true; // 첫 페이지 로딩 성공
      } else {
        setAutoTransferList([]);
        firstPageLoaded = true; // 빈 목록도 성공으로 간주
      }

      // 로딩 상태 종료 - 첫 페이지를 사용자에게 즉시 보여줌
      setIsLoading(false);

      // 5. 나머지 페이지가 있다면 백그라운드에서 로드
      const totalRemainingPages = Math.max(0, firstPage.totalPages - 1);

      if (totalRemainingPages > 0) {
        devLog(`[fetchData] 백그라운드에서 나머지 ${totalRemainingPages}페이지 로드 시작`);

        try {
          // 나머지 페이지들을 청크 단위로 조회
          const remainingPromises = Array.from(
            { length: totalRemainingPages },
            (_, i) => () => getAutoPaymentList({
              educationalAccountId: representativeAccount.id,
              page: i + 1,
              size: AUTO_PAYMENT.PAGE_SIZE,
            }, controller.signal)
          );

          const remainingResults = await runPromisesInChunks(
            remainingPromises,
            AUTO_PAYMENT.API_FETCH_CHUNK_SIZE
          );

          // 나머지 페이지 데이터를 기존 목록에 추가
          const allRemainingPayments = remainingResults.flatMap(r => r.content);
          const convertedRemaining = allRemainingPayments.map(payment =>
            convertToAutoTransferInfo(payment, representativeAccount)
          );

          devLog(`[fetchData] 백그라운드 로드 완료, ${convertedRemaining.length}건 추가`);

          // 첫 페이지 + 나머지 페이지 합치기
          setAutoTransferList(prev => [...prev, ...convertedRemaining]);
        } catch (backgroundError: any) {
          // 백그라운드 로딩 실패: 첫 페이지는 유지하고 에러만 로깅
          if (backgroundError.name !== 'AbortError' && backgroundError.name !== 'CanceledError') {
            devError("[fetchData] 백그라운드 페이지 로드 실패 (첫 페이지 데이터는 유지):", backgroundError);

            // 사용자에게 일부 데이터만 로드되었음을 알림
            const errorMessage = isApiError(backgroundError)
              ? `일부 데이터 로드 실패: ${backgroundError.message}`
              : "일부 자동이체 데이터를 불러오지 못했습니다.";

            setErrorModal({ isOpen: true, message: errorMessage });
          }
        }
      }
    } catch (error: any) {
      // AbortError는 무시 (정상적인 취소)
      if (error.name === 'AbortError' || error.name === 'CanceledError') {
        devLog("[fetchData] 요청이 취소되었습니다.");
        return;
      }

      devError("[fetchData] 데이터 조회 실패:", error);

      // 첫 페이지 로딩 실패 시에만 목록 비우기
      if (!firstPageLoaded) {
        setAutoTransferList([]);
      }

      // ApiError인 경우 사용자 친화적인 메시지 사용
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

    // Cleanup: 컴포넌트 언마운트 시 진행 중인 요청 취소
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  // 페이지가 다시 포커스를 받을 때 데이터 새로고침
  usePageFocusRefresh(() => {
    devLog("[usePageFocusRefresh] 페이지 포커스 복귀 - 데이터 새로고침");
    if (currentScreen === "list") {
      fetchData();
    }
  });

  // 등록하기 버튼 클릭
  const handleNavigateToRegister = () => {
    setCurrentScreen("register");
  };

  // 등록 완료 후 목록으로 돌아가기
  const handleRegisterComplete = () => {
    setCurrentScreen("list");
    fetchData(); // 목록 새로고침
  };

  // 상세 화면으로 이동
  const handleNavigateToDetail = async (autoPaymentId: number) => {
    try {
      setIsDetailLoading(true);
      setSelectedAutoPaymentId(autoPaymentId);

      // 자동이체 상세 정보와 계좌 정보를 병렬로 조회 (성능 개선)
      const [payment, accountsResult] = await Promise.allSettled([
        getAutoPaymentDetail(autoPaymentId),
        getAccountList(),
      ]);

      // payment 조회 실패 시 에러 처리
      if (payment.status === "rejected") {
        devError("[handleNavigateToDetail] 자동이체 상세 조회 실패:", payment.reason);
        setErrorModal({ isOpen: true, message: "자동이체 정보를 불러오지 못했습니다." });
        return;
      }

      // payment 객체 전체를 상태에 저장 (해지 시 재사용)
      setSelectedPayment(payment.value);

      // 계좌 정보 조회 결과 처리
      let sourceAccount: EducationalAccount | undefined;
      if (accountsResult.status === "fulfilled") {
        sourceAccount = accountsResult.value.find(acc => acc.id === payment.value.educationalAccountId);

        // 계좌를 찾지 못한 경우 (데이터 불일치)
        if (!sourceAccount) {
          devError(
            "[handleNavigateToDetail] 출금 계좌를 찾을 수 없음:",
            `educationalAccountId=${payment.value.educationalAccountId}, 조회된 계좌 수=${accountsResult.value.length}`
          );
          setErrorModal({
            isOpen: true,
            message: "자동이체에 연결된 출금 계좌를 찾을 수 없습니다.\n계좌 정보가 일치하지 않습니다."
          });
        }
      } else {
        devError("[handleNavigateToDetail] 계좌 정보 조회 실패:", accountsResult.reason);
        setErrorModal({ isOpen: true, message: "계좌 정보를 불러오지 못했습니다.\n출금 계좌 정보가 표시되지 않을 수 있습니다." });
      }

      const convertedDetail = convertToScenario18Detail(payment.value, sourceAccount);
      setDetailData(convertedDetail);
      setCurrentScreen("detail");
    } catch (error) {
      devError("[handleNavigateToDetail] 예상치 못한 오류:", error);
      setErrorModal({ isOpen: true, message: "자동이체 정보를 불러오지 못했습니다." });
    } finally {
      setIsDetailLoading(false);
    }
  };

  // 자동이체 해지
  const handleCancelAutoPayment = async () => {
    if (!selectedAutoPaymentId || !selectedPayment) {
      devError("[handleCancelAutoPayment] autoPaymentId 또는 payment 정보가 없습니다.");
      setErrorModal({ isOpen: true, message: "자동이체 정보를 찾을 수 없습니다." });
      return;
    }

    try {
      // 저장된 payment에서 educationalAccountId 사용 (중복 API 호출 제거)
      await cancelAutoPayment(selectedAutoPaymentId, selectedPayment.educationalAccountId);
      devLog("[handleCancelAutoPayment] 해지 완료");

      // 해지 후 최신 정보와 계좌 정보를 병렬로 조회 (성능 개선)
      const [updatedPayment, accountsResult] = await Promise.allSettled([
        getAutoPaymentDetail(selectedAutoPaymentId),
        getAccountList(),
      ]);

      // 업데이트된 payment 조회 실패 시 에러 처리
      if (updatedPayment.status === "rejected") {
        devError("[handleCancelAutoPayment] 해지 후 정보 조회 실패:", updatedPayment.reason);
        setErrorModal({ isOpen: true, message: "해지된 자동이체 정보를 불러오지 못했습니다." });
        return;
      }

      setSelectedPayment(updatedPayment.value);

      // 계좌 정보 조회 결과 처리
      let sourceAccount: EducationalAccount | undefined;
      if (accountsResult.status === "fulfilled") {
        sourceAccount = accountsResult.value.find(acc => acc.id === updatedPayment.value.educationalAccountId);

        // 계좌를 찾지 못한 경우 (데이터 불일치)
        if (!sourceAccount) {
          devError(
            "[handleCancelAutoPayment] 출금 계좌를 찾을 수 없음:",
            `educationalAccountId=${updatedPayment.value.educationalAccountId}, 조회된 계좌 수=${accountsResult.value.length}`
          );
          setErrorModal({
            isOpen: true,
            message: "자동이체에 연결된 출금 계좌를 찾을 수 없습니다.\n계좌 정보가 일치하지 않습니다."
          });
        }
      } else {
        devError("[handleCancelAutoPayment] 계좌 정보 조회 실패:", accountsResult.reason);
        setErrorModal({ isOpen: true, message: "계좌 정보를 불러오지 못했습니다.\n출금 계좌 정보가 표시되지 않을 수 있습니다." });
      }

      const convertedDetail = convertToScenario18Detail(updatedPayment.value, sourceAccount);
      setDetailData(convertedDetail);
      setCurrentScreen("cancelled");
    } catch (error) {
      devError("[handleCancelAutoPayment] 자동이체 해지 실패:", error);
      setErrorModal({ isOpen: true, message: "자동이체 해지에 실패했습니다.\n다시 시도해주세요." });
    }
  };

  // 해지 완료 화면에서 목록으로
  const handleBackToList = () => {
    setCurrentScreen("list");
    setSelectedAutoPaymentId(null);
    setSelectedPayment(null);
    setDetailData(null);
    fetchData(); // 목록 새로고침
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  // 화면별 렌더링
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
              <p className="text-gray-500">로딩 중...</p>
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
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    }>
      <AutomaticPaymentScenarioContent />
    </Suspense>
  );
}