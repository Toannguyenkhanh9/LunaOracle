import westernFeatures
  from './westernFeatures.hi';
import lunaFeatures
  from './lunaFeatures.hi';
import lunaDynamic
  from './lunaDynamic.hi';
  import lunaCompatibility
  from './lunaCompatibility.hi';
  import lunaBirthChart
  from './lunaBirthChart.hi';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.hi';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.hi';
  import lunaBirthProfiles
  from './lunaBirthProfiles.hi';
    import lunaDailyInsight
  from './lunaDailyInsight.hi';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.hi';
  import lunaDailyRitual
  from './lunaDailyRitual.hi';
  import lunaAchievements
  from './lunaAchievements.hi';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.hi';
  import lunaForecast
  from './lunaForecast.hi';
  import lunaTarotAnimation
  from './lunaTarotAnimation.hi';
  import lunaShare
  from './lunaShare.hi';
  import engagementPack
  from './engagementPack.hi';
  import moonDust
  from './moonDust.hi';
  import features2_6
  from './features2_6.hi';
  import dailyQuestLevel
  from './dailyQuestLevel.hi';
  import retentionFeatures
  from './retentionFeatures.hi';
  import palmReading
  from './palmReading.hi';
  import palmReadingV2Lite
  from './palmReadingV2Lite.hi';
const hi = {
  common: {
    cancel: "रद्द करें",
    ok: "ठीक है",
    delete: "हटाएँ",
    reset: "रीसेट करें",
    loading: "लोड हो रहा है...",
    more: "और",
    save: "सहेजें",
    close: "बंद करें",
  },
  tabs: {
    home: "होम",
    horoscope: "राशिफल",
    tarot: "टैरो",
    profile: "प्रोफ़ाइल",
    more: "और",
  },
  settings: {
    title: "सेटिंग्स",
    notifications: "सूचनाएँ",
    notificationsDescription: "दैनिक राशिफल और चंद्रमा रिमाइंडर प्रबंधित करें।",
    language: "भाषा",
    languageDescription: "ऐप में इस्तेमाल होने वाली भाषा चुनें।",
    chooseLanguage: "भाषा चुनें",
    privacy: "गोपनीयता",
    privacyDescription: "आपकी डायरी और रीडिंग इस डिवाइस पर संग्रहीत रहती हैं, जब तक आप उन्हें निर्यात या सिंक नहीं करते।",
    information: "जानकारी",
    version: "Luna Oracle संस्करण 1.0.0",
  },
} as const;

const __localeBase = {
  ...hi,
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
