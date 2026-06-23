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
const vi = {
  common: {
    cancel: "Hủy",
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
    notifications: "Notifications",
    notificationsDescription: "Manage daily horoscope and moon reminders.",
    language: "Ngôn ngữ",
    languageDescription: "Chọn ngôn ngữ dùng trong ứng dụng.",
    chooseLanguage: "Chọn ngôn ngữ",
    privacy: "Quyền riêng tư",
    privacyDescription: "Your journal and readings are stored on this device unless you export or sync them.",
    information: "Thông tin",
    version: "Luna Oracle phiên bản 1.0.0",
  },
} as const;

export default {
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
} as const;
