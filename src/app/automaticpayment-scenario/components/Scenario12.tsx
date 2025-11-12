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


// 시나리오에서 선택할 수 있는 출금 계좌 목록을 하드코딩된 데이터로 제공한다.
const ACCOUNTS = [
  {
    id: "source-1",
    name: "WON통장",
    bank: "우리은행",
    number: "110-123-456789",
    balance: "잔액 300,000원",
  },
  {
    id: "source-2",
    name: "WON통장",
    bank: "우리은행",
    number: "110-987-654321",
    balance: "잔액 1,000,000원",
  },
];

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

function AccountSelectStep({
  onSelectAccount,
}: {
  onSelectAccount: (accountId: string) => void;
}) {
  // 첫 번째 단계에서 사용자가 자동이체에 사용할 출금 계좌를 고르도록 UI를 렌더링한다.
  return (
    <div className="flex flex-1 flex-col">
      <section className="mt-[32px] space-y-[16px]">
        <h1 className="text-[24px] font-semibold leading-[1.3] text-gray-900 tracking-[-0.5px]">
          어디에서 이체하시겠어요?
        </h1>
      </section>

      <section className="mt-[28px] space-y-[16px]">
        {ACCOUNTS.map((account) => (
          // 각 계좌 버튼을 렌더링하며 선택 시 상위 단계에 계좌 ID를 전달한다.
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
                <p className="text-[17px] font-semibold text-gray-900">{account.name}</p>
                <p className="text-[13px] text-gray-500">
                  {account.bank} {account.number}
                </p>
                <p className="text-[13px] text-gray-500">{account.balance}</p>
              </div>
            </div>
          </button>
        ))}
      </section>
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
  const [selectedAccount, setSelectedAccount] = useState<typeof ACCOUNTS[number] | null>(null);
  // 일정 요약 정보를 저장해 이후 단계에서 검증 및 표시한다.
  const [scheduleSummary, setScheduleSummary] = useState<ScheduleSummary | null>(null);
  // 비밀번호 바텀시트 열림 여부를 관리한다.
  const [isPasswordSheetOpen, setPasswordSheetOpen] = useState(false);
  // 뒤로가기 시 현재 단계를 안정적으로 참조하기 위해 ref를 사용한다.
  const stepRef = useRef(step);

  // step 상태가 변할 때마다 ref에 최신 값을 저장해 뒤로가기 처리에서 사용한다.
  useEffect(() => {
    stepRef.current = step;
  }, [step]);

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
      switch (current) {
        case "account":
          router.back();
          break;
        case "form":
          setStep("account");
          break;
        case "amount":
          setStep("form");
          break;
        case "review":
          setStep("amount");
          break;
        case "schedule":
          setStep("review");
          break;
        case "confirm":
          setStep("schedule");
          break;
        case "consent":
          setStep("confirm");
          break;
        case "complete":
          setStep("consent");
          break;
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
  const handleSelectAccount = (accountId: string) => {
    const account = ACCOUNTS.find((item) => item.id === accountId);
    if (!account) return;
    setSelectedAccount(account);
    setSourceAccountNumber(account.number);
    setBankSheetOpen(true);
  };

  // 은행 선택이 완료되면 다음 단계로 이동하도록 단계 상태를 변경한다.
  const handleSelectBank = (bankName: string) => {
    setSelectedBank(bankName);
    setBankSheetOpen(false);
    setStep("form");
  };

  const displaySourceAccount = selectedAccount?.number ?? "000-0000-000000";
  const displaySourceName = selectedAccount?.name ?? "우리은행계좌";
  const displaySourceBank = selectedAccount?.bank ?? "우리은행";
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

  // 약관에 동의하고 확인을 누르면 완료 화면으로 진행한다.
  const handleConsentCompleted = () => {
    setStep("complete");
  };

  // 완료 화면에서 확인을 누르면 메인 자동이체 페이지로 돌아가면서 등록 정보를 전달한다.
  const handleSuccessConfirm = () => {
    if (!scheduleSummary) {
      router.push("/automaticpayment-scenario");
      return;
    }

    const inboundBank = selectedBank ?? "국민은행";
    const inboundAccount = accountNumber || "-";
    const transferAmount = amount > 0 ? amount : 0;
    const scheduleLabel = `${scheduleSummary.transferDay}/${scheduleSummary.frequency}`;

    // 자동이체 목록 화면에서 요약 정보를 보여주기 위해 쿼리 파라미터를 구성한다.
    const params = new URLSearchParams({
      view: "registered",
      status: "정상",
      title: "타행자동이체",
      bankName: inboundBank,
      bankAccount: inboundAccount,
      amount: `${transferAmount.toLocaleString()}원`,
      schedule: scheduleLabel,
    });

    params.set("sourceAccountBank", displaySourceBank);
    params.set("sourceAccountNumber", displaySourceAccount);
    params.set("ownerName", ownerName);
    params.set("recipientName", inboundName);
    params.set("transferDay", scheduleSummary.transferDay ?? "");
    params.set("frequency", scheduleSummary.frequency ?? "");

    if (scheduleSummary.startDate) {
      params.set("startDate", scheduleSummary.startDate);
    }
    if (scheduleSummary.endDate) {
      params.set("endDate", scheduleSummary.endDate);
    }

    const todayIso = new Date().toISOString().slice(0, 10);
    params.set("registerDate", todayIso);

    router.push(`/automaticpayment-scenario?${params.toString()}`);
  };

  return (
    <div className="mx-auto flex h-full flex-col min-h-[85dvh] w-full max-w-[390px] bg-white">
      <main className="flex h-full flex-col px-[20px] pb-[40px]">
        {step === "account" && (
          <AccountSelectStep onSelectAccount={handleSelectAccount} />
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
