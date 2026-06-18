const userProfiles = {
  tabTitle: 'プロフィール',
  title: '共通プロフィール',
  subtitle:
    '出生情報を一度保存し、八字、紫微斗数、吉日選びなどで再利用できます。',
  add: 'プロフィール追加',
  createTitle: 'プロフィール作成',
  editTitle: 'プロフィール編集',
  editorSubtitle:
    'この情報はEastern Destinyの各機能で再利用できます。',
  loading: 'プロフィールを読み込み中...',

  basicInformation: '基本情報',
  displayName: '表示名',
  displayNamePlaceholder: '例：山田太郎',
  relationship: '関係',
  gender: '性別',

  birthInformation: '出生情報',
  solarBirthDate: '西暦の生年月日',
  birthTimeAccuracy: '出生時刻の精度',
  birthTime: '出生時刻',
  unknownTimeNotice:
    '出生時刻が不明な場合、アプリは一時的な計算値として12:00を使用します。一部の結果が大きく変わる可能性があります。',

  birthLocation: '出生地とタイムゾーン',
  placeName: '出生地',
  placeNamePlaceholder: '例：ホーチミン市',
  timeZone: 'IANAタイムゾーン',
  longitude: '経度',
  latitude: '緯度',

  notesAndOptions: 'メモとオプション',
  notes: '個人メモ',
  notesPlaceholder:
    'このプロフィールを識別するための情報を追加...',
  favorite: 'お気に入りに登録',
  favoriteSubtitle:
    'お気に入りは一覧の上部に優先表示されます。',

  save: 'プロフィールを保存',
  saving: '保存中...',
  savedTitle: '保存しました',
  savedMessage:
    'プロフィールをこの端末に保存しました。',
  done: '完了',

  searchPlaceholder:
    '名前、出生地、メモから検索...',
  profileCount: '{{count}}件のプロフィール',
  favoriteCount: 'お気に入り',
  summaryHint:
    '出生情報を再入力せず、一つのプロフィールを複数の機能で使用できます。',

  importFromBazi: '保存済み八字命式から取り込む',
  importFromBaziSubtitle:
    'この端末に保存されている八字命式から共通プロフィールを作成します。',
  importing: 'プロフィールを取り込み中...',
  importCompletedTitle: '取り込み完了',
  importCompletedMessage:
    '{{count}}件の新しいプロフィールを作成しました。',
  importNothingMessage:
    '取り込める新しい命式はありません。',
  importErrorTitle: '取り込めません',
  importErrorMessage:
    '保存済み八字命式の読み込み中にエラーが発生しました。',

  emptyTitle: 'プロフィールがありません',
  emptyMessage:
    '八字、紫微斗数、吉日選びで使う最初のプロフィールを作成しましょう。',
  createFirst: '最初のプロフィールを作成',
  noResultsTitle: 'プロフィールが見つかりません',
  noResultsMessage:
    '別のキーワードを試すか、検索を消去してください。',

  birthDateShort: '生年月日',
  birthTimeShort: '出生時刻',
  locationShort: '出生地',
  approximatePrefix: '約',

  edit: '編集',
  duplicate: '複製',
  delete: '削除',
  cancel: 'キャンセル',

  deleteTitle: 'プロフィールを削除',
  deleteMessage:
    '「{{name}}」を削除しますか？',

  ziweiGenderTitle: '性別が必要です',
  ziweiGenderMessage:
    '紫微斗数の命盤作成には男性または女性の選択が必要です。先にプロフィールを編集してください。',

  privacyTitle: '個人データ',
  privacyMessage:
    '現在のバージョンではプロフィールは端末内に保存されます。端末を保護し、許可なく他人の出生情報を共有しないでください。',

  profileTimeWarningTitle:
    '出生時刻について',
  profileTimeUnknownMessage:
    'このプロフィールには確定した出生時刻がありません。アプリは一時的に12:00を使用するため、時柱や宮の結果が変わる可能性があります。',
  profileTimeApproximateMessage:
    'このプロフィールは推定の出生時刻を使用しています。正確な時刻が異なる場合、一部の結果が変わる可能性があります。',

  relationships: {
    self: '本人',
    partner: 'パートナー',
    parent: '親',
    child: '子ども',
    sibling: '兄弟姉妹',
    friend: '友人',
    client: '顧客',
    other: 'その他',
  },

  genders: {
    male: '男性',
    female: '女性',
    unspecified: '未指定',
  },

  timeAccuracy: {
    exact: '正確',
    approximate: 'おおよそ',
    unknown: '不明',
  },

  actions: {
    bazi: '八字',
    ziwei: '紫微',
    dates: '吉日',
  },

  errors: {
    title: '情報が無効です',
    displayNameRequired:
      '表示名を入力してください。',
    invalidDate:
      '西暦の生年月日が無効です。',
    invalidTime:
      '出生時刻は00:00から23:59の範囲で入力してください。',
    timeZoneRequired:
      'IANAタイムゾーンを入力してください。',
    invalidCoordinate:
      '経度または緯度が無効です。',
    saveFailed:
      'プロフィールを保存できません。もう一度お試しください。',
  },
};

export default userProfiles;
