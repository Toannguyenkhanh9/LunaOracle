import westernFeatures
  from './westernFeatures.pt';
import lunaFeatures
  from './lunaFeatures.pt';
import lunaDynamic
  from './lunaDynamic.pt';
  import lunaCompatibility
  from './lunaCompatibility.pt';
  import lunaBirthChart
  from './lunaBirthChart.pt';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.pt';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.pt';
  import lunaBirthProfiles
  from './lunaBirthProfiles.pt';
    import lunaDailyInsight
  from './lunaDailyInsight.pt';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.pt';
  import lunaDailyRitual
  from './lunaDailyRitual.pt';
  import lunaAchievements
  from './lunaAchievements.pt';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.pt';
const pt = {
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
  ...pt,
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
} as const;
