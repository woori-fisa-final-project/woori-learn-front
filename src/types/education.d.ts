// API 응답 데이터에 대한 타입 정의
export interface CompletedScenario {
  scenarioId: number;
  title: string;
  completedAt: string;
}

export interface ScenarioProgress {
  scenarioId: number;
  title: string;
  progressRate: number;
}