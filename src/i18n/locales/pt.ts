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
  import lunaForecast
  from './lunaForecast.pt';
  import lunaTarotAnimation
  from './lunaTarotAnimation.pt';
  import lunaShare
  from './lunaShare.pt';
  import engagementPack
  from './engagementPack.pt';
  import moonDust
  from './moonDust.pt';
  import features2_6
  from './features2_6.pt';
  import dailyQuestLevel
  from './dailyQuestLevel.pt';
  import retentionFeatures
  from './retentionFeatures.pt';
  import palmReading
  from './palmReading.pt';
  import palmReadingV2Lite
  from './palmReadingV2Lite.pt';
const pt = {
  common: {
    cancel: "Cancelar",
    ok: "OK",
    delete: "Excluir",
    reset: "Redefinir",
    loading: "Carregando...",
    more: "Mais",
    save: "Salvar",
    close: "Fechar",
  },
  tabs: {
    home: "Início",
    horoscope: "Horóscopo",
    tarot: "Tarot",
    profile: "Perfil",
    more: "Mais",
  },
  settings: {
    title: "Configurações",
    notifications: "Notificações",
    notificationsDescription: "Gerencie lembretes diários de horóscopo e da lua.",
    language: "Idioma",
    languageDescription: "Escolha o idioma usado pelo app.",
    chooseLanguage: "Escolher idioma",
    privacy: "Privacidade",
    privacyDescription: "Seu diário e suas leituras ficam armazenados neste dispositivo, a menos que você os exporte ou sincronize.",
    information: "Informações",
    version: "Luna Oracle versão 1.0.0",
  },
} as const;

const __localeBase = {
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
