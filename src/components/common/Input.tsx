"use client";
import { useState } from "react";
import PasswordToggleIcon from "./PasswordToggleIcon";

interface InputProps {
  label?: string;
  type?: "text" | "password" | "email";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  height?: "sm" | "md"; // sm: 58px, md: 64px
  showEyeIcon?: boolean;
  className?: string;
  wrapperClassName?: string;
  inputClassName?: string;
  disabled?: boolean;
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
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === "password" && showPassword ? "text" : type;
  const heightClass = height === "sm" ? "h-[58px]" : "h-[64px]";

  const handleEyeClick = () => {
    if (type === "password") {
      setShowPassword(!showPassword);
    }
  };

  return (
    <div className={`flex flex-col gap-[8px] ${className}`}>
      {label && (
        <label className="text-[16px] text-[#4a4a4a] font-medium leading-[25px]">
          {label}
        </label>
      )}
      <div
        className={`border border-[#cbcad7] rounded-[15px] ${heightClass} ${wrapperClassName || 'w-full'} flex items-center ${
          showEyeIcon ? "justify-between" : ""
        } px-5`}
      >
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`flex-1 text-[16px] text-[#4a4a4a] font-medium placeholder:text-[#c3c3c3] outline-none ${inputClassName}`}
        />
        {showEyeIcon && (
          <PasswordToggleIcon
            showPassword={showPassword}
            onToggle={handleEyeClick}
          />
        )}
      </div>
    </div>
  );
}

