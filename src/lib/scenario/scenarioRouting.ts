export type ScenarioEntryRule = {
    /** stepId가 이 값 이상이면 해당 경로를 사용 */
    minStepId: number;
    /** 라우트 생성 함수 */
    path: (scenarioId: number, stepId: number) => string;
};

type ScenarioEntryMap = Record<number, ScenarioEntryRule[]>;

/**
 * 시나리오별 "진입 라우팅 규칙"을 한 곳에서 관리합니다.
 * - 높은 minStepId가 우선 적용되도록 내림차순으로 작성/유지
 */
export const SCENARIO_ENTRY_MAP: ScenarioEntryMap = {
    1: [
        {
            minStepId: 1063,
            path: (scenarioId, stepId) => `/automaticpayment-scenario?scenarioId=${scenarioId}&stepId=${stepId}`,
        },
        {
            minStepId: 1035,
            path: (scenarioId, stepId) => `/searchaccount-scenario?scenarioId=${scenarioId}&stepId=${stepId}`,
        },
        {
            minStepId: 1013,
            path: (scenarioId, stepId) => `/transfer-scenario?scenarioId=${scenarioId}&stepId=${stepId}`,
        },
        {
            minStepId: 0,
            path: (scenarioId, stepId) => `/woorimain?scenarioId=${scenarioId}&stepId=${stepId}`,
        },
    ],
};

/** 기본 fallback */
const fallbackPath = (scenarioId: number, stepId: number) =>
    `/woorimain?scenarioId=${scenarioId}&stepId=${stepId}`;

/**
 * 주어진 scenarioId/stepId에 대해 "진입 경로"를 결정합니다.
 */
export function getScenarioEntryPath(scenarioId: number, stepId: number) {
    const rules = SCENARIO_ENTRY_MAP[scenarioId];
    if (!rules || rules.length === 0) return fallbackPath(scenarioId, stepId);

    const sorted = [...rules].sort((a, b) => b.minStepId - a.minStepId);
    const rule = sorted.find((r) => stepId >= r.minStepId);
    return (rule ?? { path: fallbackPath }).path(scenarioId, stepId);
}
