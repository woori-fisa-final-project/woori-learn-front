import { useMemo } from "react";
import type { ScenarioStep } from "@/types/scenario";
import Overlay from "@/components/common/Overlay";
import Weebee from "@/components/scenario/character/Weebee";

type OverlayStepProps = {
  content: Record<string, any>;
  onBackgroundClick?: () => void;
  previousStep?: ScenarioStep | null;
};

// OVERLAY는 기존 공통 Overlay 컴포넌트와 동일한 디자인으로,
// 현재 시나리오 화면 위에 반투명 배경 + 말풍선을 겹쳐 보여줍니다.
// onBackgroundClick이 전달되면, 배경(어두운 영역)을 클릭했을 때 해당 콜백을 실행합니다.
export default function OverlayStep({ content, onBackgroundClick, previousStep }: OverlayStepProps) {
  const isWeebee = content.character === "wibee";
  const balloonBase =
    "relative inline-block w-[350px] bg-[#FFFCF6] border-3 border-[#E7C873] rounded-[14px] px-4 py-3 text-[16px] font-semibold leading-relaxed text-gray-800";

  // 이전 step이 위비(wibee) DIALOG 또는 OVERLAY인지 확인
  const showPreviousWeebeeDialog =
    previousStep &&
    (previousStep.type === "DIALOG" || previousStep.type === "OVERLAY") &&
    (previousStep.content as any)?.character === "wibee";

  // 랜덤 위치 결정 (컴포넌트가 마운트될 때 한 번만 결정)
  const { groupXOffset, groupYOffset } = useMemo(() => {
    // Weebee와 말풍선이 함께 위아래로 움직이는 Y 오프셋 (px 단위)
    // Weebee는 왼쪽/오른쪽으로 랜덤하게 이동하는 X 오프셋 (px 단위)
    const FRAME_HEIGHT = 844;
    const moveRange = Math.floor(FRAME_HEIGHT * 0.4); // 프레임 높이의 40% = 337px
    return {
      // X 오프셋: -40px ~ +40px 범위 (화면 중앙 기준)
      groupXOffset: Math.floor(Math.random() * 81) - 40, // -40 ~ +40
      // Y 오프셋: -337px ~ +337px 범위 (프레임 높이의 -40% ~ +40%)
      groupYOffset: Math.floor(Math.random() * (moveRange * 2 + 1)) - moveRange, // -337 ~ +337
    };
  }, []);

  // Y 오프셋을 안전한 범위로 제한 (중앙보다 조금 아래 60% 기준 translateY)
  // Weebee는 화면 중앙보다 조금 아래(60%) 지점을 기준으로 translateY로 움직임:
  // - 위로는 -20px 정도
  // - 아래로는 +40px 정도
  // 범위 안에서만 자연스럽게 둥둥 떠다니도록 함
  const TOP_LIMIT = -20;     // 위로 올라갈 수 있는 최대 한도
  const BOTTOM_LIMIT = 40;   // 아래로 내려갈 수 있는 최대 한도
  const safeYOffset = Math.max(
    Math.min(groupYOffset, BOTTOM_LIMIT),
    TOP_LIMIT
  );
  const safeXOffset = Math.max(groupXOffset, -30);


  return (
    <Overlay
      isOpen
      zIndex="z-50"
      backgroundColor="bg-black/40"
      onClose={onBackgroundClick}
    >
      <div
        className="relative w-full h-full"
        onClick={(e) => {
          // 콘텐츠 영역을 클릭해도 배경 클릭으로 처리하여 다음 단계로 진행
          e.stopPropagation();
          if (onBackgroundClick) {
            onBackgroundClick();
          }
        }}
      >
        {isWeebee ? (
          <div
            className="absolute left-1/2 top-[60%]"
            style={{
              // 화면 중앙보다 조금 아래(60%) 지점을 기준으로 배치하고, translateY로만 움직임
              transform: `translate(-50%, -50%) translateY(${safeYOffset}px)`,
            }}
          >
            {/* 말풍선 - 화면 정중앙 고정, Y wrapper 따라 위아래로 움직임 */}
            <div
              className="absolute"
              style={{
                bottom: "calc(100% + 20px)", // 캐릭터 위에 정확히 20px 간격
                left: "50%",
                transform: "translateX(-50%)", // X값은 정중앙 고정
                zIndex: 10, // 말풍선이 캐릭터 위에 표시되도록
                maxWidth: "350px",
                width: "350px",
              }}
            >
              <div className={balloonBase}>
                <p>{content.text}</p>
              </div>
            </div>
            {/* Weebee 캐릭터 (200x200) - X축만 랜덤하게 움직임, Y는 wrapper 따라감 */}
            <div
              className="relative"
              style={{
                transform: `translateX(${safeXOffset}px)`, // 캐릭터만 X축 랜덤하게 움직임
              }}
            >
              <div className="flex flex-col items-center">
                <Weebee
                  emotion={content.emotion}
                  className={`z-1 flex h-[200px] w-[200px] items-center justify-center ${
                    safeXOffset > 0 ? "-scale-x-100" : ""
                  }`}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 이전 위비 대화가 있으면 함께 표시 */}
            {showPreviousWeebeeDialog && (
              <div
                className="absolute left-1/2 top-[60%]"
                style={{
                  // 화면 중앙보다 조금 아래(60%) 지점을 기준으로 배치하고, translateY로만 움직임
                  transform: `translate(-50%, -50%) translateY(${safeYOffset}px)`,
                }}
              >
                {/* 말풍선 - 화면 정중앙 고정, Y wrapper 따라 위아래로 움직임 */}
                <div
                  className="absolute"
                  style={{
                    bottom: "calc(100% + 20px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    zIndex: 10,
                    maxWidth: "350px",
                    width: "350px",
                  }}
                >
                  <div className={balloonBase}>
                    <p>{(previousStep!.content as any).text}</p>
                  </div>
                </div>
                {/* Weebee 캐릭터 (200x200) */}
                <div
                  className="relative"
                  style={{
                    transform: `translateX(${safeXOffset}px)`,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <Weebee
                      emotion={(previousStep!.content as any).emotion}
                      className={`z-1 flex h-[200px] w-[200px] items-center justify-center ${
                        safeXOffset > 0 ? "-scale-x-100" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* user 대화창 - 화면 하단 고정 (Weebee와 완전히 독립된 fixed 레이어) */}
            <div className="fixed bottom-[50px] left-0 right-0 w-full h-[150px] z-[999] flex items-end justify-end px-4 pb-4 pointer-events-auto">
              <div className="max-w-[390px] w-full mx-auto flex flex-col items-end">
                <div className={balloonBase} style={{ height: "150px", display: "flex", alignItems: "center" }}>
                  <p>{content.text}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </Overlay>
  );
}


