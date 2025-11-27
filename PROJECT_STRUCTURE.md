# WooriLearn Frontend 프로젝트 구조 문서

## 📁 전체 디렉토리 구조

```
woori-learn-front/
├── public/                    # 정적 파일 (이미지, JSON 등)
│   ├── images/               # 이미지 파일들
│   │   └── scenario/        # 시나리오 관련 이미지
│   └── data/                # JSON 데이터 파일
├── src/
│   ├── app/                 # Next.js App Router 페이지
│   ├── components/          # React 컴포넌트
│   ├── lib/                 # 라이브러리, 유틸리티, 훅
│   ├── types/               # TypeScript 타입 정의
│   ├── utils/               # 유틸리티 함수
│   ├── constants/           # 상수 정의
│   └── styles/              # 전역 스타일
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── next.config.ts
```

---

## 📂 src/app/ - 페이지 라우팅

### 인증 관련 (Route Group: `(auth)`)
```
(auth)/
├── login/page.tsx          # 로그인 페이지
└── signup/page.tsx         # 회원가입 페이지
```

### 교육 관련 (Route Group: `(education)`)
```
(education)/
├── progress/page.tsx       # 학습 진행도 페이지
└── scenario/
    ├── page.tsx            # 시나리오 목록 페이지
    └── [scenarioId]/
        └── page.tsx        # 동적 시나리오 진행 페이지 (통합 시나리오 엔진 사용)
```

### 시나리오별 페이지 (레거시 구조)
```
transfer-scenario/          # 이체 시나리오
├── layout.tsx
├── page.tsx               # 시나리오 메인 페이지
└── components/
    ├── Scenario1.tsx ~ Scenario7.tsx
    └── ScenarioContainer.tsx

searchaccount-scenario/     # 계좌조회 시나리오
├── layout.tsx
├── page.tsx
└── components/
    ├── Scenario8.tsx
    ├── Scenario9.tsx
    └── Scenario10.tsx

automaticpayment-scenario/  # 자동이체 시나리오
├── layout.tsx
├── page.tsx
└── components/
    ├── Scenario11.tsx ~ Scenario19.tsx
    └── types.ts
```

### 기타 페이지
```
├── page.tsx                # 루트 페이지 (Splash 화면)
├── layout.tsx              # 루트 레이아웃 (전역 레이아웃)
├── home/page.tsx           # 홈 페이지
├── mypage/                  # 마이페이지
│   ├── page.tsx
│   ├── changename/page.tsx
│   └── password/page.tsx
├── points/                  # 포인트 관련
│   ├── page.tsx
│   ├── exchange/page.tsx
│   └── list/page.tsx
├── account/                 # 계좌 개설
│   └── open/auth/
│       ├── page.tsx
│       └── components/
│           └── Step1AuthName.tsx ~ Step8Complete.tsx
├── quiz/                    # 퀴즈
│   ├── layout.tsx
│   └── page.tsx
└── woorimain/page.tsx      # 우리은행 메인
```

---

## 📂 src/components/ - 컴포넌트

### 공통 컴포넌트 (`common/`)
```
common/
├── AccountInfoBlock.tsx     # 계좌 정보 블록
├── AgreementAllButton.tsx  # 전체 동의 버튼
├── AgreementDetail.tsx     # 약관 상세
├── AgreementItem.tsx       # 약관 항목
├── AgreementModal.tsx      # 약관 모달
├── BottomSheet.tsx         # 바텀시트
├── Button.tsx              # 버튼
├── CheckIcon.tsx           # 체크 아이콘
├── ExitModal.tsx           # 종료 모달
├── FilterBottomSheet.tsx   # 필터 바텀시트
├── InfoRow.tsx             # 정보 행
├── Input.tsx                # 입력 필드
├── Modal.tsx                # 모달
├── NumericKeypad.tsx       # 숫자 키패드
├── Overlay.tsx              # 오버레이
├── PageContainer.tsx        # 페이지 컨테이너
├── PageHeader.tsx           # 페이지 헤더
├── PasswordBottomSheet.tsx  # 비밀번호 바텀시트
├── PasswordToggleIcon.tsx   # 비밀번호 토글 아이콘
├── PointHistoryCard.tsx     # 포인트 내역 카드
├── ProgressBar.tsx          # 진행 바
├── ProgressCard.tsx         # 진행 카드
├── ScenarioHeader.tsx      # 시나리오 헤더 (뒤로가기, 종료 등)
├── ServiceCard.tsx          # 서비스 카드
├── ServiceCardGrid.tsx     # 서비스 카드 그리드
├── StepHeader.tsx           # 스텝 헤더
└── VerificationCodeInput.tsx # 인증 코드 입력
```

### 시나리오 컴포넌트 (`scenario/`)
```
scenario/
├── ScenarioLayout.tsx       # 시나리오 공통 레이아웃 (헤더 포함)
├── ScenarioRenderer.tsx     # 시나리오 스텝 타입별 렌더러
├── character/
│   └── Weebee.tsx          # 위비 캐릭터 컴포넌트
└── step/                    # 시나리오 스텝 타입별 컴포넌트
    ├── ChoiceStep.tsx      # 선택 스텝
    ├── DialogStep.tsx      # 대화 스텝
    ├── ImageStep.tsx        # 이미지 스텝
    ├── ModalStep.tsx        # 모달 스텝
    ├── OverlayStep.tsx      # 오버레이 스텝
    └── PracticeStep.tsx     # 실습 스텝 (PRACTICE 타입)
```

### 기타 컴포넌트
```
├── layout/
│   └── ServiceMenuSheet.tsx # 서비스 메뉴 시트
└── quiz/
    └── QuizScreen.tsx       # 퀴즈 화면
```

---

## 📂 src/lib/ - 라이브러리 및 로직

### API 클라이언트 (`api/`)
```
api/
├── account.ts              # 계좌 관련 API
├── autoPayment.ts          # 자동이체 관련 API
└── scenario.ts             # 시나리오 관련 API
```

### 컨텍스트 (`context/`)
```
context/
└── ScenarioHeaderContext.tsx  # 시나리오 헤더 상태 관리 (뒤로가기 로직 등)
```

### 커스텀 훅 (`hooks/`)
```
hooks/
├── useAccountData.ts           # 계좌 데이터 훅
├── useAccountSelection.ts      # 계좌 선택 훅
├── useAutoPaymentRegistration.ts  # 자동이체 등록 훅
├── useAutoPaymentSteps.ts      # 자동이체 스텝 훅
├── usePageFocusRefresh.ts      # 페이지 포커스 새로고침 훅
├── useScenarioBackgroundClick.ts  # 시나리오 배경 클릭 훅
├── useScenarioEngine.ts         # ⭐ 시나리오 엔진 (핵심 훅)
├── useScenarioTrigger.ts        # 시나리오 트리거 훅
├── useStepValidation.ts          # 스텝 검증 훅
├── useTransferFlow.tsx          # 이체 플로우 훅
└── useUserData.ts               # 사용자 데이터 훅
```

### Mock 데이터 (`mocks/`)
```
mocks/
├── mockNextStep.ts          # 다음 스텝 Mock 응답
└── scenarioMock.ts          # 시나리오 Mock 데이터 (scenarioMockMap)
```

---

## 📂 src/types/ - TypeScript 타입 정의

```
types/
├── account.d.ts            # 계좌 타입
├── autoPayment.d.ts        # 자동이체 타입
├── bank.d.ts               # 은행 타입
├── education.d.ts           # 교육 관련 타입 (ScenarioProgress, ScenarioCompleted)
├── index.d.ts              # 타입 export 통합
├── point.d.ts              # 포인트 타입
├── scenario.d.ts           # 시나리오 타입 (레거시)
├── scenario.ts             # ⭐ 시나리오 타입 (신규: StepType, ScenarioStep, ScenarioData 등)
├── system.d.ts             # 시스템 타입
├── transaction.d.ts        # 거래 타입
└── user.d.ts               # 사용자 타입
```

---

## 📂 src/utils/ - 유틸리티 함수

```
utils/
├── accountUtils.ts          # 계좌 유틸리티
├── authUtils.ts             # 인증 유틸리티
├── autoPaymentConverter.ts # 자동이체 변환기
├── bankUtils.ts            # 은행 유틸리티
├── dateUtils.ts            # 날짜 유틸리티
├── formatDate.ts            # 날짜 포맷팅
├── formatDateRange.ts       # 날짜 범위 포맷팅
├── logger.ts                # 로거
├── numberUtils.ts           # 숫자 유틸리티
└── parseScenarioDetail.ts   # 시나리오 상세 파싱
```

---

## 📂 src/constants/ - 상수

```
constants/
├── menu.ts                  # 메뉴 상수
└── points.ts                # 포인트 상수
```

---

## 🔑 핵심 아키텍처

### 1. 시나리오 시스템 (2가지 구조)

#### A. 통합 시나리오 엔진 (신규)
- **경로**: `app/(education)/scenario/[scenarioId]/page.tsx`
- **엔진**: `lib/hooks/useScenarioEngine.ts`
- **특징**:
  - Mock/API 자동 전환 (`USE_MOCK` 플래그)
  - Step 타입별 자동 렌더링 (`ScenarioRenderer`)
  - 재개 기능 (`resume()`)
  - 다음 스텝 자동 이동 (`nextStep()`)

#### B. 레거시 시나리오 (기존)
- **경로**: 
  - `app/transfer-scenario/`
  - `app/searchaccount-scenario/`
  - `app/automaticpayment-scenario/`
- **특징**:
  - 각 시나리오별 독립적인 컴포넌트
  - Scenario1.tsx, Scenario2.tsx 형태로 수동 관리
  - 각 페이지에서 직접 라우팅 처리

### 2. 시나리오 Step 타입

```typescript
type StepType = 
  | "IMAGE"      // 이미지 표시
  | "DIALOG"     // 대화 (위비 캐릭터)
  | "OVERLAY"    // 오버레이 (이전 스텝 위에 표시)
  | "CHOICE"     // 선택지
  | "MODAL"      // 모달
  | "PRACTICE"   // 실습 (실제 기능 화면)
```

### 3. 데이터 흐름

```
[시나리오 시작]
  ↓
useScenarioEngine.start(scenarioId)
  ↓
loadScenario() → Mock 또는 API 호출
  ↓
ScenarioData 파싱
  ↓
currentStepId 설정
  ↓
ScenarioRenderer → Step 타입별 컴포넌트 렌더링
  ↓
사용자 상호작용 (클릭, 선택 등)
  ↓
nextStep() 또는 goToStep()
  ↓
다음 Step으로 이동
```

### 4. 주요 의존성

- **Next.js 16.0.1** (App Router)
- **React 19.2.0**
- **TypeScript 5**
- **Tailwind CSS 4**

---

## 📝 주요 파일 역할

### 시나리오 관련 핵심 파일

1. **`lib/hooks/useScenarioEngine.ts`**
   - 시나리오 진행 상태 관리
   - Mock/API 전환 로직
   - Step 이동 로직

2. **`components/scenario/ScenarioRenderer.tsx`**
   - Step 타입별 컴포넌트 라우팅
   - IMAGE → ImageStep, DIALOG → DialogStep 등

3. **`components/scenario/ScenarioLayout.tsx`**
   - 시나리오 공통 레이아웃
   - ScenarioHeader 포함
   - 100dvh 높이, 흰 배경

4. **`app/(education)/scenario/[scenarioId]/page.tsx`**
   - 통합 시나리오 진행 페이지
   - useScenarioEngine 사용
   - ScenarioRenderer로 렌더링

5. **`lib/mocks/scenarioMock.ts`**
   - 시나리오 Mock 데이터
   - scenarioMockMap 형태로 저장

6. **`types/scenario.ts`**
   - StepType, ScenarioStep, ScenarioData 타입 정의

---

## 🔄 현재 구조의 특징

### 장점
- ✅ 통합 시나리오 엔진으로 재사용성 높음
- ✅ Step 타입별 컴포넌트 분리로 유지보수 용이
- ✅ Mock/API 전환을 한 곳에서 관리
- ✅ 타입 안정성 (TypeScript)

### 개선 가능 영역
- ⚠️ 레거시 시나리오와 통합 시나리오 엔진이 공존
- ⚠️ 시나리오별로 다른 라우팅 방식 사용
- ⚠️ 전역 재개 화면 로직 미구현 (현재 요구사항)

---

## 📌 참고사항

- **Route Groups**: `(auth)`, `(education)`는 URL에 포함되지 않는 그룹
- **Dynamic Routes**: `[scenarioId]`는 동적 라우트 파라미터
- **Layout Files**: 각 디렉토리의 `layout.tsx`는 해당 경로의 공통 레이아웃
- **Client Components**: `"use client"` 지시어가 있는 파일만 클라이언트 컴포넌트

---

*이 문서는 프로젝트 구조를 이해하기 쉽게 정리한 것입니다. 코드는 변경하지 않았습니다.*