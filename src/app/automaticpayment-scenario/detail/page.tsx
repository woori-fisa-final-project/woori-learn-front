"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Scenario18, { type Scenario18Detail } from "../components/Scenario18";
import { getAutoPaymentDetail, cancelAutoPayment } from "@/lib/api/autoPayment";
import type { AutoPayment } from "@/types/autoPayment";
import { convertToScenario18Detail } from "../utils/converter";
import { usePageFocusRefresh } from "@/lib/hooks/usePageFocusRefresh";

export default function AutomaticPaymentDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTitle } = useScenarioHeader();

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
        console.error("autoPaymentId가 없습니다.");
        return;
      }

      const id = parseInt(idParam);

      // NaN 체크 추가
      if (isNaN(id)) {
        console.error("유효하지 않은 autoPaymentId:", idParam);
        // TODO: alert 대신 Toast/Modal 컴포넌트 사용 권장 (UX 개선)
        alert("잘못된 자동이체 ID입니다.");
        return;
      }

      setAutoPaymentId(id);

      const fetchedPayment = await getAutoPaymentDetail(id);
      // TODO: 프로덕션 배포 전 디버깅 로그 제거
      console.log("상세 페이지 - 자동이체 상태:", fetchedPayment.processingStatus);
      setPayment(fetchedPayment);
      const convertedDetail = convertToScenario18Detail(fetchedPayment);
      setDetail(convertedDetail);
    } catch (error) {
      console.error("자동이체 상세 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // 페이지가 다시 포커스를 받을 때 데이터 새로고침
  usePageFocusRefresh(() => {
    // TODO: 프로덕션 배포 전 디버깅 로그 제거
    console.log("상세 페이지 포커스 복귀 - 데이터 새로고침");
    fetchDetail(); // 페이지 새로고침 없이 데이터만 다시 가져오기
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
      console.error("autoPaymentId 또는 payment 정보가 없습니다.");
      // TODO: alert 대신 Toast/Modal 컴포넌트 사용 권장 (UX 개선)
      alert("자동이체 정보를 찾을 수 없습니다.");
      return;
    }

    // TODO: 프로덕션 배포 전 디버깅 로그 제거
    console.log("=== 자동이체 해지 시작 ===");
    console.log("autoPaymentId:", autoPaymentId);
    console.log("educationalAccountId:", payment.educationalAccountId);

    try {
      // 해지 API 호출
      const result = await cancelAutoPayment(autoPaymentId, payment.educationalAccountId);
      console.log("해지 API 응답:", result);

      // 해지 완료 페이지로 이동
      router.push(`/automaticpayment-scenario/cancelled?autoPaymentId=${autoPaymentId}`);
    } catch (error) {
      console.error("자동이체 해지 실패:", error);
      // TODO: alert 대신 Toast/Modal 컴포넌트 사용 권장 (UX 개선)
      alert("자동이체 해지에 실패했습니다. 다시 시도해주세요.");
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

