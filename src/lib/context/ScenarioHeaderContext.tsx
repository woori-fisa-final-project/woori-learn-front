"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type ScenarioHeaderContextValue = {
  onBack: (() => void) | null;
  setOnBack: (handler: (() => void) | null) => void;
};

const ScenarioHeaderContext = createContext<ScenarioHeaderContextValue | undefined>(undefined);

export function ScenarioHeaderProvider({ children }: { children: ReactNode }) {
  const [onBack, setOnBack] = useState<(() => void) | null>(null);

  const value = useMemo(
    () => ({
      onBack,
      setOnBack,
    }),
    [onBack]
  );

  return <ScenarioHeaderContext.Provider value={value}>{children}</ScenarioHeaderContext.Provider>;
}

export function useScenarioHeader() {
  const context = useContext(ScenarioHeaderContext);
  if (!context) {
    throw new Error("useScenarioHeader must be used within a ScenarioHeaderProvider");
  }
  return context;
}
