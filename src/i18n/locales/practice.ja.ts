const practice = {
  title: '毎日の修習',
  subtitle: '毎日数分、香を供え、音に耳を傾け、瞑想し、感謝の心を育てます。',
  progress: '{{completed}}/{{total}}項目完了',
  currentStreak: '現在の連続日数',
  longestStreak: '最長連続日数',
  practiceDays: '修習日数',
  todayRitual: '今日の修習',
  open: '開く',
  markDone: '完了にする',
  done: '完了',
  completedTitle: '今日の修習が完了しました',
  completedMessage: '無理のないペースを保ち、また明日戻ってきましょう。',
  summaryTitle: '修習のまとめ',
  completedRituals: '完了した儀式',
  meditationMinutes: '瞑想の合計時間',
  resetToday: '今日をリセット',
  resetTitle: '修習をリセット',
  resetMessage: '今日の進捗を消去しますか？',
  homeTitle: '今日の修習',
  homeProgress: '{{completed}}/{{total}}項目完了',
  days: '日',
  steps: {
    incense: {
      title: '香を一本供える',
      description: '心を静め、善い願いを一つ込めます。',
    },
    listening: {
      title: 'お経または瞑想音楽を聴く',
      description: '心を落ち着かせる音声を一つ選びます。',
    },
    meditation: {
      title: '呼吸瞑想',
      description: '吸う、止める、ゆっくり吐く流れに合わせます。',
    },
    gratitude: {
      title: '感謝を一つ書く',
      description: '今日ありがたいと感じた小さなことを記録します。',
    },
  },
};

export const practiceAudio = {
  favorites: 'お気に入り',
  recent: '最近再生',
  emptyFavorites: 'お気に入りはまだありません。',
  emptyRecent: '最近再生した音声はありません。',
  sleepTimer: 'スリープタイマー',
  off: 'オフ',
  stopsIn: '{{time}}後に停止',
};

export const practiceMeditation = {
  breathHint: '肩の力を抜き、円の動きに合わせます',
  phases: {
    inhale: '吸う',
    hold: '止める',
    exhale: '吐く',
  },
};

export default practice;
