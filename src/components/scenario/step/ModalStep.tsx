import Overlay from "@/components/common/Overlay";

type ModalStepProps = {
  content: Record<string, any>;
  onBackgroundClick?: () => void;
};

// MODAL은 오버레이 위에 모달창처럼 표시되는 단계입니다.
// content에는 title과 설명 항목들이 포함됩니다.
export default function ModalStep({ content, onBackgroundClick }: ModalStepProps) {
  const title = (content as any).title || "";
  const items: string[] = [];
  
  // content에서 숫자 키("1", "2", "3" 등)로 된 항목들을 찾아 배열로 변환
  Object.keys(content).forEach((key) => {
    if (key !== "title" && typeof (content as any)[key] === "string") {
      items.push((content as any)[key]);
    }
  });

  return (
    <Overlay
      isOpen
      zIndex="z-[100]"
      backgroundColor="bg-black/40"
      onClose={onBackgroundClick}
    >
      <div className="bg-white rounded-[20px] w-[350px] max-w-[calc(100vw-40px)] mx-auto p-6">
        {/* 헤더: 제목, 전구 아이콘, X 버튼 */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-[20px]">💡</span>
            <h2 className="text-[20px] text-gray-700 font-semibold">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onBackgroundClick}
            className="text-gray-400 hover:text-gray-600 text-[30px] font-bold"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* 본문: bullet point 리스트 */}
        <div className="space-y-3 mb-3">
          {items.map((item, index) => (
            <div key={index} className="flex items-start gap-2 font-semibold">
              <span className="text-gray-400">•</span>
              <p className="text-[16px] text-gray-600 flex-1">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </Overlay>
  );
}

