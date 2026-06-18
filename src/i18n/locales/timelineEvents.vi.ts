const timelineEvents = {
  createTitle: 'Thêm sự kiện Timeline',
  editTitle: 'Chỉnh sửa sự kiện',

  profileLine: 'Hồ sơ: {{name}}',
  profileUnavailable: 'Không tìm thấy hồ sơ',

  basicInformation: 'Thông tin sự kiện',
  eventTitle: 'Tiêu đề',
  eventTitlePlaceholder:
    'Ví dụ: Đổi việc, chuyển nhà, tốt nghiệp...',
  description: 'Mô tả',
  descriptionPlaceholder:
    'Ghi lại điều đã xảy ra, bối cảnh và cảm nhận của bạn...',

  dateTitle: 'Ngày xảy ra',
  day: 'Ngày',
  month: 'Tháng',
  year: 'Năm',

  categoryTitle: 'Nhóm sự kiện',
  categories: {
    career: 'Công việc',
    finance: 'Tài chính',
    relationship: 'Tình cảm',
    family: 'Gia đình',
    health: 'Sức khỏe',
    education: 'Học tập',
    relocation: 'Chuyển chỗ ở',
    spiritual: 'Tinh thần',
    achievement: 'Thành tựu',
    other: 'Khác',
  },

  toneTitle: 'Tính chất sự kiện',
  tones: {
    positive: 'Tích cực',
    neutral: 'Trung tính',
    challenging: 'Thử thách',
  },

  importanceTitle: 'Mức độ quan trọng',
  importance: {
    1: 'Nhẹ',
    2: 'Đáng chú ý',
    3: 'Cột mốc lớn',
  },

  tagsTitle: 'Thẻ',
  tagsPlaceholder:
    'Ví dụ: công việc, gia đình, thay đổi',
  tagsHelp:
    'Ngăn cách các thẻ bằng dấu phẩy.',

  save: 'Lưu sự kiện',
  update: 'Cập nhật sự kiện',
  saving: 'Đang lưu...',
  done: 'Xong',

  savedTitle: 'Đã lưu sự kiện',
  createdMessage:
    'Sự kiện đã được thêm vào Timeline.',
  updatedMessage:
    'Sự kiện đã được cập nhật.',

  sectionEyebrow: 'SỰ KIỆN THỰC TẾ',
  sectionTitle: 'Nhật ký năm {{year}}',
  sectionSubtitle:
    'So sánh dữ liệu tham khảo với những điều thực sự đã xảy ra.',
  add: 'Thêm sự kiện',

  emptyTitle: 'Chưa có sự kiện trong năm này',
  emptyMessage:
    'Thêm các cột mốc như đổi việc, chuyển nhà, mối quan hệ, sức khỏe hoặc thành tựu.',

  edit: 'Sửa',
  delete: 'Xóa',
  cancel: 'Hủy',

  deleteTitle: 'Xóa sự kiện',
  deleteMessage:
    'Bạn có chắc muốn xóa “{{title}}” không?',

  loading: 'Đang tải sự kiện...',

  privacyTitle: 'Dữ liệu cá nhân',
  privacyMessage:
    'Sự kiện Timeline được lưu cục bộ trên thiết bị. Không ghi thông tin nhạy cảm của người khác khi chưa có sự đồng ý.',

  errors: {
    title: 'Thông tin chưa hợp lệ',
    titleRequired:
      'Vui lòng nhập tiêu đề sự kiện.',
    invalidDate:
      'Ngày xảy ra không hợp lệ.',
    saveFailed:
      'Không thể lưu sự kiện. Vui lòng thử lại.',
  },
};

export default timelineEvents;
