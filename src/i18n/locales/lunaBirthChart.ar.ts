const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "الخريطة الميلادية",
    title: "الشمس والقمر والطالع",
    subtitle: "أضف وقت ومكان الميلاد لتقدير برج القمر والطالع والبيوت والزوايا الرئيسية.",
    inputsTitle: "تفاصيل الميلاد",
    year: "السنة",
    month: "الشهر",
    day: "اليوم",
    hour: "الساعة",
    minute: "الدقيقة",
    timezone: "UTC",
    latitude: "خط العرض",
    longitude: "خط الطول",
    bigThree: "الثلاثة الكبار",
    houses: "البيوت المتساوية",
    house: "البيت {{number}}",
    aspects: "الزوايا الرئيسية",
    noAspects: "لا توجد زوايا رئيسية ضمن الهامش المحدد.",
    orb: "الهامش {{value}}°",
    approximateNotice: "تستخدم هذه الخريطة حسابات تقريبية دون اتصال. للاستخدام المهني، استخدم جداول فلكية معتمدة ومكان ميلاد دقيق.",
    points: {
      sun: "الشمس",
      moon: "القمر",
      ascendant: "الطالع",
      midheaven: "وسط السماء",
    },
    aspectNames: {
      conjunction: "اقتران",
      sextile: "تسديس",
      square: "تربيع",
      trine: "تثليث",
      opposition: "مقابلة",
    },
  },
} as const;

export default lunaBirthChart;
