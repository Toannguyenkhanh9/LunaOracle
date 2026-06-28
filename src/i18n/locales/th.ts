import westernFeatures
  from './westernFeatures.th';
import lunaFeatures
  from './lunaFeatures.th';
import lunaDynamic
  from './lunaDynamic.th';
  import lunaCompatibility
  from './lunaCompatibility.th';
  import lunaBirthChart
  from './lunaBirthChart.th';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.th';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.th';
  import lunaBirthProfiles
  from './lunaBirthProfiles.th';
    import lunaDailyInsight
  from './lunaDailyInsight.th';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.th';
  import lunaDailyRitual
  from './lunaDailyRitual.th';
  import lunaAchievements
  from './lunaAchievements.th';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.th';
  import lunaForecast
  from './lunaForecast.th';
  import lunaTarotAnimation
  from './lunaTarotAnimation.th';
  import lunaShare
  from './lunaShare.th';
  import engagementPack
  from './engagementPack.th';
  import moonDust
  from './moonDust.th';
  import features2_6
  from './features2_6.th';
  import dailyQuestLevel
  from './dailyQuestLevel.th';
  import retentionFeatures
  from './retentionFeatures.th';
  import palmReading
  from './palmReading.th';
  import palmReadingV2Lite
  from './palmReadingV2Lite.th';
const th = {
  common: {
    cancel: "ยกเลิก",
    ok: "ตกลง",
    delete: "ลบ",
    reset: "รีเซ็ต",
    loading: "กำลังโหลด...",
    more: "เพิ่มเติม",
    save: "บันทึก",
    close: "ปิด",
  },
  tabs: {
    home: "หน้าแรก",
    horoscope: "ดวงชะตา",
    tarot: "ไพ่ทาโรต์",
    profile: "โปรไฟล์",
    more: "เพิ่มเติม",
  },
  settings: {
    title: "การตั้งค่า",
    notifications: "การแจ้งเตือน",
    notificationsDescription: "จัดการการแจ้งเตือนดวงรายวันและการเตือนพระจันทร์",
    language: "ภาษา",
    languageDescription: "เลือกภาษาที่ใช้ในแอป",
    chooseLanguage: "เลือกภาษา",
    privacy: "ความเป็นส่วนตัว",
    privacyDescription: "บันทึกและคำทำนายของคุณจะถูกเก็บไว้บนอุปกรณ์นี้ เว้นแต่คุณจะส่งออกหรือซิงค์",
    information: "ข้อมูล",
    version: "Luna Oracle เวอร์ชัน 1.0.0",
  },
} as const;

const __localeBase = {
  ...th,
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
