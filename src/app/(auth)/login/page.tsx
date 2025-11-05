// 로그인 페이지 라우팅 처리 
// 원본파일은 components/figmaMCP/Login.tsx 에서 수정
import Login from "@/components/figmaMCP/Login";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center">
      <div className="w-full max-w-[390px] h-[844px] mx-auto px-4 sm:px-0 overflow-y-auto bg-white">
        <Login />
      </div>
    </main>
  );
}
