import westernFeatures
  from './westernFeatures.ja';
import lunaFeatures
  from './lunaFeatures.ja';
import lunaDynamic
  from './lunaDynamic.ja';
  import lunaCompatibility
  from './lunaCompatibility.ja';
  import lunaBirthChart
  from './lunaBirthChart.ja';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.ja';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.ja';
import lunaBirthProfiles
  from './lunaBirthProfiles.ja';
    import lunaDailyInsight
  from './lunaDailyInsight.ja';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.ja';
  import lunaDailyRitual
  from './lunaDailyRitual.ja';
  import lunaAchievements
  from './lunaAchievements.ja';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.ja';
  import lunaForecast
  from './lunaForecast.ja';
  import lunaTarotAnimation
  from './lunaTarotAnimation.ja';
  import lunaShare
  from './lunaShare.ja';
  import engagementPack
  from './engagementPack.ja';
  import moonDust
  from './moonDust.ja';
  import features2_6
  from './features2_6.ja';
  import dailyQuestLevel
  from './dailyQuestLevel.ja';
  import retentionFeatures
  from './retentionFeatures.ja';
  import palmReading
  from './palmReading.ja';
  import palmReadingV2Lite
  from './palmReadingV2Lite.ja';
const ja = {
  common: {
    cancel: "キャンセル",
    ok: "OK",
    delete: "削除",
    reset: "リセット",
    loading: "読み込み中...",
    more: "その他",
    save: "保存",
    close: "閉じる",
  },
  tabs: {
    home: "ホーム",
    horoscope: "星占い",
    tarot: "タロット",
    profile: "プロフィール",
    more: "その他",
  },
  settings: {
    title: "設定",
    notifications: "通知",
    notificationsDescription: "毎日の星占いと月のリマインダーを管理します。",
    language: "言語",
    languageDescription: "アプリで使用する言語を選択します。",
    chooseLanguage: "言語を選択",
    privacy: "プライバシー",
    privacyDescription: "ジャーナルとリーディングは、エクスポートまたは同期しない限り、このデバイスに保存されます。",
    information: "情報",
    version: "Luna Oracle バージョン 1.0.0",
  },
} as const;

const __localeBase = {
  ...ja,
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
                        ...palmReading,
                        ...retentionFeatures,
                          ...palmReadingV2Lite,
} as const;

export default {
  ...__localeBase,
  palmReading: {
    ...palmReading.palmReading,
    ...palmReadingV2Lite.palmReading,
  },
} as const;
