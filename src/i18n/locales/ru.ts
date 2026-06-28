import westernFeatures
  from './westernFeatures.ru';
import lunaFeatures
  from './lunaFeatures.ru';
import lunaDynamic
  from './lunaDynamic.ru';
  import lunaCompatibility
  from './lunaCompatibility.ru';
  import lunaBirthChart
  from './lunaBirthChart.ru';
  import lunaBirthProfiles
  from './lunaBirthProfiles.ru';
    import lunaDailyInsight
  from './lunaDailyInsight.ru';
import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.ru';
  import lunaDailyRitual
  from './lunaDailyRitual.ru';
  import lunaAchievements
  from './lunaAchievements.ru';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.ru';
  import lunaForecast
  from './lunaForecast.ru';
  import lunaTarotAnimation
  from './lunaTarotAnimation.ru';
  import lunaShare
  from './lunaShare.ru';
  import engagementPack
  from './engagementPack.ru';
  import moonDust
  from './moonDust.ru';
  import features2_6
  from './features2_6.ru';
  import dailyQuestLevel
  from './dailyQuestLevel.ru';
  import retentionFeatures
  from './retentionFeatures.ru';
  import palmReading
  from './palmReading.ru';
  import palmReadingV2Lite
  from './palmReadingV2Lite.ru';
const ru = {
  common: {
    cancel: "Отмена",
    ok: "OK",
    delete: "Удалить",
    reset: "Сбросить",
    loading: "Загрузка...",
    more: "Еще",
    save: "Сохранить",
    close: "Закрыть",
  },
  tabs: {
    home: "Главная",
    horoscope: "Гороскоп",
    tarot: "Таро",
    profile: "Профиль",
    more: "Еще",
  },
  settings: {
    title: "Настройки",
    notifications: "Уведомления",
    notificationsDescription: "Управляйте ежедневными напоминаниями о гороскопе и Луне.",
    language: "Язык",
    languageDescription: "Выберите язык, используемый в приложении.",
    chooseLanguage: "Выбрать язык",
    privacy: "Конфиденциальность",
    privacyDescription: "Ваш журнал и расклады хранятся на этом устройстве, если вы не экспортируете или не синхронизируете их.",
    information: "Информация",
    version: "Luna Oracle версия 1.0.0",
  },
} as const;

const __localeBase = {
  ...ru,
  ...westernFeatures,
  ...lunaFeatures,
    ...lunaDynamic,
      ...lunaCompatibility,
        ...lunaBirthChart,
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
