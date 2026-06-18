export const peaceJournal = {
  title: '心安らぐ日記',
  subtitle:
    '感情、感謝、そして手放したいことを記すためのプライベートな空間です。',
  beforeMood: '書く前の気分',
  afterMood: '書いた後の気分',
  moods: {
    peaceful: '穏やか',
    grateful: '感謝',
    neutral: '普通',
    worried: '不安',
    sad: '悲しい',
  },
  gratitudeLabel: '今日感謝していること',
  gratitudePlaceholder:
    '例：温かい食事、優しい言葉、静かなひととき...',
  releaseLabel: '手放したいこと',
  releasePlaceholder:
    '心を重くしていることを書いてみましょう...',
  prayerLabel: '今日の祈り',
  prayerPlaceholder:
    '自分や誰かのために優しい願いを書きましょう...',
  noteLabel: '自由メモ',
  notePlaceholder:
    '残しておきたいことを自由に書いてください...',
  requiredTitle: '内容がありません',
  requiredMessage:
    '保存する前に少なくとも一つ入力してください。',
  savedTitle: '日記を保存しました',
  savedMessage:
    '内容はこの端末に非公開で保存されました。',
  saveErrorTitle: '保存できません',
  saveErrorMessage:
    '日記の保存中にエラーが発生しました。',
  save: '日記を保存',
  saving: '保存中...',
  privacy:
    '内容はこの端末内に保存され、サーバーへ自動送信されません。',
  history: 'これまでの記録',
  empty: 'まだ日記がありません。',
  deleteTitle: '日記を削除',
  deleteMessage: 'この記録を削除しますか？',
};

export const buddhistCalendar = {
  title: '仏教カレンダー',
  subtitle:
    '旧暦の一日、十五日、そして主な仏教行事を確認できます。',
  lunarDate: '旧暦 {{month}}月{{day}}日',
  leapMonth: '閏月',
  noEvent: 'この日に登録された行事はありません。',
  upcomingTitle: 'これからの行事',
  noticeTitle: '注意',
  notice:
    '行事の日付は宗派、地域、寺院の暦によって異なる場合があります。参考情報としてご利用ください。',
  events: {
    newMoon: '旧暦一日',
    fullMoon: '旧暦十五日',
    maitreya: '弥勒菩薩縁日',
    firstFullMoon: '旧正月最初の満月',
    avalokitesvaraBirth: '観音菩薩誕生会',
    vesak: 'ウェーサーカ祭',
    traditionNote:
      '宗派によって行事日が異なる場合があります。',
    avalokitesvaraEnlightenment:
      '観音菩薩成道会',
    ulambana: '盂蘭盆会',
    avalokitesvaraRenunciation:
      '観音菩薩出家会',
    amitabha: '阿弥陀如来縁日',
    buddhaEnlightenment: '成道会',
  },
};

export const altarCustomization = {
  title: 'パーソナル仏壇',
  subtitle:
    '修習空間に合う光、花、灯り、環境音を選びます。',
  preview: 'プレビュー',
  cultureThemeTitle: '仏壇のスタイル',
  activeCultureTheme:
    '現在のスタイル：{{theme}}',
  cultureThemes: {
    auto: '言語に合わせて自動選択',
    vietnam: 'ベトナム風',
    china: '中国風',
    japan: '日本風',
    korea: '韓国風',
    western: '西洋風',
  },
  sceneTitle: '時間帯',
  centerpieceTitle: '中央の象徴',
  flowerTitle: '花',
  lampTitle: '灯り',
  accentTitle: '光の色',
  soundscapeTitle: '環境音',
  petalsTitle: '舞う花びら',
  petalsDescription:
    '本堂にゆっくり舞う花びらの演出を表示します。',
  save: '空間を保存',
  saving: '保存中...',
  savedTitle: '保存しました',
  savedMessage: '本堂の空間を更新しました。',
  saveErrorTitle: '保存できません',
  saveErrorMessage:
    '設定の保存中にエラーが発生しました。',
  reset: '初期設定に戻す',
  resetTitle: '初期設定に戻す',
  resetMessage:
    'すべての設定を初期状態に戻しますか？',
  soundscapeNote:
    '環境音は本堂画面を開いている間だけ再生されます。',
  sceneModes: {
    auto: '自動',
    dawn: '夜明け',
    day: '昼',
    dusk: '夕暮れ',
    night: '夜',
  },
  centerpieces: {
    buddha: '仏像',
    lotus: '蓮',
    dharmaWheel: '法輪',
    none: 'なし',
  },
  flowers: {
    lily: '百合',
    lotus: '蓮',
    orchid: '蘭',
    none: '花なし',
  },
  lamps: {
    candle: 'ろうそく',
    lantern: '灯籠',
    lotusLamp: '蓮灯',
    none: 'なし',
  },
  accents: {
    amber: '琥珀',
    gold: '金',
    rose: 'ローズ',
    jade: '翡翠',
    none: 'なし',
  },
  soundscapes: {
    none: '音なし',
    rain: '寺の雨',
    forest: '朝の森',
    bell: '瞑想の鐘',
  },
};

export default {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
};
