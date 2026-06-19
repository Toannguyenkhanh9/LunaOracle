const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "出生星盘",
    title: "太阳、月亮与上升",
    subtitle: "输入出生时间和地点，以估算月亮星座、上升星座、宫位和主要相位。",
    inputsTitle: "出生资料",
    year: "年",
    month: "月",
    day: "日",
    hour: "时",
    minute: "分",
    timezone: "UTC",
    latitude: "纬度",
    longitude: "经度",
    bigThree: "三大主轴",
    houses: "等宫制宫位",
    house: "第 {{number}} 宫",
    aspects: "主要相位",
    noAspects: "所选容许度内没有主要相位。",
    orb: "容许度 {{value}}°",
    approximateNotice: "此星盘使用离线近似计算，适合自我反思。专业占星请使用认证星历和准确出生地点。",
    points: {
      sun: "太阳",
      moon: "月亮",
      ascendant: "上升",
      midheaven: "天顶",
    },
    aspectNames: {
      conjunction: "合相",
      sextile: "六合",
      square: "刑相",
      trine: "拱相",
      opposition: "冲相",
    },
  },
} as const;

export default lunaBirthChart;
