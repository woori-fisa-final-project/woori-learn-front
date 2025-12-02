"use client";

import Scenario11, {
  type AutoTransferInfo,
} from "./components/Scenario11";
import Scenario12 from "./components/Scenario12";
import Scenario18, { type Scenario18Detail } from "./components/Scenario18";
import Scenario19 from "./components/Scenario19";
import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { getAutoPaymentDetail, cancelAutoPayment } from "@/lib/api/autoPayment";
import { getAccountList } from "@/lib/api/account";
import type { AutoPayment } from "@/types/autoPayment";
import type { EducationalAccount } from "@/types/account";
import { formatAccountNumber, getAccountSuffix } from "@/utils/accountUtils";
import { getBankName } from "@/utils/bankUtils";
import { usePageFocusRefresh } from "@/lib/hooks/usePageFocusRefresh";
import { devLog, devError } from "@/utils/logger";
import { convertToScenario18Detail } from "@/utils/autoPaymentConverter";
import Modal from "@/components/common/Modal";
import AutoPaymentSkeleton from "./components/AutoPaymentSkeleton";
import { useRepresentativeAccount } from "@/lib/hooks/useRepresentativeAccount";
import { useAutoPaymentList } from "@/lib/hooks/useAutoPaymentList";

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
  const queryClient = useQueryClient();

  // 화면 상태 관리
  const [currentScreen, setCurrentScreen] = useState<Screen>("list");
  const [selectedAutoPaymentId, setSelectedAutoPaymentId] = useState<number | null>(null);
  const [isAfterRegistration, setIsAfterRegistration] = useState(false);

  // 상세/해지 화면 데이터
  const [detailData, setDetailData] = useState<Scenario18Detail | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<AutoPayment | null>(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  // 에러 모달
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  // React Query: 대표 계좌 조회 (캐싱됨)
  const { data: representativeAccount, isLoading: isAccountLoading } = useRepresentativeAccount();

  // React Query: 자동이체 목록 조회 (캐싱됨)
  const { data: autoPayments = [], isLoading: isPaymentsLoading } = useAutoPaymentList(
    representativeAccount?.id
  );

  // 계좌번호 뒷자리
  const accountSuffix = useMemo(() => {
    if (!representativeAccount) return "0000";
    return getAccountSuffix(representativeAccount.accountNumber);
  }, [representativeAccount]);

  // 자동이체 목록 변환 (useMemo로 최적화)
  const autoTransferList = useMemo(() => {
    if (!representativeAccount || !autoPayments.length) return [];
    return autoPayments.map((payment) =>
      convertToAutoTransferInfo(payment, representativeAccount)
    );
  }, [autoPayments, representativeAccount]);

  // 로딩 상태 통합
  const isLoading = isAccountLoading || isPaymentsLoading;

  // 페이지 포커스 복원 시 자동 새로고침
  usePageFocusRefresh(() => {
    devLog("[usePageFocusRefresh] 포커스 복귀 → 목록 새로고침");
    if (currentScreen === "list") {
      queryClient.invalidateQueries({ queryKey: ["autoPaymentList"] });
    }
  });

  /** 등록 페이지 이동 */
  const handleNavigateToRegister = () => {
    setIsAfterRegistration(false);
    setCurrentScreen("register");
  };

  /** 등록 완료 후 목록 새로고침 */
  const handleRegisterComplete = () => {
    setCurrentScreen("list");
    setIsAfterRegistration(true);
    // React Query 캐시 무효화 → 자동 재조회
    queryClient.invalidateQueries({ queryKey: ["autoPaymentList"] });
  };

  /** 상세 화면 이동 */
  const handleNavigateToDetail = async (autoPaymentId: number) => {
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
    setIsAfterRegistration(false);
    setSelectedAutoPaymentId(null);
    setSelectedPayment(null);
    setDetailData(null);
    // React Query 캐시 무효화 → 자동 재조회
    queryClient.invalidateQueries({ queryKey: ["autoPaymentList"] });
  };

  if (isLoading) {
    return <AutoPaymentSkeleton />;
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
          isAfterRegistration={isAfterRegistration}
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
    <Suspense fallback={<AutoPaymentSkeleton />}>
      <AutomaticPaymentScenarioContent />
    </Suspense>
  );
}
