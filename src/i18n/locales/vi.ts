import westernFeatures
  from './westernFeatures.vi';
import lunaFeatures
  from './lunaFeatures.vi';
import lunaDynamic
  from './lunaDynamic.vi';
  import lunaCompatibility
  from './lunaCompatibility.vi';
  import lunaBirthChart
  from './lunaBirthChart.vi';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.vi';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.vi';
  import lunaBirthProfiles
  from './lunaBirthProfiles.vi';
    import lunaDailyInsight
  from './lunaDailyInsight.vi';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.vi';
  import lunaDailyRitual
  from './lunaDailyRitual.vi';
  import lunaAchievements
  from './lunaAchievements.vi';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.vi';
  import lunaForecast
  from './lunaForecast.vi';
  import lunaTarotAnimation
  from './lunaTarotAnimation.vi';
  import lunaShare
  from './lunaShare.vi';
  import engagementPack
  from './engagementPack.vi';
  import moonDust
  from './moonDust.vi';
  import features2_6
  from './features2_6.vi';
  import dailyQuestLevel
  from './dailyQuestLevel.vi';
  import retentionFeatures
  from './retentionFeatures.vi';
  import palmReading
  from './palmReading.vi';
  import palmReadingV2Lite
  from './palmReadingV2Lite.vi';
const vi = {
  common: {
    cancel: "Hủy",
    ok: "Đồng ý",
    delete: "Xóa",
    reset: "Đặt lại",
    loading: "Đang tải...",
    more: "Thêm",
    save: "Lưu",
    close: "Đóng",
  },
  tabs: {
    home: "Trang chủ",
    horoscope: "Tử vi",
    tarot: "Tarot",
    profile: "Hồ sơ",
    more: "Thêm",
  },
  settings: {
    title: "Cài đặt",
    notifications: "Thông báo",
    notificationsDescription: "Quản lý thông báo tử vi hằng ngày và nhắc nhở Mặt Trăng.",
    language: "Ngôn ngữ",
    languageDescription: "Chọn ngôn ngữ dùng trong ứng dụng.",
    chooseLanguage: "Chọn ngôn ngữ",
    privacy: "Quyền riêng tư",
    privacyDescription: "Nhật ký và các bài luận giải của bạn được lưu trên thiết bị này, trừ khi bạn xuất hoặc đồng bộ chúng.",
    information: "Thông tin",
    version: "Luna Oracle phiên bản 1.0.0",
  },
} as const;

const __localeBase = {
  ...vi,
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
