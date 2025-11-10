"use client"; // 진행 상황을 클라이언트에서 렌더링하기 위해 선언합니다.

interface ProgressCardProps {
  title: string; // 카드 상단에 표시할 제목입니다.
  progress: number; // 0-100
  description?: string; // 추가 설명 텍스트입니다.
  imageSrc?: string; // 필요 시 함께 보여줄 이미지 경로입니다.
  className?: string; // 외부에서 전달하는 추가 클래스입니다.
}

export default function ProgressCard({
  title,
  progress,
  description,
  imageSrc,
  className = "",
}: ProgressCardProps) {
  const progressWidth = Math.min(Math.max(progress, 0), 100); // 0~100 범위로 제한한 진행률 수치입니다.

  return (
    <div
      className={`w-full rounded-[10px] px-[16px] bg-white ${className}`}
    >
      <div className="flex items-center justify-between mb-4 w-full">
        <p className="text-[14px] text-gray-600 font-semibold">{title}</p>
        <p className="text-[12px] text-gray-900">{progress}%</p>
      </div>
      <div className="bg-gray-100 rounded-full h-2 flex w-full">
        <div
          className="bg-primary-400 rounded-full h-full transition-all duration-300"
          style={{ width: `${progressWidth}%` }} // 진행률에 맞춰 막대 너비를 동적으로 조정합니다.
        />
      </div>
      {description && (
        <p className="mt-2 text-[12px] text-gray-500">{description}</p>
      )}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={title}
          className="mt-2 w-full h-auto object-contain"
        />
      )}
    </div>
  );
}

