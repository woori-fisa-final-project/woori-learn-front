import { redirect } from "next/navigation"; // Next.js에서 페이지를 다른 경로로 즉시 이동시키기 위한 함수입니다.

export default function PointsPage() {
  redirect("/points/list"); // /points 경로에 접근하면 포인트 내역 페이지로 리다이렉트합니다.
}



