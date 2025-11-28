import "../styles/globals.css";
import type { Metadata } from "next";
import { TransferFlowProvider } from "@/lib/hooks/useTransferFlow"; // ⭐ 추가

export const metadata: Metadata = {
  title: "WooriLearn",
  description: "Splash test",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="overflow-x-hidden">
        {/* ⭐ 반드시 Provider로 감싸야 모든 페이지가 useTransferFlow 사용 가능 */}
        <TransferFlowProvider>
          {children}
        </TransferFlowProvider>
      </body>
    </html>
  );
}
