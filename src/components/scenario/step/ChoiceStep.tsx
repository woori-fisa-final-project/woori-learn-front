import type { ScenarioStep } from "@/types/scenario";
import Weebee from "@/components/scenario/character/Weebee";

type ChoiceStepProps = {
  content: Record<string, any>;
  onChoose: (nextStepId: number) => void;
  previousStep?: ScenarioStep | null;
};

// CHOICE:
// - 이전 DIALOG 내용(말풍선, 캐릭터)을 그대로 유지
// - 그 밑에 선택지를 버튼 스타일로 표시
// - 각 선택지는 "A. ~", "B. ~" 그대로 표시
// - 클릭 시 next-step 실행
export default function ChoiceStep({ content, onChoose, previousStep }: ChoiceStepProps) {
  const { choices } = content;

  const showPreviousDialog =
    previousStep &&
    (previousStep.type === "DIALOG" || previousStep.type === "OVERLAY");

  const previousContent = showPreviousDialog ? (previousStep!.content as any) : null;
  const isWeebee = previousContent?.character === "wibee";

  const balloonBase =
    "relative inline-block max-w-[350px] bg-[#FFFCF6] border-3 border-[#E7C873] rounded-[14px] px-4 py-3 text-[16px] font-semibold leading-relaxed text-gray-800";

  return (
    <div className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#ffffff] to-[#549AE4]">
      {showPreviousDialog && isWeebee && (
        // DialogStep과 완전히 동일한 레이아웃 (items-center justify-center gap-6)
        <div className="flex flex-1 flex-col items-center justify-center gap-6 min-h-screen">
          {/* 위쪽 말풍선 - DialogStep과 동일한 위치 */}
          <div className="flex justify-center">
            <div className={balloonBase}>
              <p>{previousContent.text}</p>
            </div>
          </div>

          {/* 아래 Weebee 캐릭터 - DialogStep과 동일한 위치 */}
          <Weebee
            emotion={previousContent.emotion}
            className="z-1 flex h-[348px] w-[348px] items-center justify-center"
          />
        </div>
      )}

      {showPreviousDialog && !isWeebee && (
        // DialogStep과 완전히 동일한 레이아웃 (justify-end gap-4)
        <div className="flex flex-1 flex-col justify-end gap-4 min-h-screen">
          <div className="flex items-end justify-end">
            <div className="flex flex-col items-end">
              {/* 말풍선 - DialogStep과 동일한 위치 */}
              <div className={balloonBase}>
                <p>{previousContent.text}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 선택지 버튼들 - 하단 고정 (DialogStep 내용과 겹치지 않도록 충분한 여백) */}
      <div className="fixed bottom-[60px] left-0 right-0 z-[10000] flex flex-col gap-3 px-[20px] bg-gradient-to-t from-[#549AE4] to-transparent pt-[20px]">
        {choices.map((choice: any) => (
          <button
            key={choice.text}
            type="button"
            className="relative inline-block max-w-[350px] bg-[#FFFCF6] border-3 border-[#E7C873] rounded-[14px] px-4 py-3 text-[16px] font-semibold leading-relaxed text-gray-800 cursor-pointer hover:bg-[#FFF9E6] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onChoose(choice.next);
            }}
          >
            {choice.text}
          </button>
        ))}
      </div>
    </div>
  );
}


