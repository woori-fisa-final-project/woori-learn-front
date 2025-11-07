"use client";
import ServiceCard from "./ServiceCard";

interface ServiceCardData {
  title: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  imageSrc: string;
  imageAlt: string;
  onClick?: () => void;
  height?: string;
  rounded?: string;
  imageWidth?: string;
  imageHeight?: string;
  imageClassName?: string;
}

interface ServiceCardGridProps {
  cards: ServiceCardData[];
  className?: string;
}

export default function ServiceCardGrid({
  cards,
  className = "",
}: ServiceCardGridProps) {
  return (
    <div className={`grid grid-cols-2 gap-3 w-full ${className}`}>
      {cards.map((card, index) => (
        <ServiceCard
          key={index}
          title={card.title}
          bgColor={card.bgColor}
          borderColor={card.borderColor}
          textColor={card.textColor}
          imageSrc={card.imageSrc}
          imageAlt={card.imageAlt}
          onClick={card.onClick}
          height={card.height}
          rounded={card.rounded}
          imageWidth={card.imageWidth}
          imageHeight={card.imageHeight}
          imageClassName={card.imageClassName}
        />
      ))}
    </div>
  );
}

