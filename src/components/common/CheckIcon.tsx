"use client"; // 체크 아이콘은 주로 사용자의 상호작용 결과를 렌더링하므로 클라이언트에서 사용됩니다.

import Image from "next/image";

interface CheckIconProps {
  size?: "sm" | "md" | "lg"; // 아이콘 크기를 선택하는 옵션입니다.
  // color?: "primary" | "green" | "white";
  active?: boolean; // 향후 확장을 위한 활성화 상태 값입니다.
  className?: string; // 추가 스타일을 전달할 수 있는 클래스입니다.
  bgColor?: "primary-700" | "green-500" | string; // 배경색을 Tailwind 클래스 또는 커스텀 색상으로 지정합니다.
  iconSrc?: string; // 아이콘 이미지를 커스텀할 수 있습니다.
  iconAlt?: string; // 커스텀 아이콘 대체 텍스트입니다.
  // hoverColor?: string;
  // activeColor?: string;
}

const checkIconPath = "/images/maincheck.png"; // 체크 마크 이미지를 재사용하기 위한 경로입니다.

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-8 h-8",
  lg: "w-10 h-10",
};

const bgColorClasses = {
  "primary-700": "bg-primary-700",
  "green-500": "bg-green-500",
};

export default function CheckIcon({
  size = "md",
  // color = "white",
  active = true,
  className = "",
  bgColor = "",
  iconSrc = checkIconPath,
  iconAlt = "체크",
}: // hoverColor,
// activeColor,
CheckIconProps) {
  const bgClass = bgColor
    ? bgColor in bgColorClasses
      ? bgColorClasses[bgColor as keyof typeof bgColorClasses]
      : bgColor
    : ""; // 정의된 키가 아니면 그대로 클래스 이름으로 사용합니다.

  // const hoverClass = hoverColor ? `hover:${hoverColor}` : "";
  // const activeClass = activeColor && active ? `active:${activeColor}` : "";

  return (
    // <div
    //   className={`${bgClass} rounded-full ${sizeClasses[size]} flex items-center justify-center p-0.5 transition-colors ${hoverClass} ${activeClass} ${className}`}
    // >
    <div
      className={`${bgClass} rounded-full ${sizeClasses[size]} flex items-center justify-center p-0.5 transition-colors ${className}`}
    >
      <Image
        alt={iconAlt}
        className="h-full w-full object-contain"
        src={iconSrc} // 투명 배경 PNG 아이콘을 그대로 렌더링합니다.
        width={sizeClasses[size].includes("w-4") ? 16 : sizeClasses[size].includes("w-8") ? 32 : 40}
        height={sizeClasses[size].includes("h-4") ? 16 : sizeClasses[size].includes("h-8") ? 32 : 40}
      />
    </div>
  );
}
