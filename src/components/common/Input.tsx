"use client"; // 입력값과 패스워드 토글을 관리하므로 클라이언트 전용으로 선언합니다.
import { useState } from "react"; // 비밀번호 표시 여부를 상태로 관리하기 위해 useState를 사용합니다.
import PasswordToggleIcon from "./PasswordToggleIcon"; // 비밀번호 가시성 토글 아이콘을 재사용합니다.

interface InputProps {
  label?: string; // 입력 필드 위에 표시할 레이블 텍스트입니다.
  type?: "text" | "password" | "email"; // 입력 타입을 결정합니다.
  placeholder?: string; // 입력 안내 문구입니다.
  value: string; // 현재 입력값입니다.
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // 값 변경 시 호출할 핸들러입니다.
  height?: "sm" | "md"; // sm: 58px, md: 64px
  showEyeIcon?: boolean; // 비밀번호 표시/숨김 아이콘을 보여줄지 여부입니다.
  className?: string; // 외부에서 감싸는 div에 추가할 클래스입니다.
  wrapperClassName?: string; // 입력 필드 wrapper에 추가할 클래스입니다.
  inputClassName?: string; // <input> 요소에 추가할 클래스입니다.
  disabled?: boolean; // 입력 비활성화 여부입니다.
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export default function Input({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  height = "md",
  showEyeIcon = false,
  className = "",
  wrapperClassName = "",
  inputClassName = "",
  disabled = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedBy,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 가시성 상태를 추적합니다.
  const inputType = type === "password" && showPassword ? "text" : type; // 패스워드 입력 시 토글 상태에 따라 타입을 변경합니다.
  const heightClass = height === "sm" ? "h-[58px]" : "h-[64px]"; // 주어진 옵션에 따른 높이 클래스를 계산합니다.

  const handleEyeClick = () => {
    if (type === "password") {
      setShowPassword(!showPassword); // 비밀번호 입력일 때만 토글을 허용합니다.
    }
  };

  return (
    <div className={`flex flex-col gap-[8px] ${className}`}>
      {label && (
        <label className="text-[16px] text-gray-600 font-medium leading-[25px]">
          {label}
        </label>
      )}
      <div
        className={`border border-gray-300 rounded-[15px] ${heightClass} ${wrapperClassName || 'w-full'} flex items-center ${
          showEyeIcon ? "justify-between" : ""
        } px-5 focus-within:border-gray-300`}
      >
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          className={`flex-1 text-[16px] text-gray-600 font-medium placeholder:text-gray-400 outline-none focus:outline-none focus:ring-0 ${inputClassName}`}
        />
        {showEyeIcon && ( // 비밀번호 입력일 때 토글 아이콘을 함께 렌더링합니다.
          <PasswordToggleIcon
            showPassword={showPassword}
            onToggle={handleEyeClick}
          />
        )}
      </div>
    </div>
  );
}

