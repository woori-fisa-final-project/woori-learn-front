"use client";

type Scenario1Props = {
  onOpenBankSheet: () => void;
  onContactTransfer: () => void;
};

const GUIDE_ITEMS = [
  {
    icon: "🏦",
    title: "내 계좌로 이체하기",
    description: "본인 명의 다른 계좌로 즉시 이체",
  },
  {
    icon: "🗂️",
    title: "등록된 계좌",
    description: "자주 사용하는 계좌 목록 보기",
  },
];

export default function Scenario1({ onOpenBankSheet, onContactTransfer }: Scenario1Props) {
  return (
    <div className="flex h-full flex-col">
      <section className="mt-[18px] space-y-[12px]">
        <h1 className="text-[24px] font-bold text-gray-900">어디로 이체하시겠어요?</h1>
        
      </section>

      <section className="mt-[24px] space-y-[12px]">
        <button
          type="button"
          onClick={onOpenBankSheet}
          className="flex w-full flex-col bg-white"
        >
          <div className="flex items-center justify-between">
            <span className="text-[18px] font-semibold text-gray-300">계좌번호입력</span>
            <img src="/images/camera.png" alt="카메라" className="h-[18px] w-[22px]" />
          </div>
          <div className="mt-[12px] h-[1px] w-full bg-gray-200" />
        </button>

        <div className="flex rounded-[14px] bg-gray-100 p-[4px] text-[13px] text-gray-500">
          {["추천", "자주", "내계좌"].map((label) => (
            <button
              key={label}
              type="button"
              className={`flex-1 rounded-[10px] py-[8px] ${
                label === "추천" ? "bg-white font-semibold text-gray-800 shadow-sm" : ""
              }`}
              onClick={() => {}}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="mt-[28px] flex items-center justify-between">
        <span className="text-[22px] font-semibold text-gray-500">최근입금계좌</span>
        <button type="button" className="text-[18px] text-gray-400" onClick={() => {}}>
          편집
        </button>
      </section>

      <section className="mt-[20px] flex flex-1 flex-col items-center justify-center  ">
          <img src="/images/file.png" alt="파일 아이콘" className="h-[66px] w-[54px]" />
        
        <p className="mt-[16px] text-[16px] font-semibold text-gray-400">최근 이체 내역이 없어요</p>
      </section>

      <div className="mt-[20px] flex items-center justify-center">
        <button
          type="button"
          onClick={onContactTransfer}
          className="flex h-[52px] w-full items-center justify-center gap-[8px] rounded-[14px] border border-gray-200 text-[15px] font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <span className="text-[18px] text-gray-400">+</span>
          연락처로 이체하기
        </button>
      </div>
    </div>
  );
}

