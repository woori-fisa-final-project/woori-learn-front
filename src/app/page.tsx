"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

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
    <div className="flex items-center justify-center h-screen bg-white">
      <img
        src={loadingImage}
        alt="로딩 중"
        className="w-[200px] h-[200px] object-contain"
      />
    </div>
  );
}
