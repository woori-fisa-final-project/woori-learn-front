import type { NextStepApiData, ScenarioResponse } from "@/types/scenario";
import axiosInstance from "@/utils/axiosInstance";

type BaseResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export async function fetchScenarioResumeFromApi(scenarioId: number) {
  const { data } = await axiosInstance.get<BaseResponse<{ nowStepId: number }>>(
    `/users/me/scenarios/${scenarioId}`,
  );
  if (data?.data === undefined) throw new Error("Invalid resume response");
  return data.data; // { nowStepId }
}

export async function postScenarioNextStepFromApi(
  scenarioId: number,
  body: { nowStepId: number; answer?: number },
): Promise<NextStepApiData> {
  const { data } = await axiosInstance.post<BaseResponse<NextStepApiData>>(
    `/users/me/scenarios/${scenarioId}/next-step`,
    body,
  );

  if (data?.data === undefined) throw new Error("Invalid next-step response");
  return data.data;
}

// 실제 백엔드 연동 시 사용할 시나리오 조회 API 스켈레톤
// 주의: JSON 구조(IMAGE / DIALOG / OVERLAY / CHOICE)는 백엔드 규칙에 맞춰야 하며,
// 이 파일에서는 fetch 래핑만 담당합니다.

export async function fetchScenarioFromApi(scenarioId: number): Promise<ScenarioResponse> {
  const { data } = await axiosInstance.get<BaseResponse<ScenarioResponse>>(
    `/scenarios/${scenarioId}/doc`,
  );

  if (data?.data === undefined) throw new Error("Invalid scenario doc response");
  return data.data;
}