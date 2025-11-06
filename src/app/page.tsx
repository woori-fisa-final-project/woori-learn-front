"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
const loadingImage = "/images/loading.gif"; // public/images 폴더 안에 이미지 두기

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login"); // (auth) → 실제 URL은 /login
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="bg-white min-h-screen flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-[390px] mx-auto px-[20px] pt-[60px] flex items-center justify-center min-h-screen">
      <Image
        src={loadingImage}
        alt="로딩 중"
        width={200}
        height={200}
        className="object-contain max-w-full"
        unoptimized
      />
    </div>
    </main>
  );
}
