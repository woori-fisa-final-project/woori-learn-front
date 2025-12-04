// 자동이체 일정 정보를 각 단계에서 공유하기 위해 사용하는 공통 타입이다.
export type ScheduleSummary = {
  startDate: string;
  endDate: string;
  frequency: string;
  transferDay: string;
};

