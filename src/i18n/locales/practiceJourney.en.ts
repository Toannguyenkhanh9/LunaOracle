const practiceJourney = {
  title: 'Practice Journey',
  subtitle:
    'Choose a 7, 21, or 49-day journey and build a peaceful daily practice step by step.',

  homeTitle: '7/21/49-Day Journey',
  homeSubtitle:
    'Follow daily meditation, chanting, prayer, and journaling practices.',

  choosePlan: 'Choose a journey',
  days: '{{count}} days',
  loading: 'Loading journey...',
  notice:
    'This journey supports habit building and personal reflection. Adjust the pace to suit your health, time, and circumstances.',

  plans: {
    7: {
      title: '7 Days of Gentle Beginnings',
      description:
        'Begin with short, accessible practices that are easy to maintain.',
    },
    21: {
      title: '21 Days to Build a Habit',
      description:
        'Develop a steady rhythm and gradually deepen your practice.',
    },
    49: {
      title: '49 Days of Dedicated Practice',
      description:
        'A deeper journey to cultivate consistency, awareness, and gratitude.',
    },
  },

  startDialogTitle: 'Start journey',
  startDialogMessage:
    'Start the {{count}}-day journey today?',
  start: 'Start',
  cancel: 'Cancel',

  stopDialogTitle: 'Stop journey',
  stopDialogMessage:
    'Your current progress will be removed. Are you sure?',
  stop: 'Stop',
  stopJourney: 'Stop and choose another journey',

  errorTitle: 'Unable to start',
  startError:
    'An error occurred while creating the journey. Please try again.',

  currentJourney: 'Current journey',
  startedOn: 'Started on {{date}}',
  daysCompleted:
    '{{completed}}/{{total}} days completed',
  journeyDays: 'Journey days',

  dayNumber: 'Day {{count}}',
  dayDescription:
    'Week {{week}} · Complete each step at a comfortable pace.',
  completed: 'Completed',
  inProgress: 'In progress',

  open: 'Open',
  manualHint:
    'Open the related feature to practice, or mark the task manually when completed.',
  taskProgress:
    '{{current}}/{{target}} {{unit}}',

  journeyCompletedTitle:
    'Journey completed',
  journeyCompletedMessage:
    'Acknowledge your consistency and continue the practices that support you.',
  chooseAnotherPlan:
    'Choose a new journey',

  completedJourneys:
    'Completed journeys',

  themes: {
    day1: 'Return to the Present',
    day2: 'Nurture Intention',
    day3: 'Listen Within',
    day4: 'Rest in the Breath',
    day5: 'Plant Seeds of Peace',
    day6: 'Relax and Give Thanks',
    day7: 'Close the Week Mindfully',
  },

  tasks: {
    incense: {
      title: 'Light Incense',
      description:
        'Light {{target}} incense stick and spend one quiet minute settling the mind.',
    },
    meditation: {
      title: 'Meditation',
      description:
        'Meditate for at least {{target}} {{unit}}.',
    },
    chant: {
      title: 'Chanting',
      description:
        'Complete {{target}} {{unit}} of Buddha-name recitation or mantra practice.',
    },
    prayer: {
      title: 'Prayer',
      description:
        'Write or recite {{target}} sincere prayer.',
    },
    audio: {
      title: 'Sutras and Meditation Audio',
      description:
        'Listen to at least {{target}} calming selection.',
    },
    journal: {
      title: 'Peace Journal',
      description:
        'Write {{target}} reflection or point of gratitude from today.',
    },
    breath: {
      title: 'Breath Counting',
      description:
        'Follow {{target}} slow, mindful {{unit}}.',
    },
    dailyRitual: {
      title: 'Daily Ritual',
      description:
        'Complete {{target}} guided daily ritual.',
    },
  },

  units: {
    incense: 'stick',
    meditation: 'minutes',
    chant: 'counts',
    prayer: 'prayer',
    audio: 'selection',
    journal: 'entry',
    breath: 'breaths',
    dailyRitual: 'ritual',
  },
};

export default practiceJourney;
