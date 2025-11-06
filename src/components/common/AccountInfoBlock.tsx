"use client";

interface AccountInfoBlockProps {
  bankName: string;
  bankLogo: string;
  accountNumber: string;
  onAccountNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

export default function AccountInfoBlock({
  bankName,
  bankLogo,
  accountNumber,
  onAccountNumberChange,
  error,
  className = "",
}: AccountInfoBlockProps) {
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

