export const peaceJournal = {
  title: '마음 평온 일기',
  subtitle:
    '감정과 감사, 그리고 내려놓고 싶은 마음을 기록하는 개인 공간입니다.',
  beforeMood: '쓰기 전 기분',
  afterMood: '쓴 후 기분',
  moods: {
    peaceful: '평온함',
    grateful: '감사함',
    neutral: '보통',
    worried: '걱정됨',
    sad: '슬픔',
  },
  gratitudeLabel: '오늘 감사한 일',
  gratitudePlaceholder:
    '예: 따뜻한 식사, 안부 인사, 조용한 순간...',
  releaseLabel: '내려놓고 싶은 일',
  releasePlaceholder:
    '마음을 무겁게 하는 일을 적어 보세요...',
  prayerLabel: '오늘의 기원',
  prayerPlaceholder:
    '나 자신이나 다른 사람을 위한 따뜻한 소망을 적어 보세요...',
  noteLabel: '자유 메모',
  notePlaceholder:
    '기억하고 싶은 내용을 자유롭게 적어 보세요...',
  requiredTitle: '내용이 없습니다',
  requiredMessage:
    '저장하기 전에 하나 이상의 내용을 작성하세요.',
  savedTitle: '일기 저장 완료',
  savedMessage:
    '내용이 이 기기에 비공개로 저장되었습니다.',
  saveErrorTitle: '저장할 수 없음',
  saveErrorMessage:
    '일기를 저장하는 중 오류가 발생했습니다.',
  save: '일기 저장',
  saving: '저장 중...',
  privacy:
    '내용은 이 기기에만 저장되며 서버로 자동 업로드되지 않습니다.',
  history: '지난 기록',
  empty: '아직 작성한 일기가 없습니다.',
  deleteTitle: '일기 삭제',
  deleteMessage: '이 기록을 삭제할까요?',
};

export const buddhistCalendar = {
  title: '불교 달력',
  subtitle:
    '음력 초하루, 보름 및 일부 주요 불교 기념일을 확인합니다.',
  lunarDate: '음력 {{month}}월 {{day}}일',
  leapMonth: '윤달',
  noEvent: '이 날에는 표시된 기념일이 없습니다.',
  upcomingTitle: '다가오는 날',
  noticeTitle: '안내',
  notice:
    '기념일은 전통, 지역, 사찰 달력에 따라 다를 수 있으므로 참고용으로 확인하세요.',
  events: {
    newMoon: '음력 초하루',
    fullMoon: '음력 보름',
    maitreya: '미륵불 기념일',
    firstFullMoon: '정월 대보름',
    avalokitesvaraBirth: '관세음보살 탄생일',
    vesak: '부처님오신날',
    traditionNote:
      '전통에 따라 기념일이 다를 수 있습니다.',
    avalokitesvaraEnlightenment:
      '관세음보살 성도일',
    ulambana: '우란분절',
    avalokitesvaraRenunciation:
      '관세음보살 출가일',
    amitabha: '아미타불 기념일',
    buddhaEnlightenment: '부처님 성도일',
  },
};

export const altarCustomization = {
  title: '맞춤 법당',
  subtitle:
    '수행 공간에 어울리는 빛, 꽃, 등불과 분위기를 선택하세요.',
  preview: '미리보기',
  cultureThemeTitle: '법당 스타일',
  activeCultureTheme:
    '현재 스타일: {{theme}}',
  cultureThemes: {
    auto: '언어에 따라 자동 선택',
    vietnam: '베트남 스타일',
    china: '중국 스타일',
    japan: '일본 스타일',
    korea: '한국 스타일',
    western: '서양 스타일',
  },
  sceneTitle: '시간대',
  centerpieceTitle: '중앙 상징',
  flowerTitle: '꽃 장식',
  lampTitle: '법당 조명',
  accentTitle: '빛 색상',
  soundscapeTitle: '배경 소리',
  petalsTitle: '꽃잎 효과',
  petalsDescription:
    '법당 화면에 천천히 움직이는 꽃잎 효과를 표시합니다.',
  save: '공간 저장',
  saving: '저장 중...',
  savedTitle: '저장 완료',
  savedMessage: '법당 공간이 업데이트되었습니다.',
  saveErrorTitle: '저장할 수 없음',
  saveErrorMessage: '설정을 저장하는 중 오류가 발생했습니다.',
  reset: '기본값 복원',
  resetTitle: '기본값 복원',
  resetMessage: '모든 설정을 기본값으로 되돌릴까요?',
  soundscapeNote:
    '배경 소리는 법당 화면이 열려 있을 때만 재생됩니다.',
  sceneModes: {
    auto: '자동',
    dawn: '새벽',
    day: '낮',
    dusk: '해질녘',
    night: '밤',
  },
  centerpieces: {
    buddha: '불상',
    lotus: '연꽃',
    dharmaWheel: '법륜',
    none: '없음',
  },
  flowers: {
    lily: '백합',
    lotus: '연꽃',
    orchid: '난초',
    none: '꽃 없음',
  },
  lamps: {
    candle: '촛불',
    lantern: '등불',
    lotusLamp: '연꽃등',
    none: '없음',
  },
  accents: {
    amber: '호박색',
    gold: '금색',
    rose: '장미색',
    jade: '옥색',
    none: '없음',
  },
  soundscapes: {
    none: '소리 없음',
    rain: '사찰 빗소리',
    forest: '아침 숲',
    bell: '명상 종소리',
  },
};

export default {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
};
