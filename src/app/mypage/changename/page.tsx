"use client"; // 클라이언트 컴포넌트로 선언해 상태 및 라우터 기능을 사용할 수 있게 합니다.

import { useRouter } from "next/navigation"; // 페이지 이동을 위해 Next.js 라우터 훅을 불러옵니다.
import { useState } from "react"; // 입력값 상태를 관리하기 위해 React useState를 사용합니다.
import Input from "@/components/common/Input"; // 공통 입력 필드를 불러옵니다.
import Button from "@/components/common/Button"; // 공통 버튼 컴포넌트를 사용합니다.
import PageHeader from "@/components/common/PageHeader"; // 상단 헤더 UI를 구성하는 공통 컴포넌트입니다.
import PageContainer from "@/components/common/PageContainer"; // 페이지 레이아웃을 감싸는 공통 컨테이너입니다.
import { useUserData } from "@/lib/hooks/useUserData"; // 사용자 데이터 저장/갱신을 담당하는 커스텀 훅입니다.
import { changeName } from "./changeName";

export default function ChangeNamePage() {
  const router = useRouter(); // 라우터 인스턴스를 가져와 다른 페이지로 이동할 때 사용합니다.
  const [name, setName] = useState(""); // 입력 필드에 연결된 이름 상태를 관리합니다.
  const { updateUserName } = useUserData(); // 사용자 이름을 저장/갱신하는 함수를 가져옵니다.

  const handleBack = () => {
    router.push("/mypage"); // 뒤로가기 버튼 클릭 시 마이페이지로 이동합니다.
  };

  const handleSubmit = async() => {
    const newName = name.trim();
    if (!newName) return;

    try{
      await changeName(newName);
      updateUserName(name.trim()); // 앞뒤 공백을 제거한 후 이름을 저장합니다.
      router.push("/mypage"); // 저장이 완료되면 마이페이지로 돌아갑니다.
    }catch (err) {
      alert("이름 변경에 실패했습니다.");
      console.error(err);
    }
  };

  const isButtonEnabled = name.trim() !== ""; // 입력값이 있을 때만 버튼을 활성화합니다.

  return (
    <PageContainer>
      <PageHeader title="이름 변경하기" onBack={handleBack} /> {/* 상단 헤더: 제목과 뒤로가기 버튼 */}

      <div className="mt-3 flex flex-col gap-1">
        <p className="pt-4 text-[18px] font-semibold leading-normal text-gray-700">
          새롭게 이름 변경하기
        </p>
        <p className="text-[14px] font-normal leading-normal text-gray-500">
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



