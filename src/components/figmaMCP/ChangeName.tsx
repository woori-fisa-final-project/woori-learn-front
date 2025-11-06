"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";

export default function ChangeName() {
  const router = useRouter();
  const [name, setName] = useState("");

  const handleBack = () => {
    router.push("/mypage");
  };

  const handleSubmit = () => {
    if (name.trim() !== "") {
      // localStorage에 이름 저장
      localStorage.setItem("userName", name.trim());
      // Profile 페이지로 이동
      router.push("/mypage");
    }
  };

  const isButtonEnabled = name.trim() !== "";

  return (
    <PageContainer>
      <PageHeader title="이름 변경하기" onBack={handleBack} />

      {/* Subtitle */}
      <div className="mt-3 flex flex-col gap-1">
        <p className="text-[18px] text-gray-700 font-semibold pt-4 leading-[1.5]">
          새롭게 이름 변경하기
        </p>
        <p className="text-[14px] text-gray-500 font-normal leading-[1.5]">
          시나리오에서 사용할 이름을 정해주세요.
        </p>
      </div>

      {/* Name Input Field */}
      <div className="mt-12 w-full">
        <Input
          label="이름"
          type="text"
          placeholder="이름을 입력해주세요."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Submit Button */}
      <div className="mt-10 w-full">
        <Button onClick={handleSubmit} disabled={!isButtonEnabled}>
          이름 변경하기
        </Button>
      </div>
    </PageContainer>
  );
}

