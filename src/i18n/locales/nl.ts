import westernFeatures
  from './westernFeatures.nl';
import lunaFeatures
  from './lunaFeatures.nl';
import lunaDynamic
  from './lunaDynamic.nl';
  import lunaCompatibility
  from './lunaCompatibility.nl';
  import lunaBirthChart
  from './lunaBirthChart.nl';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.nl';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.nl';
  import lunaBirthProfiles
  from './lunaBirthProfiles.nl';
    import lunaDailyInsight
  from './lunaDailyInsight.nl';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.nl';
  import lunaDailyRitual
  from './lunaDailyRitual.nl';
  import lunaAchievements
  from './lunaAchievements.nl';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.nl';
  import lunaForecast
  from './lunaForecast.nl';
const nl = {
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
  ...nl,
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
} as const;
