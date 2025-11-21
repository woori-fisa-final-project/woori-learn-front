type ImageStepProps = {
  content: Record<string, any>;
  onBackgroundClick?: () => void;
};

export default function ImageStep({ content, onBackgroundClick }: ImageStepProps) {
  // IMAGE 타입은 단순히 이미지를 전체 레이아웃 규칙 안에서 보여줍니다.
  // 시나리오 전용 이미지는 /public/images/scenario 아래에 위치한다고 가정합니다.
  // - content.image 가 절대 경로("/"로 시작)이면 그대로 사용
  // - 아니라면 "/images/scenario/{파일명}" 형태로 보정해서 사용합니다.
  const src = content.image.startsWith("/")
    ? content.image
    : `/images/scenario/${content.image}.png`;

  return (
    <div 
      className="fixed inset-0 z-[9999] bg-gradient-to-b from-[#ffffff] to-[#549AE4] cursor-pointer"
      onClick={onBackgroundClick}
    >
      <div className="flex flex-1 w-full h-full items-center justify-center min-h-screen">
        <img
          src={src}
          alt="scenario-image"
          className="z-1 max-h-[80vh] max-w-full object-contain mx-auto pointer-events-none"
        />
      </div>
    </div>
  );
}


