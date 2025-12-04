"use client";

import Button from "@/components/common/Button";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
import { useUserData } from "@/lib/hooks/useUserData";
import Image from "next/image";
import { useMemo, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";

type Scenario6Props = {
  onValidate: () => boolean | Promise<boolean>;
  onConfirm: () => void;
  onReenterAccount: () => void;
  onReenterAmount: () => void;
  onBackToPassword: () => void;
  onCancel: () => void;
};

export default function Scenario6({
  onValidate,
  onConfirm,
  onReenterAccount,
  onReenterAmount,
  onBackToPassword,
}: Scenario6Props) {
  // 플로우 컨텍스트에서 계좌 정보와 금액을 가져옵니다.
  const {
    selectedBank,
    accountNumber,
    recipientName,
    amount,
    sourceAccountNumber,
    enteredPassword,
    setTransferResult,
  } = useTransferFlow();
  const { userName: currentUserName } = useUserData();
  const bankName = selectedBank ?? "국민은행"; // 선택된 은행이 없으면 기본값을 사용합니다.
  const name = recipientName || "나누구"; // 수취인 이름이 없으면 기본 이름을 표시합니다.
  const displayAccount = accountNumber || "-"; // 계좌번호가 비어 있으면 대시(-)로 보여줍니다.
  const senderName = currentUserName ?? "김우리"; // 보낸 사람 이름이 없으면 기본 이름을 사용합니다.
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formattedAmount = useMemo(() => {
    if (!amount) return "0";
    return amount.toLocaleString();
  }, [amount]);

  /** 이체 API 호출 */
  const handleTransfer = async () => {
    if (loading) return;

    setLoading(true);
    setErrorMsg("");

    const isValid = await onValidate();
    if (!isValid) { return; }

    setLoading(true);

    try {
      const res = await axiosInstance.post("/education/accounts/transfer", {
        fromAccountNumber: sourceAccountNumber.replace(/\D/g, ""),
        toAccountNumber: accountNumber.replace(/\D/g, ""),
        amount: amount,
        accountPassword: enteredPassword,
        displayName: recipientName || "수취인",
      });

      console.log("이체 성공", res.data);

      // 성공한 결과를 Zustand에 저장합니다! (영수증 챙기기)
      setTransferResult(res.data.data);

      // 성공 → 시나리오7 이동
      onConfirm();
    } catch (err: any) {
      setErrorMsg(err.message || "이체 중 오류가 발생했습니다.");

      // 비밀번호 오류라면 다시 Scenario5로 되돌리기
      if (err.code === 'PASSWORD_INCORRECT') {
        setTimeout(() => {
          onBackToPassword();
        }, 1200);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* 이체 요약 영역 */}
      <section className="mt-[28px] space-y-[16px]">
        <div className="flex items-center gap-[12px]">
          <Image src="/images/bank1.png" alt="우리은행" width={52} height={52} />
          <Image src="/images/bank3.png" alt={bankName} width={52} height={52} />
        </div>

        <div>
          <p className="text-[25px] font-semibold text-gray-700">
            {name} 님에게
          </p>
          <p className="text-[26px] font-bold text-[#2F6FD9]">
            {formattedAmount}원
          </p>
          <p className="text-[25px] font-semibold text-gray-700">
            이체하시겠어요?
          </p>
          <p className="text-[18px] text-gray-500">
            {bankName} {displayAccount} 계좌로 보냅니다.
          </p>
        </div>
      </section>

      {/* 수수료 정보 */}
      <section className="mt-[28px] space-y-[12px] rounded-[20px] bg-[#F5F7FA] px-[20px] py-[20px]">
        <ConfirmRow label="수수료" value="면제" />
        <ConfirmRow label="받는 분 통장표기" value={senderName} />
        <ConfirmRow label="내 통장표기" value={name} />
      </section>

      {/* 에러 메시지 */}
      {errorMsg && (
        <div className="mt-[14px] text-center text-[14px] text-red-600">
          {errorMsg}
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="mt-auto flex gap-[12px] pb-[24px]">
        <button
          type="button"
          onClick={onReenterAccount}
          className="flex-1 rounded-[14px] bg-[#E7EFFD] py-[14px] text-[15px] font-semibold text-[#2F6FD9]"
        >
          계좌번호 재입력
        </button>
        <button
          type="button"
          onClick={onReenterAmount}
          className="flex-1 rounded-[14px] bg-[#E7EFFD] py-[14px] text-[15px] font-semibold text-[#2F6FD9]"
        >
          금액 재입력
        </button>

        <Button
          onClick={handleTransfer}
          disabled={loading}
          className="flex-1"
          fullWidth={false}
        >
          {loading ? "처리중..." : "이체"}
        </Button>
      </div>
    </div>
  );
}

type ConfirmRowProps = {
  label: string;
  value: string;
};

function ConfirmRow({ label, value }: ConfirmRowProps) {
  return (
    <div className="flex items-center justify-between text-[13px] text-gray-600">
      <span>{label}</span>
      <span className="text-[15px] font-semibold text-gray-800">{value}</span>
    </div>
  );
}