import { CompletedScenario, ScenarioProgress } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

// API 호출 함수 : 완료 시나리오 조회
export const fetchCompletedScenarios = async () => {
  const res = await axiosInstance.get<{ data: CompletedScenario[] }>("/users/me/scenarios/completed");
  return res.data.data;
};

// API 호출 함수 : 진행률 조회
export const fetchScenarioProgress = async () => {
  const res = await axiosInstance.get<{ data: ScenarioProgress[] }>("/users/me/scenarios/progress");
  return res.data.data;
};