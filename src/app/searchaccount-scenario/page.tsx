"use client";                                                                                                                             
                                                                                                                                            
  import { Suspense, useEffect, useRef } from "react";
  import { useSearchParams } from "next/navigation";
  import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";
  import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
  import OverlayStep from "@/components/scenario/step/OverlayStep";
  import ModalStep from "@/components/scenario/step/ModalStep";
  import DialogStep from "@/components/scenario/step/DialogStep";

  import ChoiceStep from "@/components/scenario/step/ChoiceStep";
  import ScenarioContainer from "./components/ScenarioContainer";
  function SearchAccountScenarioContent() {
    const searchParams = useSearchParams();
    const { currentStep, previousStep, nextStep, resume, goToStep } = useScenarioEngine();

    const lastLoadedRef = useRef<{ scenarioId: number; stepId: number } | null>(null);

    const scenarioIdParam = searchParams.get("scenarioId");
    const stepIdParam = searchParams.get("stepId");

    useEffect(() => {
      const scenarioId = Number(scenarioIdParam ?? 1);
      const stepId = stepIdParam ? Number(stepIdParam) : 1035;

      const isSame =
        lastLoadedRef.current?.scenarioId === scenarioId &&
        lastLoadedRef.current?.stepId === stepId;
      if (isSame) return;

      lastLoadedRef.current = { scenarioId, stepId };
      void resume(scenarioId, stepId);
    }, [resume, scenarioIdParam, stepIdParam]);

    useEffect(() => {
      if (currentStep) {
        console.log("[searchaccount] currentStep:", currentStep.id, currentStep.type);
      }
    }, [currentStep]);

    const handlePracticeNext = async () => {
      if (currentStep?.type === "PRACTICE" && currentStep.id != null) {
        await nextStep(currentStep.id);
      }
    };

    const handleBackgroundNext = async () => {
      if (currentStep?.id != null) {
        await nextStep(currentStep.id);
      }
    };

    const handleChoiceNext = (nextStepId: number) => {
      goToStep(nextStepId);
    };

    return (
      <>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">로딩 중...</div>}>
          <ScenarioContainer currentStep={currentStep} onPracticeNext={handlePracticeNext} />
        </Suspense>

        {currentStep && currentStep.type !== "PRACTICE" && (
          <>
            {currentStep.type === "OVERLAY" && (
              <OverlayStep
                content={currentStep.content}
                previousStep={previousStep}
                onBackgroundClick={handleBackgroundNext}
              />
            )}
            {currentStep.type === "MODAL" && (
              <ModalStep content={currentStep.content} onBackgroundClick={handleBackgroundNext} />
            )}
            {currentStep.type === "DIALOG" && (
              <DialogStep
                content={currentStep.content}
                previousStep={previousStep}
                onBackgroundClick={handleBackgroundNext}
              />
            )}
            {currentStep.type === "CHOICE" && (
              <ChoiceStep content={currentStep.content} previousStep={previousStep} onChoose={handleChoiceNext} />
            )}
          </>
        )}
      </>
    );
  }

  export default function SearchAccountScenarioPage() {
    return (
      <TransferFlowProvider>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">로딩 중...</div>}>
          <SearchAccountScenarioContent />
        </Suspense>
      </TransferFlowProvider>
    );
  }