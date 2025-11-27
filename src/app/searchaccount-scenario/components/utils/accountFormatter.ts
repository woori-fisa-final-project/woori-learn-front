export const formatAccountNumber = (num: string): string => {
  const d = num.replace(/\D/g, "");
  if (d.length === 10)
    return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
  return num;
};

export const formatBalance = (balance: number): string =>
  `${balance.toLocaleString("ko-KR")}원`;
