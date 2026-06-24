import westernFeatures
  from './westernFeatures.ms';
import lunaFeatures
  from './lunaFeatures.ms';
import lunaDynamic
  from './lunaDynamic.ms';
  import lunaCompatibility
  from './lunaCompatibility.ms';
  import lunaBirthChart
  from './lunaBirthChart.ms';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.ms';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.ms';
  import lunaBirthProfiles
  from './lunaBirthProfiles.ms';
    import lunaDailyInsight
  from './lunaDailyInsight.ms';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.ms';
  import lunaDailyRitual
  from './lunaDailyRitual.ms';
  import lunaAchievements
  from './lunaAchievements.ms';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.ms';
  import lunaForecast
  from './lunaForecast.ms';
  import lunaTarotAnimation
  from './lunaTarotAnimation.ms';
  import lunaShare
  from './lunaShare.ms';
  import engagementPack
  from './engagementPack.ms';
const ms = {
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
  ...ms,
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
