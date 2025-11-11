import ScenarioLayout from "@/components/scenario/ScenarioLayout";
import type { ReactNode } from "react";

type AutomaticPaymentScenarioLayoutProps = {
  children: ReactNode;
};

export default function AutomaticPaymentScenarioLayout({
  children,
}: AutomaticPaymentScenarioLayoutProps) {
  return <ScenarioLayout>{children}</ScenarioLayout>;
}

