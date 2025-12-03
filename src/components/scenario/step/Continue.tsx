"use client";

import Weebee from "@/components/scenario/character/Weebee";

type ContinueProps = {
    onBackgroundClick?: () => void;
    onRestartFromBeginning?: () => void; // 처음부터 다시하기
    onRestartFromStopPart?: () => void; // 중간부터 다시하기
};

export default function Continue({
    onBackgroundClick,
    onRestartFromBeginning,
    onRestartFromStopPart,
}: ContinueProps) {
    const balloonBase =
        "relative inline-block max-w-[350px] bg-[#FFFCF6] border-3 border-[#E7C873] rounded-[14px] px-4 py-3 text-[16px] font-semibold leading-relaxed text-gray-800";

    const BTN_SIZE = {
        md: "h-[55px] text-[16px]",
    } as const;

    const BTN_COMMON = "w-full rounded-[14px] font-bold";
    const LEFT_BTN = "bg-white text-[#1F74FF] border border-white/70";
    const RIGHT_BTN = "bg-[#1F74FF] text-white border border-[#1F74FF]";

    return (
        <div
            className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#ffffff] to-[#549AE4] cursor-pointer"
            onClick={onBackgroundClick}
        >
            <div className="flex flex-1 flex-col items-center justify-center gap-6 min-h-screen">
                {/* 말풍선 */}
                <div className="flex justify-center">
                    <div className={`${balloonBase} pointer-events-none`}>
                        <p>지난번에 멈춘 곳부터 이어서 할까요?</p>
                    </div>
                </div>

                {/* 위비 */}
                <Weebee
                    emotion="hi"
                    className="z-1 flex h-[348px] w-[348px] items-center justify-center pointer-events-none"
                />
            </div>

            {/* 버튼 영역 */}
            <div className="fixed bottom-[50px] left-0 right-0 z-[20000] flex w-full justify-center px-[20px]">
                <div className="w-full max-w-[390px] grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRestartFromBeginning?.();
                        }}
                        className={`${BTN_COMMON} ${BTN_SIZE.md} ${LEFT_BTN}`}
                    >
                        처음부터 다시하기
                    </button>

                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRestartFromStopPart?.();
                        }}
                        className={`${BTN_COMMON} ${BTN_SIZE.md} ${RIGHT_BTN}`}
                    >
                        중간부터 다시하기
                    </button>
                </div>
            </div>
        </div>
    );
}
