// src/types/autoPayment.d.ts

export type AutoPaymentStatus = "ACTIVE" | "CANCELLED"; 

export interface AutoPayment {
  id: number;
  educationalAccountId: number;          
  depositNumber: string;                  
  depositBankCode: string;               
  amount: number;
  counterpartyName: string;               
  displayName?: string;                   
  transferCycle: number;                  
  designatedDate: number;                 
  startDate: string;                      
  expirationDate: string;                 
  processingStatus: AutoPaymentStatus;    
}

// 목록 조회 파라미터
export interface AutoPaymentListParams {
  educationalAccountId: number;
  status?: string;  // "ACTIVE" | "CANCELLED" | "ALL"
}

// 등록 요청
export interface AutoPaymentCreateRequest {
  educationalAccountId: number;
  depositBankCode: string;
  depositNumber: string;
  amount: number;
  counterpartyName: string;
  displayName: string;
  transferCycle: number;
  designatedDate: number;
  startDate: string;           // yyyy-MM-dd
  expirationDate: string;      // yyyy-MM-dd
  accountPassword: string;     // 4자리
}

// API 응답
export interface AutoPaymentResponse {
  code: number;
  message: string;
  data: AutoPayment | AutoPayment[];
}