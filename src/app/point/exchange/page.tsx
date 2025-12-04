"use client";

import { requestPointExchange } from "@/lib/api/points.api";
import { useIsClient } from "@/lib/hooks/useIsClient";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import AccountInfoBlock from "@/components/common/AccountInfoBlock";
import { useUserData } from "@/lib/hooks/useUserData";
import Modal from "@/components/common/Modal";
import { useUserStore } from "@/lib/stores/userStore";

const FIXED_BANK = "우리은행";
const BANK_LOGO = "/images/woori.png";

export default function PointExchangePage() {
  const router = useRouter();
  const { availablePoints } = useUserData();
  const { setAvailablePoints } = useUserStore();
  const isClient = useIsClient();

  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [errors, setErrors] = useState<{
    withdrawalAmount?: string;
    accountNumber?: string;
  }>({});

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const timerRef = useRef<number | null>(null);

  // 추가된 모달 상태
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleBack = () => router.push("/mypage");
  const handleHistoryTab = () => router.push("/point/list");

  const rawAmount = withdrawalAmount.replace(/,/g, "");
  const expectedAmount = rawAmount ? Number(rawAmount) : 0;

  const formattedExpectedAmount = expectedAmount.toLocaleString();

  const validateAmount = (value: string, availablePoints: number) => {
    const raw = value.replace(/,/g, "");
    const amount = Number(raw);
    if (!raw || isNaN(amount)) return "환전 금액을 입력해주세요.";
    if (amount < 1) return "최소 환전 금액은 1p입니다.";
    if (amount > availablePoints)
      return `보유 포인트(${availablePoints.toLocaleString()}p)를 초과할 수 없습니다.`;

    return null;
  };

  const validateAccountNumber = (value: string) => {
    const digits = value.replace(/-/g, "");

    if (!value.trim()) return "계좌번호를 입력해주세요.";
    if (!/^\d+$/.test(digits)) return "계좌번호는 숫자만 입력 가능합니다.";
    if (digits.length < 10) return "계좌번호는 최소 10자리 이상이어야 합니다.";

    return null;
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setWithdrawalAmount(value);
    setSubmitStatus("idle");

    const error = validateAmount(value, availablePoints);
    setErrors((prev) => ({ ...prev, withdrawalAmount: error || undefined }));
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9-]/g, "");
    setAccountNumber(value);
    setSubmitStatus("idle");

    const error = validateAccountNumber(value);
    setErrors((prev) => ({ ...prev, accountNumber: error || undefined }));
  };

  const handleSubmit = async () => {
    const amountError = validateAmount(withdrawalAmount, availablePoints);
    const accountError = validateAccountNumber(accountNumber);

    if (amountError || accountError) {
      setErrors({
        withdrawalAmount: amountError || undefined,
        accountNumber: accountError || undefined,
      });
      return;
    }

    if (submitStatus === "loading") return;

    setSubmitStatus("loading");

    try {
      const dto = {
        exchangeAmount: expectedAmount,
        accountNum: accountNumber.replace(/-/g, ""),
        bankCode: "WOORI",
      };

      const response = await requestPointExchange(dto);
      if (response && typeof response.currentBalance === "number") {
        setAvailablePoints(response.currentBalance);
      }
      setSubmitStatus("success");

      // 모달 표시
      setIsExchangeModalOpen(true);

      // 성공 후 자동 이동 타이머 (2초 뒤 마이페이지로 이동)
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = window.setTimeout(() => {
        router.replace("/mypage");
      }, 2000);

      // 자동 이동은 모달 내부에서 처리
    } catch (error) {
      setSubmitStatus("error");
      return; // 🔥 재시도 시 중복요청 방지
    }
  };

  const isButtonEnabled =
    withdrawalAmount &&
    accountNumber.trim() &&
    !errors.withdrawalAmount &&
    !errors.accountNumber;

  return (
    <PageContainer>
      <div className="flex h-[calc(100dvh-60px)] w-full flex-col">
        <div className="flex-shrink-0">
          <PageHeader title="포인트 관리" onBack={handleBack} />

          <div className="mt-8 flex w-full border-b border-gray-200">
            <button
              onClick={handleHistoryTab}
              className="flex-1 pb-3 text-[16px] font-medium text-gray-400 hover:text-primary-400"
            >
              포인트 내역
            </button>
            <button
              className="flex-1 border-b-2 border-primary-400 pb-3 text-[16px] font-medium text-primary-400"
              aria-current="page"
            >
              포인트 환전
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* 보유 포인트 */}
          <div className="mt-8 w-full">
            <div className="rounded-lg bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-medium text-gray-600">
                  보유 포인트
                </p>
                <p className="text-[18px] font-semibold text-primary-400">
                  <span suppressHydrationWarning>
                    {isClient ? `${availablePoints.toLocaleString()} p` : ""}
                  </span>
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
                  ? Number(withdrawalAmount).toLocaleString()
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

          {/* 예정 금액 */}
          {withdrawalAmount &&
            !errors.withdrawalAmount &&
            expectedAmount > 0 && (
              <div className="mt-5 w-full rounded-lg bg-primary-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-medium text-gray-700">
                    지급 예정 금액
                  </p>
                  <p className="text-[18px] font-semibold text-primary-400">
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

          {/* 안내 */}
          <div className="mt-6 w-full rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 text-[14px] font-semibold text-gray-700">
              유의사항
            </h3>
            <ul className="space-y-1 text-[12px] text-gray-600">
              <li>• 환전 신청 후 처리까지 1-2 영업일이 소요됩니다.</li>
              <li>• 최소 환전 금액은 1p입니다.</li>
              <li>• 계좌 정보를 정확히 입력해주세요.</li>
              <li>• 환전 신청은 취소할 수 없습니다.</li>
            </ul>
          </div>

          {/* 실패 메시지 */}
          {submitStatus === "error" && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700">
              환전 신청 중 오류가 발생했습니다. 다시 시도해주세요.
            </div>
          )}
        </div>

        {/* 버튼 */}
        <div
          className="mt-6 w-full shrink-0"
          style={{
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
          }}
        >
          <Button
            onClick={handleSubmit}
            disabled={!isButtonEnabled || submitStatus === "loading"}
          >
            {submitStatus === "loading" ? "신청 중..." : "환전 신청"}
          </Button>
        </div>
      </div>

      {/* 환전 완료 모달 */}
      <Modal
        isOpen={isExchangeModalOpen}
        onClose={() => {
          setIsExchangeModalOpen(false);
        }}
        showCancelButton={false}
      >
        <div className="flex flex-col items-center p-6">
          <h2 className="text-[20px] font-semibold text-gray-700 mb-2">
            환전 신청 완료
          </h2>
          <p className="text-[15px] text-gray-600 text-center mb-6">
            환전 신청이 정상적으로 처리되었습니다.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="w-full font-semibold"
            onClick={() => {
              setIsExchangeModalOpen(false);
              router.replace("/mypage"); // 확인 버튼에서 이동
            }}
          >
            확인
          </Button>
        </div>
      </Modal>
    </PageContainer>
  );
}
