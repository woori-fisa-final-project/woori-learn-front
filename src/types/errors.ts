/**
 * API 에러를 위한 커스텀 에러 클래스
 * HTTP 상태 코드와 백엔드 메시지를 포함합니다.
 */
export class ApiError extends Error {
  public readonly status: number;
  public readonly backendMessage: string;

  constructor(message: string, status: number, backendMessage: string = "") {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.backendMessage = backendMessage;

    // TypeScript에서 Error를 상속할 때 필요한 설정
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

/**
 * 에러가 ApiError 인스턴스인지 확인하는 타입 가드
 *
 * @param error - 확인할 에러 객체
 * @returns ApiError 여부
 *
 * @example
 * try {
 *   await someApiCall();
 * } catch (error) {
 *   if (isApiError(error)) {
 *     console.log(error.status); // 타입 안전하게 접근
 *   }
 * }
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * 에러가 AbortError 또는 CanceledError인지 확인하는 타입 가드
 * Axios의 요청 취소와 브라우저의 AbortController 모두 처리합니다.
 *
 * @param error - 확인할 에러 객체
 * @returns AbortError 또는 CanceledError 여부
 *
 * @example
 * try {
 *   await fetch(url, { signal });
 * } catch (error) {
 *   if (isAbortError(error)) {
 *     // 요청 취소는 정상적인 동작이므로 무시
 *     return;
 *   }
 * }
 */
export function isAbortError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "AbortError" || error.name === "CanceledError")
  );
}