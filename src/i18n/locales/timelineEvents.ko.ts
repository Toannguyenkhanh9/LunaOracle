const timelineEvents = {
  createTitle: '타임라인 이벤트 추가',
  editTitle: '타임라인 이벤트 수정',

  profileLine: '프로필: {{name}}',
  profileUnavailable: '프로필을 찾을 수 없음',

  basicInformation: '이벤트 정보',
  eventTitle: '제목',
  eventTitlePlaceholder:
    '예: 이직, 이사, 졸업...',
  description: '설명',
  descriptionPlaceholder:
    '무슨 일이 있었는지, 배경과 느낌을 기록하세요...',

  dateTitle: '발생 날짜',
  day: '일',
  month: '월',
  year: '년',

  categoryTitle: '이벤트 분류',
  categories: {
    career: '직업',
    finance: '재정',
    relationship: '관계',
    family: '가족',
    health: '건강',
    education: '학업',
    relocation: '이사',
    spiritual: '내면 성장',
    achievement: '성취',
    other: '기타',
  },

  toneTitle: '이벤트 성격',
  tones: {
    positive: '긍정적',
    neutral: '중립적',
    challenging: '도전적',
  },

  importanceTitle: '중요도',
  importance: {
    1: '가벼움',
    2: '주목할 만함',
    3: '큰 전환점',
  },

  tagsTitle: '태그',
  tagsPlaceholder:
    '예: 직장, 가족, 변화',
  tagsHelp:
    '쉼표로 태그를 구분하세요.',

  save: '이벤트 저장',
  update: '이벤트 업데이트',
  saving: '저장 중...',
  done: '완료',

  savedTitle: '이벤트 저장됨',
  createdMessage:
    '이벤트를 타임라인에 추가했습니다.',
  updatedMessage:
    '이벤트를 업데이트했습니다.',

  sectionEyebrow: '실제 이벤트',
  sectionTitle: '{{year}}년 기록',
  sectionSubtitle:
    '참고 흐름과 실제로 일어난 일을 비교하세요.',
  add: '이벤트 추가',

  emptyTitle: '이 해에 이벤트가 없습니다',
  emptyMessage:
    '이직, 이사, 관계, 건강 또는 성취 같은 전환점을 추가하세요.',

  edit: '수정',
  delete: '삭제',
  cancel: '취소',

  deleteTitle: '이벤트 삭제',
  deleteMessage:
    '“{{title}}” 이벤트를 삭제할까요?',

  loading: '이벤트 불러오는 중...',

  privacyTitle: '개인 데이터',
  privacyMessage:
    '타임라인 이벤트는 이 기기에 저장됩니다. 허락 없이 다른 사람의 민감한 정보를 기록하지 마세요.',

  errors: {
    title: '유효하지 않은 정보',
    titleRequired:
      '이벤트 제목을 입력하세요.',
    invalidDate:
      '이벤트 날짜가 유효하지 않습니다.',
    saveFailed:
      '이벤트를 저장할 수 없습니다. 다시 시도하세요.',
  },
};

export default timelineEvents;
