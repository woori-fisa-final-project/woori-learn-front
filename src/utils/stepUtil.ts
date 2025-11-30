import type { ScenarioStep } from "@/types/scenario";

/**
 * step.next 형태가 아닌 데이터도 안전하게 next id로 정규화해서 뽑기
 */
export function getNextStepId(step: ScenarioStep | null | undefined): number | null {
    if (!step) return null;

    const anyStep = step as any;
    const raw = anyStep.next ?? anyStep.nextStep ?? anyStep.next_step ?? null;

    if (raw == null) return null;
    const n = typeof raw === "number" ? raw : Number(raw);
    return Number.isFinite(n) ? n : null;
}