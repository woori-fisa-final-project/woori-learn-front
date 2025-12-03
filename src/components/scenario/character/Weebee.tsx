import Image from "next/image";

type WeebeeProps = {
  emotion?: string;
  className?: string;
};

// Weebee 캐릭터 아바타 컴포넌트
// 이미지 경로 규칙: /public/images/scenario/{emotion}.png
export default function Weebee({ emotion = "hi", className }: WeebeeProps) {
  // 전역 규칙에 따라 반드시 /assets/weebee/{emotion}.png 경로를 사용합니다.
  const src = `/images/scenario/${emotion}.png`;

  return (
    <div className={className}>
      <Image src={src} alt={`weebee-${emotion}`} width={348} height={348} />
    </div>
  );
}


