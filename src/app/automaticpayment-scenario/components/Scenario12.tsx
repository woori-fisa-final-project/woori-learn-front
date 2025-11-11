"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useScenarioHeader } from "@/lib/context/ScenarioHeaderContext";

const ACCOUNTS = [
  {
    id: "source-1",
    name: "WON통장",
    bank: "우리",
    number: "0000-000-0000000",
    balance: "잔액 300000원",
  },
  {
    id: "source-2",
    name: "WON통장",
    bank: "우리",
    number: "0000-000-0000000",
    balance: "잔액 1000000원",
  },
];

export default function Scenario12() {
  const router = useRouter();
  const { setTitle, setOnBack } = useScenarioHeader();

  useEffect(() => {
    setTitle("자동이체 등록");
    setOnBack(() => () => router.back());

    return () => {
      setTitle("");
      setOnBack(null);
    };
  }, [router, setOnBack, setTitle]);

  const handleSelectAccount = (accountId: string) => {
    window.alert(`"${accountId}" 계좌 선택은 준비 중입니다.`);
  };

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-[390px] flex-col bg-white">
      <main className="flex-1 overflow-y-auto px-[20px] pb-[40px]">
        <section className="mt-[32px]">
          <h1 className="text-[24px] font-semibold leading-[1.3] text-gray-900 tracking-[-0.5px]">
            어디에서 이체하시겠어요?
          </h1>
        </section>

        <section className="mt-[28px] space-y-[16px]">
          {ACCOUNTS.map((account) => (
            <button
              key={account.id}
              type="button"
              onClick={() => handleSelectAccount(account.id)}
              className="w-full rounded-[16px] border border-gray-100 bg-white px-[20px] py-[18px] text-left shadow-sm transition hover:border-primary-400 hover:shadow-md"
            >
              <div className="flex items-start gap-[12px]">
                <div className="flex h-[36px] w-[36px] items-center justify-center rounded-full bg-[#E8F1FF]">
                  <img
                    src="/images/woorilogo.png"
                    alt="우리은행"
                    className="h-[40px] w-[40px] object-contain"
                  />
                </div>
                <div className="flex flex-col gap-[4px]">
                  <p className="text-[17px] font-semibold text-gray-900">
                    {account.name}
                  </p>
                  <p className="text-[13px] text-gray-500">
                    {account.bank} {account.number}
                  </p>
                  <p className="text-[13px] text-gray-500">{account.balance}</p>
                </div>
              </div>
            </button>
          ))}
        </section>
      </main>
    </div>
  );
}


