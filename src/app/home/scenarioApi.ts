import { CompletedScenario, ScenarioProgress } from "@/types";
import axiosInstance from "@/utils/axiosInstance";

const apiGet = async <T>(url: string): Promise<T> => {
  const { data } = await axiosInstance.get<{ data: T }>(url);
  if (data === undefined || !Object.prototype.hasOwnProperty.call(data, "data")) {
    throw new Error(`Invalid API response format for ${url}`);
  }
  return data.data as T;
};

// API 호출 함수 : 완료 시나리오 조회
export const fetchCompletedScenarios = () => apiGet<CompletedScenario[]>("/users/me/scenarios/completed");

// API 호출 함수 : 진행률 조회
export const fetchScenarioProgress = () => apiGet<ScenarioProgress[]>("/users/me/scenarios/progress");