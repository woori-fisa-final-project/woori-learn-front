"use client"; // 이 페이지가 클라이언트 전용 로직(useEffect 등)을 사용함을 명시합니다.
import { useEffect } from "react"; // 컴포넌트 마운트 이후에 타이머를 설정하기 위해 useEffect를 불러옵니다.
import { useRouter } from "next/navigation"; // 로그인 페이지로 이동시키기 위해 Next.js 라우터를 사용합니다.
import Image from "next/image"; // Splash 화면에서 로딩 이미지를 최적화된 방식으로 보여주기 위해 Image 컴포넌트를 사용합니다.
const loadingImage = "/images/loading.gif"; // public/images 폴더 안에 이미지 두기

export default function Splash() { // 애플리케이션 최초 진입 시 보여줄 스플래시 화면 컴포넌트입니다.
  const router = useRouter(); // 로그인 페이지로 이동하기 위해 라우터 인스턴스를 생성합니다.

  useEffect(() => { // 컴포넌트가 마운트되면 일정 시간이 지난 뒤 로그인 페이지로 이동시키는 효과를 실행합니다.
    const timer = setTimeout(() => { // 2.5초 뒤에 실행될 타이머를 설정합니다.
      router.push("/login"); // (auth) → 실제 URL은 /login
    }, 2500);
    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머를 정리하여 메모리 누수를 방지합니다.
  }, [router]); // 라우터 객체가 변경될 경우에만 이 효과를 재실행합니다.

  return (
    <main className="bg-white min-h-screen flex flex-col items-center overflow-x-hidden"> {/* 스플래시 화면 전체 영역을 중앙 정렬된 흰 배경으로 구성합니다. */}
      <div className="w-full max-w-[390px] mx-auto px-[20px] pt-[60px] flex items-center justify-center min-h-screen"> {/* 모바일 디바이스 폭에 맞춰 로딩 이미지를 가운데 배치합니다. */}
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
