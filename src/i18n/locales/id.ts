import westernFeatures
  from './westernFeatures.id';
import lunaFeatures
  from './lunaFeatures.id';
import lunaDynamic
  from './lunaDynamic.id';
  import lunaCompatibility
  from './lunaCompatibility.id';
  import lunaBirthChart
  from './lunaBirthChart.id';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.id';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.id';
  import lunaBirthProfiles
  from './lunaBirthProfiles.id';
    import lunaDailyInsight
  from './lunaDailyInsight.id';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.id';
  import lunaDailyRitual
  from './lunaDailyRitual.id';
  import lunaAchievements
  from './lunaAchievements.id';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.id';
  import lunaForecast
  from './lunaForecast.id';
  import lunaTarotAnimation
  from './lunaTarotAnimation.id';
  import lunaShare
  from './lunaShare.id';
  import engagementPack
  from './engagementPack.id';
const idLocale = {
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
  ...idLocale,
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
