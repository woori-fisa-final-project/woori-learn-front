"use client"; // 버튼 클릭과 상태 변경을 처리하므로 클라이언트 전용으로 선언합니다.
import { ReactNode } from "react"; // 버튼 안에 표시할 JSX 콘텐츠를 받기 위해 ReactNode 타입을 사용합니다.

interface ButtonProps {
  children: ReactNode; // 버튼에 렌더링할 텍스트 또는 요소입니다.
  onClick?: () => void; // 버튼 클릭 시 실행할 핸들러입니다.
  disabled?: boolean; // 비활성화 상태 여부입니다.
  variant?: "primary" | "secondary"; // 스타일 테마를 구분하는 옵션입니다.
  size?: "sm" | "md" | "lg"; // 버튼의 높이와 텍스트 크기를 결정합니다.
  fullWidth?: boolean; // 버튼이 부모 너비를 모두 차지할지 여부입니다.
  className?: string; // 추가 스타일 클래스를 주입하기 위한 속성입니다.
  type?: "button" | "submit" | "reset"; // 버튼 타입을 명시합니다.
  id?: string;
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
  id,
}: ButtonProps) {
  // 크기 설정
  const sizeClasses = {
    sm: "h-[58px] text-[14px] font-normal",
    md: "h-[55px] text-[16px]",
    lg: "h-[60px] text-[16px]",
  };

  // 너비 설정
  const widthClass = fullWidth ? "w-full" : "";

  const fontClass = size === "sm" ? "font-normal" : "font-semibold"; // 버튼 크기에 따라 글꼴 두께를 변화시킵니다.
  const trackingClass =
    size === "sm" ? "tracking-[-0.42px]" : "tracking-[-0.48px]"; // 글자 간격을 크기별로 세밀하게 조정합니다.

  // 인라인 스타일로 색상 적용
  const getInlineStyles = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = { // 모든 변형에서 공통으로 사용하는 기본 스타일 속성입니다.
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      visibility: "visible",
      border: "none",
      outline: "none",
      boxSizing: "border-box",
      cursor: disabled ? "not-allowed" : "pointer",
      position: "relative",
      zIndex: 1,
    };

    if (disabled) { // 비활성화된 상태에서는 배경과 글자 색을 고정하고 커서를 금지 표시로 변경합니다.
      if (variant === "secondary") {
        return {
          ...baseStyle,
          backgroundColor: "#e8e8e8",
          color: "#666666",
          opacity: 1,
        };
      }
      return {
        ...baseStyle,
        backgroundColor: "#b4c9e8",
        color: "#ffffff",
        opacity: 1,
      };
    }

    if (variant === "primary") { // 기본(primary) 변형일 때 파란색 계열 배경과 흰색 텍스트를 적용합니다.
      return {
        ...baseStyle,
        backgroundColor: "#648ddb",
        color: "#ffffff",
        opacity: 1,
      };
    }

    if (variant === "secondary") { // 보조(secondary) 변형일 때는 밝은 회색 배경과 어두운 글자색을 적용합니다.
      return {
        ...baseStyle,
        backgroundColor: "#f5f5f5",
        color: "#4a4a4a",
        opacity: 1,
      };
    }

    return { // 정의되지 않은 변형은 기본(primary) 스타일로 처리합니다.
      ...baseStyle,
      backgroundColor: "#648ddb",
      color: "#ffffff",
      opacity: 1,
    };
  };

  const inlineStyles = getInlineStyles(); // 변형과 상태를 반영한 인라인 스타일을 계산합니다.

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={inlineStyles}
      className={`${widthClass} ${sizeClasses[size]} rounded-[10px] ${fontClass} ${trackingClass} leading-[1.38] transition-colors duration-200 ${className}`
        .trim()
        .replace(/\s+/g, " ")}
    >
      {children}
    </button>
  );
}
