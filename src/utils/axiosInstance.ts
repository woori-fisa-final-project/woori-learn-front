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

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const axiosInstance = axios.create({
  // baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  baseURL: "", // 테스트용으로 proxy 설정
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔥 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) {
      config.headers.Authorization = undefined;
      return config;
    }

    let token = useAuthStore.getState().accessToken;
    
    // 토큰이 만료되었으면 갱신 시도
    if(isTokenExpired(token)){
      try {
         // 이미 갱신 중이라면 기다림 (중복 요청 방지)
         if (!isRefreshing) {
            isRefreshing = true;
            refreshPromise = (async () => {
               const res = await axiosInstance.post("/auth/refresh", {}, { skipAuth: true });
               const newAccessToken = res.data.data.accessToken;
               useAuthStore.getState().setAccessToken(newAccessToken);
               return newAccessToken;
            })();
         }
         
         // 갱신된 토큰을 받아옴
         token = await refreshPromise;
         isRefreshing = false;
         refreshPromise = null;

      } catch (error) {
        // 리프레시 실패 시 (로그인 만료 등)
        isRefreshing = false;
        refreshPromise = null;
        // 여기서 에러를 던지면 요청 자체가 취소됨 -> 401 로그 안 찍힘 (그냥 JS 에러)
        // 상황에 따라 로그인 페이지로 보내거나 함
        useAuthStore.getState().clearTokens();
        window.location.href = "/login";
        return Promise.reject(new ApiError(401, "토큰 갱신 실패"));
      }
    }

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
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(new ApiError(-1, "네트워크 오류가 발생했습니다."));
    }

    const code = error.response.data?.code ?? -1;
    const message =
      error.response.data?.message ?? "알 수 없는 오류가 발생했습니다.";

    // 401 에러 중 access token 토큰 만료 에러 발생 시
    // 혹시 모를 경우를 대비해 남겨둠
    const isJwtExpired =
      error.response &&
      error.response.status === 401 &&
      (code === 40101 || code === 40102 || code === 40103);

    if (
      isJwtExpired &&
      !originalRequest._retry &&
      originalRequest.url !== "/auth/refresh" // 무한 루프 방지
    ) {
      originalRequest._retry = true;

      try {
        if (isRefreshing) {
          const newAccessToken = await refreshPromise;

          // 기존 요청에 새 토큰 추가
          if (originalRequest.headers) {
            originalRequest.headers[
              "Authorization"
            ] = `Bearer ${newAccessToken}`;
          }

          return axiosInstance(originalRequest); // 기존 요청 재시도
        }

        // refresh token을 이용한 요청 진행중
        isRefreshing = true;

        // refresh token으로 access token 갱신
        refreshPromise = (async () => {
          const refreshResponse = await axiosInstance.post(
            `/auth/refresh`,
            {},
            { skipAuth: true }
          );

          const { accessToken } = refreshResponse.data.data;

          // access token 갱신
          const { setAccessToken } = useAuthStore.getState();
          setAccessToken(accessToken);

          return accessToken;
        })();

        const newAccessToken = await refreshPromise;

        // 기존 요청 헤더 갱신
        if (originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        }

        // 기존 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh token도 실패하면 로그인으로
        useAuthStore.getState().clearTokens();
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        return Promise.reject(new ApiError(401, "토큰 갱신 실패"));
      } finally {
        isRefreshing = false;
        refreshPromise = null;
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
