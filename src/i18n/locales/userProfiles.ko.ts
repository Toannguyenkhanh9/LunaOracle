const userProfiles = {
  tabTitle: '프로필',
  title: '공용 프로필',
  subtitle:
    '출생 정보를 한 번 저장하고 사주, 자미두수, 길일 및 다른 도구에서 다시 사용하세요.',
  add: '프로필 추가',
  createTitle: '프로필 만들기',
  editTitle: '프로필 수정',
  editorSubtitle:
    '이 정보는 Eastern Destiny의 여러 기능에서 재사용됩니다.',
  loading: '프로필을 불러오는 중...',

  basicInformation: '기본 정보',
  displayName: '표시 이름',
  displayNamePlaceholder: '예: 김민수',
  relationship: '관계',
  gender: '성별',

  birthInformation: '출생 정보',
  solarBirthDate: '양력 생년월일',
  birthTimeAccuracy: '출생 시간 정확도',
  birthTime: '출생 시간',
  unknownTimeNotice:
    '출생 시간을 모르는 경우 앱은 임시 계산값으로 12:00을 사용합니다. 일부 결과가 크게 달라질 수 있습니다.',

  birthLocation: '출생지와 시간대',
  placeName: '출생지',
  placeNamePlaceholder: '예: 호찌민시',
  timeZone: 'IANA 시간대',
  longitude: '경도',
  latitude: '위도',

  notesAndOptions: '메모와 옵션',
  notes: '개인 메모',
  notesPlaceholder:
    '이 프로필을 알아보기 위한 정보를 추가하세요...',
  favorite: '즐겨찾기',
  favoriteSubtitle:
    '즐겨찾기 프로필은 목록 위쪽에 표시됩니다.',

  save: '프로필 저장',
  saving: '저장 중...',
  savedTitle: '프로필 저장됨',
  savedMessage:
    '프로필이 이 기기에 저장되었습니다.',
  done: '완료',

  searchPlaceholder:
    '이름, 출생지 또는 메모로 검색...',
  profileCount: '{{count}}개 프로필',
  favoriteCount: '즐겨찾기',
  summaryHint:
    '출생 정보를 다시 입력하지 않고 하나의 프로필을 여러 도구에서 사용하세요.',

  importFromBazi: '저장된 사주 명식에서 가져오기',
  importFromBaziSubtitle:
    '이 기기에 저장된 사주 명식으로 공용 프로필을 만듭니다.',
  importing: '프로필 가져오는 중...',
  importCompletedTitle: '가져오기 완료',
  importCompletedMessage:
    '{{count}}개의 새 프로필을 만들었습니다.',
  importNothingMessage:
    '가져올 새 명식이 없습니다.',
  importErrorTitle: '가져올 수 없음',
  importErrorMessage:
    '저장된 사주 명식을 읽는 중 오류가 발생했습니다.',

  emptyTitle: '프로필이 없습니다',
  emptyMessage:
    '사주, 자미두수와 길일 기능에 사용할 첫 프로필을 만드세요.',
  createFirst: '첫 프로필 만들기',
  noResultsTitle: '프로필을 찾을 수 없음',
  noResultsMessage:
    '다른 검색어를 사용하거나 검색 내용을 지우세요.',

  birthDateShort: '생년월일',
  birthTimeShort: '출생 시간',
  locationShort: '출생지',
  approximatePrefix: '약',

  edit: '수정',
  duplicate: '복제',
  delete: '삭제',
  cancel: '취소',

  deleteTitle: '프로필 삭제',
  deleteMessage:
    '“{{name}}” 프로필을 삭제할까요?',

  ziweiGenderTitle: '성별이 필요합니다',
  ziweiGenderMessage:
    '자미두수 명식을 만들려면 남성 또는 여성 성별이 필요합니다. 먼저 프로필을 수정하세요.',

  privacyTitle: '개인 데이터',
  privacyMessage:
    '현재 버전에서 프로필은 이 기기에 로컬로 저장됩니다. 기기를 보호하고 허락 없이 다른 사람의 출생 정보를 공유하지 마세요.',

  profileTimeWarningTitle:
    '출생 시간 안내',
  profileTimeUnknownMessage:
    '이 프로필에는 확인된 출생 시간이 없습니다. 앱은 임시로 12:00을 사용하며 시주와 궁 결과가 달라질 수 있습니다.',
  profileTimeApproximateMessage:
    '이 프로필은 대략적인 출생 시간을 사용합니다. 정확한 시간이 다르면 일부 결과가 달라질 수 있습니다.',

  relationships: {
    self: '본인',
    partner: '배우자·연인',
    parent: '부모',
    child: '자녀',
    sibling: '형제자매',
    friend: '친구',
    client: '고객',
    other: '기타',
  },

  genders: {
    male: '남성',
    female: '여성',
    unspecified: '미지정',
  },

  timeAccuracy: {
    exact: '정확함',
    approximate: '대략적',
    unknown: '모름',
  },

  actions: {
    bazi: '사주',
    ziwei: '자미',
    dates: '길일',
  },

  errors: {
    title: '유효하지 않은 정보',
    displayNameRequired:
      '표시 이름을 입력하세요.',
    invalidDate:
      '양력 생년월일이 유효하지 않습니다.',
    invalidTime:
      '출생 시간은00:00부터23:59 사이여야 합니다.',
    timeZoneRequired:
      'IANA 시간대를 입력하세요.',
    invalidCoordinate:
      '경도 또는 위도가 유효하지 않습니다.',
    saveFailed:
      '프로필을 저장할 수 없습니다. 다시 시도하세요.',
  },
};

export default userProfiles;
