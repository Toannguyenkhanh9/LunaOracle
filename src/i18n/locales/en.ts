import westernFeatures
  from './westernFeatures.en';
import lunaFeatures
  from './lunaFeatures.en';
import lunaDynamic
  from './lunaDynamic.en';
  import lunaCompatibility
  from './lunaCompatibility.en';
  import lunaBirthChart
  from './lunaBirthChart.en';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.en';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.en';
  import lunaBirthProfiles
  from './lunaBirthProfiles.en';
    import lunaDailyInsight
  from './lunaDailyInsight.en';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.en';
  import lunaDailyRitual
  from './lunaDailyRitual.en';
  import lunaAchievements
  from './lunaAchievements.en';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.en';
  import lunaForecast
  from './lunaForecast.en';
  import lunaTarotAnimation
  from './lunaTarotAnimation.en';
  import lunaShare
  from './lunaShare.en';
  import engagementPack
  from './engagementPack.en';
const en = {
  
  common: {
    cancel: "Cancel",
    delete: "Delete",
    reset: "Reset",
    loading: "Loading...",
    more: "More",
    save: "Save",
    close: "Close",
  },
  tabs: {
    home: "Home",
    horoscope: "Horoscope",
    tarot: "Tarot",
    profile: "Profile",
    more: "More",
  },
  settings: {
    title: "Settings",
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "Language",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "Choose language",
    privacy: "Privacy",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "Information",
    version: "Luna Oracle version 1.0.0",
  },
} as const;

export default {
  ...en,
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
