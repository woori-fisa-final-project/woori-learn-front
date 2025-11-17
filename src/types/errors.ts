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
