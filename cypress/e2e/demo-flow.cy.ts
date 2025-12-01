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
    cy.wait(2500)

    // 12. 이메일 인증 페이지로 이동됨
    cy.url().should('include', '/signup/verify')
    cy.wait(2000)

    // 13. 확인 버튼 클릭
    cy.contains('button', '확인').click()
    cy.wait(1500)

    // 14. 로그인 페이지로 이동됨
    cy.url().should('include', '/login')
    cy.wait(1500)

    // 15. 로그인 진행 (방금 가입한 계정으로)
    cy.get('input[type="text"]').clear().type(userId, { delay: 50 })
    cy.wait(500)
    cy.get('input[type="password"]').clear().type(userPassword, { delay: 50 })
    cy.wait(500)

    // 로그인 버튼 클릭
    cy.contains('button', '로그인').click()
    cy.wait(2000)

    // 16. 홈 화면
    cy.url().should('include', '/home')
    cy.wait(4000) // 홈 화면 충분히 보여주기

    // 17. 조회·이체 카드 클릭
    cy.contains('조회·이체').click()
    cy.wait(2000)

    // 18. 우리메인 페이지
    cy.url().should('include', '/woorimain')
    cy.wait(3000) // 우리메인 화면 충분히 보여주기

    // ========================================
    // 송금 시나리오 (Scenario 1-7) - 거래 내역 생성을 위해 먼저 실행!
    // ========================================

    // 19. 이체 버튼 클릭
    cy.contains('button', '이체').click()
    cy.wait(2000)

    // 20. Scenario1: 송금 시나리오 시작
    cy.url().should('include', '/transfer-scenario')
    cy.wait(2000)

    // 21. Scenario1 → Scenario2: 계좌번호입력 버튼 클릭
    cy.contains('계좌번호입력').click()
    cy.wait(1500)

    // 22. Scenario2: 은행 선택 (국민은행)
    cy.contains('button', '국민은행').click()
    cy.wait(1500)

    // 23. Scenario3: 계좌번호 입력
    cy.get('input[placeholder="입력"]').type('110-123-456789', { delay: 100 })
    cy.wait(1000)
    cy.contains('button', '다음').click()
    cy.wait(1500)

    // 24. Scenario4: 금액 입력 (50만원 = 500000원)
    // 키패드에서 5, 0, 0, 0, 0, 0 입력 (정확한 셀렉터 사용)
    cy.get('button.text-\\[25px\\]').contains(/^5$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(500)
    cy.contains('button', '확인').click({ force: true })
    cy.wait(1500)

    // 25. Scenario5: 비밀번호 입력 (1234)
    // 비밀번호 시트가 열릴 때까지 대기
    cy.contains('계좌 비밀번호를 입력해주세요').should('be.visible')
    cy.wait(1000)

    // data-testid를 사용하여 랜덤 키패드에서 정확한 숫자 버튼 클릭
    cy.get('[data-testid="keypad-1"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-2"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-3"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-4"]').click({ force: true })
    cy.wait(2500) // 자동 제출 대기

    // 26. Scenario6: 이체 확인 - "이체" 버튼이 나타날 때까지 대기
    cy.contains('button', '이체').should('be.visible').click()
    cy.wait(2000)

    // 27. Scenario7: 이체 완료 - 확인 버튼 클릭
    cy.wait(2000)
    cy.contains('button', '확인').click()
    cy.wait(1500)

    // 28. 우리메인으로 돌아옴
    cy.url().should('include', '/woorimain')
    cy.wait(2000)

    // ========================================
    // 계좌 조회 시나리오 (Scenario 8-10) - 아직 미구현으로 스킵
    // ========================================
    // TODO: Scenario10 구현 완료 후 주석 해제

    // // 29. 전체계좌보기 버튼 클릭
    // cy.contains('button', '전체계좌보기').click()
    // cy.wait(2000)

    // // 30. Scenario8: 계좌 목록 화면
    // cy.url().should('include', '/searchaccount-scenario')
    // cy.wait(2000)

    // // 31. Scenario8 → Scenario9: 첫 번째 계좌의 "이체" 버튼 클릭
    // cy.contains('button', '이체').first().click()
    // cy.wait(2000)

    // // 32. Scenario9: 거래 내역 화면 - 첫 번째 거래 클릭
    // cy.wait(1500)
    // // 거래 내역 리스트에서 클릭 가능한 영역 찾기
    // cy.get('div').contains(/\+|-/).parents('div').first().click()
    // cy.wait(2000)

    // // 33. Scenario10: 거래 상세 화면
    // cy.wait(3000)
    // // "확인" 버튼이 나타날 때까지 대기하고 클릭
    // cy.get('button').contains('확인').should('be.visible').click()
    // cy.wait(1500)

    // // 34. Quiz 페이지로 이동됨
    // cy.url().should('include', '/quiz')
    // cy.wait(2000)

    // // 35. 홈으로 돌아가기
    // cy.visit('/home')
    // cy.wait(2000)

    // // 36. 조회·이체 → 우리메인
    // cy.contains('조회·이체').click()
    // cy.wait(2000)

    // ========================================
    // 자동이체 시나리오 (Scenario 11-19)
    // ========================================

    // 37. Scenario11로 이동: 자동이체 목록
    cy.visit('/automaticpayment-scenario')
    cy.wait(2000)

    // 38. Scenario11: "자동이체 등록하기" 버튼 클릭
    cy.contains('button', '자동이체 등록하기').click()
    cy.wait(1500)

    // 39. 타입 선택 시트: "원화 자동이체 등록" 선택
    cy.contains('원화 자동이체 등록').click()
    cy.wait(1500)

    // 40. Scenario12: 계좌 선택 - 첫 번째 계좌 클릭
    cy.get('button').contains('우리은행').first().click()
    cy.wait(1500)

    // 41. Scenario2: 은행 선택 (국민은행)
    cy.contains('button', '국민은행').click()
    cy.wait(1500)

    // 42. Scenario3: 계좌번호 입력
    cy.get('input[placeholder="입력"]').type('110-123-456789', { delay: 100 })
    cy.wait(1000)
    cy.contains('button', '다음').click()
    cy.wait(1500)

    // 43. Scenario4: 금액 입력 (50만원 = 500000원)
    // 키패드에서 5, 0, 0, 0, 0, 0 입력 (정확한 셀렉터 사용)
    cy.get('button.text-\\[25px\\]').contains(/^5$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(200)
    cy.get('button.text-\\[25px\\]').contains(/^0$/).click({ force: true })
    cy.wait(500)
    // 금액이 화면에 표시되는지 확인 (있으면 좋고 없어도 진행)
    cy.wait(1000)
    // 확인 버튼 클릭 (force 사용)
    cy.contains('button', '확인').click({ force: true })
    cy.wait(1500)

    // 44. Scenario13: 리뷰 - 확인
    cy.wait(2000) // 리뷰 데이터 로드 대기
    // 확인 버튼 클릭 (amount가 설정되지 않을 수 있으므로 force 사용)
    cy.contains('button', '확인').click({ force: true })
    cy.wait(1500)

    // 32. Scenario14: 날짜/주기 설정
    // 이체 지정일 선택 (1일로 기본 선택되어 있음)
    // 기간 선택 (6개월)
    cy.contains('button', '6개월').click({ force: true })
    cy.wait(2000) // 종료일 계산 대기
    cy.contains('button', '다음').click()
    cy.wait(1500)

    // Scenario5: 비밀번호 입력 (1234) - 자동이체 등록용
    cy.contains('계좌 비밀번호를 입력해주세요').should('be.visible')
    cy.wait(500)
    cy.get('[data-testid="keypad-1"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-2"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-3"]').click({ force: true })
    cy.wait(300)
    cy.get('[data-testid="keypad-4"]').click({ force: true })
    cy.wait(2500) // 자동 제출 대기

    // 33. Scenario15: 최종 확인 - 등록하기
    cy.wait(1500)
    cy.contains('자동이체 등록정보를 확인해주세요').should('be.visible')
    cy.wait(500)
    cy.contains('button', '등록하기').should('be.visible').click()
    cy.wait(1500)

    // 34. Scenario16: 약관 동의
    // 약관 버튼 클릭 (모달 열림)
    cy.contains('button', '[필수] 타행 자동이체 약관').click()
    cy.wait(1500)
    // 모달이 나타날 때까지 대기
    cy.contains('약관/동의서 상세').should('be.visible')
    cy.wait(1000)
    // 모달의 "확인" 버튼 클릭 - fixed inset-0로 모달만 선택
    cy.get('.fixed.inset-0').find('button').contains('확인').click()
    cy.wait(1500)
    // 모달이 닫힌 것 확인
    cy.contains('약관/동의서 상세').should('not.exist')
    cy.wait(500)
    // 메인 페이지의 "확인" 버튼 클릭 (이제 활성화됨)
    cy.get('button').contains('확인').click()
    cy.wait(2000)

    // 35. Scenario17: 등록 완료
    cy.wait(1500)
    cy.contains('button', '확인').click({ force: true })
    cy.wait(2000)

    // ========================================
    // 자동이체 상세 및 해지 시나리오 (Scenario 18-19)
    // ========================================

    // 36. Scenario11로 돌아옴 - 등록된 자동이체 확인
    cy.wait(1500)

    // 37. Scenario11 → Scenario18: 등록된 자동이체 클릭
    // "타행자동이체" 텍스트를 포함하는 카드 클릭
    cy.contains('타행자동이체').click()
    cy.wait(2000)

    // 38. Scenario18: 자동이체 상세 - "자동이체 해지" 클릭
    cy.contains('button', '자동이체 해지').click()
    cy.wait(1500)

    // 39. 해지 확인 모달 - "네" 클릭
    cy.contains('button', '네').click()
    cy.wait(1500)

    // 40. 해지 리뷰 시트 - "확인했습니다" 클릭
    cy.contains('button', '확인했습니다').click()
    cy.wait(2000)

    // 41. Scenario19: 해지 완료
    cy.wait(1500)
    cy.contains('button', '확인').click()
    cy.wait(1500)

    // 42. Quiz 페이지로 이동됨
    cy.url().should('include', '/quiz')
    cy.wait(2000)

    // 43. 홈으로 돌아가기
    cy.visit('/home')
    cy.wait(2000)

    // 44. 마이페이지로 이동
    cy.contains('내 정보').click()
    cy.wait(2000)

    // 45. 마이페이지
    cy.url().should('include', '/mypage')
    cy.wait(4000) // 마이페이지 충분히 보여주기

    // 🎉 완료!
  })
})
