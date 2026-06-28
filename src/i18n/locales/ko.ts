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
  import lunaForecast
  from './lunaForecast.ko';
  import lunaTarotAnimation
  from './lunaTarotAnimation.ko';
  import lunaShare
  from './lunaShare.ko';
  import engagementPack
  from './engagementPack.ko';
  import moonDust
  from './moonDust.ko';
  import features2_6
  from './features2_6.ko';
  import dailyQuestLevel
  from './dailyQuestLevel.ko';
  import retentionFeatures
  from './retentionFeatures.ko';
  import palmReading
  from './palmReading.ko';
  import palmReadingV2Lite
  from './palmReadingV2Lite.ko';
const ko = {
  common: {
    cancel: "취소",
    ok: "확인",
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
    notifications: "알림",
    notificationsDescription: "일일 운세와 달 알림을 관리합니다.",
    language: "언어",
    languageDescription: "앱에서 사용할 언어를 선택하세요.",
    chooseLanguage: "언어 선택",
    privacy: "개인정보",
    privacyDescription: "내보내거나 동기화하지 않는 한, 저널과 리딩은 이 기기에 저장됩니다.",
    information: "정보",
    version: "Luna Oracle 버전 1.0.0",
  },
} as const;

const __localeBase = {
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
