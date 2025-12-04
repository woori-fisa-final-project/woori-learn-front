import axios, { AxiosRequestConfig } from "axios";
import { ApiError } from "./apiError";
import { useAuthStore } from "./tokenStorage";
import { isTokenExpired } from "./jwtUtils";

declare module "axios" {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
    _retry?: boolean;
  }
}

let refreshPromise: Promise<string> | null = null;

const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 토큰 갱신 전용 axios 인스턴스
const refreshAxios = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 토큰 갱신 함수 (동시 호출 병합)
const getRefreshToken = async (): Promise<string> => {
  // 이미 갱신 중이면 기존 Promise 재사용
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await refreshAxios.post("/auth/refresh", {}, { skipAuth: true });
      const newAccessToken = res.data.data.accessToken as string;
      useAuthStore.getState().setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      // 갱신 실패: 토큰 제거 및 로그인 화면으로 이동
      useAuthStore.getState().clearTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw new ApiError(401, "토큰 갱신 실패");
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};

    // skipAuth 옵션이면 인증 헤더 제외
    if (config.skipAuth) {
      (config.headers as any).Authorization = undefined;
      return config;
    }

    // 저장소에서 토큰 가져오기
    let token = useAuthStore.getState().accessToken;

    // 토큰이 없거나 만료되었으면 갱신 시도
    if (!token || isTokenExpired(token)) {
      try {
        token = await getRefreshToken();
      } catch (error) {
        return Promise.reject(new ApiError(401, "토큰 갱신 실패"));
      }
    }

    // 인증 헤더 설정
    if (token) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config ?? {};

    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(new ApiError(-1, "네트워크 오류가 발생했습니다."));
    }

    // 서버 에러 코드/메시지
    const code = error.response.data?.code ?? -1;
    const message = error.response.data?.message ?? "알 수 없는 오류가 발생했습니다.";

    // 401 + JWT 만료 코드만 갱신 처리
    const isJwtExpired =
      error.response &&
      error.response.status === 401 &&
      (code === 40101 || code === 40102 || code === 40103);

    if (
      isJwtExpired &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh"
    ) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await getRefreshToken();
        const retryRequest: AxiosRequestConfig = {
          ...originalRequest,
          headers: {
            ...(originalRequest.headers as any),
            Authorization: `Bearer ${newAccessToken}`,
          },
        };
        return axiosInstance(retryRequest);
      } catch (refreshError) {
        useAuthStore.getState().clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(new ApiError(401, "토큰 갱신 실패"));
      }
    }

    if (error.response) {
      const data = error.response.data?.data;
      return Promise.reject(new ApiError(code, message, data));
    }

    return Promise.reject(new ApiError(-1, "네트워크 오류가 발생했습니다."));
  }
);

export default axiosInstance;

