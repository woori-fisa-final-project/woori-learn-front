"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1분간 데이터를 fresh로 간주
            gcTime: 5 * 60 * 1000, // 5분간 캐시 유지 (구 cacheTime)
            refetchOnWindowFocus: false, // 창 포커스 시 자동 재조회 비활성화
            retry: 1, // 실패 시 1회만 재시도
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
