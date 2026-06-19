const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "出生図",
    title: "太陽・月・アセンダント",
    subtitle: "出生時刻と場所を入力して、月星座、上昇星座、ハウス、主要アスペクトを推定します。",
    inputsTitle: "出生情報",
    year: "年",
    month: "月",
    day: "日",
    hour: "時",
    minute: "分",
    timezone: "UTC",
    latitude: "緯度",
    longitude: "経度",
    bigThree: "ビッグスリー",
    houses: "イコールハウス",
    house: "第{{number}}ハウス",
    aspects: "主要アスペクト",
    noAspects: "選択されたオーブ内に主要アスペクトはありません。",
    orb: "オーブ {{value}}°",
    approximateNotice: "このチャートはオフラインの近似計算です。専門的な占星術には正確な出生地と認証済みエフェメリスを使用してください。",
    points: {
      sun: "太陽",
      moon: "月",
      ascendant: "上昇",
      midheaven: "MC",
    },
    aspectNames: {
      conjunction: "コンジャンクション",
      sextile: "セクスタイル",
      square: "スクエア",
      trine: "トライン",
      opposition: "オポジション",
    },
  },
} as const;

export default lunaBirthChart;
