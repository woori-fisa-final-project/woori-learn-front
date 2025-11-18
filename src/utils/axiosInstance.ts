import axios from "axios";
import { ApiError } from "./apiError";
import { useAuthStore } from "./tokenStorage";

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

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
  (config) => {
     if (config.skipAuth) {
      config.headers.Authorization = undefined;
      config.withCredentials = false;
      return config;
    }
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
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

    // 401 에러 중 access token 토큰 만료 에러 발생 시
    if (
      error.response &&
      (error.response.status === 401 ||
      error.response.data?.code === 40101 || error.response.data?.code === 40102) &&
      !originalRequest._retry // 무한 루프 방지
    ) {
      originalRequest._retry = true;

      try {
        // refresh token으로 access token 갱신
        const refreshResponse = await axios.post(
          `/auth/refresh`,
          {},
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );

        const { accessToken } = refreshResponse.data.data;

        // access token 갱신
        const { setAccessToken } = useAuthStore.getState();
        setAccessToken(accessToken);

        // 기존 요청 헤더 갱신
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        // 기존 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh token도 실패하면 로그인으로
        window.location.href = "/login";
        return Promise.reject(
          new ApiError(401, "토큰 갱신 실패")
        );
      }
    }

    // 그 외 일반 에러
    if (error.response) {
      const { code, message, data } = error.response.data;
      return Promise.reject(new ApiError(code, message, data));
    }

    return Promise.reject(new ApiError(-1, "네트워크 오류가 발생했습니다."));
  }
);


export default axiosInstance;