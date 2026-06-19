const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "Натальная карта",
    title: "Солнце, Луна и Асцендент",
    subtitle: "Добавьте время и место рождения, чтобы оценить Лунный знак, Асцендент, дома и основные аспекты.",
    inputsTitle: "Данные рождения",
    year: "Год",
    month: "Месяц",
    day: "День",
    hour: "Час",
    minute: "Минута",
    timezone: "UTC",
    latitude: "Широта",
    longitude: "Долгота",
    bigThree: "Большая тройка",
    houses: "Равные дома",
    house: "Дом {{number}}",
    aspects: "Основные аспекты",
    noAspects: "Нет основных аспектов в выбранном орбе.",
    orb: "орб {{value}}°",
    approximateNotice: "Эта карта использует приблизительные офлайн-расчеты. Для профессиональной астрологии используйте сертифицированные эфемериды и точное место рождения.",
    points: {
      sun: "Солнце",
      moon: "Луна",
      ascendant: "Асцендент",
      midheaven: "MC",
    },
    aspectNames: {
      conjunction: "соединение",
      sextile: "секстиль",
      square: "квадрат",
      trine: "трин",
      opposition: "оппозиция",
    },
  },
} as const;

export default lunaBirthChart;
