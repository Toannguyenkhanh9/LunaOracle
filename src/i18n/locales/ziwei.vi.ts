const ziwei = {
  title: 'Tử vi Đẩu số',
  subtitle:
    'Nhập ngày giờ và nơi sinh để lập 12 cung, an 14 chính tinh, 21 phụ tinh, Tứ Hóa, Tuần-Triệt và vòng Tràng Sinh.',
  stage1: 'Nền tảng lá số',
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
  calculate: 'Lập lá số Tử vi',
  calculating: 'Đang lập lá số...',
  chartResult: 'Kết quả lá số',
  lunarDate: 'Ngày sinh âm lịch',
  leapMonth: 'tháng nhuận',
  yearCanChi: 'Năm Can Chi',
  birthHourBranch: 'Giờ sinh',
  polarityProfile: 'Âm dương nam nữ',
  lifePalace: 'Cung Mệnh',
  bodyPalace: 'Cung Thân',
  bodyResidence: 'Thân cư',
  fiveElementBureau: 'Ngũ hành Cục',
  twelvePalaces: 'Lá số 12 cung',
  palaceList: 'Danh sách 12 cung',
  lifeTag: 'Mệnh',
  bodyTag: 'Thân',
  diagnosticsTitle: 'Lưu ý kỹ thuật',
  notice:
    'Lá số hiện đã có Đại hạn, Tiểu hạn, Lưu niên và luận giải có căn cứ cho 12 cung. Nội dung chỉ mang tính tham khảo văn hóa, không thay thế tư vấn chuyên môn.',
  genders: {male: 'Nam', female: 'Nữ'},
  classifications: {
    yangMale: 'Dương Nam',
    yinMale: 'Âm Nam',
    yangFemale: 'Dương Nữ',
    yinFemale: 'Âm Nữ',
  },
  directions: {forward: 'Đại hạn đi thuận', reverse: 'Đại hạn đi nghịch'},
  stems: {
    jia: 'Giáp', yi: 'Ất', bing: 'Bính', ding: 'Đinh', wu: 'Mậu',
    ji: 'Kỷ', geng: 'Canh', xin: 'Tân', ren: 'Nhâm', gui: 'Quý',
  },
  branches: {
    zi: 'Tý', chou: 'Sửu', yin: 'Dần', mao: 'Mão', chen: 'Thìn', si: 'Tỵ',
    wu: 'Ngọ', wei: 'Mùi', shen: 'Thân', you: 'Dậu', xu: 'Tuất', hai: 'Hợi',
  },
  palaces: {
    life: 'Mệnh', parents: 'Phụ Mẫu', fortune: 'Phúc Đức', property: 'Điền Trạch',
    career: 'Quan Lộc', friends: 'Nô Bộc', travel: 'Thiên Di', health: 'Tật Ách',
    wealth: 'Tài Bạch', children: 'Tử Tức', spouse: 'Phu Thê', siblings: 'Huynh Đệ',
  },
  bureaus: {
    water: 'Thủy {{number}} Cục',
    wood: 'Mộc {{number}} Cục',
    metal: 'Kim {{number}} Cục',
    earth: 'Thổ {{number}} Cục',
    fire: 'Hỏa {{number}} Cục',
  },
  diagnostics: {
    BIRTH_NEAR_HOUR_BOUNDARY:
      'Giờ sinh gần ranh giới giữa hai thời thần; nên kiểm tra lại phút sinh.',
    BIRTH_AT_ZI_HOUR:
      'Sinh vào giờ Tý. Quy tắc đổi ngày cần được giữ nhất quán trong toàn bộ quá trình lập lá số.',
    TIME_ZONE_METADATA_ONLY:
      'Phần nền tảng lá số ghi nhận múi giờ nhưng dùng trực tiếp ngày giờ địa phương đã nhập.',
    LEAP_LUNAR_MONTH:
      'Ngày sinh thuộc tháng nhuận âm lịch; cần giữ cờ tháng nhuận trong toàn bộ quá trình an sao.',
    MAIN_STAR_BRIGHTNESS_NOT_EVALUATED:
      'Phần Hệ thống Chính tinh an vị trí 14 chính tinh; trạng thái miếu, vượng, đắc, bình và hãm được trình bày trong mục Tứ Hóa và các vòng sao.',
    AUXILIARY_STAR_RULESET_VIETNAMESE_V1:
      'Phụ tinh được an theo bộ quy tắc Việt Nam v1 đã khai báo.',
    FIRE_BELL_RULESET_VARIANT:
      'Hỏa Tinh và Linh Tinh có dị bản giữa các trường phái; hãy giữ cùng một bộ quy tắc khi đối chiếu lá số.',
    FOUR_TRANSFORMATIONS_YEAR_STEM_V1:
      'Tứ Hóa được an theo thiên can năm sinh bằng bảng quy tắc Việt Nam v1.',
    VOID_MARKERS_REFERENCE_V1:
      'Tuần và Triệt được tính bằng quy tắc Can Chi và thiên can năm sinh đã khai báo.',
    TRANG_SINH_REFERENCE_V1:
      'Vòng Tràng Sinh được an theo Ngũ hành Cục và chiều đại hạn.',
    MAIN_STAR_BRIGHTNESS_REFERENCE_V1:
      'Độ sáng 14 chính tinh được lấy từ bảng tham chiếu Việt Nam v1 có phiên bản.',
    BRIGHTNESS_TABLE_REQUIRES_EXPERT_REVIEW:
      'Bảng miếu-vượng khác nhau giữa các trường phái; cần chuyên gia đối chiếu trước khi sử dụng chuyên nghiệp.',
    MAJOR_CYCLE_REFERENCE_V1:
      'Đại hạn dùng quy tắc tham chiếu Việt Nam: khởi từ tuổi bằng số Cục và đi từ cung Mệnh.',
    MINOR_CYCLE_REFERENCE_V1:
      'Tiểu hạn dùng vị trí khởi theo tam hợp tuổi, nam đi thuận và nữ đi nghịch.',
    ANNUAL_TRANSIT_REFERENCE_V1:
      'Lưu Thái Tuế, Lộc Tồn, Kình Dương, Đà La, Thiên Mã và Lưu Tứ Hóa dùng bộ quy tắc Vận hạn theo thời gian.',
    ANNUAL_BOUNDARY_REFERENCE_ONLY:
      'Lưu niên hiện dùng cấp năm dương lịch, chưa cho chọn ranh giới Tết âm lịch hoặc Lập Xuân.',
    CYCLE_AGE_USES_NOMINAL_AGE:
      'Đại hạn, Tiểu hạn và Lưu niên được đánh chỉ số theo tuổi mụ.',
    INTERPRETATION_REFERENCE_V1: 'Luận giải dùng mô hình tham chiếu minh bạch phiên bản 1.',
    INTERPRETATION_REQUIRES_EXPERT_REVIEW: 'Luận giải cần được chuyên gia đối chiếu trước khi sử dụng chuyên nghiệp.',
  },
  stage2Title: 'Hệ thống Chính tinh',
  stage2Subtitle:
    'An sao Tử Vi, Thiên Phủ và toàn bộ hai vòng chính tinh theo ngày sinh âm lịch và Ngũ hành Cục.',
  stage2Labels: {
    ziWeiAnchor: 'Vị trí sao Tử Vi',
    tianFuAnchor: 'Vị trí sao Thiên Phủ',
    mainStarCount: 'Số chính tinh',
    mainStarLegend: 'Danh sách 14 chính tinh',
    noMainStar: 'Không có chính tinh',
    brightnessDeferred: 'Độ sáng sao được trình bày trong phần Tứ Hóa và các vòng sao',
  },
  starGroups: {
    ziWeiGroup: 'Vòng Tử Vi',
    tianFuGroup: 'Vòng Thiên Phủ',
  },
  mainStars: {
    ziWei: 'Tử Vi', tianJi: 'Thiên Cơ', taiYang: 'Thái Dương',
    wuQu: 'Vũ Khúc', tianTong: 'Thiên Đồng', lianZhen: 'Liêm Trinh',
    tianFu: 'Thiên Phủ', taiYin: 'Thái Âm', tanLang: 'Tham Lang',
    juMen: 'Cự Môn', tianXiang: 'Thiên Tướng', tianLiang: 'Thiên Lương',
    qiSha: 'Thất Sát', poJun: 'Phá Quân',

  },

  stage3Title: 'Phụ tinh và Cát–Sát tinh',
  stage3Subtitle:
    'An 21 phụ tinh theo tháng âm, giờ sinh, thiên can và địa chi năm sinh bằng bộ quy tắc Việt Nam đã khai báo.',
  stage3Labels: {
    auxiliaryStarCount: 'Số phụ tinh',
    supportiveCount: 'Sao hỗ trợ',
    challengingCount: 'Sao thử thách',
    mixedCount: 'Sao hỗn hợp',
    byCategory: 'Phân nhóm phụ tinh',
    byPalace: 'Phụ tinh theo 12 cung',
    noAuxiliaryStar: 'Không có phụ tinh trong nhóm hiện tại',
    rulesetTitle: 'Bộ quy tắc đang dùng',
    rulesetNotice:
      'Hỏa Tinh và Linh Tinh có nhiều cách an giữa các trường phái. Engine dùng quy tắc Việt Nam v1, lưu mã quy tắc cho từng sao và chưa tự trộn bảng miếu-vượng từ nguồn khác.',
  },
  auxiliaryCategories: {
    assistant: 'Phò tá', literary: 'Văn tinh', noble: 'Quý nhân', wealth: 'Tài lộc',
    malefic: 'Sát tinh', mobility: 'Dịch chuyển', romance: 'Tình duyên',
    solitary: 'Cô độc', ceremonial: 'Danh quý',
  },
  auxiliaryTones: {
    supportive: 'Hỗ trợ', challenging: 'Thử thách', mixed: 'Hỗn hợp',
  },
  auxiliaryStars: {
    zuoFu: 'Tả Phụ', youBi: 'Hữu Bật', wenChang: 'Văn Xương', wenQu: 'Văn Khúc',
    tianKui: 'Thiên Khôi', tianYue: 'Thiên Việt', luCun: 'Lộc Tồn',
    qingYang: 'Kình Dương', tuoLuo: 'Đà La', huoXing: 'Hỏa Tinh', lingXing: 'Linh Tinh',
    diKong: 'Địa Không', diJie: 'Địa Kiếp', tianMa: 'Thiên Mã',
    hongLuan: 'Hồng Loan', tianXi: 'Thiên Hỷ', taoHua: 'Đào Hoa',
    guChen: 'Cô Thần', guaXiu: 'Quả Tú', longChi: 'Long Trì', fengGe: 'Phượng Các',
  },

  stage4Title: 'Tứ Hóa và các vòng sao',
  stage4Subtitle:
    'An Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ; xác định Tuần, Triệt; lập vòng Tràng Sinh và đánh giá độ sáng 14 chính tinh theo bảng tham chiếu đã khai báo.',
  stage4Labels: {
    transformationCount: 'Số Tứ Hóa',
    voidMarkerCount: 'Số bộ Không vong',
    trangSinhCount: 'Số trạng thái Tràng Sinh',
    brightnessCount: 'Số chính tinh đã đánh giá',
    fourTransformations: 'Tứ Hóa theo thiên can năm sinh',
    voidMarkers: 'Tuần và Triệt',
    brightnessTitle: 'Miếu, Vượng, Đắc, Bình, Hãm',
    trangSinhTitle: 'Vòng Tràng Sinh',
    byPalace: 'Tổng hợp Tứ Hóa và vòng sao theo 12 cung',
    rulesetTitle: 'Bộ quy tắc Tứ Hóa và vòng sao',
    rulesetNotice:
      'Tứ Hóa, Tuần, Triệt và Tràng Sinh dùng bộ quy tắc Việt Nam v1 đã khai báo. Bảng miếu-vượng là bảng tham chiếu có phiên bản riêng và cần được chuyên gia đối chiếu trước khi dùng cho sản phẩm chuyên nghiệp.',
  },
  transformations: {
    lu: 'Hóa Lộc',
    quan: 'Hóa Quyền',
    ke: 'Hóa Khoa',
    ji: 'Hóa Kỵ',
  },
  voidMarkers: {
    tuan: 'Tuần',
    triet: 'Triệt',
  },
  trangSinh: {
    trangSinh: 'Tràng Sinh',
    mocDuc: 'Mộc Dục',
    quanDoi: 'Quan Đới',
    lamQuan: 'Lâm Quan',
    deVuong: 'Đế Vượng',
    suy: 'Suy',
    benh: 'Bệnh',
    tu: 'Tử',
    mo: 'Mộ',
    tuyet: 'Tuyệt',
    thai: 'Thai',
    duong: 'Dưỡng',
  },
  brightness: {
    mien: 'Miếu',
    vuong: 'Vượng',
    dac: 'Đắc',
    binh: 'Bình',
    ham: 'Hãm',
    notEvaluated: 'Chưa đánh giá',
  },

  stage5: {
    title: 'Vận hạn theo thời gian',
    subtitle:
      'An Đại hạn theo từng thập niên, Tiểu hạn theo từng tuổi và lớp Lưu niên gồm Thái Tuế, Lộc Tồn, Kình Dương, Đà La, Thiên Mã cùng Lưu Tứ Hóa.',
    majorCycleCount: 'Số Đại hạn',
    minorCycleCount: 'Tuổi Tiểu hạn',
    annualCycleCount: 'Năm Lưu niên',
    ruleset: 'Bộ quy tắc hạn',
    rulesetName: 'Tham chiếu Việt Nam v1',
    majorCycles: 'Đại hạn',
    annualTransit: 'Lưu niên',
    nominalAge: 'Tuổi mụ',
    solarAge: 'Tuổi dương xấp xỉ',
    activeMajorCycle: 'Đại hạn đang hoạt động',
    minorCycle: 'Tiểu hạn',
    annualTaiSui: 'Lưu Thái Tuế',
    annualTransformationCount: 'Số Lưu Tứ Hóa',
    notStarted: 'Chưa bắt đầu',
    annualStars: 'Các sao lưu niên',
    annualTransformations: 'Lưu Tứ Hóa',
    annualStarNames: {
      taiSui: 'Lưu Thái Tuế',
      luCun: 'Lưu Lộc Tồn',
      qingYang: 'Lưu Kình Dương',
      tuoLuo: 'Lưu Đà La',
      tianMa: 'Lưu Thiên Mã',
    },
    noticeTitle: 'Phương pháp vận hạn',
    notice:
      'Các hạn dùng tuổi mụ và bộ quy tắc tham chiếu Việt Nam đã khai báo. Ranh giới lưu niên hiện được biểu diễn theo cấp năm dương lịch; bản chuyên nghiệp nên cho phép chọn Tết âm lịch hoặc Lập Xuân và đối chiếu bằng lá số chuẩn.',
  },

  stage6: {
    title: 'Luận giải tổng hợp',
    subtitle:
      'Luận 12 cung, 7 lĩnh vực đời sống và từng năm bằng mô hình điểm minh bạch, có dẫn chứng từ sao và vận hạn.',
    tabs: {overview: 'Tổng quan', palaces: '12 cung', annual: 'Luận năm'},
    overallReading: 'Tổng quan lá số',
    confidenceLabel: 'Độ tin cậy',
    confidence: {low: 'Thấp', medium: 'Trung bình', high: 'Cao'},
    lifeDomains: 'Các lĩnh vực chính',
    domains: {
      self: 'Bản thân', love: 'Tình duyên', career: 'Sự nghiệp', wealth: 'Tài vận',
      health: 'Sức khỏe', family: 'Gia đạo', travel: 'Thiên di',
    },
    headlines: {
      veryFavorable: 'Nền tảng nổi bật và nhiều yếu tố hỗ trợ',
      favorable: 'Khá thuận, có điều kiện để phát triển',
      balanced: 'Tương đối cân bằng, tốt xấu đan xen',
      challenging: 'Có thử thách, cần chủ động điều chỉnh',
      veryChallenging: 'Nhiều áp lực, nên thận trọng và đi từng bước',
    },
    primaryPalace: 'Cung chính',
    palaceInterpretations: 'Luận giải 12 cung',
    supportiveEvidence: 'Yếu tố hỗ trợ',
    challengingEvidence: 'Yếu tố cần lưu ý',
    noEvidence: 'Chưa có yếu tố nổi bật trong nhóm này.',
    annualInterpretation: 'Luận giải lưu niên',
    nominalAge: 'Tuổi mụ {{age}}',
    activeMajorPalace: 'Cung Đại hạn',
    minorPalace: 'Cung Tiểu hạn',
    taiSuiPalace: 'Cung Lưu Thái Tuế',
    notAvailable: 'Chưa bắt đầu',
    evidenceTitle: 'Căn cứ luận giải',
    tones: {
      supportive: 'Hỗ trợ', challenging: 'Thử thách', mixed: 'Hỗn hợp', neutral: 'Trung tính',
    },
    evidenceTypes: {
      mainStar: 'Chính tinh', auxiliaryStar: 'Phụ tinh', transformation: 'Tứ Hóa',
      voidMarker: 'Tuần/Triệt', trangSinh: 'Vòng Tràng Sinh', bodyResidence: 'Thân cư tại cung này',
      majorCycle: 'Đại hạn', minorCycle: 'Tiểu hạn', annualStar: 'Sao lưu niên',
    },
    noMainStar: 'Cung vô chính diệu',
    advice: {
      domains: {
        self: 'Ưu tiên hiểu rõ điểm mạnh, giới hạn và cách phản ứng của bản thân trước khi quyết định lớn.',
        love: 'Tập trung vào giao tiếp rõ ràng, ranh giới lành mạnh và sự ổn định cảm xúc.',
        career: 'Chọn môi trường phù hợp năng lực, xây kỹ năng dài hạn và tránh quyết định chỉ theo cảm hứng.',
        wealth: 'Ưu tiên kế hoạch tài chính, dự phòng và kiểm soát rủi ro hơn là chạy theo lợi nhuận ngắn hạn.',
        health: 'Giữ nhịp sống điều độ và tìm hỗ trợ y tế chuyên môn khi có triệu chứng thực tế.',
        family: 'Duy trì đối thoại, trách nhiệm và sự tôn trọng khác biệt giữa các thành viên.',
        travel: 'Chuẩn bị kỹ trước thay đổi môi trường, mở rộng quan hệ nhưng vẫn giữ giới hạn an toàn.',
      },
      palaces: {
        life: 'Phát triển sự tự nhận thức và lựa chọn con đường phù hợp tính cách thật.',
        parents: 'Giữ giao tiếp tôn trọng với cha mẹ và người lớn, đồng thời xây ranh giới phù hợp.',
        fortune: 'Nuôi dưỡng đời sống tinh thần, nghỉ ngơi và những thói quen giúp tâm trí ổn định.',
        property: 'Cân nhắc dài hạn khi mua bán, sửa chữa hoặc tích lũy tài sản.',
        career: 'Tập trung vào năng lực cốt lõi, uy tín và khả năng hợp tác trong công việc.',
        friends: 'Chọn quan hệ có sự tin cậy và phân định rõ lợi ích, trách nhiệm.',
        travel: 'Thích nghi với môi trường mới nhưng không bỏ qua kế hoạch và an toàn.',
        health: 'Theo dõi sức khỏe bằng dữ liệu thực tế và tư vấn chuyên môn, không dựa vào lá số.',
        wealth: 'Quản lý dòng tiền, nợ và đầu tư bằng kế hoạch cụ thể.',
        children: 'Khuyến khích, lắng nghe và giữ kỳ vọng phù hợp trong quan hệ với con trẻ hoặc dự án sáng tạo.',
        spouse: 'Xây tình cảm bằng sự minh bạch, tôn trọng và khả năng giải quyết bất đồng.',
        siblings: 'Giữ hỗ trợ lẫn nhau nhưng tránh phụ thuộc hoặc can thiệp quá mức.',
      },
      annual:
        'Xem năm này như một chỉ báo tham khảo. Hãy đối chiếu với hoàn cảnh thực tế, kế hoạch và nguồn lực hiện có.',
    },
    noticeTitle: 'Phương pháp luận giải tổng hợp',
    notice:
      'Luận giải được tạo từ mô hình điểm có thể kiểm tra, dựa trên chính tinh, độ sáng, phụ tinh, Tứ Hóa, Tuần-Triệt, Tràng Sinh và vận hạn. Đây không phải dự đoán chắc chắn và cần chuyên gia đối chiếu trước khi dùng chuyên nghiệp.',
  },

  errors: {
    title: 'Thông tin chưa hợp lệ',
    calculateFailed: 'Không thể lập lá số. Hãy kiểm tra lại thông tin.',
    codes: {
      INVALID_YEAR: 'Năm sinh phải nằm trong khoảng 1900–2100.',
      INVALID_MONTH: 'Tháng sinh không hợp lệ.',
      INVALID_DAY: 'Ngày sinh không hợp lệ.',
      INVALID_BIRTH_DATE: 'Ngày sinh dương lịch không hợp lệ.',
      INVALID_BIRTH_HOUR: 'Giờ sinh phải từ 00 đến 23.',
      INVALID_BIRTH_MINUTE: 'Phút sinh phải từ 00 đến 59.',
      INVALID_TIME_ZONE: 'Múi giờ IANA không hợp lệ.',
      INVALID_LONGITUDE: 'Kinh độ không hợp lệ.',
      INVALID_LATITUDE: 'Vĩ độ không hợp lệ.',
      INVALID_COORDINATE: 'Kinh độ hoặc vĩ độ không hợp lệ.',
    },
  },
};
export default ziwei;
