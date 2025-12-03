"use client";

import { useState } from "react";
import { useAccountList } from "./hooks/useAccountList";
import type { AccountCard } from "@/types";

import Modal from "@/components/common/Modal";
import Button from "@/components/common/Button";
import AlertModalContent from "./components/AlertModalContent";
import CategoryBlock from "./components/CategoryBlock";

type Scenario8Props = {
  onPickDepositAccount: (acc: AccountCard) => void | Promise<void>;
};

const QUICK_FILTERS = [
  { label: "우리금융그룹", value: "woori-group" },
  { label: "입출금", value: "deposit" },
] as const;

export default function Scenario8({ onPickDepositAccount }: Scenario8Props) {
  const { accounts, depositAccounts, savingsAccounts, totalBalance, isLoading, error, refetch } =
    useAccountList();

  const [isAlertModalOpen, setAlertModalOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [showTotal, setShowTotal] = useState(true);
  const [activeFilter, setActiveFilter] =
    useState<(typeof QUICK_FILTERS)[number]["value"]>("deposit");

  const openModal = (msg?: string) => {
    setAlertMessage(msg ?? "해당 계좌에서는 이체를 이용할 수 없습니다.");
    setAlertModalOpen(true);
  };
  const closeModal = () => setAlertModalOpen(false);

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
      <main className="flex-1 overflow-y-auto px-[20px] pb-[40px]">
        <section className="mt-[16px] flex items-center justify-between">
          <nav className="flex items-center gap-[12px] text-[15px] font-semibold">
            <button className="rounded-[16px] bg-[#2F6FD9] px-[14px] py-[6px] text-white">
              계좌
            </button>
            <button className="text-gray-400">카드</button>
            <button className="text-gray-400">페이</button>
          </nav>

          <div className="flex items-center gap-[8px]">
            <button
              type="button"
              className="flex items-center gap-[4px] rounded-[16px] border border-gray-200 px-[10px] py-[4px] text-[12px] text-gray-600"
            >
              우리 <span className="text-[10px]">▼</span>
            </button>

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

        <section className="mt-[16px]">
          <div className="flex items-center justify-between text-[13px] text-gray-500">
            <div className="flex items-center gap-[4px]">
              <span>총금액</span>
              <span className="text-[12px] text-gray-400">?</span>
            </div>

            <button
              type="button"
              onClick={() => setShowTotal((prev) => !prev)}
              className={`flex items-center rounded-full px-[4px] py-[2px] transition ${showTotal ? "bg-[#2F6FD9]" : "bg-gray-300"
                }`}
            >
              <span
                className={`h-[18px] w-[18px] rounded-full bg-white shadow transition ${showTotal ? "translate-x-[14px]" : "translate-x-0"
                  }`}
              />
            </button>
          </div>

          <p
            className={`mt-[8px] text-[28px] font-bold ${showTotal ? "text-gray-900" : "text-gray-300"
              }`}
          >
            {showTotal ? `${totalBalance.toLocaleString("ko-KR")}원` : "0원"}
          </p>
        </section>

        <section className="mt-[16px] flex gap-[10px]">
          {QUICK_FILTERS.map((filter) => {
            const isActive = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={`rounded-[16px] px-[16px] py-[8px] text-[13px] font-medium ${isActive ? "bg-[#2F6FD9] text-white" : "bg-[#F3F4F6] text-gray-600"
                  }`}
              >
                {filter.label}
              </button>
            );
          })}
        </section>

        <section className="mt-[24px] space-y-[24px]">
          {depositAccounts.length > 0 && (
            <CategoryBlock
              title={`입출금 ${depositAccounts.length}`}
              accounts={depositAccounts}
              onTransfer={(acc) => void onPickDepositAccount(acc)}
            />
          )}

          {savingsAccounts.length > 0 && (
            <CategoryBlock
              title={`예적금 ${savingsAccounts.length}`}
              accounts={savingsAccounts}
              onTransfer={(acc) => openModal(acc.disabledMessage)}
            />
          )}

          {accounts.length === 0 && (
            <div className="mt-10 text-center text-gray-500">
              등록된 계좌가 없습니다.
            </div>
          )}
        </section>
      </main>

      <Modal isOpen={isAlertModalOpen} onClose={closeModal} onConfirm={closeModal}>
        <AlertModalContent message={alertMessage} onClose={closeModal} />
      </Modal>
    </div>
  );
}
