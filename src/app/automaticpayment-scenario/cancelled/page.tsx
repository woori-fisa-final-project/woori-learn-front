"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Scenario19 from "../components/Scenario19";
import { getAutoPaymentDetail } from "@/lib/api/autoPayment";
import type { Scenario18Detail } from "../components/Scenario18";
import { convertToScenario18Detail } from "@/utils/autoPaymentConverter";
import { devLog, devError } from "@/utils/logger";

export default function AutomaticPaymentCancelCompletePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTitle } = useScenarioHeader();
  const [detail, setDetail] = useState<Scenario18Detail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTitle("자동이체");
    return () => setTitle("");
  }, [setTitle]);

  useEffect(() => {
    async function fetchDetail() {
      try {
        setIsLoading(true);
        const autoPaymentIdParam = searchParams.get("autoPaymentId");

        if (!autoPaymentIdParam) {
          devError("[fetchDetail] autoPaymentId가 없습니다.");
          return;
        }

        const autoPaymentId = parseInt(autoPaymentIdParam);

        // NaN 체크 추가
        if (isNaN(autoPaymentId)) {
          devError("[fetchDetail] 유효하지 않은 autoPaymentId:", autoPaymentIdParam);
          return;
        }

        devLog(`[fetchDetail] 해지 완료 페이지 - autoPaymentId: ${autoPaymentId}`);

        // API에서 최신 상태 조회
        const payment = await getAutoPaymentDetail(autoPaymentId);
        devLog(`[fetchDetail] 조회된 상태: ${payment.processingStatus}`);

        const convertedDetail = convertToScenario18Detail(payment);
        setDetail(convertedDetail);
      } catch (error) {
        devError("[fetchDetail] 자동이체 상세 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchDetail();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">자동이체 정보를 불러올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <Scenario19
      detail={detail}
      onNavigateToQuiz={() => router.push("/quiz/second")}
    />
  );
}


