export const peaceJournal = {
  title: 'Nhật ký tâm an',
  subtitle:
    'Một không gian riêng tư để ghi lại cảm xúc, lòng biết ơn và những điều bạn muốn buông xuống.',
  beforeMood: 'Tâm trạng trước khi viết',
  afterMood: 'Tâm trạng sau khi viết',
  moods: {
    peaceful: 'Bình an',
    grateful: 'Biết ơn',
    neutral: 'Bình thường',
    worried: 'Lo lắng',
    sad: 'Buồn',
  },
  gratitudeLabel: 'Điều tôi biết ơn hôm nay',
  gratitudePlaceholder:
    'Ví dụ: Một bữa cơm ấm, một lời hỏi thăm, một khoảnh khắc yên tĩnh...',
  releaseLabel: 'Điều tôi muốn buông bỏ',
  releasePlaceholder:
    'Viết xuống điều đang làm bạn nặng lòng...',
  prayerLabel: 'Lời nguyện hôm nay',
  prayerPlaceholder:
    'Gửi một lời nguyện lành cho bản thân hoặc người khác...',
  noteLabel: 'Ghi chú tự do',
  notePlaceholder:
    'Viết thêm bất cứ điều gì bạn muốn lưu lại...',
  requiredTitle: 'Chưa có nội dung',
  requiredMessage:
    'Hãy viết ít nhất một nội dung trước khi lưu.',
  savedTitle: 'Đã lưu nhật ký',
  savedMessage:
    'Nội dung đã được lưu riêng trên thiết bị.',
  saveErrorTitle: 'Không thể lưu',
  saveErrorMessage:
    'Đã xảy ra lỗi khi lưu nhật ký.',
  save: 'Lưu nhật ký',
  saving: 'Đang lưu...',
  privacy:
    'Nội dung được lưu cục bộ trên thiết bị và không tự động gửi lên máy chủ.',
  history: 'Những trang đã viết',
  empty:
    'Bạn chưa có trang nhật ký nào.',
  deleteTitle: 'Xóa trang nhật ký',
  deleteMessage:
    'Bạn có chắc muốn xóa nội dung này?',
};

export const buddhistCalendar = {
  title: 'Lịch Phật giáo',
  subtitle:
    'Theo dõi mùng một, ngày rằm và một số ngày lễ phổ biến theo âm lịch.',
  lunarDate: 'Âm lịch {{day}}/{{month}}',
  leapMonth: 'Tháng nhuận',
  noEvent:
    'Không có ngày lễ được đánh dấu trong ngày này.',
  upcomingTitle: 'Ngày sắp tới',
  noticeTitle: 'Lưu ý',
  notice:
    'Ngày lễ có thể khác nhau theo truyền thống, địa phương và lịch của từng chùa. Hãy xem đây là thông tin tham khảo.',
  events: {
    newMoon: 'Mùng một âm lịch',
    fullMoon: 'Ngày rằm âm lịch',
    maitreya: 'Ngày vía Đức Phật Di Lặc',
    firstFullMoon: 'Rằm tháng Giêng',
    avalokitesvaraBirth:
      'Ngày vía Quán Thế Âm đản sinh',
    vesak: 'Đại lễ Phật Đản',
    traditionNote:
      'Ngày tổ chức có thể khác theo truyền thống.',
    avalokitesvaraEnlightenment:
      'Ngày vía Quán Thế Âm thành đạo',
    ulambana: 'Đại lễ Vu Lan',
    avalokitesvaraRenunciation:
      'Ngày vía Quán Thế Âm xuất gia',
    amitabha: 'Ngày vía Đức Phật A Di Đà',
    buddhaEnlightenment:
      'Ngày Đức Phật thành đạo',
  },
};

export const altarCustomization = {
  title: 'Bàn thờ cá nhân hóa',
  subtitle:
    'Chọn ánh sáng, hoa, đèn và không khí phù hợp với không gian thực hành của bạn.',
  preview: 'Xem trước',
  cultureThemeTitle: 'Phong cách bàn thờ',
  activeCultureTheme:
    'Đang dùng: {{theme}}',
  cultureThemes: {
    auto: 'Tự động theo ngôn ngữ',
    vietnam: 'Việt Nam',
    china: 'Trung Quốc',
    japan: 'Nhật Bản',
    korea: 'Hàn Quốc',
    western: 'Phương Tây',
  },
  sceneTitle: 'Thời điểm trong ngày',
  centerpieceTitle: 'Biểu tượng trung tâm',
  flowerTitle: 'Hoa trang trí',
  lampTitle: 'Đèn thờ',
  accentTitle: 'Màu ánh sáng',
  soundscapeTitle: 'Âm thanh nền',
  petalsTitle: 'Cánh hoa bay nhẹ',
  petalsDescription:
    'Hiển thị một lớp cánh hoa chuyển động chậm trong chính điện.',
  save: 'Lưu không gian',
  saving: 'Đang lưu...',
  savedTitle: 'Đã lưu',
  savedMessage:
    'Không gian chính điện đã được cập nhật.',
  saveErrorTitle: 'Không thể lưu',
  saveErrorMessage:
    'Đã xảy ra lỗi khi lưu tùy chọn.',
  reset: 'Khôi phục mặc định',
  resetTitle: 'Khôi phục mặc định',
  resetMessage:
    'Bạn muốn đưa toàn bộ tùy chọn về mặc định?',
  soundscapeNote:
    'Âm thanh nền chỉ phát khi bạn đang ở màn hình Chính điện.',
  sceneModes: {
    auto: 'Tự động',
    dawn: 'Bình minh',
    day: 'Ban ngày',
    dusk: 'Hoàng hôn',
    night: 'Ban đêm',
  },
  centerpieces: {
    buddha: 'Tượng Phật',
    lotus: 'Hoa sen',
    dharmaWheel: 'Pháp luân',
    none: 'Không có',
  },
  flowers: {
    lily: 'Hoa huệ',
    lotus: 'Hoa sen',
    orchid: 'Hoa lan',
    none: 'Không hoa',
  },
  lamps: {
    candle: 'Nến',
    lantern: 'Đèn lồng',
    lotusLamp: 'Đèn sen',
    none: 'Không có',
  },
  accents: {
    amber: 'Hổ phách',
    gold: 'Vàng',
    rose: 'Hồng',
    jade: 'Ngọc',
    none: 'Không có',
  },
  soundscapes: {
    none: 'Không âm thanh',
    rain: 'Mưa chùa',
    forest: 'Rừng sớm',
    bell: 'Chuông thiền',
  },
};

export default {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
};
