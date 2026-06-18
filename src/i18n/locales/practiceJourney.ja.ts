const practiceJourney = {
  title: '修習の旅',
  subtitle:
    '7日、21日、49日の旅を選び、穏やかな毎日の修習を一歩ずつ育てます。',

  homeTitle: '7/21/49日 修習の旅',
  homeSubtitle:
    '毎日の瞑想、唱念、祈り、心の日記に沿って実践します。',

  choosePlan: '修習の旅を選ぶ',
  days: '{{count}}日',
  loading: '旅を読み込み中...',
  notice:
    'この旅は習慣づくりと自己内省を支えるものです。健康、時間、状況に合わせて無理のないペースで進めてください。',

  plans: {
    7: {
      title: '7日間の穏やかな始まり',
      description:
        '短く、無理なく続けやすい修習から始めます。',
    },
    21: {
      title: '21日間の習慣づくり',
      description:
        '安定したリズムを作り、少しずつ実践を深めます。',
    },
    49: {
      title: '49日間の専心修習',
      description:
        '継続、気づき、感謝を深く育てる旅です。',
    },
  },

  startDialogTitle: '旅を始める',
  startDialogMessage:
    '今日から{{count}}日間の修習を始めますか？',
  start: '始める',
  cancel: 'キャンセル',

  stopDialogTitle: '旅を中止',
  stopDialogMessage:
    '現在の進捗が削除されます。中止しますか？',
  stop: '中止',
  stopJourney: '中止して別の旅を選ぶ',

  errorTitle: '開始できません',
  startError:
    '旅の作成中にエラーが発生しました。もう一度お試しください。',

  currentJourney: '現在の旅',
  startedOn: '{{date}}に開始',
  daysCompleted:
    '{{completed}}/{{total}}日完了',
  journeyDays: '旅の日程',

  dayNumber: '{{count}}日目',
  dayDescription:
    '第{{week}}週 · 心地よいペースで一つずつ進めましょう。',
  completed: '完了',
  inProgress: '進行中',

  open: '開く',
  manualHint:
    '関連機能を開いて実践するか、完了後に手動でチェックできます。',
  taskProgress:
    '{{current}}/{{target}} {{unit}}',

  journeyCompletedTitle:
    '修習の旅を完了しました',
  journeyCompletedMessage:
    'これまでの継続を認め、自分に合う修習をこれからも続けてください。',
  chooseAnotherPlan:
    '新しい旅を選ぶ',

  completedJourneys:
    '完了した旅',

  themes: {
    day1: '今ここに戻る',
    day2: '願いを育てる',
    day3: '内なる声を聴く',
    day4: '呼吸に安住する',
    day5: '平安の種をまく',
    day6: 'くつろぎと感謝',
    day7: 'マインドフルに一週間を結ぶ',
  },

  tasks: {
    incense: {
      title: '香を焚く',
      description:
        '香を{{target}}本焚き、1分間静かに心を整えます。',
    },
    meditation: {
      title: '瞑想',
      description:
        '少なくとも{{target}}{{unit}}瞑想します。',
    },
    chant: {
      title: '唱念',
      description:
        '念仏または真言を{{target}}{{unit}}行います。',
    },
    prayer: {
      title: '祈り',
      description:
        '心を込めた祈りを{{target}}つ書くか唱えます。',
    },
    audio: {
      title: '経典と瞑想音声',
      description:
        '心を落ち着ける内容を少なくとも{{target}}つ聴きます。',
    },
    journal: {
      title: '心安らぐ日記',
      description:
        '今日の気づきや感謝を{{target}}つ記録します。',
    },
    breath: {
      title: '呼吸を数える',
      description:
        'ゆっくり意識しながら{{target}}{{unit}}をたどります。',
    },
    dailyRitual: {
      title: '毎日の儀式',
      description:
        '今日の総合修習を{{target}}回完了します。',
    },
  },

  units: {
    incense: '本',
    meditation: '分',
    chant: '回',
    prayer: 'つ',
    audio: '件',
    journal: '件',
    breath: '呼吸',
    dailyRitual: '回',
  },
};

export default practiceJourney;
