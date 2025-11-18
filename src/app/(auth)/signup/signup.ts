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
        params: { userId },
      },
    );
    return true;
  }catch(e){
    console.error("중복 체크 실패");
    return false;
  }
};

export const signup = async (payload: SignupParams) => {
  try{
    await axiosInstance.post("/users/signup", payload, {skipAuth: true});
    return true;
  }catch(e){
    console.error("회원가입 요청 오류", e);
    return false;
  }
};