"use client"; // 클라이언트 컴포넌트로 선언하여 상태와 브라우저 API를 사용할 수 있도록 합니다.

import { useRouter } from "next/navigation"; // 페이지 이동을 위해 Next.js 라우터 훅을 사용합니다.
import { useState } from "react"; // 입력값과 상태를 관리하기 위해 React 상태 훅을 사용합니다.
import Input from "@/components/common/Input"; // 공통 입력 컴포넌트를 가져옵니다.
import Button from "@/components/common/Button"; // 제출 버튼에 사용할 공통 버튼입니다.
import PageHeader from "@/components/common/PageHeader"; // 페이지 상단 헤더를 표시합니다.
import PageContainer from "@/components/common/PageContainer"; // 전체 레이아웃을 감싸는 컨테이너입니다.
import AccountInfoBlock from "@/components/common/AccountInfoBlock"; // 계좌 정보 입력 블록 UI를 재사용합니다.
import { useUserData } from "@/lib/hooks/useUserData"; // 사용자 포인트 데이터를 제공하는 커스텀 훅입니다.

const FIXED_BANK = "우리은행"; // 환전 계좌가 연결될 은행명을 고정값으로 정의합니다.
const BANK_LOGO = "/images/woori.png"; // 은행 로고 이미지 경로입니다.

export default function PointExchangePage() {
  const router = useRouter(); // 라우터를 이용해 다른 페이지로 이동합니다.
  const [withdrawalAmount, setWithdrawalAmount] = useState(""); // 환전 금액 입력값을 문자열로 저장합니다.
  const [accountNumber, setAccountNumber] = useState(""); // 입금받을 계좌번호 입력값을 저장합니다.
  const { availablePoints } = useUserData(); // 현재 사용자의 보유 포인트를 가져옵니다.
  const [errors, setErrors] = useState<{ withdrawalAmount?: string; accountNumber?: string }>({}); // 각 입력 필드의 에러 메시지를 관리합니다.
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle"); // 제출 결과 상태를 표시하기 위한 값입니다.

  const handleBack = () => {
    router.push("/mypage"); // 뒤로가기 시 마이페이지로 이동합니다.
  };

  const handleHistoryTab = () => {
    router.push("/points/list"); // 포인트 내역 탭으로 전환합니다.
  };

  const expectedAmount = withdrawalAmount ? parseInt(withdrawalAmount.replace(/,/g, "")) : 0; // 입력된 환전 금액을 정수로 계산합니다.
  const formattedExpectedAmount = expectedAmount.toLocaleString(); // 지급 예정 금액을 천 단위 구분 기호와 함께 표시합니다.

  const validateForm = () => {
    const newErrors: typeof errors = {}; // 각 입력 항목의 에러 메시지를 저장할 객체입니다.
    const amount = parseInt(withdrawalAmount.replace(/,/g, "")); // 쉼표를 제거한 후 금액을 숫자로 변환합니다.

    if (!withdrawalAmount) {
      newErrors.withdrawalAmount = "환전 금액을 입력해주세요.";
    } else if (amount < 1) {
      newErrors.withdrawalAmount = "최소 환전 금액은 1p입니다.";
    } else if (amount > availablePoints) {
      newErrors.withdrawalAmount = `보유 포인트(${availablePoints.toLocaleString()}p)를 초과할 수 없습니다.`;
    }

    if (!accountNumber.trim()) {
      newErrors.accountNumber = "계좌번호를 입력해주세요.";
    } else if (!/^\d+$/.test(accountNumber.replace(/-/g, ""))) {
      newErrors.accountNumber = "계좌번호는 숫자만 입력 가능합니다.";
    } else if (accountNumber.replace(/-/g, "").length < 10) {
      newErrors.accountNumber = "계좌번호는 최소 10자리 이상이어야 합니다.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9]/g, ""); // 숫자가 아닌 문자를 제거합니다.
    setWithdrawalAmount(value); // 입력값을 상태에 반영합니다.
    setSubmitStatus("idle"); // 입력이 변경되면 제출 상태를 초기화합니다.

    if (value) {
      const amount = parseInt(value);
      if (amount > availablePoints) {
        setErrors((prev) => ({
          ...prev,
          withdrawalAmount: `보유 포인트(${availablePoints.toLocaleString()}p)를 초과할 수 없습니다.`,
        }));
      } else if (amount < 1 && amount > 0) {
        setErrors((prev) => ({
          ...prev,
          withdrawalAmount: "최소 환전 금액은 1p입니다.",
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.withdrawalAmount;
          return newErrors;
        });
      }
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.withdrawalAmount;
        return newErrors;
      });
    }
  };

  const handleAccountNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value.replace(/[^0-9-]/g, ""); // 숫자와 하이픈만 허용합니다.
    setAccountNumber(value); // 계좌번호 상태를 갱신합니다.
    setSubmitStatus("idle"); // 입력 이후 제출 상태를 초기화합니다.

    if (value && !/^\d+(-?\d+)*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        accountNumber: "계좌번호는 숫자와 하이픈(-)만 입력 가능합니다.",
      }));
    } else if (value.replace(/-/g, "").length > 0 && value.replace(/-/g, "").length < 10) {
      setErrors((prev) => ({
        ...prev,
        accountNumber: "계좌번호는 최소 10자리 이상이어야 합니다.",
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.accountNumber;
        return newErrors;
      });
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setSubmitStatus("idle"); // 제출 직전 상태를 초기화합니다.

      try {
        console.log("환전 신청 완료", {
          withdrawalAmount: parseInt(withdrawalAmount.replace(/,/g, "")),
          expectedAmount,
          bank: FIXED_BANK,
          accountNumber,
        });

        setSubmitStatus("success");
        setTimeout(() => {
          router.push("/mypage");
        }, 1500);
      } catch (error) {
        setSubmitStatus("error");
      }
    }
  };

  const isButtonEnabled = withdrawalAmount && accountNumber.trim() && Object.keys(errors).length === 0; // 두 필드가 채워지고 에러가 없을 때 버튼을 활성화합니다.

  return (
    <PageContainer>
      <div className="flex h-[calc(100dvh-60px)] w-full flex-col">
        <div className="flex-shrink-0">
          <PageHeader title="포인트 관리" onBack={handleBack} />

          <div className="mt-8 flex w-full border-b border-gray-200">
            <button
              onClick={handleHistoryTab}
              className="flex-1 pb-3 text-[16px] font-medium text-gray-400 transition-colors hover:text-primary-400"
              aria-label="포인트 내역"
            >
              포인트 내역
            </button>
            <button
              className="flex-1 border-b-2 border-primary-400 pb-3 text-[16px] font-medium text-primary-400"
              aria-label="포인트 환전"
              aria-current="page"
            >
              포인트 환전
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          <div className="mt-8 w-full">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-gray-600">보유 포인트</p>
                <p className="text-[18px] font-semibold text-primary-400">{availablePoints.toLocaleString()} p</p>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full">
            <Input
              label="환전 금액"
              type="text"
              placeholder="환전할 금액을 입력해주세요"
              value={withdrawalAmount ? parseInt(withdrawalAmount).toLocaleString() : ""}
              onChange={handleAmountChange}
              aria-invalid={!!errors.withdrawalAmount}
              aria-describedby={errors.withdrawalAmount ? "withdrawal-amount-error" : undefined}
            />
            {errors.withdrawalAmount && (
              <p id="withdrawal-amount-error" className="mt-1 text-sm text-red-500" role="alert">
                {errors.withdrawalAmount}
              </p>
            )}
          </div>

          {withdrawalAmount && !errors.withdrawalAmount && expectedAmount > 0 && (
            <div className="mt-5 w-full rounded-lg bg-primary-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-gray-700">지급 예정 금액</p>
                <p className="text-[18px] font-semibold text-primary-400">{formattedExpectedAmount} p</p>
              </div>
            </div>
          )}

          <AccountInfoBlock
            bankName={FIXED_BANK}
            bankLogo={BANK_LOGO}
            accountNumber={accountNumber}
            onAccountNumberChange={handleAccountNumberChange}
            error={errors.accountNumber}
            className="mt-8"
          />

          <div className="mt-6 w-full rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 text-[14px] font-semibold text-gray-700">유의사항</h3>
            <ul className="space-y-1 text-[12px] leading-relaxed text-gray-600">
              <li>• 환전 신청 후 처리까지 1-2 영업일이 소요됩니다.</li>
              <li>• 최소 환전 금액은 1p입니다.</li>
              <li>• 계좌 정보를 정확히 입력해주세요. 잘못된 정보로 인한 손실은 책임지지 않습니다.</li>
              <li>• 환전 신청 후 취소가 불가능합니다.</li>
            </ul>
          </div>

          {submitStatus === "success" && (
            <div className="mt-4 w-full rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="text-center text-sm font-medium text-green-700">환전 신청이 완료되었습니다.</p>
            </div>
          )}
          {submitStatus === "error" && (
            <div className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-center text-sm font-medium text-red-700">환전 신청 중 오류가 발생했습니다. 다시 시도해주세요.</p>
            </div>
          )}
        </div>

        <div className="mt-6 w-full shrink-0" style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))" }}>
          <Button onClick={handleSubmit} disabled={!isButtonEnabled} aria-label="환전 신청하기">
            환전 신청
          </Button>
        </div>
      </div>
    </PageContainer>
  );
}



