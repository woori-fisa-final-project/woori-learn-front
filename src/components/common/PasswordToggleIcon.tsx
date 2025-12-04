"use client"; // 비밀번호 토글 버튼은 사용자 상호작용을 처리하므로 클라이언트 전용입니다.

import Image from "next/image";

interface PasswordToggleIconProps {
  showPassword: boolean; // 현재 비밀번호가 보여지는 상태인지 여부입니다.
  onToggle: () => void; // 토글 버튼 클릭 시 호출할 콜백입니다.
}

const eyeIcon = "/images/eyeicon.png"; // 눈 모양 아이콘 경로입니다.

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
      <Image
        alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
        className="w-full h-full"
        src={eyeIcon} // 시각적 상태는 aria-label로 구분하며 동일한 아이콘을 재사용합니다.
        width={24}
        height={24}
      />
    </button>
  );
}

