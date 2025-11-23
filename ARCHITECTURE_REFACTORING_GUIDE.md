# 통합 시나리오 엔진 마이그레이션 가이드

## 📋 목차
1. [아키텍처 검증 (질문 A)](#아키텍처-검증-질문-a)
2. [리팩터링 가이드 (질문 B)](#리팩터링-가이드-질문-b)
3. [단계별 마이그레이션 체크리스트](#단계별-마이그레이션-체크리스트)

---

## 아키텍처 검증 (질문 A)

### 1. 아키텍처 타당성 검증 ✅

**결론: 기술적으로 타당하며, 권장되는 구조입니다.**

#### ✅ 장점
- **단일 책임 원칙**: 하나의 엔진(`useScenarioEngine`)이 전체 흐름을 관리
- **일관된 상태 관리**: stepId 기반으로 모든 시나리오가 동일한 방식으로 진행
- **확장성**: 새로운 시나리오 추가 시 라우팅 변경 없이 mock 데이터만 추가
- **유지보수성**: 하드코딩된 라우팅 제거로 코드 중복 감소

#### ⚠️ 주의사항
- **긴 체인 처리**: 1001~1120까지 120개 step을 한 번에 로드하면 초기 로딩 시간 증가 가능
- **메모리 관리**: 모든 step을 메모리에 보관하므로 대용량 시나리오에서는 최적화 필요

---

### 2. PRACTICE UI stepId 범위 매핑 방식 검증 ✅

**결론: 유지보수 관점에서 적절하지만, 개선 여지가 있습니다.**

#### 현재 방식의 장점
- **명확한 매핑**: stepId 범위로 직접 매핑하여 직관적
- **빠른 구현**: 복잡한 로직 없이 간단한 조건문으로 처리

#### 개선 제안

**방안 1: 설정 기반 매핑 (권장)**
```typescript
// src/lib/config/practiceStepMapping.ts
export const PRACTICE_STEP_MAPPING: Record<string, {
  component: string;
  stepRange: [number, number];
}> = {
  'transfer-scenario-1': {
    component: 'Transfer/Scenario1',
    stepRange: [1001, 1005]
  },
  'searchaccount-scenario-8': {
    component: 'SearchAccount/Scenario8',
    stepRange: [1033, 1036]
  },
  // ...
};
```

**방안 2: Step content에 metadata 추가**
```typescript
// Step의 content에 practiceComponent 필드 추가
{
  id: 1033,
  type: "PRACTICE",
  content: {
    practiceComponent: "SearchAccount/Scenario8",
    // ... 기타 content
  }
}
```

**권장사항**: 초기에는 **방안 1 (설정 기반 매핑)**을 사용하고, 나중에 백엔드가 metadata를 제공하면 **방안 2**로 전환하는 것이 좋습니다.

---

### 3. 긴 단일 시나리오 체인 처리 시 주의사항

#### 성능 최적화
1. **Lazy Loading**: step 데이터를 필요할 때만 로드
   ```typescript
   // useScenarioEngine에서 step을 요청 시점에만 로드
   const loadStep = useCallback(async (stepId: number) => {
     if (!scenario?.steps[stepId]) {
       // API 호출로 해당 step만 로드
     }
   }, [scenario]);
   ```

2. **메모리 관리**: 사용하지 않는 step은 캐시에서 제거
   ```typescript
   // LRU 캐시 사용 고려
   const stepCache = new Map<number, ScenarioStep>();
   const MAX_CACHE_SIZE = 50; // 최근 50개 step만 유지
   ```

3. **청크 로딩**: 초기 로드 시 모든 step을 한 번에 가져오지 않고, 필요한 범위만 로드
   ```typescript
   // 예: 1001~1033 (이체), 1034~1049 (계좌조회) 등으로 청크 분할
   ```

#### 상태 관리
- **React Query / SWR 사용 고려**: step 데이터 캐싱 및 동기화
- **상태 정규화**: step 데이터를 Map 구조로 저장하여 O(1) 접근

#### 오류 처리
- **단계별 오류 복구**: 특정 step 로드 실패 시 이전 step으로 롤백
- **재시도 로직**: 네트워크 오류 시 자동 재시도
- **Fallback UI**: step 로드 실패 시 사용자에게 명확한 안내

---

### 4. 잠재적 문제 분석 및 해결 방안

#### 문제 1: Hydration 불일치
**원인**: SSR 시 step 데이터가 없어서 클라이언트와 서버 렌더링 결과가 다를 수 있음

**해결**:
```typescript
// page.tsx에서 클라이언트 전용으로 처리
"use client";
// 또는 Suspense로 감싸서 클라이언트에서만 렌더링
```

#### 문제 2: 라우팅 충돌
**원인**: 레거시 라우트(`/transfer-scenario`)와 통합 라우트(`/scenario/[scenarioId]`)가 공존

**해결**:
- 레거시 라우트는 deprecated 처리하고 통합 라우트로 리다이렉트
- 또는 레거시 라우트를 유지하되 내부적으로 통합 엔진 사용

#### 문제 3: 전역 상태 충돌
**원인**: `TransferFlowProvider` 등 시나리오별 Provider가 충돌할 수 있음

**해결**:
```typescript
// 통합 시나리오 페이지에서 필요한 Provider만 조건부로 래핑
{currentStep && getStepRange(currentStep.id) === 'transfer' && (
  <TransferFlowProvider>
    {/* ... */}
  </TransferFlowProvider>
)}
```

#### 문제 4: Suspense/SSR 이슈
**원인**: step 데이터가 비동기로 로드되어 SSR 시 문제 발생 가능

**해결**:
- 모든 시나리오 관련 페이지를 `"use client"`로 처리
- 또는 `dynamic` import로 클라이언트 전용 로드

---

### 5. 추천 폴더 구조

```
src/
├── app/
│   └── (education)/
│       └── scenario/
│           └── [scenarioId]/
│               └── page.tsx          # 통합 시나리오 페이지
│
├── components/
│   └── scenario/
│       ├── ScenarioLayout.tsx        # 시나리오 레이아웃
│       ├── ScenarioRenderer.tsx       # Step 타입별 렌더러
│       ├── practice/                  # ⭐ PRACTICE 컴포넌트 위치
│       │   ├── Transfer/
│       │   │   ├── Scenario1.tsx
│       │   │   ├── Scenario2.tsx
│       │   │   └── ...
│       │   ├── SearchAccount/
│       │   │   ├── Scenario8.tsx
│       │   │   ├── Scenario9.tsx
│       │   │   └── Scenario10.tsx
│       │   └── AutomaticPayment/
│       │       ├── Scenario11.tsx
│       │       └── ...
│       └── step/                      # Step 컴포넌트 (Dialog/Overlay 등)
│           ├── DialogStep.tsx
│           ├── OverlayStep.tsx
│           ├── ChoiceStep.tsx
│           ├── ModalStep.tsx
│           ├── ImageStep.tsx
│           └── PracticeStep.tsx
│
├── lib/
│   ├── hooks/
│   │   └── useScenarioEngine.ts       # 시나리오 엔진 훅
│   ├── mocks/
│   │   └── scenarioMock.ts            # Mock 데이터
│   └── config/
│       └── practiceStepMapping.ts     # ⭐ PRACTICE 매핑 설정
│
└── types/
    └── scenario.d.ts                  # 시나리오 타입 정의
```

---

## 리팩터링 가이드 (질문 B)

### ⚠️ 중요 원칙
1. **기존 파일은 절대 이동/삭제하지 않고 복사만 수행**
2. **모든 import 경로를 새 구조에 맞게 수정**
3. **다른 기능은 절대 건드리지 않음**
4. **하드코딩된 stepId 최소화, 엔진 함수 우선 사용**

---

### 단계 1: 폴더 구조 생성

#### 1-1. PRACTICE 컴포넌트 폴더 생성
```bash
# 다음 폴더들을 생성합니다
src/components/scenario/practice/Transfer
src/components/scenario/practice/SearchAccount
src/components/scenario/practice/AutomaticPayment
```

#### 1-2. 설정 파일 생성
`src/lib/config/practiceStepMapping.ts` 파일을 생성합니다.

---

### 단계 2: PRACTICE Step 매핑 설정 생성

**파일**: `src/lib/config/practiceStepMapping.ts`

```typescript
/**
 * PRACTICE 타입 step의 stepId 범위와 컴포넌트 매핑 설정
 * 
 * 사용법:
 *   const mapping = getPracticeComponent(1033);
 *   // → { component: 'SearchAccount/Scenario8', stepRange: [1033, 1036] }
 */
export interface PracticeMapping {
  component: string; // 'Transfer/Scenario1' 형식
  stepRange: [number, number]; // [시작, 끝] (포함)
}

// stepId 범위별 PRACTICE 컴포넌트 매핑
const PRACTICE_MAPPINGS: PracticeMapping[] = [
  // 이체 시나리오 (1001 ~ 1033)
  { component: 'Transfer/Scenario1', stepRange: [1001, 1002] },
  { component: 'Transfer/Scenario2', stepRange: [1003, 1004] },
  { component: 'Transfer/Scenario3', stepRange: [1005, 1008] },
  { component: 'Transfer/Scenario4', stepRange: [1009, 1012] },
  { component: 'Transfer/Scenario5', stepRange: [1013, 1016] },
  { component: 'Transfer/Scenario6', stepRange: [1017, 1026] },
  { component: 'Transfer/Scenario7', stepRange: [1027, 1033] },
  
  // 계좌조회 시나리오 (1034 ~ 1049)
  { component: 'SearchAccount/Scenario8', stepRange: [1033, 1036] },
  { component: 'SearchAccount/Scenario9', stepRange: [1037, 1044] },
  { component: 'SearchAccount/Scenario10', stepRange: [1045, 1049] },
  
  // 자동이체 시나리오 (1051 ~ 1118)
  { component: 'AutomaticPayment/Scenario11', stepRange: [1051, 1060] },
  { component: 'AutomaticPayment/Scenario12', stepRange: [1061, 1070] },
  { component: 'AutomaticPayment/Scenario13', stepRange: [1071, 1080] },
  { component: 'AutomaticPayment/Scenario14', stepRange: [1081, 1090] },
  { component: 'AutomaticPayment/Scenario15', stepRange: [1091, 1100] },
  { component: 'AutomaticPayment/Scenario16', stepRange: [1101, 1110] },
  { component: 'AutomaticPayment/Scenario17', stepRange: [1111, 1118] },
  { component: 'AutomaticPayment/Scenario18', stepRange: [1119, 1125] },
  { component: 'AutomaticPayment/Scenario19', stepRange: [1126, 1130] },
];

/**
 * stepId에 해당하는 PRACTICE 컴포넌트 경로를 반환
 * @param stepId 현재 step ID
 * @returns 컴포넌트 경로 (예: 'Transfer/Scenario1') 또는 null
 */
export function getPracticeComponent(stepId: number): PracticeMapping | null {
  return PRACTICE_MAPPINGS.find(
    mapping => stepId >= mapping.stepRange[0] && stepId <= mapping.stepRange[1]
  ) || null;
}

/**
 * stepId가 PRACTICE 타입인지 확인
 */
export function isPracticeStep(stepId: number): boolean {
  return getPracticeComponent(stepId) !== null;
}
```

**⚠️ 주의**: 위 stepId 범위는 예시입니다. 실제 백엔드에서 제공하는 stepId 범위에 맞게 수정해야 합니다.

---

### 단계 3: 레거시 컴포넌트 복사 및 경로 수정

#### 3-1. 이체 시나리오 컴포넌트 복사

**복사 대상**:
- `src/app/transfer-scenario/components/Scenario1.tsx` → `src/components/scenario/practice/Transfer/Scenario1.tsx`
- `src/app/transfer-scenario/components/Scenario2.tsx` → `src/components/scenario/practice/Transfer/Scenario2.tsx`
- ... (Scenario3 ~ Scenario7까지)

**각 파일의 import 경로 수정 예시**:

**원본** (`src/app/transfer-scenario/components/Scenario1.tsx`):
```typescript
import { useRouter } from "next/navigation";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
// ...
```

**복사본** (`src/components/scenario/practice/Transfer/Scenario1.tsx`):
```typescript
// 동일한 import 경로 유지 (절대 경로이므로 변경 불필요)
import { useRouter } from "next/navigation";
import { useTransferFlow } from "@/lib/hooks/useTransferFlow";
// ...
```

**변경이 필요한 경우**:
- 상대 경로 import가 있다면 절대 경로로 변경
- 예: `../Scenario2` → `@/components/scenario/practice/Transfer/Scenario2`

#### 3-2. 계좌조회 시나리오 컴포넌트 복사

**복사 대상**:
- `src/app/searchaccount-scenario/components/Scenario8.tsx` → `src/components/scenario/practice/SearchAccount/Scenario8.tsx`
- `src/app/searchaccount-scenario/components/Scenario9.tsx` → `src/components/scenario/practice/SearchAccount/Scenario9.tsx`
- `src/app/searchaccount-scenario/components/Scenario10.tsx` → `src/components/scenario/practice/SearchAccount/Scenario10.tsx`

**import 경로 수정**: 상대 경로가 있다면 절대 경로로 변경

#### 3-3. 자동이체 시나리오 컴포넌트 복사

**복사 대상**:
- `src/app/automaticpayment-scenario/components/Scenario11.tsx` → `src/components/scenario/practice/AutomaticPayment/Scenario11.tsx`
- ... (Scenario12 ~ Scenario19까지)

**import 경로 수정**: 상대 경로가 있다면 절대 경로로 변경

---

### 단계 4: 통합 시나리오 페이지 수정

**파일**: `src/app/(education)/scenario/[scenarioId]/page.tsx`

#### 4-1. PRACTICE 컴포넌트 동적 로딩 추가

```typescript
"use client";

import { useEffect, Suspense, lazy } from "react";
import { useParams } from "next/navigation";
import ScenarioLayout from "@/components/scenario/ScenarioLayout";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import { useScenarioBackgroundClick } from "@/lib/hooks/useScenarioBackgroundClick";
import { getPracticeComponent } from "@/lib/config/practiceStepMapping";

// PRACTICE 컴포넌트 동적 import (코드 스플리팅)
const PracticeComponentLoader = lazy(async (componentPath: string) => {
  const [category, component] = componentPath.split('/');
  const module = await import(`@/components/scenario/practice/${category}/${component}`);
  return { default: module.default };
});

export default function ScenarioDetailPage() {
  const params = useParams();
  const scenarioId = Number(params?.scenarioId);

  const { currentStep, previousStep, isLoading, error, nextStep, goToStep, resume } =
    useScenarioEngine();
  
  const isGradientBackground =
    currentStep?.type === "DIALOG" ||
    currentStep?.type === "IMAGE" ||
    currentStep?.type === "CHOICE";
  
  const handleBackgroundClick = useScenarioBackgroundClick(nextStep, currentStep);

  useEffect(() => {
    if (!Number.isNaN(scenarioId)) {
      void resume(scenarioId);
    }
  }, [resume, scenarioId]);

  const handleChoiceNext = (nextStepId: number) => {
    goToStep(nextStepId);
  };

  // PRACTICE 컴포넌트 렌더링 로직
  const renderPracticeComponent = () => {
    if (!currentStep || currentStep.type !== "PRACTICE" || !currentStep.id) {
      return null;
    }

    const mapping = getPracticeComponent(currentStep.id);
    if (!mapping) {
      console.warn(`[PRACTICE] stepId ${currentStep.id}에 대한 매핑이 없습니다.`);
      return null;
    }

    const [category, component] = mapping.component.split('/');
    
    // 동적 import 대신 직접 import (성능 최적화)
    // 또는 lazy loading 사용
    try {
      // 여기서는 동적 import를 사용하되, 실제로는 switch-case로 처리하는 것이 더 안정적
      return <PracticeComponentLoader componentPath={mapping.component} />;
    } catch (e) {
      console.error(`[PRACTICE] 컴포넌트 로드 실패: ${mapping.component}`, e);
      return null;
    }
  };

  return (
    <ScenarioLayout>
      <div
        className="relative max-w-[390px] w-full mx-auto flex flex-col min-h-[84dvh] px-[20px] pt-[30px]"
        onClick={handleBackgroundClick}
      >
        {isGradientBackground && (
          <div className="pointer-events-none absolute inset-x-0 top-0 -bottom-[60px] z-0 bg-gradient-to-b from-[#ffffff] to-[#549AE4]" />
        )}
        
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-gray-400">시나리오를 불러오는 중입니다...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-[120px] w-[120px]">
                <Image
                  src="/images/loading2.gif"
                  alt="시나리오 로딩 이미지"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-1">
            {/* PRACTICE 타입일 때 PRACTICE 컴포넌트 렌더링 */}
            {currentStep && currentStep.type === "PRACTICE" ? (
              <Suspense fallback={<div>로딩 중...</div>}>
                {renderPracticeComponent()}
              </Suspense>
            ) : (
              /* PRACTICE 타입이 아닐 때 ScenarioRenderer 사용 */
              currentStep && (
                <ScenarioRenderer
                  step={currentStep}
                  previousStep={previousStep}
                  onChoiceNext={handleChoiceNext}
                  onBackgroundClick={handleBackgroundClick}
                />
              )
            )}
          </div>
        )}
      </div>
    </ScenarioLayout>
  );
}
```

**⚠️ 문제점**: 동적 import는 문자열로 경로를 받을 수 없습니다. 더 안정적인 방법은 switch-case를 사용하는 것입니다.

#### 4-2. 개선된 PRACTICE 렌더링 (switch-case 방식) - 실제 구현

**완전한 구현 예시**:

```typescript
"use client";

import { useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import ScenarioLayout from "@/components/scenario/ScenarioLayout";
import ScenarioRenderer from "@/components/scenario/ScenarioRenderer";
import { useScenarioEngine } from "@/lib/hooks/useScenarioEngine";
import { useScenarioBackgroundClick } from "@/lib/hooks/useScenarioBackgroundClick";
import { getPracticeComponent } from "@/lib/config/practiceStepMapping";
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow";

// PRACTICE 컴포넌트 import
// 이체 시나리오
import TransferScenario1 from "@/components/scenario/practice/Transfer/Scenario1";
import TransferScenario2 from "@/components/scenario/practice/Transfer/Scenario2";
import TransferScenario3 from "@/components/scenario/practice/Transfer/Scenario3";
import TransferScenario4 from "@/components/scenario/practice/Transfer/Scenario4";
import TransferScenario5 from "@/components/scenario/practice/Transfer/Scenario5";
import TransferScenario6 from "@/components/scenario/practice/Transfer/Scenario6";
import TransferScenario7 from "@/components/scenario/practice/Transfer/Scenario7";

// 계좌조회 시나리오
import SearchAccountScenario8 from "@/components/scenario/practice/SearchAccount/Scenario8";
import SearchAccountScenario9 from "@/components/scenario/practice/SearchAccount/Scenario9";
import SearchAccountScenario10 from "@/components/scenario/practice/SearchAccount/Scenario10";

// 자동이체 시나리오
import AutomaticPaymentScenario11 from "@/components/scenario/practice/AutomaticPayment/Scenario11";
import AutomaticPaymentScenario12 from "@/components/scenario/practice/AutomaticPayment/Scenario12";
import AutomaticPaymentScenario13 from "@/components/scenario/practice/AutomaticPayment/Scenario13";
import AutomaticPaymentScenario14 from "@/components/scenario/practice/AutomaticPayment/Scenario14";
import AutomaticPaymentScenario15 from "@/components/scenario/practice/AutomaticPayment/Scenario15";
import AutomaticPaymentScenario16 from "@/components/scenario/practice/AutomaticPayment/Scenario16";
import AutomaticPaymentScenario17 from "@/components/scenario/practice/AutomaticPayment/Scenario17";
import AutomaticPaymentScenario18 from "@/components/scenario/practice/AutomaticPayment/Scenario18";
import AutomaticPaymentScenario19 from "@/components/scenario/practice/AutomaticPayment/Scenario19";

// PRACTICE 컴포넌트 맵
const PRACTICE_COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
  'Transfer/Scenario1': TransferScenario1,
  'Transfer/Scenario2': TransferScenario2,
  'Transfer/Scenario3': TransferScenario3,
  'Transfer/Scenario4': TransferScenario4,
  'Transfer/Scenario5': TransferScenario5,
  'Transfer/Scenario6': TransferScenario6,
  'Transfer/Scenario7': TransferScenario7,
  'SearchAccount/Scenario8': SearchAccountScenario8,
  'SearchAccount/Scenario9': SearchAccountScenario9,
  'SearchAccount/Scenario10': SearchAccountScenario10,
  'AutomaticPayment/Scenario11': AutomaticPaymentScenario11,
  'AutomaticPayment/Scenario12': AutomaticPaymentScenario12,
  'AutomaticPayment/Scenario13': AutomaticPaymentScenario13,
  'AutomaticPayment/Scenario14': AutomaticPaymentScenario14,
  'AutomaticPayment/Scenario15': AutomaticPaymentScenario15,
  'AutomaticPayment/Scenario16': AutomaticPaymentScenario16,
  'AutomaticPayment/Scenario17': AutomaticPaymentScenario17,
  'AutomaticPayment/Scenario18': AutomaticPaymentScenario18,
  'AutomaticPayment/Scenario19': AutomaticPaymentScenario19,
};

export default function ScenarioDetailPage() {
  const params = useParams();
  const scenarioId = Number(params?.scenarioId);

  const { currentStep, previousStep, isLoading, error, nextStep, goToStep, resume } =
    useScenarioEngine();
  
  const isGradientBackground =
    currentStep?.type === "DIALOG" ||
    currentStep?.type === "IMAGE" ||
    currentStep?.type === "CHOICE";
  
  const handleBackgroundClick = useScenarioBackgroundClick(nextStep, currentStep);

  useEffect(() => {
    if (!Number.isNaN(scenarioId)) {
      void resume(scenarioId);
    }
  }, [resume, scenarioId]);

  const handleChoiceNext = (nextStepId: number) => {
    goToStep(nextStepId);
  };

  // PRACTICE 컴포넌트 렌더링 로직
  const practiceComponent = useMemo(() => {
    if (!currentStep || currentStep.type !== "PRACTICE" || !currentStep.id) {
      return null;
    }

    const mapping = getPracticeComponent(currentStep.id);
    if (!mapping) {
      console.warn(`[PRACTICE] stepId ${currentStep.id}에 대한 매핑이 없습니다.`);
      return null;
    }

    const Component = PRACTICE_COMPONENT_MAP[mapping.component];
    if (!Component) {
      console.error(`[PRACTICE] 컴포넌트를 찾을 수 없습니다: ${mapping.component}`);
      return null;
    }

    // onPracticeNext 핸들러
    const handlePracticeNext = async () => {
      if (currentStep.id != null) {
        await nextStep(currentStep.id);
      }
    };

    // 이체 결과 핸들러 (Scenario6에서 사용)
    const handleTransferResult = async (result: "success" | "fail") => {
      if (!currentStep || currentStep.type !== "PRACTICE") return;
      
      const choices = currentStep.content?.choices as
        | { good: boolean; next: number }[]
        | undefined;

      if (!choices || choices.length === 0) {
        await nextStep(currentStep.id!);
        return;
      }

      let targetNextId: number | undefined;
      if (result === "success") {
        targetNextId = choices.find((c) => c.good)?.next;
      } else {
        targetNextId = choices.find((c) => !c.good)?.next;
      }

      if (targetNextId != null) {
        goToStep(targetNextId);
      } else {
        await nextStep(currentStep.id!);
      }
    };

    // 컴포넌트별 props 결정
    const componentProps: Record<string, any> = {
      onPracticeNext: handlePracticeNext,
    };

    // Scenario6는 onTransferResult prop이 필요
    if (mapping.component === 'Transfer/Scenario6') {
      componentProps.onTransferResult = handleTransferResult;
    }

    return <Component {...componentProps} />;
  }, [currentStep, nextStep, goToStep]);

  // TransferFlowProvider가 필요한 컴포넌트인지 확인
  const needsTransferFlow = useMemo(() => {
    if (!currentStep || currentStep.type !== "PRACTICE" || !currentStep.id) {
      return false;
    }
    const mapping = getPracticeComponent(currentStep.id);
    if (!mapping) return false;
    
    // 이체 및 자동이체 시나리오는 TransferFlowProvider 필요
    return mapping.component.startsWith('Transfer/') || 
           mapping.component.startsWith('AutomaticPayment/');
  }, [currentStep]);

  return (
    <ScenarioLayout>
      <div
        className="relative max-w-[390px] w-full mx-auto flex flex-col min-h-[84dvh] px-[20px] pt-[30px]"
        onClick={handleBackgroundClick}
      >
        {isGradientBackground && (
          <div className="pointer-events-none absolute inset-x-0 top-0 -bottom-[60px] z-0 bg-gradient-to-b from-[#ffffff] to-[#549AE4]" />
        )}
        
        {isLoading && (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-sm text-gray-400">시나리오를 불러오는 중입니다...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-[120px] w-[120px]">
                <Image
                  src="/images/loading2.gif"
                  alt="시나리오 로딩 이미지"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && (
          <div className="flex flex-1">
            {currentStep && currentStep.type === "PRACTICE" ? (
              // PRACTICE 타입일 때 PRACTICE 컴포넌트 렌더링
              needsTransferFlow ? (
                <TransferFlowProvider>
                  {practiceComponent}
                </TransferFlowProvider>
              ) : (
                practiceComponent
              )
            ) : (
              // PRACTICE 타입이 아닐 때 ScenarioRenderer 사용
              currentStep && (
                <ScenarioRenderer
                  step={currentStep}
                  previousStep={previousStep}
                  onChoiceNext={handleChoiceNext}
                  onBackgroundClick={handleBackgroundClick}
                />
              )
            )}
          </div>
        )}
      </div>
    </ScenarioLayout>
  );
}
```

**⚠️ 중요**: 위 코드는 모든 PRACTICE 컴포넌트를 한 번에 import하므로 초기 번들 크기가 커질 수 있습니다. 필요시 동적 import로 최적화할 수 있습니다.

---

### 단계 5: PRACTICE 컴포넌트 Props 통일

모든 PRACTICE 컴포넌트는 다음 props를 받도록 통일합니다:

```typescript
interface PracticeComponentProps {
  onPracticeNext: () => Promise<void> | void;
  // 기타 시나리오별 필요한 props...
}
```

**예시**: `Scenario8.tsx` 수정

```typescript
// 기존
type Scenario8Props = {
  onPracticeNext?: () => Promise<void>;
};

// 통일된 형태로 유지 (선택적 props는 그대로 유지 가능)
```

---

### 단계 6: 레거시 라우팅 제거 (선택사항)

레거시 라우트(`/transfer-scenario` 등)를 사용하는 코드를 찾아서 통합 라우트로 변경:

**변경 전**:
```typescript
router.push("/transfer-scenario?step=1");
```

**변경 후**:
```typescript
// stepId를 직접 사용하지 않고, 엔진의 resume 사용
// 또는 시나리오 시작점으로 이동
router.push(`/scenario/1000`); // scenarioId는 백엔드에서 정의된 값
```

**⚠️ 주의**: 레거시 라우트를 완전히 제거하기 전에, 모든 참조를 찾아서 변경해야 합니다.

---

### 단계 7: useScenarioEngine 개선 (필요 시)

현재 `useScenarioEngine`은 이미 잘 구현되어 있습니다. 다만, 긴 체인 처리 시 다음 개선을 고려할 수 있습니다:

#### 7-1. Step 캐싱 최적화
```typescript
// useScenarioEngine.ts에 추가
const stepCache = new Map<number, ScenarioStep>();
const MAX_CACHE_SIZE = 100;

const getCachedStep = (stepId: number): ScenarioStep | null => {
  if (stepCache.has(stepId)) {
    return stepCache.get(stepId)!;
  }
  // 캐시 미스 시 로드
  return null;
};
```

#### 7-2. 청크 로딩 지원
```typescript
// 초기 로드 시 필요한 범위만 로드
const loadScenarioChunk = async (scenarioId: number, startStepId: number, endStepId: number) => {
  // startStepId ~ endStepId 범위의 step만 로드
};
```

---

## 단계별 마이그레이션 체크리스트

### ✅ Phase 1: 준비 작업
- [ ] `src/components/scenario/practice/` 폴더 구조 생성
- [ ] `src/lib/config/practiceStepMapping.ts` 생성 및 stepId 범위 정의
- [ ] 백엔드에서 실제 stepId 범위 확인 및 매핑 설정 업데이트

### ✅ Phase 2: 컴포넌트 복사
- [ ] 이체 시나리오 컴포넌트 복사 (Scenario1 ~ 7)
- [ ] 계좌조회 시나리오 컴포넌트 복사 (Scenario8 ~ 10)
- [ ] 자동이체 시나리오 컴포넌트 복사 (Scenario11 ~ 19)
- [ ] 각 복사본의 import 경로 확인 및 수정

### ✅ Phase 3: 통합 페이지 수정
- [ ] `src/app/(education)/scenario/[scenarioId]/page.tsx`에 PRACTICE 렌더링 로직 추가
- [ ] PRACTICE 컴포넌트 import 및 매핑
- [ ] `onPracticeNext` props 전달 로직 구현

### ✅ Phase 4: 테스트
- [ ] 각 stepId 범위에서 올바른 PRACTICE 컴포넌트가 렌더링되는지 확인
- [ ] `nextStep()`, `goToStep()`, `resume()` 함수가 정상 동작하는지 확인
- [ ] 레거시 라우트와 통합 라우트 모두 테스트

### ✅ Phase 5: 레거시 라우팅 제거 (선택)
- [ ] 프로젝트 전체에서 레거시 라우트 참조 검색
- [ ] 통합 라우트로 변경
- [ ] 레거시 페이지 파일은 유지 (deprecated 표시)

### ✅ Phase 6: 문서화
- [ ] 새로운 구조에 대한 README 작성
- [ ] PRACTICE 컴포넌트 추가 가이드 작성

---

## 추가 고려사항

### 1. Provider 래핑
PRACTICE 컴포넌트가 `TransferFlowProvider` 등을 필요로 하는 경우:

```typescript
const renderPracticeComponent = () => {
  // ... mapping 로직 ...
  
  const needsTransferFlow = mapping.component.startsWith('Transfer/') || 
                           mapping.component.startsWith('AutomaticPayment/');
  
  const Component = PRACTICE_COMPONENT_MAP[mapping.component];
  
  if (needsTransferFlow) {
    return (
      <TransferFlowProvider>
        <Component onPracticeNext={...} />
      </TransferFlowProvider>
    );
  }
  
  return <Component onPracticeNext={...} />;
};
```

### 2. 에러 처리
```typescript
const renderPracticeComponent = () => {
  try {
    // ... 렌더링 로직 ...
  } catch (error) {
    console.error('[PRACTICE] 렌더링 오류:', error);
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-red-500">화면을 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }
};
```

### 3. 성능 모니터링
```typescript
// PRACTICE 컴포넌트 로드 시간 측정
const renderPracticeComponent = () => {
  const startTime = performance.now();
  // ... 렌더링 ...
  const endTime = performance.now();
  console.log(`[PERF] PRACTICE 렌더링: ${endTime - startTime}ms`);
};
```

---

## 마무리

이 가이드를 따라 단계별로 마이그레이션하면, 기존 코드를 안전하게 보존하면서 통합 시나리오 엔진으로 전환할 수 있습니다.

**중요**: 각 단계를 완료한 후 충분한 테스트를 수행하고, 문제가 발생하면 즉시 롤백할 수 있도록 Git 커밋을 자주 생성하세요.

