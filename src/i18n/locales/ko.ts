import bazi from './bazi.ko';
import ziwei from './ziwei.ko';
import practice, {
  practiceAudio,
  practiceMeditation,
} from './practice.ko';
import {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
} from './spiritualFeatures.ko';
import {
  dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
} from './spiritualFeatures10_13.ko';
import chantCounter
  from './chantCounter.ko';
  import practiceJourney
  from './practiceJourney.ko';
  import astrologyHome
  from './astrologyHome.ko';
  import userProfiles
  from './userProfiles.ko';
  import today
  from './today.ko';
  import insightFeatures
  from './insightFeatures.ko';
  import expertMode
  from './expertMode.ja';
  import timelineEvents
  from './timelineEvents.ko';
  import engagementFeatures
  from './engagementFeatures.ko';
  import glossary
  from './glossary.ko';
  import adsFeatures
  from './adsFeatures.ko';
const ko = {
  common: {
    cancel: '취소',
    delete: '삭제',
    reset: '재설정',
    loading: '불러오는 중...',
  },

  tabs: {
    home: '홈',
    temple: '대웅전',
    meditation: '명상',
    prayer: '기도',
  },

  home: {
    title: 'iPagoda',

    subtitle: '명상하고 기도하며 자신의 마음에 귀 기울이는 고요한 공간입니다.',

    activities: '활동',

    templeTitle: '대웅전',
    templeSubtitle: '향을 피우고 목탁 두드리기',

    meditationTitle: '명상',
    meditationSubtitle: '5~15분 명상하기',

    prayerTitle: '기도',
    prayerSubtitle: '기도 내용을 비공개로 보관하기',

    audioTitle: '소리',
    audioSubtitle: '목탁과 범종 소리 듣기',

    settingsTitle: '설정',
    settingsSubtitle: '언어 및 앱 정보',

    dailyTitle: '오늘의 알림',

    dailyText:
      '몇 분 동안 천천히 호흡하고 걱정을 내려놓은 뒤, 감사한 일 한 가지를 떠올려 보세요.',
    lunarCalendarTitle: '음력 달력',
    lunarCalendarSubtitle: '음력 초하루와 보름 보기',
    spiritualAudioTitle: '경전과 명상',

    spiritualAudioSubtitle:
      '경전, 명상 음악, 자연의 소리 듣기',
    welcome: '매일의 평온',

    peacefulSpace: '평온한 공간',

    heroTitle: '내면의 평온으로 돌아가기',

    enterTemple: '대웅전 들어가기',

    discover: '둘러보기',

    footerQuote: '마음이 평온하면 어디든 안식처가 됩니다.',
    fortuneStickTitle: '운세 제비',

    fortuneStickSubtitle: '마음을 돌아볼 메시지 뽑기',
    horoscopeTitle: '사주와 길일',

    horoscopeSubtitle: '음력 생일, 띠, 추천 날짜 보기',
     baziTitle: '사주팔자',

  baziSubtitle:
    '사주, 오행, 대운, 해석',
    baziHistoryTitle:
  '저장된 사주',

baziHistorySubtitle:
  '저장한 사주를 확인하고 관리하기',
  baziStage4Title:
  '운세 흐름과 궁합',

baziStage4Subtitle:
  '세운, 월운, 명식 비교 및 날짜 선택',
  organizedActivitiesTitle: '나를 위한 수행 공간',
practiceSectionEyebrow: '수행',
practiceSectionTitle: '수행',
practiceSectionSubtitle:
  '마음을 가라앉히고 매일의 습관을 이어 가는 활동',
calendarSectionEyebrow: '시간과 의식',
calendarSectionTitle: '달력과 의식',
calendarSectionSubtitle:
  '음력 날짜, 불교 기념일과 중요한 수행일을 확인합니다',
reflectionSectionEyebrow: '성찰',
reflectionSectionTitle: '성찰',
reflectionSectionSubtitle:
  '문화적 참고와 자기 성찰을 위한 전통 콘텐츠',
peaceJournalShortTitle: '일기',
peaceJournalShortSubtitle:
  '감정, 감사와 내려놓고 싶은 마음을 기록합니다',
newMoonFullMoonTitle: '초하루와 보름',
newMoonFullMoonSubtitle:
  '음력 의식일을 확인하고 수행을 준비합니다',
buddhistFestivalTitle: '불교 기념일',
buddhistFestivalSubtitle:
  '부처님오신날, 우란분절 등 주요 기념일을 확인합니다',
practiceReminderTitle: '수행 알림',
practiceReminderSubtitle:
  '명상, 독경과 매일 의식 알림 시간을 선택합니다',
chooseDateTitle: '길일 보기',
chooseDateSubtitle:
  '결혼, 개업과 중요한 일을 위한 날짜를 참고합니다',
        ziweiTitle: '자미두수',
  ziweiSubtitle: '출생 날짜, 시간, 장소를 입력하여 십이궁, 14주성, 21개 보조성, 사화, 순공·절공 및 장생십이신을 배치합니다.',
  },

  temple: {
    title: '대웅전',

    description: '마음을 차분히 하고 각 활동을 천천히 진행하세요.',

    motto: '숨결마다 평온을',

    noIncense: '아직 향을 피우지 않았습니다',

    lightIncense: '향 피우기',

    incenseCount: '피운 향: {{count}}개',

    woodenFish: '목탁',

    woodenFishCount: '{{count}}/108',

    bell: '범종',

    bellCount: '{{count}}회',

    completedTitle: '108번 두드리기를 완료했습니다',

    completedText: '1분 동안 조용히 앉아 호흡을 느껴 보세요.',

    resetCounter: '목탁 횟수 재설정',

    resetDialogTitle: '카운터 재설정',

    resetDialogMessage: '목탁 횟수를 0으로 재설정할까요?',
    longPressHint: '탭하면 1회 재생 • 길게 누르면 연속 재생',

    playingContinuously: '연속 재생 중',

    tapToStop: '탭하여 중지',
    lightIncenseShort: '향 피우기',
    incenseShortCount: '{{count}}개',
    incenseStatsTitle: '향 개수',
  },

meditation: {
  title: '명상',
  screenTitle: '명상',

  subtitle:
    '편안하게 앉아 어깨의 힘을 빼고, 매 순간의 호흡에 부드럽게 집중하세요.',

  breathingTitle: '호흡 명상',

  chooseDuration: '시간 선택',

  minutes: '{{count}}분',
  minuteUnit: '분',
  heroMinutes: '{{count}}분',

  start: '명상 시작',
  pause: '명상 일시정지',
  restart: '다시 명상하기',

  ready: '준비됨',
  paused: '일시정지됨',
  running: '명상 중',

  resetTime: '시간 초기화',

  completedTitle: '명상 완료',

  completedMessage:
    '천천히 호흡하며 지금의 몸과 마음 상태를 느껴보세요.',

  breathTitle: '호흡 안내',

  inhale: '4초 동안 천천히 들이쉬기',

  hold: '2초 동안 숨 멈추기',

  exhale: '6초 동안 천천히 내쉬기',
},

  prayer: {
    title: '기도 일기',

    subtitle:
      '작성한 내용은 이 기기에 저장되며 자동으로 업로드되지 않습니다.',

    placeholder: '기도하는 일이나 감사한 일을 적어 보세요...',

    save: '기도 저장',

    savedItems: '저장된 내용',

    empty: '저장한 기도가 없습니다.',

    requiredTitle: '내용 없음',

    requiredMessage: '먼저 기도 내용을 입력하세요.',

    savedTitle: '저장됨',

    savedMessage: '기도 내용이 이 기기에 비공개로 저장되었습니다.',

    saveErrorTitle: '저장할 수 없음',

    saveErrorMessage: '기도를 저장하는 중 오류가 발생했습니다.',

    deleteDialogTitle: '기도 삭제',

    deleteDialogMessage: '이 내용을 삭제하시겠습니까?',
    writeTitle: '기도 작성',

    writeHint: '내용은 기기에 비공개로 저장됩니다.',

    privateLabel: '비공개',

    savedCount: '{{count}}개 저장됨',

    emptyTitle: '저장된 기도 없음',

    savedPrivately: '비공개 저장',
  },

  audio: {
    title: '사찰 소리',

    subtitle: '대웅전에서 사용하는 소리를 들어 보세요.',

    woodenFishTitle: '목탁 소리',

    playWoodenFish: '목탁 재생',

    bellTitle: '범종 소리',

    playBell: '범종 재생',

    tapOrHoldHint: '탭하면 1회 재생 • 길게 누르면 연속 재생',

    playingContinuously: '연속 재생 중',

    tapToStop: '탭하여 중지',
  },
  settings: {
    title: '설정',

    notifications: '알림',

    notificationsDescription:
      '명상 및 음력 재일 알림은 추후 추가됩니다.',

    language: '언어',

    languageDescription: '앱에서 사용할 언어를 선택하세요.',

    chooseLanguage: '언어 선택',

    privacy: '개인정보',

    privacyDescription:
      '기도 일기는 현재 이 기기에만 저장됩니다.',

    information: '정보',

    version: '온라인 사찰 버전 0.0.1',
  },
  lunarCalendar: {
    title: '음력 달력',

    subtitle: '음력 날짜, 초하루, 보름을 확인하세요.',

    today: '오늘',

    firstDay: '음력 초하루',

    fullMoon: '보름',

    solarDate: '양력 날짜',

    lunarDate: '음력 날짜',

    lunarMonth: '음력 {{month}}월',

    leapMonth: '윤달',

    firstDayTitle: '오늘은 음력 초하루입니다',

    fullMoonTitle: '오늘은 보름입니다',

    observanceMessage:
      '잠시 시간을 내어 명상하고 돌아보거나 경전을 들어 보세요.',
  },
  lunarNotifications: {
    channelName: '음력 알림',

    channelDescription: '음력 초하루와 보름 알림.',

    settingTitle: '초하루 및 보름 알림',

    settingDescription:
      '음력 초하루와 보름에 알림을 받습니다.',

    reminderTime: '알림 시간',

    settingNote:
      '앱은 앞으로 12개월의 알림을 예약하고 실행할 때 갱신합니다.',

    firstDayTitle: '오늘은 음력 초하루입니다',

    fullMoonTitle: '오늘은 보름입니다',

    reminderBody:
      '몇 분 동안 조용히 명상하거나 기도하거나 경전을 들어 보세요.',

    permissionTitle: '알림이 꺼져 있습니다',

    permissionMessage:
      '음력 알림을 받으려면 기기 설정에서 알림을 허용하세요.',

    enabledTitle: '음력 알림이 켜졌습니다',

    enabledMessage: '{{time}}에 {{count}}개의 알림이 예약되었습니다.',

    errorTitle: '알림을 예약할 수 없음',

    errorMessage:
      '음력 알림을 예약하는 중 오류가 발생했습니다.',
  },
  spiritualAudio: {
    title: '경전과 명상',

    subtitle:
      '휴식, 명상, 마음챙김을 위한 평온한 소리를 들어 보세요.',

    searchPlaceholder: '오디오 검색...',

    playing: '재생 중',

    paused: '일시정지됨',

    empty: '일치하는 오디오를 찾을 수 없습니다.',

    categories: {
      sutra: '경전',
      meditation: '명상',
      nature: '자연',
    },

    tracks: {
      greatCompassion: {
        title: '대비주',

        description: '휴식과 마음챙김을 위한 평온한 독송입니다.',
      },

      heartSutra: {
        title: '반야심경',

        description: '차분하고 엄숙한 반야심경 독송입니다.',
      },

      buddhaName: {
        title: '염불',

        description: '마음을 평온하게 하는 부드러운 염불입니다.',
      },

      breathing: {
        title: '호흡 명상',

        description: '호흡에 집중하며 몸을 천천히 이완하세요.',
      },

      deepRelaxation: {
        title: '깊은 이완',

        description: '휴식과 편안한 잠을 위한 부드러운 명상 오디오입니다.',
      },

      singingBowl: {
        title: '싱잉볼 명상',

        description: '집중과 내면의 평온을 돕는 싱잉볼 소리입니다.',
      },

      templeRain: {
        title: '사찰의 빗소리',

        description: '고요한 사찰 분위기 속 부드러운 빗소리입니다.',
      },

      forestBirds: {
        title: '숲속 새소리',

        description: '새소리와 나뭇잎 스치는 소리가 어우러진 자연의 숲 분위기입니다.',
      },

      flowingStream: {
        title: '흐르는 시냇물',

        description: '휴식과 수면을 위한 부드러운 시냇물 소리입니다.',
      },
    },
  },
  dailyPracticeNotifications: {
    channelName: '매일 수행 알림',

    channelDescription: '명상과 경전 수행을 위한 매일 알림.',

    settingTitle: '명상 또는 경전 알림',

    settingDescription: '선택한 시간에 매일 알림을 받습니다.',

    practiceType: '알림 유형',

    typeMeditation: '명상',

    typeSutra: '경전',

    typeBoth: '둘 다',

    reminderTime: '알림 시간',

    previewLabel: '알림 미리보기',

    settingNote: '알림은 선택한 시간에 매일 반복됩니다.',

    meditationTitle: '명상할 시간입니다',

    meditationBody: '천천히 몇 번 호흡하며 자신에게 조용한 시간을 주세요.',

    sutraTitle: '경전을 독송하거나 들을 시간입니다',

    sutraBody:
      '몇 분 동안 조용히 독송하거나 들으며 마음을 가라앉히세요.',

    bothTitle: '매일 수행할 시간입니다',

    bothBody:
      '짧은 명상을 하거나 경전을 들으며 평온한 시간을 가져 보세요.',

    permissionTitle: '알림이 꺼져 있습니다',

    permissionMessage: '기기 설정에서 알림을 허용하세요.',

    enabledTitle: '매일 알림이 켜졌습니다',

    enabledMessage: '앱이 매일 {{time}}에 알려드립니다.',

    errorTitle: '알림을 예약할 수 없음',

    errorMessage: '매일 알림을 예약하는 중 오류가 발생했습니다.',
  },
  fortuneStick: {
    title: '운세 제비',

    subtitle:
      '마음을 가라앉히고 걱정되는 일을 떠올린 뒤, 자신을 돌아볼 메시지를 뽑아 보세요.',

    intentionLabel: '무엇을 기도하고 있나요?',

    intentionPlaceholder: '선택 사항: 지금 마음에 있는 일을 적어 보세요...',

    drawing: '운세 제비를 뽑는 중...',

    drawHint: '천천히 호흡하고 마음을 가라앉힌 뒤 아래 버튼을 누르세요.',

    drawingButton: '뽑는 중',

    drawButton: '운세 제비 뽑기',

    stickNumber: '번호',

    interpretationTitle: '해석',

    adviceTitle: '조언',

    drawAgain: '다시 뽑기',

    save: '저장',

    saving: '저장 중...',

    savedTitle: '운세가 저장되었습니다',

    savedMessage: '운세가 기기에 저장되었습니다.',

    saveErrorTitle: '저장할 수 없음',

    saveErrorMessage: '운세를 저장하는 중 오류가 발생했습니다.',

    historyTitle: '저장된 운세',

    historyCount: '{{count}}개 저장됨',

    emptyHistory: '아직 저장한 운세가 없습니다.',

    deleteTitle: '저장한 운세 삭제',

    deleteMessage: '이 운세를 삭제하시겠습니까?',

    disclaimer:
      '운세 제비 내용은 개인적인 성찰을 위한 것이며 전문적인 조언이나 현실의 결정을 대신할 수 없습니다.',

    levels: {
      great: '대길',
      good: '길',
      neutral: '보통',
      caution: '주의',
    },
  },
  horoscope: {
  title: '운세와 길일',

  subtitle:
    '양력 생년월일을 입력하여 음력 날짜, 띠와 중요한 일을 위한 추천 날짜를 확인하세요.',

  subtitleExtended:
    '양력 생년월일과 출생 시간, 성별, 해석 방식을 입력하여 음력 정보, 성찰적 해석과 추천 날짜를 확인하세요.',

  birthDateTitle: '양력 생년월일',

  day: '일',

  month: '월',

  year: '년',

  birthTimeTitle: '출생 시간',

  hour: '시',

  minute: '분',

  birthTimeHint: '출생지의 현지 시간',

  genderTitle: '성별',

  schoolTitle: '해석 방식',

  selectedMethod: '현재 방식',

  activityTitle: '활동',

  searchPeriod: '검색 기간',

  monthCount: '{{count}}개월',

  calculate: '변환하고 추천 날짜 찾기',

  calculateExtended: '프로필 만들고 추천 날짜 찾기',

  calculating: '계산 중...',

  invalidDateTitle: '유효하지 않은 생년월일',

  invalidInputTitle: '유효하지 않은 정보',

  invalidDateMessage:
    '올바른 양력 생년월일을 입력하세요.',

  invalidTimeMessage:
    '출생 시간은 00:00부터 23:59 사이여야 합니다.',

  profileTitle: '출생 정보',

  lunarBirthDate: '음력 생년월일',

  birthHourBranch: '출생 시지',

  zodiac: '띠',

  canChiYear: '간지 연도',

  profileGender: '성별',

  profileSchool: '해석 방식',

  yearPolarity: '출생 연도의 음양',

  cycleDirection: '참고 순행 방향',

  leapMonth: '윤달',

  resultsTitle: '추천 날짜',

  resultsSubtitle:
    '날짜는 문화적 참고 점수에 따라 정렬됩니다.',

  resultsSubtitleExtended:
    '선택한 해석 방식, 출생 띠와 출생 시지를 기준으로 날짜를 정렬합니다.',

  lunarDateLine: '음력 {{year}}년 {{month}}월 {{day}}일',

  suitableReasons: '유리한 점',

  cautionReasons: '고려할 점',

  lifeOverviewTitle: '연애와 직업',

  lifeOverviewSubtitle:
    '입력한 생년월일, 출생 시간과 선택한 해석 방식을 바탕으로 한 성찰적 해석입니다.',

  lifeStrengths: '강점',

  lifeCautions: '균형이 필요한 점',

  lifeAdvice: '성장 제안',

  disclaimer:
    '결과는 문화적 참고와 자기 성찰을 위한 것입니다. 결혼, 건축, 투자 또는 기타 중요한 결정을 위한 유일한 근거로 사용해서는 안 됩니다.',

  disclaimerExtended:
    '이것은 음력, 출생 띠, 출생 시간과 선택한 해석 방식의 가중치를 바탕으로 한 간략한 성찰 모델입니다. 완전한 자미두수 또는 사주 명식이 아니며, 중요한 결정의 유일한 근거가 되어서는 안 됩니다.',

  activities: {
    wedding: '결혼',
    construction: '건축',
    opening: '개업',
    moving: '이사',
    travel: '여행',
  },

  genders: {
    male: '남성',
    female: '여성',
    unspecified: '미지정',
  },

  schools: {
    folkTitle: '민간 종합 방식',
    folkDescription:
      '전통 길일 규칙, 띠 관계, 출생 시간과 일반적인 문화 관습을 균형 있게 반영합니다.',

    baziTitle: '사주 참고',
    baziDescription:
      '출생 띠, 출생 시지, 합과 충 관계에 더 큰 비중을 둡니다.',

    ziweiTitle: '자미두수 참고',
    ziweiDescription:
      '자미두수의 시기 해석에서 영감을 받은 성찰적 가중치와 출생 정보와 선택 날짜의 관계를 활용합니다.',

    almanacTitle: '전통 역서',
    almanacDescription:
      '역서의 길흉, 적합·회피 규칙, 길일과 전통 음력 주의일을 우선합니다.',
  },

  polarity: {
    yang: '양',
    yin: '음',
  },

  directions: {
    forward: '순행',
    backward: '역행',
    neutral: '미정',
  },

  schoolNotes: {
    folk:
      '민간 관습, 역서 요소, 띠 관계와 출생 시간 참고를 균형 있게 조합합니다.',

    bazi:
      '간략한 사주 참고로서 띠와 출생 시간의 합·충 관계에 더 높은 비중을 둡니다.',

    ziwei:
      '문화적 성찰을 위해 자미두수의 시기 개념에서 영감을 받은 간략한 가중치를 사용합니다.',

    almanac:
      '전통 역서의 적합·회피 규칙과 음력 날짜 규칙에 가장 높은 비중을 둡니다.',
  },

  ratings: {
    excellent: '매우 좋음',
    good: '좋음',
    fair: '보통',
    caution: '신중히 고려',
  },

  lifeRatings: {
    veryStrong: '매우 강함',
    favorable: '유리함',
    balanced: '균형',
    developing: '발전 중',
  },

  love: {
    title: '연애',

    styles: {
      warm: '따뜻하고 표현이 풍부함',
      steady: '안정적이고 충실함',
      independent: '독립적이고 직접적임',
      sensitive: '섬세하고 직관적임',
    },

    summaries: {
      warm:
        '애정을 솔직하게 표현하고 정서적 따뜻함, 친밀감과 진심 어린 감사를 중요하게 여길 수 있습니다.',

      steady:
        '천천히 쌓이는 신뢰, 안정적인 약속과 꾸준한 돌봄으로 형성되는 관계를 선호할 수 있습니다.',

      independent:
        '정직함, 개인 공간과 두 사람이 각자의 개성을 지킬 수 있는 관계를 중요하게 여길 수 있습니다.',

      sensitive:
        '감정의 미세한 변화를 빠르게 알아차리고 공감, 안심과 상호 이해가 있는 관계를 찾을 수 있습니다.',
    },
  },

  career: {
    title: '직업',

    styles: {
      leadership: '리더십 지향',
      creative: '창의적이고 표현적임',
      analytical: '분석적이고 체계적임',
      supportive: '지원과 봉사 지향',
      entrepreneurial: '기업가적이고 적응력이 높음',
    },

    summaries: {
      leadership:
        '책임을 맡고 사람을 조율하며 방향을 명확한 행동으로 옮길 때 좋은 성과를 낼 수 있습니다.',

      creative:
        '상상력, 소통, 디자인, 스토리텔링 또는 독창적 문제 해결을 중시하는 일에서 역량을 발휘할 수 있습니다.',

      analytical:
        '계획, 연구, 시스템 사고, 정확성과 신중한 판단이 필요한 일에서 가장 잘할 수 있습니다.',

      supportive:
        '협업, 자문, 교육, 돌봄 또는 서비스 중심 역할에서 크게 기여할 수 있습니다.',

      entrepreneurial:
        '주도성, 실험, 독립 프로젝트와 적응력을 보상하는 기회에 끌릴 수 있습니다.',
    },
  },

  reasons: {
    hoangDao: '역서상 길일',

    hacDao: '역서상 흉일',

    traditionalSuitable:
      '전통적으로 이 활동에 적합함',

    traditionalAvoid:
      '전통적으로 이 활동을 피하도록 권함',

    zodiacClash:
      '일지가 출생 띠와 충함',

    sixHarmony: '육합 관계',

    threeHarmony: '삼합 관계',

    nguyetKy: '전통 월기일',

    tamNuong: '전통 삼낭일',

    preferredLunarDay:
      '참고 규칙에서 선호하는 음력 날짜',

    weekendConvenient: '주말이라 편리함',

    birthHourClash:
      '일지가 출생 시지와 충함',

    birthHourHarmony:
      '일지가 출생 시지와 육합을 이룸',

    birthHourThreeHarmony:
      '일지가 출생 시지와 삼합을 이룸',

    birthLunarDayResonance:
      '음력 날짜가 음력 출생일과 대응함',

    school_folk:
      '민간 종합 방식으로 평가함',

    school_bazi:
      '사주 참고 프리셋으로 평가함',

    school_ziwei:
      '자미두수 참고 프리셋으로 평가함',

    school_almanac:
      '전통 역서 프리셋으로 평가함',
  },

  insights: {
    loveHarmony:
      '출생 띠와 출생 시지가 육합 관계를 이룹니다.',

    loveThreeHarmony:
      '출생 띠와 출생 시지가 같은 삼합 그룹에 속합니다.',

    loveInnerConflict:
      '출생 띠와 출생 시지가 충을 이루어 친밀감과 개인적 욕구 사이의 내적 긴장을 반영할 수 있습니다.',

    loveSelfAwareness:
      '음력 출생일은 성찰과 감정적 자기 인식의 경향을 보여 줍니다.',

    loveWarmHeart:
      '애정을 풍부하게 표현하고 따뜻한 정서적 분위기를 만들 수 있습니다.',

    loveExpressive:
      '말, 행동과 분명한 관심을 통해 돌봄을 표현하는 능력이 있을 수 있습니다.',

    loveOvergiving:
      '자신의 필요가 충족되는지 확인하기 전에 지나치게 많이 베풀 수 있습니다.',

    loveSetBoundaries:
      '돌봄이 균형을 유지하도록 명확하고 친절한 경계를 세우세요.',

    loveReceiveCare:
      '항상 주는 역할만 하기보다 다른 사람의 지원을 받아들이세요.',

    loveLoyal:
      '충성심, 신뢰성과 장기적인 헌신을 중요하게 여길 수 있습니다.',

    lovePatient:
      '관계가 발전할 시간을 기꺼이 줄 수 있습니다.',

    loveReserved:
      '감정을 안에 담아 두다가 설명하기 어려워질 수 있습니다.',

    loveSpeakClearly:
      '상대가 추측하기를 기대하지 말고 필요를 일찍 분명하게 표현하세요.',

    loveCreateRituals:
      '신뢰와 유대감을 강화하는 작은 공동 습관을 만드세요.',

    loveRespectsSpace:
      '개별성을 존중하고 개인 공간의 필요를 이해할 수 있습니다.',

    loveHonest:
      '관계에서 직접적이고 정직한 소통을 선호할 수 있습니다.',

    loveNeedsFreedom:
      '지나친 제한은 위축되거나 감정적으로 멀어지게 만들 수 있습니다.',

    loveBalanceFreedom:
      '독립성과 꾸준한 정서적 존재감 사이에서 균형을 잡으세요.',

    loveSharePlans:
      '자유가 거리감으로 느껴지지 않도록 계획과 기대를 공유하세요.',

    loveEmpathetic:
      '미묘한 감정 변화를 이해하고 공감으로 반응할 수 있습니다.',

    loveIntuitive:
      '관계를 해석할 때 직관에 크게 의존할 수 있습니다.',

    loveOverthinking:
      '소통이 불분명할 때 민감함이 과도한 생각으로 이어질 수 있습니다.',

    loveTrustSlowly:
      '추측보다 반복되는 행동을 통해 신뢰가 자라도록 하세요.',

    loveAskDirectly:
      '확실하지 않을 때 침묵을 해석하지 말고 직접 물어보세요.',

    careerPersistent:
      '끈기와 계속 앞으로 나아가려는 의지로 발전할 수 있습니다.',

    careerReflective:
      '되돌아보기, 성찰과 방식 조정을 통해 잘 배울 수 있습니다.',

    careerActionOriented:
      '양의 성향은 주도성, 눈에 보이는 행동과 결단력 있는 추진을 도울 수 있습니다.',

    careerObservant:
      '음의 성향은 관찰, 인내, 타이밍과 신중한 준비를 도울 수 있습니다.',

    careerLeadership:
      '다른 사람을 이끌고 명확한 방향을 정하는 데 편안함을 느낄 수 있습니다.',

    careerResponsibility:
      '결과에 책임을 지고 약속을 끝까지 이행하는 편일 수 있습니다.',

    careerOvercontrol:
      '지나친 통제는 협업을 제한하거나 불필요한 압박을 만들 수 있습니다.',

    careerDelegate:
      '명확하게 위임하고 다른 사람이 자신의 방식으로 기여할 공간을 주세요.',

    careerListenBeforeDeciding:
      '중요한 결정을 내리기 전에 다양한 관점을 모으세요.',

    careerCreative:
      '독창적인 아이디어를 만들고 다른 사람이 놓친 가능성을 볼 수 있습니다.',

    careerExpression:
      '소통, 디자인, 스토리텔링 또는 발표가 자연스러운 강점일 수 있습니다.',

    careerScattered:
      '한 번에 너무 많은 아이디어를 다루면 가장 중요한 일을 끝내기 어려울 수 있습니다.',

    careerBuildPortfolio:
      '완성된 작업을 눈에 보이게 쌓아 창의성을 기회로 바꾸세요.',

    careerFinishOneThing:
      '다음 아이디어로 확장하기 전에 하나의 우선순위를 끝내세요.',

    careerAnalytical:
      '세부 사항, 패턴과 인과 관계를 살펴보는 능력이 있을 수 있습니다.',

    careerPlanning:
      '체계적인 준비는 위험을 줄이고 일관성을 높이는 데 도움이 될 수 있습니다.',

    careerPerfectionism:
      '완벽한 정보를 기다리면 유용한 행동이 늦어질 수 있습니다.',

    careerSetMilestones:
      '큰 목표를 측정 가능한 단계와 명확한 기한으로 나누세요.',

    careerDecideWithEnoughData:
      '정보가 완전하지 않아도 충분할 때 행동하세요.',

    careerTeamwork:
      '협력, 신뢰성과 감정 인식을 통해 팀을 강화할 수 있습니다.',

    careerService:
      '돕고, 가르치고, 지원하거나 다른 사람의 삶을 개선하는 일에서 의미를 찾을 수 있습니다.',

    careerPeoplePleasing:
      '모두를 만족시키려 하면 에너지가 줄고 우선순위가 흐려질 수 있습니다.',

    careerProtectEnergy:
      '기여를 지속 가능하게 유지하도록 시간과 감정 노동의 한계를 정하세요.',

    careerShowYourContribution:
      '다른 사람이 알아서 알아보리라 기대하지 말고 성과를 명확히 전달하세요.',

    careerInitiative:
      '조건이 완전히 확실하지 않아도 시작하려는 의지가 있을 수 있습니다.',

    careerAdaptability:
      '환경, 시장 또는 계획이 바뀔 때 빠르게 적응할 수 있습니다.',

    careerRiskTaking:
      '기회에 대한 열정이 충분한 보호 없이 위험을 감수하게 만들 수 있습니다.',

    careerValidateRisk:
      '큰 결정을 내리기 전에 작은 실험으로 가정을 검증하세요.',

    careerKeepCashReserve:
      '독립적이거나 불확실한 기회를 추구할 때 재정 예비 자금을 유지하세요.',
  },
},
  bazi,
  ziwei,
    practice,
  practiceAudio,
  practiceMeditation,
    peaceJournal,
  buddhistCalendar,
  altarCustomization,
    dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
  chantCounter,
  practiceJourney,
  astrologyHome,
  userProfiles,
  today,
  insightFeatures,
  expertMode,
  timelineEvents,
  ...engagementFeatures,
    ...glossary,
     ...adsFeatures,
} as const;

export default ko;
