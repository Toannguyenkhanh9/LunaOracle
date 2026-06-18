const practiceJourney = {
  title: 'Lộ trình tu tập',
  subtitle:
    'Chọn hành trình 7, 21 hoặc 49 ngày để xây dựng thói quen bình an từng bước.',

  homeTitle: 'Lộ trình 7/21/49 ngày',
  homeSubtitle:
    'Thực hành theo từng ngày với thiền, tụng niệm, cầu nguyện và nhật ký.',

  choosePlan: 'Chọn lộ trình phù hợp',
  days: '{{count}} ngày',
  loading: 'Đang tải lộ trình...',
  notice:
    'Lộ trình nhằm hỗ trợ xây dựng thói quen và tự chiêm nghiệm. Bạn có thể điều chỉnh nhịp độ phù hợp với sức khỏe và thời gian của mình.',

  plans: {
    7: {
      title: '7 ngày khởi đầu an nhiên',
      description:
        'Làm quen với những thực hành ngắn, nhẹ nhàng và dễ duy trì.',
    },
    21: {
      title: '21 ngày xây dựng thói quen',
      description:
        'Duy trì nhịp thực hành đều đặn và tăng dần thời lượng.',
    },
    49: {
      title: '49 ngày chuyên tâm',
      description:
        'Một hành trình sâu hơn để nuôi dưỡng sự bền bỉ, tỉnh thức và lòng biết ơn.',
    },
  },

  startDialogTitle: 'Bắt đầu lộ trình',
  startDialogMessage:
    'Bạn muốn bắt đầu lộ trình {{count}} ngày từ hôm nay?',
  start: 'Bắt đầu',
  cancel: 'Hủy',

  stopDialogTitle: 'Dừng lộ trình',
  stopDialogMessage:
    'Tiến trình hiện tại sẽ được xóa. Bạn có chắc muốn dừng không?',
  stop: 'Dừng',
  stopJourney: 'Dừng và chọn lộ trình khác',

  errorTitle: 'Không thể bắt đầu',
  startError:
    'Đã xảy ra lỗi khi tạo lộ trình. Vui lòng thử lại.',

  currentJourney: 'Lộ trình hiện tại',
  startedOn: 'Bắt đầu ngày {{date}}',
  daysCompleted:
    'Đã hoàn thành {{completed}}/{{total}} ngày',
  journeyDays: 'Các ngày trong lộ trình',

  dayNumber: 'Ngày {{count}}',
  dayDescription:
    'Tuần {{week}} · Hãy hoàn thành từng bước theo nhịp độ thoải mái.',
  completed: 'Đã hoàn thành',
  inProgress: 'Đang thực hiện',

  open: 'Mở',
  manualHint:
    'Bạn có thể mở đúng tính năng để thực hành hoặc đánh dấu thủ công khi đã hoàn thành.',
  taskProgress:
    '{{current}}/{{target}} {{unit}}',

  journeyCompletedTitle:
    'Bạn đã hoàn thành lộ trình',
  journeyCompletedMessage:
    'Hãy ghi nhận sự bền bỉ của mình và tiếp tục duy trì những thực hành phù hợp.',
  chooseAnotherPlan:
    'Chọn lộ trình mới',

  completedJourneys:
    'Lộ trình đã hoàn thành',

  themes: {
    day1: 'Trở về với hiện tại',
    day2: 'Nuôi dưỡng lời nguyện',
    day3: 'Lắng nghe chính mình',
    day4: 'An trú trong hơi thở',
    day5: 'Gieo hạt bình an',
    day6: 'Thư giãn và biết ơn',
    day7: 'Khép tuần bằng chánh niệm',
  },

  tasks: {
    incense: {
      title: 'Thắp hương',
      description:
        'Thắp {{target}} nén hương và dành một phút để lắng tâm.',
    },
    meditation: {
      title: 'Thiền',
      description:
        'Thiền ít nhất {{target}} {{unit}}.',
    },
    chant: {
      title: 'Tụng niệm',
      description:
        'Niệm Phật hoặc trì chú đủ {{target}} {{unit}}.',
    },
    prayer: {
      title: 'Cầu nguyện',
      description:
        'Viết hoặc đọc {{target}} lời nguyện chân thành.',
    },
    audio: {
      title: 'Kinh và nhạc thiền',
      description:
        'Nghe ít nhất {{target}} nội dung giúp tâm lắng dịu.',
    },
    journal: {
      title: 'Nhật ký tâm an',
      description:
        'Ghi {{target}} điều bạn nhận ra hoặc biết ơn hôm nay.',
    },
    breath: {
      title: 'Đếm hơi thở',
      description:
        'Theo dõi {{target}} {{unit}} chậm và có ý thức.',
    },
    dailyRitual: {
      title: 'Nghi thức hằng ngày',
      description:
        'Hoàn thành {{target}} nghi thức tổng hợp hôm nay.',
    },
  },

  units: {
    incense: 'nén',
    meditation: 'phút',
    chant: 'lần',
    prayer: 'lời nguyện',
    audio: 'bài',
    journal: 'mục',
    breath: 'hơi thở',
    dailyRitual: 'nghi thức',
  },
};

export default practiceJourney;
