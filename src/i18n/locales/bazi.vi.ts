const bazi = {
  title: 'Lá số Bát tự',
  subtitle:
    'Nhập ngày giờ và nơi sinh để lập Tứ trụ, xem ngũ hành, Thập thần, đại vận và luận giải tham khảo.',

  birthInformation: 'Thông tin sinh',
  displayName: 'Tên hiển thị',
  displayNamePlaceholder: 'Có thể để trống',
  solarBirthDate: 'Ngày sinh dương lịch',
  birthTime: 'Giờ sinh địa phương',
  gender: 'Giới tính',

  birthLocation: 'Nơi sinh và múi giờ',
  timeZone: 'Múi giờ IANA',
  placeName: 'Tên nơi sinh',
  placeNamePlaceholder: 'Ví dụ: TP. Hồ Chí Minh',
  longitude: 'Kinh độ',
  latitude: 'Vĩ độ',

  trueSolarTime: 'Hiệu chỉnh giờ mặt trời thật',
  trueSolarTimeDescription:
    'Cần kinh độ chính xác. Nên tắt khi chưa chắc nơi sinh.',

  calculate: 'Lập lá số Bát tự',
  calculating: 'Đang lập lá số...',

  chartResult: 'Kết quả lá số',
  lunarDate: 'Âm lịch',
  leapMonthShort: 'nhuận',
  dayMaster: 'Nhật chủ',
  strength: 'Thân vượng/suy',
  favorableElements: 'Ngũ hành thuận lợi',
  correctedTime: 'Giờ sau hiệu chỉnh',
  totalCorrection: 'Tổng hiệu chỉnh',

  fourPillars: 'Tứ trụ',
  fiveElements: 'Phân bố ngũ hành',
  usefulElements: 'Dụng thần và cân bằng',
  interpretation: 'Luận giải',
  luckPillars: 'Đại vận',

  noticeTitle: 'Lưu ý',
  notice:
    'Kết quả mang tính tham khảo văn hóa và chiêm nghiệm. Không phải dự đoán chắc chắn, tư vấn y tế hoặc tư vấn tài chính.',

  units: {
    minutes: 'phút',
  },

  genders: {
    male: 'Nam',
    female: 'Nữ',
    unspecified: 'Không chọn',
  },

  pillars: {
    year: 'Năm',
    month: 'Tháng',
    day: 'Ngày',
    hour: 'Giờ',
  },

  elements: {
    wood: 'Mộc',
    fire: 'Hỏa',
    earth: 'Thổ',
    metal: 'Kim',
    water: 'Thủy',
  },

  strengthLevels: {
    veryWeak: 'Rất nhược',
    weak: 'Thân nhược',
    balanced: 'Cân bằng',
    strong: 'Thân vượng',
    veryStrong: 'Rất vượng',
  },

  tenGods: {
    dayMaster: 'Nhật chủ',
    mixed: 'Hỗn hợp',
    friend: 'Tỷ Kiên',
    robWealth: 'Kiếp Tài',
    eatingGod: 'Thực Thần',
    hurtingOfficer: 'Thương Quan',
    indirectWealth: 'Thiên Tài',
    directWealth: 'Chính Tài',
    sevenKillings: 'Thất Sát',
    directOfficer: 'Chính Quan',
    indirectResource: 'Thiên Ấn',
    directResource: 'Chính Ấn',
  },

  analysis: {
    favorable: 'Thuận lợi',
    supportive: 'Hỗ trợ',
    unfavorable: 'Bất lợi',
    climateBalancing: 'Cân bằng khí hậu',
  },

  common: {
    strengths: 'Điểm mạnh',
    pointsToConsider: 'Điểm cần lưu ý',
    advice: 'Gợi ý',
  },

  interpretationSections: {
    character: 'Tính cách',
    love: 'Tình duyên',
    career: 'Sự nghiệp',
    wealth: 'Tài vận',
    wellbeing: 'Cân bằng lối sống',
  },

  errors: {
    title: 'Thông tin chưa hợp lệ',
    invalidDate: 'Ngày sinh không hợp lệ.',
    invalidTime: 'Giờ sinh phải từ 00:00 đến 23:59.',
    invalidTimeZone:
      'Múi giờ không hợp lệ. Ví dụ: Asia/Ho_Chi_Minh.',
    longitudeRequired:
      'Cần nhập kinh độ khi bật giờ mặt trời thật.',
    invalidCoordinate: 'Kinh độ hoặc vĩ độ không hợp lệ.',
    calculateFailed:
      'Không thể lập lá số. Hãy kiểm tra lại thông tin.',
  },

  stage2: {
    title: 'Phân tích chuyên sâu',
    subtitle:
      'Thân vượng/suy, cách cục, dụng thần, quan hệ can chi và ba lĩnh vực chính.',

    strengthAndStructure: 'Thân vượng/suy và cách cục',
    strengthScore: 'Điểm thân',
    primaryStructure: 'Cách cục chính',
    purity: 'Độ thuần',
    stability: 'Độ ổn định',
    supportDrainBalance: 'Cân bằng hỗ trợ/tiết hao',
    monthCommand: 'Lệnh tháng',
    roots: 'Căn khí',
    structureExposed: 'Cách cục có lộ',
    structureHidden: 'Cách cục ẩn',

    detailedUsefulElements: 'Hỷ dụng thần chi tiết',
    yongShen: 'Dụng thần',
    xiShen: 'Hỷ thần',
    jiShen: 'Kỵ thần',
    chouShen: 'Cừu thần',
    seasonalClimate: 'Khí hậu mùa sinh',
    confidence: 'Độ tin cậy',

    relationsTitle: 'Hợp, xung, hình, hại',
    spousePalace: 'Cung phối ngẫu',
    careerPillar: 'Trụ sự nghiệp',
    family: 'Gia đình',

    favorableFactors: 'Yếu tố thuận',
    pointsToConsider: 'Điểm cần lưu ý',
    suggestions: 'Gợi ý phát triển',

    domains: {
      love: 'Tình duyên chuyên sâu',
      career: 'Sự nghiệp chuyên sâu',
      wealth: 'Tài vận chuyên sâu',
    },

    levels: {
      low: 'Cần xây nền',
      developing: 'Đang phát triển',
      balanced: 'Cân bằng',
      favorable: 'Khá thuận',
      strong: 'Nổi bật',
    },

    tones: {
      supportive: 'Hỗ trợ',
      mixed: 'Trung tính',
      challenging: 'Thách thức',
    },

    relationTypes: {
      stemCombination: 'Thiên can hợp',
      stemClash: 'Thiên can xung',
      sixHarmony: 'Lục hợp',
      sixClash: 'Lục xung',
      harm: 'Tương hại',
      break: 'Tương phá',
      punishment: 'Tương hình',
      selfPunishment: 'Tự hình',
      threeHarmony: 'Tam hợp',
      threeMeeting: 'Tam hội',
    },

    strategies: {
      supportWeak: 'Phù trợ thân nhược',
      drainStrong: 'Tiết chế thân vượng',
      balanceDistribution: 'Cân bằng phân bố',
      followStrongCandidate: 'Ứng viên tòng vượng',
      followWeakCandidate: 'Ứng viên tòng nhược',
    },

    climates: {
      cold: 'Hàn',
      hot: 'Nhiệt',
      dry: 'Khô',
      damp: 'Ẩm',
      balanced: 'Cân bằng',
    },

    patterns: {
      ordinary: 'Mệnh cục thông thường',
      followStrongCandidate: 'Ứng viên tòng vượng',
      followWeakCandidate: 'Ứng viên tòng nhược',
    },

    notice:
      'Giai đoạn 2 dùng mô hình cấu trúc minh bạch và có thể kiểm thử. Dụng thần, cách cục và luận giải vẫn cần được xem là tham khảo truyền thống, không phải dự đoán chắc chắn.',
  },
  stage3: {
    diagnosticsTitle: 'Độ tin cậy kỹ thuật',
    diagnosticsSubtitle:
      'Đánh giá chất lượng dữ liệu đầu vào và độ ổn định của phép tính.',
    timeConfidence: 'Ngày giờ và múi giờ',
    pillarConfidence: 'Tứ trụ',
    luckConfidence: 'Đại vận',
    interpretationConfidence: 'Luận giải',

    saveChart: 'Lưu lá số',
    updateSaved: 'Cập nhật lá số đã lưu',
    saving: 'Đang lưu...',
    savedTitle: 'Đã lưu lá số',
    savedMessage: 'Lá số đã được lưu trên thiết bị.',
    saveErrorTitle: 'Không thể lưu',
    saveErrorMessage: 'Đã xảy ra lỗi khi lưu lá số.',

    historyTitle: 'Lá số đã lưu',
    historySubtitle:
      'Xem lại, chia sẻ hoặc tính lại bằng phiên bản engine mới.',
    searchPlaceholder: 'Tìm theo tên hoặc nơi sinh...',
    emptyHistoryTitle: 'Chưa có lá số',
    emptyHistoryMessage:
      'Lập một lá số rồi nhấn Lưu để xem lại tại đây.',
    open: 'Mở',
    share: 'Chia sẻ',
    recalculate: 'Tính lại',
    duplicate: 'Nhân bản',
    engineVersion: 'Engine',
    deleteTitle: 'Xóa lá số',
    deleteMessage: 'Bạn có chắc muốn xóa lá số này?',
    recalculatedTitle: 'Đã cập nhật',
    recalculatedMessage:
      'Lá số đã được tính lại bằng phiên bản engine hiện tại.',
    recalculateErrorTitle: 'Không thể cập nhật',
    recalculateErrorMessage: 'Hãy kiểm tra lại dữ liệu lá số.',

    diagnosticCodes: {
      DIAGNOSTIC_AMBIGUOUS_LOCAL_TIME:
        'Giờ sinh rơi vào thời điểm lặp do đổi giờ mùa; engine chọn thời điểm UTC sớm hơn.',
      DIAGNOSTIC_NONEXISTENT_LOCAL_TIME:
        'Giờ sinh không tồn tại do chuyển giờ mùa và đã được chuẩn hóa.',
      DIAGNOSTIC_TRUE_SOLAR_LONGITUDE_MISSING:
        'Thiếu kinh độ để hiệu chỉnh giờ mặt trời thật.',
      DIAGNOSTIC_TRUE_SOLAR_CROSSED_DATE:
        'Hiệu chỉnh giờ mặt trời thật làm thay đổi ngày địa phương.',
      DIAGNOSTIC_LARGE_SOLAR_TIME_CORRECTION:
        'Mức hiệu chỉnh giờ mặt trời khá lớn; cần kiểm tra kinh độ và múi giờ.',
      DIAGNOSTIC_BIRTH_NEAR_SOLAR_TERM:
        'Giờ sinh nằm gần ranh giới tiết khí; trụ tháng hoặc trụ năm cần đối chiếu.',
      DIAGNOSTIC_BIRTH_NEAR_DAY_BOUNDARY:
        'Giờ sinh nằm gần ranh giới đổi ngày.',
      DIAGNOSTIC_PROVIDER_DAY_BOUNDARY_LIMITATION:
        'Thư viện lịch không xác nhận đầy đủ quy tắc đổi ngày đã chọn.',
      DIAGNOSTIC_LUCK_DIRECTION_UNDETERMINED:
        'Chưa chọn giới tính nên chưa xác định được chiều đại vận.',
      DIAGNOSTIC_LUCK_START_PROVIDER_FALLBACK:
        'Tuổi khởi vận đang dùng phương án dự phòng do thiếu tiết khí lân cận.',
      DIAGNOSTIC_USEFUL_ELEMENT_LOW_CONFIDENCE:
        'Độ tin cậy của phân tích Dụng thần đang thấp.',
      DIAGNOSTIC_INTERPRETATION_SCORE_SPREAD_HIGH:
        'Các nhóm luận giải có độ chênh điểm lớn.',
      DIAGNOSTIC_TRADITIONAL_REFERENCE_ONLY:
        'Luận giải chỉ mang tính tham khảo văn hóa và chiêm nghiệm.',
    },
  },

  stage4: {
    title: 'Dòng vận và tương hợp',
    subtitle:
      'Xem lưu niên, lưu nguyệt, so sánh hai lá số và chọn ngày theo cấu trúc Bát tự.',
    calculating: 'Đang tính...',
    emptyTitle: 'Chưa có lá số đã lưu',
    emptyMessage:
      'Hãy lập và lưu ít nhất một lá số trước khi dùng các công cụ Giai đoạn 4.',
    primaryChart: 'Lá số chính',
    secondaryChart: 'Lá số thứ hai',
    optionalPartnerChart: 'Lá số người đồng hành (không bắt buộc)',
    noPartner: 'Không dùng lá số thứ hai',

    tabs: {
      timeline: 'Dòng vận',
      compatibility: 'Tương hợp',
      dates: 'Chọn ngày',
    },

    domains: {
      overall: 'Tổng quan',
      love: 'Tình duyên',
      career: 'Sự nghiệp',
      wealth: 'Tài vận',
      wellbeing: 'Cân bằng',
    },

    levels: {
      low: 'Thấp',
      developing: 'Đang phát triển',
      balanced: 'Cân bằng',
      favorable: 'Thuận lợi',
      strong: 'Mạnh',
      challenging: 'Nhiều thử thách',
      cautious: 'Cần thận trọng',
      mixed: 'Đan xen',
    },

    timeline: {
      title: 'Lưu niên và lưu nguyệt',
      subtitle:
        'Xếp hạng từng năm theo đại vận đang hoạt động, ngũ hành và quan hệ với lá số gốc.',
      yearCount: '{{count}} năm',
      calculate: 'Tính dòng vận',
      peakYears: 'Năm nổi bật',
      cautionYears: 'Năm cần lưu ý',
      activeLuck: 'Đại vận đang hoạt động',
      monthLabel: 'Tháng {{count}}',
    },

    compatibility: {
      title: 'So sánh hai lá số',
      subtitle:
        'So sánh cảm xúc, giao tiếp, ổn định, hợp tác và tài chính.',
      calculate: 'Phân tích tương hợp',
      overall: 'Điểm tương hợp tổng thể',
      purposes: {
        general: 'Tổng quát',
        love: 'Tình cảm',
        business: 'Hợp tác',
      },
      domains: {
        emotional: 'Cảm xúc',
        communication: 'Giao tiếp',
        stability: 'Ổn định',
        cooperation: 'Hợp tác',
        finance: 'Tài chính',
      },
      complementingElements: 'Ngũ hành bổ trợ',
      conflictingElements: 'Ngũ hành cần điều hòa',
    },

    dates: {
      title: 'Chọn ngày theo Bát tự',
      subtitle:
        'Tìm ngày có cấu trúc phù hợp với lá số chính và tùy chọn thêm lá số người đồng hành.',
      calculate: 'Tìm ngày phù hợp',
      monthCount: '{{count}} tháng tới',
      activities: {
        wedding: 'Cưới hỏi',
        construction: 'Động thổ / xây nhà',
        opening: 'Khai trương',
        moving: 'Chuyển nhà',
        travel: 'Xuất hành',
        signing: 'Ký kết',
      },
    },

    errors: {
      noPrimaryTitle: 'Chưa chọn lá số',
      noPrimaryMessage: 'Hãy chọn một lá số chính.',
      needTwoChartsTitle: 'Cần hai lá số',
      needTwoChartsMessage:
        'Hãy chọn hai lá số khác nhau để so sánh.',
      sameChartTitle: 'Lá số bị trùng',
      sameChartMessage:
        'Lá số thứ nhất và thứ hai phải khác nhau.',
      calculateTitle: 'Không thể tính',
      calculateMessage:
        'Đã xảy ra lỗi khi thực hiện phân tích Giai đoạn 4.',
    },

    notice:
      'Giai đoạn 4 là mô hình phân tích cấu trúc có thể kiểm thử. Kết quả lưu niên, tương hợp và chọn ngày chỉ dùng để tham khảo văn hóa, không thay thế quyết định thực tế hoặc lịch pháp chuyên gia.',
  },
};

export default bazi;
