const practiceJourney = {
  title: '수행 여정',
  subtitle:
    '7일, 21일 또는 49일 여정을 선택해 평온한 일상 수행을 차근차근 만들어 보세요.',

  homeTitle: '7/21/49일 수행 여정',
  homeSubtitle:
    '매일 명상, 염불, 기도와 마음 일기를 따라 수행합니다.',

  choosePlan: '수행 여정 선택',
  days: '{{count}}일',
  loading: '여정을 불러오는 중...',
  notice:
    '이 여정은 습관 형성과 자기 성찰을 돕기 위한 것입니다. 건강과 시간, 상황에 맞게 속도를 조절하세요.',

  plans: {
    7: {
      title: '7일 평온한 시작',
      description:
        '짧고 부담 없이 지속할 수 있는 수행부터 시작합니다.',
    },
    21: {
      title: '21일 습관 만들기',
      description:
        '꾸준한 리듬을 만들고 수행 시간을 조금씩 늘립니다.',
    },
    49: {
      title: '49일 집중 수행',
      description:
        '꾸준함, 알아차림과 감사의 마음을 깊이 기르는 여정입니다.',
    },
  },

  startDialogTitle: '여정 시작',
  startDialogMessage:
    '오늘부터 {{count}}일 수행 여정을 시작할까요?',
  start: '시작',
  cancel: '취소',

  stopDialogTitle: '여정 중단',
  stopDialogMessage:
    '현재 진행 상황이 삭제됩니다. 중단할까요?',
  stop: '중단',
  stopJourney: '중단하고 다른 여정 선택',

  errorTitle: '시작할 수 없음',
  startError:
    '여정을 만드는 중 오류가 발생했습니다. 다시 시도하세요.',

  currentJourney: '현재 여정',
  startedOn: '{{date}} 시작',
  daysCompleted:
    '{{completed}}/{{total}}일 완료',
  journeyDays: '여정 날짜',

  dayNumber: '{{count}}일차',
  dayDescription:
    '{{week}}주차 · 편안한 속도로 각 단계를 완료하세요.',
  completed: '완료',
  inProgress: '진행 중',

  open: '열기',
  manualHint:
    '관련 기능을 열어 수행하거나, 완료 후 직접 체크할 수 있습니다.',
  taskProgress:
    '{{current}}/{{target}} {{unit}}',

  journeyCompletedTitle:
    '수행 여정을 완료했습니다',
  journeyCompletedMessage:
    '지금까지의 꾸준함을 인정하고 자신에게 맞는 수행을 계속 이어가세요.',
  chooseAnotherPlan:
    '새 여정 선택',

  completedJourneys:
    '완료한 여정',

  themes: {
    day1: '현재로 돌아오기',
    day2: '서원 기르기',
    day3: '내면의 소리 듣기',
    day4: '호흡에 머물기',
    day5: '평안의 씨앗 심기',
    day6: '이완과 감사',
    day7: '마음챙김으로 한 주 마무리',
  },

  tasks: {
    incense: {
      title: '향 피우기',
      description:
        '향 {{target}}개를 피우고 1분간 마음을 가라앉힙니다.',
    },
    meditation: {
      title: '명상',
      description:
        '최소 {{target}}{{unit}} 명상합니다.',
    },
    chant: {
      title: '염불과 진언',
      description:
        '염불 또는 진언을 {{target}}{{unit}} 수행합니다.',
    },
    prayer: {
      title: '기도',
      description:
        '진심 어린 기도 {{target}}개를 쓰거나 읽습니다.',
    },
    audio: {
      title: '경전과 명상 음악',
      description:
        '마음을 안정시키는 콘텐츠를 최소 {{target}}개 듣습니다.',
    },
    journal: {
      title: '마음 일기',
      description:
        '오늘의 깨달음이나 감사 {{target}}가지를 기록합니다.',
    },
    breath: {
      title: '호흡 세기',
      description:
        '천천히 의식하며 {{target}}{{unit}}을 따라갑니다.',
    },
    dailyRitual: {
      title: '매일 의식',
      description:
        '오늘의 종합 수행 의식 {{target}}회를 완료합니다.',
    },
  },

  units: {
    incense: '개',
    meditation: '분',
    chant: '회',
    prayer: '개',
    audio: '개',
    journal: '개',
    breath: '번의 호흡',
    dailyRitual: '회',
  },
};

export default practiceJourney;
