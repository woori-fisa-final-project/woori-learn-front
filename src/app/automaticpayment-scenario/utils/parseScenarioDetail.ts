import { formatDate } from "@/lib/utils/formatDate";
import type { ReadonlyURLSearchParams } from "next/navigation";
import type { Scenario18Detail } from "../components/Scenario18";
import { formatDateRange } from "@/lib/utils/formatDateRange";

export function parseScenarioDetail(searchParams: URLSearchParams | ReadonlyURLSearchParams): Scenario18Detail {
  const status = searchParams.get("status") ?? "정상";
  const title = searchParams.get("title") ?? "타행자동이체";
  const bankName = searchParams.get("bankName") ?? "국민은행";
  const bankAccount = searchParams.get("bankAccount") ?? "-";
  const amount = searchParams.get("amount") ?? "0원";
  const transferDay =
    searchParams.get("transferDay") ?? searchParams.get("schedule")?.split("/")[0] ?? "-";
  const frequency =
    searchParams.get("frequency") ?? searchParams.get("schedule")?.split("/")[1] ?? "-";
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const ownerName = searchParams.get("ownerName") ?? "김우리";
  const recipientName = searchParams.get("recipientName") ?? "나누구";
  const registerDateRaw = searchParams.get("registerDate");
  const sourceAccountBank = searchParams.get("sourceAccountBank") ?? "우리은행";
  const sourceAccountNumber = searchParams.get("sourceAccountNumber") ?? "-";

  const period = formatDateRange(startDate ?? undefined, endDate ?? undefined);
  const registerDate = registerDateRaw ? formatDate(registerDateRaw) : formatDate(new Date());

  return {
    status,
    title,
    amount,
    transferDay,
    frequency,
    period,
    ownerName,
    recipientName,
    registerDate,
    sourceAccount: `${sourceAccountBank} · ${sourceAccountNumber}`,
    inboundAccount: `${bankName} · ${bankAccount}`,
  };
}


