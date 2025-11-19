/**
 * [SECURITY UPDATE] Gemini feedback 적용
 * - Replaced intrusive alert with inline error messaging
 * - Documented secure UX considerations for signup validation
 */
"use client"; // 이 페이지는 클라이언트 컴포넌트로 동작하여 상태와 브라우저 API를 활용합니다.

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import { signup, checkDuplicateId } from "./signup";
import Image from "next/image";

const backIcon = "/images/backicon.png"; // 뒤로가기 버튼에서 사용할 아이콘 경로입니다.

export default function SignupPage() {
  const router = useRouter(); // 페이지 이동을 위해 Next.js 라우터 인스턴스를 얻습니다.
  const [name, setName] = useState(""); // 사용자 이름 입력값을 저장합니다.
  const [id, setId] = useState(""); // 아이디 입력값을 관리합니다.
  const [password, setPassword] = useState(""); // 첫 번째 비밀번호 입력값을 저장합니다.
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 재입력값으로 일치 여부를 확인합니다.
  const [usernameMessage, setUsernameMessage] = useState({ type: "", text: ""});
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function checkId(id: string){
    let error = "";
    if (id.length < 5 || id.length > 20) error = "아이디는 5~20자 사이여야 합니다.";
    else if (!/^[a-z]/.test(id)) error = "아이디는 영문 소문자로 시작해야 합니다.";
    else if (!/[A-Za-z]/.test(id)) error = "영문이 1자 이상 포함되어야 합니다.";
    else if (!/\d/.test(id)) error = "숫자가 1자 이상 포함되어야 합니다.";
    return error;
  }

  function checkPassword(password: string) {
    let error = ""
    if (password.length < 8 || password.length > 20) error = "비밀번호는 8~20자 사이여야 합니다.";
    else if (!/[A-Za-z]/.test(password)) error = "영문이 1자 이상 포함되어야 합니다.";
    else if (!/\d/.test(password)) error = "숫자가 1자 이상 포함되어야 합니다.";
    else if (!/[!@#$%^&*()~_+\-[\]{};':"\\|,.<>/?]/.test(password)) error = "특수문자가 1자 이상 포함되어야 합니다.";
    return error;
  }

  const isAllFieldsFilled =
    name.trim() !== "" &&
    id.trim() !== "" &&
    password.trim() !== "" &&
    confirmPassword.trim() !== "" &&
    password === confirmPassword;

  const handleBack = () => {
    router.push("/login"); // 뒤로가기 클릭 시 로그인 페이지로 이동합니다.
  };

  const handleSignup = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setFormError("");

    if (password !== confirmPassword) {
      setFormError("비밀번호가 일치하지 않습니다. 다시 확인해주세요."); // 두 비밀번호가 다르면 경고 메시지를 표시합니다.
      setIsLoading(false);
      return;
    }

    if (isAllFieldsFilled) {
      // 아이디 검증
      const idError = checkId(id);
      
      // 아이디 검증 실패
      if(idError.length !== 0){
        setFormError(idError);
        setIsLoading(false);
        return;
      }

      // 비밀번호 입력값 검증
      const errors = checkPassword(password);

      // 검증 성공
      if (errors.length === 0) {
          const success = await signup({
          userId: id,
          password,
          nickname: name,
        });

        if (success) {
          router.push("/login");
        } else {
          setFormError("회원가입에 실패했습니다. 다시 시도해주세요.");
        }
      }

      // 검증 실패
      else{
        setFormError(errors);
      }

      setIsLoading(false);
    }
  };

  const handleDuplicateCheck = async () => {
    // 아이디 검증
    const idError = checkId(id);
      
    // 아이디 검증 실패
    if(idError.length !== 0){
        setUsernameMessage({type:"error", text: idError});
        setIsLoading(false);
        return;
    }

    if (id.trim() !== "") {
      const available = await checkDuplicateId(id);
      if(available){
        setUsernameMessage({type:"success", text: "사용 가능한 아이디입니다."});
      }
      else{
        setUsernameMessage({type:"error", text: "이미 사용 중인 아이디입니다."});
      }
    }
  };

  const isIdFilled = id.trim() !== ""; // 아이디가 입력되었는지 여부를 저장해 버튼 활성화를 제어합니다.

  return (
    <main className="pt-[30px] flex min-h-screen items-start justify-center overflow-x-hidden bg-white">
      <div className="w-full max-w-[min(100%,430px)] px-5 sm:max-w-[480px] md:max-w-[560px] lg:max-w-3xl">
        {/* 상단 헤더: 뒤로가기 버튼과 페이지 제목을 보여줍니다. */}
        <div className="flex w-full items-center gap-2">
          <button
            onClick={handleBack}
            className="h-[7px] w-3.5 flex items-center justify-center -rotate-90"
            aria-label="뒤로가기"
          >
            <Image alt="뒤로가기" className="h-[7px] w-3.5 object-contain" src={backIcon} width={14} height={7} />
          </button>
          <h1 className="text-[20px] font-medium leading-[1.38] tracking-[-0.6px] text-gray-700">
            회원가<span className="tracking-[-0.8px]">입</span>
          </h1>
        </div>

        {/* 이름 입력 필드: name 상태를 갱신하여 서버 전송에 대비합니다. */}
        <Input
          label="이름"
          type="text"
          placeholder="이름을 입력해주세요"
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-[50px]"
        />

        {/* 아이디 입력과 중복 확인 버튼 영역입니다. */}
        <div className="mt-12 flex w-full flex-col gap-2">
          <label className="text-[16px] font-medium leading-[25px] text-gray-600">아이디</label>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <Input
                type="text"
                placeholder="아이디를 입력해주세요"
                value={id}
                onChange={(event) => setId(event.target.value)}
                wrapperClassName="w-full"
              />
            </div>
            {/* 중복 확인 버튼: 아이디 입력 시에만 활성화합니다. */}
            <Button
              onClick={handleDuplicateCheck}
              disabled={!isIdFilled}
              size="sm"
              fullWidth={false}
              className="!min-w-[70px] w-auto px-3 shrink-0 whitespace-nowrap"
            >
              중복 확인
            </Button>
          </div>
        </div>

        {/* 아이디 중복 체크 메시지 */}
        {usernameMessage.text && (
          <p className={`text-sm mt-2 text-[14px] ${
            usernameMessage.type === "error" ? "text-red-500" : "text-green-600"
          }`}>
            {usernameMessage.text}
          </p>
        )}

        {/* 아이디 조건 안내 */}
        <div className="mt-2 space-y-1 text-sm text-gray-500">
          <p>5~20자 이내, 영문 소문자로 시작해 숫자와 영문을 포함해서 만들어 주세요. (특수문자 사용 불가)</p>
        </div>

        {/* 비밀번호 입력 필드: showEyeIcon으로 가시성을 조절합니다. */}
        <Input
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          showEyeIcon
          className="mt-5"
        />

        {/* 비밀번호 조건 안내 */}
        <div className="mt-2 space-y-1 text-sm text-gray-500">
          <p>8~20자 이내, 숫자와 영문 및 특수문자를 포함해 주세요.</p>
        </div>

        {/* 비밀번호 확인 필드: confirmPassword 상태를 갱신합니다. */}
        <Input
          label="비밀번호 재입력"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          showEyeIcon
          className="mt-5"
        />

        {/* 폼 전체 에러 메시지 (회원가입 버튼 위) */}
        {formError && (
          <p className="mt-3 text-[14px] text-red-500 font-medium">
            {formError}
          </p>
        )}

        {/* 모든 입력이 유효할 때만 활성화되는 가입 버튼입니다. */}
        <div className="mt-5">
          <Button onClick={handleSignup} disabled={!isAllFieldsFilled || isLoading}>
            회원가입
          </Button>
        </div>

        {/* 기존 계정 보유자를 위한 로그인 링크 안내입니다. */}
        <div className="mt-5 text-center">
          <p className="text-[16px] leading-[25px] tracking-[0.08px]">
            <span className="text-gray-400">이미 계정이 있으신가요? </span>
            <Link
              href="/login"
              className="font-semibold text-primary-400 underline decoration-solid underline-offset-2 hover:text-[#2677cc]"
            >
              로그인하기
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

