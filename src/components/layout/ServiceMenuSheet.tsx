"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MENU_TAGS, SERVICE_MENU_ITEMS } from "@/constants/menu";

type ServiceMenuSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  onNavigate: (route: string) => void;
  onOpenNotice: (message: string) => void;
};

const TRANSITION_DURATION = 220;

export function ServiceMenuSheet({
  isOpen,
  onClose,
  userName,
  onNavigate,
  onOpenNotice,
}: ServiceMenuSheetProps) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), TRANSITION_DURATION);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`fixed inset-0 z-[60] flex justify-end bg-black/40 transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <button type="button" className="flex-1" aria-label="메뉴 닫기" onClick={onClose} />
      <div
        className={`flex h-full w-2/3 max-w-[260px] flex-col bg-white shadow-2xl transition-transform duration-200 ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-[20px] pt-[24px] pb-[12px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="메뉴닫기"
            className="flex h-[24px] w-[24px] items-center justify-center"
          >
            <Image
              src="/images/backicon.png"
              alt="메뉴닫기"
              width={12}
              height={12}
              className="-rotate-90 object-contain"
            />
          </button>
          <div className="text-center">
            <p className="text-[16px] font-semibold text-gray-900">
              {userName ? `${userName} 님` : "김우리 님"}
            </p>
          </div>
          <Image src="/images/setting.png" alt="설정" width={16} height={16} />
        </header>

        <div className="px-[20px]">
          <div className="flex items-center rounded-[12px] border border-gray-200 px-[12px]">
            <Image src="/images/readingglasses.png" alt="검색" width={13} height={13} />
            <input
              type="text"
              placeholder="메뉴, 상품 등을 검색해 보세요"
              className="ml-[8px] h-[42px] flex-1 bg-transparent text-[14px] text-gray-700 placeholder:text-gray-400 focus:outline-none"
            />
          </div>
          <div className="mt-[16px] flex flex-wrap gap-[8px] text-[12px]">
            {MENU_TAGS.map((tag) => (
              <span key={tag} className="rounded-[12px] bg-gray-100 px-[12px] py-[6px] text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <nav className="mt-[28px] flex-1 overflow-y-auto px-[20px] pb-[24px]">
          <ul className="mt-[16px] space-y-[20px] text-[16px] text-gray-800">
            {SERVICE_MENU_ITEMS.map((item) => (
              <li key={item}>
                <button
                  type="button"
                  className="w-full cursor-pointer text-left transition hover:text-primary-500"
                  onClick={() => {
                    if (item === "자동이체") {
                      onNavigate("/automaticpayment-scenario");
                      onClose();
                      return;
                    }
                    onOpenNotice(`${item} 메뉴는 준비 중입니다.`);
                  }}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}


