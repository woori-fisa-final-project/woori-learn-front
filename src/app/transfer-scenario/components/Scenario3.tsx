"use client"; // 클라이언트 컴포넌트로 선언하여 입력 상태와 이벤트를 처리합니다.
import { useEffect, useMemo } from "react"; // 입력값 가공과 사이드 이펙트를 위해 React 훅을 사용합니다.
import Button from "@/components/common/Button"; // 하단의 다음 버튼 UI를 담당합니다.
import { useTransferFlow } from "@/lib/hooks/useTransferFlow"; // 시나리오 전반에서 공유하는 이체 상태를 불러옵니다.

type Scenario3Props = {
  onNext: () => void; // 계좌 입력이 유효할 때 다음 단계로 이동하는 콜백입니다.
  onBack: () => void; // 뒤로가기 버튼 클릭 시 상위 단계에 알리기 위한 콜백입니다.
};

const TARGET_ACCOUNT = "110-123-456789"; // 시나리오에서 성공 조건으로 사용하는 기준 계좌번호입니다.

export default function Scenario3({ onNext, onBack }: Scenario3Props) {
  const {
    selectedBank,
    accountNumber,
    updateAccountNumber,
    setRecipientName,
  } = useTransferFlow(); // 컨텍스트에서 선택된 은행, 입력 계좌번호, 수취인 이름 설정 함수를 가져옵니다.
  const displayBank = selectedBank ?? "국민은행"; // 은행이 선택되지 않았다면 기본 은행명을 표시합니다.

  const cleanedInput = useMemo(
    () => accountNumber.replace(/[^0-9]/g, ""), // 입력된 문자열에서 숫자만 남깁니다.
    [accountNumber]
  );

  const formattedAccount = useMemo(() => {
    const digits = cleanedInput;
    if (digits.length <= 3) return digits;
    if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 12)}`; // 단계별로 하이픈을 삽입한 문자열입니다.
  }, [cleanedInput]);

  const isValid = cleanedInput.length >= 10; // 최소 10자리 이상 입력해야 유효한 계좌번호로 간주합니다.

  useEffect(() => {
    if (!cleanedInput) {
      setRecipientName(""); // 입력이 비어 있으면 수취인 이름을 초기화합니다.
      return;
    }
    if (cleanedInput === TARGET_ACCOUNT.replace(/[^0-9]/g, "")) {
      setRecipientName("김집주"); // 목표 계좌와 일치하면 지정된 수취인 이름을 설정합니다.
    } else {
      setRecipientName("나누구"); // 일치하지 않을 때 기본 수취인 이름을 사용합니다.
    }
  }, [cleanedInput, setRecipientName]);

  const handleNext = () => {
    if (!isValid) return; // 유효한 계좌번호가 아니면 진행을 막습니다.
    // recipientName is already managed in useEffect
    onNext(); // 다음 단계로 이동하는 콜백을 호출합니다.
  };

  const handleBack = () => {
    updateAccountNumber(""); // 뒤로가기 시 입력된 계좌번호를 초기화합니다.
    setRecipientName(""); // 수취인 이름 상태도 초기화합니다.
    onBack(); // 상위 단계에서 처리하도록 콜백을 호출합니다.
  };

  return (
    <div className="flex h-full flex-col">
      {/* 안내 문구와 선택된 은행 정보를 보여주는 영역 */}
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

        {/* 계좌번호 입력 필드와 안내 문구 */}
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

      {/* 하단의 다음 단계 버튼 */}
      <div className="mt-auto space-y-[12px] pb-[24px]">
        <Button onClick={handleNext} disabled={!isValid}>
          다음
        </Button>
      </div>
    </div>
  );
}