import type { ScenarioStep } from "@/types/scenario";

export const scenarioMockMap: Record<
  number,
  { meta: any; steps: Record<number, ScenarioStep> }
> = {
  1: {
    meta: {
      id: 1,
      title: "월세 이체 튜토리얼",
    },
    steps: {
      1001: {
        id: 1001,
        scenarioId: 1,
        type: "IMAGE",
        content: { image: "message1" },
      },

      1002: {
        id: 1002,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "hi",
          text: "안녕! 나는 우리WON뱅킹 도우미 위비야. 첫 자취 시작한 거 축하해!",
        },
      },

      1003: {
        id: 1003,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "worried",
          text: "그런데.. 혹시 월세 납부일이 3일 남았다는 거 알고 있어?",
        },
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
              text: "A. 아! 깜빡했어. 은행 가야 하나?",
            },
            {
              good: true,
              next: 1005,
              character: "user",
              text: "B. 알고 있어. 근데 어떻게 내야 하지?",
            },
          ],
        },
      },

      1005: {
        id: 1005,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "걱정 마! 요즘은 은행에 직접 가지 않아도 돼. 우리WON뱅킹 앱으로 간편하게 이체할 수 있거든!",
        },
      },

      1006: {
        id: 1006,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          text: "내가 차근차근 알려줄게. 같이 해볼까?",
        },
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
              text: "A. 좋아! 알려줘",
            },
            {
              good: true,
              next: 1008,
              character: "user",
              text: "B. 어려울 것 같은데...",
            },
          ],
        },
      },

      1008: {
        id: 1008,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          text:
            "전혀 어렵지 않아! 나랑 같이 천천히 해보면 금방 익숙해질 거야. 실제 버튼을 눌러보면서 배우는 거니까 재밌을 거야! 시작해 볼까?",
        },
      },

      1009: {
        id: 1009,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text:
            "먼저 계좌이체에 대해 알아볼까? 계좌이체는 내 계좌에서 다른 사람의 계좌로 돈을 보내는 거야.",
        },
      },

      1010: {
        id: 1010,
        scenarioId: 1,
        type: "MODAL",
        content: {
          title: "계좌이체란?",
          "1": "내 통장에서 상대방 통장으로 돈을 옮기는 것",
          "2": "인터넷이나 앱으로 24시간 언제든 가능",
          "3": "은행 창구에 가지 않아도 OK!",
        },
      },

      1011: {
        id: 1011,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text:
            "이제 집주인에게 월세 50만 원을 보내보자! 화면에서 '이체' 버튼을 찾아볼래?",
        },
      },

      1012: {
        id: 1012,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1013: {
        id: 1013,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "자, 이제 집주인의 계좌 정보를 입력할 차례야.",
        },
      },

      1014: {
        id: 1014,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "집주인 계좌번호는 **110-123-456789**이고, 은행은 **국민은행**이야. 입력해 볼래?",
        },
      },

      1015: {
        id: 1015,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1016: {
        id: 1016,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1017: {
        id: 1017,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1018: {
        id: 1018,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "이제 얼마를 보낼지 입력해야 해. 월세가 50만 원이니까 **500000**을 입력해 볼까?",
        },
      },

      1019: {
        id: 1019,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1020: {
        id: 1020,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "이제 마지막으로 계좌 비밀번호를 입력해야 해. 근데 아마 숫자가 뒤죽박죽일 거야. 당황하지 마.",
        },
      },

      1021: {
        id: 1021,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "user",
          text: "왜 그렇게 나오는 거야? 이유가 궁금해!",
        },
      },

      1022: {
        id: 1022,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "키패드는 보안 때문에 매번 섞여 나와 그리고 비밀번호는 민감한 정보이기 때문에 화면에 직접적으로 나타나지 않아",
        },
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
          "4": "공공 와이파이에서는 금융 앱 사용을 자제하세요",
        },
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
          text:
            "마지막으로 계좌번호나 금액이 맞게 입력되었는지 확인해 볼까?",
        },
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
          text:
            "축하해! 이체가 성공적으로 완료됐어! 정보를 확인하고 확인 버튼 눌러봐",
        },
      },

      1028: {
        id: 1028,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1029: {
        id: 1029,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "love",
          text:
            "집주인에게 월세 50만 원이 잘 전달됐어. 이제 넌 앱으로 이체하는 방법을 알게 된 거야!",
        },
      },

      1030: {
        id: 1030,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "user",
          text: "이체가 정말 된 건지 확인하고 싶어",
        },
      },

      1031: {
        id: 1031,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          text: "당연하지! 거래내역을 확인하는 방법도 알려줄게!",
        },
      },

      1032: {
        id: 1032,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text: "이체한 내역을 확인하려면 '전체계좌보기'로 가면 돼.",
        },
      },

      1033: {
        id: 1033,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "전체계좌보기에서는 내가 가진 모든 계좌를 한눈에 볼 수 있고, 각 계좌의 거래 내역도 확인할 수 있어!",
        },
      },

      1034: {
        id: 1034,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1035: {
        id: 1035,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text:
            "아까 월세를 이체할 때 사용한 계좌가 어떤 거였지? 한번 선택해 봐",
        },
      },

      1036: {
        id: 1036,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1037: {
        id: 1037,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text:
            "거래내역이 많으면 찾기 어려울 수 있어. 그래서 조회 조건을 설정해서 원하는 내역만 볼 수 있어!",
        },
      },

      1038: {
        id: 1038,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "최근 3개월 동안의 거래 내역을 확인해 볼까?",
        },
      },

      1039: {
        id: 1039,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1040: {
        id: 1040,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1041: {
        id: 1041,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text:
            "방금 전에 이체한 내역이 제일 위에 있어. 김집주님에게 이체한 내역이 보이지?",
        },
      },

      1042: {
        id: 1042,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "이 거래내역을 선택하면 더 자세한 정보를 볼 수 있어!",
        },
      },

      1043: {
        id: 1043,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1044: {
        id: 1044,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "stick",
          text:
            "짜잔! 여기서 아까 이체했던 모든 정보를 확인할 수 있어!",
        },
      },

      1045: {
        id: 1045,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "거래 일시, 받는 사람, 계좌번호, 금액, 그리고 거래 후 남은 잔액까지 다 나와 있지?",
        },
      },

      1046: {
        id: 1046,
        scenarioId: 1,
        type: "CHOICE",
        content: {
          choices: [
            {
              good: true,
              next: 1046,
              character: "user",
              text: "A. 오! 정말 자세하게 나오네",
            },
            {
              good: true,
              next: 1046,
              character: "user",
              text: "B. 이체가 제대로 된 게 확실해!",
            },
          ],
        },
      },

      1047: {
        id: 1047,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1048: {
        id: 1048,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "맞아! 이렇게 거래 내역을 확인하는 습관을 들이면 혹시 모를 실수나 문제를 빨리 발견할 수 있어.",
        },
      },

      1049: {
        id: 1049,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "congratulation",
          text:
            "잘했어! 이제 넌 계좌이체도 하고, 거래내역도 조회할 수 있게 됐어!",
        },
      },

      1050: {
        id: 1050,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "love",
          text:
            "그전에 배웠던 내용에 대해서 문제를 풀어보고 넘어가자!! 지금까지 잘 배웠으니까 쉽게 풀 수 있을 거야!!",
        },
      },

      1051: {
        id: 1051,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "congratulation",
          text: "정답이야!! 역시 너라면 잘할 줄 알았어~",
        },
      },

      1052: {
        id: 1052,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "worried",
          text:
            "근데 말이야... 매달 월세를 이렇게 일일이 이체하는 게 조금 번거롭지 않을까?",
        },
      },

      1053: {
        id: 1053,
        scenarioId: 1,
        type: "CHOICE",
        content: {
          choices: [
            {
              good: true,
              next: 1053,
              character: "user",
              text: "A. 그러게... 매달 하려니 귀찮을 것 같아",
            },
            {
              good: true,
              next: 1053,
              character: "user",
              text: "B. 더 편한 방법이 있어?",
            },
          ],
        },
      },

      1054: {
        id: 1054,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "hi",
          text: "그래서! 바로 **자동이체** 기능이 있어!",
        },
      },

      1055: {
        id: 1055,
        scenarioId: 1,
        type: "MODAL",
        content: {
          title: "자동이체란?",
          "1": "정해진 날짜에 자동으로 돈이 이체되는 기능",
          "2": "한 번만 설정하면 매달 알아서 이체됨",
          "3": "월세, 관리비, 보험료 등에 유용",
          "4": "깜빡하고 안 보낼 걱정 NO!",
          CAUTION: "주의사항",
          "5": "이체 일에 잔액이 부족하면 이체 실패",
          "6": "필요 없어지면 꼭 해지해야 함",
        },
      },

      1056: {
        id: 1056,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "hi",
          text: "자동이체를 설정하면 매달 같은 날짜에 자동으로 월세가 이체돼.",
        },
      },

      1057: {
        id: 1057,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "welcome",
          text:
            "깜빡하고 안 보낼 걱정도 없고, 일일이 할 필요도 없어! 편리하지?",
        },
      },

      1058: {
        id: 1058,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "자동이체 설정은 햄버거 메뉴(≡)에서 할 수 있어.",
        },
      },

      1059: {
        id: 1059,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "화면 왼쪽 상단의 세 줄 메뉴를 눌러볼까?",
        },
      },

      1060: {
        id: 1060,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1061: {
        id: 1061,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "메뉴가 보이지? '이체/출금' 섹션 안에 '자동이체'가 있어!",
        },
      },

      1062: {
        id: 1062,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1063: {
        id: 1063,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "여기서 자동이체를 등록하고 관리할 수 있어.",
        },
      },

      1064: {
        id: 1064,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "'자동이체 등록하기' 버튼을 눌러볼까?",
        },
      },

      1065: {
        id: 1065,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1066: {
        id: 1066,
        scenarioId: 1,
        type: "MODAL",
        content: {
          title: "자동이체 유형",
          KRW: "원화 자동이체",
          "1": "원화로 이체하는 일반적인 자동이체",
          "2": "국내 계좌 간 이체",
          "3": "월세, 관리비, 통신비 등",
          foreign: "외화 자동이체",
          "4": "외국 돈(달러, 엔 등)으로 이체",
          "5": "해외 송금이나 외화 거래 시 사용",
        },
      },

      1067: {
        id: 1067,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "월세는 원화니까 '원화 자동이체 등록'을 선택하면 돼!",
        },
      },

      1068: {
        id: 1068,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1069: {
        id: 1069,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "자동이체할 때 돈이 빠져나갈 계좌를 선택해야 해.",
        },
      },

      1070: {
        id: 1070,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "자동이체할 때 문제가 생기지 않도록 잔고가 충분한 계좌가 좋겠지?",
        },
      },

      1071: {
        id: 1071,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1072: {
        id: 1072,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "이제 집주인 계좌 정보를 입력해야 해. 아까 이체할 때 입력했던 정보와 똑같아!",
        },
      },

      1073: {
        id: 1073,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "hi",
          text:
            "계좌번호 **110-123-456789**, 은행은 **국민은행**이야.",
        },
      },

      1074: {
        id: 1074,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1075: {
        id: 1075,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1076: {
        id: 1076,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1077: {
        id: 1077,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "OK",
          text:
            "매달 자동으로 이체될 금액을 입력해. 월세 50만 원을 입력하면 돼!",
        },
      },

      1078: {
        id: 1078,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1079: {
        id: 1079,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1080: {
        id: 1080,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "rap",
          text: "이제 언제 자동이체할지 설정해야 해!",
        },
      },

      1081: {
        id: 1081,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "월세 납부일이 매달 5일이니까 이체 지정일을 5일로 설정하자.",
        },
      },

      1082: {
        id: 1082,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "그리고 임대차 계약이 1년이니까 종료일을 1년 후로 설정하면 돼!",
        },
      },

      1083: {
        id: 1083,
        scenarioId: 1,
        type: "CHOICE",
        content: {
          choices: [
            {
              good: true,
              next: 1083,
              character: "user",
              text: "A. 계약 끝나면 자동으로 해지돼?",
            },
            {
              good: true,
              next: 1084,
              character: "user",
              text: "B. 알겠어, 설정할게!",
            },
          ],
        },
      },

      1084: {
        id: 1084,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "응! 종료일을 설정하면 그 날짜가 지나면 자동이체가 자동으로 멈춰. 편리하지?",
        },
      },

      1085: {
        id: 1085,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1086: {
        id: 1086,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "OK",
          text:
            "다시 한번 비밀번호를 입력해야 해. 아까 배웠으니까 이번엔 쉽지? (비밀번호 1234)",
        },
      },

      1087: {
        id: 1087,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "user",
          text: "왜 또 입력해야 해?",
        },
      },

      1088: {
        id: 1088,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "자동이체는 매달 자동으로 돈이 나가는 거라서, 본인 확인을 한 번 더 하는 거야. 보안을 위해서!",
        },
      },

      1089: {
        id: 1089,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
          choices: [
            { good: true, next: 1089 },
            { good: false, next: 1489 }, // SQL 기준 그대로
          ],
        },
      },

      1090: {
        id: 1090,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "자동이체를 등록하기 전에 마지막으로 확인해야 해!",
        },
      },

      1091: {
        id: 1091,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "자동이체는 한 번 설정하면 매달 자동으로 돈이 나가니까 정보가 정확한지 꼼꼼히 봐야 해.",
        },
      },

      1092: {
        id: 1092,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
          choices: [
            { good: true, next: 1092 },
            { good: false, next: 1592 }, // SQL 기준 그대로
          ],
        },
      },

      1093: {
        id: 1093,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "자동이체를 등록하려면 약관에 동의해야 해.",
        },
      },

      1094: {
        id: 1094,
        scenarioId: 1,
        type: "MODAL",
        content: {
          title: "약관이란?",
          another: "타행 자동이체 약관",
          "1": "다른 은행으로 자동이체할 때의 규칙",
          "2": "우리은행 → 신한은행이라서 '타행'",
          the: "계좌간 자동이체 약관",
          "3": "같은 은행 내에서 자동이체할 때",
          "4": "우리은행 → 우리은행일 때 사용",
          CAUTION: "약관은 꼭 읽어보는 게 좋아요!",
        },
      },

      1095: {
        id: 1095,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1096: {
        id: 1096,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "우리는 우리은행에서 신한은행으로 보내는 거니까 '타행' 자동이체야!",
        },
      },

      1097: {
        id: 1097,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1098: {
        id: 1098,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1099: {
        id: 1099,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "congratulation",
          text: "축하해! 자동이체 등록에 성공했어!",
        },
      },

      1100: {
        id: 1100,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "hi",
          text:
            "이제 매달 5일에 자동으로 월세가 이체될 거야. 직접 할 필요가 없어! 정보 다 확인했으면 확인 눌러줘.",
        },
      },

      1101: {
        id: 1101,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1102: {
        id: 1102,
        scenarioId: 1,
        type: "IMAGE",
        content: { image: "clock" },
      },

      1103: {
        id: 1103,
        scenarioId: 1,
        type: "IMAGE",
        content: { image: "message3" },
      },

      1104: {
        id: 1104,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "worried",
          text: "월세가 내려갔으니까 자동이체를 새로 등록해야겠네.",
        },
      },

      1105: {
        id: 1105,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "hi",
          text:
            "그럼 지금 매월 50만 원씩 나가는 자동이체를 해지해야겠지?",
        },
      },

      1106: {
        id: 1106,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text:
            "우리가 등록했던 '월세 자동납부'가 보이지? 이걸 선택해 봐!",
        },
      },

      1107: {
        id: 1107,
        scenarioId: 1,
        type: "PRACTICE",
        content: { button: "nextbtn" },
      },

      1108: {
        id: 1108,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text:
            "여기서 자동이체 정보를 확인할 수 있고, 해지도 할 수 있어!",
        },
      },

      1109: {
        id: 1109,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "'자동이체 해지' 버튼을 눌러볼까?",
        },
      },

            1110: {
        id: 1110,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
        },
      },

      1111: {
        id: 1111,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "자동이체를 해지하기 전에 주의 사항을 읽어봐야 해!",
        },
      },

      1112: {
        id: 1112,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          text: "해지하면 바로 적용되고 되돌릴 수 없으니까 신중하게 결정해야 해.",
        },
      },

      1113: {
        id: 1113,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
        },
      },

      1114: {
        id: 1114,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "마지막으로 정말 맞는 자동이체인지 확인하고, 혹시라도 다른 자동이체를 실수로 해지하면 안 되니까!",
        },
      },

      1115: {
        id: 1115,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
        },
      },

      1116: {
        id: 1116,
        scenarioId: 1,
        type: "PRACTICE",
        content: {
          button: "nextbtn",
        },
      },

      1117: {
        id: 1117,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "congratulation",
          text: "잘했어! 자동이체가 성공적으로 해지됐어!",
        },
      },

      1118: {
        id: 1118,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "hi",
          text: "이제 더 이상 자동으로 예전 월세가 나가지 않을 거야.",
        },
      },

      1119: {
        id: 1119,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          character: "wibee",
          emotion: "aha",
          text: "마지막으로 배웠던 내용에 대한 문제를 풀어보고 끝내자!! 너라면 충분히 잘할 수 있어!!",
        },
      },

      1120: {
        id: 1120,
        scenarioId: 1,
        type: "OVERLAY",
        content: {
          character: "wibee",
          emotion: "congratulation",
          text: "마지막 퀴즈까지 완료~ 고생했어! 혹시 기억이 잘 안 난다면 다시 찾아와도 좋아! 난 항상 여기 있으니까!",
        },
      },

      1121: {
        id: 1121,
        scenarioId: 1,
        type: "IMAGE",
        content: {
          image: "point",
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
          balance: "잔액: -4,200,000원",
        },
      },

      1329: {
        id: 1329,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "어떡해! 500만 원이 나갔어!",
        },
      },

      1330: {
        id: 1330,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "너무 조급하게 확인하지 않고 진행한 결과야...",
        },
      },

      1331: {
        id: 1331,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "이럴 때는 바로 은행에 연락해야 해!",
        },
      },

      1332: {
        id: 1332,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "집주인에게 전화해서 사정을 말씀드리고, 450만 원을 돌려받아야 해.",
        },
      },

      1338: {
        id: 1338,
        scenarioId: 1,
        type: "MODAL",
        content: {
          meta: { branch: "bad", badEnding: false },
          receiver: "이체 받은 사람: 이누구",
          money: "금액: 500,000원",
        },
      },

      1339: {
        id: 1339,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "어떡해! 완전 다른 사람한테 돈이 입금되었어!",
        },
      },

      1340: {
        id: 1340,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "너무 조급하게 확인하지 않고 진행한 결과야...",
        },
      },

      1341: {
        id: 1341,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "이럴 때는 바로 은행에 연락해야 해!",
        },
      },

      1342: {
        id: 1342,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: true },
          character: "wibee",
          emotion: "caution",
          text: "신중하게! 다시 한 번 시도해보자",
        },
      },

      1490: {
        id: 1490,
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

      1491: {
        id: 1491,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "이럴 줄 알았어... 비밀번호를 너무 많이 틀렸어.",
        },
      },

      1492: {
        id: 1492,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          text: "이제 은행 영업점에 직접 가거나, 고객센터에 전화해야 해.",
        },
      },

      1493: {
        id: 1493,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: true },
          character: "wibee",
          emotion: "caution",
          text: "실제에서는 5번의 기회가 있으니까 항상 조심해야 해. 다시 한번 시도해 보자",
        },
      },

      1593: {
        id: 1593,
        scenarioId: 1,
        type: "IMAGE",
        content: {
          meta: { branch: "bad", badEnding: false },
          image: "message2",
        },
      },

      1594: {
        id: 1594,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: false },
          character: "wibee",
          emotion: "surprised",
          text: "돈이 집주인에게 제대로 입금되지 않았어",
        },
      },

      1595: {
        id: 1595,
        scenarioId: 1,
        type: "DIALOG",
        content: {
          meta: { branch: "bad", badEnding: true },
          character: "wibee",
          emotion: "caution",
          text: "등록 정보를 다시 확인해서 오류가 있는 부분을 다시 해보자!",
        },
      },
    }
  }
}