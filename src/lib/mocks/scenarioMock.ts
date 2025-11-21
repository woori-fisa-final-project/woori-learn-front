// src/lib/mocks/scenarioMock.ts

import type { ScenarioStep } from "@/types/scenario";

export const scenarioMockMap: Record<number, { meta: any; steps: Record<number, ScenarioStep> }> = {
  1: {
    meta: {
      id: 1,
      title: "월세 이체 튜토리얼"
    },
    steps: {
      1001: {
        id: 1001,
        scenarioId: 1,
        type: "IMAGE",
        content: { image: "message1" }
      },

      1002: {
        id: 1002,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "hi",
          text: "안녕! 나는 우리WON뱅킹 도우미 위비야. 첫 자취 시작한 거 축하해!"
        }
      },

      1003: {
        id: 1003,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "worried",
          text: "그런데.. 혹시 월세 납부일이 3일 남았다는 거 알고 있어?"
        }
      },

      1004: {
        id: 1004,
        scenarioId: 1,
        type: "CHOICE",
        content: {
          choices: [
            {
              good: true,
              next: 1005,
              character: "user",
              text: "A. 아! 깜빡했어. 은행 가야 하나?"
            },
            {
              good: true,
              next: 1005,
              character: "user",
              text: "B. 알고 있어. 근데 어떻게 내야 하지?"
            }
          ]
        }
      },

      1005: {
        id: 1005,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "걱정 마! 요즘은 은행에 직접 가지 않아도 돼. 우리WON뱅킹 앱으로 간편하게 이체할 수 있거든!"
        }
      },

      1006: {
        id: 1006,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          text: "내가 차근차근 알려줄게. 같이 해볼까?"
        }
      },

      1007: {
        id: 1007,
        scenarioId: 1,
        type: "CHOICE",
        content: {
          choices: [
            {
              good: true,
              next: 1009,
              character: "user",
              text: "A. 좋아! 알려줘"
            },
            {
              good: true,
              next: 1008,
              character: "user",
              text: "B. 어려울 것 같은데..."
            }
          ]
        }
      },

      1008: {
        id: 1008,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          text: "전혀 어렵지 않아! 나랑 같이 천천히 해보면 금방 익숙해질 거야. 실제 버튼을 눌러보면서 배우는 거니까 재밌을 거야! 시작해 볼까?"
        }
      },

      1009: {
        id: 1009,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text: "먼저 계좌이체에 대해 알아볼까? 계좌이체는 내 계좌에서 다른 사람의 계좌로 돈을 보내는 거야."
        }
      },

      1010: {
        id: 1010,
        scenarioId: 1,
        type: "MODAL",
        content: {
          title: "계좌이체란?",
          "1": "내 통장에서 상대방 통장으로 돈을 옮기는 것",
          "2": "인터넷이나 앱으로 24시간 언제든 가능",
          "3": "은행 창구에 가지 않아도 OK!"
        }
      },

      1011: {
        id: 1011,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text: "이제 집주인에게 월세 50만 원을 보내보자! 화면에서 '이체' 버튼을 찾아볼래?"
        }
      },

      1012: {
        id: 1012,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" }
      },

      1013: {
        id: 1013,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "자, 이제 집주인의 계좌 정보를 입력할 차례야."
        }
      },

      1014: {
        id: 1014,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "집주인 계좌번호는 **110-123-456789**이고, 은행은 **국민은행**이야. 입력해 볼래?"
        }
      },

      1015: {
        id: 1015,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" }
      },

      1016: {
        id: 1016,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" }
      },

      1017: {
        id: 1017,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" }
      },

      1018: {
        id: 1018,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "이제 얼마를 보낼지 입력해야 해. 월세가 50만 원이니까 **500000**을 입력해 볼까?"
        }
      },

      1019: {
        id: 1019,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" }
      },

      1020: {
        id: 1020,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "이제 마지막으로 계좌 비밀번호를 입력해야 해. 근데 아마 숫자가 뒤죽박죽일 거야. 당황하지 마."
        }
      },

      1021: {
        id: 1021,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "user",
          text: "왜 그렇게 나오는 거야? 이유가 궁금해!"
        }
      },

      1022: {
        id: 1022,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "키패드는 보안 때문에 매번 섞여 나와 그리고 비밀번호는 민감한 정보이기 때문에 화면에 직접적으로 나타나지 않아"
        }
      },

      1023: {
        id: 1023,
        scenarioId: 1,
        type: "MODAL",
        content: {
          title: "금융 보안 꿀팁!",
          "1": "비밀번호는 절대 남에게 알려주면 안 돼요",
          "2": "생일이나 전화번호처럼 쉬운 번호는 피하세요",
          "3": "주기적으로 비밀번호를 변경하세요",
          "4": "공공 와이파이에서는 금융 앱 사용을 자제하세요"
        }
      },

      1024: {
        id: 1024,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
          choices: [
            { good: true, next: 1025 },
            { good: false, next: 1225 },
          ],
        },
      },

      1025: {
        id: 1025,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "hi",
          text: "마지막으로 계좌번호나 금액이 맞게 입력되었는지 확인해 볼까?"
        }
      },

      1026: {
        id: 1026,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
          choices: [
            { good: true, next: 1027 },
            { good: false, next: 1327 },
          ],
        },
      },

      1027: {
        id: 1027,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "congratulation",
          text: "축하해! 이체가 성공적으로 완료됐어!"
        }
      },

      1028: {
        id: 1028,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "love",
          text: "집주인에게 월세 50만 원이 잘 전달됐어. 이제 넌 앱으로 이체하는 방법을 알게 된 거야!"
        }
      },
      
      1029: {
        id: 1029,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "user",
          text: "이체가 정말 된 건지 확인하고 싶어"
        }
      },
      
      1030: {
        id: 1030,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          text: "당연하지! 거래내역을 확인하는 방법도 알려줄게!"
        }
      },
      
      1031: {
        id: 1031,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text: "이체한 내역을 확인하려면 '전체계좌보기'로 가면 돼."
        }
      },
      
      1032: {
        id: 1032,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "전체계좌보기에서는 내가 가진 모든 계좌를 한눈에 볼 수 있고, 각 계좌의 거래 내역도 확인할 수 있어!"
        }
      },
      
      1033: {
        id: 1033,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn"
        }
      },
      
      1034: {
        id: 1034,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text: "아까 월세를 이체할 때 사용한 계좌가 어떤 거였지? 한번 선택해 봐"
        }
      },
      
      1035: {
        id: 1035,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn"
        }
      },
      
      1036: {
        id: 1036,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text: "거래내역이 많으면 찾기 어려울 수 있어. 그래서 조회 조건을 설정해서 원하는 내역만 볼 수 있어!"
        }
      },
      
      1088: {
        id: 1088,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
          choices: [
            { good: true, next: 1089 },
            { good: false, next: 1489 },
          ],
        },
      },

      1091: {
        id: 1091,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
          choices: [
            { good: true, next: 1092 },
            { good: false, next: 1592 },
          ],
        },
      },
      
      1225: {
        id: 1225,
        scenarioId: 1,
        type: "MODAL",
        content: {
          meta: { branch: "bad", badEnding: false },
          title: "계좌가 잠겼습니다",
          text: "보안상의 이유로 해당 계좌가 일시적으로 잠금 처리되었습니다.",
          solution: "잠금 해제 방법",
          "1": "영업점 방문 (신분증 지참)",
          "2": "고객센터 전화 (본인인증)",
        },
      },
      1226: {
        id: 1226,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "이럴 줄 알았어... 비밀번호를 너무 많이 틀렸어.",
        },
      },
      1227: {
        id: 1227,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "이제 은행 영업점에 직접 가거나, 고객센터에 전화해야 해.",
        },
      },
      1228: {
        id: 1228,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: true },
          character: "wibee",
          emotion: "caution",
          text: "실제에서는 5번의 기회가 있으니까 항상 조심해야 해. 다시 한번 시도해 보자",
        },
      },
      1327: {
        id: 1327,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "이체가... 완료됐어. 그런데...",
          choices: [
            { good: false, next: 1328 },
            { good: false, next: 1338 },
          ],
        },
      },
      
      1328: {
        id: 1328,
        scenarioId: 1,
        type: "MODAL",
        content: {
          meta: { branch: "bad", badEnding: false },
          receiver: "이체 받은 사람: 김집주",
          money: "금액: 5,000,000원",
          balance: "잔액: -4,200,000원"
        }
      },
      
      1329: {
        id: 1329,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "어떡해! 500만 원이 나갔어!"
        }
      },
      
      1330: {
        id: 1330,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "너무 조급하게 확인하지 않고 진행한 결과야..."
        }
      },
      
      1331: {
        id: 1331,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "이럴 때는 바로 은행에 연락해야 해!"
        }
      },
      
      1332: {
        id: 1332,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "집주인에게 전화해서 사정을 말씀드리고, 450만 원을 돌려받아야 해."
        }
      },
      
      1338: {
        id: 1338,
        scenarioId: 1,
        type: "MODAL",
        content: {
          meta: { branch: "bad", badEnding: false },
          receiver: "이체 받은 사람: 이누구",
          money: "금액: 500,000원"
        }
      },
      
      1339: {
        id: 1339,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "어떡해! 완전 다른 사람한테 돈이 입금되었어!"
        }
      },
      
      1340: {
        id: 1340,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "너무 조급하게 확인하지 않고 진행한 결과야..."
        }
      },
      
      1341: {
        id: 1341,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "이럴 때는 바로 은행에 연락해야 해!"
        }
      },
      
      1342: {
        id: 1342,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: true },
          character: "wibee",
          emotion: "caution",
          text: "신중하게! 다시 한 번 시도해보자"
        }
      },
      
      1489: {
        id: 1489,
        scenarioId: 1,
        type: "MODAL",
        content: {
          meta: { branch: "bad", badEnding: false },
          title: "계좌가 잠겼습니다",
          text: "보안상의 이유로 해당 계좌가 일시적으로 잠금 처리되었습니다.",
          solution: "잠금 해제 방법",
          "1": "영업점 방문 (신분증 지참)",
          "2": "고객센터 전화 (본인인증)"
        }
      },
      
      1490: {
        id: 1490,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "이럴 줄 알았어... 비밀번호를 너무 많이 틀렸어."
        }
      },
      
      1491: {
        id: 1491,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "이제 은행 영업점에 직접 가거나, 고객센터에 전화해야 해."
        }
      },
      
      1492: {
        id: 1492,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: true },
          character: "wibee",
          emotion: "caution",
          text: "실제에서는 5번의 기회가 있으니까 항상 조심해야 해. 다시 한번 시도해 보자"
        }
      },
      
      1592: {
        id: 1592,
        scenarioId: 1,
        type: "IMAGE",
        content: {
          meta: { branch: "bad", badEnding: false },
          image: "message2"
        }
      },
      
      1593: {
        id: 1593,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "돈이 집주인에게 제대로 입금되지 않았어"
        }
      },
      
      1594: {
        id: 1594,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: true },
          character: "wibee",
          emotion: "caution",
          text: "등록 정보를 다시 확인해서 오류가 있는 부분을 다시 해보자!"
        }
      },
    }
  }
};
