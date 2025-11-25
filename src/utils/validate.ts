export function checkId(id: string){
    let error = "";
    if (id.length < 5 || id.length > 20) error = "아이디는 5~20자 사이여야 합니다.";
    else if (!/^[a-z]/.test(id)) error = "아이디는 영문 소문자로 시작해야 합니다.";
    else if (/[^a-zA-Z0-9]/.test(id)) error = "아이디는 영문, 숫자만 사용 가능합니다.";
    else if (!/\d/.test(id)) error = "숫자가 1자 이상 포함되어야 합니다.";
    return error;
}

export function checkPassword(password: string) {
  let error = "";

  if (password.length < 8 || password.length > 20) {
    error = "비밀번호는 8~20자 사이여야 합니다.";
  } else if (!/[A-Za-z]/.test(password)) {
    error = "영문이 1자 이상 포함되어야 합니다.";
  } else if (!/\d/.test(password)) {
    error = "숫자가 1자 이상 포함되어야 합니다.";
  } else if (!/[!@#$%^&*()~_+\-[\]{};':"\\|,.<>/?]/.test(password)) {
    error = "특수문자가 1자 이상 포함되어야 합니다.";
  }

  return error;
}