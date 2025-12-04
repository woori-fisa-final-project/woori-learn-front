/**
 * 환경별 로깅 유틸리티
 * 프로덕션 환경에서는 로그가 출력되지 않습니다.
 */

const isDevelopment = process.env.NODE_ENV === "development";

/**
 * 개발 환경에서만 일반 로그 출력
 */
export const devLog = (...args: any[]) => {
  if (isDevelopment) {
    console.log(...args);
  }
};

/**
 * 개발 환경에서만 경고 로그 출력
 */
export const devWarn = (...args: any[]) => {
  if (isDevelopment) {
    console.warn(...args);
  }
};

/**
 * 모든 환경에서 에러 로그 출력 (프로덕션에서도 모니터링 필요)
 */
export const devError = (...args: any[]) => {
  console.error(...args);
  // TODO: 프로덕션에서는 에러 모니터링 서비스로 전송
  // (예: Sentry, LogRocket 등)
};

/**
 * API 요청/응답 로그 (개발 환경에서만)
 */
export const logApiCall = (method: string, url: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[API ${method}] ${url}`, data || "");
  }
};

/**
 * API 응답 로그 (개발 환경에서만)
 */
export const logApiResponse = (status: number, url: string, data?: any) => {
  if (isDevelopment) {
    console.log(`[API Response ${status}] ${url}`, data || "");
  }
};
