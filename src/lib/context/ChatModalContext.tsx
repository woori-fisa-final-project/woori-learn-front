"use client";

import { createContext, useContext, useState } from "react";

type ChatModalContextType = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

const ChatModalContext = createContext<ChatModalContextType | null>(null);

export function ChatModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ChatModalContext.Provider
      value={{
        isOpen,
        openModal: () => setIsOpen(true),
        closeModal: () => setIsOpen(false),
      }}
    >
      {children}
    </ChatModalContext.Provider>
  );
}

export function useChatModal() {
  const ctx = useContext(ChatModalContext);
  if (!ctx) throw new Error("useChatModal must be used within provider");
  return ctx;
}
