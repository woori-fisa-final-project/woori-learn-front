import { useQuery } from "@tanstack/react-query";
import { getAccountList } from "@/lib/api/account";
import { getRepresentativeAccount } from "@/utils/accountUtils";
import type { EducationalAccount } from "@/types/account";

/**
 * 대표 계좌 조회 훅 (React Query 캐싱)
 * - staleTime: 1분 (1분간 재조회 안 함)
 * - gcTime: 5분 (5분간 캐시 유지)
 */
export function useRepresentativeAccount() {
  return useQuery<EducationalAccount | undefined>({
    queryKey: ["representativeAccount"],
    queryFn: async () => {
      const accounts = await getAccountList();
      return getRepresentativeAccount(accounts);
    },
    staleTime: 60 * 1000, // 1분
    gcTime: 5 * 60 * 1000, // 5분
  });
}
