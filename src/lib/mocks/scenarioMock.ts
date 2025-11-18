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
        content: { button: "nextbtn" }
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
        content: { button: "nextbtn" }
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
      }
    }
  }
};
