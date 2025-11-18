/*
  1) 시나리오 8 페이지 진입
      ↓
  2) useScenarioHeader → 헤더 제목 “전체계좌” 설정
      ↓
  3) useAccountList(userId) → 전체 계좌 목록 API 호출
      ↓
  4) API 응답 → AccountResponse[] 를 AccountCard[] 형태로 변환
      ↓
  5) 입출금 / 예적금 계좌 구분
      ↓
  6) 전체 자산(잔액 합계) 계산
      ↓
  7) CategoryBlock + AccountCard 컴포넌트로 렌더링
      ↓
  8) 입출금 계좌 클릭 → 시나리오 9로 이동(accountNumber 전달)
*/

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";
import { useAccountList } from "./hooks/useAccountList";
import type { AccountCard } from "./hooks/useAccountList";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import AlertModalContent from "./components/AlertModalContent";
import CategoryBlock from "./components/CategoryBlock";


// 상단 퀵 필터 버튼용 상수
const QUICK_FILTERS = [
  { label: "입출금", value: "deposit" },
  { label: "우리금융그룹", value: "woori-group" },
];

export default function Scenario8() {
  const router = useRouter();
  const { setTitle, setOnBack } = useScenarioHeader();

  const {
    accounts,
    depositAccounts,
    savingsAccounts,
    totalBalance,
    isLoading,
    error,
    refetch,
  } = useAccountList(1);

  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 총금액 토글 / 퀵필터 상태
  const [showTotal, setShowTotal] = useState(true);
  const [activeFilter, setActiveFilter] =
    useState<"deposit" | "woori-group">("deposit");

  const openModal = (msg?: string) => {
    setAlertMessage(msg ?? "해당 계좌에서는 이체를 이용할 수 없습니다.");
    setAlertModalOpen(true);
  };

  const closeModal = () => setAlertModalOpen(false);

  useEffect(() => {
    setTitle("전체계좌");
    setOnBack(() => () => router.push("/woorimain"));

    return () => {
      setTitle("");
      setOnBack(null);
    };
  }, [router, setTitle, setOnBack]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        계좌 정보를 불러오는 중...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p className="mb-3 text-red-500">{error}</p>
        <Button onClick={refetch}>다시 시도</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[390px] flex-col">
      {/* 메인 컨텐츠 */}
      <main className="flex-1 overflow-y-auto px-[20px] pb-[40px]">
        {/* 상단 탭 (계좌 / 카드 / 페이) + 은행 선택 + 새로고침 */}
        <section className="mt-[16px] flex items-center justify-between">
          <nav className="flex items-center gap-[12px] text-[15px] font-semibold">
            <button className="rounded-[16px] bg-[#2F6FD9] px-[14px] py-[6px] text-white">
              계좌
            </button>
            <button className="text-gray-400">카드</button>
            <button className="text-gray-400">페이</button>
          </nav>

          <div className="flex items-center gap-[8px]">
            {/* 은행 선택 (UI만, 아직 기능 X) */}
            <button
              type="button"
              className="flex items-center gap-[4px] rounded-[16px] border border-gray-200 px-[10px] py-[4px] text-[12px] text-gray-600"
            >
              우리
              <span className="text-[10px]">▼</span>
            </button>

            {/* 새로고침 버튼 */}
            <button
              type="button"
              aria-label="새로고침"
              className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-gray-200 text-[14px] text-gray-500"
              onClick={refetch}
            >
              ⟳
            </button>
          </div>
        </section>

        {/* 총금액 + 토글 스위치 + 큰 금액 표시 */}
        <section className="mt-[16px]">
          <div className="flex items-center justify-between text-[13px] text-gray-500">
            <div className="flex items-center gap-[4px]">
              <span>총금액</span>
              <span className="text-[12px] text-gray-400">?</span>
            </div>

            {/* 토글 */}
            <button
              type="button"
              onClick={() => setShowTotal((prev) => !prev)}
              className={`flex items-center rounded-full px-[4px] py-[2px] transition ${
                showTotal ? "bg-[#2F6FD9]" : "bg-gray-300"
              }`}
            >
              <span
                className={`h-[18px] w-[18px] rounded-full bg-white shadow transition ${
                  showTotal ? "translate-x-[14px]" : "translate-x-0"
                }`}
              />
            </button>
          </div>

          <p
            className={`mt-[8px] text-[28px] font-bold ${
              showTotal ? "text-gray-900" : "text-gray-300"
            }`}
          >
            {showTotal
              ? `${totalBalance.toLocaleString("ko-KR")}원`
              : "0원"}
          </p>
        </section>

        {/* 퀵 필터 (입출금 / 우리금융그룹) */}
        <section className="mt-[16px] flex gap-[10px]">
          {QUICK_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.value as "deposit" | "woori-group")
                }
                className={`rounded-[16px] px-[16px] py-[8px] text-[13px] font-medium ${
                  isActive
                    ? "bg-[#2F6FD9] text-white"
                    : "bg-[#F3F4F6] text-gray-600"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </section>

        {/* 입출금 / 예적금 리스트 */}
        <section className="mt-[24px] space-y-[24px]">
          {/* 입출금 */}
          {depositAccounts.length > 0 && (
            <CategoryBlock
              title={`입출금 ${depositAccounts.length}`}
              accounts={depositAccounts}
              onTransfer={(acc: AccountCard) => {
                router.push(
                  `/searchaccount-scenario?step=9&accountId=${acc.id}&accountNumber=${acc.accountNumber}`
                );
              }}
            />
          )}

          {/* 예적금 */}
          {savingsAccounts.length > 0 && (
            <CategoryBlock
              title={`예적금 ${savingsAccounts.length}`}
              accounts={savingsAccounts}
              onTransfer={(acc: any) => {
                // 예적금은 기본 이체 불가 → 안내 모달
                openModal(acc.disabledMessage);
              }}
            />
          )}

          {/* 계좌 없음 */}
          {accounts.length === 0 && (
            <div className="mt-10 text-center text-gray-500">
              등록된 계좌가 없습니다.
            </div>
          )}
        </section>
      </main>

      {/* 안내 모달 */}
      <Modal
        isOpen={isAlertModalOpen}
        onClose={closeModal}
        onConfirm={closeModal}
      >
        <AlertModalContent message={alertMessage} onClose={closeModal} />
      </Modal>
    </div>
  );
}
