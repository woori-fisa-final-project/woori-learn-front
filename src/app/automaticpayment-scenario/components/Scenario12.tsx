"use client";

// 자동이체 등록 플로우에서 필요한 React 훅과 유틸리티, 하위 시나리오 컴포넌트를 불러온다.
import { useCallback, useEffect, useState } from "react";
import { useUserData } from "@/lib/hooks/useUserData";
// 헤더 제어와 이체 흐름 상태 관리를 위해 내부 컨텍스트와 훅을 이용한다.
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useAccountSelection } from "@/lib/hooks/useAccountSelection";
import { useAutoPaymentSteps } from "@/lib/hooks/useAutoPaymentSteps";
import { useAutoPaymentRegistration } from "@/lib/hooks/useAutoPaymentRegistration";
import { formatAccountNumber } from "@/utils/accountUtils";

import Scenario1 from "@/app/transfer-scenario/components/Scenario1";
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
import type { ScheduleSummary } from "./types";

type EngineStep = {
  id: number;
  type: string;
  quizId?: number | null;
  content?: any;
};

/** 정답 검증 기준 */
export const AUTO_PAYMENT_EXPECTED = {
  targetBank: "국민은행",
  targetAccountDigits: "110123456789",
  monthlyRentAmount: 500_000,
  transferDay: "5일",
  durationMonths: 12,
} as const;

// 계좌번호에서 숫자만 추출
const onlyDigits = (v: string | null | undefined) => (v ?? "").replace(/\D/g, "");

/** YYYY-MM 간의 개월 수 차이 계산 */
const monthDiff = (startYmd: string, endYmd: string) => {
  const [sy, sm] = startYmd.split("-").map(Number);
  const [ey, em] = endYmd.split("-").map(Number);
  if (!sy || !sm || !ey || !em) return NaN;
  return (ey - sy) * 12 + (em - sm);
};

/** 스토리 입력값이 검증 기준과 일치하는지 검증 */
const isStoryInputValid = (params: {
  selectedBank: string | null | undefined;
  accountNumber: string | null | undefined;
  amount: number;
  scheduleSummary: { startDate: string; endDate: string; transferDay: string };
}) => {
  const bankOk = (params.selectedBank ?? "") === AUTO_PAYMENT_EXPECTED.targetBank;
  const acctOk = onlyDigits(params.accountNumber) === AUTO_PAYMENT_EXPECTED.targetAccountDigits;
  const amtOk = params.amount === AUTO_PAYMENT_EXPECTED.monthlyRentAmount;
  const dayOk = params.scheduleSummary.transferDay === AUTO_PAYMENT_EXPECTED.transferDay;

  const months = monthDiff(params.scheduleSummary.startDate, params.scheduleSummary.endDate);
  const durationOk = months === AUTO_PAYMENT_EXPECTED.durationMonths;

  return bankOk && acctOk && amtOk && dayOk && durationOk;
};

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
              onClick={() => { onSelectAccount(account.id); }}
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
  onComplete?: (accountId?: number | null) => void;
  onCancel?: () => void;
  engineStep?: EngineStep | null;
  onPracticeNext?: (nowStepId: number, answer?: number) => void | Promise<void>;
};

export default function Scenario12({ onComplete, onCancel, engineStep = null, onPracticeNext, }: Scenario12Props) {
  const { setTitle, setOnBack } = useScenarioHeader();
  const {
    setSelectedBank,
    resetFlow,
    setSourceAccountNumber,
    selectedBank,
    accountNumber,
    recipientName,
    amount,
  } = useTransferFlow();

  const { userName: currentUserName } = useUserData();

  // 커스텀 훅으로 로직 분리
  const { accounts, selectedAccount, isLoadingAccounts, errorMessage: accountError, selectAccount } = useAccountSelection();

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

  const [isBankSheetOpen, setBankSheetOpen] = useState(false);

  /**
   * PRACTICE 단계에서만 onPracticeNext 호출을 수행하는 helper
   * - onlyIds: 특정 id에서만 호출하도록 제한(의도치 않은 step에서 호출 방지)
   * - answer: 분기(정답/오답) 선택이 필요할 때 사용
   */
  const advancePractice = useCallback(
    async (opts?: { onlyIds?: number[]; answer?: number }) => {
      if (!engineStep) return false;
      if (engineStep.type !== "PRACTICE") return false;
      if (!onPracticeNext) return false;
      if (opts?.onlyIds && !opts.onlyIds.includes(engineStep.id)) return false;

      await onPracticeNext(engineStep.id, opts?.answer);
      return true;
    },
    [engineStep, onPracticeNext]
  );

  useEffect(() => {
    setTitle("자동이체 등록");
    return () => setTitle("");
  }, [setTitle]);

  useEffect(() => {
    return () => {
      resetFlow();
      setPasswordSheetOpen(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** 출금 계좌 선택 처리 */
  const handleSelectAccount = async (accountId: number) => {
    await advancePractice({ onlyIds: [1071] });

    const account = selectAccount(accountId);

    if (!account?.accountNumber) return;

    setSourceAccountNumber(account.accountNumber);
    setStep("select");
  };

  /** 은행 선택 바텀시트 오픈 */
  const handleOpenBankSheet = async () => {
    await advancePractice({ onlyIds: [1074] });
    setBankSheetOpen(true);
  };

  /** 입금은행 선택 완료 */
  const handleSelectBank = async (bankName: string) => {
    await advancePractice({ onlyIds: [1075] });
    setSelectedBank(bankName);
    setBankSheetOpen(false);
    setStep("form");
  };

  const displaySourceAccount = selectedAccount ? formatAccountNumber(selectedAccount.accountNumber) : "000-0000-000000";
  const displaySourceName = selectedAccount?.accountName ?? "우리은행계좌";
  const displaySourceBank = "우리은행";

  const inboundBank = selectedBank ?? "국민은행";
  const inboundAccount = String(accountNumber ?? "-");
  const inboundName = recipientName || "받는 분";
  const ownerName = currentUserName ?? "김집주";

  /** 비밀번호 입력 성공
   * - PRACTICE : 성공(answer:0)로 엔진 진행
   */
  const handlePasswordSuccess = async (password: string) => {
    await advancePractice({ onlyIds: [1089], answer: 0 });
    onPasswordSuccess(password);
    setStep(() => "confirm");
  };

  const handlePasswordClose = () => {
    onPasswordClose();
    setStep("schedule");
  };

  /** 일정 설정 완료 */
  const handleScheduleCompleteWithEngine = useCallback(
    async (options: ScheduleSummary) => {
      await advancePractice({ onlyIds: [1085] });
      handleScheduleComplete(options);
    },
    [advancePractice, handleScheduleComplete]
  );

  /**
   * 약관 동의 화면으로 진입 시도
   * - 입력값이 정답 경로와 일치하면 answer:0으로 성공 브랜치
   * - 아니면 answer:1로 실패 브랜치
   */
  const handleOpenConsent = async () => {
    if (!scheduleSummary) return;

    const ok = isStoryInputValid({
      selectedBank,
      accountNumber,
      amount,
      scheduleSummary: {
        startDate: scheduleSummary.startDate,
        endDate: scheduleSummary.endDate,
        transferDay: scheduleSummary.transferDay,
      },
    });

    if (ok) {
      await advancePractice({ onlyIds: [1092], answer: 0 });
      setStep("consent");
    } else {
      await advancePractice({ onlyIds: [1092], answer: 1 });
    }
  };

  /** 약관 동의 완료 후 실제 자동이체 등록 요청 */
  const handleConsentCompleted = async () => {
    const success = await registerAutoPayment(selectedAccount, selectedBank, accountNumber, recipientName, amount);

    if (success) setStep("complete");
    else if (!selectedAccount) setStep("account");
  };

  const handleSuccessConfirm = async () => {
    await advancePractice({ onlyIds: [1101] });
    onComplete?.(selectedAccount?.id ?? null);
  };

  return (
    <div className="mx-auto flex h-full flex-col min-h-[84dvh] w-full max-w-[390px] bg-white">
      <main className="flex h-full flex-col px-[20px] pb-[40px]">
        {step === "account" && (
          <AccountSelectStep accounts={accounts} isLoading={isLoadingAccounts} onSelectAccount={handleSelectAccount} />
        )}

        {step === "select" && (
          <Scenario1
            onOpenBankSheet={handleOpenBankSheet}
            onContactTransfer={() => console.log("연락처 이체 기능은 아직 구현되지 않았습니다.")}
          />
        )}

        {step === "form" && (
          <div className="flex h-full flex-col">
            <Scenario3
              onNext={async () => {
                await advancePractice({ onlyIds: [1076] });
                setStep("amount");
              }}
              onBack={() => setStep("select")}
            />
          </div>
        )}

        {step === "amount" && (
          <Scenario4
            onNext={async () => {
              await advancePractice({ onlyIds: [1078] });
              setStep("review");
            }}
            onBack={() => setStep("form")}
          />
        )}

        {step === "review" && (
          <Scenario13
            sourceAccountName={displaySourceName}
            sourceAccountNumber={displaySourceAccount}
            onNext={async () => {
              await advancePractice({ onlyIds: [1079] });
              setStep("schedule");
            }}
          />
        )}

        {step === "schedule" && <Scenario14 onComplete={handleScheduleCompleteWithEngine} />}

        {step === "confirm" && scheduleSummary && (
          <Scenario15
            sourceAccountName={displaySourceName}
            sourceAccountNumber={displaySourceAccount}
            sourceAccountBank={displaySourceBank}
            scheduleSummary={scheduleSummary}
            onEditAmount={() => setStep("amount")}
            onEditAccount={() => setStep("form")}
            onEditSchedule={() => setStep("schedule")}
            onSubmit={handleOpenConsent}
          />
        )}

        {step === "consent" && (
          <Scenario16
            onConfirm={handleConsentCompleted}
            advancePractice={advancePractice}
          />
        )}

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
            advancePractice={advancePractice}
          />
        )}
      </main>

      {isBankSheetOpen && (
        <Scenario2
          onClose={() => setBankSheetOpen(false)}
          onSelect={handleSelectBank}
          allowedBanks={["국민은행"]}
        />
      )}

      {isPasswordSheetOpen && (
        <Scenario5
          onSuccess={handlePasswordSuccess}
          onMaxFail={async () => {
            await advancePractice({ onlyIds: [1089], answer: 1 });
            handlePasswordClose();
          }}
          onClose={handlePasswordClose}
        />
      )}
    </div>
  );
}