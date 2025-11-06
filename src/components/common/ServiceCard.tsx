"use client";

interface ServiceCardProps {
  title: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  imageSrc: string;
  imageAlt: string;
  onClick?: () => void;
  className?: string;
  height?: string;
  rounded?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageClassName?: string;
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
  const imageStyle: React.CSSProperties = {};
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

