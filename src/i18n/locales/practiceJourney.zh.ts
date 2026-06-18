const practiceJourney = {
  title: '修习旅程',
  subtitle:
    '选择7天、21天或49天旅程，循序建立安定的每日修习。',

  homeTitle: '7/21/49天修习旅程',
  homeSubtitle:
    '每天依次进行冥想、持诵、祈愿与安心日记。',

  choosePlan: '选择修习旅程',
  days: '{{count}}天',
  loading: '正在加载旅程……',
  notice:
    '本旅程用于帮助建立习惯与自我反思。请按照自己的健康、时间和实际情况调整节奏。',

  plans: {
    7: {
      title: '7天安然起步',
      description:
        '从简短温和、容易坚持的修习开始。',
    },
    21: {
      title: '21天养成习惯',
      description:
        '建立稳定节奏，并逐渐加深每日修习。',
    },
    49: {
      title: '49天专注修习',
      description:
        '通过更深入的旅程培养坚持、觉察与感恩。',
    },
  },

  startDialogTitle: '开始旅程',
  startDialogMessage:
    '从今天开始{{count}}天修习旅程吗？',
  start: '开始',
  cancel: '取消',

  stopDialogTitle: '停止旅程',
  stopDialogMessage:
    '当前进度将被清除，确定停止吗？',
  stop: '停止',
  stopJourney: '停止并选择其他旅程',

  errorTitle: '无法开始',
  startError:
    '创建旅程时发生错误，请重试。',

  currentJourney: '当前旅程',
  startedOn: '开始于{{date}}',
  daysCompleted:
    '已完成{{completed}}/{{total}}天',
  journeyDays: '旅程日期',

  dayNumber: '第{{count}}天',
  dayDescription:
    '第{{week}}周 · 请按照舒适的节奏完成每一步。',
  completed: '已完成',
  inProgress: '进行中',

  open: '打开',
  manualHint:
    '可打开相应功能进行修习，也可在完成后手动勾选。',
  taskProgress:
    '{{current}}/{{target}} {{unit}}',

  journeyCompletedTitle:
    '已完成修习旅程',
  journeyCompletedMessage:
    '请肯定自己的坚持，并继续保留适合你的日常修习。',
  chooseAnotherPlan:
    '选择新旅程',

  completedJourneys:
    '已完成的旅程',

  themes: {
    day1: '回到当下',
    day2: '培育愿心',
    day3: '倾听内心',
    day4: '安住呼吸',
    day5: '播下平安种子',
    day6: '放松与感恩',
    day7: '以正念结束一周',
  },

  tasks: {
    incense: {
      title: '上香',
      description:
        '点燃{{target}}炷香，并静心一分钟。',
    },
    meditation: {
      title: '冥想',
      description:
        '至少冥想{{target}}{{unit}}。',
    },
    chant: {
      title: '持诵',
      description:
        '完成{{target}}{{unit}}念佛或持咒。',
    },
    prayer: {
      title: '祈愿',
      description:
        '写下或诵读{{target}}则真诚祈愿。',
    },
    audio: {
      title: '经文与禅音',
      description:
        '至少聆听{{target}}段有助于安定身心的内容。',
    },
    journal: {
      title: '安心日记',
      description:
        '写下{{target}}则今日的觉察或感恩。',
    },
    breath: {
      title: '数息',
      description:
        '有意识地跟随{{target}}{{unit}}缓慢呼吸。',
    },
    dailyRitual: {
      title: '每日仪式',
      description:
        '完成今日{{target}}次综合修习仪式。',
    },
  },

  units: {
    incense: '炷',
    meditation: '分钟',
    chant: '遍',
    prayer: '则祈愿',
    audio: '段',
    journal: '篇',
    breath: '次呼吸',
    dailyRitual: '次仪式',
  },
};

export default practiceJourney;
