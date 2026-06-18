const expertMode = {
  title: 'Chế độ chuyên gia',
  subtitle:
    'Chuyển giữa giao diện dễ hiểu và lớp dữ liệu kỹ thuật dành cho người muốn xem sâu hơn.',
  currentMode: 'Chế độ hiện tại',

  modes: {
    simple: 'Đơn giản',
    expert: 'Chuyên gia',
  },

  bar: {
    eyebrow: 'Mức hiển thị',
    simpleTitle: 'Đang dùng chế độ đơn giản',
    simpleSubtitle:
      'Ưu tiên tóm tắt dễ hiểu và ẩn bớt thuật ngữ kỹ thuật.',
    expertTitle: 'Đang dùng chế độ chuyên gia',
    expertSubtitle:
      'Hiển thị thêm dữ liệu tính toán, mã kỹ thuật và chẩn đoán.',
  },

  chooseEyebrow: 'CHỌN CÁCH HIỂN THỊ',
  chooseTitle: 'Một ứng dụng, hai mức độ',
  chooseSubtitle:
    'Bạn có thể đổi lại bất cứ lúc nào. Dữ liệu lá số và hồ sơ không bị thay đổi.',

  simple: {
    title: 'Chế độ đơn giản',
    subtitle:
      'Phù hợp với người mới hoặc muốn đọc nhanh.',
    items: {
      0: 'Nội dung được tóm tắt và hạn chế thuật ngữ.',
      1: 'Ưu tiên kết luận, điểm chính và gợi ý thực tế.',
      2: 'Ẩn chẩn đoán và mã nội bộ của công cụ tính.',
    },
  },

  expert: {
    title: 'Chế độ chuyên gia',
    subtitle:
      'Phù hợp với người muốn kiểm tra cấu trúc và phương pháp.',
    items: {
      0: 'Hiện thêm Thập thần, sao phụ, tứ hóa, chu kỳ và chẩn đoán.',
      1: 'Có thể xem mã gốc, chỉ số và dữ liệu kỹ thuật.',
      2: 'Hiển thị chi tiết cách mô hình Timeline và Compatibility tạo kết quả.',
    },
  },

  preferencesEyebrow: 'TÙY CHỌN CHUYÊN GIA',
  preferencesTitle: 'Dữ liệu muốn hiển thị',

  preferences: {
    calculationDetails: {
      title: 'Chi tiết tính toán',
      subtitle:
        'Hiện bảng thông tin kỹ thuật, phiên bản mô hình và dữ liệu đầu vào đã chuẩn hóa.',
    },
    rawCodes: {
      title: 'Mã kỹ thuật gốc',
      subtitle:
        'Hiện mã nội bộ, chỉ số can chi và giá trị raw để đối chiếu.',
    },
    diagnostics: {
      title: 'Chẩn đoán và cảnh báo',
      subtitle:
        'Hiện các cảnh báo chất lượng dữ liệu, giờ sinh, ranh giới tiết khí và độ đầy đủ.',
    },
  },

  coverageEyebrow: 'PHẠM VI ÁP DỤNG',
  coverageTitle: 'Chuyên gia thay đổi những gì',

  coverage: {
    bazi:
      'Bát Tự: hiện thêm chẩn đoán, Thập thần, tàng can và các lớp luận giải nâng cao.',
    ziwei:
      'Tử Vi: hiện thêm sao phụ, tứ hóa, vòng Tràng Sinh, đại vận, lưu niên và chẩn đoán.',
    today:
      'Today: hiện chỉ số Can Chi, trạng thái lịch gốc và dữ liệu giờ hoàng đạo.',
    timeline:
      'Timeline: hiện mã quan hệ, chỉ số can chi năm và phiên bản mô hình.',
    compatibility:
      'Compatibility: hiện trọng số từng chiều, mã mô hình và dữ liệu so sánh.',
  },

  noticeTitle: 'Giới hạn của chế độ chuyên gia',
  notice:
    'Nhiều dữ liệu hơn không đồng nghĩa với dự đoán chắc chắn hơn. Các kết quả vẫn là tham khảo văn hóa và tự chiêm nghiệm, không thay thế tư vấn chuyên môn.',

  reset: 'Đặt lại về mặc định',

  home: {
    title: 'Chế độ chuyên gia',
    subtitle:
      'Chuyển giữa bản dễ hiểu và dữ liệu kỹ thuật chuyên sâu.',
  },

  lockedTitle: 'Nội dung nâng cao đang được ẩn',
  lockedMessage:
    'Bật Chế độ chuyên gia để xem phần này.',

  details: {
    eyebrow: 'DỮ LIỆU CHUYÊN GIA',
    title: 'Chi tiết kỹ thuật',
    todayTitle: 'Dữ liệu tính ngày',
    timelineTitle: 'Dữ liệu mô hình Timeline',
    compatibilityTitle: 'Dữ liệu mô hình tương hợp',

    fields: {
      modelVersion: 'Phiên bản mô hình',
      generatedAt: 'Thời điểm tạo',
      dayStemIndex: 'Chỉ số thiên can ngày',
      dayBranchIndex: 'Chỉ số địa chi ngày',
      rawDayCanChi: 'Can Chi ngày gốc',
      rawMonthCanChi: 'Can Chi tháng gốc',
      rawYearCanChi: 'Can Chi năm gốc',
      tianShenLuck: 'Trạng thái thiên thần',
      leapMonth: 'Tháng nhuận',
      profileRelation: 'Quan hệ hồ sơ',
      yearStemIndex: 'Chỉ số thiên can năm',
      yearBranchIndex: 'Chỉ số địa chi năm',
      relationCode: 'Mã quan hệ',
      timelineTone: 'Nhóm điểm Timeline',
      compatibilityMode: 'Loại quan hệ',
      profileAId: 'ID hồ sơ thứ nhất',
      profileBId: 'ID hồ sơ thứ hai',
      calculationMethod: 'Phương pháp tính',
      normalizedTime: 'Thời gian chuẩn hóa',
      timeZone: 'Múi giờ',
      correctionMinutes: 'Phút hiệu chỉnh',
      trueSolarTime: 'Giờ mặt trời thật',
      diagnosticsCount: 'Số cảnh báo',
      mainStarCount: 'Số chính tinh',
      auxiliaryStarCount: 'Số phụ tinh',
      lifePalace: 'Cung Mệnh',
      bodyPalace: 'Cung Thân',
      bureau: 'Ngũ hành cục',
    },

    values: {
      yes: 'Có',
      no: 'Không',
      unavailable: 'Không có dữ liệu',
    },

    notes: {
      today:
        'Các chỉ số bắt đầu từ 0 và dùng cho đối chiếu thuật toán.',
      timeline:
        'Điểm Timeline là mô hình trực quan ổn định theo hồ sơ, không phải đại vận Bát Tự đầy đủ.',
      compatibility:
        'Trọng số thay đổi theo loại quan hệ đã chọn.',
      bazi:
        'Các lớp nâng cao chỉ xuất hiện khi lá số đã được tính.',
      ziwei:
        'Các phần giai đoạn 3–6 được mở trong Chế độ chuyên gia.',
    },
  },
};

export default expertMode;
