import westernFeatures
  from './westernFeatures.de';
import lunaFeatures
  from './lunaFeatures.de';
import lunaDynamic
  from './lunaDynamic.de';
  import lunaCompatibility
  from './lunaCompatibility.de';
  import lunaBirthChart
  from './lunaBirthChart.de';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.de';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.de';
  import lunaBirthProfiles
  from './lunaBirthProfiles.de';
    import lunaDailyInsight
  from './lunaDailyInsight.de';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.de';
  import lunaDailyRitual
  from './lunaDailyRitual.de';
  import lunaAchievements
  from './lunaAchievements.de';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.de';
  import lunaForecast
  from './lunaForecast.de';
  import lunaTarotAnimation
  from './lunaTarotAnimation.de';
  import lunaShare
  from './lunaShare.de';
  import engagementPack
  from './engagementPack.de';
const de = {
  common: {
    cancel: "Abbrechen",
    delete: "Löschen",
    reset: "Zurücksetzen",
    loading: "Wird geladen...",
    more: "Mehr",
    save: "Speichern",
    close: "Schließen",
  },
  tabs: {
    home: "Start",
    horoscope: "Horoskop",
    tarot: "Tarot",
    profile: "Profil",
    more: "Mehr",
  },
  settings: {
    title: "Einstellungen",
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "Sprache",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "Sprache wählen",
    privacy: "Datenschutz",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "Informationen",
    version: "Luna Oracle Version 1.0.0",
  },
} as const;

export default {
  ...de,
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
