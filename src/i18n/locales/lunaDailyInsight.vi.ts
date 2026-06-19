const lunaDailyInsight = {
  lunaDailyInsight: {
    eyebrow: "Hôm nay",
    title: "Dự báo cá nhân hôm nay",
    todayFor: "Cho {{name}} • {{date}}",
    manageProfile: "Hồ sơ",
    moonFocus: "Trọng tâm Mặt Trăng",
    energyScore: "Năng lượng",
    houseLabel: "Nhà {{number}}",
    focusScores: "Điểm trọng tâm",
    skyToday: "Bầu trời hôm nay",
    dominantTransitElement: "Nguyên tố quá cảnh trội: {{element}}",
    natalTouchpoints: "Điểm chạm với lá số gốc",
    noTouchpoints: "Hôm nay không có góc quá cảnh lớn quá sát. Hãy giữ ngày đơn giản và quan sát những tín hiệu tinh tế.",
    suggestedAction: "Hành động gợi ý",
    journalPrompt: "Câu hỏi ghi nhật ký",
    orb: "orb {{value}}°",
    notice: "Dự báo hằng ngày dùng cho chiêm nghiệm và tự nhận thức. Không thay thế lời khuyên chuyên môn.",
    focus: {
      love: "Tình yêu",
      career: "Công việc",
      money: "Tiền bạc",
      wellness: "Thân tâm",
    },
    points: {
      sun: "Mặt Trời",
      moon: "Mặt Trăng",
      mercury: "Sao Thủy",
      venus: "Sao Kim",
      mars: "Sao Hỏa",
      jupiter: "Sao Mộc",
      saturn: "Sao Thổ",
      uranus: "Thiên Vương",
      neptune: "Hải Vương",
      pluto: "Diêm Vương",
      ascendant: "Cung Mọc",
      midheaven: "Thiên Đỉnh",
    },
    aspectNames: {
      conjunction: "đồng tụ",
      sextile: "lục hợp",
      square: "vuông góc",
      trine: "tam hợp",
      opposition: "đối đỉnh",
    },
    tones: {
      supportive: "hỗ trợ",
      challenging: "thử thách",
      intense: "mạnh",
      reflective: "chiêm nghiệm",
    },
    aspectTexts: {
      supportive: "Góc này giúp ngày hôm nay mềm hơn nếu bạn biết đón nhận sự hỗ trợ đang có.",
      challenging: "Góc này có thể tạo ma sát, nhưng cũng chỉ ra nơi một khuôn mẫu cần được chú ý.",
      intense: "Góc này có thể tạo cảm giác cô đặc. Hãy phản ứng có ý thức và chọn một câu trả lời rõ ràng.",
      reflective: "Góc này khá tinh tế. Hãy quan sát chủ đề mà không ép mình phải kết luận ngay.",
    },
    moonPhases: {
      newMoon: {
        title: "Trăng non",
        text: "Bắt đầu trong yên lặng. Đặt một ý định trước khi đòi hỏi kết quả rõ ràng.",
      },
      waxingCrescent: {
        title: "Trăng lưỡi liềm đầu tháng",
        text: "Nuôi dưỡng một ý định mới bằng một hành động nhỏ và lặp lại được.",
      },
      firstQuarter: {
        title: "Bán nguyệt đầu",
        text: "Chọn hành động thay vì do dự. Giải quyết một trở ngại thực tế.",
      },
      waxingGibbous: {
        title: "Trăng khuyết lớn dần",
        text: "Tinh chỉnh kế hoạch, sửa chi tiết và tiếp tục xây dựng kiên nhẫn.",
      },
      fullMoon: {
        title: "Trăng tròn",
        text: "Để điều cần thấy được lộ diện. Gọi tên điều đã hoàn tất và điều cần buông.",
      },
      waningGibbous: {
        title: "Trăng khuyết sau rằm",
        text: "Chia sẻ bài học, biết ơn và nhìn lại điều vừa diễn ra.",
      },
      lastQuarter: {
        title: "Bán nguyệt cuối",
        text: "Dọn bớt sự rối rắm và chọn điều xứng đáng tiếp tục.",
      },
      waningCrescent: {
        title: "Trăng lưỡi liềm cuối tháng",
        text: "Nghỉ ngơi, giảm áp lực và chuẩn bị cho một chu kỳ nội tâm mới.",
      },
    },
    themes: {
      house1: {
        text: "Mặt Trăng nhấn mạnh bản thân, cơ thể và sự hiện diện cá nhân. Hãy bắt đầu ngày bằng cách kiểm tra năng lượng thật của bạn.",
      },
      house2: {
        text: "Mặt Trăng nhấn mạnh tiền bạc, giá trị và sự ổn định. Hãy chọn một quyết định vững vàng về tài nguyên hoặc giá trị bản thân.",
      },
      house3: {
        text: "Mặt Trăng nhấn mạnh giao tiếp, học hỏi và trao đổi ngắn. Hãy nói một điều thật rõ và lắng nghe kỹ.",
      },
      house4: {
        text: "Mặt Trăng nhấn mạnh gia đình, gốc rễ và sự an toàn cảm xúc. Hãy tạo một khoảng bình yên trong đời sống riêng.",
      },
      house5: {
        text: "Mặt Trăng nhấn mạnh sáng tạo, lãng mạn và niềm vui. Hãy để sự vui chơi hoặc tình cảm làm mềm ngày hôm nay.",
      },
      house6: {
        text: "Mặt Trăng nhấn mạnh thói quen, công việc và sức khỏe. Hãy cải thiện một thói quen nhỏ thay vì sửa tất cả.",
      },
      house7: {
        text: "Mặt Trăng nhấn mạnh quan hệ và sự phản chiếu. Hãy chọn kết nối chân thật thay vì im lặng suy đoán.",
      },
      house8: {
        text: "Mặt Trăng nhấn mạnh lòng tin, chiều sâu và tài nguyên chung. Hãy đi chậm với các chủ đề nhạy cảm.",
      },
      house9: {
        text: "Mặt Trăng nhấn mạnh ý nghĩa, học tập và chân trời rộng hơn. Hãy để một góc nhìn mới đổi tông ngày hôm nay.",
      },
      house10: {
        text: "Mặt Trăng nhấn mạnh sự nghiệp, hình ảnh và trách nhiệm. Hãy đặt nỗ lực vào nơi có thể đo lường được.",
      },
      house11: {
        text: "Mặt Trăng nhấn mạnh bạn bè, cộng đồng và kế hoạch tương lai. Hãy kết nối với một người hoặc nhóm hỗ trợ.",
      },
      house12: {
        text: "Mặt Trăng nhấn mạnh nghỉ ngơi, kết thúc và vô thức. Hãy bảo vệ thời gian yên tĩnh và lắng nghe tín hiệu tinh tế.",
      },
    },
    actions: {
      organizeEnergy: "Sắp xếp năng lượng trước khi sắp xếp lịch trình.",
      moneyCareerFocus: "Chọn một việc thực tế hỗ trợ tiền bạc, công việc hoặc sự an toàn dài hạn.",
      relationshipCheck: "Hỏi thăm ai đó một cách chân thật, không cần kiểm soát phản hồi.",
      quietReset: "Dành một khoảng lặng và loại bỏ một nguồn nhiễu cảm xúc.",
      observePattern: "Quan sát một khuôn mẫu lặp lại và ghi ra điều nó đang dạy bạn.",
    },
    prompts: {
      innerCheck: "Thế giới bên trong của mình cần gì trước khi mình quyết định bên ngoài?",
      practicalStep: "Một bước thực tế nào sẽ làm hôm nay ổn định hơn?",
      connection: "Hôm nay mình có thể tạo kết nối chân thật hơn ở đâu?",
      release: "Mình đã sẵn sàng buông bỏ, đơn giản hóa hoặc ngừng gánh điều gì?",
    },
  },
} as const;

export default lunaDailyInsight;
