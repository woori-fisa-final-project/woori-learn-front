import type { ScenarioResponse } from "@/types/scenario";

// 실제 백엔드 연동 시 사용할 시나리오 조회 API 스켈레톤
// 주의: JSON 구조(IMAGE / DIALOG / OVERLAY / CHOICE)는 백엔드 규칙에 맞춰야 하며,
// 이 파일에서는 fetch 래핑만 담당합니다.

export async function fetchScenarioFromApi(scenarioId: number): Promise<ScenarioResponse> {
  // TODO: 실제 백엔드 URL이 정해지면 이 부분만 교체하면 됩니다.
  const res = await fetch(`/api/scenario/${scenarioId}`, {
    method: "GET",
  });

  if (!res.ok) {
    throw new Error("시나리오 정보를 불러오지 못했습니다.");
  }

  const data = (await res.json()) as ScenarioResponse;
  return data;
}





