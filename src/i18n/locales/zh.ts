import bazi from './bazi.zh';
import ziwei from './ziwei.zh';
import practice, {
  practiceAudio,
  practiceMeditation,
} from './practice.zh';
import {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
} from './spiritualFeatures.zh';
import {
  dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
} from './spiritualFeatures10_13.zh';
import chantCounter
  from './chantCounter.zh';
  import practiceJourney
  from './practiceJourney.zh';
  import astrologyHome
  from './astrologyHome.zh';
  import userProfiles
  from './userProfiles.zh';
  import today
  from './today.zh';
  import insightFeatures
  from './insightFeatures.zh';
  import expertMode
  from './expertMode.zh';
  import timelineEvents
  from './timelineEvents.zh';
  import engagementFeatures
  from './engagementFeatures.zh';
  import glossary
  from './glossary.zh';
  import adsFeatures
  from './adsFeatures.zh';
const zh = {
  common: {
    cancel: '取消',
    delete: '删除',
    reset: '重置',
    loading: '加载中...',
  },

  tabs: {
    home: '首页',
    temple: '佛殿',
    meditation: '冥想',
    prayer: '祈愿',
  },

  home: {
    title: 'iPagoda',

    subtitle: '一个可以冥想、祈愿并倾听内心的宁静空间。',

    activities: '活动',

    templeTitle: '大雄宝殿',
    templeSubtitle: '上香并敲木鱼',

    meditationTitle: '冥想',
    meditationSubtitle: '冥想 5 到 15 分钟',

    prayerTitle: '祈愿',
    prayerSubtitle: '私密保存你的祈愿',

    audioTitle: '声音',
    audioSubtitle: '聆听木鱼与寺院钟声',

    settingsTitle: '设置',
    settingsSubtitle: '语言与应用信息',

    dailyTitle: '今日提醒',

    dailyText:
      '花几分钟缓慢呼吸，放下忧虑，并想一件让你感恩的事。',
    lunarCalendarTitle: '农历',
    lunarCalendarSubtitle: '查看农历初一和十五',
    spiritualAudioTitle: '佛经与冥想',

    spiritualAudioSubtitle:
      '聆听佛经、冥想音乐与自然声音',
    welcome: '日日安宁',

    peacefulSpace: '宁静空间',

    heroTitle: '回归内心安宁',

    enterTemple: '进入大雄宝殿',

    discover: '探索',

    footerQuote: '心若安定，处处皆是净土。',
    fortuneStickTitle: '求签',

    fortuneStickSubtitle: '抽取一支签，静心观照',
    horoscopeTitle: '命理与择吉',

    horoscopeSubtitle: '查看农历生日、生肖与推荐吉日',
     baziTitle: '八字命盘',

  baziSubtitle:
    '四柱、五行、大运与命理解读',
    baziHistoryTitle:
  '已保存的八字命盘',

baziHistorySubtitle:
  '查看并管理已保存的八字命盘',
  baziStage4Title:
  '运势与合盘',

baziStage4Subtitle:
  '流年、流月、命盘比较与择日',
  organizedActivitiesTitle: '你的修习空间',
practiceSectionEyebrow: '日常修习',
practiceSectionTitle: '修习',
practiceSectionSubtitle:
  '帮助内心安定并维持每日习惯的活动',
calendarSectionEyebrow: '时间与仪式',
calendarSectionTitle: '日历与仪式',
calendarSectionSubtitle:
  '查看农历日期、佛教纪念日和重要修习日',
reflectionSectionEyebrow: '文化省思',
reflectionSectionTitle: '省思',
reflectionSectionSubtitle:
  '用于文化参考与自我观照的传统内容',
peaceJournalShortTitle: '日记',
peaceJournalShortSubtitle:
  '记录情绪、感恩和准备放下的事情',
newMoonFullMoonTitle: '初一与十五',
newMoonFullMoonSubtitle:
  '查看朔望日并准备相关仪式',
buddhistFestivalTitle: '佛教节日',
buddhistFestivalSubtitle:
  '查看卫塞节、盂兰盆节和常见纪念日',
practiceReminderTitle: '修习提醒',
practiceReminderSubtitle:
  '设置冥想、诵经和每日仪式提醒',
chooseDateTitle: '择日',
chooseDateSubtitle:
  '参考婚礼、开业和重要事项的适合日期',
      ziweiTitle: '紫微斗数',
  ziweiSubtitle: 'E输入出生日期、时间和地点，以安十二宫、十四主星、二十一辅星、四化、旬空截空及长生十二神。',
  },

  temple: {
    title: '大雄宝殿',

    description: '保持心境平和，慢慢完成每项活动。',

    motto: '一呼一吸皆安然',

    noIncense: '尚未点香',

    lightIncense: '上香',

    incenseCount: '已点：{{count}} 支香',

    woodenFish: '木鱼',

    woodenFishCount: '{{count}}/108',

    bell: '寺院钟',

    bellCount: '{{count}} 次',

    completedTitle: '你已完成 108 次敲击',

    completedText: '静坐一分钟，觉察自己的呼吸。',

    resetCounter: '重置木鱼计数',

    resetDialogTitle: '重置计数',

    resetDialogMessage: '要将木鱼计数重置为 0 吗？',
    longPressHint: '轻点播放一次 • 长按连续播放',

    playingContinuously: '正在连续播放',

    tapToStop: '轻点停止',
    lightIncenseShort: '上香',
    incenseShortCount: '{{count}} 支',
    incenseStatsTitle: '香支数',
  },

meditation: {
  title: '冥想',
  screenTitle: '冥想',

  subtitle:
    '舒适地坐下，放松肩膀，轻轻专注于每一次呼吸。',

  breathingTitle: '呼吸冥想',

  chooseDuration: '选择时长',

  minutes: '{{count}} 分钟',
  minuteUnit: '分钟',
  heroMinutes: '{{count}} 分钟',

  start: '开始冥想',
  pause: '暂停冥想',
  restart: '重新冥想',

  ready: '准备就绪',
  paused: '已暂停',
  running: '正在冥想',

  resetTime: '重置时间',

  completedTitle: '冥想完成',

  completedMessage:
    '请缓慢呼吸，并感受此刻自己的身心状态。',

  breathTitle: '呼吸指导',

  inhale: '缓慢吸气 4 秒',

  hold: '屏息 2 秒',

  exhale: '缓慢呼气 6 秒',
},

  prayer: {
    title: '祈愿日记',

    subtitle:
      '你的内容仅保存在本设备上，不会自动上传。',

    placeholder: '写下你的祈愿或感恩之事...',

    save: '保存祈愿',

    savedItems: '已保存内容',

    empty: '你尚未保存任何祈愿。',

    requiredTitle: '没有内容',

    requiredMessage: '请先输入你的祈愿。',

    savedTitle: '已保存',

    savedMessage: '你的祈愿已私密保存在本设备上。',

    saveErrorTitle: '无法保存',

    saveErrorMessage: '保存祈愿时发生错误。',

    deleteDialogTitle: '删除祈愿',

    deleteDialogMessage: '确定要删除这条内容吗？',
    writeTitle: '写下祈愿',

    writeHint: '你的内容将私密保存在设备上。',

    privateLabel: '私密',

    savedCount: '已保存 {{count}} 条',

    emptyTitle: '暂无已保存的祈愿',

    savedPrivately: '已私密保存',
  },

  audio: {
    title: '寺院声音',

    subtitle: '聆听大雄宝殿中使用的声音。',

    woodenFishTitle: '木鱼声',

    playWoodenFish: '播放木鱼声',

    bellTitle: '寺院钟声',

    playBell: '播放寺院钟声',

    tapOrHoldHint: '轻点播放一次 • 长按连续播放',

    playingContinuously: '正在连续播放',

    tapToStop: '轻点停止',
  },
  settings: {
    title: '设置',

    notifications: '通知',

    notificationsDescription:
      '冥想与农历斋日提醒将在后续加入。',

    language: '语言',

    languageDescription: '选择应用使用的语言。',

    chooseLanguage: '选择语言',

    privacy: '隐私',

    privacyDescription:
      '你的祈愿日记目前仅保存在本设备上。',

    information: '信息',

    version: '在线寺院版本 0.0.1',
  },
  lunarCalendar: {
    title: '农历',

    subtitle: '查看农历日期、初一与十五。',

    today: '今天',

    firstDay: '农历初一',

    fullMoon: '农历十五',

    solarDate: '公历日期',

    lunarDate: '农历日期',

    lunarMonth: '农历 {{month}} 月',

    leapMonth: '闰月',

    firstDayTitle: '今天是农历初一',

    fullMoonTitle: '今天是农历十五',

    observanceMessage:
      '留一点时间冥想、反思或聆听佛经。',
  },
  lunarNotifications: {
    channelName: '农历提醒',

    channelDescription: '农历初一和十五提醒。',

    settingTitle: '初一与十五提醒',

    settingDescription:
      '在农历初一和十五接收通知。',

    reminderTime: '提醒时间',

    settingNote:
      '应用会安排未来 12 个月的提醒，并在打开时自动更新。',

    firstDayTitle: '今天是农历初一',

    fullMoonTitle: '今天是农历十五',

    reminderBody:
      '花几分钟安静地冥想、祈愿或聆听佛经。',

    permissionTitle: '通知已关闭',

    permissionMessage:
      '请在设备设置中允许通知，以接收农历提醒。',

    enabledTitle: '农历提醒已开启',

    enabledMessage: '已在 {{time}} 安排 {{count}} 条提醒。',

    errorTitle: '无法安排提醒',

    errorMessage:
      '安排农历提醒时发生错误。',
  },
  spiritualAudio: {
    title: '佛经与冥想',

    subtitle:
      '聆听宁静音频，用于放松、冥想与正念练习。',

    searchPlaceholder: '搜索音频...',

    playing: '播放中',

    paused: '已暂停',

    empty: '未找到匹配的音频。',

    categories: {
      sutra: '佛经',
      meditation: '冥想',
      nature: '自然',
    },

    tracks: {
      greatCompassion: {
        title: '大悲咒',

        description: '有助于放松与正念的宁静持诵。',
      },

      heartSutra: {
        title: '心经',

        description: '平静庄严的《心经》诵读。',
      },

      buddhaName: {
        title: '念佛',

        description: '温和的念佛声，让内心安宁。',
      },

      breathing: {
        title: '呼吸冥想',

        description: '专注呼吸，逐渐放松身体。',
      },

      deepRelaxation: {
        title: '深度放松',

        description: '适合休息与安稳睡眠的柔和冥想音频。',
      },

      singingBowl: {
        title: '颂钵冥想',

        description: '颂钵声有助于专注与内心平静。',
      },

      templeRain: {
        title: '寺院雨声',

        description: '宁静寺院氛围中的轻柔雨声。',
      },

      forestBirds: {
        title: '森林鸟鸣',

        description: '鸟鸣与树叶沙沙声交织的自然森林氛围。',
      },

      flowingStream: {
        title: '潺潺溪流',

        description: '柔和溪流声，适合放松与睡眠。',
      },
    },
  },
  dailyPracticeNotifications: {
    channelName: '每日修习提醒',

    channelDescription: '每日提醒冥想与诵经。',

    settingTitle: '冥想或诵经提醒',

    settingDescription: '每天在你选择的时间接收通知。',

    practiceType: '提醒类型',

    typeMeditation: '冥想',

    typeSutra: '佛经',

    typeBoth: '两者',

    reminderTime: '提醒时间',

    previewLabel: '通知预览',

    settingNote: '通知会在所选时间每天重复。',

    meditationTitle: '该冥想了',

    meditationBody: '缓慢呼吸几次，给自己片刻宁静。',

    sutraTitle: '该诵经或听经了',

    sutraBody:
      '花几分钟安静诵读、聆听，让心沉静下来。',

    bothTitle: '该进行每日修习了',

    bothBody:
      '选择一段简短冥想或聆听佛经，享受片刻安宁。',

    permissionTitle: '通知已关闭',

    permissionMessage: '请在设备设置中允许通知。',

    enabledTitle: '每日提醒已开启',

    enabledMessage: '应用会在每天 {{time}} 提醒你。',

    errorTitle: '无法安排提醒',

    errorMessage: '安排每日提醒时发生错误。',
  },
  fortuneStick: {
    title: '求签',

    subtitle:
      '静下心来，想着你所关心的事，抽取一支签作为观照。',

    intentionLabel: '你在祈愿什么？',

    intentionPlaceholder: '可选：写下你此刻所想...',

    drawing: '正在求签...',

    drawHint: '缓慢呼吸，安定心神，然后点击下方按钮。',

    drawingButton: '求签中',

    drawButton: '求一支签',

    stickNumber: '签号',

    interpretationTitle: '解读',

    adviceTitle: '建议',

    drawAgain: '再求一签',

    save: '保存',

    saving: '保存中...',

    savedTitle: '签文已保存',

    savedMessage: '签文已保存到设备。',

    saveErrorTitle: '无法保存',

    saveErrorMessage: '保存签文时发生错误。',

    historyTitle: '已保存的签文',

    historyCount: '已保存 {{count}} 条',

    emptyHistory: '你尚未保存任何签文。',

    deleteTitle: '删除已保存的签文',

    deleteMessage: '确定要删除这条签文吗？',

    disclaimer:
      '求签内容仅供个人观照，不应替代专业建议或现实决策。',

    levels: {
      great: '上吉',
      good: '吉',
      neutral: '平',
      caution: '谨慎',
    },
  },
  horoscope: {
  title: '命理参考与吉日',

  subtitle:
    '输入阳历出生日期，查看农历日期、生肖及重要事项的建议日期。',

  subtitleExtended:
    '输入阳历出生日期和时间、性别及解读流派，以查看农历信息、人生反思解读和建议日期。',

  birthDateTitle: '阳历出生日期',

  day: '日',

  month: '月',

  year: '年',

  birthTimeTitle: '出生时间',

  hour: '时',

  minute: '分',

  birthTimeHint: '出生地当地时间',

  genderTitle: '性别',

  schoolTitle: '解读流派',

  selectedMethod: '当前方法',

  activityTitle: '事项',

  searchPeriod: '查询范围',

  monthCount: '{{count}}个月',

  calculate: '转换并查找建议日期',

  calculateExtended: '建立资料并查找建议日期',

  calculating: '正在计算……',

  invalidDateTitle: '出生日期无效',

  invalidInputTitle: '信息无效',

  invalidDateMessage:
    '请输入有效的阳历出生日期。',

  invalidTimeMessage:
    '出生时间必须在00:00至23:59之间。',

  profileTitle: '出生信息',

  lunarBirthDate: '农历出生日期',

  birthHourBranch: '出生时支',

  zodiac: '生肖',

  canChiYear: '干支年',

  profileGender: '性别',

  profileSchool: '解读流派',

  yearPolarity: '出生年阴阳',

  cycleDirection: '参考运转方向',

  leapMonth: '闰月',

  resultsTitle: '建议日期',

  resultsSubtitle:
    '日期按文化参考评分排序。',

  resultsSubtitleExtended:
    '日期依据所选流派、出生生肖和出生时支进行排序。',

  lunarDateLine: '农历{{year}}年{{month}}月{{day}}日',

  suitableReasons: '有利因素',

  cautionReasons: '需注意因素',

  lifeOverviewTitle: '感情与事业',

  lifeOverviewSubtitle:
    '根据输入的出生日期、出生时间和所选解读流派提供反思性解读。',

  lifeStrengths: '优势',

  lifeCautions: '需要平衡之处',

  lifeAdvice: '成长建议',

  disclaimer:
    '结果仅供文化参考与自我反思，不应作为婚姻、建造、投资或其他重要决定的唯一依据。',

  disclaimerExtended:
    '这是一个依据农历、出生生肖、出生时辰及所选流派权重建立的简化反思模型，并非完整的紫微斗数或八字命盘，也不应作为重要决定的唯一依据。',

  activities: {
    wedding: '婚嫁',
    construction: '动土建造',
    opening: '开业',
    moving: '搬家',
    travel: '出行',
  },

  genders: {
    male: '男',
    female: '女',
    unspecified: '未指定',
  },

  schools: {
    folkTitle: '民俗综合法',
    folkDescription:
      '综合传统择日规则、生肖关系、出生时辰和常见民俗。',

    baziTitle: '八字参考',
    baziDescription:
      '更重视出生生肖、出生时支以及合、冲关系。',

    ziweiTitle: '紫微参考',
    ziweiDescription:
      '采用受紫微时运观念启发的反思权重，并参考出生信息与所选日期之间的关系。',

    almanacTitle: '传统黄历',
    almanacDescription:
      '优先考虑黄历宜忌、吉日及传统农历禁忌。',
  },

  polarity: {
    yang: '阳',
    yin: '阴',
  },

  directions: {
    forward: '顺行',
    backward: '逆行',
    neutral: '未确定',
  },

  schoolNotes: {
    folk:
      '结果平衡结合民俗、黄历因素、生肖关系和出生时辰参考。',

    bazi:
      '结果提高生肖与出生时辰合冲关系的权重，作为简化的八字参考。',

    ziwei:
      '结果采用受紫微时运观念启发的简化权重，仅供文化反思。',

    almanac:
      '结果最重视传统黄历中的宜忌及农历日期规则。',
  },

  ratings: {
    excellent: '极佳',
    good: '良好',
    fair: '尚可',
    caution: '慎重考虑',
  },

  lifeRatings: {
    veryStrong: '很强',
    favorable: '有利',
    balanced: '平衡',
    developing: '发展中',
  },

  love: {
    title: '感情',

    styles: {
      warm: '温暖而善于表达',
      steady: '稳定而忠诚',
      independent: '独立而直接',
      sensitive: '敏感而富有直觉',
    },

    summaries: {
      warm:
        '你可能会坦率表达感情，并重视情感温度、亲近感和真诚的欣赏。',

      steady:
        '你可能偏好逐步建立信任、稳定承诺，以及通过持续关怀培养的关系。',

      independent:
        '你可能重视诚实、个人空间，以及让双方保有独立个性的关系。',

      sensitive:
        '你可能很快察觉情绪细节，并寻求具有同理心、安心感和相互理解的关系。',
    },
  },

  career: {
    title: '事业',

    styles: {
      leadership: '领导导向',
      creative: '创意与表达',
      analytical: '分析与结构',
      supportive: '支持与服务导向',
      entrepreneurial: '创业与适应',
    },

    summaries: {
      leadership:
        '当你承担责任、协调人员并把方向转化为明确行动时，可能表现良好。',

      creative:
        '你可能适合重视想象力、沟通、设计、叙事或原创解题的工作。',

      analytical:
        '在需要规划、研究、系统思考、精确性和谨慎决策的工作中，你可能表现最佳。',

      supportive:
        '你可能在协作、咨询、教学、照护或服务型角色中发挥重要作用。',

      entrepreneurial:
        '你可能会被主动尝试、实验、独立项目和奖励适应力的机会吸引。',
    },
  },

  reasons: {
    hoangDao: '黄道吉日',

    hacDao: '黑道日',

    traditionalSuitable:
      '传统上适合此事项',

    traditionalAvoid:
      '传统上建议避免此事项',

    zodiacClash:
      '日支与出生生肖相冲',

    sixHarmony: '六合关系',

    threeHarmony: '三合关系',

    nguyetKy: '传统月忌日',

    tamNuong: '传统三娘煞日',

    preferredLunarDay:
      '参考规则中优先的农历日期',

    weekendConvenient: '周末较为便利',

    birthHourClash:
      '日支与出生时支相冲',

    birthHourHarmony:
      '日支与出生时支形成六合',

    birthHourThreeHarmony:
      '日支与出生时支形成三合',

    birthLunarDayResonance:
      '农历日期与农历出生日相应',

    school_folk:
      '按民俗综合法评分',

    school_bazi:
      '按八字参考预设评分',

    school_ziwei:
      '按紫微参考预设评分',

    school_almanac:
      '按传统黄历预设评分',
  },

  insights: {
    loveHarmony:
      '出生生肖与出生时支形成六合关系。',

    loveThreeHarmony:
      '出生生肖与出生时支属于同一三合组。',

    loveInnerConflict:
      '出生生肖与出生时支形成相冲，可能反映亲密需求与个人需求之间的内在张力。',

    loveSelfAwareness:
      '农历出生日显示出反思和情绪自我觉察的倾向。',

    loveWarmHeart:
      '你可能慷慨表达感情，并营造温暖的情感氛围。',

    loveExpressive:
      '你往往能通过言语、行动和明确的关注表达关怀。',

    loveOvergiving:
      '有时你可能付出过多，却未先确认自己的需要是否得到照顾。',

    loveSetBoundaries:
      '建立清晰而友善的界限，让关怀保持平衡。',

    loveReceiveCare:
      '允许他人支持和照顾你，而不是总由你付出。',

    loveLoyal:
      '你可能重视忠诚、可靠和长期承诺。',

    lovePatient:
      '你通常愿意给一段关系时间去发展。',

    loveReserved:
      '你可能把感受藏在心里，直到难以解释。',

    loveSpeakClearly:
      '尽早清楚表达需要，不要期待对方自行猜测。',

    loveCreateRituals:
      '建立一些共同的小习惯，以增强信任与连结。',

    loveRespectsSpace:
      '你可能尊重个体差异，并理解个人空间的需要。',

    loveHonest:
      '你可能偏好直接而诚实的感情沟通。',

    loveNeedsFreedom:
      '过多限制可能使你退缩或产生情感距离。',

    loveBalanceFreedom:
      '在独立与持续的情感陪伴之间取得平衡。',

    loveSharePlans:
      '分享计划与期待，避免自由被误解为疏远。',

    loveEmpathetic:
      '你可能理解细微的情绪变化，并以同理心回应。',

    loveIntuitive:
      '你在理解关系时可能非常依赖直觉。',

    loveOverthinking:
      '当沟通不清时，敏感可能转化为过度思考。',

    loveTrustSlowly:
      '让信任通过持续行动逐步形成，而不是依赖猜测。',

    loveAskDirectly:
      '不确定时直接询问，而不是解读沉默。',

    careerPersistent:
      '你可能凭借坚持和持续前进的意愿获得进展。',

    careerReflective:
      '你可能擅长通过复盘、反思和调整方法来学习。',

    careerActionOriented:
      '阳性倾向可能支持主动性、可见行动和果断推进。',

    careerObservant:
      '阴性倾向可能支持观察、耐心、时机判断和周密准备。',

    careerLeadership:
      '你可能乐于引导他人并设定清晰方向。',

    careerResponsibility:
      '你通常愿意为结果负责，并履行承诺。',

    careerOvercontrol:
      '控制过多可能限制合作或造成不必要的压力。',

    careerDelegate:
      '清楚分工，并给他人以自己的方式贡献的空间。',

    careerListenBeforeDeciding:
      '在重要决定前收集不同观点。',

    careerCreative:
      '你可能产生原创想法，并看到他人忽略的可能性。',

    careerExpression:
      '沟通、设计、叙事或展示可能是你的自然优势。',

    careerScattered:
      '同时拥有太多想法，可能使你难以完成最重要的工作。',

    careerBuildPortfolio:
      '建立可展示的完成作品，把创造力转化为机会。',

    careerFinishOneThing:
      '先完成一个重点，再扩展到下一个想法。',

    careerAnalytical:
      '你可能善于分析细节、模式和因果关系。',

    careerPlanning:
      '结构化准备可能帮助你降低风险并提高稳定性。',

    careerPerfectionism:
      '等待完美信息可能延误有价值的行动。',

    careerSetMilestones:
      '把大目标拆分为可衡量、期限明确的里程碑。',

    careerDecideWithEnoughData:
      '当信息已经足够时采取行动，即使尚未完全齐备。',

    careerTeamwork:
      '你可能通过合作、可靠和情绪觉察增强团队。',

    careerService:
      '你可能在帮助、教学、支持或改善他人生活的工作中找到意义。',

    careerPeoplePleasing:
      '试图取悦所有人可能消耗精力，并模糊优先事项。',

    careerProtectEnergy:
      '为时间和情绪劳动设定界限，使贡献保持可持续。',

    careerShowYourContribution:
      '清楚表达成果，不要假设别人会自行注意到。',

    careerInitiative:
      '即使条件尚未完全确定，你也可能愿意先开始。',

    careerAdaptability:
      '当环境、市场或计划变化时，你可能调整得很快。',

    careerRiskTaking:
      '对机会的热情可能使你在保护不足时承担风险。',

    careerValidateRisk:
      '在做出重大承诺前，用小型实验验证假设。',

    careerKeepCashReserve:
      '追求独立或不确定的机会时，保留财务储备。',
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

export default zh;
