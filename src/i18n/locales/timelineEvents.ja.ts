const timelineEvents = {
  createTitle: 'タイムラインイベントを追加',
  editTitle: 'タイムラインイベントを編集',

  profileLine: 'プロフィール：{{name}}',
  profileUnavailable: 'プロフィールが見つかりません',

  basicInformation: 'イベント情報',
  eventTitle: 'タイトル',
  eventTitlePlaceholder:
    '例：転職、引っ越し、卒業...',
  description: '説明',
  descriptionPlaceholder:
    '何が起きたか、背景や感じたことを記録...',

  dateTitle: '発生日',
  day: '日',
  month: '月',
  year: '年',

  categoryTitle: 'イベント分類',
  categories: {
    career: '仕事',
    finance: '財務',
    relationship: '関係',
    family: '家族',
    health: '健康',
    education: '学習',
    relocation: '転居',
    spiritual: '内面の成長',
    achievement: '達成',
    other: 'その他',
  },

  toneTitle: 'イベントの性質',
  tones: {
    positive: '前向き',
    neutral: '中立',
    challenging: '困難',
  },

  importanceTitle: '重要度',
  importance: {
    1: '小',
    2: '注目',
    3: '大きな節目',
  },

  tagsTitle: 'タグ',
  tagsPlaceholder:
    '例：仕事、家族、変化',
  tagsHelp:
    'タグはカンマで区切ってください。',

  save: 'イベントを保存',
  update: 'イベントを更新',
  saving: '保存中...',
  done: '完了',

  savedTitle: 'イベントを保存しました',
  createdMessage:
    'イベントをタイムラインに追加しました。',
  updatedMessage:
    'イベントを更新しました。',

  sectionEyebrow: '実際の出来事',
  sectionTitle: '{{year}}年の記録',
  sectionSubtitle:
    '参考の流れと実際に起きたことを比較します。',
  add: 'イベント追加',

  emptyTitle: 'この年のイベントはありません',
  emptyMessage:
    '転職、引っ越し、関係、健康、達成などの節目を追加してください。',

  edit: '編集',
  delete: '削除',
  cancel: 'キャンセル',

  deleteTitle: 'イベントを削除',
  deleteMessage:
    '「{{title}}」を削除しますか？',

  loading: 'イベントを読み込み中...',

  privacyTitle: '個人データ',
  privacyMessage:
    'タイムラインイベントはこの端末に保存されます。許可なく他人の機密情報を記録しないでください。',

  errors: {
    title: '情報が無効です',
    titleRequired:
      'イベントタイトルを入力してください。',
    invalidDate:
      'イベントの日付が無効です。',
    saveFailed:
      'イベントを保存できません。もう一度お試しください。',
  },
};

export default timelineEvents;
