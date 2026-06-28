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
  import lunaTarotAnimation
  from './lunaTarotAnimation.zh';
  import lunaShare
  from './lunaShare.zh';
  import engagementPack
  from './engagementPack.zh';

  import moonDust
  from './moonDust.zh';
  import features2_6
  from './features2_6.zh';
  import dailyQuestLevel
  from './dailyQuestLevel.zh';
  import retentionFeatures
  from './retentionFeatures.zh';
  import palmReading
  from './palmReading.zh';
  import palmReadingV2Lite
  from './palmReadingV2Lite.zh';
const zh = {
  common: {
    cancel: "取消",
    ok: "确定",
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
    notifications: "通知",
    notificationsDescription: "管理每日星座运势和月亮提醒。",
    language: "语言",
    languageDescription: "选择应用使用的语言。",
    chooseLanguage: "选择语言",
    privacy: "隐私",
    privacyDescription: "你的日记和解读会存储在此设备上，除非你导出或同步它们。",
    information: "信息",
    version: "Luna Oracle 版本 1.0.0",
  },
} as const;

const __localeBase = {
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
