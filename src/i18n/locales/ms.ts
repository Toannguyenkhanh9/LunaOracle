import westernFeatures
  from './westernFeatures.ms';
import lunaFeatures
  from './lunaFeatures.ms';
import lunaDynamic
  from './lunaDynamic.ms';
  import lunaCompatibility
  from './lunaCompatibility.ms';
  import lunaBirthChart
  from './lunaBirthChart.ms';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.ms';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.ms';
  import lunaBirthProfiles
  from './lunaBirthProfiles.ms';
    import lunaDailyInsight
  from './lunaDailyInsight.ms';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.ms';
  import lunaDailyRitual
  from './lunaDailyRitual.ms';
  import lunaAchievements
  from './lunaAchievements.ms';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.ms';
  import lunaForecast
  from './lunaForecast.ms';
  import lunaTarotAnimation
  from './lunaTarotAnimation.ms';
  import lunaShare
  from './lunaShare.ms';
  import engagementPack
  from './engagementPack.ms';
  import moonDust
  from './moonDust.ms';
  import features2_6
  from './features2_6.ms';
  import dailyQuestLevel
  from './dailyQuestLevel.ms';
  import retentionFeatures
  from './retentionFeatures.ms';
  import palmReading
  from './palmReading.ms';
  import palmReadingV2Lite
  from './palmReadingV2Lite.ms';
const ms = {
  common: {
    cancel: "Batal",
    ok: "OK",
    delete: "Padam",
    reset: "Tetapkan semula",
    loading: "Memuatkan...",
    more: "Lagi",
    save: "Simpan",
    close: "Tutup",
  },
  tabs: {
    home: "Laman utama",
    horoscope: "Horoskop",
    tarot: "Tarot",
    profile: "Profil",
    more: "Lagi",
  },
  settings: {
    title: "Tetapan",
    notifications: "Pemberitahuan",
    notificationsDescription: "Urus peringatan horoskop harian dan bulan.",
    language: "Bahasa",
    languageDescription: "Pilih bahasa yang digunakan oleh aplikasi.",
    chooseLanguage: "Pilih bahasa",
    privacy: "Privasi",
    privacyDescription: "Jurnal dan bacaan anda disimpan pada peranti ini melainkan anda mengeksport atau menyegerakkannya.",
    information: "Maklumat",
    version: "Luna Oracle versi 1.0.0",
  },
} as const;

const __localeBase = {
  ...ms,
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
