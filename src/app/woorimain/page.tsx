import { Suspense } from "react";
import WooriMainClient from "./WooriMainClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[100dvh] items-center justify-center bg-[#F5F7FB]">
          <p className="text-gray-500">화면을 불러오는 중...</p>
        </div>
      }
    >
      <WooriMainClient />
    </Suspense>
  );
}