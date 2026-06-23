import westernFeatures
  from './westernFeatures.th';
import lunaFeatures
  from './lunaFeatures.th';
import lunaDynamic
  from './lunaDynamic.th';
  import lunaCompatibility
  from './lunaCompatibility.th';
  import lunaBirthChart
  from './lunaBirthChart.th';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.th';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.th';
  import lunaBirthProfiles
  from './lunaBirthProfiles.th';
    import lunaDailyInsight
  from './lunaDailyInsight.th';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.th';
  import lunaDailyRitual
  from './lunaDailyRitual.th';
  import lunaAchievements
  from './lunaAchievements.th';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.th';
const th = {
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
  ...th,
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
