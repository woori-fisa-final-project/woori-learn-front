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
    <main className="flex justify-center items-start min-h-[100dvh] bg-white overflow-x-hidden overflow-y-hidden">
      <div
        className={`w-full max-w-[390px] sm:max-w-[430px] md:max-w-[560px] lg:max-w-[768px] ${
          noPadding ? "" : "px-5 sm:px-[20px]"
        } pt-[60px] pb-0 flex flex-col min-h-[100dvh] ${className}`}
        style={{
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        {children}
      </div>
    </main>
  );
}
