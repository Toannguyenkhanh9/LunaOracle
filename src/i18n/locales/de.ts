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
  import moonDust
  from './moonDust.de';
  import features2_6
  from './features2_6.de';
  import dailyQuestLevel
  from './dailyQuestLevel.de';
  import retentionFeatures
  from './retentionFeatures.de';
  import palmReading
  from './palmReading.de';
  import palmReadingV2Lite
  from './palmReadingV2Lite.de';
const de = {
  common: {
    cancel: "Abbrechen",
    ok: "OK",
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
    notifications: "Benachrichtigungen",
    notificationsDescription: "Verwalte tägliche Horoskop- und Mond-Erinnerungen.",
    language: "Sprache",
    languageDescription: "Wähle die Sprache, die in der App verwendet wird.",
    chooseLanguage: "Sprache wählen",
    privacy: "Datenschutz",
    privacyDescription: "Dein Journal und deine Deutungen werden auf diesem Gerät gespeichert, sofern du sie nicht exportierst oder synchronisierst.",
    information: "Informationen",
    version: "Luna Oracle Version 1.0.0",
  },
} as const;

const __localeBase = {
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
