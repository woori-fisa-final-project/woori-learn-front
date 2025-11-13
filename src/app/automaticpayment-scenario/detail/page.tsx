"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Scenario18, { type Scenario18Detail } from "../components/Scenario18";
import { getAutoPaymentDetail, cancelAutoPayment } from "@/lib/api/autoPayment";
import type { AutoPayment } from "@/types/autoPayment";
import { convertToScenario18Detail } from "../utils/converter";
import { usePageFocusRefresh } from "@/lib/hooks/usePageFocusRefresh";
import { devLog, devError } from "@/lib/utils/logger";
import { useToast } from "@/lib/context/ToastContext";

export default function AutomaticPaymentDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTitle } = useScenarioHeader();
  const { showError } = useToast();

  const [detail, setDetail] = useState<Scenario18Detail | null>(null);
  const [payment, setPayment] = useState<AutoPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPaymentId, setAutoPaymentId] = useState<number | null>(null);

  useEffect(() => {
    setTitle("자동이체");
    return () => setTitle("");
  }, [setTitle]);

  const fetchDetail = useCallback(async () => {
    try {
      setIsLoading(true);

      const idParam = searchParams.get("autoPaymentId");
      if (!idParam) {
        devError("[fetchDetail] autoPaymentId가 없습니다.");
        showError("자동이체 정보를 찾을 수 없습니다.");
        return;
      }

      const id = parseInt(idParam);

      // NaN 체크 추가
      if (isNaN(id)) {
        devError("[fetchDetail] 유효하지 않은 autoPaymentId:", idParam);
        showError("잘못된 자동이체 ID입니다.");
        return;
      }

      setAutoPaymentId(id);

      const fetchedPayment = await getAutoPaymentDetail(id);
      devLog(`[fetchDetail] 자동이체 상태: ${fetchedPayment.processingStatus}`);
      setPayment(fetchedPayment);
      const convertedDetail = convertToScenario18Detail(fetchedPayment);
      setDetail(convertedDetail);
    } catch (error) {
      devError("[fetchDetail] 자동이체 상세 조회 실패:", error);
      showError("자동이체 정보를 불러오지 못했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // 페이지가 다시 포커스를 받을 때 데이터 새로고침
  usePageFocusRefresh(() => {
    devLog("[usePageFocusRefresh] 상세 페이지 포커스 복귀 - 데이터 새로고침");
    fetchDetail();
  });

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

  const handleCancelAutoPayment = async () => {
    if (!autoPaymentId || !payment) {
      devError("[handleCancelAutoPayment] autoPaymentId 또는 payment 정보가 없습니다.");
      showError("자동이체 정보를 찾을 수 없습니다.");
      return;
    }

    devLog("[handleCancelAutoPayment] 자동이체 해지 시작", {
      autoPaymentId,
      educationalAccountId: payment.educationalAccountId,
    });

    try {
      // 해지 API 호출
      const result = await cancelAutoPayment(autoPaymentId, payment.educationalAccountId);
      devLog("[handleCancelAutoPayment] 해지 API 응답:", result);

      // 해지 완료 페이지로 이동
      router.push(`/automaticpayment-scenario/cancelled?autoPaymentId=${autoPaymentId}`);
    } catch (error) {
      devError("[handleCancelAutoPayment] 자동이체 해지 실패:", error);
      showError("자동이체 해지에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Scenario18
      detail={detail}
      onBack={() => router.back()}
      onNavigateToCancelComplete={handleCancelAutoPayment}
    />
  );
}

