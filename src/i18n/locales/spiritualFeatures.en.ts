export const peaceJournal = {
  title: 'Peace Journal',
  subtitle:
    'A private space to reflect on emotions, gratitude, and what you are ready to release.',
  beforeMood: 'Mood before writing',
  afterMood: 'Mood after writing',
  moods: {
    peaceful: 'Peaceful',
    grateful: 'Grateful',
    neutral: 'Neutral',
    worried: 'Worried',
    sad: 'Sad',
  },
  gratitudeLabel: 'What I am grateful for today',
  gratitudePlaceholder:
    'For example: a warm meal, a kind message, or a quiet moment...',
  releaseLabel: 'What I want to let go of',
  releasePlaceholder:
    'Write down what is weighing on your heart...',
  prayerLabel: 'Today’s prayer',
  prayerPlaceholder:
    'Offer a kind wish for yourself or someone else...',
  noteLabel: 'Free note',
  notePlaceholder:
    'Write anything else you want to remember...',
  requiredTitle: 'Nothing to save',
  requiredMessage:
    'Write at least one entry before saving.',
  savedTitle: 'Journal saved',
  savedMessage:
    'Your entry was saved privately on this device.',
  saveErrorTitle: 'Unable to save',
  saveErrorMessage:
    'An error occurred while saving the journal.',
  save: 'Save journal',
  saving: 'Saving...',
  privacy:
    'Entries are stored locally on this device and are not automatically uploaded.',
  history: 'Past entries',
  empty:
    'You have not written any journal entries yet.',
  deleteTitle: 'Delete journal entry',
  deleteMessage:
    'Are you sure you want to delete this entry?',
};

export const buddhistCalendar = {
  title: 'Buddhist Calendar',
  subtitle:
    'Follow new moon days, full moon days, and selected observances based on the lunar calendar.',
  lunarDate: 'Lunar {{day}}/{{month}}',
  leapMonth: 'Leap month',
  noEvent:
    'No marked observance on this day.',
  upcomingTitle: 'Upcoming dates',
  noticeTitle: 'Notice',
  notice:
    'Observance dates may vary by tradition, region, and temple calendar. Treat this information as a reference.',
  events: {
    newMoon: 'Lunar new moon day',
    fullMoon: 'Lunar full moon day',
    maitreya: 'Maitreya Buddha observance',
    firstFullMoon: 'First full moon of the year',
    avalokitesvaraBirth:
      'Avalokitesvara birth observance',
    vesak: 'Vesak',
    traditionNote:
      'The observance date may vary by tradition.',
    avalokitesvaraEnlightenment:
      'Avalokitesvara enlightenment observance',
    ulambana: 'Ullambana Festival',
    avalokitesvaraRenunciation:
      'Avalokitesvara renunciation observance',
    amitabha: 'Amitabha Buddha observance',
    buddhaEnlightenment:
      'Buddha’s enlightenment observance',
  },
};

export const altarCustomization = {
  title: 'Personalized Altar',
  subtitle:
    'Choose lighting, flowers, lamps, and ambience for your practice space.',
  preview: 'Preview',
  cultureThemeTitle: 'Altar style',
  activeCultureTheme:
    'Current style: {{theme}}',
  cultureThemes: {
    auto: 'Automatic by language',
    vietnam: 'Vietnamese',
    china: 'Chinese',
    japan: 'Japanese',
    korea: 'Korean',
    western: 'Western',
  },
  sceneTitle: 'Time of day',
  centerpieceTitle: 'Centerpiece',
  flowerTitle: 'Flowers',
  lampTitle: 'Altar lights',
  accentTitle: 'Light color',
  soundscapeTitle: 'Ambient sound',
  petalsTitle: 'Floating petals',
  petalsDescription:
    'Show a gentle layer of slowly moving petals in the main hall.',
  save: 'Save space',
  saving: 'Saving...',
  savedTitle: 'Saved',
  savedMessage:
    'Your main hall appearance has been updated.',
  saveErrorTitle: 'Unable to save',
  saveErrorMessage:
    'An error occurred while saving your preferences.',
  reset: 'Restore defaults',
  resetTitle: 'Restore defaults',
  resetMessage:
    'Restore all altar settings to their default values?',
  soundscapeNote:
    'Ambient sound plays only while the Main Hall screen is open.',
  sceneModes: {
    auto: 'Automatic',
    dawn: 'Dawn',
    day: 'Day',
    dusk: 'Dusk',
    night: 'Night',
  },
  centerpieces: {
    buddha: 'Buddha',
    lotus: 'Lotus',
    dharmaWheel: 'Dharma wheel',
    none: 'None',
  },
  flowers: {
    lily: 'Lilies',
    lotus: 'Lotus',
    orchid: 'Orchids',
    none: 'No flowers',
  },
  lamps: {
    candle: 'Candles',
    lantern: 'Lanterns',
    lotusLamp: 'Lotus lamps',
    none: 'None',
  },
  accents: {
    amber: 'Amber',
    gold: 'Gold',
    rose: 'Rose',
    jade: 'Jade',
    none: 'None',
  },
  soundscapes: {
    none: 'No sound',
    rain: 'Temple rain',
    forest: 'Morning forest',
    bell: 'Meditation bell',
  },
};

export default {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
};
