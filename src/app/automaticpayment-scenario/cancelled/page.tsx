"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Scenario19 from "../components/Scenario19";
import { parseScenarioDetail } from "../utils/parseScenarioDetail";

export default function AutomaticPaymentCancelCompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTitle } = useScenarioHeader();

  useEffect(() => {
    setTitle("자동이체");
    return () => setTitle("");
  }, [setTitle]);

  const detail = useMemo(() => parseScenarioDetail(searchParams), [searchParams]);

  return (
    <Scenario19
      detail={detail}
      onNavigateToQuiz={() => router.push("/quiz/second")}
    />
  );
}


