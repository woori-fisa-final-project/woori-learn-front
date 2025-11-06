"use client";

interface CheckIconProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "green" | "white";
  active?: boolean;
  className?: string;
  bgColor?: "primary-700" | "green-500" | string;
  hoverColor?: string;
  activeColor?: string;
}

const checkIconPath = "/images/maincheck.png";

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const bgColorClasses = {
  "primary-700": "bg-primary-700",
  "green-500": "bg-green-500",
};

export default function CheckIcon({
  size = "md",
  color = "white",
  active = true,
  className = "",
  bgColor = "primary-700",
  hoverColor,
  activeColor,
}: CheckIconProps) {
  const bgClass =
    bgColor in bgColorClasses
      ? bgColorClasses[bgColor as keyof typeof bgColorClasses]
      : bgColor;

  const hoverClass = hoverColor ? `hover:${hoverColor}` : "";
  const activeClass = activeColor && active ? `active:${activeColor}` : "";

  return (
    <div
      className={`${bgClass} rounded-full ${sizeClasses[size]} flex items-center justify-center p-0.5 transition-colors ${hoverClass} ${activeClass} ${className}`}
    >
      <img
        alt="체크"
        className="w-full h-full object-contain"
        src={checkIconPath}
      />
    </div>
  );
}

