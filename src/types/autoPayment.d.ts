export type AutoPaymentStatus = "ACTIVE" | "CANCELLED";

export interface AutoPayment {
  id: number;
  withdrawal_account_id: number;
  deposit_number: string;
  deposit_bank_code: string;
  amount: number;
  counterparty_name: string;
  display_name?: string;
  transfer_cycle: string;
  designated_date: number;
  start_date: string;
  expiration_date: string;
  processing_status: AutoPaymentStatus;
}
