// src/constants/points.ts

// --------------------------------------------------------------
// 기본 포인트값
// --------------------------------------------------------------
export const DEFAULT_POINTS = 5000;

// --------------------------------------------------------------
// localStorage key
// --------------------------------------------------------------
export const POINTS_KEY = "availablePoints";

// --------------------------------------------------------------
// 보유 포인트 조회
// --------------------------------------------------------------
export const getAvailablePoints = (): number => {
  if (typeof window === "undefined") return DEFAULT_POINTS;

  const stored = localStorage.getItem(POINTS_KEY);
  if (!stored) return DEFAULT_POINTS;

  const parsed = parseInt(stored, 10);
  return isNaN(parsed) ? DEFAULT_POINTS : parsed;
};

// --------------------------------------------------------------
// 보유 포인트 저장
// --------------------------------------------------------------
export const setAvailablePoints = (points: number): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(POINTS_KEY, String(points));
};

// --------------------------------------------------------------
// 필터 타입 정의 (완전 타입 안전)
// --------------------------------------------------------------
export type PeriodType = "ALL" | "WEEK" | "MONTH" | "THREE_MONTHS";
export type SortType = "DESC" | "ASC";
export type StatusType =
  | "ALL"
  | "DEPOSIT"
  | "WITHDRAW_APPLY"
  | "WITHDRAW_SUCCESS"
  | "WITHDRAW_FAILED";

// --------------------------------------------------------------
// 필터 선택값 → 실제 enum 매핑
// --------------------------------------------------------------
export const periodEnum: Record<string, PeriodType> = {
  "전체": "ALL",
  "1주일": "WEEK",
  "1개월": "MONTH",
  "3개월": "THREE_MONTHS",
};

export const sortEnum = {
  "최신순": "DESC",
  "오래된순": "ASC",
} as const satisfies Record<string, SortType>;

export const statusEnum = {
  "전체": "ALL",
  "적립": "DEPOSIT",
  "환전 신청": "WITHDRAW_APPLY",
  "환전 완료": "WITHDRAW_SUCCESS",
  "환전 실패": "WITHDRAW_FAILED",
} as const satisfies Record<string, StatusType>;

// --------------------------------------------------------------
// 화면 표시용 텍스트 매핑
// --------------------------------------------------------------
export const viewText = {
  status: {
    ALL: "전체",
    DEPOSIT: "적립",
    WITHDRAW_APPLY: "환전 신청",
    WITHDRAW_SUCCESS: "환전 완료",
    WITHDRAW_FAILED: "환전 실패",
  },
  sort: {
    DESC: "최신순",
    ASC: "오래된순",
  },
  period: {
    WEEK: "1주일",
    MONTH: "1개월",
    THREE_MONTHS: "3개월",
    ALL: "전체",
  },
} as const;
