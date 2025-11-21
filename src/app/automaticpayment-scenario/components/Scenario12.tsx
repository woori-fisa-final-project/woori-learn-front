"use client";

// 자동이체 등록 플로우에서 필요한 React 훅과 유틸리티, 하위 시나리오 컴포넌트를 불러온다.
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// 헤더 제어와 이체 흐름 상태 관리를 위해 내부 컨텍스트와 훅을 이용한다.
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useAccountSelection } from "@/lib/hooks/useAccountSelection";
import { useAutoPaymentSteps } from "@/lib/hooks/useAutoPaymentSteps";
import { useAutoPaymentRegistration } from "@/lib/hooks/useAutoPaymentRegistration";
// 공통 유틸리티 함수를 불러온다.
import { formatAccountNumber } from "@/utils/accountUtils";
// 다른 시나리오 단계 컴포넌트를 순차적으로 사용하여 전체 플로우를 완성한다.
import Scenario2 from "@/app/transfer-scenario/components/Scenario2";
import Scenario3 from "@/app/transfer-scenario/components/Scenario3";
import Scenario4 from "@/app/transfer-scenario/components/Scenario4";
import Scenario5 from "@/app/transfer-scenario/components/Scenario5";
import Scenario13 from "./Scenario13";
import Scenario14 from "./Scenario14";
import Scenario15 from "./Scenario15";
import Scenario16 from "./Scenario16";
import Scenario17 from "./Scenario17";
import type { EducationalAccount } from "@/types/account";
import Image from "next/image";
import Modal from "@/components/common/Modal";

function AccountSelectStep({
  accounts,
  isLoading,
  onSelectAccount,
}: {
  accounts: EducationalAccount[];
  isLoading: boolean;
  onSelectAccount: (accountId: number) => void;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <section className="mt-[32px] space-y-[16px]">
        <h1 className="text-[24px] font-semibold leading-[1.3] text-gray-900 tracking-[-0.5px]">
          어디에서 이체하시겠어요?
        </h1>
      </section>

      {isLoading ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">계좌 목록을 불러오는 중...</p>
        </div>
      ) : accounts.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500">등록된 계좌가 없습니다.</p>
        </div>
      ) : (
        <section className="mt-[28px] space-y-[16px]">
          {accounts.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => onSelectAccount(account.id)}
              className="w-full rounded-[16px] border border-gray-100 bg-white px-[20px] py-[18px] text-left shadow-sm transition hover:border-primary-400 hover:shadow-md"
            >
              <div className="flex items-start gap-[12px]">
                <div className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#E8F1FF]">
                  <Image
                    src="/images/woorilogo.png"
                    alt="우리은행"
                    width={24}
                    height={24}
                    className="object-contain"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="text-[17px] font-semibold text-gray-900">
                    {account.accountName}
                  </p>
                  <p className="text-[13px] text-gray-500">
                    우리은행 {formatAccountNumber(account.accountNumber)}
                  </p>
                  <p className="text-[13px] text-gray-500">
                    잔액 {account.balance.toLocaleString()}원
                  </p>
                </div>
              </div>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}

type Scenario12Props = {
  onComplete?: () => void;
  onCancel?: () => void;
};

export default function Scenario12({ onComplete, onCancel }: Scenario12Props) {
  // 자동이체 등록 흐름 전체를 제어하는 메인 페이지 컴포넌트이다.
  const router = useRouter();
  const { setTitle, setOnBack } = useScenarioHeader();
  const {
    setSelectedBank,
    resetFlow,
    setSourceAccountNumber,
    selectedBank,
    accountNumber,
    recipientName,
    amount,
    currentUserName,
  } = useTransferFlow();

  // 커스텀 훅으로 로직 분리
  const {
    accounts,
    selectedAccount,
    isLoadingAccounts,
    errorMessage: accountError,
    selectAccount,
  } = useAccountSelection();
  const { step, setStep } = useAutoPaymentSteps(setOnBack, onCancel);
  const {
    scheduleSummary,
    isPasswordSheetOpen,
    errorMessage: registrationError,
    handleScheduleComplete,
    handlePasswordSuccess: onPasswordSuccess,
    handlePasswordClose: onPasswordClose,
    registerAutoPayment,
    setPasswordSheetOpen,
  } = useAutoPaymentRegistration();

  // 은행 선택 바텀시트 노출 여부를 관리한다.
  const [isBankSheetOpen, setBankSheetOpen] = useState(false);
  // 에러 모달 상태
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  // 에러 메시지 동기화
  useEffect(() => {
    if (accountError) {
      setErrorModal({ isOpen: true, message: accountError });
    }
  }, [accountError]);

  useEffect(() => {
    if (registrationError) {
      setErrorModal({ isOpen: true, message: registrationError });
    }
  }, [registrationError]);

  // 화면이 나타날 때 헤더 제목을 설정하고 사라질 때 초기화한다.
  useEffect(() => {
    setTitle("자동이체 등록");
    return () => {
      setTitle("");
    };
  }, [setTitle]);

  // 컴포넌트가 사라질 때 자동이체 흐름과 선택 상태를 초기화한다.
  useEffect(() => {
    return () => {
      resetFlow();
      setPasswordSheetOpen(false);
    };
  }, [resetFlow, setPasswordSheetOpen]);

  // 계좌 선택 단계에서 사용자가 특정 계좌를 고를 때 상태를 갱신한다.
  const handleSelectAccount = (accountId: number) => {
    const account = selectAccount(accountId);
    if (!account) {
      console.warn(`[Scenario12] Account not found for id: ${accountId}`);
      return;
    }
    setSourceAccountNumber(account.accountNumber);
    setBankSheetOpen(true);
  };

  // 은행 선택이 완료되면 다음 단계로 이동하도록 단계 상태를 변경한다.
  const handleSelectBank = (bankName: string) => {
    setSelectedBank(bankName);
    setBankSheetOpen(false);
    setStep("form");
  };

  const displaySourceAccount = selectedAccount
    ? formatAccountNumber(selectedAccount.accountNumber)
    : "000-0000-000000";
  const displaySourceName = selectedAccount?.accountName ?? "우리은행계좌";
  const displaySourceBank = "우리은행";
  const inboundBank = selectedBank ?? "국민은행";
  const inboundAccount = accountNumber || "-";
  const inboundName = recipientName || "받는 분";
  const ownerName = currentUserName ?? "김우리";

  // 비밀번호 인증에 성공하면 확인 단계로 이동한다.
  const handlePasswordSuccess = (password: string) => {
    onPasswordSuccess(password);
    setStep("confirm");
  };

  // 비밀번호 입력을 취소하면 다시 일정 설정 단계로 돌아간다.
  const handlePasswordClose = () => {
    onPasswordClose();
    setStep("schedule");
  };

  // 금액을 수정하려는 경우 해당 단계로 이동한다.
  const handleEditAmount = () => {
    setStep("amount");
  };

  // 출금 계좌 정보를 수정하려는 경우 이전 단계로 이동한다.
  const handleEditAccount = () => {
    setStep("form");
  };

  // 일정 정보를 다시 수정하려는 경우 일정 단계로 이동한다.
  const handleEditSchedule = () => {
    setStep("schedule");
  };

  // 검토 화면에서 등록하기를 누르면 약관 동의 단계로 진입한다.
  const handleOpenConsent = () => {
    if (!scheduleSummary) {
      return;
    }
    setStep("consent");
  };

  // 약관에 동의하고 확인을 누르면 API를 호출하고 완료 화면으로 진행한다.
  const handleConsentCompleted = async () => {
    const success = await registerAutoPayment(
      selectedAccount,
      selectedBank,
      accountNumber,
      recipientName,
      amount
    );

    if (success) {
      setStep("complete");
    } else if (!selectedAccount) {
      setStep("account");
    }
  };

  // 완료 화면에서 확인을 누르면 메인 자동이체 페이지로 돌아간다.
  const handleSuccessConfirm = () => {
    // 메인 페이지에서 API로 목록을 다시 조회할 것이므로 콜백 호출
    onComplete?.();
  };

  return (
    <div className="mx-auto flex h-full flex-col min-h-[84dvh] w-full max-w-[390px] bg-white">
      <main className="flex h-full flex-col px-[20px] pb-[40px]">
        {step === "account" && (
          <AccountSelectStep
            accounts={accounts}
            isLoading={isLoadingAccounts}
            onSelectAccount={handleSelectAccount}
          />
        )}

        {/* 단계 상태에 따라 다음 시나리오 컴포넌트를 조건부로 보여준다. */}
        {step === "form" && (
          <div className="flex h-full flex-col">
            <Scenario3
              onNext={() => setStep("amount")}
              onBack={() => setStep("account")}
            />
          </div>
        )}

        {step === "amount" && (
          <Scenario4
            onNext={() => setStep("review")}
            onBack={() => setStep("form")}
          />
        )}

        {step === "review" && (
          <Scenario13
            sourceAccountName={displaySourceName}
            sourceAccountNumber={displaySourceAccount}
            onNext={() => setStep("schedule")}
          />
        )}

        {step === "schedule" && (
          <Scenario14 onComplete={handleScheduleComplete} />
        )}

        {step === "confirm" && scheduleSummary && (
          <Scenario15
            sourceAccountName={displaySourceName}
            sourceAccountNumber={displaySourceAccount}
            sourceAccountBank={displaySourceBank}
            scheduleSummary={scheduleSummary}
            onEditAmount={handleEditAmount}
            onEditAccount={handleEditAccount}
            onEditSchedule={handleEditSchedule}
            onSubmit={handleOpenConsent}
          />
        )}

        {/* 약관 동의 단계에서는 시나리오 16을 노출한다. */}
        {step === "consent" && (
          <Scenario16 onConfirm={handleConsentCompleted} />
        )}

        {/* 등록 완료 화면에서는 입력된 정보를 다시 확인하고 메인 화면으로 이동한다. */}
        {step === "complete" && scheduleSummary && (
          <Scenario17
            sourceAccountNumber={displaySourceAccount}
            sourceAccountBank={displaySourceBank}
            scheduleSummary={scheduleSummary}
            inboundBank={inboundBank}
            inboundAccount={inboundAccount}
            inboundName={inboundName}
            ownerName={ownerName}
            amount={amount}
            onConfirm={handleSuccessConfirm}
          />
        )}
      </main>

      {/* 은행 선택 바텀시트는 계좌를 선택한 직후에만 표시된다. */}
      {isBankSheetOpen && (
        <Scenario2
          onClose={() => setBankSheetOpen(false)}
          onSelect={handleSelectBank}
          allowedBanks={["국민은행"]}
        />
      )}

      {/* 비밀번호 인증 바텀시트는 자동이체 등록 직전에 호출된다. */}
      {isPasswordSheetOpen && (
        <Scenario5
          onSuccess={handlePasswordSuccess}
          onClose={handlePasswordClose}
        />
      )}

      {/* 에러 모달 */}
      <Modal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ isOpen: false, message: "" })}
        title="오류"
        description={errorModal.message}
        confirmText="확인"
      />
    </div>
  );
}
