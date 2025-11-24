import { SCENARIO_CONFIG } from "@/constants/scenario";
import { useEffect, useMemo, useState } from "react";
import { fetchCompletedScenarios, fetchScenarioProgress } from "./scenarioApi";

type ProgressCard = {
    scenarioId: number;
    title: string;
    progress: number;
};

const buildScenarioCards = (
    progressMap?: Map<number, number>,
    completedIdSet?: Set<number>
): ProgressCard[] => {
    return SCENARIO_CONFIG.map((cfg) => {
        const fromApi = progressMap?.get(cfg.id);
        const rate = fromApi ?? (completedIdSet?.has(cfg.id) ? 100 : 0);

        return {
            scenarioId: cfg.id,
            title: cfg.scenarioTitle,
            progress: rate,
        };
    });
};

export const useScenarioStatus = () => {
    const initialCards = useMemo(() => buildScenarioCards(), []);
    const [progressCards, setProgressCards] = useState<ProgressCard[]>(initialCards);

    // 완료된 시나리오 id 집합
    const [completedScenarioIds, setCompletedScenarioIds] = useState<Set<number>>(new Set());
    const [isLoadingStatus, setIsLoadingStatus] = useState(true);
    const [statusError, setStatusError] = useState<string | null>(null);

    // 시나리오 진행 상태/완료 여부 백엔드에서 불러오기
    useEffect(() => {
        const loadScenarioStatus = async () => {
            try {
                setIsLoadingStatus(true);

                // 진행률/완료 목록을 동시에 요청
                const [progressList, completedList] = await Promise.all([
                    fetchScenarioProgress(),
                    fetchCompletedScenarios(),
                ]);

                // 진행률: scenarioId -> progressRate Map으로 변환
                const progressMap = new Map<number, number>(
                    progressList.map((item) => [item.scenarioId, item.progressRate])
                );

                // 완료: scenarioId를 Set에 담기
                const completedIdSet = new Set<number>(
                    completedList.map((item) => item.scenarioId)
                );

                // SCENARIO_CONFIG 기준으로 진행 카드 데이터 재구성
                const updateCards = buildScenarioCards(progressMap, completedIdSet);

                // 상태 업데이트
                setProgressCards(updateCards);
                setCompletedScenarioIds(completedIdSet);
                setStatusError(null);
            } catch (e) {
                console.error(e);
                setStatusError(e instanceof Error ? e.message : "진행 상태 조회 중 오류가 발생했습니다.");
            } finally {
                setIsLoadingStatus(false);
            }
        };

        loadScenarioStatus();
    }, []);

    const progressDataMap = useMemo(
        () =>
            new Map<number, number>(
                progressCards.map((c) => [c.scenarioId, c.progress])
            ),
        [progressCards]
    );

    // 특정 시나리오가 완료되었는지 여부를 계산하는 헬퍼 함수
    const isScenarioCompleted = (scenarioId: number): boolean => {
        const progress = progressDataMap.get(scenarioId) ?? 0;
        const completedByRate = progress >= 100; // 진행률 100% 이상
        const completedByApi = completedScenarioIds.has(scenarioId); // 완료 목록에 포함
        return completedByRate || completedByApi;
    };

    // 모든 시나리오 완료 여부(추후 마무리 퀴즈 활성화 판단용)
    const allScenariosCompleted = progressCards.length > 0 && progressCards.every((card) => isScenarioCompleted(card.scenarioId));

    return {
        progressCards,
        isLoadingStatus,
        statusError,
        isScenarioCompleted,
        allScenariosCompleted
    };
};
