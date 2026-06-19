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
const ja = {
  common: {
    cancel: "キャンセル",
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
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "言語",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "言語を選択",
    privacy: "プライバシー",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "情報",
    version: "Luna Oracle バージョン 1.0.0",
  },
} as const;

export default {
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
} as const;
