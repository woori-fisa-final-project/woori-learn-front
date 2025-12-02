"use client";

import { useChatModal } from "@/lib/context/ChatModalContext";
import { useState } from "react";

// 🔥 반드시 타입 선언!
type ChatMessage = {
  role: "user" | "assistant";
  text: string;
};

export default function ChatModal() {
  const { isOpen, closeModal } = useChatModal();

  // 🔥 messages에 타입 지정!
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center bg-black/60">
      <div
        className="bg-white rounded-2xl w-[90%] max-w-[420px] h-[70%] flex flex-col shadow-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 메시지 렌더링 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-3 py-2 rounded-xl max-w-[65%] leading-relaxed 
                  ${m.role === "user" ? "bg-[#FEE500]" : "bg-gray-200"}
                `}
                style={{
                  borderRadius:
                    m.role === "user"
                      ? "18px 0px 18px 18px"
                      : "0px 18px 18px 18px",
                }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* 입력창 */}
        <form
          className="p-4 border-t flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;

            const newMsg: ChatMessage = {
              role: "user",
              text: input,
            };

            setMessages((prev) => [...prev, newMsg]);
            setInput("");

            // AI 응답(임시)
            setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                { role: "assistant", text: "위비가 답변 중입니다..." },
              ]);
            }, 500);
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            type="submit"
          >
            보내기
          </button>
        </form>
      </div>
    </div>
  );
}
