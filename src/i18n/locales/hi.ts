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
const hi = {
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
} as const;
