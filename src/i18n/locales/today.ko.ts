const today = {
  eyebrow: 'Eastern Destiny 데일리',
  title: '오늘',
  homeSubtitle:
    '음력, 간지, 참고 시간대와 프로필 기반 통찰',
  openToday: '오늘 열기',
  homeSubtitle:
    '음력, 간지, 참고 시간과 오늘의 성찰을 확인하세요.',

  lunarDate: '음력 날짜',
  lunarDateValue:
    '{{year}}년 {{month}}월 {{day}}일 {{leap}}',
  leapShort: '윤달',

  ratings: {
    auspicious: '대체로 순조로움',
    balanced: '균형적',
    caution: '신중히 고려',
  },

  specialDays: {
    newMoon: '초하루',
    fullMoon: '보름',
    newMoonToday:
      '오늘은 음력 초하루입니다.',
    fullMoonToday:
      '오늘은 음력 보름입니다.',
  },

  dayEnergyEyebrow: '오늘의 흐름',
  dayEnergyTitle: '간지 정보',
  dayCanChi: '일주',
  monthCanChi: '월주',
  yearCanChi: '년주',
  dayElement: '오늘의 오행',

  elements: {
    wood: '목',
    fire: '화',
    earth: '토',
    metal: '금',
    water: '수',
    unknown: '미확인',
  },

  dailyGuidanceEyebrow: '전통 참고',
  dailyGuidanceTitle: '오늘의 활동',
  suitableTitle: '어울리는 일',
  cautionTitle: '신중할 일',
  noStrongCaution:
    '오늘의 전통 역법 자료에는 두드러진 주의 항목이 없습니다.',

  activities: {
    worship: '조용한 성찰, 기도 또는 개인 의식',
    wedding: '혼인과 약혼 관련 일',
    opening: '개업 또는 새로운 시작',
    construction: '건축, 수리 또는 착공',
    moving: '이사와 생활 공간 정리',
    travel: '여행과 출발',
    signing: '거래와 계약',
    cleaning: '청소, 정리와 정화',
    study: '학습과 지식 습득',
    health: '건강과 웰빙 관리',
    rest: '휴식과 회복',
    majorDecision: '정보가 충분하지 않은 상태의 큰 결정',
    overcommitment: '한꺼번에 너무 많은 일을 맡기',
  },

  hoursEyebrow: '오늘의 시간대',
  hoursTitle: '길한 시간 참고',
  hoursSubtitle:
    '전통적인 십이지 시간 체계를 기준으로 계산한 시간대입니다.',

  branches: {
    rat: '자시',
    ox: '축시',
    tiger: '인시',
    rabbit: '묘시',
    dragon: '진시',
    snake: '사시',
    horse: '오시',
    goat: '미시',
    monkey: '신시',
    rooster: '유시',
    dog: '술시',
    pig: '해시',
  },

  profileEyebrow: '개인 성찰',
  profileTitle: '프로필 기반 보기',
  manageProfiles: '프로필 관리',
  loadingProfiles: '프로필을 불러오는 중...',
  noProfileTitle: '성찰 프로필이 없습니다',
  noProfileMessage:
    '출생 프로필을 만들면 오늘의 개인 참고 정보를 볼 수 있습니다.',
  createProfile: '프로필 만들기',

  profileRelations: {
    sixHarmony: {
      title: '오늘의 흐름이 비교적 조화로움',
      message:
        '오늘의 지지와 출생년 띠가 육합 관계입니다. 소통, 연결과 진행 중인 일을 마무리하는 데 참고할 수 있습니다.',
    },
    threeHarmony: {
      title: '삼합의 도움',
      message:
        '오늘은 출생년과 삼합 그룹에 속합니다. 비교적 편안한 흐름을 활용해 차분히 진행하세요.',
    },
    supportive: {
      title: '다소 보조적인 흐름',
      message:
        '오늘의 지지와 출생년 관계가 비교적 가깝습니다. 익숙한 일과 꾸준한 진행에 도움이 될 수 있습니다.',
    },
    neutral: {
      title: '대체로 중립적인 흐름',
      message:
        '뚜렷한 합이나 충이 없습니다. 현실적인 계획과 실제 컨디션을 중심으로 판단하세요.',
    },
    clash: {
      title: '속도를 늦추고 확인하기',
      message:
        '오늘의 지지가 출생년 띠와 충 관계입니다. 불행을 뜻하지는 않지만 큰 결정은 서두르지 않는 편이 좋습니다.',
    },
  },

  reflectionEyebrow: '조용한 1분',
  reflectionTitle: '오늘의 성찰',

  reflections: {
    0: '평안은 모든 상황이 완벽해서가 아니라, 지금 일어나는 일을 대하는 방식에서 오기도 합니다.',
    1: '혼란스러운 일에 답하기 전에 천천히 한 번 호흡해 보세요.',
    2: '오늘 정성껏 마친 작은 일 하나가 시작하지 않은 많은 계획보다 중요할 수 있습니다.',
    3: '생각이 너무 시끄러울 때는 지금 분명히 할 수 있는 다음 한 걸음으로 돌아오세요.',
    4: '부드러움은 약함이 아니라 오랫동안 명료함을 지키는 방법일 수 있습니다.',
    5: '무엇을 통제하려 하는지 살펴보고, 불필요한 한 부분을 내려놓아 보세요.',
    6: '감사는 일상에서 이미 나를 지지하는 것들을 보게 합니다.',
    7: '빨리 갈 필요는 없습니다. 알아차림과 진실함으로 계속 걸어가면 됩니다.',
    8: '차분한 대화는 성급함이 보지 못한 길을 열 수 있습니다.',
    9: '오늘은 행동과 휴식 모두를 위한 자리를 남겨 두세요.',
    10: '확신이 없을 때는 사실, 의도와 감정 상태를 다시 확인한 뒤 결정하세요.',
    11: '당장 답을 내야 한다는 압박을 놓을 때 명료함이 찾아오기도 합니다.',
  },

  upcomingEyebrow: '다가오는 일정',
  upcomingTitle: '가장 가까운 음력 기준일',
  inDays: '{{count}}일 후',
  openCalendar: '달력 열기',

  viewFullCalendar: '전체 달력 보기',
  findAuspiciousDates: '적합한 날짜 찾기',

  disclaimerTitle: '참고 안내',
  disclaimer:
    '간지, 길한 시간, 활동 안내와 프로필 관계는 문화적 참고와 자기 성찰을 위한 것입니다. 중요한 결정의 유일한 근거로 사용하지 마세요.',
};

export default today;
