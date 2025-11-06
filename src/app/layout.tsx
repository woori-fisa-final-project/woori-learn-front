import "./globals.css";
import type { Metadata } from "next";

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
      <body className="overflow-x-hidden">{children}</body>
    </html>
  );
}
