// 추후 모든 페이지가 다 끝난 뒤에 적용할 예정
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/utils/tokenStorage";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const accessToken = useAuthStore.getState().accessToken;

    // 🔥 로그인 상태가 아니면 강제로 로그인 페이지로 이동
    if (!accessToken) {
      router.replace("/login");
    }

    // 뒤로가기로 이전 페이지 캐시가 나타나는 것 방지
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.href);
    }
  }, []);

  return <>{children}</>;
}
