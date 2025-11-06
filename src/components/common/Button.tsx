"use client";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export default function Button({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "lg",
  fullWidth = true,
  className = "",
  type = "button",
}: ButtonProps) {
  // 크기 설정
  const sizeClasses = {
    sm: "h-[50px] text-[14px] font-normal",
    md: "h-[55px] text-[16px]",
    lg: "h-[60px] text-[16px]",
  };

  // variant에 따른 색상 설정
  const getVariantClasses = () => {
    if (disabled) {
      return "bg-[rgba(100,141,219,0.4)] cursor-not-allowed";
    }
    
    if (variant === "primary") {
      return "bg-[#648DDB] cursor-pointer hover:bg-[#5480c9]";
    }
    
    if (variant === "secondary") {
      return "bg-[#f5f5f5] text-[#4a4a4a] cursor-pointer hover:bg-[#e8e8e8]";
    }
    
    return "bg-[#648DDB] cursor-pointer";
  };

  // 너비 설정
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${widthClass} ${sizeClasses[size]} rounded-[10px] text-white ${size === 'sm' ? 'font-normal' : 'font-semibold'} leading-[1.38] ${size === 'sm' ? 'tracking-[-0.42px]' : 'tracking-[-0.48px]'} transition-colors ${getVariantClasses()} ${className}`.trim()}
    >
      {children}
    </button>
  );
}

