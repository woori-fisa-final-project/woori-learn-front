export interface Scenario {
  id: number;
  title: string;
}

export interface ScenarioStep {
  id: number;
  scenarioId: number;
  type: string; // 예: 설명, 퀴즈 등
  content: Record<string, any>; // JSON 데이터
  nextStep?: number;
  quizId?: number;
}

export interface Quiz {
  id: number;
  question: string;
  options: string; // 보기 목록 (JSON 문자열)
  answer: number; // 정답 번호
}

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