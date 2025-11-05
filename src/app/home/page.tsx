// src/app/(home)/page.tsx
import MainHome from "@/components/figmaMCP/MainHome";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col justify-center">
      <div className="w-full max-w-[390px] mx-auto px-4 sm:px-0">
        <MainHome />
      </div>
    </main>
  );
}
