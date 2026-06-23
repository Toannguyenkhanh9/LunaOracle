import westernFeatures
  from './westernFeatures.zh';
import lunaFeatures
  from './lunaFeatures.zh';
import lunaDynamic
  from './lunaDynamic.zh';
  import lunaCompatibility
  from './lunaCompatibility.zh';
  import lunaBirthChart
  from './lunaBirthChart.zh';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.zh';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.zh';
  import lunaBirthProfiles
  from './lunaBirthProfiles.zh';
    import lunaDailyInsight
  from './lunaDailyInsight.zh';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.zh';
  import lunaDailyRitual
  from './lunaDailyRitual.zh';
  import lunaAchievements
  from './lunaAchievements.zh';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.zh';
  import lunaForecast
  from './lunaForecast.zh';
const zh = {
  common: {
    cancel: "取消",
    delete: "删除",
    reset: "重置",
    loading: "加载中...",
    more: "更多",
    save: "保存",
    close: "关闭",
  },
  tabs: {
    home: "首页",
    horoscope: "星座",
    tarot: "塔罗",
    profile: "档案",
    more: "更多",
  },
  settings: {
    title: "设置",
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "语言",
    languageDescription: "Choose the language used by the app.",
    chooseLanguage: "选择语言",
    privacy: "隐私",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "信息",
    version: "Luna Oracle 版本 1.0.0",
  },
} as const;

export default {
  ...zh,
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
} as const;
