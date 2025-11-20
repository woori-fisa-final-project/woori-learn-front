/**
 * 공통 API 응답 타입 정의
 */

/**
 * Spring Data Page 구조
 * 백엔드 페이지네이션 응답에 사용되는 표준 타입
 */
export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * 기본 API 응답 래퍼
 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
