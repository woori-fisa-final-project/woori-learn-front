import type { ScenarioStep } from "@/types/scenario";
import ImageStep from "@/components/scenario/step/ImageStep";
import DialogStep from "@/components/scenario/step/DialogStep";
import OverlayStep from "@/components/scenario/step/OverlayStep";
import ChoiceStep from "@/components/scenario/step/ChoiceStep";
import ModalStep from "@/components/scenario/step/ModalStep";

type ScenarioRendererProps = {
  step: ScenarioStep | null;
  previousStep?: ScenarioStep | null;
  onChoiceNext: (nextStepId: number) => void;
  onBackgroundClick?: () => void;
};

// ScenarioRenderer는 반드시 다음 규칙으로만 렌더링합니다.
// IMAGE → ImageStep
// DIALOG → DialogStep
// OVERLAY → OverlayStep
// CHOICE → ChoiceStep
// MODAL → ModalStep
// PRACTICE → PracticeStep
export default function ScenarioRenderer({ step, previousStep, onChoiceNext, onBackgroundClick }: ScenarioRendererProps) {
  if (!step) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-gray-400">진행 중인 시나리오가 없습니다.</p>
      </div>
    );
  }

  const { type, content } = step;

  if (type === "IMAGE") {
    return <ImageStep content={content} onBackgroundClick={onBackgroundClick} />;
  }

  if (type === "DIALOG") {
    return <DialogStep content={content} onBackgroundClick={onBackgroundClick} />;
  }

  if (type === "OVERLAY") {
    return <OverlayStep content={content} previousStep={previousStep ?? null} onBackgroundClick={onBackgroundClick} />;
  }

  if (type === "CHOICE") {
    return (
      <ChoiceStep
        content={content}
        onChoose={onChoiceNext}
        previousStep={previousStep ?? null}
      />
    );
  }

  if (type === "MODAL") {
    return <ModalStep content={content} onBackgroundClick={onBackgroundClick} />;
  }

  // PRACTICE 타입은 상위 컴포넌트에서 직접 처리합니다.
  // ScenarioRenderer는 PRACTICE를 렌더링하지 않습니다.

  return null;
}


