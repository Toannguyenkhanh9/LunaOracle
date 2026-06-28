import westernFeatures
  from './westernFeatures.es';
import lunaFeatures
  from './lunaFeatures.es';
import lunaDynamic
  from './lunaDynamic.es';
  import lunaCompatibility
  from './lunaCompatibility.es';
  import lunaBirthChart
  from './lunaBirthChart.es';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.es';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.es';
  import lunaBirthProfiles
  from './lunaBirthProfiles.es';
    import lunaDailyInsight
  from './lunaDailyInsight.es';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.es';
  import lunaDailyRitual
  from './lunaDailyRitual.es';
  import lunaAchievements
  from './lunaAchievements.es';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.es';
  import lunaForecast
  from './lunaForecast.es';
  import lunaTarotAnimation
  from './lunaTarotAnimation.es';
  import lunaShare
  from './lunaShare.es';
  import engagementPack
  from './engagementPack.es';
  import moonDust
  from './moonDust.es';
  import features2_6
  from './features2_6.es';
  import dailyQuestLevel
  from './dailyQuestLevel.es';
  import retentionFeatures
  from './retentionFeatures.es';
  import palmReading
  from './palmReading.es';
  import palmReadingV2Lite
  from './palmReadingV2Lite.es';
const es = {
  common: {
    cancel: "Cancelar",
    ok: "Aceptar",
    delete: "Eliminar",
    reset: "Restablecer",
    loading: "Cargando...",
    more: "Más",
    save: "Guardar",
    close: "Cerrar",
  },
  tabs: {
    home: "Inicio",
    horoscope: "Horóscopo",
    tarot: "Tarot",
    profile: "Perfil",
    more: "Más",
  },
  settings: {
    title: "Ajustes",
    notifications: "Notificaciones",
    notificationsDescription: "Gestiona los recordatorios diarios del horóscopo y de la luna.",
    language: "Idioma",
    languageDescription: "Elige el idioma usado por la app.",
    chooseLanguage: "Elegir idioma",
    privacy: "Privacidad",
    privacyDescription: "Tu diario y tus lecturas se guardan en este dispositivo, salvo que las exportes o sincronices.",
    information: "Información",
    version: "Luna Oracle versión 1.0.0",
  },
} as const;

const __localeBase = {
  ...es,
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
