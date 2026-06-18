const userProfiles = {
  tabTitle: 'Profiles',
  title: 'Shared Profiles',
  subtitle:
    'Save birth information once and reuse it across BaZi, Zi Wei, auspicious dates, and other tools.',
  add: 'Add profile',
  createTitle: 'Create Profile',
  editTitle: 'Edit Profile',
  editorSubtitle:
    'This information can be reused throughout Eastern Destiny.',
  loading: 'Loading profiles...',

  basicInformation: 'Basic Information',
  displayName: 'Display Name',
  displayNamePlaceholder: 'Example: Alex Chen',
  relationship: 'Relationship',
  gender: 'Gender',

  birthInformation: 'Birth Information',
  solarBirthDate: 'Solar Birth Date',
  birthTimeAccuracy: 'Birth-Time Accuracy',
  birthTime: 'Birth Time',
  unknownTimeNotice:
    'When the birth time is unknown, the app uses 12:00 as a temporary technical value. Some results may change significantly.',

  birthLocation: 'Birthplace and Time Zone',
  placeName: 'Place of Birth',
  placeNamePlaceholder: 'Example: Ho Chi Minh City',
  timeZone: 'IANA Time Zone',
  longitude: 'Longitude',
  latitude: 'Latitude',

  notesAndOptions: 'Notes and Options',
  notes: 'Private Notes',
  notesPlaceholder:
    'Add details that help you identify this profile...',
  favorite: 'Mark as Favorite',
  favoriteSubtitle:
    'Favorite profiles appear near the top of the list.',

  save: 'Save Profile',
  saving: 'Saving...',
  savedTitle: 'Profile Saved',
  savedMessage:
    'The profile has been saved on this device.',
  done: 'Done',

  searchPlaceholder:
    'Search by name, birthplace, or notes...',
  profileCount: '{{count}} profiles',
  favoriteCount: 'Favorites',
  summaryHint:
    'Use one profile across multiple tools without re-entering birth information.',

  importFromBazi: 'Import from Saved BaZi Charts',
  importFromBaziSubtitle:
    'Create shared profiles from BaZi charts already stored on this device.',
  importing: 'Importing profiles...',
  importCompletedTitle: 'Import Complete',
  importCompletedMessage:
    'Created {{count}} new profiles.',
  importNothingMessage:
    'There are no new charts to import.',
  importErrorTitle: 'Unable to Import',
  importErrorMessage:
    'An error occurred while reading saved BaZi charts.',

  emptyTitle: 'No Profiles Yet',
  emptyMessage:
    'Create your first profile for BaZi, Zi Wei, and auspicious-date tools.',
  createFirst: 'Create First Profile',
  noResultsTitle: 'No Profiles Found',
  noResultsMessage:
    'Try a different keyword or clear the search.',

  birthDateShort: 'Birth Date',
  birthTimeShort: 'Birth Time',
  locationShort: 'Birthplace',
  approximatePrefix: 'Approx.',

  edit: 'Edit',
  duplicate: 'Duplicate',
  delete: 'Delete',
  cancel: 'Cancel',

  deleteTitle: 'Delete Profile',
  deleteMessage:
    'Are you sure you want to delete “{{name}}”?',

  ziweiGenderTitle: 'Gender Required',
  ziweiGenderMessage:
    'Zi Wei Dou Shu requires male or female gender to construct the chart. Edit the profile first.',

  privacyTitle: 'Personal Data',
  privacyMessage:
    'Profiles are stored locally on this device in the current version. Protect your device and do not share another person’s birth data without permission.',

  profileTimeWarningTitle:
    'Birth-Time Notice',
  profileTimeUnknownMessage:
    'This profile has no confirmed birth time. The app is using 12:00 temporarily; hour-pillar and palace results may change.',
  profileTimeApproximateMessage:
    'This profile uses an approximate birth time. Some results may change if the exact time is different.',

  relationships: {
    self: 'Self',
    partner: 'Partner',
    parent: 'Parent',
    child: 'Child',
    sibling: 'Sibling',
    friend: 'Friend',
    client: 'Client',
    other: 'Other',
  },

  genders: {
    male: 'Male',
    female: 'Female',
    unspecified: 'Unspecified',
  },

  timeAccuracy: {
    exact: 'Exact',
    approximate: 'Approximate',
    unknown: 'Unknown',
  },

  actions: {
    bazi: 'BaZi',
    ziwei: 'Zi Wei',
    dates: 'Dates',
  },

  errors: {
    title: 'Invalid Information',
    displayNameRequired:
      'Please enter a display name.',
    invalidDate:
      'The solar birth date is invalid.',
    invalidTime:
      'Birth time must be between 00:00 and 23:59.',
    timeZoneRequired:
      'Please enter an IANA time zone.',
    invalidCoordinate:
      'Longitude or latitude is invalid.',
    saveFailed:
      'Unable to save the profile. Please try again.',
  },
};

export default userProfiles;
