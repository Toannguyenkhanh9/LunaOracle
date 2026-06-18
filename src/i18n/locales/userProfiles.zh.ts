const userProfiles = {
  tabTitle: '档案',
  title: '共享档案',
  subtitle:
    '出生资料只需保存一次，即可用于八字、紫微斗数、择日及其他工具。',
  add: '添加档案',
  createTitle: '新建档案',
  editTitle: '编辑档案',
  editorSubtitle:
    '这些资料可在 Eastern Destiny 的多个功能中重复使用。',
  loading: '正在加载档案……',

  basicInformation: '基本信息',
  displayName: '显示名称',
  displayNamePlaceholder: '例如：陈明',
  relationship: '关系',
  gender: '性别',

  birthInformation: '出生信息',
  solarBirthDate: '阳历出生日期',
  birthTimeAccuracy: '出生时间准确度',
  birthTime: '出生时间',
  unknownTimeNotice:
    '出生时间未知时，应用会暂时使用12:00作为技术计算值，部分结果可能发生较大变化。',

  birthLocation: '出生地与时区',
  placeName: '出生地',
  placeNamePlaceholder: '例如：胡志明市',
  timeZone: 'IANA时区',
  longitude: '经度',
  latitude: '纬度',

  notesAndOptions: '备注与选项',
  notes: '私人备注',
  notesPlaceholder:
    '添加有助于识别此档案的信息……',
  favorite: '设为常用',
  favoriteSubtitle:
    '常用档案会优先显示在列表上方。',

  save: '保存档案',
  saving: '正在保存……',
  savedTitle: '档案已保存',
  savedMessage:
    '档案已保存在此设备上。',
  done: '完成',

  searchPlaceholder:
    '按姓名、出生地或备注搜索……',
  profileCount: '{{count}}个档案',
  favoriteCount: '常用',
  summaryHint:
    '同一份档案可用于多个工具，无需重复输入出生资料。',

  importFromBazi: '从已保存八字命盘导入',
  importFromBaziSubtitle:
    '将设备中现有的八字命盘转换为共享档案。',
  importing: '正在导入档案……',
  importCompletedTitle: '导入完成',
  importCompletedMessage:
    '已创建{{count}}个新档案。',
  importNothingMessage:
    '没有新的命盘可导入。',
  importErrorTitle: '无法导入',
  importErrorMessage:
    '读取已保存八字命盘时发生错误。',

  emptyTitle: '暂无档案',
  emptyMessage:
    '创建第一个档案，用于八字、紫微斗数和择日。',
  createFirst: '创建第一个档案',
  noResultsTitle: '未找到档案',
  noResultsMessage:
    '请尝试其他关键词或清除搜索内容。',

  birthDateShort: '出生日期',
  birthTimeShort: '出生时间',
  locationShort: '出生地',
  approximatePrefix: '约',

  edit: '编辑',
  duplicate: '复制',
  delete: '删除',
  cancel: '取消',

  deleteTitle: '删除档案',
  deleteMessage:
    '确定要删除“{{name}}”吗？',

  ziweiGenderTitle: '需要选择性别',
  ziweiGenderMessage:
    '紫微斗数排盘需要选择男性或女性，请先编辑档案。',

  privacyTitle: '个人资料',
  privacyMessage:
    '当前版本将档案保存在本机。请保护设备，未经允许不要分享他人的出生资料。',

  profileTimeWarningTitle:
    '出生时间提示',
  profileTimeUnknownMessage:
    '此档案没有确定的出生时间，应用暂时使用12:00。时柱及宫位结果可能变化。',
  profileTimeApproximateMessage:
    '此档案使用估计出生时间。若准确时间不同，部分结果可能变化。',

  relationships: {
    self: '本人',
    partner: '伴侣',
    parent: '父母',
    child: '子女',
    sibling: '兄弟姐妹',
    friend: '朋友',
    client: '客户',
    other: '其他',
  },

  genders: {
    male: '男',
    female: '女',
    unspecified: '未指定',
  },

  timeAccuracy: {
    exact: '准确',
    approximate: '估计',
    unknown: '未知',
  },

  actions: {
    bazi: '八字',
    ziwei: '紫微',
    dates: '吉日',
  },

  errors: {
    title: '信息无效',
    displayNameRequired:
      '请输入显示名称。',
    invalidDate:
      '阳历出生日期无效。',
    invalidTime:
      '出生时间必须在00:00至23:59之间。',
    timeZoneRequired:
      '请输入IANA时区。',
    invalidCoordinate:
      '经度或纬度无效。',
    saveFailed:
      '无法保存档案，请重试。',
  },
};

export default userProfiles;
