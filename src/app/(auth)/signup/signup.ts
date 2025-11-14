export interface SignupParams {
  userId: string;
  password: string;
  nickname: string;
}

export async function checkDuplicateId(userId: string): Promise<boolean> {
  try {
    const response = await fetch(`http://localhost:8080/auth/verify?userId=${userId}`);
    if (!response.ok) {
      console.error("중복 체크 실패", response.statusText);
      return false;
    }
    else{
        return true;
    }
  } catch (error) {
    console.error("중복 체크 요청 오류", error);
    return false;
  }
}

export async function signup(params: SignupParams): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8080/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      console.error("회원가입 실패", response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error("회원가입 요청 오류", error);
    return false;
  }
}