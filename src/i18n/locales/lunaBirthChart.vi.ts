const lunaBirthChart = {
  lunaBirthChart: {
    eyebrow: "Bản đồ sao",
    title: "Mặt Trời, Mặt Trăng & Cung Mọc",
    subtitle: "Nhập giờ sinh và vị trí sinh để ước tính Cung Mặt Trăng, Cung Mọc, nhà và các góc chiếu chính.",
    inputsTitle: "Thông tin sinh",
    year: "Năm",
    month: "Tháng",
    day: "Ngày",
    hour: "Giờ",
    minute: "Phút",
    timezone: "UTC",
    latitude: "Vĩ độ",
    longitude: "Kinh độ",
    bigThree: "Bộ ba chính",
    houses: "12 nhà Equal House",
    house: "Nhà {{number}}",
    aspects: "Góc chiếu chính",
    noAspects: "Không có góc chiếu chính trong orb đã chọn.",
    orb: "orb {{value}}°",
    approximateNotice: "Bản đồ sao này dùng công thức ước tính offline, phù hợp cho chiêm nghiệm. Nếu cần bản chuyên nghiệp, hãy dùng ephemeris chuẩn và nơi sinh chính xác.",
    points: {
      sun: "Mặt Trời",
      moon: "Mặt Trăng",
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
  },
} as const;

export default lunaBirthChart;
