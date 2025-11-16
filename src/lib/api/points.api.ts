const API = process.env.NEXT_PUBLIC_API_URL;

// 1) 포인트 충전
export async function depositPoint(dto: { amount: number; reason?: string }) {
  const res = await fetch(`${API}/points/deposit`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) throw new Error('포인트 충전 실패');
  return res.json();
}

// 2) 포인트 출금 요청
export async function requestPointExchange(dto: {
  exchangeAmount: number;
  accountNum: string;
  bankCode: string;
}) {
  const res = await fetch(`${API}/points/exchange`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(dto),
  });

  if (!res.ok) throw new Error('환전 요청 실패');
  return res.json();
}

// 3) 포인트 출금 이력 조회
export async function getPointExchangeHistory(query: any = {}) {
  const params = new URLSearchParams(query).toString();

  const res = await fetch(`${API}/points/exchange?${params}`, {
    credentials: 'include',
  });

  if (!res.ok) throw new Error('포인트 이력 조회 실패');
  return res.json();
}
