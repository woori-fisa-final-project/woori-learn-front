"use client";

interface PasswordToggleIconProps {
  showPassword: boolean;
  onToggle: () => void;
}

const eyeIcon = "/images/eyeicon.png";

export default function PasswordToggleIcon({
  showPassword,
  onToggle,
}: PasswordToggleIconProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-6 h-6 relative shrink-0"
      aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
    >
      <img
        alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        className="w-full h-full"
        src={eyeIcon}
      />
    </button>
  );
}

