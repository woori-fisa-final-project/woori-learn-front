import { useCallback } from "react";
import { useRouter } from "next/navigation";

/**
 * [시나리오 시작 전용 훅 안내]
 *
 * 어떤 페이지/컴포넌트에서든 "시나리오를 시작"할 때는
 * 이 훅에서 제공하는 startScenario 함수만 사용해야 합니다.
 *
 * 사용 예시:
 *   const { startScenario } = useScenarioTrigger();
 *   const onClick = () => startScenario(1000);
 *
 * 이렇게 하면:
 *   - 현재 화면이 어디든 상관없이
 *   - 시나리오 상세 페이지: / (education)/scenario/[scenarioId] 로 이동합니다.
 *
 * ※ 주의
 *   - 시나리오용 URL을 직접 router.push("/...") 로 작성하지 말고,
 *     항상 이 훅을 통해 진입 경로를 통일합니다.
 *   - 나중에 라우팅 구조가 바뀌더라도, 이 파일만 수정하면 전체 진입 경로가 한 번에 정리됩니다.
 */

interface UseScenarioTriggerResult {
  startScenario: (scenarioId: number) => void;
}

export function useScenarioTrigger(): UseScenarioTriggerResult {
  const router = useRouter();

  const startScenario = useCallback(
    (scenarioId: number) => {
      router.push(`/scenario/${scenarioId}`.replace(" ", ""));
    },
    [router],
  );

  return { startScenario };
}



