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
const fil = {
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
} as const;
