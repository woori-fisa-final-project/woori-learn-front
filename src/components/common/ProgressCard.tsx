"use client";

interface ProgressCardProps {
  title: string;
  progress: number; // 0-100
  description?: string;
  imageSrc?: string;
  className?: string;
}

export default function ProgressCard({
  title,
  progress,
  description,
  imageSrc,
  className = "",
}: ProgressCardProps) {
  const progressWidth = Math.min(Math.max(progress, 0), 100);

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
          style={{ width: `${progressWidth}%` }}
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

