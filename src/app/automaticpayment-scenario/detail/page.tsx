"use client";

import { useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Scenario18 from "../components/Scenario18";
import { parseScenarioDetail } from "../utils/parseScenarioDetail";

export default function AutomaticPaymentDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTitle } = useScenarioHeader();

  useEffect(() => {
    setTitle("자동이체");
    return () => setTitle("");
  }, [setTitle]);

  const detail = useMemo(() => parseScenarioDetail(searchParams), [searchParams]);
  const searchString = useMemo(() => searchParams.toString(), [searchParams]);

  return (
    <Scenario18
      detail={detail}
      onBack={() => router.back()}
      onNavigateToCancelComplete={() =>
        router.push(`/automaticpayment-scenario/cancelled?${searchString}`)
      }
    />
  );
}

