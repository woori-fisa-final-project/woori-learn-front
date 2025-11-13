"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Scenario18, { type Scenario18Detail } from "../components/Scenario18";
import { getAutoPaymentDetail, cancelAutoPayment } from "@/lib/api/autoPayment";
import type { AutoPayment } from "@/types/autoPayment";
import { formatAccountNumber } from "@/lib/utils/accountUtils";
import { getBankName } from "@/lib/utils/bankUtils";

// AutoPayment를 Scenario18Detail로 변환
function convertToScenario18Detail(payment: AutoPayment): Scenario18Detail {
  const statusMap = {
    ACTIVE: "정상",
    CANCELLED: "해지",
  };

  // 날짜 범위 포맷팅
  const formatDateRange = (startDate: string, expirationDate: string): string => {
    return `${startDate} ~ ${expirationDate}`;
  };

  const bankName = getBankName(payment.depositBankCode);
  const bankAccount = formatAccountNumber(payment.depositNumber);

  return {
    status: statusMap[payment.processingStatus] || payment.processingStatus,
    title: payment.displayName || "자동이체",
    amount: `${payment.amount.toLocaleString()}원`,
    transferDay: `${payment.designatedDate}일`,
    frequency: `${payment.transferCycle}개월`,
    period: formatDateRange(payment.startDate, payment.expirationDate),
    ownerName: "김우리", // 출금 계좌 소유자 (현재 API에 없음)
    recipientName: payment.counterpartyName,
    registerDate: payment.startDate, // 등록일 (현재 API에 없으므로 시작일 사용)
    sourceAccount: "우리은행 · -", // 출금 계좌 (현재 API에 없음)
    inboundAccount: `${bankName} · ${bankAccount}`,
  };
}

export default function AutomaticPaymentDetailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setTitle } = useScenarioHeader();

  const [detail, setDetail] = useState<Scenario18Detail | null>(null);
  const [payment, setPayment] = useState<AutoPayment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [autoPaymentId, setAutoPaymentId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setTitle("자동이체");
    return () => setTitle("");
  }, [setTitle]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);

      const idParam = searchParams.get("autoPaymentId");
      if (!idParam) {
        console.error("autoPaymentId가 없습니다.");
        return;
      }

      const id = parseInt(idParam);
      setAutoPaymentId(id);

      const fetchedPayment = await getAutoPaymentDetail(id);
      console.log("상세 페이지 - 자동이체 상태:", fetchedPayment.processingStatus);
      setPayment(fetchedPayment);
      const convertedDetail = convertToScenario18Detail(fetchedPayment);
      setDetail(convertedDetail);
    } catch (error) {
      console.error("자동이체 상세 조회 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [searchParams, refreshKey]);

  // 페이지가 다시 포커스를 받을 때 데이터 새로고침
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("상세 페이지 포커스 복귀 - 데이터 새로고침");
        setRefreshKey(prev => prev + 1);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

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
      alert("자동이체 정보를 찾을 수 없습니다.");
      return;
    }

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

