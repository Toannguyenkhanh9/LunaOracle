const bazi = {
  title: '사주팔자 명식',
  subtitle:
    '출생 날짜, 시간, 장소를 입력하여 사주, 오행, 십신, 대운 및 참고 해석을 계산합니다.',

  birthInformation: '출생 정보',
  displayName: '표시 이름',
  displayNamePlaceholder: '선택 사항',
  solarBirthDate: '양력 생년월일',
  birthTime: '현지 출생 시간',
  gender: '성별',

  birthLocation: '출생지 및 시간대',
  timeZone: 'IANA 시간대',
  placeName: '출생지',
  placeNamePlaceholder: '예: 호찌민시',
  longitude: '경도',
  latitude: '위도',

  trueSolarTime: '진태양시 보정',
  trueSolarTimeDescription:
    '정확한 경도가 필요합니다. 출생지가 확실하지 않다면 이 옵션을 끄세요.',

  calculate: '사주 명식 계산',
  calculating: '명식을 계산하는 중...',

  chartResult: '명식 결과',
  lunarDate: '음력 날짜',
  leapMonthShort: '윤달',
  dayMaster: '일간',
  strength: '일간 강약',
  favorableElements: '유리한 오행',
  correctedTime: '보정 시간',
  totalCorrection: '총 보정값',

  fourPillars: '사주',
  fiveElements: '오행 분포',
  usefulElements: '용신과 오행 균형',
  interpretation: '해석',
  luckPillars: '대운',

  noticeTitle: '안내',
  notice:
    '결과는 문화적 참고와 개인적 성찰을 위한 것이며, 확정적인 예측이나 의료·재정 조언이 아닙니다.',

  units: {
    minutes: '분',
  },

  genders: {
    male: '남성',
    female: '여성',
    unspecified: '미지정',
  },

  pillars: {
    year: '년주',
    month: '월주',
    day: '일주',
    hour: '시주',
  },

  elements: {
    wood: '목',
    fire: '화',
    earth: '토',
    metal: '금',
    water: '수',
  },

  strengthLevels: {
    veryWeak: '매우 신약',
    weak: '신약',
    balanced: '균형',
    strong: '신강',
    veryStrong: '매우 신강',
  },

  tenGods: {
    dayMaster: '일간',
    mixed: '혼합',
    friend: '비견',
    robWealth: '겁재',
    eatingGod: '식신',
    hurtingOfficer: '상관',
    indirectWealth: '편재',
    directWealth: '정재',
    sevenKillings: '편관',
    directOfficer: '정관',
    indirectResource: '편인',
    directResource: '정인',
  },

  analysis: {
    favorable: '유리',
    supportive: '보조',
    unfavorable: '불리',
    climateBalancing: '조후 균형',
  },

  common: {
    strengths: '강점',
    pointsToConsider: '주의할 점',
    advice: '조언',
  },

  interpretationSections: {
    character: '성격',
    love: '연애',
    career: '직업',
    wealth: '재물',
    wellbeing: '심신 균형',
  },

  errors: {
    title: '잘못된 정보',
    invalidDate: '출생 날짜가 올바르지 않습니다.',
    invalidTime: '출생 시간은 00:00부터 23:59 사이여야 합니다.',
    invalidTimeZone:
      '시간대가 올바르지 않습니다. 예: Asia/Ho_Chi_Minh.',
    longitudeRequired:
      '진태양시를 사용하려면 경도가 필요합니다.',
    invalidCoordinate: '경도 또는 위도가 올바르지 않습니다.',
    calculateFailed:
      '명식을 계산할 수 없습니다. 입력 정보를 다시 확인하세요.',
  },

  stage2: {
    title: '상세 분석',
    subtitle:
      '일간 강약, 명식 구조, 용신, 간지 관계 및 세 가지 주요 삶의 영역을 분석합니다.',

    strengthAndStructure: '일간 강약과 명식 구조',
    strengthScore: '강약 점수',
    primaryStructure: '주요 격국',
    purity: '순도',
    stability: '안정도',
    supportDrainBalance: '부조·설기 균형',
    monthCommand: '월령',
    roots: '통근',
    structureExposed: '격국 투출',
    structureHidden: '격국 미투출',

    detailedUsefulElements: '용신 상세 분석',
    yongShen: '용신',
    xiShen: '희신',
    jiShen: '기신',
    chouShen: '구신',
    seasonalClimate: '계절 조후',
    confidence: '신뢰도',

    relationsTitle: '합·충·형·해',
    spousePalace: '배우자궁',
    careerPillar: '직업 기둥',
    family: '가족',

    favorableFactors: '유리한 요소',
    pointsToConsider: '주의할 점',
    suggestions: '성장 제안',

    domains: {
      love: '연애 상세 분석',
      career: '직업 상세 분석',
      wealth: '재물 상세 분석',
    },

    levels: {
      low: '기초 보완 필요',
      developing: '발전 중',
      balanced: '균형',
      favorable: '유리함',
      strong: '강함',
    },

    tones: {
      supportive: '도움됨',
      mixed: '혼합',
      challenging: '도전적',
    },

    relationTypes: {
      stemCombination: '천간합',
      stemClash: '천간충',
      sixHarmony: '육합',
      sixClash: '육충',
      harm: '해',
      break: '파',
      punishment: '형',
      selfPunishment: '자형',
      threeHarmony: '삼합',
      threeMeeting: '방합',
    },

    strategies: {
      supportWeak: '신약 보강',
      drainStrong: '신강 설기',
      balanceDistribution: '오행 분포 균형',
      followStrongCandidate: '종강격 후보',
      followWeakCandidate: '종약격 후보',
    },

    climates: {
      cold: '한',
      hot: '열',
      dry: '조',
      damp: '습',
      balanced: '균형',
    },

    patterns: {
      ordinary: '일반 격국',
      followStrongCandidate: '종강격 후보',
      followWeakCandidate: '종약격 후보',
    },

    notice:
      '2단계는 투명하고 검증 가능한 구조 모델을 사용합니다. 용신, 격국 및 해석은 전통적 참고일 뿐 확정적인 예측이 아닙니다.',
  },

  stage3: {
    diagnosticsTitle: '기술적 신뢰도',
    diagnosticsSubtitle:
      '입력 정보의 품질과 계산 결과의 안정성을 평가합니다.',
    timeConfidence: '출생 시간 및 시간대',
    pillarConfidence: '사주',
    luckConfidence: '대운',
    interpretationConfidence: '해석',

    saveChart: '명식 저장',
    updateSaved: '저장된 명식 업데이트',
    saving: '저장 중...',
    savedTitle: '명식 저장 완료',
    savedMessage: '명식이 이 기기에 저장되었습니다.',
    saveErrorTitle: '저장할 수 없음',
    saveErrorMessage: '명식을 저장하는 중 오류가 발생했습니다.',

    historyTitle: '저장된 명식',
    historySubtitle:
      '현재 엔진 버전으로 명식을 확인하고 공유하거나 다시 계산합니다.',
    searchPlaceholder: '이름 또는 출생지로 검색...',
    emptyHistoryTitle: '저장된 명식 없음',
    emptyHistoryMessage:
      '명식을 만든 뒤 저장을 누르면 여기에 표시됩니다.',
    open: '열기',
    share: '공유',
    recalculate: '다시 계산',
    duplicate: '복제',
    engineVersion: '엔진',
    deleteTitle: '명식 삭제',
    deleteMessage: '이 명식을 삭제하시겠습니까?',
    recalculatedTitle: '명식 업데이트 완료',
    recalculatedMessage:
      '현재 엔진 버전으로 명식을 다시 계산했습니다.',
    recalculateErrorTitle: '업데이트할 수 없음',
    recalculateErrorMessage: '저장된 출생 정보를 확인하세요.',

    diagnosticCodes: {
      DIAGNOSTIC_AMBIGUOUS_LOCAL_TIME:
        '일광 절약 시간제 종료 구간에서 출생 시간이 두 번 발생하여 더 이른 UTC 시각을 선택했습니다.',
      DIAGNOSTIC_NONEXISTENT_LOCAL_TIME:
        '일광 절약 시간제 전환으로 존재하지 않는 출생 시간이어서 자동으로 보정했습니다.',
      DIAGNOSTIC_TRUE_SOLAR_LONGITUDE_MISSING:
        '진태양시 보정을 위해 경도가 필요합니다.',
      DIAGNOSTIC_TRUE_SOLAR_CROSSED_DATE:
        '진태양시 보정으로 현지 날짜 경계를 넘었습니다.',
      DIAGNOSTIC_LARGE_SOLAR_TIME_CORRECTION:
        '태양시 보정값이 큽니다. 경도와 시간대를 확인하세요.',
      DIAGNOSTIC_BIRTH_NEAR_SOLAR_TERM:
        '출생 시간이 절기 경계에 가깝습니다. 년주 또는 월주를 다시 확인하세요.',
      DIAGNOSTIC_BIRTH_NEAR_DAY_BOUNDARY:
        '출생 시간이 설정된 날짜 경계에 가깝습니다.',
      DIAGNOSTIC_PROVIDER_DAY_BOUNDARY_LIMITATION:
        '달력 제공자가 선택한 날짜 경계 규칙을 완전히 확인하지 못했습니다.',
      DIAGNOSTIC_LUCK_DIRECTION_UNDETERMINED:
        '성별이 지정되지 않아 대운의 순행·역행 방향을 결정할 수 없습니다.',
      DIAGNOSTIC_LUCK_START_PROVIDER_FALLBACK:
        '인접 절기 정보를 사용할 수 없어 대운 시작 나이에 대체 계산을 사용했습니다.',
      DIAGNOSTIC_USEFUL_ELEMENT_LOW_CONFIDENCE:
        '현재 용신 분석의 신뢰도가 낮습니다.',
      DIAGNOSTIC_INTERPRETATION_SCORE_SPREAD_HIGH:
        '해석 영역 간 점수 차이가 큽니다.',
      DIAGNOSTIC_TRADITIONAL_REFERENCE_ONLY:
        '해석은 문화적 참고와 개인적 성찰을 위한 것입니다.',
    },
  },

  stage4: {
    title: '운세 흐름과 궁합',
    subtitle:
      '세운과 월운을 살펴보고 두 명식을 비교하며 사주 구조로 날짜를 선택합니다.',
    calculating: '계산 중...',
    emptyTitle: '저장된 명식 없음',
    emptyMessage:
      '4단계 도구를 사용하기 전에 명식을 하나 이상 생성하고 저장하세요.',
    primaryChart: '기본 명식',
    secondaryChart: '두 번째 명식',
    optionalPartnerChart: '동반자 명식(선택 사항)',
    noPartner: '두 번째 명식 사용 안 함',

    tabs: {
      timeline: '운세 흐름',
      compatibility: '궁합',
      dates: '날짜 선택',
    },

    domains: {
      overall: '종합',
      love: '연애',
      career: '직업',
      wealth: '재물',
      wellbeing: '심신 균형',
    },

    levels: {
      low: '낮음',
      developing: '발전 중',
      balanced: '균형',
      favorable: '유리함',
      strong: '강함',
      challenging: '도전적',
      cautious: '주의 필요',
      mixed: '혼합',
    },

    timeline: {
      title: '세운과 월운',
      subtitle:
        '현재 대운, 유리한 오행, 원국과의 관계를 바탕으로 각 해를 평가합니다.',
      yearCount: '{{count}}년',
      calculate: '운세 흐름 계산',
      peakYears: '두드러진 해',
      cautionYears: '주의할 해',
      activeLuck: '현재 대운',
      monthLabel: '{{count}}월',
    },

    compatibility: {
      title: '두 명식 비교',
      subtitle:
        '감정, 소통, 안정성, 협력, 재정 흐름을 비교합니다.',
      calculate: '궁합 분석',
      overall: '종합 궁합 점수',
      purposes: {
        general: '종합',
        love: '연애',
        business: '사업 협력',
      },
      domains: {
        emotional: '감정',
        communication: '소통',
        stability: '안정성',
        cooperation: '협력',
        finance: '재정',
      },
      complementingElements: '보완되는 오행',
      conflictingElements: '조절이 필요한 오행',
    },

    dates: {
      title: '사주 날짜 선택',
      subtitle:
        '기본 명식에 구조적으로 적합한 날짜를 찾고 필요하면 동반자 명식도 반영합니다.',
      calculate: '추천 날짜 찾기',
      monthCount: '앞으로 {{count}}개월',
      activities: {
        wedding: '결혼',
        construction: '착공 / 건축',
        opening: '개업',
        moving: '이사',
        travel: '여행 / 출행',
        signing: '계약 체결',
      },
    },

    errors: {
      noPrimaryTitle: '명식이 선택되지 않음',
      noPrimaryMessage: '기본 명식을 선택하세요.',
      needTwoChartsTitle: '두 명식 필요',
      needTwoChartsMessage: '비교할 서로 다른 두 명식을 선택하세요.',
      sameChartTitle: '같은 명식',
      sameChartMessage: '첫 번째와 두 번째 명식은 달라야 합니다.',
      calculateTitle: '계산할 수 없음',
      calculateMessage: '4단계 분석 중 오류가 발생했습니다.',
    },

    notice:
      '4단계는 투명하고 검증 가능한 구조 모델입니다. 세운, 궁합, 날짜 선택 결과는 문화적 참고일 뿐 현실 판단이나 전문 택일을 대신하지 않습니다.',
  },
};

export default bazi;
