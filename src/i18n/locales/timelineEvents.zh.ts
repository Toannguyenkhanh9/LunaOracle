const timelineEvents = {
  createTitle: '添加时间轴事件',
  editTitle: '编辑时间轴事件',

  profileLine: '档案：{{name}}',
  profileUnavailable: '无法找到档案',

  basicInformation: '事件信息',
  eventTitle: '标题',
  eventTitlePlaceholder:
    '例如：换工作、搬家、毕业……',
  description: '描述',
  descriptionPlaceholder:
    '记录发生了什么、当时的背景与感受……',

  dateTitle: '发生日期',
  day: '日',
  month: '月',
  year: '年',

  categoryTitle: '事件类别',
  categories: {
    career: '事业',
    finance: '财务',
    relationship: '感情',
    family: '家庭',
    health: '健康',
    education: '学习',
    relocation: '搬迁',
    spiritual: '内在成长',
    achievement: '成就',
    other: '其他',
  },

  toneTitle: '事件性质',
  tones: {
    positive: '积极',
    neutral: '中性',
    challenging: '挑战',
  },

  importanceTitle: '重要程度',
  importance: {
    1: '较轻',
    2: '值得注意',
    3: '重大节点',
  },

  tagsTitle: '标签',
  tagsPlaceholder:
    '例如：工作、家庭、变化',
  tagsHelp:
    '请用逗号分隔标签。',

  save: '保存事件',
  update: '更新事件',
  saving: '正在保存……',
  done: '完成',

  savedTitle: '事件已保存',
  createdMessage:
    '事件已添加到时间轴。',
  updatedMessage:
    '事件已更新。',

  sectionEyebrow: '真实事件',
  sectionTitle: '{{year}}年记录',
  sectionSubtitle:
    '将参考节律与真实发生的事情进行对照。',
  add: '添加事件',

  emptyTitle: '本年暂无事件',
  emptyMessage:
    '可添加换工作、搬家、关系、健康或成就等重要节点。',

  edit: '编辑',
  delete: '删除',
  cancel: '取消',

  deleteTitle: '删除事件',
  deleteMessage:
    '确定要删除“{{title}}”吗？',

  loading: '正在加载事件……',

  privacyTitle: '个人数据',
  privacyMessage:
    '时间轴事件保存在本机。未经允许，不要记录他人的敏感信息。',

  errors: {
    title: '信息无效',
    titleRequired:
      '请输入事件标题。',
    invalidDate:
      '事件日期无效。',
    saveFailed:
      '无法保存事件，请重试。',
  },
};

export default timelineEvents;
