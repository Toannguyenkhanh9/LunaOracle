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
const ru = {
  common: {
    cancel: "Отмена",
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
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "Язык",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "Выбрать язык",
    privacy: "Конфиденциальность",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "Информация",
    version: "Luna Oracle версия 1.0.0",
  },
} as const;

export default {
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
} as const;
