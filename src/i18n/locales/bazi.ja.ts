const bazi = {
  title: '四柱推命命式',
  subtitle:
    '生年月日、出生時刻、出生地を入力して、四柱、五行、通変星、大運、参考解釈を算出します。',

  birthInformation: '出生情報',
  displayName: '表示名',
  displayNamePlaceholder: '任意',
  solarBirthDate: '西暦の生年月日',
  birthTime: '現地の出生時刻',
  gender: '性別',

  birthLocation: '出生地とタイムゾーン',
  timeZone: 'IANA タイムゾーン',
  placeName: '出生地',
  placeNamePlaceholder: '例：ホーチミン市',
  longitude: '経度',
  latitude: '緯度',

  trueSolarTime: '真太陽時補正',
  trueSolarTimeDescription:
    '正確な経度が必要です。出生地が不確かな場合はオフにしてください。',

  calculate: '四柱推命を算出',
  calculating: '命式を算出中...',

  chartResult: '命式結果',
  lunarDate: '旧暦日付',
  leapMonthShort: '閏月',
  dayMaster: '日主',
  strength: '日主の強弱',
  favorableElements: '有利な五行',
  correctedTime: '補正後の時刻',
  totalCorrection: '総補正量',

  fourPillars: '四柱',
  fiveElements: '五行の分布',
  usefulElements: '用神と五行バランス',
  interpretation: '解釈',
  luckPillars: '大運',

  noticeTitle: '注意',
  notice:
    '結果は文化的な参考および個人的な内省を目的としたもので、確実な予測、医療助言、財務助言ではありません。',

  units: {
    minutes: '分',
  },

  genders: {
    male: '男性',
    female: '女性',
    unspecified: '未指定',
  },

  pillars: {
    year: '年柱',
    month: '月柱',
    day: '日柱',
    hour: '時柱',
  },

  elements: {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水',
  },

  strengthLevels: {
    veryWeak: '非常に身弱',
    weak: '身弱',
    balanced: '均衡',
    strong: '身旺',
    veryStrong: '非常に身旺',
  },

  tenGods: {
    dayMaster: '日主',
    mixed: '混合',
    friend: '比肩',
    robWealth: '劫財',
    eatingGod: '食神',
    hurtingOfficer: '傷官',
    indirectWealth: '偏財',
    directWealth: '正財',
    sevenKillings: '偏官',
    directOfficer: '正官',
    indirectResource: '偏印',
    directResource: '印綬',
  },

  analysis: {
    favorable: '有利',
    supportive: '補助',
    unfavorable: '不利',
    climateBalancing: '調候バランス',
  },

  common: {
    strengths: '強み',
    pointsToConsider: '注意点',
    advice: '助言',
  },

  interpretationSections: {
    character: '性格',
    love: '恋愛',
    career: '仕事',
    wealth: '財運',
    wellbeing: '心身のバランス',
  },

  errors: {
    title: '入力情報が無効です',
    invalidDate: '生年月日が無効です。',
    invalidTime: '出生時刻は 00:00 から 23:59 の間で入力してください。',
    invalidTimeZone:
      'タイムゾーンが無効です。例：Asia/Ho_Chi_Minh。',
    longitudeRequired:
      '真太陽時を有効にする場合は経度が必要です。',
    invalidCoordinate: '経度または緯度が無効です。',
    calculateFailed:
      '命式を算出できません。入力情報を確認してください。',
  },

  stage2: {
    title: '詳細分析',
    subtitle:
      '日主の強弱、命式構造、用神、干支関係、主要な三つの人生領域を分析します。',

    strengthAndStructure: '日主の強弱と命式構造',
    strengthScore: '強弱スコア',
    primaryStructure: '主要格局',
    purity: '純度',
    stability: '安定度',
    supportDrainBalance: '扶抑バランス',
    monthCommand: '月令',
    roots: '通根',
    structureExposed: '格局が透出',
    structureHidden: '格局が不透',

    detailedUsefulElements: '用神の詳細分析',
    yongShen: '用神',
    xiShen: '喜神',
    jiShen: '忌神',
    chouShen: '仇神',
    seasonalClimate: '季節の調候',
    confidence: '信頼度',

    relationsTitle: '合・冲・刑・害',
    spousePalace: '配偶者宮',
    careerPillar: '仕事の柱',
    family: '家族',

    favorableFactors: '有利な要素',
    pointsToConsider: '注意点',
    suggestions: '成長の提案',

    domains: {
      love: '恋愛の詳細分析',
      career: '仕事の詳細分析',
      wealth: '財運の詳細分析',
    },

    levels: {
      low: '基礎づくりが必要',
      developing: '発展中',
      balanced: '均衡',
      favorable: '有利',
      strong: '強い',
    },

    tones: {
      supportive: '補助的',
      mixed: '混合',
      challenging: '課題あり',
    },

    relationTypes: {
      stemCombination: '天干合',
      stemClash: '天干冲',
      sixHarmony: '六合',
      sixClash: '六冲',
      harm: '害',
      break: '破',
      punishment: '刑',
      selfPunishment: '自刑',
      threeHarmony: '三合',
      threeMeeting: '三会',
    },

    strategies: {
      supportWeak: '身弱を扶助',
      drainStrong: '身旺を泄耗',
      balanceDistribution: '五行分布を調整',
      followStrongCandidate: '従旺格候補',
      followWeakCandidate: '従弱格候補',
    },

    climates: {
      cold: '寒',
      hot: '熱',
      dry: '燥',
      damp: '湿',
      balanced: '均衡',
    },

    patterns: {
      ordinary: '通常格局',
      followStrongCandidate: '従旺格候補',
      followWeakCandidate: '従弱格候補',
    },

    notice:
      'ステージ2では、透明性があり検証可能な構造モデルを使用します。用神、格局、解釈は伝統文化上の参考であり、確実な予測ではありません。',
  },

  stage3: {
    diagnosticsTitle: '技術的信頼度',
    diagnosticsSubtitle:
      '入力情報の品質と計算結果の安定性を評価します。',
    timeConfidence: '出生時刻とタイムゾーン',
    pillarConfidence: '四柱',
    luckConfidence: '大運',
    interpretationConfidence: '解釈',

    saveChart: '命式を保存',
    updateSaved: '保存済み命式を更新',
    saving: '保存中...',
    savedTitle: '命式を保存しました',
    savedMessage: '命式をこの端末に保存しました。',
    saveErrorTitle: '保存できません',
    saveErrorMessage: '命式の保存中にエラーが発生しました。',

    historyTitle: '保存済み命式',
    historySubtitle:
      '現在のエンジンバージョンで命式を確認、共有、再計算できます。',
    searchPlaceholder: '名前または出生地で検索...',
    emptyHistoryTitle: '保存済み命式はありません',
    emptyHistoryMessage:
      '命式を作成して「保存」を押すと、ここに表示されます。',
    open: '開く',
    share: '共有',
    recalculate: '再計算',
    duplicate: '複製',
    engineVersion: 'エンジン',
    deleteTitle: '命式を削除',
    deleteMessage: 'この命式を削除しますか？',
    recalculatedTitle: '命式を更新しました',
    recalculatedMessage:
      '現在のエンジンバージョンで命式を再計算しました。',
    recalculateErrorTitle: '更新できません',
    recalculateErrorMessage: '保存されている出生情報を確認してください。',

    diagnosticCodes: {
      DIAGNOSTIC_AMBIGUOUS_LOCAL_TIME:
        '夏時間終了時の重複時間に該当するため、より早い UTC 時刻を選択しました。',
      DIAGNOSTIC_NONEXISTENT_LOCAL_TIME:
        '夏時間開始時の存在しない時刻に該当するため、自動的に補正しました。',
      DIAGNOSTIC_TRUE_SOLAR_LONGITUDE_MISSING:
        '真太陽時補正には経度が必要です。',
      DIAGNOSTIC_TRUE_SOLAR_CROSSED_DATE:
        '真太陽時補正により現地の日付境界をまたぎました。',
      DIAGNOSTIC_LARGE_SOLAR_TIME_CORRECTION:
        '太陽時の補正量が大きいため、経度とタイムゾーンを確認してください。',
      DIAGNOSTIC_BIRTH_NEAR_SOLAR_TERM:
        '出生時刻が節気境界に近いため、年柱または月柱を再確認してください。',
      DIAGNOSTIC_BIRTH_NEAR_DAY_BOUNDARY:
        '出生時刻が設定された日付境界に近いです。',
      DIAGNOSTIC_PROVIDER_DAY_BOUNDARY_LIMITATION:
        '暦プロバイダーが選択された日付境界ルールを完全には確認できませんでした。',
      DIAGNOSTIC_LUCK_DIRECTION_UNDETERMINED:
        '性別が未指定のため、大運の順行・逆行を決定できません。',
      DIAGNOSTIC_LUCK_START_PROVIDER_FALLBACK:
        '隣接する節気を取得できなかったため、大運開始年齢に代替計算を使用しました。',
      DIAGNOSTIC_USEFUL_ELEMENT_LOW_CONFIDENCE:
        '現在の用神分析の信頼度は低めです。',
      DIAGNOSTIC_INTERPRETATION_SCORE_SPREAD_HIGH:
        '各解釈領域のスコア差が大きくなっています。',
      DIAGNOSTIC_TRADITIONAL_REFERENCE_ONLY:
        '解釈は文化的参考および個人的内省のためのものです。',
    },
  },

  stage4: {
    title: '運勢推移と相性',
    subtitle:
      '流年・流月を確認し、二つの命式を比較し、四柱構造から日取りを選びます。',
    calculating: '計算中...',
    emptyTitle: '保存済み命式がありません',
    emptyMessage:
      'ステージ4を利用する前に、少なくとも一つの命式を作成して保存してください。',
    primaryChart: '主命式',
    secondaryChart: '第二の命式',
    optionalPartnerChart: '相手の命式（任意）',
    noPartner: '第二の命式を使用しない',

    tabs: {
      timeline: '運勢推移',
      compatibility: '相性',
      dates: '日取り選択',
    },

    domains: {
      overall: '総合',
      love: '恋愛',
      career: '仕事',
      wealth: '財運',
      wellbeing: '心身バランス',
    },

    levels: {
      low: '低い',
      developing: '発展中',
      balanced: '均衡',
      favorable: '有利',
      strong: '強い',
      challenging: '課題が多い',
      cautious: '注意が必要',
      mixed: '混合',
    },

    timeline: {
      title: '流年と流月',
      subtitle:
        '現在の大運、喜用五行、命式との関係から各年を評価します。',
      yearCount: '{{count}}年',
      calculate: '運勢推移を算出',
      peakYears: '注目年',
      cautionYears: '注意年',
      activeLuck: '現在の大運',
      monthLabel: '{{count}}月',
    },

    compatibility: {
      title: '二つの命式を比較',
      subtitle:
        '感情、意思疎通、安定性、協力、金銭面を比較します。',
      calculate: '相性を分析',
      overall: '総合相性',
      purposes: {
        general: '総合',
        love: '恋愛',
        business: '仕事・協業',
      },
      domains: {
        emotional: '感情',
        communication: '意思疎通',
        stability: '安定性',
        cooperation: '協力',
        finance: '金銭面',
      },
      complementingElements: '補完し合う五行',
      conflictingElements: '調整が必要な五行',
    },

    dates: {
      title: '四柱推命による日取り選択',
      subtitle:
        '主命式に構造的に合う日を探し、必要に応じて相手の命式も反映します。',
      calculate: '候補日を検索',
      monthCount: '今後{{count}}か月',
      activities: {
        wedding: '結婚',
        construction: '着工 / 建築',
        opening: '開業',
        moving: '引っ越し',
        travel: '旅行 / 出行',
        signing: '契約締結',
      },
    },

    errors: {
      noPrimaryTitle: '命式が選択されていません',
      noPrimaryMessage: '主命式を選択してください。',
      needTwoChartsTitle: '二つの命式が必要です',
      needTwoChartsMessage: '異なる二つの命式を選択してください。',
      sameChartTitle: '同じ命式です',
      sameChartMessage: '一つ目と二つ目の命式は別のものを選んでください。',
      calculateTitle: '計算できません',
      calculateMessage: 'ステージ4の分析中にエラーが発生しました。',
    },

    notice:
      'ステージ4は透明性があり検証可能な構造モデルです。流年、相性、日取りの結果は文化的参考であり、現実の判断や専門家による選日を代替するものではありません。',
  },
};

export default bazi;
