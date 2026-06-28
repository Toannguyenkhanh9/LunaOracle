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
  import lunaTarotAnimation
  from './lunaTarotAnimation.nl';
  import lunaShare
  from './lunaShare.nl';
  import engagementPack
  from './engagementPack.nl';
  import moonDust
  from './moonDust.nl';
  import features2_6
  from './features2_6.nl';
  import dailyQuestLevel
  from './dailyQuestLevel.nl';
  import retentionFeatures
  from './retentionFeatures.nl';
  import palmReading
  from './palmReading.nl';
  import palmReadingV2Lite
  from './palmReadingV2Lite.nl';
const nl = {
  common: {
    cancel: "Annuleren",
    ok: "OK",
    delete: "Verwijderen",
    reset: "Resetten",
    loading: "Laden...",
    more: "Meer",
    save: "Opslaan",
    close: "Sluiten",
  },
  tabs: {
    home: "Home",
    horoscope: "Horoscoop",
    tarot: "Tarot",
    profile: "Profiel",
    more: "Meer",
  },
  settings: {
    title: "Instellingen",
    notifications: "Meldingen",
    notificationsDescription: "Beheer dagelijkse horoscoop- en maanherinneringen.",
    language: "Taal",
    languageDescription: "Kies de taal die de app gebruikt.",
    chooseLanguage: "Taal kiezen",
    privacy: "Privacy",
    privacyDescription: "Je dagboek en readings worden op dit apparaat opgeslagen, tenzij je ze exporteert of synchroniseert.",
    information: "Informatie",
    version: "Luna Oracle versie 1.0.0",
  },
} as const;

const __localeBase = {
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
