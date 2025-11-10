"use client";
import { useEffect, useMemo } from "react";
import Button from "@/components/common/Button";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";

type Scenario3Props = {
  onNext: () => void;
  onBack: () => void;
};

const TARGET_ACCOUNT = "110-123-456789";

export default function Scenario3({ onNext, onBack }: Scenario3Props) {
  const {
    selectedBank,
    accountNumber,
    updateAccountNumber,
    setRecipientName,
  } = useTransferFlow();
  const displayBank = selectedBank ?? "국민은행";

  const cleanedInput = useMemo(
    () => accountNumber.replace(/[^0-9]/g, ""),
    [accountNumber]
  );

  const formattedAccount = useMemo(() => {
    const digits = cleanedInput;
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 12)}`;
  }, [cleanedInput]);

  const isValid = cleanedInput.length >= 10;

  useEffect(() => {
    if (!cleanedInput) {
      setRecipientName("");
      return;
    }
    if (cleanedInput === TARGET_ACCOUNT.replace(/[^0-9]/g, "")) {
      setRecipientName("김집주");
    } else {
      setRecipientName("나누구");
    }
  }, [cleanedInput, setRecipientName]);

  const handleNext = () => {
    if (!isValid) return;
    if (cleanedInput === TARGET_ACCOUNT.replace(/[^0-9]/g, "")) {
      setRecipientName("김집주");
    } else {
      setRecipientName("나누구");
    }
    onNext();
  };

  const handleBack = () => {
    updateAccountNumber("");
    setRecipientName("");
    onBack();
  };

  return (
    <div className="flex h-full flex-col">
      <section className="mt-[32px] space-y-[24px]">
        <div className="flex items-center justify-between">
          <h1 className="text-[22px] font-bold text-gray-900">
            계좌번호를 입력해 주세요
          </h1>
        </div>

          <button type="button" className="flex w-full items-center justify-between text-left">
            <div className="flex items-center gap-[12px]">
              <img
                src="/images/bank3.png"
                alt={displayBank}
                className="h-[24px] w-[24px]"
              />
              <span className="text-[15px] font-semibold text-gray-800">
                {displayBank}
              </span>
            </div>
          </button>

        <div className="space-y-[12px]">
          <div className="border-b border-gray-300 pb-[4px]">
            <input
              value={formattedAccount}
              onChange={(event) => updateAccountNumber(event.target.value)}
              placeholder="입력"
              className="w-full text-[16px] text-gray-900 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <p className="text-[13px] text-gray-400">110-123-456789로 작성해주세요.</p>
        </div>
      </section>

      <div className="mt-auto space-y-[12px] pb-[24px]">
        <Button onClick={handleNext} disabled={!isValid}>
          다음
        </Button>
      </div>
    </div>
  );
}