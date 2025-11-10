import ScenarioHeader from "@/components/common/ScenarioHeader";
import { ScenarioHeaderProvider } from "@/lib/context/ScenarioHeaderContext";
import type { ReactNode } from "react";

type TransferScenarioLayoutProps = {
  children: ReactNode;
};

export default function TransferScenarioLayout({
  children,
}: TransferScenarioLayoutProps) {
  return (
    <ScenarioHeaderProvider>
      <div className="flex h-[100dvh] flex-col overflow-hidden bg-white font-sans pt-[60px]">
        <ScenarioHeader/>
        <main className="flex-1 overflow-hidden">{children}</main>
      </div>
    </ScenarioHeaderProvider>
  );
}
