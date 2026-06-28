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
  import lunaTarotAnimation
  from './lunaTarotAnimation.fr';
  import lunaShare
  from './lunaShare.fr';
  import engagementPack
  from './engagementPack.fr';
  import moonDust
  from './moonDust.fr';
  import features2_6
  from './features2_6.fr';
  import dailyQuestLevel
  from './dailyQuestLevel.fr';
  import retentionFeatures
  from './retentionFeatures.fr';
  import palmReading
  from './palmReading.fr';
  import palmReadingV2Lite
  from './palmReadingV2Lite.fr';
const fr = {
  common: {
    cancel: "Annuler",
    ok: "OK",
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
    notificationsDescription: "Gérez les rappels quotidiens d’horoscope et de lune.",
    language: "Langue",
    languageDescription: "Choisissez la langue utilisée par l’app.",
    chooseLanguage: "Choisir la langue",
    privacy: "Confidentialité",
    privacyDescription: "Votre journal et vos lectures sont stockés sur cet appareil, sauf si vous les exportez ou les synchronisez.",
    information: "Informations",
    version: "Luna Oracle version 1.0.0",
  },
} as const;

const __localeBase = {
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
            ...lunaTarotAnimation,
              ...lunaShare,
                ...engagementPack,
                  ...moonDust,
                    ...features2_6,
                      ...dailyQuestLevel,
                        ...retentionFeatures,
                          ...palmReading,
                            ...palmReadingV2Lite,
} as const;

export default {
  ...__localeBase,
  palmReading: {
    ...palmReading.palmReading,
    ...palmReadingV2Lite.palmReading,
  },
} as const;
