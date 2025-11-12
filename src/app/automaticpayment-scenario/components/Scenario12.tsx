"use client";

// 자동이체 등록 플로우에서 필요한 React 훅과 유틸리티, 하위 시나리오 컴포넌트를 불러온다.
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
// 헤더 제어와 이체 흐름 상태 관리를 위해 내부 컨텍스트와 훅을 이용한다.
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
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
import type { ScheduleSummary } from "./types";
import Image from "next/image";
import { createAutoPayment } from "@/lib/api/autoPayment";
import { getAccountList } from "@/lib/api/account";
import type { EducationalAccount } from "@/types/account";

const TEMP_USER_ID = 1; // 임시 사용자 ID

// 자동이체 등록 플로우가 이동할 수 있는 단계 값을 정의한다.
type Step =
  | "account"
  | "form"
  | "amount"
  | "review"
  | "schedule"
  | "confirm"
  | "consent"
  | "complete";

const STEP_PREVIOUS_MAP: Partial<Record<Step, Step>> = {
  form: "account",
  amount: "form",
  review: "amount",
  schedule: "review",
  confirm: "schedule",
  consent: "confirm",
  complete: "consent",
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
  // 계좌번호 포맷팅
  const formatAccountNumber = (accountNumber?: string | null): string => {
    if (!accountNumber) return "-";
    const numbers = accountNumber.replace(/[^0-9]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

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
                  <p className="text-[17px] font-semibold text-gray-900">{account.accountName}</p>
                  <p className="text-[13px] text-gray-500">
                    우리은행 {formatAccountNumber(account.accountNumber)}
                  </p>
                  <p className="text-[13px] text-gray-500">잔액 {account.balance.toLocaleString()}원</p>
                </div>
              </div>
            </button>
          ))}
        </section>
      )}
    </div>
  );
}

export default function Scenario12() {
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
  // 현재 진행 중인 단계를 추적하여 다른 화면을 순차적으로 보여준다.
  const [step, setStep] = useState<Step>("account");
  // 은행 선택 바텀시트 노출 여부를 관리한다.
  const [isBankSheetOpen, setBankSheetOpen] = useState(false);
  // 사용자가 고른 계좌 정보를 저장하여 다른 단계에서도 참조한다.
  const [selectedAccount, setSelectedAccount] = useState<EducationalAccount | null>(null);
  // 일정 요약 정보를 저장해 이후 단계에서 검증 및 표시한다.
  const [scheduleSummary, setScheduleSummary] = useState<ScheduleSummary | null>(null);
  // 비밀번호 바텀시트 열림 여부를 관리한다.
  const [isPasswordSheetOpen, setPasswordSheetOpen] = useState(false);
  // 뒤로가기 시 현재 단계를 안정적으로 참조하기 위해 ref를 사용한다.
  const stepRef = useRef(step);
  // 계좌 목록 관련 state
  const [accounts, setAccounts] = useState<EducationalAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  // step 상태가 변할 때마다 ref에 최신 값을 저장해 뒤로가기 처리에서 사용한다.
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  // 컴포넌트 마운트 시 계좌 목록 조회
  useEffect(() => {
    async function fetchAccounts() {
      try {
        setIsLoadingAccounts(true);
        const accountList = await getAccountList(TEMP_USER_ID);
        setAccounts(accountList);
      } catch (error) {
        console.error("계좌 목록 조회 실패:", error);
        setAccounts([]);
      } finally {
        setIsLoadingAccounts(false);
      }
    }

    fetchAccounts();
  }, []);

  // 화면이 나타날 때 헤더 제목을 설정하고 사라질 때 초기화한다.
  useEffect(() => {
    setTitle("자동이체 등록");
    return () => {
      setTitle("");
    };
  }, [setTitle]);

  useEffect(() => {
    const handleBack = () => {
      const current = stepRef.current;
      const prevStep = STEP_PREVIOUS_MAP[current];

      if (prevStep) {
        setStep(prevStep);
      } else if (current === "account") {
        router.back();
      }
    };

    setOnBack(() => handleBack);

    return () => {
      setOnBack(null);
    };
  }, [router, setOnBack]);

  // 컴포넌트가 사라질 때 자동이체 흐름과 선택 상태를 초기화한다.
  useEffect(() => {
    return () => {
      resetFlow();
      setSelectedAccount(null);
      setScheduleSummary(null);
      setPasswordSheetOpen(false);
    };
  }, [resetFlow]);

  // 계좌 선택 단계에서 사용자가 특정 계좌를 고를 때 상태를 갱신한다.
  const handleSelectAccount = (accountId: number) => {
    const account = accounts.find((item) => item.id === accountId);
    if (!account) return;
    setSelectedAccount(account);
    setSourceAccountNumber(account.accountNumber);
    setBankSheetOpen(true);
  };

  // 은행 선택이 완료되면 다음 단계로 이동하도록 단계 상태를 변경한다.
  const handleSelectBank = (bankName: string) => {
    setSelectedBank(bankName);
    setBankSheetOpen(false);
    setStep("form");
  };

  // 계좌번호 포맷팅
  const formatAccountNumber = (accountNumber?: string | null): string => {
    if (!accountNumber) return "-";
    const numbers = accountNumber.replace(/[^0-9]/g, "");
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  const displaySourceAccount = selectedAccount ? formatAccountNumber(selectedAccount.accountNumber) : "000-0000-000000";
  const displaySourceName = selectedAccount?.accountName ?? "우리은행계좌";
  const displaySourceBank = "우리은행";
  const inboundBank = selectedBank ?? "국민은행";
  const inboundAccount = accountNumber || "-";
  const inboundName = recipientName || "받는 분";
  const ownerName = currentUserName ?? "김우리";

  // 일정 설정 단계가 완료되면 요약 정보를 저장하고 비밀번호 인증 단계로 이동한다.
  const handleScheduleComplete = (options: ScheduleSummary) => {
    setScheduleSummary(options);
    setPasswordSheetOpen(true);
  };

  // 비밀번호 인증에 성공하면 검토 단계 이후 약관 동의 단계로 이동한다.
  const handlePasswordSuccess = () => {
    setPasswordSheetOpen(false);
    setStep("confirm");
  };

  // 비밀번호 입력을 취소하면 다시 일정 설정 단계로 돌아간다.
  const handlePasswordClose = () => {
    setPasswordSheetOpen(false);
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
    if (!scheduleSummary) {
      console.error("일정 정보가 없습니다.");
      return;
    }

    try {
      // 은행명을 은행 코드로 변환
      const getBankCode = (bankName: string): string => {
        const bankCodeMap: Record<string, string> = {
          "한국은행": "001",
          "산업은행": "002",
          "기업은행": "003",
          "국민은행": "004",
          "수협은행": "007",
          "농협은행": "011",
          "우리은행": "020",
          "SC제일은행": "023",
          "한국씨티은행": "027",
          "대구은행": "031",
          "부산은행": "032",
          "광주은행": "034",
          "제주은행": "035",
          "전북은행": "037",
          "경남은행": "039",
          "새마을금고": "045",
          "신협": "048",
          "상호저축은행": "050",
          "우체국": "071",
          "하나은행": "081",
          "신한은행": "088",
          "케이뱅크": "089",
          "카카오뱅크": "090",
        };
        return bankCodeMap[bankName] || "020"; // 기본값: 우리은행
      };

      // frequency와 transferDay에서 숫자만 추출
      const parseNumber = (str?: string): number => {
        if (!str) return 0;
        const match = str.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };

      const transferCycle = parseNumber(scheduleSummary.frequency);
      const designatedDate = parseNumber(scheduleSummary.transferDay);

      // API 호출
      await createAutoPayment({
        educationalAccountId: selectedAccount?.id || 1,
        depositBankCode: getBankCode(selectedBank || "국민은행"),
        depositNumber: accountNumber || "",
        amount: amount,
        counterpartyName: recipientName || "받는 분",
        displayName: "타행자동이체",
        transferCycle: transferCycle,
        designatedDate: designatedDate,
        startDate: scheduleSummary.startDate,
        expirationDate: scheduleSummary.endDate,
        accountPassword: "1234", // 임시 하드코딩 (실제로는 입력받은 비밀번호 사용)
      });

      // 성공 시 완료 화면으로 이동
      setStep("complete");
    } catch (error) {
      console.error("자동이체 등록 실패:", error);
      alert("자동이체 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 완료 화면에서 확인을 누르면 메인 자동이체 페이지로 돌아간다.
  const handleSuccessConfirm = () => {
    // 메인 페이지에서 API로 목록을 다시 조회할 것이므로 파라미터 없이 이동
    router.push("/automaticpayment-scenario");
  };

  return (
    <div className="mx-auto flex h-full flex-col min-h-[85dvh] w-full max-w-[390px] bg-white">
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
          <Scenario4 onNext={() => setStep("review")} onBack={() => setStep("form")} />
        )}

        {step === "review" && (
          <Scenario13
            sourceAccountName={displaySourceName}
            sourceAccountNumber={displaySourceAccount}
            onNext={() => setStep("schedule")}
          />
        )}

        {step === "schedule" && (
          <Scenario14
            onComplete={handleScheduleComplete}
          />
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
        />
      )}

      {/* 비밀번호 인증 바텀시트는 자동이체 등록 직전에 호출된다. */}
      {isPasswordSheetOpen && (
        <Scenario5
          onSuccess={handlePasswordSuccess}
          onClose={handlePasswordClose}
        />
      )}
    </div>
  );
}
