const userProfiles = {
  tabTitle: 'Hồ sơ',
  title: 'Hồ sơ dùng chung',
  subtitle:
    'Lưu một lần và sử dụng lại cho Bát Tự, Tử Vi, ngày tốt và các công cụ khác.',
  add: 'Thêm hồ sơ',
  createTitle: 'Tạo hồ sơ',
  editTitle: 'Chỉnh sửa hồ sơ',
  editorSubtitle:
    'Thông tin này có thể được dùng lại trong toàn bộ Eastern Destiny.',
  loading: 'Đang tải hồ sơ...',

  basicInformation: 'Thông tin cơ bản',
  displayName: 'Tên hiển thị',
  displayNamePlaceholder: 'Ví dụ: Nguyễn Văn A',
  relationship: 'Mối quan hệ',
  gender: 'Giới tính',

  birthInformation: 'Thông tin ngày giờ sinh',
  solarBirthDate: 'Ngày sinh dương lịch',
  birthTimeAccuracy: 'Độ chính xác của giờ sinh',
  birthTime: 'Giờ sinh',
  unknownTimeNotice:
    'Khi không biết giờ sinh, ứng dụng sẽ dùng 12:00 làm thời gian kỹ thuật tạm thời. Một số kết quả có thể thay đổi đáng kể.',

  birthLocation: 'Nơi sinh và múi giờ',
  placeName: 'Nơi sinh',
  placeNamePlaceholder: 'Ví dụ: TP. Hồ Chí Minh',
  timeZone: 'Múi giờ IANA',
  longitude: 'Kinh độ',
  latitude: 'Vĩ độ',

  notesAndOptions: 'Ghi chú và tùy chọn',
  notes: 'Ghi chú riêng',
  notesPlaceholder:
    'Thêm thông tin giúp bạn nhận biết hồ sơ này...',
  favorite: 'Đánh dấu yêu thích',
  favoriteSubtitle:
    'Hồ sơ yêu thích sẽ được ưu tiên hiển thị ở đầu danh sách.',

  save: 'Lưu hồ sơ',
  saving: 'Đang lưu...',
  savedTitle: 'Đã lưu hồ sơ',
  savedMessage:
    'Hồ sơ đã được lưu trên thiết bị.',
  done: 'Xong',

  searchPlaceholder:
    'Tìm theo tên, nơi sinh hoặc ghi chú...',
  profileCount: '{{count}} hồ sơ',
  favoriteCount: 'Yêu thích',
  summaryHint:
    'Dùng một hồ sơ cho nhiều công cụ mà không cần nhập lại thông tin.',

  importFromBazi: 'Nhập từ lá số Bát Tự đã lưu',
  importFromBaziSubtitle:
    'Tạo hồ sơ dùng chung từ các lá số Bát Tự hiện có trên thiết bị.',
  importing: 'Đang nhập hồ sơ...',
  importCompletedTitle: 'Đã hoàn tất',
  importCompletedMessage:
    'Đã tạo {{count}} hồ sơ mới.',
  importNothingMessage:
    'Không có lá số mới để nhập.',
  importErrorTitle: 'Không thể nhập hồ sơ',
  importErrorMessage:
    'Đã xảy ra lỗi khi đọc các lá số Bát Tự đã lưu.',

  emptyTitle: 'Chưa có hồ sơ',
  emptyMessage:
    'Tạo hồ sơ đầu tiên để dùng chung cho Bát Tự, Tử Vi và ngày tốt.',
  createFirst: 'Tạo hồ sơ đầu tiên',
  noResultsTitle: 'Không tìm thấy hồ sơ',
  noResultsMessage:
    'Thử từ khóa khác hoặc xóa nội dung tìm kiếm.',

  birthDateShort: 'Ngày sinh',
  birthTimeShort: 'Giờ sinh',
  locationShort: 'Nơi sinh',
  approximatePrefix: 'Khoảng',

  edit: 'Sửa',
  duplicate: 'Nhân bản',
  delete: 'Xóa',
  cancel: 'Hủy',

  deleteTitle: 'Xóa hồ sơ',
  deleteMessage:
    'Bạn có chắc muốn xóa hồ sơ “{{name}}” không?',

  ziweiGenderTitle: 'Cần chọn giới tính',
  ziweiGenderMessage:
    'Tử Vi Đẩu Số cần giới tính nam hoặc nữ để an lá số. Hãy chỉnh sửa hồ sơ trước.',

  privacyTitle: 'Dữ liệu cá nhân',
  privacyMessage:
    'Hồ sơ được lưu cục bộ trên thiết bị trong phiên bản hiện tại. Hãy bảo vệ thiết bị và không chia sẻ dữ liệu sinh của người khác khi chưa được đồng ý.',

  profileTimeWarningTitle:
    'Lưu ý về giờ sinh',
  profileTimeUnknownMessage:
    'Hồ sơ này không có giờ sinh chính xác. Ứng dụng đang dùng 12:00 làm giá trị tạm thời; kết quả liên quan đến trụ giờ hoặc cung có thể thay đổi.',
  profileTimeApproximateMessage:
    'Giờ sinh của hồ sơ này chỉ là ước lượng. Một số kết quả có thể thay đổi nếu thời gian chính xác khác đi.',

  relationships: {
    self: 'Bản thân',
    partner: 'Bạn đời',
    parent: 'Cha mẹ',
    child: 'Con',
    sibling: 'Anh chị em',
    friend: 'Bạn bè',
    client: 'Khách hàng',
    other: 'Khác',
  },

  genders: {
    male: 'Nam',
    female: 'Nữ',
    unspecified: 'Chưa xác định',
  },

  timeAccuracy: {
    exact: 'Chính xác',
    approximate: 'Ước lượng',
    unknown: 'Không biết',
  },

  actions: {
    bazi: 'Bát Tự',
    ziwei: 'Tử Vi',
    dates: 'Ngày tốt',
  },

  errors: {
    title: 'Thông tin chưa hợp lệ',
    displayNameRequired:
      'Vui lòng nhập tên hiển thị.',
    invalidDate:
      'Ngày sinh dương lịch không hợp lệ.',
    invalidTime:
      'Giờ sinh phải nằm trong khoảng 00:00 đến 23:59.',
    timeZoneRequired:
      'Vui lòng nhập múi giờ IANA.',
    invalidCoordinate:
      'Kinh độ hoặc vĩ độ không hợp lệ.',
    saveFailed:
      'Không thể lưu hồ sơ. Vui lòng thử lại.',
  },
};

export default userProfiles;
