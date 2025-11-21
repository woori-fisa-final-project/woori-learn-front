import Overlay from "@/components/common/Overlay";

type PracticeStepProps = {
  content: Record<string, any>;
  onBackgroundClick?: () => void;
};

// PRACTICE는 연습 단계를 표시하는 컴포넌트입니다.
export default function PracticeStep({ content, onBackgroundClick }: PracticeStepProps) {
  return (
    <Overlay
      isOpen
      zIndex="z-50"
      backgroundColor="bg-black/40"
      onClose={onBackgroundClick}
    >
      <div className="bg-white rounded-[20px] w-[350px] max-w-[calc(100vw-40px)] mx-auto p-6">
        <div className="text-center">
          <h2 className="text-[20px] text-gray-700 font-semibold mb-4">연습 단계</h2>
          <p className="text-[16px] text-gray-600">
            {typeof content === "object" && "text" in content
              ? content.text
              : "연습을 시작하세요"}
          </p>
          <button
            type="button"
            onClick={onBackgroundClick}
            className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            닫기
          </button>
        </div>
      </div>
    </Overlay>
  );
}

