import axios from "axios";
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
const isServer = typeof window === 'undefined';

const axiosInstance = axios.create({
  baseURL: "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 토큰 갱신 전용 axios 인스턴스
const refreshAxios = axios.create({

  baseURL: "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 토큰 갱신 함수
const getRefreshToken = async (): Promise<string> => {
  // 이미 갱신 중이라면 그 Promise를 재활용
  if (refreshPromise) {
    return refreshPromise;
  }

  // 갱신 시작
  refreshPromise = (async () => {
    try {
      const res = await refreshAxios.post(
        "/auth/refresh",
        {},
        { skipAuth: true }
      );
      const newAccessToken = res.data.data.accessToken;
      useAuthStore.getState().setAccessToken(newAccessToken);
      return newAccessToken;
    } catch (error) {
      // 갱신 실패 시 토큰 삭제 & 로그아웃
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


// 🔥 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    config.headers = config.headers ?? {};
    // skipAuth 옵션이 있으면 토큰 없이 요청
    if (config.skipAuth) {
      config.headers.Authorization = undefined;
      return config;
    }

    // 저장소에서 토큰 가져오기
    let token = useAuthStore.getState().accessToken;

    // 토큰이 없거나 토큰이 만료되었으면 갱신 시도
    if (!token || isTokenExpired(token)) {
      try {
        // 갱신된 토큰을 받아옴
        token = await getRefreshToken();
      } catch (error) {
        return Promise.reject(new ApiError(401, "토큰 갱신 실패"));
      }
    }
    // 토큰이 있으면 헤더에 추가
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 응답 인터셉터
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config ?? {};

    if(axios.isCancel(error)) {
      return Promise.reject(error);
    }

    if (!error.response) {
      return Promise.reject(new ApiError(-1, "네트워크 오류가 발생했습니다."));
    }

    // 서버에서 내려준 에러 코드 & 메시지
    const code = error.response.data?.code ?? -1;
    const message =
      error.response.data?.message ?? "알 수 없는 오류가 발생했습니다.";

    // 401 에러 중 access token 토큰 만료 에러 발생 시
    // 혹시 모를 경우를 대비해 남겨둠
    const isJwtExpired =
      error.response &&
      error.response.status === 401 &&
      (code === 40101 || code === 40102 || code === 40103);

    // 토큰 만료 & 재요청이 아닌 경우
    if (
      isJwtExpired &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" // 무한 루프 방지
    ) {
      originalRequest._retry = true;
      try {
        // refresh token으로 access token 갱신
        const newAccessToken = await getRefreshToken();

        // 갱신된 토큰으로 원래 요청 재시도
        const retryRequest = {
          ...originalRequest,
          headers: {
            ...originalRequest.headers,
            Authorization: `Bearer ${newAccessToken}`,
          },
        };

        return axiosInstance(retryRequest);
      } catch (refreshError) {
        // refresh token도 실패하면 로그인으로
        useAuthStore.getState().clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(new ApiError(401, "토큰 갱신 실패"));
      }
    }

    // 그 외 일반 에러
    if (error.response) {
      const data = error.response.data?.data;
      return Promise.reject(new ApiError(code, message, data));
    }

    return Promise.reject(new ApiError(-1, "네트워크 오류가 발생했습니다."));
  }
);

export default axiosInstance;