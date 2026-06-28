import westernFeatures
  from './westernFeatures.id';
import lunaFeatures
  from './lunaFeatures.id';
import lunaDynamic
  from './lunaDynamic.id';
  import lunaCompatibility
  from './lunaCompatibility.id';
  import lunaBirthChart
  from './lunaBirthChart.id';
  import lunaBirthChartStage3
  from './lunaBirthChartStage3.id';
  import lunaBirthChartStage4
  from './lunaBirthChartStage4.id';
  import lunaBirthProfiles
  from './lunaBirthProfiles.id';
    import lunaDailyInsight
  from './lunaDailyInsight.id';
  import lunaAdvancedFeatures
  from './lunaAdvancedFeatures.id';
  import lunaDailyRitual
  from './lunaDailyRitual.id';
  import lunaAchievements
  from './lunaAchievements.id';
  import lunaJournalLoveOnboarding
  from './lunaJournalLoveOnboarding.id';
  import lunaForecast
  from './lunaForecast.id';
  import lunaTarotAnimation
  from './lunaTarotAnimation.id';
  import lunaShare
  from './lunaShare.id';
  import engagementPack
  from './engagementPack.id';
  import moonDust
  from './moonDust.id';
  import features2_6
  from './features2_6.id';
  import dailyQuestLevel
  from './dailyQuestLevel.id';
  import retentionFeatures
  from './retentionFeatures.id';
  import palmReading
  from './palmReading.id';
  import palmReadingV2Lite
  from './palmReadingV2Lite.id';
const idLocale = {
  common: {
    cancel: "Batal",
    ok: "OK",
    delete: "Hapus",
    reset: "Atur ulang",
    loading: "Memuat...",
    more: "Lainnya",
    save: "Simpan",
    close: "Tutup",
  },
  tabs: {
    home: "Beranda",
    horoscope: "Horoskop",
    tarot: "Tarot",
    profile: "Profil",
    more: "Lainnya",
  },
  settings: {
    title: "Pengaturan",
    notifications: "Notifikasi",
    notificationsDescription: "Kelola pengingat horoskop harian dan bulan.",
    language: "Bahasa",
    languageDescription: "Pilih bahasa yang digunakan aplikasi.",
    chooseLanguage: "Pilih bahasa",
    privacy: "Privasi",
    privacyDescription: "Jurnal dan pembacaan Anda disimpan di perangkat ini kecuali Anda mengekspor atau menyinkronkannya.",
    information: "Informasi",
    version: "Luna Oracle versi 1.0.0",
  },
} as const;

const __localeBase = {
  ...idLocale,
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
