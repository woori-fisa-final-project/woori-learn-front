"use client";

import Scenario11, {
  type AutoTransferInfo,
} from "./components/Scenario11";
import Scenario12 from "./components/Scenario12";
import Scenario18, { type Scenario18Detail } from "./components/Scenario18";
import Scenario19 from "./components/Scenario19";
import { useEffect, useState, useCallback, Suspense } from "react";
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
    sourceAccountBank: "우리은행", // 교육용 계좌는 모두 우리은행
    sourceAccountNumber: formatAccountNumber(account.accountNumber), // API에서 제공되는 계좌번호
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
  const [hasAutoTransfer, setHasAutoTransfer] = useState(false);
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

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      // userId 파싱 (유효하지 않으면 현재 로그인 사용자 ID 사용)
      const parsedUserId = userId ? parseInt(userId) : NaN;
      const currentUserId = !isNaN(parsedUserId) ? parsedUserId : getCurrentUserId();

      if (userId && isNaN(parsedUserId)) {
        devError("[fetchData] 유효하지 않은 userId:", userId);
      }

      // 1. 계좌 목록 조회
      const accounts = await getAccountList(currentUserId);

      if (!accounts || accounts.length === 0) {
        devError("[fetchData] 계좌가 없습니다.");
        setIsLoading(false);
        return;
      }

      // 2. 첫 번째 계좌(대표계좌) 선택
      const representativeAccount = accounts[0];

      // 3. 계좌번호 뒷자리 4자리 추출
      const suffix = getAccountSuffix(representativeAccount.accountNumber);
      setAccountSuffix(suffix);

      // 4. 해당 계좌의 자동이체 목록 조회
      const payments = await getAutoPaymentList({
        educationalAccountId: representativeAccount.id,
      });

      // 5. 모든 자동이체를 배열로 변환하여 표시
      if (payments && payments.length > 0) {
        devLog(`[fetchData] 자동이체 ${payments.length}건 조회`);
        const convertedList = payments.map(payment => {
          devLog(`- ID ${payment.id}: ${payment.processingStatus}`);
          return convertToAutoTransferInfo(payment, representativeAccount);
        });
        setAutoTransferList(convertedList);
        setHasAutoTransfer(true);
      } else {
        setAutoTransferList([]);
        setHasAutoTransfer(false);
      }
    } catch (error) {
      devError("[fetchData] 데이터 조회 실패:", error);
      setAutoTransferList([]);
      setHasAutoTransfer(false);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
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

      // 자동이체 상세 정보 조회
      const payment = await getAutoPaymentDetail(autoPaymentId);

      // payment 객체 전체를 상태에 저장 (해지 시 재사용)
      setSelectedPayment(payment);

      // 계좌 정보 조회
      let sourceAccount: EducationalAccount | undefined;
      try {
        const accounts = await getAccountList(getCurrentUserId());
        sourceAccount = accounts.find(acc => acc.id === payment.educationalAccountId);
      } catch (accountError) {
        devError("[handleNavigateToDetail] 계좌 정보 조회 실패:", accountError);
      }

      const convertedDetail = convertToScenario18Detail(payment, sourceAccount);
      setDetailData(convertedDetail);
      setCurrentScreen("detail");
    } catch (error) {
      devError("[handleNavigateToDetail] 자동이체 상세 조회 실패:", error);
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

      // 해지 후 최신 정보 다시 조회
      const updatedPayment = await getAutoPaymentDetail(selectedAutoPaymentId);
      setSelectedPayment(updatedPayment);

      // 계좌 정보 조회
      let sourceAccount: EducationalAccount | undefined;
      try {
        const accounts = await getAccountList(getCurrentUserId());
        sourceAccount = accounts.find(acc => acc.id === updatedPayment.educationalAccountId);
      } catch (accountError) {
        devError("[handleCancelAutoPayment] 계좌 정보 조회 실패:", accountError);
      }

      const convertedDetail = convertToScenario18Detail(updatedPayment, sourceAccount);
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
          hasAutoTransfer={hasAutoTransfer}
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
