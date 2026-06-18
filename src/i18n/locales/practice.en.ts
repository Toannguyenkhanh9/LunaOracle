const practice = {
  title: 'Daily Ritual',
  subtitle: 'Take a few minutes each day to light incense, listen, meditate, and cultivate gratitude.',
  progress: '{{completed}} of {{total}} steps completed',
  currentStreak: 'Current streak',
  longestStreak: 'Longest streak',
  practiceDays: 'Practice days',
  todayRitual: "Today's ritual",
  open: 'Open',
  markDone: 'Mark done',
  done: 'Done',
  completedTitle: "Today's ritual is complete",
  completedMessage: 'Keep the practice gentle and return tomorrow.',
  summaryTitle: 'Practice summary',
  completedRituals: 'Completed rituals',
  meditationMinutes: 'Meditation minutes',
  resetToday: 'Reset today',
  resetTitle: 'Reset ritual',
  resetMessage: "Clear today's practice progress?",
  homeTitle: "Today's ritual",
  homeProgress: '{{completed}}/{{total}} steps completed',
  days: 'days',
  steps: {
    incense: {
      title: 'Light one incense stick',
      description: 'Settle the mind and offer a kind intention.',
    },
    listening: {
      title: 'Listen to a sutra or meditation track',
      description: 'Choose one piece that helps the mind become quiet.',
    },
    meditation: {
      title: 'Breathe and meditate',
      description: 'Follow the inhale, hold, and slow exhale rhythm.',
    },
    gratitude: {
      title: 'Write one gratitude note',
      description: 'Record one small thing you appreciate today.',
    },
  },
};

export const practiceAudio = {
  favorites: 'Favorites',
  recent: 'Recent',
  emptyFavorites: 'No favorite tracks yet.',
  emptyRecent: 'No recently played tracks yet.',
  sleepTimer: 'Sleep timer',
  off: 'Off',
  stopsIn: 'Stops in {{time}}',
};

export const practiceMeditation = {
  breathHint: 'Relax your shoulders and follow the circle',
  phases: {
    inhale: 'Inhale',
    hold: 'Hold',
    exhale: 'Exhale',
  },
};

export default practice;
