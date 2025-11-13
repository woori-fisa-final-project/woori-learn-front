"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import Scenario19 from "../components/Scenario19";
import { getAutoPaymentDetail } from "@/lib/api/autoPayment";
import type { AutoPayment } from "@/types/autoPayment";
import type { Scenario18Detail } from "../components/Scenario18";
import { formatAccountNumber } from "@/lib/utils/accountUtils";
import { getBankName } from "@/lib/utils/bankUtils";

// AutoPayment를 Scenario18Detail로 변환
function convertToScenario18Detail(payment: AutoPayment): Scenario18Detail {
  const statusMap = {
    ACTIVE: "정상",
    CANCELLED: "해지",
  };

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
    ownerName: "김우리", // TODO: 실제 계좌 소유자 이름
    recipientName: payment.counterpartyName,
    registerDate: payment.startDate,
    sourceAccount: "우리은행 · -", // TODO: 실제 출금 계좌 정보
    inboundAccount: `${bankName} · ${bankAccount}`,
  };
}

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
          console.error("autoPaymentId가 없습니다.");
          return;
        }

        const autoPaymentId = parseInt(autoPaymentIdParam);
        console.log("해지 완료 페이지 - autoPaymentId:", autoPaymentId);

        // API에서 최신 상태 조회
        const payment = await getAutoPaymentDetail(autoPaymentId);
        console.log("해지 완료 페이지 - 조회된 상태:", payment.processingStatus);

        const convertedDetail = convertToScenario18Detail(payment);
        setDetail(convertedDetail);
      } catch (error) {
        console.error("자동이체 상세 조회 실패:", error);
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


