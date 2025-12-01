"use client";

  import React, { useEffect, useMemo, useState,useCallback } from "react";                                                                                                                      
  import ExchangeModal from "./ExchangeModal";
  import type { ExchangeHistoryDto } from "@/types/admin";
                                                                                                                                                                                    
  interface ExchangeItem {                                                                                                                                                          
    id: string;                                                                                                                                                                     
    userId: string;                                                                                                                                                                 
    name: string;                                                                                                                                                                   
    requestDate: string;                                                                                                                                                            
    amount: number;                                                                                                                                                                 
    status: "환전 신청" | "환전 완료" | "환전 실패";                                                                                                                                
    processedDate?: string;                                                                                                                                                         
  }                                                                                                                                                                                 
                                                                                                                                                                                    
  const API_BASE = ""; // 필요시 설정                                                                                                                                               
  const getAuthToken = () => {
    if (typeof window === "undefined") return "";
    return sessionStorage.getItem("adminToken") || "";
  };                                                                                                              
                                                                                                                                                                                    
  const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).replace(/\.\s?/g, "-").replace(/-$/, ""); 
  // "2025. 11. 28." → "2025-11-28" 비슷하게 가공
};
                                                                                                                                                                                    
  const mapDtoToItem = (d: ExchangeHistoryDto): ExchangeItem => ({
    id: String(d.id),                                                                                                                                                               
    userId: d.userId ?? "-",                                                                                                                                                        
    name: d.nickname ?? "-",                                                                                                                                                        
    requestDate: formatDate(d.createdAt),                                                                                                                                           
    amount: d.amount,                                                                                                                                                               
    status:                                                                                                                                                                         
      d.status === "APPLY"                                                                                                                                                          
        ? "환전 신청"                                                                                                                                                               
        : d.status === "SUCCESS"                                                                                                                                                    
        ? "환전 완료"                                                                                                                                                               
        : "환전 실패",                                                                                                                                                              
    processedDate: d.processedAt ? formatDate(d.processedAt) : undefined,                                                                                                           
  });                                                                                                                                                                               
                                                                                                                                                                                    
  // 화면 필터 → 서버 status 파라미터                                                                                                                                               
  // - 전체("") = WITHDRAW (환전 전체 상태)                                                                                                                                         
  // - 환전 = WITHDRAW (환전 전체 상태)                                                                                                                                             
  // - 완료 = WITHDRAW_SUCCESS                                                                                                                                                      
  const statusParamFromFilter = (filter: string) => {                                                                                                                               
    if (filter === "" || filter === "환전") return "WITHDRAW";                                                                                                                      
    if (filter === "완료" || filter === "환전 완료") return "WITHDRAW_SUCCESS";                                                                                                     
    // 필요시 "환전 신청" 추가 시: return "WITHDRAW_APPLY";                                                                                                                         
    return "WITHDRAW";                                                                                                                                                              
  };                                                                                                                                                                                
                                                                                                                                                                                    
  const ExchangeList: React.FC = () => {                                                                                                                                            
    const [exchangeList, setExchangeList] = useState<ExchangeItem[]>([]);                                                                                                           
    const [modalOpen, setModalOpen] = useState(false);                                                                                                                              
    const [selectedId, setSelectedId] = useState<string | null>(null);                                                                                                              
    const [search, setSearch] = useState("");                                                                                                                                       
    const [filter, setFilter] = useState(""); // "", "환전", "완료"                                                                                                                 
                                                                                                                                                                                    
        const loadList = useCallback(async () => {                                                                                                                                                  
      const statusParam = statusParamFromFilter(filter);
      const url = `${API_BASE}/admin/points/history?status=${statusParam}&page=1&size=20`;                                                                                          
      const res = await fetch(url, {                                                                                                                                                
        headers: {                                                                                                                                                                  
          "Content-Type": "application/json",                                                                                                                                       
          Authorization: `Bearer ${getAuthToken()}`,                                                                                                                                
        },                                                                                                                                                                          
      });                                                                                                                                                                           
      if (!res.ok) {                                                                                                                                                                
        // 권한/인증 실패 등 에러 처리 필요시 여기에                                                                                                                                
        console.error("목록 조회 실패", res.status);                                                                                                                                
        setExchangeList([]);                                                                                                                                                        
        return;                                                                                                                                                                     
      }                                                                                                                                                                             
      const json = await res.json();                                                                                                                                                
      const content = json?.data?.content ?? [];                                                                                                                                    
      // 서버가 WITHDRAW 범주 필터링을 수행함                                                                                                                                       
      setExchangeList(content.map(mapDtoToItem));                                                                                                                                   
    }, [filter]);                                                                                                                                                                              

    useEffect(() => {                                                                                                                                                               
      loadList().catch(console.error);                                                                                                                                              
    }, [loadList]);                                                                                                                                                                
                                                                                                                                                                                    
    const handleApproveClick = (id: string) => {                                                                                                                                    
      setSelectedId(id);                                                                                                                                                            
      setModalOpen(true);                                                                                                                                                           
    };                                                                                                                                                                              
                                                                                                                                                                                    
    const handleApprove = async () => {                                                                                                                                             
      if (!selectedId) return;                                                                                                                                                      
      try {                                                                                                                                                                         
        const res = await fetch(                                                                                                                                                    
          `${API_BASE}/admin/points/exchange/approve/${selectedId}`,                                                                                                                
          {                                                                                                                                                                         
            method: "PUT",                                                                                                                                                          
            headers: {                                                                                                                                                              
              "Content-Type": "application/json",                                                                                                                                   
              Authorization: `Bearer ${getAuthToken()}`,                                                                                                                            
            },                                                                                                                                                                      
          }                                                                                                                                                                         
        );                                                                                                                                                                          
        if (!res.ok) throw new Error("승인 실패");                                                                                                                                  
        await loadList();                                                                                                                                                           
      } catch (e) {
        console.error(e);
        alert("승인에 실패했습니다. 다시 시도해주세요.");
        return;
      } finally {
        setModalOpen(false);
        setSelectedId(null);
}                                                                                                                                                                             
    };                                                                                                                                                                              
                                                                                                                                                                                    
    const filteredList = useMemo(() => {                                                                                                                                            
      const keyword = search.trim().toLowerCase();
      return exchangeList.filter((item) => {                                                                                                                                        
        if (!keyword) return true;                                                                                                                                                  
        return (                                                                                                                                                                    
          (item.userId && item.userId.toLowerCase().includes(keyword)) ||
          (item.name && item.name.toLowerCase().includes(keyword))                                                                                                                  
        );                                                                                                                                                                          
      });                                                                                                                                                                           
    }, [exchangeList, search]);                                                                                                                                                     
                                                                                                                                                                                    
    return (                                                                                                                                                                        
      <div className="w-full">                                                                                                                                                      
        <h2 className="text-2xl sm:text-xl md:text-xl font-bold mb-3 sm:mb-4 md:mb-4 text-center">                                                                                  
          포인트 전환 신청 내역
        </h2>                                                                                                                                                                       
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-5 md:mb-6 w-full justify-between">                                                            
          <input                                                                                                                                                                    
            type="text"                                                                                                                                                             
            placeholder="아이디/이름 검색"
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-48 md:w-60 text-sm sm:text-base"                                                                        
            value={search}                                                                                                                                                          
            onChange={(e) => setSearch(e.target.value)}                                                                                                                             
          />
          <select                                                                                                                                                                   
            className="border border-gray-300 rounded px-3 py-2 w-full sm:w-auto text-sm sm:text-base"                                                                              
            value={filter}                                                                                                                                                          
            onChange={(e) => setFilter(e.target.value)}                                                                                                                             
          >                                                                                                                                                                         
            <option value="">전체</option>                                                                                                                                          
            <option value="환전">환전</option>                                                                                                                                      
            <option value="완료">완료</option>                                                                                                                                      
          </select>                                                                                                                                                                 
        </div>
        <div className="rounded-lg shadow bg-white p-4 sm:p-6 md:p-8 w-full overflow-x-auto">                                                                                       
          <table className="table-auto w-full border-collapse border border-gray-200 bg-white min-w-[800px]">                                                                       
            <thead>                                                                                                                                                                 
              <tr className="bg-gray-100">                                                                                                                                          
                <th className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base">
                  회원 ID                                                                                                                                                           
                </th>                                                                                                                                                               
                <th className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base">                                                                           
                  이름
                </th>                                                                                                                                                               
                <th className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base hidden md:table-cell">                                                      
                  신청일자                                                                                                                                                          
                </th>                                                                                                                                                               
                <th className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base">                                                                           
                  신청금액                                                                                                                                                          
                </th>                                                                                                                                                               
                <th className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base">                                                                           
                  처리상태                                                                                                                                                          
                </th>
                <th className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base hidden lg:table-cell">                                                      
                  처리일자                                                                                                                                                          
                </th>                                                                                                                                                               
                <th className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base w-20 sm:w-24">                                                              
                  관리
                </th>                                                                                                                                                               
              </tr>                                                                                                                                                                 
            </thead>                                                                                                                                                                
            <tbody>                                                                                                                                                                 
              {filteredList.map((item) => (                                                                                                                                         
                <tr                                                                                                                                                                 
                  key={item.id}                                                                                                                                                     
                  className="hover:bg-primary-50 transition-colors"                                                                                                                 
                >                                                                                                                                                                   
                  <td className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base">
                    {item.userId}                                                                                                                                                   
                  </td>                                                                                                                                                             
                  <td className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base">                                           
                    {item.name}                                                                                                                                                     
                  </td>                                                                                                                                                             
                  <td className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base hidden md:table-cell">                      
                    {item.requestDate}                                                                                                                                              
                  </td>                                                                                                                                                             
                  <td className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base">                                           
                    {item.amount?.toLocaleString()}원                                                                                                                               
                  </td>                                                                                                                                                             
                  <td className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base">                                           
                    {item.status}                                                                                                                                                   
                  </td>
                  <td className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center whitespace-nowrap text-xs sm:text-sm md:text-base hidden lg:table-cell">                      
                    {item.processedDate || "-"}                                                                                                                                     
                  </td>                                                                                                                                                             
                  <td className="border px-2 sm:px-3 md:px-4 py-2 sm:py-3 text-center w-20 sm:w-24 whitespace-nowrap">                                                              
                    {item.status === "환전 신청" && (
                      <button                                                                                                                                                       
                        className="px-2 sm:px-3 py-1 bg-primary-400 text-white rounded hover:bg-primary-600 transition-colors text-xs sm:text-sm"                                   
                        onClick={() => handleApproveClick(item.id)}                                                                                                                 
                      >                                                                                                                                                             
                        승인                                                                                                                                                        
                      </button>                                                                                                                                                     
                    )}                                                                                                                                                              
                  </td>                                                                                                                                                             
                </tr>
              ))}                                                                                                                                                                   
              {filteredList.length === 0 && (                                                                                                                                       
                <tr>                                                                                                                                                                
                  <td                                                                                                                                                               
                    className="border px-4 py-6 text-center text-sm text-gray-500"
                    colSpan={7}                                                                                                                                                     
                  >                                                                                                                                                                 
                    표시할 내역이 없습니다.                                                                                                                                         
                  </td>                                                                                                                                                             
                </tr>                                                                                                                                                               
              )}                                                                                                                                                                    
            </tbody>                                                                                                                                                                
          </table>                                                                                                                                                                  
        </div>
        <ExchangeModal                                                                                                                                                              
          open={modalOpen}                                                                                                                                                          
          onClose={() => setModalOpen(false)}                                                                                                                                       
          onApprove={handleApprove}                                                                                                                                                 
        />
      </div>                                                                                                                                                                        
    );                                                                                                                                                                              
  };                                                                                                                                                                                
                                                                                                                                                                                    
  export default ExchangeList;                                                                                                                                                      
 
