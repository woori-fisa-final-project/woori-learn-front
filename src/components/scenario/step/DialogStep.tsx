import Weebee from "@/components/scenario/character/Weebee";
import { CHARACTER } from "@/components/scenario/constants/character";


type DialogStepProps = {
  content: Record<string, any>;
  centerAlign?: boolean;
  onBackgroundClick?: () => void;
};

// 말풍선 디자인 규칙:
// - Weebee: 좌측 정렬, 배경 #FFFCF6, 테두리 #E7C873 2px, rounded-[14px], tail 포함
// - user: 동일 스타일(상단 빈 타원형 X), 우측 정렬
export default function DialogStep({ content, centerAlign = true, onBackgroundClick }: DialogStepProps) {
  const isWeebee = content.character === CHARACTER.WEEBEE;

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

  // user 대사: 기존 말풍선 스타일 유지 (우측 정렬)
  return (
    <div 
      className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#ffffff] to-[#549AE4] cursor-pointer"
      onClick={onBackgroundClick}
    >
      <div className="flex flex-1 flex-col justify-end gap-4 min-h-screen">
        <div className="flex items-end justify-end">
          <div className="flex flex-col items-end">
            {/* 말풍선 */}
            <div className={`${balloonBase} pointer-events-none`}>
              <p>{content.text}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


