"use client"; // 서비스 카드 클릭을 처리하므로 클라이언트 전용으로 선언합니다.

import type { CSSProperties } from "react";
import Image from "next/image";

interface ServiceCardProps {
  title: string; // 카드 내부에 표시할 제목입니다.
  bgColor: string; // 배경색 클래스를 전달합니다.
  borderColor: string; // 테두리 색상을 Tailwind 클래스 형태로 전달합니다.
  textColor: string; // 제목 텍스트 색상 클래스입니다.
  imageSrc: string; // 카드 내부 이미지 경로입니다.
  imageAlt: string; // 이미지를 설명하는 대체 텍스트입니다.
  onClick?: () => void; // 카드 클릭 시 실행할 콜백입니다.
  className?: string; // 외부에서 추가 스타일을 주입하는 클래스입니다.
  height?: string; // 카드 높이 클래스를 지정합니다.
  rounded?: string; // 카드 모서리 둥글기 클래스를 지정합니다.
  imageWidth?: string; // 이미지 너비를 직접 지정할 때 사용하는 값입니다.
  imageHeight?: string; // 이미지 높이를 직접 지정할 때 사용하는 값입니다.
  imageClassName?: string; // 이미지에 추가로 적용할 클래스입니다.
  badgeSrc?: string; // 카드 상태를 표현할 배지 이미지입니다.
  badgeAlt?: string; // 배지 이미지 대체 텍스트입니다.
  badgePositionClassName?: string; // 배지 위치를 조정할 Tailwind 클래스입니다.
}

export default function ServiceCard({
  title,
  bgColor,
  borderColor,
  textColor,
  imageSrc,
  imageAlt,
  onClick,
  className = "",
  height = "h-[108px]",
  rounded = "rounded-[10px]",
  imageWidth,
  imageHeight,
  imageClassName = "",
  badgeSrc,
  badgeAlt = "상태 아이콘",
  badgePositionClassName = "top-3 right-3",
}: ServiceCardProps) {
  const parsedImageWidth = imageWidth ? parseInt(imageWidth, 10) : undefined;
  const parsedImageHeight = imageHeight ? parseInt(imageHeight, 10) : undefined;
  const imageStyle: CSSProperties = {
    width: imageWidth ?? "clamp(52px, 23vw, 82px)",
  }; // 이미지 크기를 커스텀할 때 사용할 인라인 스타일 객체입니다.
  if (imageHeight) imageStyle.height = imageHeight;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group ${bgColor} border ${borderColor} ${rounded} p-4 ${height} relative overflow-hidden cursor-pointer w-full text-left ${className} transition-[transform,box-shadow,filter] duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_18px_26px_rgba(17,36,76,0.18)] hover:brightness-105 active:-translate-y-1 active:shadow-[0_18px_26px_rgba(17,36,76,0.18)] active:brightness-105 active:scale-[0.98]`}
      aria-label={imageAlt}
    >
      {badgeSrc && (
        <div
          className={`absolute ${badgePositionClassName} flex h-7 w-7 items-center justify-center rounded-full bg-white`}
        >
          <Image alt={badgeAlt} className="h-4 w-4 object-contain" src={badgeSrc} width={16} height={16} />
        </div>
      )}
      <Image
        alt={imageAlt}
        className={`absolute bottom-4 right-4 object-contain max-w-[calc(100%-1rem)] max-h-[80px] transition-transform duration-300 ease-out group-hover:scale-105 sm:max-h-[90px] ${imageClassName}`}
        src={imageSrc}
        width={parsedImageWidth || 82}
        height={parsedImageHeight || 82}
        style={imageStyle}
      />
      <p
        className={`text-[18px] ${textColor} font-semibold leading-tight whitespace-pre-line`}
      >
        {title}
      </p>
    </button>
  );
}

