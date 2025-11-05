export interface ScenarioProgress {
  id: number;
  progress_rate?: number;
  started_at: string;
  updated_at?: string;
  user_id: number;
  scenario_id: number;
  step_id?: number;
}

export interface ScenarioCompleted {
  id: number;
  completed_at: string;
  user_id: number;
  scenario_id: number;
}
