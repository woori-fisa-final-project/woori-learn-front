"use client"; // 클라이언트 환경에서만 동작하도록 지정하여 React 훅을 안전하게 사용할 수 있습니다.

import { createContext, useContext, useMemo, useState, type ReactNode } from "react"; // 컨텍스트 생성 및 상태 관리에 필요한 React API들을 가져옵니다.

type ScenarioHeaderContextValue = {
  onBack: (() => void) | null; // 헤더의 뒤로가기 버튼에 연결될 함수입니다.
  setOnBack: (handler: (() => void) | null) => void; // 뒤로가기 함수 등록 또는 해제를 위한 setter입니다.
};

const ScenarioHeaderContext = createContext<ScenarioHeaderContextValue | undefined>(undefined); // 기본값을 undefined로 두어 프로바이더 없이 사용 시 오류를 발생시킵니다.

export function ScenarioHeaderProvider({ children }: { children: ReactNode }) {
  const [onBack, setOnBack] = useState<(() => void) | null>(null); // 현재 등록된 뒤로가기 핸들러를 상태로 관리합니다.

  const value = useMemo(
    () => ({
      onBack,
      setOnBack,
    }),
    [onBack]
  );

  return <ScenarioHeaderContext.Provider value={value}>{children}</ScenarioHeaderContext.Provider>; // 컨텍스트 값으로 자식 컴포넌트를 감싸서 어디서든 뒤로가기 핸들러를 설정할 수 있게 합니다.
}

export function useScenarioHeader() {
  const context = useContext(ScenarioHeaderContext); // 컨텍스트 값을 읽어 현재 설정된 뒤로가기 핸들러를 가져옵니다.
  if (!context) {
    throw new Error("useScenarioHeader must be used within a ScenarioHeaderProvider"); // 프로바이더 외부에서 사용될 경우 명확한 오류를 던집니다.
  }
  return context;
}
