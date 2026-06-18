import bazi from './bazi.vi';
import ziwei from './ziwei.vi';
import practice, {
  practiceAudio,
  practiceMeditation,
} from './practice.vi';
import {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
} from './spiritualFeatures.vi';
import {
  dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
} from './spiritualFeatures10_13.vi';
import expertMode
  from './expertMode.vi';
import chantCounter
  from './chantCounter.vi';
  import practiceJourney
  from './practiceJourney.vi';
  import astrologyHome
  from './astrologyHome.vi';
  import userProfiles
  from './userProfiles.vi';
  import today
  from './today.vi';
  import insightFeatures
  from './insightFeatures.vi';
  import timelineEvents
  from './timelineEvents.vi';
  import engagementFeatures
  from './engagementFeatures.vi';
  import glossary
  from './glossary.vi';
  import adsFeatures
  from './adsFeatures.vi';
const vi = {
  common: {
    cancel: 'Hủy',
    delete: 'Xóa',
    reset: 'Đặt lại',
    loading: 'Đang tải...',
  },

  tabs: {
    home: 'Trang chủ',
    temple: 'Chính điện',
    meditation: 'Thiền',
    prayer: 'Cầu nguyện',
  },

  home: {
    title: 'iPagoda',

    subtitle:
      'Một không gian yên tĩnh để thiền, cầu nguyện và lắng nghe bản thân.',

    activities: 'Hoạt động',

    templeTitle: 'Chính điện',
    templeSubtitle: 'Thắp nhang và gõ mõ',

    meditationTitle: 'Thiền',
    meditationSubtitle: 'Thiền từ 5 đến 15 phút',

    prayerTitle: 'Cầu nguyện',
    prayerSubtitle: 'Lưu lời nguyện riêng tư',

    audioTitle: 'Âm thanh',
    audioSubtitle: 'Nghe tiếng mõ và chuông chùa',

    settingsTitle: 'Cài đặt',
    settingsSubtitle: 'Ngôn ngữ và thông tin ứng dụng',

    dailyTitle: 'Lời nhắc hôm nay',

    dailyText:
      'Hãy dành một vài phút để hít thở chậm, buông bỏ lo âu và nghĩ về một điều khiến bạn biết ơn.',
    lunarCalendarTitle: 'Lịch âm',
    lunarCalendarSubtitle: 'Xem mùng một và ngày rằm',
    spiritualAudioTitle: 'Kinh và nhạc thiền',

    spiritualAudioSubtitle: 'Nghe bài kinh, nhạc thiền và âm thanh thiên nhiên',
    welcome: 'Bình an mỗi ngày',

    peacefulSpace: 'Không gian tĩnh tâm',

    heroTitle: 'Trở về với sự an yên',

    enterTemple: 'Vào chính điện',

    discover: 'Khám phá',

    footerQuote: 'Tâm tĩnh thì mọi nơi đều là chốn bình an.',
    fortuneStickTitle: 'Xin xăm',

    fortuneStickSubtitle: 'Xin một quẻ để chiêm nghiệm và tĩnh tâm',
    horoscopeTitle: 'Tử vi và ngày tốt',

    horoscopeSubtitle: 'Xem ngày âm, con giáp và ngày phù hợp',
     baziTitle: 'Lá số Bát tự',

  baziSubtitle:
    'Tứ trụ, ngũ hành, đại vận và luận giải',
    baziHistoryTitle:
  'Lá số đã lưu',

baziHistorySubtitle:
  'Xem lại và quản lý các lá số Bát tự',
  baziStage4Title:
  'Dòng vận và tương hợp',

baziStage4Subtitle:
  'Lưu niên, lưu nguyệt, so lá số và chọn ngày',
  organizedActivitiesTitle: 'Không gian dành cho bạn',
practiceSectionEyebrow: 'THỰC HÀNH',
practiceSectionTitle: 'Tu tập',
practiceSectionSubtitle:
  'Các hoạt động giúp tâm lắng dịu và duy trì thói quen mỗi ngày',
calendarSectionEyebrow: 'THỜI GIAN',
calendarSectionTitle: 'Lịch và nghi lễ',
calendarSectionSubtitle:
  'Theo dõi ngày âm, ngày lễ và những dịp thực hành quan trọng',
reflectionSectionEyebrow: 'CHIÊM NGHIỆM',
reflectionSectionTitle: 'Chiêm nghiệm',
reflectionSectionSubtitle:
  'Nội dung truyền thống để tham khảo văn hóa và tự nhìn lại bản thân',
peaceJournalShortTitle: 'Nhật ký',
peaceJournalShortSubtitle:
  'Ghi lại cảm xúc, lòng biết ơn và điều muốn buông bỏ',
newMoonFullMoonTitle: 'Mùng một – ngày rằm',
newMoonFullMoonSubtitle:
  'Theo dõi ngày sóc, ngày vọng và chuẩn bị nghi lễ',
buddhistFestivalTitle: 'Ngày lễ Phật giáo',
buddhistFestivalSubtitle:
  'Xem Phật Đản, Vu Lan và các ngày vía phổ biến',
practiceReminderTitle: 'Nhắc thực hành',
practiceReminderSubtitle:
  'Chọn giờ nhắc thiền, tụng kinh và nghi thức hằng ngày',
chooseDateTitle: 'Xem ngày',
chooseDateSubtitle:
  'Tham khảo ngày phù hợp cho cưới hỏi, khai trương và việc lớn',
  ziweiTitle: 'Tử vi Đẩu số',
  ziweiSubtitle: 'Nhập ngày giờ và nơi sinh để lập 12 cung, an 14 chính tinh, 21 phụ tinh, Tứ Hóa, Tuần-Triệt và vòng Tràng Sinh.',
  },

  temple: {
    title: 'Chính điện',

    description:
      'Giữ tâm thanh tịnh và thực hiện từng hoạt động một cách chậm rãi.',

    motto: 'An nhiên trong từng hơi thở',

    noIncense: 'Chưa có nhang được thắp',

    lightIncense: 'Thắp nhang',

    incenseCount: 'Đã thắp: {{count}} nén nhang',

    woodenFish: 'Gõ mõ',

    woodenFishCount: '{{count}}/108',

    bell: 'Đánh chuông',

    bellCount: '{{count}} lần',

    completedTitle: 'Bạn đã hoàn thành 108 lần',

    completedText: 'Hãy dành một phút để ngồi yên và cảm nhận hơi thở.',

    resetCounter: 'Đặt lại bộ đếm gõ mõ',

    resetDialogTitle: 'Đặt lại bộ đếm',

    resetDialogMessage: 'Bạn muốn đưa số lần gõ mõ về 0?',
    longPressHint: 'Chạm để phát một lần • Nhấn giữ để phát liên tục',

    playingContinuously: 'Đang phát liên tục',

    tapToStop: 'Chạm để tắt',
    lightIncenseShort: 'Thắp nhang',

    incenseShortCount: '{{count}} nén',
    incenseStatsTitle: 'Số nén nhang',
  },

meditation: {
  // Tiêu đề màn hình
  title: 'Thiền',
  screenTitle: 'Thiền',

  // Mô tả màn hình
  subtitle:
    'Ngồi thoải mái, thả lỏng vai và chú ý vào từng hơi thở.',

  breathingTitle: 'Thiền thở',

  chooseDuration: 'Chọn thời gian',

  // Dùng tại các nút chọn 5, 10, 20, 30 phút
  minutes: '{{count}} phút',
  minuteUnit: 'phút',
  heroMinutes: '{{count}} phút',

  start: 'Bắt đầu thiền',
  pause: 'Tạm dừng thiền',
  restart: 'Thiền lại',

  ready: 'Sẵn sàng',
  paused: 'Đã tạm dừng',
  running: 'Đang thiền',

  resetTime: 'Đặt lại thời gian',

  completedTitle: 'Hoàn thành buổi thiền',

  completedMessage:
    'Hãy hít thở chậm và cảm nhận trạng thái của bạn.',

  breathTitle: 'Hướng dẫn thở',

  inhale: 'Hít vào chậm trong 4 giây',

  hold: 'Giữ hơi trong 2 giây',

  exhale: 'Thở ra chậm trong 6 giây',
},
  prayer: {
    title: 'Nhật ký cầu nguyện',

    subtitle:
      'Nội dung được lưu trên thiết bị và không tự động gửi lên máy chủ.',

    placeholder: 'Viết điều bạn đang cầu nguyện hoặc biết ơn...',

    save: 'Lưu lời cầu nguyện',

    savedItems: 'Nội dung đã lưu',

    empty: 'Bạn chưa lưu lời cầu nguyện nào.',

    requiredTitle: 'Chưa có nội dung',

    requiredMessage: 'Hãy nhập lời cầu nguyện của bạn.',

    savedTitle: 'Đã lưu',

    savedMessage: 'Lời cầu nguyện được lưu riêng trên thiết bị.',

    saveErrorTitle: 'Không thể lưu',

    saveErrorMessage: 'Đã xảy ra lỗi khi lưu lời cầu nguyện.',

    deleteDialogTitle: 'Xóa lời cầu nguyện',

    deleteDialogMessage: 'Bạn có chắc muốn xóa nội dung này?',
    writeTitle: 'Viết lời cầu nguyện',

    writeHint: 'Nội dung được lưu riêng tư trên thiết bị của bạn.',

    privateLabel: 'Riêng tư',

    savedCount: '{{count}} nội dung đã lưu',

    emptyTitle: 'Chưa có lời cầu nguyện',

    savedPrivately: 'Được lưu riêng tư',
  },

  audio: {
    title: 'Âm thanh chùa',

    subtitle: 'Nghe thử các âm thanh dùng trong chính điện.',

    woodenFishTitle: 'Tiếng gõ mõ',

    playWoodenFish: 'Phát tiếng gõ mõ',

    bellTitle: 'Tiếng chuông chùa',

    playBell: 'Phát tiếng chuông',

    tapOrHoldHint: 'Chạm để phát một lần • Nhấn giữ để phát liên tục',

    playingContinuously: 'Đang phát liên tục',

    tapToStop: 'Chạm để tắt',
  },
  settings: {
    title: 'Cài đặt',

    notifications: 'Thông báo',

    notificationsDescription:
      'Chức năng nhắc thiền và nhắc ngày rằm sẽ được bổ sung sau.',

    language: 'Ngôn ngữ',

    languageDescription: 'Chọn ngôn ngữ sử dụng trong ứng dụng.',

    chooseLanguage: 'Chọn ngôn ngữ',

    privacy: 'Quyền riêng tư',

    privacyDescription: 'Nhật ký cầu nguyện hiện chỉ được lưu trên thiết bị.',

    information: 'Thông tin',

    version: 'Chùa Online phiên bản 0.0.1',
  },
  lunarCalendar: {
    title: 'Lịch âm',

    subtitle: 'Xem ngày âm, mùng một và ngày rằm.',

    today: 'Hôm nay',

    firstDay: 'Mùng một',

    fullMoon: 'Ngày rằm',

    solarDate: 'Dương lịch',

    lunarDate: 'Âm lịch',

    lunarMonth: 'Tháng {{month}}',

    leapMonth: 'nhuận',

    firstDayTitle: 'Hôm nay là mùng một',

    fullMoonTitle: 'Hôm nay là ngày rằm',

    observanceMessage:
      'Hãy dành một chút thời gian để tĩnh tâm, thiền hoặc tụng kinh.',
  },
  lunarNotifications: {
    channelName: 'Nhắc lịch âm',

    channelDescription: 'Thông báo nhắc ngày mùng một và ngày rằm.',

    settingTitle: 'Nhắc mùng một và ngày rằm',

    settingDescription: 'Nhận thông báo vào ngày mùng một và ngày 15 âm lịch.',

    reminderTime: 'Giờ nhắc',

    settingNote:
      'Ứng dụng sẽ tạo lịch nhắc cho khoảng 12 tháng tiếp theo và tự làm mới khi mở ứng dụng.',

    firstDayTitle: 'Hôm nay là mùng một',

    fullMoonTitle: 'Hôm nay là ngày rằm',

    reminderBody:
      'Hãy dành vài phút để tĩnh tâm, thiền, cầu nguyện hoặc nghe một bài kinh.',

    permissionTitle: 'Thông báo đang bị tắt',

    permissionMessage:
      'Hãy cho phép ứng dụng gửi thông báo trong phần cài đặt của thiết bị.',

    enabledTitle: 'Đã bật nhắc lịch âm',

    enabledMessage: 'Đã tạo {{count}} thông báo, thời gian nhắc lúc {{time}}.',

    errorTitle: 'Không thể tạo thông báo',

    errorMessage: 'Đã xảy ra lỗi khi tạo lịch nhắc mùng một và ngày rằm.',
  },
  spiritualAudio: {
    title: 'Kinh và nhạc thiền',

    subtitle: 'Lắng nghe những âm thanh nhẹ nhàng để thư giãn và tĩnh tâm.',

    searchPlaceholder: 'Tìm bài nghe...',

    playing: 'Đang phát',

    paused: 'Đã tạm dừng',

    empty: 'Không tìm thấy bài nghe phù hợp.',

    categories: {
      sutra: 'Bài kinh',
      meditation: 'Nhạc thiền',
      nature: 'Thiên nhiên',
    },

    tracks: {
      greatCompassion: {
        title: 'Chú Đại Bi',

        description: 'Bản tụng Chú Đại Bi giúp tĩnh tâm và thư giãn.',
      },

      heartSutra: {
        title: 'Bát Nhã Tâm Kinh',

        description: 'Bản tụng Bát Nhã Tâm Kinh nhẹ nhàng và trang nghiêm.',
      },

      buddhaName: {
        title: 'Niệm Phật',

        description: 'Âm thanh niệm Phật giúp giữ tâm thanh tịnh.',
      },

      breathing: {
        title: 'Thiền theo hơi thở',

        description: 'Hướng dẫn chú ý vào hơi thở và thư giãn cơ thể.',
      },

      deepRelaxation: {
        title: 'Thiền thư giãn sâu',

        description: 'Âm thanh nhẹ nhàng dành cho nghỉ ngơi và ngủ ngon.',
      },

      singingBowl: {
        title: 'Chuông xoay thiền định',

        description: 'Âm thanh chuông xoay giúp tập trung và làm dịu tâm trí.',
      },

      templeRain: {
        title: 'Mưa trong sân chùa',

        description: 'Tiếng mưa nhẹ trong không gian chùa yên tĩnh.',
      },

      forestBirds: {
        title: 'Chim hót trong rừng',

        description: 'Âm thanh thiên nhiên với tiếng chim và lá cây.',
      },

      flowingStream: {
        title: 'Dòng suối nhẹ',

        description: 'Tiếng nước chảy nhẹ nhàng giúp thư giãn và dễ ngủ.',
      },
    },
  },
  dailyPracticeNotifications: {
    channelName: 'Nhắc thực hành hằng ngày',

    channelDescription: 'Thông báo nhắc thiền và tụng kinh mỗi ngày.',

    settingTitle: 'Nhắc thiền hoặc tụng kinh',

    settingDescription: 'Nhận thông báo vào thời gian bạn chọn mỗi ngày.',

    practiceType: 'Nội dung nhắc',

    typeMeditation: 'Thiền',

    typeSutra: 'Tụng kinh',

    typeBoth: 'Cả hai',

    reminderTime: 'Giờ nhắc',

    previewLabel: 'Xem trước thông báo',

    settingNote: 'Thông báo sẽ tự lặp lại mỗi ngày theo giờ đã chọn.',

    meditationTitle: 'Đã đến giờ thiền',

    meditationBody: 'Hãy dành vài phút để hít thở chậm và tĩnh tâm.',

    sutraTitle: 'Đã đến giờ tụng kinh',

    sutraBody: 'Hãy dành vài phút để tụng hoặc lắng nghe một bài kinh.',

    bothTitle: 'Đã đến giờ thực hành',

    bothBody: 'Bạn có thể thiền hoặc nghe một bài kinh để tìm lại sự bình an.',

    permissionTitle: 'Thông báo đang bị tắt',

    permissionMessage:
      'Hãy cho phép ứng dụng gửi thông báo trong phần cài đặt thiết bị.',

    enabledTitle: 'Đã bật nhắc hằng ngày',

    enabledMessage: 'Ứng dụng sẽ nhắc bạn mỗi ngày lúc {{time}}.',

    errorTitle: 'Không thể tạo thông báo',

    errorMessage: 'Đã xảy ra lỗi khi tạo thông báo nhắc hằng ngày.',
  },
  fortuneStick: {
    title: 'Xin xăm',

    subtitle:
      'Giữ tâm bình an, nghĩ về điều bạn đang quan tâm và xin một quẻ để chiêm nghiệm.',

    intentionLabel: 'Điều bạn đang cầu nguyện',

    intentionPlaceholder: 'Có thể để trống hoặc viết điều bạn đang quan tâm...',

    drawing: 'Đang xin quẻ...',

    drawHint: 'Thành tâm, hít thở chậm và nhấn nút bên dưới.',

    drawingButton: 'Đang gieo quẻ',

    drawButton: 'Xin một quẻ xăm',

    stickNumber: 'Quẻ số',

    interpretationTitle: 'Luận giải',

    adviceTitle: 'Lời khuyên',

    drawAgain: 'Xin quẻ khác',

    save: 'Lưu quẻ',

    saving: 'Đang lưu...',

    savedTitle: 'Đã lưu quẻ xăm',

    savedMessage: 'Quẻ xăm đã được lưu trên thiết bị.',

    saveErrorTitle: 'Không thể lưu',

    saveErrorMessage: 'Đã xảy ra lỗi khi lưu quẻ xăm.',

    historyTitle: 'Quẻ đã lưu',

    historyCount: '{{count}} quẻ',

    emptyHistory: 'Bạn chưa lưu quẻ xăm nào.',

    deleteTitle: 'Xóa quẻ đã lưu',

    deleteMessage: 'Bạn có chắc muốn xóa quẻ này?',

    disclaimer:
      'Nội dung xin xăm chỉ mang tính tham khảo và chiêm nghiệm cá nhân, không thay thế tư vấn chuyên môn hoặc quyết định thực tế.',

    levels: {
      great: 'Đại cát',
      good: 'Cát',
      neutral: 'Bình',
      caution: 'Cẩn trọng',
    },
  },
  horoscope: {
    title: 'Tử vi và ngày tốt',

  subtitle:
    'Nhập ngày sinh dương lịch để xem ngày âm, con giáp và các ngày được gợi ý cho những việc quan trọng.',

  subtitleExtended:
    'Nhập ngày giờ sinh dương lịch, giới tính và trường phái luận giải để xem hồ sơ âm lịch, các luận giải chiêm nghiệm và ngày phù hợp được gợi ý.',

  birthDateTitle: 'Ngày sinh dương lịch',

  day: 'Ngày',

  month: 'Tháng',

  year: 'Năm',

  birthTimeTitle: 'Giờ sinh',

  hour: 'Giờ',

  minute: 'Phút',

  birthTimeHint: 'Giờ địa phương tại nơi sinh',

  genderTitle: 'Giới tính',

  schoolTitle: 'Trường phái luận giải',

  selectedMethod: 'Phương pháp đang dùng',

  activityTitle: 'Việc cần xem ngày',

  searchPeriod: 'Khoảng thời gian tìm',

  monthCount: '{{count}} tháng',

  calculate: 'Chuyển đổi và tìm ngày phù hợp',

  calculateExtended: 'Lập hồ sơ và tìm ngày phù hợp',

  calculating: 'Đang tính...',

  invalidDateTitle: 'Ngày sinh không hợp lệ',

  invalidInputTitle: 'Thông tin không hợp lệ',

  invalidDateMessage:
    'Vui lòng nhập ngày sinh dương lịch hợp lệ.',

  invalidTimeMessage:
    'Giờ sinh phải nằm trong khoảng từ 00:00 đến 23:59.',

  profileTitle: 'Thông tin ngày giờ sinh',

  lunarBirthDate: 'Ngày sinh âm lịch',

  birthHourBranch: 'Địa chi giờ sinh',

  zodiac: 'Con giáp',

  canChiYear: 'Năm Can Chi',

  profileGender: 'Giới tính',

  profileSchool: 'Trường phái luận giải',

  yearPolarity: 'Âm dương năm sinh',

  cycleDirection: 'Chiều an vòng tham khảo',

  leapMonth: 'tháng nhuận',

  resultsTitle: 'Ngày phù hợp được gợi ý',

  resultsSubtitle:
    'Các ngày được xếp hạng theo điểm tham khảo văn hóa.',

  resultsSubtitleExtended:
    'Các ngày được xếp hạng theo trường phái đã chọn, con giáp và địa chi giờ sinh.',

  lunarDateLine: 'Âm lịch {{day}}/{{month}}/{{year}}',

  suitableReasons: 'Điểm thuận',

  cautionReasons: 'Điểm cần lưu ý',

  lifeOverviewTitle: 'Tình duyên và sự nghiệp',

  lifeOverviewSubtitle:
    'Luận giải chiêm nghiệm dựa trên ngày sinh, giờ sinh và trường phái đã chọn.',

  lifeStrengths: 'Điểm mạnh',

  lifeCautions: 'Điểm cần cân bằng',

  lifeAdvice: 'Gợi ý phát triển',

  disclaimer:
    'Kết quả chỉ nhằm tham khảo văn hóa và tự chiêm nghiệm. Không nên dùng làm cơ sở duy nhất cho cưới hỏi, xây dựng, đầu tư hoặc các quyết định quan trọng khác.',

  disclaimerExtended:
    'Đây là mô hình chiêm nghiệm rút gọn dựa trên lịch âm, con giáp, giờ sinh và bộ trọng số của trường phái đã chọn. Đây không phải lá số Tử vi Đẩu số hay Bát tự hoàn chỉnh và không nên là cơ sở duy nhất cho các quyết định quan trọng.',

  activities: {
    wedding: 'Cưới hỏi',
    construction: 'Xây dựng',
    opening: 'Khai trương',
    moving: 'Chuyển nhà',
    travel: 'Xuất hành',
  },

  genders: {
    male: 'Nam',
    female: 'Nữ',
    unspecified: 'Không xác định',
  },

  schools: {
    folkTitle: 'Dân gian tổng hợp',
    folkDescription:
      'Cân bằng các quy tắc chọn ngày truyền thống, quan hệ con giáp, giờ sinh và phong tục văn hóa phổ biến.',

    baziTitle: 'Tham khảo Bát tự',
    baziDescription:
      'Nhấn mạnh hơn vào con giáp, địa chi giờ sinh và các quan hệ hợp, xung.',

    ziweiTitle: 'Tham khảo Tử vi',
    ziweiDescription:
      'Sử dụng bộ trọng số chiêm nghiệm lấy cảm hứng từ quan niệm thời vận Tử vi và quan hệ giữa thông tin sinh với ngày được chọn.',

    almanacTitle: 'Lịch vạn niên truyền thống',
    almanacDescription:
      'Ưu tiên các quy tắc nên làm, kiêng kỵ, ngày hoàng đạo và những lưu ý âm lịch truyền thống.',
  },

  polarity: {
    yang: 'Dương',
    yin: 'Âm',
  },

  directions: {
    forward: 'Thuận',
    backward: 'Nghịch',
    neutral: 'Chưa xác định',
  },

  schoolNotes: {
    folk:
      'Kết quả sử dụng sự kết hợp cân bằng giữa phong tục dân gian, yếu tố lịch pháp, quan hệ con giáp và tham chiếu giờ sinh.',

    bazi:
      'Kết quả tăng trọng số cho các quan hệ hợp hoặc xung của con giáp và giờ sinh như một mô hình Bát tự rút gọn.',

    ziwei:
      'Kết quả sử dụng bộ trọng số thời vận lấy cảm hứng từ Tử vi ở mức rút gọn, chỉ nhằm tham khảo văn hóa.',

    almanac:
      'Kết quả ưu tiên nhiều nhất cho các quy tắc nên làm, kiêng kỵ và ngày âm trong lịch vạn niên truyền thống.',
  },

  ratings: {
    excellent: 'Rất tốt',
    good: 'Tốt',
    fair: 'Khá',
    caution: 'Cân nhắc',
  },

  lifeRatings: {
    veryStrong: 'Rất mạnh',
    favorable: 'Thuận lợi',
    balanced: 'Cân bằng',
    developing: 'Đang phát triển',
  },

  love: {
    title: 'Tình duyên',

    styles: {
      warm: 'Ấm áp và giàu biểu đạt',
      steady: 'Ổn định và chung thủy',
      independent: 'Độc lập và thẳng thắn',
      sensitive: 'Nhạy cảm và trực giác',
    },

    summaries: {
      warm:
        'Bạn có thể bày tỏ tình cảm cởi mở và coi trọng sự ấm áp, gần gũi cùng sự trân trọng chân thành.',

      steady:
        'Bạn có thể thích niềm tin được xây dựng từ từ, cam kết ổn định và một mối quan hệ được nuôi dưỡng bằng sự quan tâm bền bỉ.',

      independent:
        'Bạn có thể coi trọng sự chân thật, không gian riêng và một mối quan hệ cho phép cả hai giữ được cá tính riêng.',

      sensitive:
        'Bạn có thể nhanh chóng nhận ra những thay đổi cảm xúc và tìm kiếm sự đồng cảm, trấn an cùng thấu hiểu lẫn nhau.',
    },
  },

  career: {
    title: 'Sự nghiệp',

    styles: {
      leadership: 'Thiên về lãnh đạo',
      creative: 'Sáng tạo và biểu đạt',
      analytical: 'Phân tích và có hệ thống',
      supportive: 'Hỗ trợ và hướng đến phục vụ',
      entrepreneurial: 'Khởi nghiệp và linh hoạt',
    },

    summaries: {
      leadership:
        'Bạn có thể làm việc tốt khi nhận trách nhiệm, điều phối mọi người và chuyển định hướng thành hành động rõ ràng.',

      creative:
        'Bạn có thể phát huy trong công việc coi trọng trí tưởng tượng, giao tiếp, thiết kế, kể chuyện hoặc giải quyết vấn đề theo cách mới.',

      analytical:
        'Bạn có thể làm tốt nhất khi công việc cần lập kế hoạch, nghiên cứu, tư duy hệ thống, độ chính xác và quyết định thận trọng.',

      supportive:
        'Bạn có thể đóng góp mạnh trong các vai trò hợp tác, tư vấn, giảng dạy, chăm sóc hoặc phục vụ cộng đồng.',

      entrepreneurial:
        'Bạn có thể bị thu hút bởi sự chủ động, thử nghiệm, dự án độc lập và cơ hội tưởng thưởng khả năng thích nghi.',
    },
  },

  reasons: {
    hoangDao: 'Ngày hoàng đạo theo lịch pháp',

    hacDao: 'Ngày hắc đạo theo lịch pháp',

    traditionalSuitable:
      'Theo truyền thống phù hợp với việc này',

    traditionalAvoid:
      'Theo truyền thống nên tránh việc này',

    zodiacClash:
      'Địa chi ngày xung với con giáp năm sinh',

    sixHarmony: 'Quan hệ lục hợp',

    threeHarmony: 'Quan hệ tam hợp',

    nguyetKy: 'Ngày Nguyệt Kỵ theo dân gian',

    tamNuong: 'Ngày Tam Nương theo dân gian',

    preferredLunarDay:
      'Ngày âm được ưu tiên trong bộ quy tắc tham khảo',

    weekendConvenient: 'Thuận tiện vì rơi vào cuối tuần',

    birthHourClash:
      'Địa chi ngày xung với địa chi giờ sinh',

    birthHourHarmony:
      'Địa chi ngày tạo quan hệ lục hợp với giờ sinh',

    birthHourThreeHarmony:
      'Địa chi ngày tạo quan hệ tam hợp với giờ sinh',

    birthLunarDayResonance:
      'Ngày âm tương ứng với ngày sinh âm lịch',

    school_folk:
      'Được chấm theo phương pháp dân gian tổng hợp',

    school_bazi:
      'Được chấm theo bộ tham khảo Bát tự',

    school_ziwei:
      'Được chấm theo bộ tham khảo Tử vi',

    school_almanac:
      'Được chấm theo bộ lịch vạn niên truyền thống',
  },

  insights: {
    loveHarmony:
      'Con giáp năm sinh và địa chi giờ sinh tạo quan hệ lục hợp.',

    loveThreeHarmony:
      'Con giáp năm sinh và địa chi giờ sinh thuộc cùng một nhóm tam hợp.',

    loveInnerConflict:
      'Con giáp năm sinh và địa chi giờ sinh tạo quan hệ xung, có thể phản ánh sự giằng co nội tâm giữa nhu cầu gần gũi và nhu cầu cá nhân.',

    loveSelfAwareness:
      'Ngày sinh âm lịch cho thấy xu hướng tự quan sát và nhận biết cảm xúc.',

    loveWarmHeart:
      'Bạn có thể thể hiện tình cảm rộng rãi và tạo ra bầu không khí cảm xúc ấm áp.',

    loveExpressive:
      'Bạn thường có khả năng thể hiện sự quan tâm bằng lời nói, hành động và sự chú ý rõ ràng.',

    loveOvergiving:
      'Đôi khi bạn có thể cho đi quá nhiều trước khi kiểm tra xem nhu cầu của mình đã được đáp ứng hay chưa.',

    loveSetBoundaries:
      'Hãy thiết lập ranh giới rõ ràng và tử tế để sự quan tâm luôn cân bằng.',

    loveReceiveCare:
      'Cho phép người khác chăm sóc và hỗ trợ bạn thay vì luôn là người cho đi.',

    loveLoyal:
      'Bạn có thể coi trọng sự chung thủy, đáng tin cậy và cam kết lâu dài.',

    lovePatient:
      'Bạn thường sẵn lòng dành thời gian để một mối quan hệ phát triển.',

    loveReserved:
      'Bạn có thể giữ cảm xúc bên trong cho đến khi chúng trở nên khó giải thích.',

    loveSpeakClearly:
      'Hãy bày tỏ nhu cầu sớm và rõ ràng thay vì mong người khác tự đoán.',

    loveCreateRituals:
      'Tạo những thói quen chung nhỏ để củng cố niềm tin và sự kết nối.',

    loveRespectsSpace:
      'Bạn có thể tôn trọng cá tính riêng và hiểu nhu cầu về không gian cá nhân.',

    loveHonest:
      'Bạn có thể thích giao tiếp trực tiếp và chân thành trong tình cảm.',

    loveNeedsFreedom:
      'Sự hạn chế quá mức có thể khiến bạn thu mình hoặc trở nên xa cách về cảm xúc.',

    loveBalanceFreedom:
      'Cân bằng tính độc lập với sự hiện diện cảm xúc đều đặn.',

    loveSharePlans:
      'Chia sẻ kế hoạch và kỳ vọng để tự do không bị hiểu thành xa cách.',

    loveEmpathetic:
      'Bạn có thể hiểu những thay đổi cảm xúc tinh tế và phản hồi bằng sự đồng cảm.',

    loveIntuitive:
      'Bạn có thể dựa nhiều vào trực giác khi cảm nhận một mối quan hệ.',

    loveOverthinking:
      'Sự nhạy cảm có thể chuyển thành suy nghĩ quá nhiều khi giao tiếp chưa rõ ràng.',

    loveTrustSlowly:
      'Hãy để niềm tin phát triển qua những hành động lặp lại thay vì suy đoán.',

    loveAskDirectly:
      'Khi chưa chắc chắn, hãy hỏi trực tiếp thay vì tự diễn giải sự im lặng.',

    careerPersistent:
      'Bạn có thể tiến bộ nhờ sự bền bỉ và sẵn lòng tiếp tục tiến về phía trước.',

    careerReflective:
      'Bạn có thể học tốt qua việc nhìn lại, suy ngẫm và điều chỉnh cách làm.',

    careerActionOriented:
      'Tính Dương có thể hỗ trợ sự chủ động, hành động rõ ràng và quyết định dứt khoát.',

    careerObservant:
      'Tính Âm có thể hỗ trợ khả năng quan sát, kiên nhẫn, chọn thời điểm và chuẩn bị kỹ.',

    careerLeadership:
      'Bạn có thể cảm thấy thoải mái khi dẫn dắt người khác và đặt ra định hướng rõ ràng.',

    careerResponsibility:
      'Bạn thường nhận trách nhiệm về kết quả và theo đuổi cam kết đến cùng.',

    careerOvercontrol:
      'Kiểm soát quá nhiều có thể hạn chế sự hợp tác hoặc tạo áp lực không cần thiết.',

    careerDelegate:
      'Phân công rõ ràng và cho người khác không gian đóng góp theo cách của họ.',

    careerListenBeforeDeciding:
      'Thu thập nhiều góc nhìn trước khi đưa ra quyết định quan trọng.',

    careerCreative:
      'Bạn có thể tạo ra ý tưởng mới và nhìn thấy những khả năng người khác bỏ qua.',

    careerExpression:
      'Giao tiếp, thiết kế, kể chuyện hoặc trình bày có thể là thế mạnh tự nhiên.',

    careerScattered:
      'Quá nhiều ý tưởng cùng lúc có thể khiến bạn khó hoàn thành việc quan trọng nhất.',

    careerBuildPortfolio:
      'Xây dựng danh mục công việc đã hoàn thành để biến sự sáng tạo thành cơ hội.',

    careerFinishOneThing:
      'Chọn một ưu tiên và hoàn thành trước khi mở rộng sang ý tưởng tiếp theo.',

    careerAnalytical:
      'Bạn có thể có kỹ năng xem xét chi tiết, quy luật và quan hệ nhân quả.',

    careerPlanning:
      'Chuẩn bị có hệ thống có thể giúp bạn giảm rủi ro và tăng tính ổn định.',

    careerPerfectionism:
      'Chờ đợi thông tin hoàn hảo có thể làm chậm những hành động hữu ích.',

    careerSetMilestones:
      'Chia mục tiêu lớn thành các mốc có thể đo lường với thời hạn rõ ràng.',

    careerDecideWithEnoughData:
      'Hành động khi thông tin đã đủ, dù chưa hoàn toàn đầy đủ.',

    careerTeamwork:
      'Bạn có thể củng cố tập thể bằng sự hợp tác, đáng tin cậy và nhận biết cảm xúc.',

    careerService:
      'Bạn có thể tìm thấy ý nghĩa trong công việc giúp đỡ, giảng dạy, hỗ trợ hoặc cải thiện cuộc sống của người khác.',

    careerPeoplePleasing:
      'Cố gắng làm hài lòng tất cả mọi người có thể làm giảm năng lượng và khiến ưu tiên trở nên mờ nhạt.',

    careerProtectEnergy:
      'Đặt giới hạn cho thời gian và sức lao động cảm xúc để đóng góp của bạn được bền vững.',

    careerShowYourContribution:
      'Trình bày kết quả của bạn rõ ràng thay vì cho rằng người khác sẽ tự nhận ra.',

    careerInitiative:
      'Bạn có thể sẵn lòng bắt đầu trước khi mọi điều kiện hoàn toàn chắc chắn.',

    careerAdaptability:
      'Bạn có thể điều chỉnh nhanh khi hoàn cảnh, thị trường hoặc kế hoạch thay đổi.',

    careerRiskTaking:
      'Sự hào hứng với cơ hội có thể dẫn đến chấp nhận rủi ro khi chưa có đủ biện pháp bảo vệ.',

    careerValidateRisk:
      'Kiểm chứng giả định bằng các thử nghiệm nhỏ trước khi đưa ra cam kết lớn.',

    careerKeepCashReserve:
      'Duy trì quỹ dự phòng tài chính khi theo đuổi cơ hội độc lập hoặc có tính bất định.',
  },
  },
  
  bazi,
  ziwei,
    practice,
  practiceAudio,
  practiceMeditation,
    peaceJournal,
  buddhistCalendar,
  altarCustomization,
    dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
  chantCounter,
  practiceJourney,
  astrologyHome,
  userProfiles,
  today,
  insightFeatures,
  expertMode,
  timelineEvents,
  ...engagementFeatures,
    ...glossary,
     ...adsFeatures,
} as const;

export default vi;
