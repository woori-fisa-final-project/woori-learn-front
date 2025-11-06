"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import AccountInfoBlock from "@/components/common/AccountInfoBlock";
import { getAvailablePoints } from "@/constants/points";

const FIXED_BANK = "우리은행";
const BANK_LOGO = "/images/woori.png";

export default function PointExchange() {
  const router = useRouter();
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [availablePoints, setAvailablePoints] = useState(5000);
  const [errors, setErrors] = useState<{
    withdrawalAmount?: string;
    accountNumber?: string;
  }>({});
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  // 보유 포인트 불러오기
  useEffect(() => {
    const points = getAvailablePoints();
    setAvailablePoints(points);
  }, []);

  const handleBack = () => {
    router.push("/mypage");
  };

  const handleHistoryTab = () => {
    router.push("/points/list");
  };

  // 지급 예정 금액 = 입력한 환전 포인트와 동일 (세금 계산 없음)
  const expectedAmount = withdrawalAmount
    ? parseInt(withdrawalAmount.replace(/,/g, ""))
    : 0;

  const formattedExpectedAmount = expectedAmount.toLocaleString();

  // 유효성 검증
  const validateForm = () => {
    const newErrors: typeof errors = {};
    const amount = parseInt(withdrawalAmount.replace(/,/g, ""));

    if (!withdrawalAmount || amount <= 0) {
      newErrors.withdrawalAmount = "환전 금액을 입력해주세요.";
    } else if (amount > availablePoints) {
      newErrors.withdrawalAmount = `보유 포인트(${availablePoints.toLocaleString()}p)를 초과할 수 없습니다.`;
    } else if (amount < 1) {
      newErrors.withdrawalAmount = "최소 환전 금액은 1p입니다.";
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

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setWithdrawalAmount(value);
    setSubmitStatus("idle");

    // 실시간 유효성 검증
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

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9-]/g, "");
    setAccountNumber(value);
    setSubmitStatus("idle");

    // 실시간 유효성 검증
    if (value && !/^\d+(-?\d+)*$/.test(value)) {
      setErrors((prev) => ({
        ...prev,
        accountNumber: "계좌번호는 숫자와 하이픈(-)만 입력 가능합니다.",
      }));
    } else if (
      value.replace(/-/g, "").length > 0 &&
      value.replace(/-/g, "").length < 10
    ) {
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

  const handleSubmit = async () => {
    if (validateForm()) {
      setSubmitStatus("idle");

      try {
        // TODO: API 호출
        console.log("환전 신청 완료", {
          withdrawalAmount: parseInt(withdrawalAmount.replace(/,/g, "")),
          expectedAmount,
          bank: FIXED_BANK,
          accountNumber,
        });

        // 성공 시
        setSubmitStatus("success");
        setTimeout(() => {
          router.push("/mypage");
        }, 1500);
      } catch (error) {
        setSubmitStatus("error");
      }
    }
  };

  const isButtonEnabled =
    withdrawalAmount &&
    accountNumber.trim() &&
    Object.keys(errors).length === 0;

  return (
    <PageContainer>
      <PageHeader title="포인트 관리" onBack={handleBack} />

      {/* Tabs */}
      <div className="mt-8 w-full flex border-b border-gray-200">
          <button
            onClick={handleHistoryTab}
            className="flex-1 pb-3 text-[16px] font-medium transition-colors text-gray-400 hover:text-primary-400"
            aria-label="포인트 내역"
          >
            포인트 내역
          </button>
          <button
            className="flex-1 pb-3 text-[16px] font-medium transition-colors text-primary-400 border-b-2 border-primary-400"
            aria-label="포인트 환전"
            aria-current="page"
          >
            포인트 환전
          </button>
        </div>

      {/* 보유 포인트 */}
      <div className="mt-8 w-full">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <p className="text-[14px] text-gray-600 font-medium">
              보유 포인트
            </p>
            <p className="text-[18px] text-gray-800 font-semibold">
              {availablePoints.toLocaleString()} p
            </p>
          </div>
        </div>
      </div>

      {/* 환전 금액 입력 */}
      <div className="mt-8 w-full">
          <Input
            label="환전 금액"
            type="text"
            placeholder="환전할 금액을 입력해주세요"
            value={
              withdrawalAmount
                ? parseInt(withdrawalAmount).toLocaleString()
                : ""
            }
            onChange={handleAmountChange}
            aria-invalid={!!errors.withdrawalAmount}
            aria-describedby={
              errors.withdrawalAmount ? "withdrawal-amount-error" : undefined
            }
          />
          {errors.withdrawalAmount && (
            <p
              id="withdrawal-amount-error"
              className="mt-1 text-sm text-red-500"
              role="alert"
            >
              {errors.withdrawalAmount}
            </p>
          )}
        </div>

      {/* 지급 예정 금액 */}
      {withdrawalAmount && !errors.withdrawalAmount && expectedAmount > 0 && (
        <div className="mt-5 w-full bg-primary-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px] text-gray-700 font-medium">
              지급 예정 금액
            </p>
            <p className="text-[18px] text-primary-400 font-semibold">
              {formattedExpectedAmount} p
            </p>
          </div>
        </div>
      )}

      {/* 계좌 정보 */}
      <AccountInfoBlock
        bankName={FIXED_BANK}
        bankLogo={BANK_LOGO}
        accountNumber={accountNumber}
        onAccountNumberChange={handleAccountNumberChange}
        error={errors.accountNumber}
        className="mt-8"
      />

      {/* 유의사항 */}
      <div className="mt-8 w-full p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-[14px] text-gray-700 font-semibold mb-2">
          유의사항
        </h3>
        <ul className="space-y-1 text-[12px] text-gray-600 leading-relaxed">
          <li>• 환전 신청 후 처리까지 1-2 영업일이 소요됩니다.</li>
          <li>• 최소 환전 금액은 1p입니다.</li>
          <li>
            • 계좌 정보를 정확히 입력해주세요. 잘못된 정보로 인한 손실은
            책임지지 않습니다.
          </li>
          <li>• 환전 신청 후 취소가 불가능합니다.</li>
        </ul>
      </div>

      {/* 성공/실패 메시지 */}
      {submitStatus === "success" && (
        <div className="mt-4 w-full p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium text-center">
            환전 신청이 완료되었습니다.
          </p>
        </div>
      )}
      {submitStatus === "error" && (
        <div className="mt-4 w-full p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700 font-medium text-center">
            환전 신청 중 오류가 발생했습니다. 다시 시도해주세요.
          </p>
        </div>
      )}

      {/* 환전 신청 버튼 */}
      <div className="mt-10 w-full">
        <Button
          onClick={handleSubmit}
          disabled={!isButtonEnabled}
          aria-label="환전 신청하기"
        >
          환전 신청
        </Button>
      </div>
    </PageContainer>
  );
}
