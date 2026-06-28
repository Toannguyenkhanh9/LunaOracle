import westernFeatures
  from './westernFeatures.ar';
import lunaFeatures
  from './lunaFeatures.ar';
  import lunaDynamic
  from './lunaDynamic.ar';
  import lunaCompatibility
  from './lunaCompatibility.ar';
import lunaBirthChart
  from './lunaBirthChart.ar';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.ar';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.ar';
  import lunaBirthProfiles
  from './lunaBirthProfiles.ar';
  import lunaDailyInsight
  from './lunaDailyInsight.ar';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.ar';
  import lunaDailyRitual
  from './lunaDailyRitual.ar';
  import lunaAchievements
  from './lunaAchievements.ar';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.ar';
  import lunaForecast
  from './lunaForecast.ar';
  import lunaTarotAnimation
  from './lunaTarotAnimation.ar';
  import lunaShare
  from './lunaShare.ar';
  import engagementPack
  from './engagementPack.ar';
  import moonDust
  from './moonDust.ar';
  import features2_6
  from './features2_6.ar';
  import dailyQuestLevel
  from './dailyQuestLevel.ar';
  import retentionFeatures
  from './retentionFeatures.ar';
  import palmReading
  from './palmReading.ar';
  import palmReadingV2Lite
  from './palmReadingV2Lite.ar';
const ar = {
  common: {
    cancel: "إلغاء",
    ok: "حسنًا",
    delete: "حذف",
    reset: "إعادة تعيين",
    loading: "جارٍ التحميل...",
    more: "المزيد",
    save: "حفظ",
    close: "إغلاق",
  },
  tabs: {
    home: "الرئيسية",
    horoscope: "الأبراج",
    tarot: "التاروت",
    profile: "الملف",
    more: "المزيد",
  },
  settings: {
    title: "الإعدادات",
    notifications: "الإشعارات",
    notificationsDescription: "إدارة إشعارات الأبراج اليومية وتذكيرات القمر.",
    language: "اللغة",
    languageDescription: "اختر اللغة المستخدمة في التطبيق.",
    chooseLanguage: "اختر اللغة",
    privacy: "الخصوصية",
    privacyDescription: "يتم تخزين يومياتك وقراءاتك على هذا الجهاز ما لم تقم بتصديرها أو مزامنتها.",
    information: "معلومات",
    version: "Luna Oracle الإصدار 1.0.0",
  },
} as const;

const __localeBase = {
  ...ar,
  ...westernFeatures,
  ...lunaFeatures,
    ...lunaDynamic,
      ...lunaCompatibility,
        ...lunaBirthChart,
         ...lunaBirthChartStage3,
           ...lunaBirthChartStage4,
...lunaBirthProfiles,
  ...lunaDailyInsight,
  ...lunaAdvancedFeatures,
    ...lunaDailyRitual,
      ...lunaAchievements,
        ...lunaJournalLoveOnboarding,
          ...lunaForecast,
            ...lunaTarotAnimation,
              ...lunaShare,
                ...engagementPack,
                  ...moonDust,
                    ...features2_6,
                      ...dailyQuestLevel,
                        ...retentionFeatures,
                          ...palmReading,
                            ...palmReadingV2Lite,
} as const;

export default {
  ...__localeBase,
  palmReading: {
    ...palmReading.palmReading,
    ...palmReadingV2Lite.palmReading,
  },
} as const;
