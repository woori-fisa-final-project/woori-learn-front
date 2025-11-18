import ScenarioLayout from "@/components/scenario/ScenarioLayout";

/**
 * [시나리오 진입 루트 페이지 안내]
 *
 * 이 파일은 "교육 시나리오 기능"의 진입 루트 역할만 담당합니다.
 * 실제 시나리오 진행 화면은 /app/(education)/scenario/[scenarioId]/page.tsx 에서 렌더링됩니다.
 *
 * ──────────────────────────────────────────────────────────────
 * ▸ 시나리오 관련 주요 파일 위치
 *   1) 페이지 (Next.js App Router)
 *      - 이 파일:         src/app/(education)/scenario/page.tsx
 *      - 상세 페이지:     src/app/(education)/scenario/[scenarioId]/page.tsx
 *
 *   2) 레이아웃 / 공통 UI
 *      - 시나리오 레이아웃: src/components/scenario/ScenarioLayout.tsx
 *        → 상단 시나리오 헤더 + 100dvh 높이 + 흰색 배경 + 스크롤 규칙을 통일합니다.
 *
 *   3) 시나리오 엔진 / 트리거 훅
 *      - 시나리오 엔진:    src/lib/hooks/useScenarioEngine.ts
 *        → mock / API 전환, 현재 step 관리(start, resume, nextStep)를 담당합니다.
 *      - 시작 트리거 훅:  src/lib/hooks/useScenarioTrigger.ts
 *        → 어떤 화면이든 "startScenario(scenarioId)" 호출로 시나리오를 시작하도록 강제합니다.
 *
 *   4) 타입 / 목(mock) 데이터 / API 스켈레톤
 *      - 타입 정의:       src/lib/types/scenario.ts
 *        → StepType, StepContent, ScenarioStep 등 공통 타입 정의(백엔드 JSON 구조를 그대로 반영).
 *      - 목 데이터:       src/lib/mocks/scenarioMock.ts
 *        → USE_MOCK = true 일 때 사용하는 프론트 단독 테스트용 시나리오(예: 1001 → 1002 → 1003 흐름).
 *      - 시나리오 API:    src/lib/api/scenario.ts
 *        → 실제 백엔드 연동 시 사용할 fetch 래퍼(엔드포인트만 나중에 교체).
 *
 *   5) 렌더러 / Step 컴포넌트 / 캐릭터
 *      - 시나리오 렌더러: src/components/scenario/ScenarioRenderer.tsx
 *        → StepType 에 따라 IMAGE / DIALOG / OVERLAY / CHOICE / PRACTICE 로만 분기합니다.
 *      - Step 컴포넌트:   src/components/scenario/step/
 *        → ImageStep.tsx, DialogStep.tsx, OverlayStep.tsx, ChoiceStep.tsx, PracticeStep.tsx
 *      - 캐릭터 컴포넌트: src/components/scenario/character/Weebee.tsx
 *        → /public/assets/weebee/{emotion}.png 규칙을 지키는 Weebee 아바타입니다.
 *
 * ──────────────────────────────────────────────────────────────
 * ▸ 이 페이지의 역할
 *   - 현재는 "시나리오를 선택해 시작해 주세요" 정도의 간단한 안내만 보여줍니다.
 *   - 추후 시나리오 목록(예: '계좌이체 튜토리얼', '공과금 납부 튜토리얼' 등)을 노출하는 용도로 확장할 수 있습니다.
 *   - 비즈니스 로직은 절대 추가하지 않고, 실제 진행 로직은 모두 [scenarioId]/page.tsx + useScenarioEngine에 위임합니다.
 */
export default function ScenarioPage() {
  return (
    <ScenarioLayout>
      <div className="max-w-[390px] w-full mx-auto flex flex-col min-h-[84dvh] bg-white overflow-hidden px-[20px] pt-[30px]">
        <div className="flex flex-1 items-center justify-center">
          <p className="text-gray-500 text-sm">시나리오를 선택해 시작해 주세요.</p>
        </div>
      </div>
    </ScenarioLayout>
  );
}
