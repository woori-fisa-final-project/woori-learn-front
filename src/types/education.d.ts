export interface ScenarioProgress {
  id: number;
  progressRate?: number;
  startedAt: string;
  updatedAt?: string;
  userId: number;
  scenarioId: number;
  stepId?: number;
}

export interface ScenarioCompleted {
  id: number;
  completedAt: string;
  userId: number;
  scenarioId: number;
}
