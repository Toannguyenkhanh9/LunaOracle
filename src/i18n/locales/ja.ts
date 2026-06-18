import bazi from './bazi.ja';
import ziwei from './ziwei.ja';
import practice, {
  practiceAudio,
  practiceMeditation,
} from './practice.ja';
import {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
} from './spiritualFeatures.ja';
import {
  dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
} from './spiritualFeatures10_13.ja';
import chantCounter
  from './chantCounter.ja';
  import practiceJourney
  from './practiceJourney.ja';
  import astrologyHome
  from './astrologyHome.ja';
  import userProfiles
  from './userProfiles.ja';
  import today
  from './today.ja';
  import insightFeatures
  from './insightFeatures.ja';
  import expertMode
  from './expertMode.ja';
  import timelineEvents
  from './timelineEvents.ja';
  import engagementFeatures
  from './engagementFeatures.ja';
  import glossary
  from './glossary.ja';
  import adsFeatures
  from './adsFeatures.ja';
const ja = {
  common: {
    cancel: 'キャンセル',
    delete: '削除',
    reset: 'リセット',
    loading: '読み込み中...',
  },

  tabs: {
    home: 'ホーム',
    temple: '本堂',
    meditation: '瞑想',
    prayer: '祈り',
  },

  home: {
    title: 'iPagoda',

    subtitle: '瞑想し、祈り、自分の心に耳を傾けるための静かな空間です。',

    activities: 'アクティビティ',

    templeTitle: '本堂',
    templeSubtitle: 'お香を焚き、木魚を打つ',

    meditationTitle: '瞑想',
    meditationSubtitle: '5〜15分間瞑想する',

    prayerTitle: '祈り',
    prayerSubtitle: '祈りを非公開で保存する',

    audioTitle: '音',
    audioSubtitle: '木魚と梵鐘の音を聴く',

    settingsTitle: '設定',
    settingsSubtitle: '言語とアプリ情報',

    dailyTitle: '今日のリマインダー',

    dailyText:
      '数分間ゆっくり呼吸し、不安を手放して、感謝できることを一つ思い浮かべましょう。',
    lunarCalendarTitle: '旧暦カレンダー',
    lunarCalendarSubtitle: '旧暦1日と15日を確認',
    spiritualAudioTitle: 'お経と瞑想',

    spiritualAudioSubtitle:
      'お経、瞑想音楽、自然音を聴く',
    welcome: '毎日に安らぎを',

    peacefulSpace: '安らぎの空間',

    heroTitle: '心の平穏へ戻る',

    enterTemple: '本堂に入る',

    discover: '見つける',

    footerQuote: '心が穏やかなら、どこでも安らぎの場になります。',
    fortuneStickTitle: 'おみくじ',

    fortuneStickSubtitle: '心を整えるためのメッセージを引く',
    horoscopeTitle: '運勢と吉日',

    horoscopeSubtitle: '旧暦の誕生日、干支、おすすめの日を確認',
     baziTitle: '四柱推命',

  baziSubtitle:
    '四柱、五行、大運、解釈',
    baziHistoryTitle:
  '保存済みの四柱推命',

baziHistorySubtitle:
  '保存した四柱推命を確認・管理',
  baziStage4Title:
  '運勢推移と相性',

baziStage4Subtitle:
  '流年・流月、命式比較、日取り選択',
  organizedActivitiesTitle: 'あなたのための修習空間',
practiceSectionEyebrow: '修習',
practiceSectionTitle: '修習',
practiceSectionSubtitle:
  '心を落ち着け、毎日の習慣を続けるための活動',
calendarSectionEyebrow: '時間と儀式',
calendarSectionTitle: '暦と儀式',
calendarSectionSubtitle:
  '旧暦の日付、仏教行事、重要な修習日を確認します',
reflectionSectionEyebrow: '省察',
reflectionSectionTitle: '省察',
reflectionSectionSubtitle:
  '文化的な参考と自己省察のための伝統コンテンツ',
peaceJournalShortTitle: '日記',
peaceJournalShortSubtitle:
  '感情、感謝、手放したいことを記録します',
newMoonFullMoonTitle: '朔日と満月日',
newMoonFullMoonSubtitle:
  '旧暦の節目を確認し、儀式の準備をします',
buddhistFestivalTitle: '仏教行事',
buddhistFestivalSubtitle:
  'ウェーサーカ祭、盂蘭盆会などの行事を確認します',
practiceReminderTitle: '修習リマインダー',
practiceReminderSubtitle:
  '瞑想、読経、毎日の儀式の通知時間を選びます',
chooseDateTitle: '日取りを見る',
chooseDateSubtitle:
  '結婚、開店、重要な予定に適した日を参考にします',
        ziweiTitle: '紫微斗数',
  ziweiSubtitle: '生年月日、出生時刻、出生地を入力して、十二宮、十四主星、21の補助星、四化、旬空・截空、十二運を配置します。',
  },

  temple: {
    title: '本堂',

    description: '心を落ち着け、一つ一つの動作をゆっくり行いましょう。',

    motto: '一呼吸ごとに安らぎを',

    noIncense: 'まだお香は焚かれていません',

    lightIncense: 'お香を焚く',

    incenseCount: '焚いたお香：{{count}}本',

    woodenFish: '木魚',

    woodenFishCount: '{{count}}/108',

    bell: '梵鐘',

    bellCount: '{{count}}回',

    completedTitle: '108回打ち終えました',

    completedText: '1分間静かに座り、呼吸を感じてみましょう。',

    resetCounter: '木魚カウンターをリセット',

    resetDialogTitle: 'カウンターをリセット',

    resetDialogMessage: '木魚の回数を0に戻しますか？',
    longPressHint: 'タップで1回再生 • 長押しで連続再生',

    playingContinuously: '連続再生中',

    tapToStop: 'タップして停止',
    lightIncenseShort: 'お香を焚く',
    incenseShortCount: '{{count}}本',
    incenseStatsTitle: 'お香の本数',
  },

meditation: {
  title: '瞑想',
  screenTitle: '瞑想',

  subtitle:
    '楽な姿勢で座り、肩の力を抜いて、一呼吸ずつ静かに意識を向けましょう。',

  breathingTitle: '呼吸瞑想',

  chooseDuration: '時間を選択',

  minutes: '{{count}}分',
  minuteUnit: '分',
  heroMinutes: '{{count}}分',

  start: '瞑想を始める',
  pause: '瞑想を一時停止',
  restart: 'もう一度瞑想する',

  ready: '準備完了',
  paused: '一時停止中',
  running: '瞑想中',

  resetTime: '時間をリセット',

  completedTitle: '瞑想が完了しました',

  completedMessage:
    'ゆっくり呼吸し、今の心と体の状態を感じてみましょう。',

  breathTitle: '呼吸ガイド',

  inhale: '4秒かけてゆっくり吸う',

  hold: '2秒間息を止める',

  exhale: '6秒かけてゆっくり吐く',
},

  prayer: {
    title: '祈りの日記',

    subtitle:
      '入力内容はこの端末に保存され、自動的にアップロードされません。',

    placeholder: '祈っていることや感謝していることを書いてください...',

    save: '祈りを保存',

    savedItems: '保存済み',

    empty: '保存された祈りはありません。',

    requiredTitle: '内容がありません',

    requiredMessage: '先に祈りの内容を入力してください。',

    savedTitle: '保存しました',

    savedMessage: '祈りはこの端末に非公開で保存されました。',

    saveErrorTitle: '保存できません',

    saveErrorMessage: '祈りの保存中にエラーが発生しました。',

    deleteDialogTitle: '祈りを削除',

    deleteDialogMessage: 'この内容を削除してもよろしいですか？',
    writeTitle: '祈りを書く',

    writeHint: '内容は端末に非公開で保存されます。',

    privateLabel: '非公開',

    savedCount: '{{count}}件保存済み',

    emptyTitle: '保存された祈りはありません',

    savedPrivately: '非公開で保存',
  },

  audio: {
    title: '寺院の音',

    subtitle: '本堂で使われる音を聴きます。',

    woodenFishTitle: '木魚の音',

    playWoodenFish: '木魚を再生',

    bellTitle: '梵鐘の音',

    playBell: '梵鐘を再生',

    tapOrHoldHint: 'タップで1回再生 • 長押しで連続再生',

    playingContinuously: '連続再生中',

    tapToStop: 'タップして停止',
  },
  settings: {
    title: '設定',

    notifications: '通知',

    notificationsDescription:
      '瞑想と旧暦の行事リマインダーは後で追加されます。',

    language: '言語',

    languageDescription: 'アプリで使用する言語を選択します。',

    chooseLanguage: '言語を選択',

    privacy: 'プライバシー',

    privacyDescription:
      '祈りの日記は現在この端末にのみ保存されています。',

    information: '情報',

    version: 'オンライン寺院 バージョン 0.0.1',
  },
  lunarCalendar: {
    title: '旧暦カレンダー',

    subtitle: '旧暦の日付、旧暦1日、15日を確認します。',

    today: '今日',

    firstDay: '旧暦1日',

    fullMoon: '旧暦15日',

    solarDate: '新暦',

    lunarDate: '旧暦',

    lunarMonth: '旧暦{{month}}月',

    leapMonth: '閏月',

    firstDayTitle: '今日は旧暦1日です',

    fullMoonTitle: '今日は旧暦15日です',

    observanceMessage:
      '少し時間を取り、瞑想したり振り返ったり、お経を聴いたりしましょう。',
  },
  lunarNotifications: {
    channelName: '旧暦リマインダー',

    channelDescription: '旧暦1日と15日のリマインダー。',

    settingTitle: '旧暦1日・15日のリマインダー',

    settingDescription:
      '旧暦1日と15日に通知を受け取ります。',

    reminderTime: '通知時刻',

    settingNote:
      'アプリは今後12か月分の通知を設定し、起動時に更新します。',

    firstDayTitle: '今日は旧暦1日です',

    fullMoonTitle: '今日は旧暦15日です',

    reminderBody:
      '数分間静かに瞑想したり、祈ったり、お経を聴いたりしましょう。',

    permissionTitle: '通知が無効です',

    permissionMessage:
      '旧暦リマインダーを受け取るには、端末設定で通知を許可してください。',

    enabledTitle: '旧暦リマインダーを有効にしました',

    enabledMessage: '{{time}}に{{count}}件のリマインダーを設定しました。',

    errorTitle: 'リマインダーを設定できません',

    errorMessage:
      '旧暦リマインダーの設定中にエラーが発生しました。',
  },
  spiritualAudio: {
    title: 'お経と瞑想',

    subtitle:
      'リラックス、瞑想、マインドフルネスのための穏やかな音を聴きます。',

    searchPlaceholder: '音声を検索...',

    playing: '再生中',

    paused: '一時停止中',

    empty: '一致する音声が見つかりませんでした。',

    categories: {
      sutra: 'お経',
      meditation: '瞑想',
      nature: '自然',
    },

    tracks: {
      greatCompassion: {
        title: '大悲心陀羅尼',

        description: 'リラックスとマインドフルネスのための穏やかな読誦です。',
      },

      heartSutra: {
        title: '般若心経',

        description: '落ち着いた厳かな般若心経の読誦です。',
      },

      buddhaName: {
        title: '念仏',

        description: '心を穏やかにする優しい念仏です。',
      },

      breathing: {
        title: '呼吸瞑想',

        description: '呼吸に意識を向け、徐々に体を緩めます。',
      },

      deepRelaxation: {
        title: '深いリラクゼーション',

        description: '休息と穏やかな眠りのための優しい瞑想音声です。',
      },

      singingBowl: {
        title: 'シンギングボウル瞑想',

        description: '集中と心の静けさを促すシンギングボウルの音です。',
      },

      templeRain: {
        title: '寺院の雨音',

        description: '静かな寺院の雰囲気に包まれた優しい雨音です。',
      },

      forestBirds: {
        title: '森の鳥たち',

        description: '鳥の声と木の葉のそよぎが聞こえる自然な森の音です。',
      },

      flowingStream: {
        title: 'せせらぎ',

        description: 'リラックスや睡眠に適した穏やかな小川の音です。',
      },
    },
  },
  dailyPracticeNotifications: {
    channelName: '毎日の修行リマインダー',

    channelDescription: '瞑想や読経のための毎日のリマインダー。',

    settingTitle: '瞑想または読経のリマインダー',

    settingDescription: '選択した時刻に毎日通知を受け取ります。',

    practiceType: 'リマインダーの種類',

    typeMeditation: '瞑想',

    typeSutra: 'お経',

    typeBoth: '両方',

    reminderTime: '通知時刻',

    previewLabel: '通知プレビュー',

    settingNote: '通知は選択した時刻に毎日繰り返されます。',

    meditationTitle: '瞑想の時間です',

    meditationBody: 'ゆっくり呼吸し、自分に静かな時間を与えましょう。',

    sutraTitle: '読経またはお経を聴く時間です',

    sutraBody:
      '数分間静かに唱えたり聴いたりして、心を落ち着けましょう。',

    bothTitle: '毎日の修行の時間です',

    bothBody:
      '短い瞑想をするか、お経を聴いて穏やかな時間を過ごしましょう。',

    permissionTitle: '通知が無効です',

    permissionMessage: '端末設定で通知を許可してください。',

    enabledTitle: '毎日のリマインダーを有効にしました',

    enabledMessage: 'アプリが毎日{{time}}にお知らせします。',

    errorTitle: 'リマインダーを設定できません',

    errorMessage: '毎日のリマインダー設定中にエラーが発生しました。',
  },
  fortuneStick: {
    title: 'おみくじ',

    subtitle:
      '心を落ち着け、気になっていることを思いながら、振り返りのメッセージを引きましょう。',

    intentionLabel: '何を願っていますか？',

    intentionPlaceholder: '任意：今気になっていることを書いてください...',

    drawing: 'おみくじを引いています...',

    drawHint: 'ゆっくり呼吸し、心を落ち着けて、下のボタンをタップしてください。',

    drawingButton: '抽選中',

    drawButton: 'おみくじを引く',

    stickNumber: '番号',

    interpretationTitle: '解釈',

    adviceTitle: 'アドバイス',

    drawAgain: 'もう一度引く',

    save: '保存',

    saving: '保存中...',

    savedTitle: 'おみくじを保存しました',

    savedMessage: 'おみくじを端末に保存しました。',

    saveErrorTitle: '保存できません',

    saveErrorMessage: 'おみくじの保存中にエラーが発生しました。',

    historyTitle: '保存済みのおみくじ',

    historyCount: '{{count}}件保存済み',

    emptyHistory: 'まだおみくじを保存していません。',

    deleteTitle: '保存したおみくじを削除',

    deleteMessage: 'このおみくじを削除してもよろしいですか？',

    disclaimer:
      'おみくじの内容は個人の振り返りのためのものであり、専門的な助言や現実の判断に代わるものではありません。',

    levels: {
      great: '大吉',
      good: '吉',
      neutral: '中立',
      caution: '注意',
    },
  },
  horoscope: {
  title: '運勢と吉日',

  subtitle:
    '西暦の生年月日を入力し、旧暦の日付、干支、重要な行事の候補日を確認します。',

  subtitleExtended:
    '西暦の生年月日と出生時刻、性別、解釈方式を入力し、旧暦プロフィール、内省的な解釈、候補日を確認します。',

  birthDateTitle: '西暦の生年月日',

  day: '日',

  month: '月',

  year: '年',

  birthTimeTitle: '出生時刻',

  hour: '時',

  minute: '分',

  birthTimeHint: '出生地の現地時刻',

  genderTitle: '性別',

  schoolTitle: '解釈方式',

  selectedMethod: '現在の方式',

  activityTitle: '目的',

  searchPeriod: '検索期間',

  monthCount: '{{count}}か月',

  calculate: '変換して候補日を探す',

  calculateExtended: 'プロフィールを作成して候補日を探す',

  calculating: '計算中...',

  invalidDateTitle: '生年月日が無効です',

  invalidInputTitle: '情報が無効です',

  invalidDateMessage:
    '有効な西暦の生年月日を入力してください。',

  invalidTimeMessage:
    '出生時刻は00:00から23:59の範囲で入力してください。',

  profileTitle: '出生情報',

  lunarBirthDate: '旧暦の生年月日',

  birthHourBranch: '出生時の地支',

  zodiac: '干支',

  canChiYear: '干支年',

  profileGender: '性別',

  profileSchool: '解釈方式',

  yearPolarity: '出生年の陰陽',

  cycleDirection: '参考運行方向',

  leapMonth: '閏月',

  resultsTitle: '候補日',

  resultsSubtitle:
    '日付は文化的な参考スコアによって順位付けされます。',

  resultsSubtitleExtended:
    '選択した方式、出生年の干支、出生時の地支に基づいて日付を順位付けします。',

  lunarDateLine: '旧暦 {{year}}年{{month}}月{{day}}日',

  suitableReasons: '良い要素',

  cautionReasons: '考慮すべき点',

  lifeOverviewTitle: '恋愛と仕事',

  lifeOverviewSubtitle:
    '入力した生年月日、出生時刻、選択した解釈方式に基づく内省的な読み解きです。',

  lifeStrengths: '長所',

  lifeCautions: '整えるべき点',

  lifeAdvice: '成長の提案',

  disclaimer:
    '結果は文化的な参考と自己内省のためのものです。結婚、建築、投資、その他の重要な決定の唯一の根拠にはしないでください。',

  disclaimerExtended:
    'これは旧暦、出生年の干支、出生時刻、選択した方式の重み付けに基づく簡易的な内省モデルです。完全な紫微斗数や八字の命式ではなく、重要な決定の唯一の根拠にはしないでください。',

  activities: {
    wedding: '結婚',
    construction: '建築',
    opening: '開業',
    moving: '引っ越し',
    travel: '旅行',
  },

  genders: {
    male: '男性',
    female: '女性',
    unspecified: '未指定',
  },

  schools: {
    folkTitle: '民間総合法',
    folkDescription:
      '伝統的な吉日規則、干支の関係、出生時刻、一般的な文化習慣をバランスよく考慮します。',

    baziTitle: '八字参考',
    baziDescription:
      '出生年の干支、出生時の地支、合と冲の関係をより重視します。',

    ziweiTitle: '紫微斗数参考',
    ziweiDescription:
      '紫微斗数の時運思想に着想を得た内省的な重み付けと、出生情報と候補日の関係を用います。',

    almanacTitle: '伝統暦',
    almanacDescription:
      '暦の宜忌、吉日、伝統的な旧暦上の注意日を優先します。',
  },

  polarity: {
    yang: '陽',
    yin: '陰',
  },

  directions: {
    forward: '順行',
    backward: '逆行',
    neutral: '未確定',
  },

  schoolNotes: {
    folk:
      '民間習慣、暦の要素、干支の関係、出生時刻の参考をバランスよく組み合わせています。',

    bazi:
      '簡易的な八字参考として、干支と出生時刻の合・冲関係により大きな重みを置きます。',

    ziwei:
      '文化的な内省のため、紫微斗数の時運概念に着想を得た簡易的な重み付けを使用します。',

    almanac:
      '伝統暦の宜忌と旧暦上の日付規則を最も重視します。',
  },

  ratings: {
    excellent: '非常に良い',
    good: '良い',
    fair: 'まずまず',
    caution: '要検討',
  },

  lifeRatings: {
    veryStrong: '非常に強い',
    favorable: '良好',
    balanced: '均衡',
    developing: '発展中',
  },

  love: {
    title: '恋愛',

    styles: {
      warm: '温かく表現豊か',
      steady: '安定し誠実',
      independent: '自立的で率直',
      sensitive: '繊細で直感的',
    },

    summaries: {
      warm:
        '愛情を率直に表し、心の温かさ、親密さ、誠実な感謝を大切にする傾向があります。',

      steady:
        '少しずつ築く信頼、安定した約束、継続的な気遣いによって育つ関係を好む傾向があります。',

      independent:
        '誠実さ、個人の空間、双方が自分らしさを保てる関係を大切にする傾向があります。',

      sensitive:
        '感情の細かな変化に気づきやすく、共感、安心感、相互理解のある関係を求める傾向があります。',
    },
  },

  career: {
    title: '仕事',

    styles: {
      leadership: 'リーダーシップ志向',
      creative: '創造的で表現豊か',
      analytical: '分析的で体系的',
      supportive: '支援・奉仕志向',
      entrepreneurial: '起業家的で適応力が高い',
    },

    summaries: {
      leadership:
        '責任を担い、人を調整し、方向性を明確な行動へ変える場面で力を発揮しやすいでしょう。',

      creative:
        '想像力、コミュニケーション、デザイン、物語表現、独創的な問題解決を重視する仕事で力を発揮しやすいでしょう。',

      analytical:
        '計画、調査、システム思考、正確さ、慎重な判断が必要な仕事で最も実力を発揮しやすいでしょう。',

      supportive:
        '協働、助言、教育、ケア、サービス中心の役割で大きく貢献しやすいでしょう。',

      entrepreneurial:
        '主体性、試行、独立したプロジェクト、適応力が評価される機会に惹かれやすいでしょう。',
    },
  },

  reasons: {
    hoangDao: '暦上の吉日',

    hacDao: '暦上の凶日',

    traditionalSuitable:
      '伝統的にこの目的に適している',

    traditionalAvoid:
      '伝統的にこの目的を避けるよう勧められる',

    zodiacClash:
      '日の地支が出生年の干支と冲になる',

    sixHarmony: '六合の関係',

    threeHarmony: '三合の関係',

    nguyetKy: '伝統的な月忌日',

    tamNuong: '伝統的な三娘日',

    preferredLunarDay:
      '参考規則で優先される旧暦日',

    weekendConvenient: '週末で都合がよい',

    birthHourClash:
      '日の地支が出生時の地支と冲になる',

    birthHourHarmony:
      '日の地支が出生時と六合を形成する',

    birthHourThreeHarmony:
      '日の地支が出生時と三合を形成する',

    birthLunarDayResonance:
      '旧暦の日が旧暦の出生日と対応する',

    school_folk:
      '民間総合法で評価',

    school_bazi:
      '八字参考プリセットで評価',

    school_ziwei:
      '紫微斗数参考プリセットで評価',

    school_almanac:
      '伝統暦プリセットで評価',
  },

  insights: {
    loveHarmony:
      '出生年の干支と出生時の地支が六合の関係を形成します。',

    loveThreeHarmony:
      '出生年の干支と出生時の地支が同じ三合グループに属します。',

    loveInnerConflict:
      '出生年の干支と出生時の地支が冲となり、親密さと個人的な必要の間の内的な緊張を表す場合があります。',

    loveSelfAwareness:
      '旧暦の出生日は、内省と感情への自己認識の傾向を示します。',

    loveWarmHeart:
      '愛情を豊かに表し、温かい感情の雰囲気を作りやすいでしょう。',

    loveExpressive:
      '言葉、行動、明確な気遣いを通して思いやりを示す力があるでしょう。',

    loveOvergiving:
      '自分の必要が満たされているか確認する前に、与えすぎることがあります。',

    loveSetBoundaries:
      '思いやりが偏らないよう、明確で優しい境界線を持ちましょう。',

    loveReceiveCare:
      'いつも与える側になるのではなく、他者からの支えも受け取りましょう。',

    loveLoyal:
      '誠実さ、信頼性、長期的な約束を重視する傾向があります。',

    lovePatient:
      '関係が育つまで時間をかけることができるでしょう。',

    loveReserved:
      '感情を内側にため、説明が難しくなることがあります。',

    loveSpeakClearly:
      '相手に察してもらうのを待たず、必要を早めに明確に伝えましょう。',

    loveCreateRituals:
      '信頼とつながりを強める小さな共通習慣を作りましょう。',

    loveRespectsSpace:
      '個性を尊重し、個人の空間が必要であることを理解しやすいでしょう。',

    loveHonest:
      '関係では率直で誠実なコミュニケーションを好む傾向があります。',

    loveNeedsFreedom:
      '制限が多すぎると、引きこもったり感情的に距離を置いたりする場合があります。',

    loveBalanceFreedom:
      '自立と継続的な心のつながりのバランスを取りましょう。',

    loveSharePlans:
      '自由が距離感に見えないよう、計画と期待を共有しましょう。',

    loveEmpathetic:
      '微妙な感情の変化を理解し、共感をもって応じやすいでしょう。',

    loveIntuitive:
      '関係を理解するとき、直感に強く頼る傾向があります。',

    loveOverthinking:
      'コミュニケーションが不明確なとき、繊細さが考えすぎにつながる場合があります。',

    loveTrustSlowly:
      '推測ではなく、繰り返される行動によって信頼を育てましょう。',

    loveAskDirectly:
      '不確かなときは沈黙を解釈せず、直接たずねましょう。',

    careerPersistent:
      '粘り強さと前進し続ける意志によって成長しやすいでしょう。',

    careerReflective:
      '振り返り、内省、方法の調整を通して学ぶ力があります。',

    careerActionOriented:
      '陽の傾向は、主体性、目に見える行動、決断力のある推進を支える場合があります。',

    careerObservant:
      '陰の傾向は、観察、忍耐、タイミング、丁寧な準備を支える場合があります。',

    careerLeadership:
      '人を導き、明確な方向性を示すことに抵抗が少ないでしょう。',

    careerResponsibility:
      '結果に責任を持ち、約束を最後まで果たす傾向があります。',

    careerOvercontrol:
      '支配しすぎると協力が制限され、不要な圧力を生む場合があります。',

    careerDelegate:
      '明確に委任し、他者が自分の方法で貢献する余地を与えましょう。',

    careerListenBeforeDeciding:
      '重要な決定の前に、さまざまな意見を集めましょう。',

    careerCreative:
      '独創的なアイデアを生み、他者が見落とす可能性に気づきやすいでしょう。',

    careerExpression:
      'コミュニケーション、デザイン、物語表現、プレゼンテーションが自然な強みになるでしょう。',

    careerScattered:
      '同時に多くのアイデアを持つと、最も重要な仕事を終えにくくなる場合があります。',

    careerBuildPortfolio:
      '完成した仕事を見える形で積み上げ、創造性を機会につなげましょう。',

    careerFinishOneThing:
      '次のアイデアへ広げる前に、一つの優先事項を終えましょう。',

    careerAnalytical:
      '細部、パターン、因果関係を分析する力があるでしょう。',

    careerPlanning:
      '体系的な準備はリスクを減らし、安定性を高める助けになります。',

    careerPerfectionism:
      '完璧な情報を待つと、有益な行動が遅れる場合があります。',

    careerSetMilestones:
      '大きな目標を測定可能な段階と明確な期限に分けましょう。',

    careerDecideWithEnoughData:
      '情報が完全でなくても十分にそろった段階で行動しましょう。',

    careerTeamwork:
      '協力、信頼性、感情への気づきによってチームを強くできるでしょう。',

    careerService:
      '助ける、教える、支える、他者の生活を改善する仕事に意味を感じやすいでしょう。',

    careerPeoplePleasing:
      '全員を満足させようとすると、エネルギーが減り優先事項が曖昧になる場合があります。',

    careerProtectEnergy:
      '貢献を持続可能にするため、時間と感情労働の境界を設けましょう。',

    careerShowYourContribution:
      '他者が気づくと決めつけず、成果を明確に伝えましょう。',

    careerInitiative:
      '条件が完全に確定していなくても、始める意欲があるでしょう。',

    careerAdaptability:
      '状況、市場、計画が変化したとき、素早く適応できるでしょう。',

    careerRiskTaking:
      '機会への熱意から、十分な備えなしにリスクを取る場合があります。',

    careerValidateRisk:
      '大きな約束をする前に、小さな実験で仮説を確認しましょう。',

    careerKeepCashReserve:
      '独立した機会や不確実な挑戦を追うときは、資金の予備を保ちましょう。',
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

export default ja;
