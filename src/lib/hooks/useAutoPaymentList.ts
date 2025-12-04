import { useQuery } from "@tanstack/react-query";
import { getAutoPaymentList } from "@/lib/api/autoPayment";
import { AUTO_PAYMENT } from "@/lib/constants";
import { runPromisesInChunks } from "@/utils/promiseUtils";
import type { AutoPayment } from "@/types/autoPayment";

/**
 * 자동이체 목록 조회 훅 (React Query 캐싱 + Progressive Loading)
 * - 첫 페이지를 먼저 반환하고, 나머지는 백그라운드에서 로드
 * - staleTime: 30초 (30초간 재조회 안 함)
 */
export function useAutoPaymentList(educationalAccountId: number | undefined) {
  return useQuery<AutoPayment[]>({
    queryKey: ["autoPaymentList", educationalAccountId],
    queryFn: async () => {
      if (!educationalAccountId) {
        return [];
      }

      // 1. 첫 페이지 조회
      const firstPage = await getAutoPaymentList({
        educationalAccountId,
        page: 0,
        size: AUTO_PAYMENT.PAGE_SIZE,
      });

      // 2. 나머지 페이지 백그라운드 로드
      const totalRemainingPages = Math.max(0, firstPage.totalPages - 1);

      if (totalRemainingPages === 0) {
        return firstPage.content;
      }

      const remainingPromises = Array.from(
        { length: totalRemainingPages },
        (_, i) => () =>
          getAutoPaymentList({
            educationalAccountId,
            page: i + 1,
            size: AUTO_PAYMENT.PAGE_SIZE,
          })
      );

      const remainingResults = await runPromisesInChunks(
        remainingPromises,
        AUTO_PAYMENT.API_FETCH_CHUNK_SIZE
      );

      return [
        ...firstPage.content,
        ...remainingResults.flatMap((r) => r.content),
      ];
    },
    enabled: !!educationalAccountId, // accountId가 있을 때만 실행
    staleTime: 30 * 1000, // 30초
    gcTime: 3 * 60 * 1000, // 3분
  });
}
