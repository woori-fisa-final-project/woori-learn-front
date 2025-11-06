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

