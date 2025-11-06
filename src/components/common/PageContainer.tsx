"use client";
import { ReactNode } from "react";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export default function PageContainer({
  children,
  className = "",
  noPadding = false,
}: PageContainerProps) {
  return (
    <main className="flex justify-center items-start min-h-screen bg-white overflow-x-hidden">
      <div
        className={`w-full max-w-[390px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-[768px] ${
          noPadding ? "" : "px-5"
        } pt-[60px] pb-5 flex flex-col items-start ${className}`}
      >
        {children}
      </div>
    </main>
  );
}

