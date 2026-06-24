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
const ar = {
  common: {
    cancel: "إلغاء",
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
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "اللغة",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "اختر اللغة",
    privacy: "الخصوصية",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "معلومات",
    version: "Luna Oracle الإصدار 1.0.0",
  },
} as const;

export default {
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
} as const;
