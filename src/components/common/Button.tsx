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

  // 너비 설정
  const widthClass = fullWidth ? "w-full" : "";

  const fontClass = size === "sm" ? "font-normal" : "font-semibold";
  const trackingClass = size === "sm" ? "tracking-[-0.42px]" : "tracking-[-0.48px]";

  // 인라인 스타일로 색상 적용
  const getInlineStyles = (): React.CSSProperties => {
    const heightValue = size === 'sm' ? '50px' : size === 'md' ? '55px' : '60px';
    
    const baseStyle: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      visibility: 'visible',
      border: 'none',
      outline: 'none',
      boxSizing: 'border-box',
      cursor: disabled ? 'not-allowed' : 'pointer',
      height: heightValue,
      minHeight: heightValue,
      position: 'relative',
      zIndex: 1,
    };

    if (disabled) {
      if (variant === "secondary") {
        return {
          ...baseStyle,
          backgroundColor: '#e8e8e8',
          color: '#666666',
          opacity: 1,
        };
      }
      return {
        ...baseStyle,
        backgroundColor: '#b4c9e8',
        color: '#ffffff',
        opacity: 1,
      };
    }
    
    if (variant === "primary") {
      return {
        ...baseStyle,
        backgroundColor: '#648ddb',
        color: '#ffffff',
        opacity: 1,
      };
    }
    
    if (variant === "secondary") {
      return {
        ...baseStyle,
        backgroundColor: '#f5f5f5',
        color: '#4a4a4a',
        opacity: 1,
      };
    }
    
    return {
      ...baseStyle,
      backgroundColor: '#648ddb',
      color: '#ffffff',
      opacity: 1,
    };
  };

  const inlineStyles = getInlineStyles();

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={inlineStyles}
      className={`${widthClass} ${sizeClasses[size]} rounded-[10px] ${fontClass} ${trackingClass} leading-[1.38] transition-colors duration-200 ${className}`.trim().replace(/\s+/g, ' ')}
    >
      {children}
    </button>
  );
}
