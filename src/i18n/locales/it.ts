import westernFeatures
  from './westernFeatures.it';
import lunaFeatures
  from './lunaFeatures.it';
import lunaDynamic
  from './lunaDynamic.it';
  import lunaCompatibility
  from './lunaCompatibility.it';
  import lunaBirthChart
  from './lunaBirthChart.it';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.it';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.it';
  import lunaBirthProfiles
  from './lunaBirthProfiles.it';
    import lunaDailyInsight
  from './lunaDailyInsight.it';
const it = {
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
  ...it,
  ...westernFeatures,
  ...lunaFeatures,
    ...lunaDynamic,
      ...lunaCompatibility,
        ...lunaBirthChart,
         ...lunaBirthChartStage3,
           ...lunaBirthChartStage4,
...lunaBirthProfiles,
  ...lunaDailyInsight,
} as const;
