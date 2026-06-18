export const dataSync = {
  title: 'Data Sync',
  subtitle:
    'Back up progress, journals, and preferences so they can be restored on another device.',
  cloudConfig: 'Sync configuration',
  endpoint: 'Server endpoint',
  accessToken: 'Access token',
  accessTokenPlaceholder: 'Enter your private access token',
  autoSync: 'Automatic backup',
  autoSyncDescription:
    'Upload a fresh backup when the app starts.',
  saveConfig: 'Save configuration',
  status: 'Sync status',
  lastUpload: 'Last upload',
  lastDownload: 'Last restore',
  never: 'Never',
  upload: 'Upload data to cloud',
  download: 'Restore from cloud',
  exportBackup: 'Export JSON backup',
  savedTitle: 'Configuration saved',
  savedMessage: 'Your sync settings were saved.',
  uploadedTitle: 'Backup complete',
  uploadedMessage: 'The latest data was uploaded.',
  restoreTitle: 'Restore data',
  restoreMessage:
    'Current local data may be overwritten. Continue?',
  restore: 'Restore',
  restoredTitle: 'Data restored',
  restoredMessage:
    'Data was restored from the cloud backup.',
  errorTitle: 'Unable to sync',
  errorMessage:
    'Check the server address, access token, and network connection.',
  exportError:
    'Unable to create a local backup file.',
  notice:
    'The server must support PUT /backup and GET /backup/latest. The access token is stored only on this device.',
};

export const pdfExport = {
  title: 'Export PDF Report',
  subtitle:
    'Create a report that can be stored or shared from your practice data.',
  chooseSections: 'Choose sections',
  practiceTitle: 'Practice progress',
  practiceDescription:
    'Streaks, completed sessions, and meditation time.',
  journalDescription:
    'Peace Journal entries stored on this device.',
  altarDescription:
    'Current Main Hall appearance preferences.',
  export: 'Create and share PDF',
  exporting: 'Creating PDF...',
  reportTitle: 'Peaceful Practice Report',
  generatedAt: 'Generated',
  todayProgress: "Today's progress",
  privacyNotice:
    'This report was generated on the device. Protect the file if it contains private information.',
  selectTitle: 'No section selected',
  selectMessage:
    'Select at least one section to export.',
  successTitle: 'PDF created',
  successMessage:
    'The report is ready to save or share.',
  errorTitle: 'Unable to create PDF',
  errorMessage:
    'An error occurred while creating or sharing the report.',
  notice:
    'Journal entries may contain private information. Share only with people you trust.',
};

export const premiumContent = {
  title: 'Premium Library',
  subtitle:
    'Deeper practices, guided rituals, and special spaces.',
  premiumActive: 'Premium is active',
  freePlan: 'Free plan',
  minutes: '{{count}} minutes',
  lockedTitle: 'Premium content',
  lockedMessage:
    'Upgrade to Premium to unlock this content.',
  upgrade: 'View Premium plans',
  notFound: 'Content not found.',
  themeReady:
    'This space is ready to apply from customization.',
  categories: {
    all: 'All',
    meditation: 'Meditation',
    sutra: 'Sutras',
    sleep: 'Sleep',
    ritual: 'Rituals',
    theme: 'Spaces',
  },
  items: {
    threeMinuteCalm: {
      title: 'Three Minutes to Return',
      description:
        'A short practice to soften the body and steady the breath.',
      body:
        'Sit with support and gently close your eyes. Inhale for four counts and feel the chest open. Exhale for six counts and release the shoulders. Repeat three times, then let the breath return to its natural rhythm.',
    },
    lovingKindness: {
      title: 'Loving-Kindness Meditation',
      description:
        'Cultivate gentleness toward yourself and others.',
      body:
        'Place a hand on your heart and repeat silently: May I be peaceful. May I be healthy. May I live with ease. Extend the same wishes to someone close, someone neutral, and finally to all beings.',
    },
    deepSleep: {
      title: 'Deep Sleep Relaxation',
      description:
        'Release the body gradually and prepare for sleep.',
      body:
        'Lie comfortably. Starting at the feet, notice and soften each area: calves, thighs, belly, chest, shoulders, arms, neck, and face. There is no need to force sleep; simply allow rest.',
    },
    morningRitual: {
      title: 'Morning Ritual',
      description:
        'Begin the day with breath, intention, and gratitude.',
      body:
        'Light incense or sit quietly for one minute. Name one thing you appreciate. Choose one quality to carry into the day, such as patience or kindness. Finish with three slow breaths.',
    },
    eveningRelease: {
      title: 'Evening Release Ritual',
      description:
        'Close the day with reflection and ease.',
      body:
        'Review the day without judgment. Write one thing that went well, one lesson, and one thing you are ready to release. Exhale slowly and allow the day to end.',
    },
    goldenTemple: {
      title: 'Golden Temple',
      description:
        'A warm Main Hall with gentle golden light.',
    },
    rainRetreat: {
      title: 'Rain Retreat',
      description:
        'A quiet space with rain ambience and subdued light.',
    },
  },
};

export const smartFeatures = {
  title: 'Smart Reminders',
  subtitle:
    'Set reminders that follow your practice habits and the Buddhist calendar.',
  masterTitle: 'Enable smart notifications',
  masterDescription:
    'Allow the app to manage the reminders below.',
  dailyReminder: 'Daily practice reminder',
  dailyReminderDescription:
    "A gentle prompt to complete today's ritual.",
  streakProtection: 'Protect your streak',
  streakProtectionDescription:
    'Remind you in the evening only when a streak is active and today is still empty.',
  buddhistCalendarReminder:
    'New moon, full moon, and observance reminders',
  buddhistCalendarReminderDescription:
    'Notify one day before marked dates.',
  save: 'Save and schedule',
  saving: 'Scheduling...',
  permissionTitle: 'Notification permission not granted',
  permissionMessage:
    'Enable notifications in your device settings.',
  savedTitle: 'Reminders saved',
  savedMessage:
    'The smart notification schedule was updated.',
  errorTitle: 'Unable to schedule',
  errorMessage:
    'An error occurred while creating notifications.',
  dailyTitle: 'A moment to return',
  dailyBody:
    "Today's ritual is still waiting for you.",
  streakTitle: 'Keep your practice streak',
  streakBody:
    'One short activity tonight can preserve your streak.',
  buddhistTitle:
    'Lunar date {{day}}/{{month}} is approaching',
  buddhistBody:
    'Tomorrow: {{event}}',
  widgetSectionTitle: 'Home screen widget',
  widgetDescription:
    'Show your streak and a short reminder on the home screen.',
  refreshWidget: 'Refresh',
  widgetTitle: 'Peace every day',
  widgetSubtitle:
    'Return to one slow breath',
  widgetUpdatedTitle: 'Widget updated',
  widgetUpdatedMessage:
    'The widget data was refreshed.',
  widgetUnavailableTitle: 'Widget unavailable',
  widgetUnavailableMessage:
    'The widget integration is currently Android only.',
  notice:
    'Smart reminders refresh when the app opens. Some devices may delay notifications to save battery.',
};

export default {
  dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
};
