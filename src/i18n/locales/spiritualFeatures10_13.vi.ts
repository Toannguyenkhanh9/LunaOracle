export const dataSync = {
  title: 'Đồng bộ dữ liệu',
  subtitle:
    'Sao lưu tiến trình, nhật ký và tùy chọn để khôi phục trên thiết bị khác.',
  cloudConfig: 'Cấu hình đồng bộ',
  endpoint: 'Địa chỉ máy chủ',
  accessToken: 'Mã truy cập',
  accessTokenPlaceholder: 'Nhập mã truy cập riêng của bạn',
  autoSync: 'Tự động sao lưu',
  autoSyncDescription:
    'Tải bản sao lưu mới lên khi ứng dụng khởi động.',
  saveConfig: 'Lưu cấu hình',
  status: 'Trạng thái đồng bộ',
  lastUpload: 'Lần tải lên gần nhất',
  lastDownload: 'Lần khôi phục gần nhất',
  never: 'Chưa có',
  upload: 'Tải dữ liệu lên đám mây',
  download: 'Khôi phục từ đám mây',
  exportBackup: 'Xuất file sao lưu JSON',
  savedTitle: 'Đã lưu cấu hình',
  savedMessage: 'Cấu hình đồng bộ đã được lưu.',
  uploadedTitle: 'Đã sao lưu',
  uploadedMessage: 'Dữ liệu mới nhất đã được tải lên.',
  restoreTitle: 'Khôi phục dữ liệu',
  restoreMessage:
    'Dữ liệu hiện tại có thể bị ghi đè. Bạn có muốn tiếp tục?',
  restore: 'Khôi phục',
  restoredTitle: 'Đã khôi phục',
  restoredMessage:
    'Dữ liệu đã được khôi phục từ bản sao lưu.',
  errorTitle: 'Không thể đồng bộ',
  errorMessage:
    'Hãy kiểm tra địa chỉ máy chủ, mã truy cập và kết nối mạng.',
  exportError:
    'Không thể tạo file sao lưu trên thiết bị.',
  notice:
    'Máy chủ phải hỗ trợ PUT /backup và GET /backup/latest. Mã truy cập chỉ được lưu trên thiết bị.',
};

export const pdfExport = {
  title: 'Xuất báo cáo PDF',
  subtitle:
    'Tạo báo cáo dễ lưu trữ hoặc chia sẻ từ dữ liệu thực hành của bạn.',
  chooseSections: 'Chọn nội dung',
  practiceTitle: 'Tiến trình thực hành',
  practiceDescription:
    'Chuỗi ngày, số buổi và tổng thời gian thiền.',
  journalDescription:
    'Các trang Nhật ký tâm an đã lưu trên thiết bị.',
  altarDescription:
    'Tùy chọn không gian chính điện hiện tại.',
  export: 'Tạo và chia sẻ PDF',
  exporting: 'Đang tạo PDF...',
  reportTitle: 'Báo cáo thực hành tâm an',
  generatedAt: 'Ngày tạo',
  todayProgress: 'Tiến trình hôm nay',
  privacyNotice:
    'Báo cáo được tạo trực tiếp trên thiết bị. Hãy bảo vệ file nếu có nội dung riêng tư.',
  selectTitle: 'Chưa chọn nội dung',
  selectMessage:
    'Hãy chọn ít nhất một phần để xuất.',
  successTitle: 'Đã tạo PDF',
  successMessage:
    'Báo cáo đã sẵn sàng để lưu hoặc chia sẻ.',
  errorTitle: 'Không thể tạo PDF',
  errorMessage:
    'Đã xảy ra lỗi khi tạo hoặc chia sẻ báo cáo.',
  notice:
    'Nhật ký có thể chứa thông tin riêng tư. Chỉ chia sẻ với người bạn tin tưởng.',
};

export const premiumContent = {
  title: 'Thư viện Premium',
  subtitle:
    'Các bài thực hành sâu hơn, nghi thức hướng dẫn và không gian đặc biệt.',
  premiumActive: 'Premium đang hoạt động',
  freePlan: 'Gói miễn phí',
  minutes: '{{count}} phút',
  lockedTitle: 'Nội dung Premium',
  lockedMessage:
    'Nâng cấp Premium để mở khóa nội dung này.',
  upgrade: 'Xem gói Premium',
  notFound: 'Không tìm thấy nội dung.',
  themeReady:
    'Không gian này đã sẵn sàng để áp dụng trong phần cá nhân hóa.',
  categories: {
    all: 'Tất cả',
    meditation: 'Thiền',
    sutra: 'Kinh',
    sleep: 'Giấc ngủ',
    ritual: 'Nghi thức',
    theme: 'Không gian',
  },
  items: {
    threeMinuteCalm: {
      title: 'Ba phút trở về',
      description:
        'Một bài thực hành ngắn để thả lỏng và ổn định hơi thở.',
      body:
        'Ngồi vững và nhẹ nhàng khép mắt. Hít vào chậm trong bốn nhịp, cảm nhận lồng ngực mở ra. Thở ra trong sáu nhịp và buông lỏng vai. Lặp lại ba lần. Sau đó, để hơi thở trở về tự nhiên và chỉ quan sát cảm giác đang có.',
    },
    lovingKindness: {
      title: 'Thiền từ bi',
      description:
        'Nuôi dưỡng sự dịu dàng với bản thân và người khác.',
      body:
        'Hãy đặt tay lên ngực và thầm nhắc: Mong tôi được bình an. Mong tôi được khỏe mạnh. Mong tôi sống với lòng nhẹ nhàng. Sau đó mở rộng lời chúc ấy đến một người thân, một người trung lập và cuối cùng đến tất cả chúng sinh.',
    },
    deepSleep: {
      title: 'Thư giãn sâu trước khi ngủ',
      description:
        'Thả lỏng từng vùng cơ thể và chuẩn bị cho giấc ngủ.',
      body:
        'Nằm thoải mái. Bắt đầu từ bàn chân, cảm nhận rồi thả lỏng từng vùng: bắp chân, đùi, bụng, ngực, vai, cánh tay, cổ và khuôn mặt. Không cần cố gắng ngủ; chỉ cho phép cơ thể nghỉ ngơi.',
    },
    morningRitual: {
      title: 'Nghi thức buổi sáng',
      description:
        'Khởi đầu ngày mới bằng hơi thở, lời nguyện và lòng biết ơn.',
      body:
        'Thắp một nén hương hoặc ngồi yên trong một phút. Ghi một điều bạn biết ơn. Chọn một phẩm chất muốn mang theo trong ngày, như kiên nhẫn hoặc tử tế. Kết thúc bằng ba hơi thở chậm.',
    },
    eveningRelease: {
      title: 'Nghi thức buông xả buổi tối',
      description:
        'Khép lại ngày với sự nhìn nhận và nhẹ lòng.',
      body:
        'Nhìn lại ngày hôm nay mà không phán xét. Ghi một điều đã làm tốt, một điều muốn học hỏi và một điều sẵn sàng buông xuống. Thở ra chậm và cho phép ngày hôm nay khép lại.',
    },
    goldenTemple: {
      title: 'Chính điện ánh vàng',
      description:
        'Không gian ấm áp với ánh sáng vàng dịu.',
    },
    rainRetreat: {
      title: 'Tịnh thất ngày mưa',
      description:
        'Không gian tĩnh lặng với âm mưa và ánh sáng trầm.',
    },
  },
};

export const smartFeatures = {
  title: 'Nhắc nhở thông minh',
  subtitle:
    'Thiết lập lời nhắc phù hợp với thói quen thực hành và lịch Phật giáo.',
  masterTitle: 'Bật thông báo thông minh',
  masterDescription:
    'Cho phép ứng dụng quản lý các lời nhắc bên dưới.',
  dailyReminder: 'Nhắc thực hành hằng ngày',
  dailyReminderDescription:
    'Nhắc bạn dành vài phút cho nghi thức hôm nay.',
  streakProtection: 'Bảo vệ chuỗi ngày',
  streakProtectionDescription:
    'Chỉ nhắc vào buổi tối khi bạn có chuỗi ngày nhưng chưa thực hành hôm nay.',
  buddhistCalendarReminder:
    'Nhắc mùng một, ngày rằm và ngày lễ',
  buddhistCalendarReminderDescription:
    'Thông báo trước một ngày cho các dịp đã đánh dấu.',
  save: 'Lưu và lên lịch',
  saving: 'Đang lên lịch...',
  permissionTitle: 'Chưa cấp quyền thông báo',
  permissionMessage:
    'Hãy cấp quyền thông báo trong cài đặt thiết bị.',
  savedTitle: 'Đã lưu lời nhắc',
  savedMessage:
    'Lịch thông báo thông minh đã được cập nhật.',
  errorTitle: 'Không thể lên lịch',
  errorMessage:
    'Đã xảy ra lỗi khi tạo thông báo.',
  dailyTitle: 'Một phút trở về',
  dailyBody:
    'Nghi thức hôm nay vẫn đang chờ bạn.',
  streakTitle: 'Giữ chuỗi thực hành',
  streakBody:
    'Một hoạt động ngắn tối nay sẽ giúp bạn giữ chuỗi ngày.',
  buddhistTitle:
    'Ngày âm {{day}}/{{month}} sắp đến',
  buddhistBody:
    'Ngày mai: {{event}}',
  widgetSectionTitle: 'Widget màn hình chính',
  widgetDescription:
    'Hiển thị chuỗi ngày và một lời nhắc ngắn trên màn hình chính.',
  refreshWidget: 'Cập nhật',
  widgetTitle: 'Bình an mỗi ngày',
  widgetSubtitle:
    'Trở về với một hơi thở chậm',
  widgetUpdatedTitle: 'Đã cập nhật widget',
  widgetUpdatedMessage:
    'Dữ liệu widget đã được làm mới.',
  widgetUnavailableTitle: 'Widget chưa khả dụng',
  widgetUnavailableMessage:
    'Widget hiện chỉ được tích hợp trên Android.',
  notice:
    'Lời nhắc thông minh được làm mới khi ứng dụng mở. Một số thiết bị có thể trì hoãn thông báo để tiết kiệm pin.',
};

export default {
  dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
};
