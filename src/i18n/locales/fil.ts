import westernFeatures
  from './westernFeatures.fil';
import lunaFeatures
  from './lunaFeatures.fil';
import lunaDynamic
  from './lunaDynamic.fil';
  import lunaCompatibility
  from './lunaCompatibility.fil';
  import lunaBirthChart
  from './lunaBirthChart.fil';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.fil';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.fil';
  import lunaBirthProfiles
  from './lunaBirthProfiles.fil';
    import lunaDailyInsight
  from './lunaDailyInsight.fil';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.fil';
  import lunaDailyRitual
  from './lunaDailyRitual.fil';
  import lunaAchievements
  from './lunaAchievements.fil';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.fil';
  import lunaForecast
  from './lunaForecast.fil';
  import lunaTarotAnimation
  from './lunaTarotAnimation.fil';
  import lunaShare
  from './lunaShare.fil';
  import engagementPack
  from './engagementPack.fil';
  import moonDust
  from './moonDust.fil';
  import features2_6
  from './features2_6.fil';
  import dailyQuestLevel
  from './dailyQuestLevel.fil';
  import retentionFeatures
  from './retentionFeatures.fil';
  import palmReading
  from './palmReading.fil';
  import palmReadingV2Lite
  from './palmReadingV2Lite.fil';
const fil = {
  common: {
    cancel: "Kanselahin",
    ok: "OK",
    delete: "Tanggalin",
    reset: "I-reset",
    loading: "Naglo-load...",
    more: "Higit pa",
    save: "I-save",
    close: "Isara",
  },
  tabs: {
    home: "Home",
    horoscope: "Horoscope",
    tarot: "Tarot",
    profile: "Profile",
    more: "Higit pa",
  },
  settings: {
    title: "Mga Setting",
    notifications: "Mga Notification",
    notificationsDescription: "Pamahalaan ang araw-araw na horoscope at mga paalala sa buwan.",
    language: "Wika",
    languageDescription: "Piliin ang wikang gagamitin ng app.",
    chooseLanguage: "Pumili ng wika",
    privacy: "Privacy",
    privacyDescription: "Naka-save sa device na ito ang iyong journal at mga reading maliban kung i-export o i-sync mo ang mga ito.",
    information: "Impormasyon",
    version: "Luna Oracle bersyon 1.0.0",
  },
} as const;

const __localeBase = {
  ...fil,
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
