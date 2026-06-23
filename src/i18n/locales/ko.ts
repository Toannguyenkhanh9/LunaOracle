import westernFeatures
  from './westernFeatures.ko';
import lunaFeatures
  from './lunaFeatures.ko';
import lunaDynamic
  from './lunaDynamic.ko';
  import lunaCompatibility
  from './lunaCompatibility.ko';
  import lunaBirthChart
  from './lunaBirthChart.ko';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.ko';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.ko';
  import lunaBirthProfiles
  from './lunaBirthProfiles.ko';
    import lunaDailyInsight
  from './lunaDailyInsight.ko';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.ko';
  import lunaDailyRitual
  from './lunaDailyRitual.ko';
  import lunaAchievements
  from './lunaAchievements.ko';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.ko';
const ko = {
  common: {
    cancel: "취소",
    delete: "삭제",
    reset: "초기화",
    loading: "불러오는 중...",
    more: "더보기",
    save: "저장",
    close: "닫기",
  },
  tabs: {
    home: "홈",
    horoscope: "운세",
    tarot: "타로",
    profile: "프로필",
    more: "더보기",
  },
  settings: {
    title: "설정",
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "언어",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "언어 선택",
    privacy: "개인정보",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "정보",
    version: "Luna Oracle 버전 1.0.0",
  },
} as const;

export default {
  ...ko,
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
} as const;
