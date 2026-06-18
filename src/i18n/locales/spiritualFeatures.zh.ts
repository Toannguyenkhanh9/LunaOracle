export const peaceJournal = {
  title: '安心日记',
  subtitle:
    '一个私密空间，用来记录情绪、感恩，以及你准备放下的事情。',
  beforeMood: '书写前的心情',
  afterMood: '书写后的心情',
  moods: {
    peaceful: '平静',
    grateful: '感恩',
    neutral: '一般',
    worried: '担忧',
    sad: '难过',
  },
  gratitudeLabel: '今天值得感恩的事',
  gratitudePlaceholder:
    '例如：一顿热饭、一句问候、一个安静的片刻……',
  releaseLabel: '我想放下的事',
  releasePlaceholder:
    '写下让你感到沉重的事情……',
  prayerLabel: '今天的祈愿',
  prayerPlaceholder:
    '为自己或他人送上一份善愿……',
  noteLabel: '自由记录',
  notePlaceholder:
    '写下任何你想保留的内容……',
  requiredTitle: '尚无内容',
  requiredMessage: '请至少填写一项内容后再保存。',
  savedTitle: '日记已保存',
  savedMessage: '内容已私密保存在此设备上。',
  saveErrorTitle: '无法保存',
  saveErrorMessage: '保存日记时发生错误。',
  save: '保存日记',
  saving: '正在保存……',
  privacy:
    '内容仅保存在本设备，不会自动上传到服务器。',
  history: '过去的记录',
  empty: '你还没有写过日记。',
  deleteTitle: '删除日记',
  deleteMessage: '确定要删除这条记录吗？',
};

export const buddhistCalendar = {
  title: '佛教日历',
  subtitle:
    '查看初一、十五及部分按农历计算的常见佛教纪念日。',
  lunarDate: '农历 {{month}}月{{day}}日',
  leapMonth: '闰月',
  noEvent: '当天没有标记的纪念日。',
  upcomingTitle: '即将到来的日期',
  noticeTitle: '提示',
  notice:
    '纪念日期可能因传统、地区和寺院历法而不同，请仅作参考。',
  events: {
    newMoon: '农历初一',
    fullMoon: '农历十五',
    maitreya: '弥勒佛纪念日',
    firstFullMoon: '元宵节',
    avalokitesvaraBirth: '观世音菩萨圣诞',
    vesak: '卫塞节',
    traditionNote: '纪念日期可能因传统而不同。',
    avalokitesvaraEnlightenment:
      '观世音菩萨成道日',
    ulambana: '盂兰盆节',
    avalokitesvaraRenunciation:
      '观世音菩萨出家日',
    amitabha: '阿弥陀佛圣诞',
    buddhaEnlightenment: '佛陀成道日',
  },
};

export const altarCustomization = {
  title: '个性化佛堂',
  subtitle:
    '选择适合你的光线、花卉、灯具与环境氛围。',
  preview: '预览',
  cultureThemeTitle: '佛堂风格',
  activeCultureTheme:
    '当前风格：{{theme}}',
  cultureThemes: {
    auto: '跟随语言自动选择',
    vietnam: '越南风格',
    china: '中国风格',
    japan: '日本风格',
    korea: '韩国风格',
    western: '西方风格',
  },
  sceneTitle: '时间场景',
  centerpieceTitle: '中心象征',
  flowerTitle: '花卉',
  lampTitle: '供灯',
  accentTitle: '光线颜色',
  soundscapeTitle: '环境声音',
  petalsTitle: '飘落花瓣',
  petalsDescription:
    '在大殿中显示缓慢飘动的花瓣效果。',
  save: '保存空间',
  saving: '正在保存……',
  savedTitle: '已保存',
  savedMessage: '大殿空间已更新。',
  saveErrorTitle: '无法保存',
  saveErrorMessage: '保存设置时发生错误。',
  reset: '恢复默认',
  resetTitle: '恢复默认',
  resetMessage: '确定将所有设置恢复为默认值吗？',
  soundscapeNote:
    '环境声音仅在“大殿”页面打开时播放。',
  sceneModes: {
    auto: '自动',
    dawn: '清晨',
    day: '白天',
    dusk: '黄昏',
    night: '夜晚',
  },
  centerpieces: {
    buddha: '佛像',
    lotus: '莲花',
    dharmaWheel: '法轮',
    none: '无',
  },
  flowers: {
    lily: '百合',
    lotus: '莲花',
    orchid: '兰花',
    none: '无花',
  },
  lamps: {
    candle: '蜡烛',
    lantern: '灯笼',
    lotusLamp: '莲花灯',
    none: '无',
  },
  accents: {
    amber: '琥珀',
    gold: '金色',
    rose: '玫瑰色',
    jade: '玉色',
    none: '无',
  },
  soundscapes: {
    none: '无声音',
    rain: '寺院雨声',
    forest: '晨间森林',
    bell: '冥想钟声',
  },
};

export default {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
};
