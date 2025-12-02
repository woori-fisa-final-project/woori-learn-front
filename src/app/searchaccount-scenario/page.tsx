"use client";

import { Suspense } from "react";
import Scenario8 from "./components/Scenario8";
import Scenario9 from "./components/Scenario9";
import Scenario10 from "./components/Scenario10";
import { useSearchParams } from "next/navigation";

function SearchAccountScenarioContent() {
  const searchParams = useSearchParams();
  const step = searchParams.get("step");

  const scenarios: { [key: string]: React.ReactNode } = {
    "9": <Scenario9 />,
    "10": <Scenario10 />,
  };

  return (
    <>
      {(step && scenarios[step]) || <Scenario8 />}
    </>
  );
}

export default function SearchAccountScenarioPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    }>
      <SearchAccountScenarioContent />
    </Suspense>
  );
}