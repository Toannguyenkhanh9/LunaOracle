import westernFeatures
  from './westernFeatures.fr';
import lunaFeatures
  from './lunaFeatures.fr';
import lunaDynamic
  from './lunaDynamic.fr';
  import lunaCompatibility
  from './lunaCompatibility.fr';
  import lunaBirthChart
  from './lunaBirthChart.fr';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.fr';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.fr';
  import lunaBirthProfiles
  from './lunaBirthProfiles.fr';
    import lunaDailyInsight
  from './lunaDailyInsight.fr';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.fr';
  import lunaDailyRitual
  from './lunaDailyRitual.fr';
  import lunaAchievements
  from './lunaAchievements.fr';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.fr';
  import lunaForecast
  from './lunaForecast.fr';
const fr = {
  common: {
    cancel: "Annuler",
    delete: "Supprimer",
    reset: "Réinitialiser",
    loading: "Chargement...",
    more: "Plus",
    save: "Enregistrer",
    close: "Fermer",
  },
  tabs: {
    home: "Accueil",
    horoscope: "Horoscope",
    tarot: "Tarot",
    profile: "Profil",
    more: "Plus",
  },
  settings: {
    title: "Paramètres",
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "Langue",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "Choisir la langue",
    privacy: "Confidentialité",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "Informations",
    version: "Luna Oracle version 1.0.0",
  },
} as const;

export default {
  ...fr,
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
