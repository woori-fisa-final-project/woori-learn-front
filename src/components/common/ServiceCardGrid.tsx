"use client"; // 서비스 카드 목록을 동적으로 렌더링하기 위해 클라이언트 전용으로 선언합니다.
import ServiceCard from "./ServiceCard"; // 개별 카드 렌더링을 담당하는 컴포넌트를 불러옵니다.

interface ServiceCardData {
  title: string; // 카드 제목입니다.
  bgColor: string; // 카드 배경색 클래스입니다.
  borderColor: string; // 카드 테두리 색상 클래스입니다.
  textColor: string; // 제목 텍스트 색상 클래스입니다.
  imageSrc: string; // 카드에 표시할 이미지 경로입니다.
  imageAlt: string; // 이미지 대체 텍스트입니다.
  onClick?: () => void; // 카드 클릭 시 호출할 콜백입니다.
  height?: string; // 카드 높이 클래스입니다.
  rounded?: string; // 카드 모서리 둥글기 클래스입니다.
  imageWidth?: string; // 이미지 폭 커스텀 값입니다.
  imageHeight?: string; // 이미지 높이 커스텀 값입니다.
  imageClassName?: string; // 이미지 추가 클래스입니다.
  badgeSrc?: string; // 배지 이미지 경로입니다.
  badgeAlt?: string; // 배지 대체 텍스트입니다.
  badgePositionClassName?: string; // 배지 위치 조정 클래스입니다.
}

interface ServiceCardGridProps {
  cards: ServiceCardData[]; // 렌더링할 카드 데이터 배열입니다.
  className?: string; // 그리드 레이아웃에 추가로 적용할 클래스입니다.
}

export default function ServiceCardGrid({
  cards,
  className = "",
}: ServiceCardGridProps) {
  // 전달받은 카드 데이터를 2열 그리드 형태로 렌더링합니다.
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
          badgeSrc={card.badgeSrc}
          badgeAlt={card.badgeAlt}
          badgePositionClassName={card.badgePositionClassName}
        />
      ))}
    </div>
  );
}

