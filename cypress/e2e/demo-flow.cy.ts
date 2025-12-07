describe('우리런 발표 시연 플로우', () => {
  // 타임스탬프를 사용해 매번 새로운 유니크한 계정 생성
  const timestamp = Date.now()
  const userName = '홍길동'
  const userId = `test${timestamp}`
  const userEmail = `test${timestamp}@example.com`
  const userPassword = 'Test1234!'

  beforeEach(() => {
    // 각 테스트 전에 쿠키와 로컬 스토리지 초기화
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('전체 서비스 플로우를 자동으로 시연합니다', () => {
    // 테스트 전역 변수
    let newAccountNumber = null
    let currentPoints = 5000 // 회원가입 시 받은 초기 포인트
    let accountCreated = false
    let pointsAfterExchange = currentPoints

    // 1. 스플래시 화면
    cy.visit('/')
    cy.wait(3000) // 스플래시 화면 보여주기

    // 2. 로그인 화면으로 자동 이동 (2.5초 후)
    cy.url().should('include', '/login')
    cy.wait(1500)

    // 3. 회원가입하기 링크 클릭
    cy.contains('a', '회원가입하기').click()
    cy.wait(1500)

    // 4. 회원가입 페이지
    cy.url().should('include', '/signup')
    cy.wait(1000)

    // 5. 이름 입력
    cy.get('input[placeholder="이름을 입력해주세요"]').clear().type(userName, { delay: 50 })
    cy.wait(800)

    // 6. 아이디 입력
    cy.get('input[placeholder="아이디를 입력해주세요"]').clear().type(userId, { delay: 50 })
    cy.wait(800)

    // 7. 중복 확인 버튼 클릭
    cy.contains('button', '중복 확인').click()
    cy.wait(1500)

    // 8. 비밀번호 입력 (첫 번째)
    cy.get('input[placeholder="비밀번호를 입력해주세요"]').clear().type(userPassword, { delay: 50 })
    cy.wait(800)

    // 9. 비밀번호 재입력
    cy.get('input[placeholder="비밀번호를 다시 입력해주세요"]').clear().type(userPassword, { delay: 50 })
    cy.wait(800)

    // 10. 이메일 입력
    cy.get('input[placeholder="이메일을 입력해주세요"]').clear().type(userEmail, { delay: 50 })
    cy.wait(800)

    // 11. 회원가입 버튼 클릭
    cy.contains('button', '회원가입').click()
    cy.wait(3000) // 회원가입 처리 대기

    // 12. 이메일 인증 페이지로 이동됨
    cy.url().should('include', '/signup/verify')
    cy.wait(3000) // 인증 페이지 표시

    // 13. 확인 버튼 클릭
    cy.contains('button', '확인').click()
    cy.wait(3000) // 확인 처리

    // 14. 로그인 페이지로 이동됨
    cy.url().should('include', '/login')
    cy.wait(2000)

    // 15. 로그인 진행 (방금 가입한 계정으로)
    cy.get('input[type="text"]').clear().type(userId, { delay: 50 })
    cy.wait(500)
    cy.get('input[type="password"]').clear().type(userPassword, { delay: 50 })
    cy.wait(500)

    // 로그인 버튼 클릭
    cy.contains('button', '로그인').click()
    cy.wait(3000) // 로그인 처리 대기

    // 16. 홈 화면
    cy.url().should('include', '/home')
    cy.wait(4000) // 홈 화면 충분히 보여주기

    // 17. 조회·이체 카드 클릭
    cy.contains('조회·이체').click()
    cy.wait(3000) // 대기 시간 늘림

    // 18. 우리메인 페이지
    cy.url().should('include', '/woorimain')
    cy.wait(3000)

    // 우리메인 시나리오 진행 (IMAGE, DIALOG, OVERLAY, MODAL, CHOICE)
    // 1001: IMAGE (message1)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
      cy.wait(3000)

    // 1002: DIALOG (위비 hi)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1003: DIALOG (위비 worried)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1004: CHOICE - 첫 번째 선택지 선택
    cy.contains('button', '아! 깜빡했어').click()
    cy.wait(3000)

    // 1005: DIALOG (위비 aha)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1006: DIALOG (위비)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1007: CHOICE - 첫 번째 선택지 선택
    cy.contains('button', '좋아! 알려줘').click()
    cy.wait(1200)

    // 1009: OVERLAY (위비 stick)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1010: MODAL
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(3000)

    // 1011: OVERLAY (위비 stick) - 이체 버튼 찾기
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // ========================================
    // 송금 시나리오 - 이체 버튼 클릭
    // ========================================

    // 1012: PRACTICE - 이체 버튼 클릭
     cy.contains('button', '이체').click({ scrollBehavior: false, force: true })
     cy.wait(2000)

    // 20. 송금 시나리오 페이지 진입
    cy.url().should('include', '/transfer-scenario')
    cy.wait(2000)

    // 송금 시나리오 진행 (OVERLAY, MODAL 스킵)
    // 1013: OVERLAY (위비) - 계좌 정보 입력
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
      cy.wait(1200)

    // 1014: OVERLAY (위비) - 계좌번호 안내
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1015: PRACTICE - 계좌번호입력 버튼 클릭
    cy.wait(1500)

    // 21. 계좌번호입력 버튼 클릭
    cy.contains('계좌번호입력').click()
    cy.wait(1500)

    // 1016: PRACTICE - 은행 선택 바텀시트
    cy.wait(1000)

    // 22. 은행 선택 (국민은행)
    cy.contains('button', '국민은행').click()
    cy.wait(1500)

    // 1017: PRACTICE - 계좌번호 입력 (배드 브랜치는 나중에 발생)
    // 계좌번호 입력 필드가 나타날 때까지 대기
    cy.get('input[placeholder="입력"]', { timeout: 10000 }).should('be.visible')
    cy.wait(500)

    // 👎 BAD BRANCH 준비: 잘못된 계좌번호 입력 (배드 브랜치는 이체 시도 후 발생)
    cy.log('=== BAD BRANCH 준비: 잘못된 계좌번호 입력 ===')
    cy.get('input[placeholder="입력"]').clear().type('999-999-999999', { delay: 100 })
    cy.wait(1000)

    // 23. 다음 버튼 클릭
    cy.contains('button', '다음').click()
    cy.wait(1500)

    // 1018: OVERLAY (위비 aha) - 금액 입력 안내
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1019: PRACTICE - 금액 입력 (50만원 = 500000원)
    cy.wait(1000) // 금액 입력 화면 로드 대기

    // 24. 키패드에서 5, 0, 0, 0, 0, 0 입력
    cy.get('[data-testid="amount-keypad-5"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(500)
    cy.contains('button', '확인').click({ force: true })
    cy.wait(1500)

    // 1020: OVERLAY (위비 aha) - 비밀번호 입력 안내
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1021: OVERLAY (user) - 왜 그렇게 나오는지 질문
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1022: OVERLAY (위비) - 키패드 보안 설명
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1023: MODAL - 금융 보안 꿀팁
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // MODAL 닫힌 후 추가 클릭 (혹시 남은 오버레이)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(2000)

    // 1024: PRACTICE - 비밀번호 입력 (1234)
    // 비밀번호 시트가 완전히 열릴 때까지 대기
    cy.wait(1500)
    cy.contains('계좌 비밀번호를 입력해주세요', { timeout: 10000 }).should('be.visible')
    cy.wait(1500)

    // 25. data-testid를 사용하여 랜덤 키패드에서 정확한 숫자 버튼 클릭
    cy.get('[data-testid="keypad-1"]', { timeout: 10000 }).should('be.visible')
    cy.wait(500)
    cy.get('[data-testid="keypad-1"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-2"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-3"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-4"]').click({ force: true })
    cy.wait(2500) // 자동 제출 대기

    // 1025: OVERLAY (위비 hi) - 계좌번호/금액 확인 안내
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1026: PRACTICE - 이체 확인 화면
    cy.wait(1000)

    // 26. 이체 버튼 클릭 (잘못된 계좌번호로 인해 배드 브랜치 발생)
    cy.contains('button', '이체').should('be.visible').click()
    cy.wait(3000) // 이체 API 처리 대기

    // 👎 BAD BRANCH: 계좌번호 오류로 인한 배드 브랜치
    cy.log('=== BAD BRANCH: 계좌번호 오류 감지 ===')

    // Step 1327: 배드 브랜치 다이얼로그 (이체가... 완료됐어. 그런데...)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(3000)

    // Step 1328 or 1338: 구체적인 오류 내용 표시
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 오류 상세 다이얼로그들
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // Step 1342: "신중하게! 다시 한 번 시도해보자"
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(2000)

    // ✅ GOOD BRANCH: "틀린 부분부터 다시하기" 버튼 클릭
    cy.log('=== GOOD BRANCH: 틀린 부분부터 다시하기 ===')
    cy.contains('button', '틀린 부분부터 다시하기').should('be.visible').click({ force: true })
    cy.wait(2000)

    // "계좌번호 재입력" 버튼 클릭 -> 바로 은행 선택 시트 오픈됨
    cy.contains('button', '계좌번호').should('be.visible').click({ force: true })
    cy.wait(2000)

    cy.contains('계좌번호입력').click()
    cy.wait(1500)

    // 은행 선택 시트에서 국민은행 클릭
    cy.contains('button', '국민은행').should('be.visible').click()
    cy.wait(1500)

    // 1017: PRACTICE - 올바른 계좌번호 입력
    cy.get('input[placeholder="입력"]', { timeout: 10000 }).should('be.visible')
    cy.wait(500)
    cy.get('input[placeholder="입력"]').clear().type('110-123-456789', { delay: 100 })
    cy.wait(1000)
    cy.contains('button', '다음').click()
    cy.wait(1500)

    cy.contains('button', '확인').click({ force: true })
    cy.wait(1500)

    cy.get('[data-testid="keypad-1"]', { timeout: 10000 }).should('be.visible')
    cy.wait(500)
    cy.get('[data-testid="keypad-1"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-2"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-3"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-4"]').click({ force: true })
    cy.wait(2500) // 자동 제출 대기
    
    // 다시 확인 화면으로 이동
    cy.wait(1000)
    cy.contains('button', '이체').should('be.visible').click()
    cy.wait(3000)

    // 1027: OVERLAY (위비 congratulation) - 이체 성공
    cy.log('=== 이체 성공 ===')
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1028: PRACTICE - 이체 완료 화면
    cy.wait(1000)

    // 27. 확인 버튼 클릭
    cy.contains('button', '확인').should('be.visible').click()
    cy.wait(1500)

    // 1029: DIALOG (위비 love) - 이체 성공 메시지
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1030: DIALOG (user) - 확인하고 싶어
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1031: DIALOG (위비) - 거래내역 확인 방법
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1032: OVERLAY (위비 stick) - 전체계좌보기로 가기
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1033: OVERLAY (위비) - 전체계좌보기 설명
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 28. 우리메인으로 돌아옴
    cy.url().should('include', '/woorimain')
    cy.wait(2000)

    // ========================================
    // 계좌 조회 시나리오
    // ========================================

    // 1034: PRACTICE - 전체계좌보기 버튼 클릭
    cy.wait(1000)

    // 29. 전체계좌보기 버튼 클릭
    cy.contains('button', '전체계좌보기').click({ scrollBehavior: false, force: true })
    cy.wait(2000)

    // 30. 계좌 목록 화면
    cy.url().should('include', '/searchaccount-scenario')
    cy.wait(2000)

    // 1035: OVERLAY (위비 stick) - 아까 월세를 이체할 때 사용한 계좌가 어떤 거였지?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1036: PRACTICE - 계좌 선택 (이체 버튼 클릭)
    cy.wait(1000)

    // 31. 첫 번째 계좌의 "이체" 버튼 클릭
    cy.contains('button', '이체').first().click()
    cy.wait(2000)

    // 1037: OVERLAY (위비 stick) - 거래내역이 많으면 찾기 어려울 수 있어
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1038: OVERLAY (위비) - 최근 3개월 동안의 거래 내역을 확인해 볼까?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1039: PRACTICE - 필터 열기 (자동으로 열림)
    // ScenarioContainer에서 1039 PRACTICE에서 자동으로 필터가 열림
    cy.wait(1500)
    cy.contains('button', '최신순').should('be.visible').click()
    cy.wait(2000)
    // 1040: PRACTICE - 필터 적용 버튼 클릭
    // 필터가 열려 있는 상태에서 적용 버튼 클릭
    cy.wait(1000)
    cy.contains('button', '적용').should('be.visible').click()
    cy.wait(2000)

    // 1041: OVERLAY (위비 stick) - 방금 전에 이체한 내역이 제일 위에 있어
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1042: OVERLAY (위비) - 이 거래내역을 선택하면 더 자세한 정보를 볼 수 있어
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1043: PRACTICE - 거래 내역 클릭
    cy.wait(1000)

    // 33. 첫 번째 거래 내역 클릭
    cy.get('li').first().click()
    cy.wait(2000)

    // 1044: OVERLAY (위비 stick) - 짜잔! 여기서 아까 이체했던 모든 정보를 확인할 수 있어
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1045: OVERLAY (위비 aha) - 거래 일시, 받는 사람, 계좌번호, 금액...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1046: CHOICE - 2개 선택지 (둘 다 1047로)
    cy.contains('button', '오! 정말 자세하게 나오네').click()
    cy.wait(1200)

    // 1047: PRACTICE - 확인 버튼 클릭
    cy.wait(1000)
    cy.contains('button', '확인').should('be.visible').click()
    cy.wait(1500)

    // 1048: OVERLAY (위비) - 맞아! 이렇게 거래 내역을 확인하는 습관을 들이면
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1049: OVERLAY (위비 congratulation) - 잘했어!
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1050: OVERLAY (위비 love) - 문제를 풀어보고 넘어가자 (quiz_id=1)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 34. Quiz 페이지로 이동됨
    cy.url().should('include', '/quiz')
    cy.wait(2000)

    // 퀴즈 풀기 - 정답 선택 (answer = 2 -> 인덱스 1번째 선택지)
    // "계좌이체는 개인이나 기업이 다양한 수단으로 다른 계좌로 돈을 보내는 행위이다."
    cy.wait(1000)
    cy.contains('button', '계좌이체는 개인이나 기업이 다양한 수단으로 다른 계좌로 돈을 보내는 행위이다').click()
    cy.wait(2000)

    // 1051: OVERLAY (위비 congratulation) - 정답이야!!
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 자동으로 우리메인으로 이동됨
    cy.url().should('include', '/woorimain')
    cy.wait(2000)

    // ========================================
    // 자동이체 시나리오 시작 (1052~)
    // ========================================

    // 1052: DIALOG (위비 worried) - 근데 말이야... 매달 월세를 일일이 이체하는 게...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1053: CHOICE - 2개 선택지 (둘 다 1054로)
    cy.contains('button', '그러게... 매달 하려니 귀찮을 것 같아').click()
    cy.wait(1200)

    // 1054: DIALOG (위비 hi) - 그래서! 바로 자동이체 기능이 있어!
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1055: MODAL - 자동이체란?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1056: DIALOG (위비 hi) - 자동이체를 설정하면 매달 같은 날짜에...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1057: DIALOG (위비 welcome) - 깜빡하고 안 보낼 걱정도 없고...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1058: OVERLAY (위비 aha) - 자동이체 설정은 햄버거 메뉴에서...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1059: OVERLAY (위비) - 화면 왼쪽 상단의 세 줄 메뉴를 눌러볼까?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1060: PRACTICE - 햄버거 메뉴 클릭
    cy.wait(1000)
    // 햄버거 메뉴 버튼 클릭 (왼쪽 상단)
    cy.get('button[aria-label="전체 메뉴 열기"]').click({ force: true })
    cy.wait(1500)

    // 1061: OVERLAY (위비 aha) - 메뉴가 보이지? 이체/출금 섹션...
    // z-[100]인 시나리오 OVERLAY만 선택 (메뉴 시트는 z-[60])
    cy.get('.z-\\[100\\]').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 1062: PRACTICE - 자동이체 메뉴 클릭
    cy.wait(1000)
    cy.contains('자동이체').should('be.visible').click({ force: true })
    cy.wait(2500)

    // 자동이체 페이지로 이동
    cy.url().should('include', '/automaticpayment-scenario')
    cy.wait(3000)

    // 1063: OVERLAY (위비 aha) - 여기서 자동이체를 등록하고 관리할 수 있어
    cy.get('.fixed.inset-0', { timeout: 10000 }).should('be.visible').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1064: OVERLAY (위비) - 자동이체 등록하기 버튼을 눌러볼까?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // ========================================
    // 📌 진행률 저장 확인: 자동이체 등록 전 홈으로 나갔다가 이어하기
    // ========================================
    cy.log('=== 진행률 저장 확인: 홈으로 나가기 ===')

    // 홈으로 이동
    cy.visit('/home')
    cy.wait(3000)

    // 홈 화면에서 시나리오 진행률 확인
    cy.url().should('include', '/home')
    cy.log('홈 화면에서 진행률 확인')
    cy.wait(2000)

    // 다시 자동이체 카드 클릭하여 이어하기
    cy.log('=== 진행률 저장 확인: 다시 시나리오로 돌아가기 ===')
    cy.contains('조회·이체').click()
    cy.wait(3000) // 대기 시간 늘림

    // 진행 상태 다이얼로그 처리 - "중간부터 다시하기" 클릭
    cy.contains('button', '중간부터 다시하기').should('be.visible').click()
    cy.wait(2000)

    // 시나리오 페이지로 이동됨 (저장된 stepId로 자동 이동)
    cy.url().should('match', /(woorimain|automaticpayment-scenario)/)
    cy.wait(2000)

    cy.log('=== 진행률 저장 확인 완료, 시나리오 계속 진행 ===')

    // 1064: OVERLAY (위비) - 자동이체 등록하기 버튼을 눌러볼까?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1065: PRACTICE - 자동이체 등록하기 버튼 클릭
    cy.wait(1000)
    cy.contains('button', '자동이체 등록하기').should('be.visible').click()
    cy.wait(1500)

    // 1066: MODAL - 자동이체 유형
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)
    // 한 번 더 클릭
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1067: OVERLAY (위비 aha) - 월세는 원화니까...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)
    // 한 번 더 클릭
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(2000)

    // 1068: PRACTICE - 원화 자동이체 등록 선택 (바텀시트에서 선택)
    cy.wait(500)
    cy.contains('원화 자동이체 등록').should('be.visible').click({ force: true })
    cy.wait(1500)

    // 1069: OVERLAY (위비 aha) - 자동이체할 때 돈이 빠져나갈 계좌...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1070: OVERLAY (위비) - 잔고가 충분한 계좌가 좋겠지?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 1071: PRACTICE - 계좌 선택
    cy.wait(1000)
    cy.get('button').contains('우리은행').first().click()
    cy.wait(1500)

    // 1072: OVERLAY (위비 aha) - 집주인 계좌 정보 입력
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1073: OVERLAY (위비 hi) - 계좌번호 110-123-456789, 은행 국민은행
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1074: PRACTICE - 계좌번호입력 버튼 클릭 (이체 시나리오와 동일)
    cy.wait(1000)
    cy.contains('계좌번호입력').click()
    cy.wait(1500)

    // 은행 선택 바텀시트가 열림
    cy.wait(1000)
    cy.contains('button', '국민은행').should('be.visible').click()
    cy.wait(1500)

    // 1075: PRACTICE - 계좌번호 입력
    cy.wait(1000)
    cy.get('input[placeholder="입력"]', { timeout: 10000 }).should('be.visible')
    cy.wait(500)
    cy.get('input[placeholder="입력"]').clear().type('110-123-456789', { delay: 100 })
    cy.wait(1000)

    // 1076: PRACTICE - 다음 버튼 클릭
    cy.contains('button', '다음').click()
    cy.wait(1500)

    // 1077: OVERLAY (위비 OK) - 매달 자동으로 이체될 금액 50만원
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1078: PRACTICE - 금액 입력 시작
    cy.wait(1000)

    // 1079: PRACTICE - 금액 입력 (50만원 = 500000원)
    cy.get('[data-testid="amount-keypad-5"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(200)
    cy.get('[data-testid="amount-keypad-0"]').click({ force: true })
    cy.wait(500)
    // 금액 입력 시트의 확인 버튼
    cy.contains('button', '확인').click({ force: true })
    cy.wait(1500)

    // 추가 확인 버튼 (메인 화면)
    cy.wait(500)
    cy.contains('button', '확인').click({ force: true })
    cy.wait(1500)

    // 1080: OVERLAY (위비 rap) - 이제 언제 자동이체할지 설정
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1081: OVERLAY (위비) - 월세 납부일이 매달 5일
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1082: OVERLAY (위비) - 임대차 계약이 1년
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1083: CHOICE - 2개 선택지
    cy.contains('button', '계약 끝나면 자동으로 해지돼?').click()
    cy.wait(1200)

    // 1084: OVERLAY (위비) - 응! 종료일을 설정하면...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1085: PRACTICE - 날짜/주기 설정
    cy.wait(1000)

    // 이체일을 5일로 변경 (현재 "1일"을 클릭하여 날짜 선택)
    cy.contains('1일').click({ force: true })
    cy.wait(500)
    cy.contains('button', '5').click({ force: true })
    cy.wait(1000)

    // 주기를 12개월로 설정
    cy.contains('button', '12개월').click({ force: true })
    cy.wait(2000)

    // 다음 버튼 클릭
    cy.contains('button', '다음').click()
    cy.wait(1500)

    // 1086: OVERLAY (위비 OK) - 다시 한번 비밀번호
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1087: OVERLAY (user) - 왜 또 입력해야 해?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1088: OVERLAY (위비) - 자동이체는 매달 자동으로...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(2500)

    // OVERLAY 닫힌 후 추가 클릭
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(2500)

    // 날짜/주기 화면의 다음 버튼 클릭 (이전 화면으로 돌아가기)
    cy.contains('button', '다음').click()
    cy.wait(1500)

    // 1089: PRACTICE - 비밀번호 입력 (배드 브랜치 시연)
    // 비밀번호 시트가 완전히 열릴 때까지 대기
    cy.contains('계좌 비밀번호를 입력해주세요', { timeout: 10000 }).should('be.visible')
    cy.wait(1000)

    // 👎 BAD BRANCH: 비밀번호 3번 틀리기
    cy.log('=== BAD BRANCH: 비밀번호 1차 오류 (5555) ===')
    cy.get('[data-testid="keypad-5"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-5"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-5"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-5"]').click({ force: true })
    cy.wait(2000)

    cy.log('=== BAD BRANCH: 비밀번호 2차 오류 (6666) ===')
    cy.get('[data-testid="keypad-6"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-6"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-6"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-6"]').click({ force: true })
    cy.wait(2000)

    cy.log('=== BAD BRANCH: 비밀번호 3차 오류 (7777) ===')
    cy.get('[data-testid="keypad-7"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-7"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-7"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-7"]').click({ force: true })
    cy.wait(2500)

    // 👎 BAD BRANCH: 비밀번호 3번 실패로 인한 배드 브랜치
    cy.log('=== BAD BRANCH: 비밀번호 3번 실패 감지 ===')

    // Step 1490: 배드 브랜치 다이얼로그
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // Step 1491: 구체적인 오류 내용
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 오류 상세 다이얼로그들
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // Step 1492/1493: "신중하게! 다시 한 번 시도해보자"
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(2000)

    // ✅ GOOD BRANCH: "틀린 부분부터 다시하기" 버튼 클릭
    cy.contains('button', '틀린 부분부터 다시하기').should('be.visible').click({ force: true })
    cy.wait(2000)

    cy.contains('button', '다음').click()
    cy.wait(1500)

    // ✅ GOOD BRANCH: 올바른 비밀번호 입력 (1234)
    cy.log('=== GOOD BRANCH: 올바른 비밀번호 입력 (1234) ===')
    cy.contains('계좌 비밀번호를 입력해주세요', { timeout: 10000 }).should('be.visible')
    cy.wait(1000)
    cy.get('[data-testid="keypad-1"]', { timeout: 10000 }).should('be.visible').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-2"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-3"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-4"]').click({ force: true })
    cy.wait(2500)

    // 1090: OVERLAY (위비 aha) - 등록하기 전에 마지막 확인
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1091: OVERLAY (위비) - 매달 자동으로 돈이 나가니까...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1092: PRACTICE - 최종 확인 - 등록하기
    cy.wait(1000)
    cy.contains('button', '등록하기').should('be.visible').click()
    cy.wait(1500)

    // 1093: OVERLAY (위비 aha) - 약관에 동의해야 해
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1094: MODAL - 약관이란?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 1095: PRACTICE - 약관 버튼 클릭
    cy.wait(1000)
    cy.contains('button', '[필수] 타행 자동이체 약관').should('be.visible').click()
    cy.wait(1500)

    // 1096: OVERLAY (위비 aha) - 우리는 타행 자동이체
    // 약관 모달이 열리고 그 위에 시나리오 OVERLAY가 나타남
    cy.log('=== 시나리오 오버레이 제거 시작 ===')

    // 오버레이가 여러 개일 수 있으므로 반복적으로 클릭
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 오버레이가 남아있으면 한 번 더 클릭
    cy.get('body').then(($body) => {
      const overlays = $body.find('.fixed.inset-0')
      if (overlays.length > 1) {
        cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
        cy.wait(1500)
      }
    })

    // 1097: PRACTICE - 약관 모달 확인 버튼 클릭
    // 모달 내부의 확인 버튼을 클릭하면 자동으로 체크박스가 체크됨
    cy.log('=== 약관 모달 확인 버튼 클릭 ===')
    cy.wait(1000)

    // "약관/동의서 상세" 모달 내부의 확인 버튼을 정확히 타겟팅
    cy.contains('약관/동의서 상세').parents('.rounded-\\[24px\\]').within(() => {
      cy.contains('button', '확인').click({ force: true })
    })
    cy.wait(2000)

    // 모달이 완전히 닫힐 때까지 대기하고, 남은 오버레이 제거
    cy.log('=== 모달 닫힌 후 오버레이 확인 및 제거 ===')
    cy.wait(1000)

    // 남은 오버레이가 있으면 제거
    cy.get('body').then(($body) => {
      const overlays = $body.find('.fixed.inset-0')
      if (overlays.length > 0) {
        cy.log(`=== ${overlays.length}개의 오버레이 제거 중 ===`)
        cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
        cy.wait(1000)

        // 오버레이 제거 후 약관 화면이 여전히 존재하는지 확인
        cy.get('body').then(($b) => {
          const hasAgreementButton = $b.find('button:contains("[필수] 타행 자동이체 약관")').length > 0
          if (!hasAgreementButton) {
            cy.log('⚠️ 오버레이 클릭으로 화면이 바뀜 - 약관 화면이 아님')
          } else {
            cy.log('✅ 약관 화면 유지됨')
          }
        })
      } else {
        cy.log('오버레이 없음 - 바로 진행')
      }
    })
    cy.wait(500)

    cy.contains('button', '[필수] 타행 자동이체 약관').should('be.visible').click()
    cy.contains('button', '[필수] 타행 자동이체 약관').should('be.visible').click()
    cy.wait(1500)

    cy.contains('약관/동의서 상세').parents('.rounded-\\[24px\\]').within(() => {
    cy.contains('button', '확인').click({ force: true })
    })
    cy.wait(2000)

    // 1098: PRACTICE - 메인 페이지 확인 버튼 (이제 활성화되어 있어야 함)
    cy.log('=== 메인 확인 버튼 클릭 ===')

    // API 요청 인터셉트 설정 (에러 정보 확인용)
    cy.intercept('POST', '/education/auto-payment').as('autoPayment')

    // 확인 버튼이 존재하는지 확인하고 클릭
    cy.contains('button', '확인').click({ force: true })
    cy.wait(1500)

    // 1099: OVERLAY (위비 congratulation) - 자동이체 등록 성공
    cy.get('body').then(($body) => {
      const overlays = $body.find('.fixed.inset-0')
      if (overlays.length > 0) {
        cy.log('=== 1099: OVERLAY 클릭 (자동이체 등록 성공) ===')
        cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
        cy.wait(1200)
      } else {
        cy.log('=== 1099: OVERLAY 없음 (스킵) ===')
      }
    })

    // 1100: OVERLAY (위비 hi) - 이제 매달 5일에...
    cy.get('body').then(($body) => {
      const overlays = $body.find('.fixed.inset-0')
      if (overlays.length > 0) {
        cy.log('=== 1100: OVERLAY 클릭 (매달 5일) ===')
        cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
        cy.wait(1200)
      } else {
        cy.log('=== 1100: OVERLAY 없음 (스킵) ===')
      }
    })

    // 1101: PRACTICE - 확인 버튼
    cy.wait(1000)
    cy.contains('button', '확인').click({ force: true })
    cy.wait(2000)

    // ========================================
    // 자동이체 해지 시나리오 (1102~)
    // ========================================

    // 1102: IMAGE (clock) - 시간 경과
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1103: IMAGE (message3)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1104: OVERLAY (위비 worried) - 월세가 내려갔으니까...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1105: OVERLAY (위비 hi) - 그럼 지금 매월 50만 원씩 나가는...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1106: OVERLAY (위비) - 월세 자동납부가 보이지?
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1107: PRACTICE - 자동이체 선택
    cy.wait(1000)
    cy.contains('타행자동이체').click()
    cy.wait(2000)

    // 1108: OVERLAY (위비 aha) - 여기서 자동이체 정보 확인...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1109: OVERLAY (위비) - 자동이체 해지 버튼
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1110: PRACTICE - 자동이체 해지 버튼 클릭
    cy.wait(1000)
    cy.contains('button', '자동이체 해지').click()
    cy.wait(1500)

    // 1111: OVERLAY (위비 aha) - 해지하기 전에 주의사항
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1112: OVERLAY (위비) - 해지하면 바로 적용되고...
    // 모든 오버레이를 완전히 제거
    cy.log('=== 1112 모든 오버레이 제거 시작 ===')

    // 오버레이가 완전히 사라질 때까지 반복 제거
    function removeAllOverlays() {
      cy.get('body').then(($body) => {
        const overlays = $body.find('.fixed.inset-0')
        if (overlays.length > 0) {
          cy.log(`남은 오버레이: ${overlays.length}개`)
          // 오버레이 중앙을 클릭 (좌표 지정 없이)
          cy.get('.fixed.inset-0').first().click({ force: true })
          cy.wait(800)
          removeAllOverlays() // 재귀 호출
        } else {
          cy.log('✅ 모든 오버레이 제거 완료')
        }
      })
    }
    removeAllOverlays()
    cy.wait(500)

    // 오버레이 제거 후 "네" 버튼이 여전히 존재하는지 확인
    cy.get('body').then(($body) => {
      const hasYesButton = $body.find('button:contains("네")').length > 0
      if (!hasYesButton) {
        cy.log('⚠️ 모달이 닫힘 - 해지 모달 재오픈')

        // 오버레이가 완전히 사라졌는지 다시 확인
        cy.get('.fixed.inset-0', { timeout: 1000 }).should('not.exist')

        cy.contains('button', '자동이체 해지').click({ force: true })
        cy.wait(1500)
      } else {
        cy.log('✅ "네" 버튼 존재함')
      }
    })
    cy.wait(500)

    // 1113: PRACTICE - 해지 확인 모달 - "네" 클릭
    cy.contains('button', '네').click({ force: true })
    cy.wait(1500)

    // 1114: OVERLAY (위비 aha) - 마지막으로 정말 맞는 자동이체인지...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1115: PRACTICE - 해지 리뷰 시트 - "확인했습니다" 클릭
    cy.wait(1000)
    cy.contains('button', '확인했습니다').click()
    cy.wait(2000)

    // 1116: PRACTICE - 해지 완료 확인 버튼
    cy.wait(1000)
    cy.contains('button', '확인').scrollIntoView({ duration: 800, easing: 'linear' })
    cy.wait(500)
    cy.contains('button', '확인').click()
    cy.wait(1500)

    // 1117: DIALOG (위비 congratulation) - 잘했어! 자동이체가 성공적으로...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1118: DIALOG (위비 hi) - 이제 더 이상 자동으로...
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1200)

    // 1119: DIALOG (위비 aha) - 마지막으로 배웠던 내용 문제 풀기 (quiz_id=2)
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // Quiz 페이지로 이동됨
    cy.url().should('include', '/quiz')
    cy.wait(2000)

    // 퀴즈 풀기 - 정답 선택 (answer = 1 -> 첫 번째 선택지)
    // "자동이체는 매번 돈을 보내야 하는 번거로움을 덜어준다."
    cy.wait(1000)
    cy.contains('button', '자동이체는 매번 돈을 보내야 하는 번거로움을 덜어준다').click()
    cy.wait(2000)

    // 1120: OVERLAY (위비 congratulation) - 마지막 퀴즈까지 완료
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(1500)

    // 1121: IMAGE (point) - 포인트 적립
    cy.get('.fixed.inset-0').first().click(200, 300, { force: true })
    cy.wait(3000) // 포인트 적립 표시

    // 자동으로 홈으로 이동됨
    cy.url().should('include', '/home')
    cy.wait(3000)

    // 시나리오 완료 후 포인트 업데이트 (5000 + 1000 = 6000)
    cy.then(() => {
      currentPoints = 6000
      pointsAfterExchange = currentPoints
      cy.log('💰 시나리오 완료! 총 포인트: 6000p')
    })


    // ========================================
    // 📌 마이페이지 기능 테스트
    // ========================================
    cy.log('=== 마이페이지로 이동 ===')

    // 마이페이지 버튼 클릭 (헤더 또는 네비게이션에서)
    cy.get('body').then(($body) => {
      // 마이페이지 버튼을 찾아서 클릭
      const hasButton = $body.find('button').filter((i, el) => Cypress.$(el).text().includes('마이페이지')).length > 0
      const hasLink = $body.find('a[href*="/mypage"]').length > 0

      if (hasButton) {
        cy.contains('button', '마이페이지').click()
      } else if (hasLink) {
        cy.get('a[href*="/mypage"]').first().click()
      } else {
        // 직접 URL로 이동
        cy.visit('/mypage')
      }
    })
    cy.wait(2000)

    // 마이페이지에서 포인트 확인
    cy.log('=== 마이페이지: 포인트 확인 ===')
    cy.url().should('include', '/mypage')
    cy.wait(3000) // 포인트 확인 표시

    // ========================================
    // 📌 계좌 개설
    // ========================================
    cy.log('=== 계좌 개설 ===')

    // 테스트용 계좌번호 생성
    newAccountNumber = `1002-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`

    // /users/me API를 인터셉트하여 계좌번호 및 포인트 관리
    cy.intercept('GET', '**/users/me', (req) => {
      req.reply((res) => {
        if (res.body && res.body.data) {
          // 확인 버튼 클릭 후에만 account 필드 추가
          if (accountCreated) {
            res.body.data.account = newAccountNumber
          }
          // 포인트 업데이트 (환전 후 차감된 포인트 반영)
          res.body.data.points = pointsAfterExchange
        }
        return res
      })
    }).as('getUserWithAccount')

    // 계좌 개설 버튼 클릭
    cy.contains('button', '계좌 개설').click()
    cy.wait(3000) // 계좌 개설 처리 중

    // 확인 버튼 클릭 전에 플래그 설정
    cy.then(() => {
      accountCreated = true
    })

    // 확인 버튼 클릭 (페이지 새로고침됨)
    cy.contains('button', '확인').click()
    cy.wait(3000) // 계좌 개설 완료 대기

    // 계좌번호가 화면에 표시되는지 확인
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      if (bodyText.includes(newAccountNumber)) {
        cy.log(`✅ 계좌 개설 완료 - 화면에 계좌번호 표시됨: ${newAccountNumber}`)
      } else {
        cy.log(`⚠️ 화면에 계좌번호가 보이지 않음: ${newAccountNumber}`)
      }
    })
    cy.wait(1000)

    // 뒤로가기 또는 홈으로
    cy.visit('/mypage')
    cy.wait(2000)

    // 마이페이지에서 계좌 확인
    cy.log('=== 마이페이지: 계좌 확인 ===')
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      const hasAccount = bodyText.includes('계좌') || bodyText.match(/\d{4}-\d{4,5}-\d{4,5}/)
      if (hasAccount) {
        cy.log('✅ 계좌 존재 확인됨')
      } else {
        cy.log('⚠️ 계좌가 보이지 않음 - 환전 불가능할 수 있음')
      }
    })
    cy.wait(1000)

    // ========================================
    // 📌 포인트 관리 및 환전
    // ========================================

    // 1. 포인트 관리 버튼 클릭
    cy.log('=== 포인트 관리 버튼 클릭 ===')
    cy.contains('button', '포인트 관리').click()
    cy.wait(2000)

    // 2. 포인트 내역 페이지 확인
    cy.url().should('include', '/point/list')
    cy.log('=== 포인트 내역 확인 ===')
    cy.get('body').then(($body) => {
      const bodyText = $body.text()
      if (bodyText.includes('포인트 내역')) {
        cy.log('✅ 포인트 내역 페이지 진입')
      }
    })
    cy.wait(1000)

    // 3. 포인트 환전 탭 클릭
    cy.log('=== 포인트 환전 탭 클릭 ===')
    cy.contains('button', '포인트 환전').click()
    cy.wait(2000)

    // 4. 환전 페이지 확인
    cy.url().should('include', '/point/exchange')
    cy.log('✅ 환전 페이지 진입')

    // 5. 환전 금액 입력 (전액 환전)
    cy.log('=== 환전 금액 입력 ===')
    const exchangeAmount = 6000
    cy.get('input[placeholder*="환전할 금액"]').clear().type(String(exchangeAmount))
    cy.log(`✅ 환전 금액 입력: ${exchangeAmount}p (전액 환전)`)
    cy.wait(2000)

    // 6. 계좌번호 입력 (생성된 계좌번호 사용)
    cy.log('=== 계좌번호 입력 ===')
    cy.get('input[placeholder*="계좌 번호"]').clear().type(newAccountNumber)
    cy.log(`✅ 계좌번호 입력: ${newAccountNumber}`)
    cy.wait(1000)

    // 7. 환전 신청 전 포인트 차감 및 API 모킹
    cy.then(() => {
      pointsAfterExchange = currentPoints - exchangeAmount
      cy.log(`💰 포인트 차감 예정: ${currentPoints}p → ${pointsAfterExchange}p`)
    })

    cy.intercept('POST', '**/points/exchange', {
      statusCode: 200,
      body: {
        code: 200,
        message: 'success',
        data: {
          currentBalance: pointsAfterExchange
        }
      }
    }).as('exchangePoints')

    // 8. 환전 신청 버튼 클릭
    cy.log('=== 환전 신청 버튼 클릭 ===')
    cy.contains('button', '환전 신청').should('not.be.disabled').click()
    cy.wait('@exchangePoints')
    cy.log('✅ 환전 신청 완료 (6000p 전액)')
    cy.wait(2000)

    // 9. 환전 완료 모달 확인
    cy.log('=== 환전 완료 모달 확인 ===')
    cy.get('body').then(($body) => {
      if ($body.text().includes('환전 신청 완료')) {
        cy.log('✅ 환전 완료 모달 표시됨')
        cy.contains('button', '확인').click()
        cy.wait(3000) // 환전 완료 표시
      }
    })

    // 마이페이지로 돌아왔는지 확인
    cy.url().should('include', '/mypage')
    cy.log('✅ 마이페이지로 이동 완료')
    cy.wait(2000)

    // ========================================
    // 📌 로그아웃
    // ========================================
    cy.log('=== 로그아웃 시작 ===')

    // 로그아웃 버튼 클릭
    cy.contains('button', '로그아웃').click()
    cy.wait(3000) // 로그아웃 처리

    // 로그인 페이지로 이동 확인
    cy.url().should('include', '/login')
    cy.log('✅ 로그아웃 완료 - 로그인 페이지로 이동')
    cy.wait(2000)

    // ========================================
    // 📌 관리자 로그인
    // ========================================
    cy.log('=== 관리자 로그인 시작 ===')

    // 관리자 계정으로 로그인
    cy.get('input[type="text"]').first().clear().type('admin0')
    cy.wait(500)
    cy.get('input[type="password"]').first().clear().type('admin1234!')
    cy.wait(500)
    cy.contains('button', '로그인').click()

    // 화면 크기를 데스크톱으로 변경 (관리자 페이지 진입 후)
    cy.viewport(1920, 1080)

    // 회원 목록 확인
    cy.log('=== 관리자 페이지: 회원 목록 확인 ===')
    cy.wait(3000)

    // 회원 목록이 표시되는지 확인
    cy.get('body').then(($body) => {
      if ($body.text().includes('회원 목록') || $body.find('table').length > 0) {
        cy.log('✅ 회원 목록 표시됨')
      }
    })
    cy.wait(1000)

    // ========================================
    // 📌 포인트 환전 신청 관리
    // ========================================
    cy.log('=== 포인트 환전 신청 메뉴로 이동 ===')

    // 관리자 페이지 환전 내역 API 모킹 (환전 신청 내역이 보이도록)
    cy.intercept('GET', '**/admin/points/history*', {
      statusCode: 200,
      body: {
        code: 200,
        message: 'success',
        data: {
          content: [
            {
              id: 1,
              userId: userId,
              nickname: userName,
              amount: 6000, // 전액 환전
              status: 'APPLY', // 환전 신청 상태
              type: 'WITHDRAW',
              createdAt: new Date().toISOString(),
              processedAt: null
            }
          ],
          totalElements: 1,
          totalPages: 1,
          size: 20,
          number: 0
        }
      }
    }).as('getExchangeHistory')

    // 헤더의 "포인트 환전 신청" 버튼 클릭
    cy.contains('button', '포인트 환전 신청').click()
    cy.wait(2000)

    // 환전 신청 목록 확인
    cy.log('=== 환전 신청 목록 확인 ===')
    cy.get('body').then(($body) => {
      if ($body.text().includes('포인트 전환 신청') || $body.find('table').length > 0) {
        cy.log('✅ 환전 신청 목록 표시됨')
      }
    })
    cy.wait(3000)

    // 환전 승인 API 모킹
    cy.intercept('PUT', '**/admin/points/exchange/approve/**', {
      statusCode: 200,
      body: {
        code: 200,
        message: 'success',
        data: {
          success: true
        }
      }
    }).as('approveExchange')

    // 승인 버튼 찾아서 클릭
    cy.log('=== 환전 승인 처리 ===')
    cy.wait(1000) // 테이블 렌더링 대기

    cy.get('body').then(($body) => {
      const approveButtons = $body.find('button').filter((i, el) => Cypress.$(el).text().trim() === '승인')
      if (approveButtons.length > 0) {
        // 승인 버튼 클릭
        cy.contains('button', '승인').first().click({ force: true })
        cy.log('✅ 승인 버튼 클릭')
        cy.wait(2000)

        // 승인 확인 모달이 있으면 확인 버튼 클릭 (페이지 재렌더링 대응)
        cy.wait(1000) // 모달 안정화 대기
        cy.get('body').then(($modal) => {
          if ($modal.find('button').filter((i, el) => Cypress.$(el).text().includes('확인')).length > 0) {
            // Cypress 권장: 체인을 분리하여 element detachment 문제 해결
            cy.contains('button', '확인').first().as('confirmBtn')
            cy.get('@confirmBtn').click({ force: true })
            cy.log('✅ 승인 확인 버튼 클릭')
            cy.wait('@approveExchange').then(() => {
              cy.log('✅ 환전 승인 완료 (6000p)')
            })
            cy.wait(3000)
          }
        })
      } else {
        cy.log('⚠️ 승인 버튼을 찾을 수 없습니다')
      }
    })

    // 전체 시연 완료
    cy.log('🎉 ===== 전체 시연 완료! =====')
    cy.log('💰 회원가입 → 시나리오 완료 → 6000p 획득 → 전액 환전 → 관리자 승인')
  })
})
