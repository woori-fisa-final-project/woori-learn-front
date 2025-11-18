import { scenarioMockMap } from "./scenarioMock";
import type { NextStepResponse, StepType } from "@/types/scenario";

/**
 * 백엔드 next-step API 응답을 100% 동일하게 흉내내는 mock 함수
 * USE_MOCK = true 일 때 useScenarioEngine에서 사용됩니다.
 */
export function mockNextStep(nowStepId: number): NextStepResponse {
  const scenarioId = 1; // 필요 시 동적으로 변경 가능
  const nextId = nowStepId + 1;
  const scenario = scenarioMockMap[scenarioId as keyof typeof scenarioMockMap];
  if (!scenario) {
    throw new Error(`시나리오 ID ${scenarioId}를 찾을 수 없습니다.`);
  }
  const step = scenario.steps[nextId as keyof typeof scenario.steps];

  if (!step) {
    return {
      code: 200,
      message: "시나리오가 모두 종료되었습니다.",
      data: {
        status: "COMPLETED",
        step: {
          scenarioId,
          nowStepId: nowStepId,
          type: "MODAL",
          quizId: null,
          content: {
            title: "시나리오 종료",
            description: "튜토리얼이 완료되었습니다.",
          },
        },
        quiz: null,
      },
    };
  }

  return {
    code: 200,
    message: "요청이 성공했습니다.",
    data: {
      status: step.type === "CHOICE" ? "CHOICE_REQUIRED" : "ADVANCED",
      step: {
        scenarioId: step.scenarioId,
        nowStepId: step.id,
        type: step.type as StepType,
        quizId: null,
        content: step.content,
      },
      quiz: null,
    },
  };
}

