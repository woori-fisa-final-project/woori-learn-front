export type StepType =
  | "IMAGE"
  | "DIALOG"
  | "OVERLAY"
  | "CHOICE"
  | "MODAL"
  | "PRACTICE";

export interface ScenarioStep {
  id: number;
  scenarioId: number;
  type: StepType;
  content: Record<string, any>;
}

export interface ScenarioMeta {
  id: number;
  title: string;
}

export interface ScenarioData {
  meta: ScenarioMeta;
  steps: Record<number, ScenarioStep>;
}

// 백엔드 실제 응답
export interface NextStepResponse {
  code: number;
  message: string;
  data: {
    status: string;
    step: {
      scenarioId: number;
      nowStepId: number;
      type: StepType;
      quizId: number | null;
      content: Record<string, any>;
    };
    quiz: any | null;
  };
}

// 백엔드 API 응답 형태 (예상)
export interface ScenarioResponse {
  scenario: ScenarioMeta;
  steps: ScenarioStep[];
}

