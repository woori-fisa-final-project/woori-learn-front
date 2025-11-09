"use client";

type Scenario2Props = {
  onSelect: (bankName: string) => void;
  onClose: () => void;
};

const BANK_ITEMS = [
  { name: "우리은행", image: "/images/bank1.png", disabled: true },
  { name: "농협은행", image: "/images/bank2.png", disabled: true },
  { name: "국민은행", image: "/images/bank3.png", disabled: false },
  { name: "카카오뱅크", image: "/images/bank4.png", disabled: true },
  { name: "신한은행", image: "/images/bank5.png", disabled: true },
  { name: "하나은행", image: "/images/bank6.png", disabled: true },
  { name: "기업은행", image: "/images/bank7.png", disabled: true },
  { name: "토스뱅크", image: "/images/bank8.png", disabled: true },
  { name: "새마을금고", image: "/images/bank9.png", disabled: true },
  { name: "케이뱅크", image: "/images/bank10.png", disabled: true },
  { name: "iM뱅크", image: "/images/bank11.png", disabled: true },
  { name: "부산은행", image: "/images/bank12.png", disabled: true },
];

export default function Scenario2({ onSelect, onClose }: Scenario2Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-[430px] rounded-t-[32px] bg-white shadow-[0_-24px_48px_rgba(15,23,42,0.24)]">
        <header className="flex items-center justify-between px-[20px] pt-[40px] pb-[20px]">
          <h2 className="text-[18px] font-semibold text-gray-900">은행을 선택해주세요</h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-[32px] w-[32px] items-center justify-center rounded-full bg-gray-100 text-[16px] text-gray-500"
            aria-label="닫기"
          >
            ✕
          </button>
        </header>
        <div className="max-h-[540px] overflow-y-auto px-[20px] pb-[32px]">
          <div className="grid grid-cols-3 gap-x-[20px] gap-y-[20px]">
            {BANK_ITEMS.map((bank) => (
              <button
                key={bank.name}
                type="button"
                disabled={bank.disabled}
                onClick={() => !bank.disabled && onSelect(bank.name)}
                className={`flex h-[85px] w-[108px] flex-col items-center justify-center rounded-[20px]  bg-gray-50 text-[13px] font-medium text-gray-600 transition ${
                  !bank.disabled ? "hover:border-[#2F6FD9] hover:text-[#2F6FD9]" : ""
                }`}
              >
                <img
                  src={bank.image}
                  alt={bank.name}
                  className="mb-[10px] h-[32px] w-[32px]"
                />
                {bank.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

