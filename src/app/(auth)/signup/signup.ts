import axiosInstance from "@/utils/axiosInstance";

export interface SignupParams {
  userId: string;
  password: string;
  nickname: string;
}

export const checkDuplicateId = async (userId: string) => {
  try{
    await axiosInstance.get(`/auth/verify`, {
        skipAuth: true,
        params: { userId }
      });
    return true;
  }catch(error: any) {
    // 409 Conflict 에러인 경우에만 중복으로 처리
    if (error.status === 409) {
      console.error("아이디 중복:", error.message);
      return false; // 중복
    }
    // 그 외 에러는 다시 throw하여 호출부에서 처리
    console.error("중복 체크 실패:", error);
    throw error;
  }
};

export const signup = async (payload: SignupParams) => {
  try{
    await axiosInstance.post("/users/signup", payload, {skipAuth: true});
    return true;
  }catch(error: any){
    console.error("회원가입 요청 오류", error);
    throw new Error("회원가입 중 알 수 없는 오류가 발생했습니다.");
  }
};