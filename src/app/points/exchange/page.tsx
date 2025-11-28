'use client';

<<<<<<< HEAD
import { requestPointExchange } from '@/lib/api/points.api';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
=======
import { useRouter } from "next/navigation"; // 페이지 이동을 위해 Next.js 라우터 훅을 사용합니다.
import { useState, useRef, useEffect } from "react"; // 입력값과 상태를 관리하기 위해 React 상태 훅을 사용합니다.
import Input from "@/components/common/Input"; // 공통 입력 컴포넌트를 가져옵니다.
import Button from "@/components/common/Button"; // 제출 버튼에 사용할 공통 버튼입니다.
import PageHeader from "@/components/common/PageHeader"; // 페이지 상단 헤더를 표시합니다.
import PageContainer from "@/components/common/PageContainer"; // 전체 레이아웃을 감싸는 컨테이너입니다.
import AccountInfoBlock from "@/components/common/AccountInfoBlock"; // 계좌 정보 입력 블록 UI를 재사용합니다.
import { useUserData } from "@/lib/hooks/useUserData"; // 사용자 포인트 데이터를 제공하는 커스텀 훅입니다.
import Modal from "@/components/common/Modal";
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e

import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import PageHeader from '@/components/common/PageHeader';
import PageContainer from '@/components/common/PageContainer';
import AccountInfoBlock from '@/components/common/AccountInfoBlock';
import { useUserData } from '@/lib/hooks/useUserData';

const FIXED_BANK = '우리은행';
const BANK_LOGO = '/images/woori.png';

export default function PointExchangePage() {
<<<<<<< HEAD
  const router = useRouter();
  const { availablePoints } = useUserData();

  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const [errors, setErrors] = useState<{
    withdrawalAmount?: string;
    accountNumber?: string;
  }>({});

  const [submitStatus, setSubmitStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >('idle');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
=======
  const router = useRouter(); // 라우터를 이용해 다른 페이지로 이동합니다.
  const [withdrawalAmount, setWithdrawalAmount] = useState(""); // 환전 금액 입력값을 문자열로 저장합니다.
  const [accountNumber, setAccountNumber] = useState(""); // 입금받을 계좌번호 입력값을 저장합니다.
  const { availablePoints } = useUserData(); // 현재 사용자의 보유 포인트를 가져옵니다.
  const [errors, setErrors] = useState<{
    withdrawalAmount?: string;
    accountNumber?: string;
  }>({}); // 각 입력 필드의 에러 메시지를 관리합니다.
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle"); // 제출 결과 상태를 표시하기 위한 값입니다.
  const timerRef = useRef<NodeJS.Timeout | null>(null); // setTimeout 타이머를 저장하여 cleanup 시 정리합니다.
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleBack = () => router.push('/mypage');
  const handleHistoryTab = () => router.push('/points/list');

  const expectedAmount = withdrawalAmount
    ? parseInt(withdrawalAmount.replace(/,/g, ''))
    : 0;

  const formattedExpectedAmount = expectedAmount.toLocaleString();

  const validateAmount = (value: string, availablePoints: number) => {
    const amount = parseInt(value.replace(/,/g, ''));

    if (!value) return '환전 금액을 입력해주세요.';
    if (amount < 1) return '최소 환전 금액은 1p입니다.';
    if (amount > availablePoints)
      return `보유 포인트(${availablePoints.toLocaleString()}p)를 초과할 수 없습니다.`;

    return null;
  };

  const validateAccountNumber = (value: string) => {
    const digits = value.replace(/-/g, '');

    if (!value.trim()) return '계좌번호를 입력해주세요.';
    if (!/^\d+$/.test(digits)) return '계좌번호는 숫자만 입력 가능합니다.';
    if (digits.length < 10) return '계좌번호는 최소 10자리 이상이어야 합니다.';

    return null;
  };

<<<<<<< HEAD
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setWithdrawalAmount(value);
    setSubmitStatus('idle');
=======
  const expectedAmount = withdrawalAmount
    ? parseInt(withdrawalAmount.replace(/,/g, ""))
    : 0; // 입력된 환전 금액을 정수로 계산합니다.
  const formattedExpectedAmount = expectedAmount.toLocaleString(); // 지급 예정 금액을 천 단위 구분 기호와 함께 표시합니다.
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e

    const error = validateAmount(value, availablePoints);
    setErrors((prev) => ({ ...prev, withdrawalAmount: error || undefined }));
  };

  const handleAccountNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value.replace(/[^0-9-]/g, '');
    setAccountNumber(value);
    setSubmitStatus('idle');

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

    if (submitStatus === 'loading') return;

    setSubmitStatus('loading');

    try {
      const dto = {
        exchangeAmount: expectedAmount,
        accountNum: accountNumber.replace(/-/g, ''),
        bankCode: 'WOORI',
      };

      await requestPointExchange(dto);
      setSubmitStatus('success');

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        router.push('/mypage');
      }, 1500);
    } catch (error) {
      setSubmitStatus('error');
    }
  };

<<<<<<< HEAD
  const isButtonEnabled =
  withdrawalAmount &&
  accountNumber.trim() &&
  !errors.withdrawalAmount &&
  !errors.accountNumber;

=======
  const handleAccountNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value.replace(/[^0-9-]/g, ""); // 숫자와 하이픈만 허용합니다.
    setAccountNumber(value); // 계좌번호 상태를 갱신합니다.
    setSubmitStatus("idle"); // 입력 이후 제출 상태를 초기화합니다.

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

        // setSubmitStatus("success");
        // // 이전 타이머가 있으면 정리
        // if (timerRef.current) {
        //   clearTimeout(timerRef.current);
        // }
        // timerRef.current = setTimeout(() => {
        //   router.push("/mypage");
        // }, 1500);
        setIsExchangeModalOpen(true);
      } catch (error) {
        setSubmitStatus("error");
      }
    }
  };

  const isButtonEnabled =
    withdrawalAmount &&
    accountNumber.trim() &&
    Object.keys(errors).length === 0; // 두 필드가 채워지고 에러가 없을 때 버튼을 활성화합니다.
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e

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
<<<<<<< HEAD
                  : ''
=======
                  : ""
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e
              }
              onChange={handleAmountChange}
              aria-invalid={!!errors.withdrawalAmount}
              aria-describedby={
<<<<<<< HEAD
                errors.withdrawalAmount ? 'withdrawal-amount-error' : undefined
=======
                errors.withdrawalAmount ? "withdrawal-amount-error" : undefined
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e
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

<<<<<<< HEAD
          {/* 예정 금액 */}
=======
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e
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
<<<<<<< HEAD
            <ul className="space-y-1 text-[12px] text-gray-600">
              <li>• 환전 신청 후 처리까지 1-2 영업일이 소요됩니다.</li>
              <li>• 최소 환전 금액은 1p입니다.</li>
              <li>• 계좌 정보를 정확히 입력해주세요.</li>
              <li>• 환전 신청은 취소할 수 없습니다.</li>
            </ul>
          </div>

          {/* 메시지 */}
          {submitStatus === 'success' && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4 text-center text-sm font-medium text-green-700">
              환전 신청이 완료되었습니다.
            </div>
          )}
          {submitStatus === 'error' && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700">
              환전 신청 중 오류가 발생했습니다. 다시 시도해주세요.
=======
            <ul className="space-y-1 text-[12px] leading-relaxed text-gray-600">
              <li>• 환전 신청 후 처리까지 1-2 영업일이 소요됩니다.</li>
              <li>• 최소 환전 금액은 1p입니다.</li>
              <li>
                • 계좌 정보를 정확히 입력해주세요. 잘못된 정보로 인한 손실은
                책임지지 않습니다.
              </li>
              <li>• 환전 신청 후 취소가 불가능합니다.</li>
            </ul>
          </div>

          {submitStatus === "error" && (
            <div className="mt-4 w-full rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-center text-sm font-medium text-red-700">
                환전 신청 중 오류가 발생했습니다. 다시 시도해주세요.
              </p>
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e
            </div>
          )}
        </div>

<<<<<<< HEAD
        {/* 버튼 */}
        <div
          className="mt-6 w-full shrink-0"
          style={{
            paddingBottom: 'max(20px, env(safe-area-inset-bottom, 20px))',
=======
        <div
          className="mt-6 w-full shrink-0"
          style={{
            paddingBottom: "max(20px, env(safe-area-inset-bottom, 20px))",
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e
          }}
        >
          <Button
            onClick={handleSubmit}
<<<<<<< HEAD
            disabled={!isButtonEnabled || submitStatus === 'loading'}
          >
            {submitStatus === 'loading' ? '신청 중...' : '환전 신청'}
=======
            disabled={!isButtonEnabled}
            aria-label="환전 신청하기"
          >
            환전 신청
>>>>>>> 2d25d0af04fd5d5a526f39dc17c31e287084f26e
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
