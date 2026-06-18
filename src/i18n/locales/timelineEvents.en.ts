const timelineEvents = {
  createTitle: 'Add Timeline Event',
  editTitle: 'Edit Timeline Event',

  profileLine: 'Profile: {{name}}',
  profileUnavailable: 'Profile unavailable',

  basicInformation: 'Event Information',
  eventTitle: 'Title',
  eventTitlePlaceholder:
    'Example: Changed jobs, moved home, graduated...',
  description: 'Description',
  descriptionPlaceholder:
    'Record what happened, the context, and how it felt...',

  dateTitle: 'Event Date',
  day: 'Day',
  month: 'Month',
  year: 'Year',

  categoryTitle: 'Event Category',
  categories: {
    career: 'Career',
    finance: 'Finances',
    relationship: 'Relationship',
    family: 'Family',
    health: 'Health',
    education: 'Education',
    relocation: 'Relocation',
    spiritual: 'Inner Life',
    achievement: 'Achievement',
    other: 'Other',
  },

  toneTitle: 'Event Tone',
  tones: {
    positive: 'Positive',
    neutral: 'Neutral',
    challenging: 'Challenging',
  },

  importanceTitle: 'Importance',
  importance: {
    1: 'Minor',
    2: 'Notable',
    3: 'Major milestone',
  },

  tagsTitle: 'Tags',
  tagsPlaceholder:
    'Example: work, family, transition',
  tagsHelp:
    'Separate tags with commas.',

  save: 'Save Event',
  update: 'Update Event',
  saving: 'Saving...',
  done: 'Done',

  savedTitle: 'Event Saved',
  createdMessage:
    'The event was added to the Timeline.',
  updatedMessage:
    'The event was updated.',

  sectionEyebrow: 'REAL-LIFE EVENTS',
  sectionTitle: '{{year}} Journal',
  sectionSubtitle:
    'Compare reference patterns with what actually happened.',
  add: 'Add event',

  emptyTitle: 'No events for this year',
  emptyMessage:
    'Add milestones such as work changes, relocation, relationships, health, or achievements.',

  edit: 'Edit',
  delete: 'Delete',
  cancel: 'Cancel',

  deleteTitle: 'Delete Event',
  deleteMessage:
    'Are you sure you want to delete “{{title}}”?',

  loading: 'Loading events...',

  privacyTitle: 'Personal Data',
  privacyMessage:
    'Timeline events are stored locally on this device. Do not record another person’s sensitive information without permission.',

  errors: {
    title: 'Invalid Information',
    titleRequired:
      'Please enter an event title.',
    invalidDate:
      'The event date is invalid.',
    saveFailed:
      'Unable to save the event. Please try again.',
  },
};

export default timelineEvents;
