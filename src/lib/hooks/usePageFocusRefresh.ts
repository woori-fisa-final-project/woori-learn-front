import { useEffect } from "react";

/**
 * 페이지가 다시 포커스를 받을 때 콜백을 실행하는 커스텀 훅
 *
 * 브라우저 탭 전환이나 다른 앱에서 돌아왔을 때 데이터를 새로고침하는 용도로 사용
 *
 * @param onFocus - 페이지 포커스 복귀 시 실행할 콜백 함수
 *
 * @example
 * ```tsx
 * usePageFocusRefresh(() => {
 *   console.log("페이지 포커스 복귀 - 데이터 새로고침");
 *   fetchData();
 * });
 * ```
 */
export function usePageFocusRefresh(onFocus: () => void) {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        onFocus();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onFocus]);
}
