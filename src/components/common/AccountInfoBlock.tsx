"use client"; // 이 컴포넌트가 입력 이벤트 등 클라이언트 전용 기능을 사용함을 명시합니다.

interface AccountInfoBlockProps {
  bankName: string; // 표시할 은행 이름입니다.
  bankLogo: string; // 은행 로고 이미지 경로입니다.
  accountNumber: string; // 현재 입력된 계좌번호 값입니다.
  onAccountNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 계좌번호 입력 변경을 상위에서 처리하기 위한 핸들러입니다.
  error?: string; // 계좌번호 유효성 검사 결과 메시지입니다.
  className?: string; // 외부에서 추가로 전달받는 스타일 클래스입니다.
}

export default function AccountInfoBlock({
  bankName,
  bankLogo,
  accountNumber,
  onAccountNumberChange,
  error,
  className = "",
}: AccountInfoBlockProps) {
  // 전달받은 계좌 정보와 오류 상태를 기반으로 입력 필드를 구성합니다.
  return (
    <div className={`w-full ${className}`}>
      <label className="block text-[16px] text-gray-600 font-medium mb-3">
        계좌 정보
      </label>

      {/* 은행명 표시 칸 */}
      <div className="flex items-center gap-[6px] w-fit border border-gray-200 rounded-[15px] px-[10px] py-[6px] mb-3 bg-white">
        <img
          src={bankLogo}
          alt={bankName}
          className="w-[15px] h-[15px] object-contain"
        />
        <span className="text-[15px] text-gray-700 font-medium">
          {bankName}
        </span>
      </div>

      {/* 계좌번호 입력 */}
      <input
        type="text"
        placeholder="계좌 번호를 적어주세요."
        value={accountNumber}
        onChange={onAccountNumberChange}
        className="w-full border border-gray-200 rounded-[10px] text-[15px] px-[14px] py-[12px] outline-none focus:ring-0 focus:border-primary-400"
        aria-invalid={!!error}
        aria-describedby={error ? "account-number-error" : undefined}
      />
      {error && (
        <p
          id="account-number-error"
          className="mt-1 text-sm text-red-500"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
}

