"use client"; // 서비스 카드 클릭을 처리하므로 클라이언트 전용으로 선언합니다.

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
}: ServiceCardProps) {
  const imageStyle: React.CSSProperties = {}; // 이미지 크기를 커스텀할 때 사용할 인라인 스타일 객체입니다.
  if (imageWidth) imageStyle.width = imageWidth;
  if (imageHeight) imageStyle.height = imageHeight;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${bgColor} border ${borderColor} ${rounded} p-4 ${height} relative overflow-hidden hover:brightness-95 transition-all cursor-pointer w-full text-left ${className}`}
      aria-label={imageAlt}
    >
      <img
        alt={imageAlt}
        className={`absolute bottom-4 right-4 object-contain max-w-[calc(100%-1rem)] ${imageClassName}`}
        src={imageSrc}
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

