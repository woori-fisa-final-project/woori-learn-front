import "../styles/globals.css"; // 전역 스타일을 적용하기 위해 글로벌 CSS를 불러옵니다.
import type { Metadata } from "next"; // Next.js 메타데이터 타입을 사용하여 페이지 정보를 정의합니다.

export const metadata: Metadata = {
  title: "WooriLearn",
  description: "Splash test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko"> {/* 문서 전체의 언어를 한국어로 지정합니다. */}
      <body className="overflow-x-hidden">{children}</body> {/* 브라우저 가로 스크롤을 막고 모든 하위 페이지를 렌더링합니다. */}
    </html>
  );
}
