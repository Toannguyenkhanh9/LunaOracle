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
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.it';
  import lunaDailyRitual
  from './lunaDailyRitual.it';
  import lunaAchievements
  from './lunaAchievements.it';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.it';
  import lunaForecast
  from './lunaForecast.it';
  import lunaTarotAnimation
  from './lunaTarotAnimation.it';
  import lunaShare
  from './lunaShare.it';
  import engagementPack
  from './engagementPack.it';
  import moonDust
  from './moonDust.it';
  import features2_6
  from './features2_6.it';
  import dailyQuestLevel
  from './dailyQuestLevel.it';
  import retentionFeatures
  from './retentionFeatures.it';
  import palmReading
  from './palmReading.it';
  import palmReadingV2Lite
  from './palmReadingV2Lite.it';
const it = {
  common: {
    cancel: "Annulla",
    ok: "OK",
    delete: "Elimina",
    reset: "Reimposta",
    loading: "Caricamento...",
    more: "Altro",
    save: "Salva",
    close: "Chiudi",
  },
  tabs: {
    home: "Home",
    horoscope: "Oroscopo",
    tarot: "Tarocchi",
    profile: "Profilo",
    more: "Altro",
  },
  settings: {
    title: "Impostazioni",
    notifications: "Notifiche",
    notificationsDescription: "Gestisci i promemoria quotidiani per oroscopo e luna.",
    language: "Lingua",
    languageDescription: "Scegli la lingua usata dall’app.",
    chooseLanguage: "Scegli lingua",
    privacy: "Privacy",
    privacyDescription: "Il tuo diario e le tue letture sono salvati su questo dispositivo, salvo esportazione o sincronizzazione.",
    information: "Informazioni",
    version: "Luna Oracle versione 1.0.0",
  },
} as const;

const __localeBase = {
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
