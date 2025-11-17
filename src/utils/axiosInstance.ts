import axios from "axios";
import { ApiError } from "./apiError";

declare module 'axios' {
  export interface AxiosRequestConfig {
    skipAuth?: boolean;
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, 
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
    // 토큰이 있다면 공통으로 붙이기
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    const refreshToken = localStorage.getItem("refreshToken");

    // 401 에러 중 access token 토큰 만료로 40101 에러 발생 시
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data?.code === 40101 &&
      !originalRequest._retry // 무한 루프 방지
    ) {
      originalRequest._retry = true;

      // refreshToken이 없으면 로그인 페이지로 이동
      if (!refreshToken) {
        window.location.href = "/login";
        return Promise.reject(
          new ApiError(error.response.data.code, error.response.data.message)
        );
      }

      try {
        // refresh token으로 access token 갱신
        const refreshResponse = await axios.post(
          "/auth/refresh",
          { refreshToken },
          { headers: { "Content-Type": "application/json" }, withCredentials: true }
        );

        const { accessToken, refreshToken: newRefreshToken } = refreshResponse.data.data;

        // 로컬스토리지 갱신
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // 기존 요청 헤더 갱신
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }

        // 기존 요청 재시도
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // refresh token도 실패하면 로그인으로
        window.location.href = "/login";
        return Promise.reject(
          new ApiError(
            401, "토큰 갱신 실패"
          )
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