import Weebee from "@/components/scenario/character/Weebee";
import type { ScenarioStep } from "@/types/scenario";

type DialogStepProps = {
  content: Record<string, any>;
  centerAlign?: boolean;
  onBackgroundClick?: () => void;
  previousStep?: ScenarioStep | null;
};

// 말풍선 디자인 규칙:
// - Weebee: 좌측 정렬, 배경 #FFFCF6, 테두리 #E7C873 2px, rounded-[14px], tail 포함
// - user: 동일 스타일(상단 빈 타원형 X), 우측 정렬
export default function DialogStep({ content, centerAlign = true, onBackgroundClick, previousStep }: DialogStepProps) {
  const isWeebee = content.character === "wibee";

  // 이전 step이 위비(wibee) DIALOG 또는 OVERLAY인지 확인
  const showPreviousWeebeeDialog =
    previousStep &&
    (previousStep.type === "DIALOG" || previousStep.type === "OVERLAY") &&
    (previousStep.content as any)?.character === "wibee";

  const balloonBase =
    "relative inline-block max-w-[350px] bg-[#FFFCF6] border-3 border-[#E7C873] rounded-[14px] px-4 py-3 text-[16px] font-semibold leading-relaxed text-gray-800";

  // Weebee와 user 모두 같은 컴포넌트를 쓰지만,
  // Weebee는 중앙 레이아웃(위 말풍선, 아래 캐릭터), user는 우측 말풍선 레이아웃을 사용합니다.
  if (isWeebee) {
    const alignClass = centerAlign ? "items-center" : "items-start";
    const justifyClass = centerAlign ? "justify-center" : "justify-start";
    
    return (
      <div 
        className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#ffffff] to-[#549AE4] cursor-pointer"
        onClick={onBackgroundClick}
      >
        <div className={`flex flex-1 flex-col ${alignClass} justify-center gap-6 min-h-screen`}>
          {/* 위쪽 말풍선 */}
          <div className={`flex ${justifyClass}`}>
            <div className={`${balloonBase} pointer-events-none`}>
              <p>{content.text}</p>
            </div>
          </div>

          {/* 아래 Weebee 캐릭터 */}
          <Weebee
            emotion={content.emotion}
            className="z-1 flex h-[348px] w-[348px] items-center justify-center pointer-events-none"
          />
        </div>
      </div>
    );
  }

  // user 대사: 이전 위비 대화가 있으면 함께 표시
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#ffffff] to-[#549AE4] cursor-pointer"
      onClick={onBackgroundClick}
    >
      {/* 이전 위비 대화가 있으면 함께 표시 */}
      {showPreviousWeebeeDialog && (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 min-h-screen">
          {/* 위쪽 말풍선 */}
          <div className="flex justify-center">
            <div className={balloonBase}>
              <p>{(previousStep!.content as any).text}</p>
            </div>
          </div>

          {/* 아래 Weebee 캐릭터 */}
          <Weebee
            emotion={(previousStep!.content as any).emotion}
            className="z-1 flex h-[348px] w-[348px] items-center justify-center pointer-events-none"
          />
        </div>
      )}
      {/* user 대화창 - ChoiceStep과 동일한 위치에 하단 고정, 가운데 정렬 */}
      <div className="fixed bottom-[50px] left-0 right-0 w-full h-[150px] z-[10000] flex flex-col items-center gap-3 px-[20px] bg-gradient-to-t from-[#549AE4] to-transparent pt-[20px]">
        <div className={`${balloonBase} w-full max-w-[350px]`} style={{ height: "150px", display: "flex", alignItems: "center" }}>ㅋㅋ
          <p>{content.text}</p>
        </div>
      </div>
    </div>
  );
}


