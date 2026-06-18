const bazi = {
  title: '八字命盘',
  subtitle:
    '输入出生日期、时间和地点，以计算四柱、五行、十神、大运及参考解读。',

  birthInformation: '出生信息',
  displayName: '显示名称',
  displayNamePlaceholder: '可选',
  solarBirthDate: '公历出生日期',
  birthTime: '当地出生时间',
  gender: '性别',

  birthLocation: '出生地点与时区',
  timeZone: 'IANA 时区',
  placeName: '出生地点',
  placeNamePlaceholder: '例如：胡志明市',
  longitude: '经度',
  latitude: '纬度',

  trueSolarTime: '真太阳时校正',
  trueSolarTimeDescription:
    '需要准确的经度。若出生地点不确定，请保持关闭。',

  calculate: '排出八字命盘',
  calculating: '正在排盘...',

  chartResult: '命盘结果',
  lunarDate: '农历日期',
  leapMonthShort: '闰',
  dayMaster: '日主',
  strength: '日主旺衰',
  favorableElements: '有利五行',
  correctedTime: '校正后时间',
  totalCorrection: '总校正量',

  fourPillars: '四柱',
  fiveElements: '五行分布',
  usefulElements: '用神与五行平衡',
  interpretation: '命理解读',
  luckPillars: '大运',

  noticeTitle: '提示',
  notice:
    '结果仅供文化参考与个人反思，不代表确定预测，也不能替代医疗或财务建议。',

  units: {
    minutes: '分钟',
  },

  genders: {
    male: '男',
    female: '女',
    unspecified: '未指定',
  },

  pillars: {
    year: '年柱',
    month: '月柱',
    day: '日柱',
    hour: '时柱',
  },

  elements: {
    wood: '木',
    fire: '火',
    earth: '土',
    metal: '金',
    water: '水',
  },

  strengthLevels: {
    veryWeak: '极弱',
    weak: '偏弱',
    balanced: '平衡',
    strong: '偏旺',
    veryStrong: '极旺',
  },

  tenGods: {
    dayMaster: '日主',
    mixed: '混合',
    friend: '比肩',
    robWealth: '劫财',
    eatingGod: '食神',
    hurtingOfficer: '伤官',
    indirectWealth: '偏财',
    directWealth: '正财',
    sevenKillings: '七杀',
    directOfficer: '正官',
    indirectResource: '偏印',
    directResource: '正印',
  },

  analysis: {
    favorable: '有利',
    supportive: '辅助',
    unfavorable: '不利',
    climateBalancing: '调候平衡',
  },

  common: {
    strengths: '优势',
    pointsToConsider: '需要注意',
    advice: '建议',
  },

  interpretationSections: {
    character: '性格',
    love: '感情',
    career: '事业',
    wealth: '财富',
    wellbeing: '身心平衡',
  },

  errors: {
    title: '信息无效',
    invalidDate: '出生日期无效。',
    invalidTime: '出生时间必须在 00:00 至 23:59 之间。',
    invalidTimeZone:
      '时区无效。例如：Asia/Ho_Chi_Minh。',
    longitudeRequired:
      '启用真太阳时后必须填写经度。',
    invalidCoordinate: '经度或纬度无效。',
    calculateFailed:
      '无法排出命盘，请检查输入信息。',
  },

  stage2: {
    title: '详细分析',
    subtitle:
      '分析日主旺衰、命局结构、用神、干支关系及三大人生领域。',

    strengthAndStructure: '日主旺衰与命局结构',
    strengthScore: '旺衰评分',
    primaryStructure: '主要格局',
    purity: '纯度',
    stability: '稳定度',
    supportDrainBalance: '扶抑平衡',
    monthCommand: '月令',
    roots: '根气',
    structureExposed: '格局透出',
    structureHidden: '格局未透',

    detailedUsefulElements: '用神详细分析',
    yongShen: '用神',
    xiShen: '喜神',
    jiShen: '忌神',
    chouShen: '仇神',
    seasonalClimate: '季节调候',
    confidence: '可信度',

    relationsTitle: '合冲刑害',
    spousePalace: '夫妻宫',
    careerPillar: '事业柱',
    family: '家庭',

    favorableFactors: '有利因素',
    pointsToConsider: '需要注意',
    suggestions: '成长建议',

    domains: {
      love: '感情详细分析',
      career: '事业详细分析',
      wealth: '财富详细分析',
    },

    levels: {
      low: '基础较弱',
      developing: '发展中',
      balanced: '平衡',
      favorable: '较有利',
      strong: '强',
    },

    tones: {
      supportive: '有助',
      mixed: '吉凶参半',
      challenging: '有挑战',
    },

    relationTypes: {
      stemCombination: '天干合',
      stemClash: '天干冲',
      sixHarmony: '六合',
      sixClash: '六冲',
      harm: '六害',
      break: '相破',
      punishment: '相刑',
      selfPunishment: '自刑',
      threeHarmony: '三合',
      threeMeeting: '三会',
    },

    strategies: {
      supportWeak: '扶助身弱',
      drainStrong: '泄耗身旺',
      balanceDistribution: '平衡五行分布',
      followStrongCandidate: '从旺候选',
      followWeakCandidate: '从弱候选',
    },

    climates: {
      cold: '寒',
      hot: '热',
      dry: '燥',
      damp: '湿',
      balanced: '平衡',
    },

    patterns: {
      ordinary: '普通格局',
      followStrongCandidate: '从旺格候选',
      followWeakCandidate: '从弱格候选',
    },

    notice:
      '第二阶段采用透明、可测试的结构模型。用神、格局及相关解读仍属于传统文化参考，并非确定预测。',
  },

  stage3: {
    diagnosticsTitle: '技术可信度',
    diagnosticsSubtitle:
      '评估输入信息质量与计算结果的稳定性。',
    timeConfidence: '出生时间与时区',
    pillarConfidence: '四柱',
    luckConfidence: '大运',
    interpretationConfidence: '解读',

    saveChart: '保存命盘',
    updateSaved: '更新已保存命盘',
    saving: '正在保存...',
    savedTitle: '命盘已保存',
    savedMessage: '命盘已保存在此设备上。',
    saveErrorTitle: '无法保存',
    saveErrorMessage: '保存命盘时发生错误。',

    historyTitle: '已保存命盘',
    historySubtitle:
      '使用当前引擎版本查看、分享或重新计算命盘。',
    searchPlaceholder: '按姓名或出生地搜索...',
    emptyHistoryTitle: '暂无已保存命盘',
    emptyHistoryMessage:
      '创建命盘后点击“保存”，即可在此查看。',
    open: '打开',
    share: '分享',
    recalculate: '重新计算',
    duplicate: '复制',
    engineVersion: '引擎',
    deleteTitle: '删除命盘',
    deleteMessage: '确定要删除此命盘吗？',
    recalculatedTitle: '命盘已更新',
    recalculatedMessage:
      '命盘已使用当前引擎版本重新计算。',
    recalculateErrorTitle: '无法更新',
    recalculateErrorMessage: '请检查已保存的出生信息。',

    diagnosticCodes: {
      DIAGNOSTIC_AMBIGUOUS_LOCAL_TIME:
        '该出生时间在夏令时回拨期间出现两次，系统已选择较早的 UTC 时刻。',
      DIAGNOSTIC_NONEXISTENT_LOCAL_TIME:
        '该出生时间位于夏令时跳变的不存在时段，系统已自动标准化。',
      DIAGNOSTIC_TRUE_SOLAR_LONGITUDE_MISSING:
        '真太阳时校正需要填写经度。',
      DIAGNOSTIC_TRUE_SOLAR_CROSSED_DATE:
        '真太阳时校正跨越了当地日期边界。',
      DIAGNOSTIC_LARGE_SOLAR_TIME_CORRECTION:
        '太阳时校正幅度较大，请核对经度和时区。',
      DIAGNOSTIC_BIRTH_NEAR_SOLAR_TERM:
        '出生时间接近节气交界，年柱或月柱应进一步复核。',
      DIAGNOSTIC_BIRTH_NEAR_DAY_BOUNDARY:
        '出生时间接近所设定的换日边界。',
      DIAGNOSTIC_PROVIDER_DAY_BOUNDARY_LIMITATION:
        '历法提供器无法完全确认所选择的换日规则。',
      DIAGNOSTIC_LUCK_DIRECTION_UNDETERMINED:
        '由于未指定性别，大运顺逆方向无法确定。',
      DIAGNOSTIC_LUCK_START_PROVIDER_FALLBACK:
        '由于无法取得相邻节气，大运起运年龄采用了备用算法。',
      DIAGNOSTIC_USEFUL_ELEMENT_LOW_CONFIDENCE:
        '当前用神分析可信度较低。',
      DIAGNOSTIC_INTERPRETATION_SCORE_SPREAD_HIGH:
        '各解读领域的评分差距较大。',
      DIAGNOSTIC_TRADITIONAL_REFERENCE_ONLY:
        '相关解读仅供文化参考与个人反思。',
    },
  },

  stage4: {
    title: '运势与合盘',
    subtitle:
      '查看流年、流月，比较两张命盘，并依据八字结构选择日期。',
    calculating: '正在计算...',
    emptyTitle: '暂无已保存命盘',
    emptyMessage:
      '请先创建并保存至少一张命盘，再使用第四阶段工具。',
    primaryChart: '主命盘',
    secondaryChart: '第二张命盘',
    optionalPartnerChart: '同行者命盘（可选）',
    noPartner: '不使用第二张命盘',

    tabs: {
      timeline: '运势时间线',
      compatibility: '合盘',
      dates: '择日',
    },

    domains: {
      overall: '整体',
      love: '感情',
      career: '事业',
      wealth: '财富',
      wellbeing: '身心平衡',
    },

    levels: {
      low: '较低',
      developing: '发展中',
      balanced: '平衡',
      favorable: '有利',
      strong: '强',
      challenging: '挑战较多',
      cautious: '需谨慎',
      mixed: '吉凶参半',
    },

    timeline: {
      title: '流年与流月',
      subtitle:
        '结合当前大运、喜用五行及与原局的关系，对各年份进行排序。',
      yearCount: '{{count}} 年',
      calculate: '生成运势时间线',
      peakYears: '较突出年份',
      cautionYears: '需留意年份',
      activeLuck: '当前大运',
      monthLabel: '{{count}} 月',
    },

    compatibility: {
      title: '两张命盘合盘',
      subtitle:
        '比较情感、沟通、稳定性、合作与财务节奏。',
      calculate: '分析合盘',
      overall: '整体合盘分数',
      purposes: {
        general: '综合',
        love: '感情',
        business: '合作',
      },
      domains: {
        emotional: '情感',
        communication: '沟通',
        stability: '稳定性',
        cooperation: '合作',
        finance: '财务',
      },
      complementingElements: '互补五行',
      conflictingElements: '需要调和的五行',
    },

    dates: {
      title: '八字择日',
      subtitle:
        '为主命盘寻找结构上较合适的日期，也可加入同行者命盘。',
      calculate: '查找建议日期',
      monthCount: '未来 {{count}} 个月',
      activities: {
        wedding: '婚嫁',
        construction: '动土 / 建房',
        opening: '开业',
        moving: '搬迁入宅',
        travel: '出行',
        signing: '签约',
      },
    },

    errors: {
      noPrimaryTitle: '尚未选择命盘',
      noPrimaryMessage: '请选择一张主命盘。',
      needTwoChartsTitle: '需要两张命盘',
      needTwoChartsMessage: '请选择两张不同的命盘进行比较。',
      sameChartTitle: '命盘重复',
      sameChartMessage: '第一张和第二张命盘必须不同。',
      calculateTitle: '无法计算',
      calculateMessage: '执行第四阶段分析时发生错误。',
    },

    notice:
      '第四阶段采用透明、可测试的结构模型。流年、合盘与择日结果仅供文化参考，不能替代现实判断或专业通书择日。',
  },
};

export default bazi;
