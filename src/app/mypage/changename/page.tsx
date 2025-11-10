"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PageHeader from "@/components/common/PageHeader";
import PageContainer from "@/components/common/PageContainer";
import { useUserData } from "@/lib/hooks/useUserData";

export default function ChangeNamePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const { updateUserName } = useUserData();

  const handleBack = () => {
    router.push("/mypage");
  };

  const handleSubmit = () => {
    if (name.trim() !== "") {
      updateUserName(name.trim());
      router.push("/mypage");
    }
  };

  const isButtonEnabled = name.trim() !== "";

  return (
    <PageContainer>
      <PageHeader title="이름 변경하기" onBack={handleBack} />

      <div className="mt-3 flex flex-col gap-1">
        <p className="pt-4 text-[18px] font-semibold leading-[1.5] text-gray-700">
          새롭게 이름 변경하기
        </p>
        <p className="text-[14px] font-normal leading-[1.5] text-gray-500">
          시나리오에서 사용할 이름을 정해주세요.
        </p>
      </div>

      <div className="mt-12 w-full">
        <Input
          label="이름"
          type="text"
          placeholder="이름을 입력해주세요."
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </div>

      <div className="mt-10 w-full">
        <Button onClick={handleSubmit} disabled={!isButtonEnabled}>
          이름 변경하기
        </Button>
      </div>
    </PageContainer>
  );
}



