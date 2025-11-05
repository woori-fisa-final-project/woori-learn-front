export interface Scenario {
  id: number;
  title: string;
}

export interface ScenarioStep {
  id: number;
  scenario_id: number;
  type: string; // 예: 설명, 퀴즈 등
  content: Record<string, any>; // JSON 데이터
  next_step?: number;
  quiz_id?: number;
}

export interface Quiz {
  id: number;
  question: string;
  options: string; // 보기 목록 (JSON 문자열)
  answer: number; // 정답 번호
}
