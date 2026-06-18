import bazi from './bazi.en';
import ziwei from './ziwei.en';
import practice, {
  practiceAudio,
  practiceMeditation,
} from './practice.en';
import {
  peaceJournal,
  buddhistCalendar,
  altarCustomization,
} from './spiritualFeatures.en';
import {
  dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
} from './spiritualFeatures10_13.en';
import chantCounter
  from './chantCounter.en';
  import practiceJourney
  from './practiceJourney.en';
  import astrologyHome
  from './astrologyHome.en';
  import userProfiles
  from './userProfiles.en';
  import today
  from './today.en';
  import insightFeatures
  from './insightFeatures.en';
  import expertMode
  from './expertMode.en';
  import timelineEvents
  from './timelineEvents.en';
  import engagementFeatures
  from './engagementFeatures.en';
  import glossary
  from './glossary.en';
  import adsFeatures
  from './adsFeatures.en';
const en = {
  common: {
    cancel: 'Cancel',
    delete: 'Delete',
    reset: 'Reset',
    loading: 'Loading...',
  },

  tabs: {
    home: 'Home',
    temple: 'Temple',
    meditation: 'Meditation',
    prayer: 'Prayer',
  },

  home: {
    title: 'iPagoda',

    subtitle: 'A quiet space to meditate, pray, and listen to yourself.',

    activities: 'Activities',

    templeTitle: 'Main hall',
    templeSubtitle: 'Light incense and strike the wooden fish',

    meditationTitle: 'Meditation',
    meditationSubtitle: 'Meditate for 5 to 15 minutes',

    prayerTitle: 'Prayer',
    prayerSubtitle: 'Keep your prayers private',

    audioTitle: 'Sounds',
    audioSubtitle: 'Listen to wooden fish and temple bells',

    settingsTitle: 'Settings',
    settingsSubtitle: 'Language and app information',

    dailyTitle: "Today's reminder",

    dailyText:
      'Take a few minutes to breathe slowly, let go of worry, and think of one thing you are grateful for.',
    lunarCalendarTitle: 'Lunar Calendar',
    lunarCalendarSubtitle: 'View new moon and full moon days',
    spiritualAudioTitle: 'Sutras and Meditation',

    spiritualAudioSubtitle:
      'Listen to sutras, meditation music, and nature sounds',
    welcome: 'Peace Every Day',

    peacefulSpace: 'A Peaceful Space',

    heroTitle: 'Return to Inner Peace',

    enterTemple: 'Enter the Main Hall',

    discover: 'Discover',

    footerQuote: 'When the mind is peaceful, every place becomes a sanctuary.',
    fortuneStickTitle: 'Fortune Sticks',

    fortuneStickSubtitle: 'Draw a reflective message for mindfulness',
    horoscopeTitle: 'Horoscope and Auspicious Dates',

    horoscopeSubtitle: 'View lunar birth date, zodiac, and suggested dates',
     baziTitle: 'BaZi Chart',

  baziSubtitle:
    'Four Pillars, elements, luck cycles, and interpretation',
    baziHistoryTitle:
  'Saved BaZi Charts',

baziHistorySubtitle:
  'Review and manage saved BaZi charts',
  baziStage4Title:
  'Timing and Compatibility',

baziStage4Subtitle:
  'Transits, chart comparison, and date selection',
  organizedActivitiesTitle: 'Spaces for your practice',
practiceSectionEyebrow: 'PRACTICE',
practiceSectionTitle: 'Practice',
practiceSectionSubtitle:
  'Activities that calm the mind and support a steady daily routine',
calendarSectionEyebrow: 'TIME & RITUAL',
calendarSectionTitle: 'Calendar and Rituals',
calendarSectionSubtitle:
  'Follow lunar dates, observances, and important practice days',
reflectionSectionEyebrow: 'REFLECTION',
reflectionSectionTitle: 'Reflection',
reflectionSectionSubtitle:
  'Traditional content for cultural reference and personal reflection',
peaceJournalShortTitle: 'Journal',
peaceJournalShortSubtitle:
  'Record emotions, gratitude, and what you are ready to release',
newMoonFullMoonTitle: 'New Moon and Full Moon',
newMoonFullMoonSubtitle:
  'Follow lunar observance days and prepare your rituals',
buddhistFestivalTitle: 'Buddhist Observances',
buddhistFestivalSubtitle:
  'View Vesak, Ullambana, and other common observance days',
practiceReminderTitle: 'Practice Reminders',
practiceReminderSubtitle:
  'Choose reminders for meditation, chanting, and daily rituals',
chooseDateTitle: 'Auspicious Dates',
chooseDateSubtitle:
  'Reference dates for weddings, openings, and important events',
    ziweiTitle: 'Zi Wei Dou Shu',
  ziweiSubtitle: 'Enter birth date, time, and place to build the twelve palaces, place main and auxiliary stars, Four Transformations, void markers, and the Trang Sinh cycle.y',
  },

  temple: {
    title: 'Main hall',

    description: 'Keep a calm mind and perform each activity slowly.',

    motto: 'Peace in every breath',

    noIncense: 'No incense has been lit',

    lightIncense: 'Light incense',

    incenseCount: 'Lit: {{count}} incense sticks',

    woodenFish: 'Wooden fish',

    woodenFishCount: '{{count}}/108',

    bell: 'Temple bell',

    bellCount: '{{count}} times',

    completedTitle: 'You completed 108 strikes',

    completedText: 'Sit quietly for a minute and notice your breath.',

    resetCounter: 'Reset wooden fish counter',

    resetDialogTitle: 'Reset counter',

    resetDialogMessage: 'Reset the wooden fish count to 0?',
    longPressHint: 'Tap to play once • Press and hold to play continuously',

    playingContinuously: 'Playing continuously',

    tapToStop: 'Tap to stop',
    lightIncenseShort: 'Light incense',
    incenseShortCount: '{{count}} sticks',
    incenseStatsTitle: 'Incense sticks',
  },

meditation: {
  title: 'Meditation',
  screenTitle: 'Meditation',

  subtitle:
    'Sit comfortably, relax your shoulders, and gently focus on each breath.',

  breathingTitle: 'Breathing Meditation',

  chooseDuration: 'Choose Duration',

  minutes: '{{count}} minutes',
  minuteUnit: 'minutes',
  heroMinutes: '{{count}} minutes',

  start: 'Start Meditation',
  pause: 'Pause Meditation',
  restart: 'Meditate Again',

  ready: 'Ready',
  paused: 'Paused',
  running: 'Meditating',

  resetTime: 'Reset Time',

  completedTitle: 'Meditation Complete',

  completedMessage:
    'Breathe slowly and take a moment to notice how you feel.',

  breathTitle: 'Breathing Guide',

  inhale: 'Inhale slowly for 4 seconds',

  hold: 'Hold your breath for 2 seconds',

  exhale: 'Exhale slowly for 6 seconds',
},

  prayer: {
    title: 'Prayer journal',

    subtitle:
      'Your entries are stored on this device and are not uploaded automatically.',

    placeholder: 'Write what you are praying for or grateful for...',

    save: 'Save prayer',

    savedItems: 'Saved entries',

    empty: 'You have not saved any prayers.',

    requiredTitle: 'No content',

    requiredMessage: 'Enter your prayer first.',

    savedTitle: 'Saved',

    savedMessage: 'Your prayer is stored privately on this device.',

    saveErrorTitle: 'Unable to save',

    saveErrorMessage: 'An error occurred while saving your prayer.',

    deleteDialogTitle: 'Delete prayer',

    deleteDialogMessage: 'Are you sure you want to delete this entry?',
    writeTitle: 'Write a Prayer',

    writeHint: 'Your content is stored privately on your device.',

    privateLabel: 'Private',

    savedCount: '{{count}} saved entries',

    emptyTitle: 'No Saved Prayers',

    savedPrivately: 'Stored Privately',
  },

  audio: {
    title: 'Temple Sounds',

    subtitle: 'Listen to the sounds used in the main hall.',

    woodenFishTitle: 'Wooden Fish Sound',

    playWoodenFish: 'Play Wooden Fish',

    bellTitle: 'Temple Bell Sound',

    playBell: 'Play Temple Bell',

    tapOrHoldHint: 'Tap to play once • Press and hold to play continuously',

    playingContinuously: 'Playing Continuously',

    tapToStop: 'Tap to stop',
  },
  settings: {
    title: 'Settings',

    notifications: 'Notifications',

    notificationsDescription:
      'Meditation and lunar observance reminders will be added later.',

    language: 'Language',

    languageDescription: 'Choose the language used by the app.',

    chooseLanguage: 'Choose language',

    privacy: 'Privacy',

    privacyDescription:
      'Your prayer journal is currently stored only on this device.',

    information: 'Information',

    version: 'Online Temple version 0.0.1',
  },
  lunarCalendar: {
    title: 'Lunar Calendar',

    subtitle: 'View lunar dates, new moon days, and full moon days.',

    today: 'Today',

    firstDay: 'First Lunar Day',

    fullMoon: 'Full Moon',

    solarDate: 'Solar Date',

    lunarDate: 'Lunar Date',

    lunarMonth: 'Lunar Month {{month}}',

    leapMonth: 'leap month',

    firstDayTitle: 'Today is the first lunar day',

    fullMoonTitle: 'Today is the full moon day',

    observanceMessage:
      'Take a little time to meditate, reflect, or listen to a sutra.',
  },
  lunarNotifications: {
    channelName: 'Lunar Calendar Reminders',

    channelDescription: 'Reminders for the first lunar day and full moon day.',

    settingTitle: 'First-Day and Full-Moon Reminders',

    settingDescription:
      'Receive a notification on the first and fifteenth lunar days.',

    reminderTime: 'Reminder Time',

    settingNote:
      'The app schedules reminders for the next 12 months and refreshes them when the app opens.',

    firstDayTitle: 'Today Is the First Lunar Day',

    fullMoonTitle: 'Today Is the Full Moon Day',

    reminderBody:
      'Take a few quiet minutes to meditate, pray, or listen to a sutra.',

    permissionTitle: 'Notifications Are Disabled',

    permissionMessage:
      'Please allow notifications in your device settings to receive lunar calendar reminders.',

    enabledTitle: 'Lunar Reminders Enabled',

    enabledMessage: '{{count}} reminders were scheduled at {{time}}.',

    errorTitle: 'Unable to Schedule Reminders',

    errorMessage:
      'An error occurred while scheduling lunar calendar reminders.',
  },
  spiritualAudio: {
    title: 'Sutras and Meditation',

    subtitle:
      'Listen to peaceful audio for relaxation, meditation, and mindfulness.',

    searchPlaceholder: 'Search audio...',

    playing: 'Playing',

    paused: 'Paused',

    empty: 'No matching audio was found.',

    categories: {
      sutra: 'Sutras',
      meditation: 'Meditation',
      nature: 'Nature',
    },

    tracks: {
      greatCompassion: {
        title: 'Great Compassion Mantra',

        description: 'A peaceful chant for relaxation and mindfulness.',
      },

      heartSutra: {
        title: 'Heart Sutra',

        description: 'A calm and solemn recitation of the Heart Sutra.',
      },

      buddhaName: {
        title: 'Buddha Name Chanting',

        description: 'Gentle Buddha-name chanting for a peaceful mind.',
      },

      breathing: {
        title: 'Breathing Meditation',

        description: 'Focus on your breath and gradually relax your body.',
      },

      deepRelaxation: {
        title: 'Deep Relaxation',

        description: 'Gentle meditation audio for rest and peaceful sleep.',
      },

      singingBowl: {
        title: 'Singing Bowl Meditation',

        description: 'Singing bowl sounds for focus and inner calm.',
      },

      templeRain: {
        title: 'Rain at the Temple',

        description: 'Gentle rain sounds in a peaceful temple atmosphere.',
      },

      forestBirds: {
        title: 'Forest Birds',

        description: 'Natural forest ambience with birds and rustling leaves.',
      },

      flowingStream: {
        title: 'Flowing Stream',

        description: 'Soft stream sounds for relaxation and sleep.',
      },
    },
  },
  dailyPracticeNotifications: {
    channelName: 'Daily Practice Reminders',

    channelDescription: 'Daily reminders for meditation and sutra practice.',

    settingTitle: 'Meditation or Sutra Reminder',

    settingDescription: 'Receive a daily notification at your selected time.',

    practiceType: 'Reminder Type',

    typeMeditation: 'Meditation',

    typeSutra: 'Sutra',

    typeBoth: 'Both',

    reminderTime: 'Reminder Time',

    previewLabel: 'Notification Preview',

    settingNote: 'The notification will repeat every day at the selected time.',

    meditationTitle: 'It Is Time to Meditate',

    meditationBody: 'Take a few slow breaths and give yourself a quiet moment.',

    sutraTitle: 'It Is Time to Chant or Listen to a Sutra',

    sutraBody:
      'Take a few quiet minutes to chant, listen, and settle your mind.',

    bothTitle: 'It Is Time for Your Daily Practice',

    bothBody:
      'Choose a short meditation or listen to a sutra for a peaceful moment.',

    permissionTitle: 'Notifications Are Disabled',

    permissionMessage: 'Please allow notifications in your device settings.',

    enabledTitle: 'Daily Reminder Enabled',

    enabledMessage: 'The app will remind you every day at {{time}}.',

    errorTitle: 'Unable to Schedule Reminder',

    errorMessage: 'An error occurred while scheduling the daily reminder.',
  },
  fortuneStick: {
    title: 'Fortune Sticks',

    subtitle:
      'Calm your mind, think about what concerns you, and draw a message for reflection.',

    intentionLabel: 'What Are You Praying For?',

    intentionPlaceholder: 'Optional: write what is currently on your mind...',

    drawing: 'Drawing a stick...',

    drawHint: 'Breathe slowly, settle your mind, and tap the button below.',

    drawingButton: 'Drawing',

    drawButton: 'Draw a Fortune Stick',

    stickNumber: 'Stick No.',

    interpretationTitle: 'Interpretation',

    adviceTitle: 'Advice',

    drawAgain: 'Draw Again',

    save: 'Save',

    saving: 'Saving...',

    savedTitle: 'Fortune Saved',

    savedMessage: 'The fortune has been saved on your device.',

    saveErrorTitle: 'Unable to Save',

    saveErrorMessage: 'An error occurred while saving the fortune.',

    historyTitle: 'Saved Fortunes',

    historyCount: '{{count}} saved',

    emptyHistory: 'You have not saved any fortunes yet.',

    deleteTitle: 'Delete Saved Fortune',

    deleteMessage: 'Are you sure you want to delete this fortune?',

    disclaimer:
      'Fortune-stick content is provided only for personal reflection and should not replace professional advice or real-world decisions.',

    levels: {
      great: 'Excellent',
      good: 'Good',
      neutral: 'Neutral',
      caution: 'Caution',
    },
  },
  horoscope: {
  title: 'Horoscope and Auspicious Dates',

  subtitle:
    'Enter a solar birth date to view the lunar date, zodiac sign, and suggested dates for important activities.',

  subtitleExtended:
    'Enter the solar birth date and time, gender, and interpretation school to view the lunar profile, reflective life insights, and suggested dates.',

  birthDateTitle: 'Solar Birth Date',

  day: 'Day',

  month: 'Month',

  year: 'Year',

  birthTimeTitle: 'Birth Time',

  hour: 'Hour',

  minute: 'Minute',

  birthTimeHint: 'Local time at the place of birth',

  genderTitle: 'Gender',

  schoolTitle: 'Interpretation School',

  selectedMethod: 'Current Method',

  activityTitle: 'Activity',

  searchPeriod: 'Search Period',

  monthCount: '{{count}} months',

  calculate: 'Convert and Find Suggested Dates',

  calculateExtended: 'Create Profile and Find Suggested Dates',

  calculating: 'Calculating...',

  invalidDateTitle: 'Invalid Birth Date',

  invalidInputTitle: 'Invalid Information',

  invalidDateMessage:
    'Please enter a valid solar calendar date.',

  invalidTimeMessage:
    'Birth time must be between 00:00 and 23:59.',

  profileTitle: 'Birth Information',

  lunarBirthDate: 'Lunar Birth Date',

  birthHourBranch: 'Birth-Hour Branch',

  zodiac: 'Zodiac',

  canChiYear: 'Sexagenary Year',

  profileGender: 'Gender',

  profileSchool: 'Interpretation School',

  yearPolarity: 'Birth-Year Polarity',

  cycleDirection: 'Reference Cycle Direction',

  leapMonth: 'leap month',

  resultsTitle: 'Suggested Dates',

  resultsSubtitle:
    'Dates are ranked by a cultural reference score.',

  resultsSubtitleExtended:
    'Dates are ranked according to the selected school, birth zodiac, and birth-hour branch.',

  lunarDateLine: 'Lunar {{day}}/{{month}}/{{year}}',

  suitableReasons: 'Favorable Points',

  cautionReasons: 'Points to Consider',

  lifeOverviewTitle: 'Love and Career',

  lifeOverviewSubtitle:
    'Reflective readings based on the entered birth date, birth time, and selected interpretation school.',

  lifeStrengths: 'Strengths',

  lifeCautions: 'Points to Balance',

  lifeAdvice: 'Growth Suggestions',

  disclaimer:
    'Results are provided for cultural reference and personal reflection only. They should not be the sole basis for marriage, construction, investment, or other important decisions.',

  disclaimerExtended:
    'This is a simplified reflective model based on the lunar calendar, birth zodiac, birth hour, and the weighting preset of the selected school. It is not a complete Zi Wei Dou Shu or BaZi chart and should not be the sole basis for important decisions.',

  activities: {
    wedding: 'Wedding',
    construction: 'Construction',
    opening: 'Business Opening',
    moving: 'Moving Home',
    travel: 'Travel',
  },

  genders: {
    male: 'Male',
    female: 'Female',
    unspecified: 'Unspecified',
  },

  schools: {
    folkTitle: 'Combined Folk Method',
    folkDescription:
      'Balances traditional auspicious-day rules, zodiac relations, birth hour, and common cultural customs.',

    baziTitle: 'BaZi Reference',
    baziDescription:
      'Places greater emphasis on the birth zodiac, birth-hour branch, harmony, and clash relationships.',

    ziweiTitle: 'Zi Wei Reference',
    ziweiDescription:
      'Uses a reflective weighting inspired by Zi Wei timing ideas and the relationship between birth information and the selected day.',

    almanacTitle: 'Traditional Almanac',
    almanacDescription:
      'Prioritizes almanac suitability, avoidance rules, auspicious days, and traditional lunar-day cautions.',
  },

  polarity: {
    yang: 'Yang',
    yin: 'Yin',
  },

  directions: {
    forward: 'Forward',
    backward: 'Backward',
    neutral: 'Undetermined',
  },

  schoolNotes: {
    folk:
      'The result uses a balanced combination of folk customs, almanac factors, zodiac relations, and birth-hour references.',

    bazi:
      'The result gives more weight to zodiac and birth-hour harmony or clash relationships as a simplified BaZi reference.',

    ziwei:
      'The result uses a simplified Zi Wei-inspired timing preset for cultural reflection only.',

    almanac:
      'The result gives the greatest weight to traditional almanac suitability, avoidance, and lunar-day rules.',
  },

  ratings: {
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    caution: 'Consider',
  },

  lifeRatings: {
    veryStrong: 'Very Strong',
    favorable: 'Favorable',
    balanced: 'Balanced',
    developing: 'Developing',
  },

  love: {
    title: 'Love',

    styles: {
      warm: 'Warm and Expressive',
      steady: 'Steady and Loyal',
      independent: 'Independent and Direct',
      sensitive: 'Sensitive and Intuitive',
    },

    summaries: {
      warm:
        'You may express affection openly and value emotional warmth, closeness, and sincere appreciation.',

      steady:
        'You may prefer trust that grows gradually, stable commitment, and a relationship built through consistent care.',

      independent:
        'You may value honesty, personal space, and a relationship that allows both people to keep their individuality.',

      sensitive:
        'You may notice emotional details quickly and seek a relationship with empathy, reassurance, and mutual understanding.',
    },
  },

  career: {
    title: 'Career',

    styles: {
      leadership: 'Leadership-Oriented',
      creative: 'Creative and Expressive',
      analytical: 'Analytical and Structured',
      supportive: 'Supportive and Service-Oriented',
      entrepreneurial: 'Entrepreneurial and Adaptive',
    },

    summaries: {
      leadership:
        'You may work well when taking responsibility, coordinating people, and turning a direction into clear action.',

      creative:
        'You may thrive in work that values imagination, communication, design, storytelling, or original problem-solving.',

      analytical:
        'You may perform best when work requires planning, research, systems thinking, precision, and careful decisions.',

      supportive:
        'You may contribute strongly in collaborative, advisory, teaching, care, or service-centered roles.',

      entrepreneurial:
        'You may be drawn to initiative, experimentation, independent projects, and opportunities that reward adaptability.',
    },
  },

  reasons: {
    hoangDao: 'Auspicious almanac day',

    hacDao: 'Inauspicious almanac day',

    traditionalSuitable:
      'Traditionally suitable for this activity',

    traditionalAvoid:
      'Traditionally advised against this activity',

    zodiacClash:
      'Day branch clashes with birth zodiac',

    sixHarmony: 'Six-harmony relationship',

    threeHarmony: 'Three-harmony relationship',

    nguyetKy: 'Traditional Nguyet Ky day',

    tamNuong: 'Traditional Tam Nuong day',

    preferredLunarDay:
      'Preferred lunar day in the reference rules',

    weekendConvenient: 'Weekend convenience',

    birthHourClash:
      'The day branch clashes with the birth-hour branch',

    birthHourHarmony:
      'The day branch forms six harmony with the birth hour',

    birthHourThreeHarmony:
      'The day branch forms three harmony with the birth hour',

    birthLunarDayResonance:
      'The lunar day corresponds with the lunar birth day',

    school_folk:
      'Scored with the combined folk method',

    school_bazi:
      'Scored with the BaZi reference preset',

    school_ziwei:
      'Scored with the Zi Wei reference preset',

    school_almanac:
      'Scored with the traditional almanac preset',
  },

  insights: {
    loveHarmony:
      'The birth zodiac and birth-hour branch form a six-harmony relationship.',

    loveThreeHarmony:
      'The birth zodiac and birth-hour branch belong to a three-harmony group.',

    loveInnerConflict:
      'The birth zodiac and birth-hour branch form a clash, which may reflect inner tension between closeness and personal needs.',

    loveSelfAwareness:
      'The lunar birth day suggests a tendency toward reflection and emotional self-awareness.',

    loveWarmHeart:
      'You may show affection generously and create a warm emotional atmosphere.',

    loveExpressive:
      'You are often able to express care through words, actions, and visible attention.',

    loveOvergiving:
      'You may sometimes give too much before checking whether your own needs are being met.',

    loveSetBoundaries:
      'Practice clear and kind boundaries so care remains balanced.',

    loveReceiveCare:
      'Allow others to support you instead of always being the giver.',

    loveLoyal:
      'You may value loyalty, reliability, and long-term commitment.',

    lovePatient:
      'You are often willing to give a relationship time to develop.',

    loveReserved:
      'You may keep feelings inside until they become difficult to explain.',

    loveSpeakClearly:
      'Express needs early and clearly rather than expecting others to guess.',

    loveCreateRituals:
      'Create small shared routines that strengthen trust and connection.',

    loveRespectsSpace:
      'You may respect individuality and understand the need for personal space.',

    loveHonest:
      'You may prefer direct and honest communication in relationships.',

    loveNeedsFreedom:
      'Too much restriction may make you withdraw or become emotionally distant.',

    loveBalanceFreedom:
      'Balance independence with consistent emotional presence.',

    loveSharePlans:
      'Share plans and expectations so freedom does not feel like distance.',

    loveEmpathetic:
      'You may understand subtle emotional changes and respond with empathy.',

    loveIntuitive:
      'You may rely strongly on intuition when reading a relationship.',

    loveOverthinking:
      'Sensitivity may turn into overthinking when communication is unclear.',

    loveTrustSlowly:
      'Let trust grow through repeated actions instead of assumptions.',

    loveAskDirectly:
      'Ask direct questions when uncertain rather than interpreting silence.',

    careerPersistent:
      'You may progress through persistence and a willingness to keep moving forward.',

    careerReflective:
      'You may learn well through review, reflection, and adjusting your approach.',

    careerActionOriented:
      'Yang polarity may support initiative, visible action, and decisive movement.',

    careerObservant:
      'Yin polarity may support observation, patience, timing, and thoughtful preparation.',

    careerLeadership:
      'You may be comfortable guiding others and setting a clear direction.',

    careerResponsibility:
      'You often take ownership of results and follow through on commitments.',

    careerOvercontrol:
      'Taking too much control may limit collaboration or create unnecessary pressure.',

    careerDelegate:
      'Delegate clearly and allow others room to contribute in their own way.',

    careerListenBeforeDeciding:
      'Collect different viewpoints before making important decisions.',

    careerCreative:
      'You may generate original ideas and see possibilities others overlook.',

    careerExpression:
      'Communication, design, storytelling, or presentation may be natural strengths.',

    careerScattered:
      'Too many ideas at once may make it difficult to finish the most important work.',

    careerBuildPortfolio:
      'Build a visible body of completed work to turn creativity into opportunity.',

    careerFinishOneThing:
      'Choose one priority and finish it before expanding to the next idea.',

    careerAnalytical:
      'You may be skilled at examining details, patterns, and cause-and-effect relationships.',

    careerPlanning:
      'Structured preparation may help you reduce risk and improve consistency.',

    careerPerfectionism:
      'Waiting for perfect information may delay useful action.',

    careerSetMilestones:
      'Break large goals into measurable milestones with clear deadlines.',

    careerDecideWithEnoughData:
      'Act when the information is sufficient, even if it is not complete.',

    careerTeamwork:
      'You may strengthen a team through cooperation, reliability, and emotional awareness.',

    careerService:
      'You may find meaning in work that helps, teaches, supports, or improves the lives of others.',

    careerPeoplePleasing:
      'Trying to satisfy everyone may reduce your energy and blur your priorities.',

    careerProtectEnergy:
      'Set limits around time and emotional labor so your contribution remains sustainable.',

    careerShowYourContribution:
      'Communicate your results clearly instead of assuming others will notice them.',

    careerInitiative:
      'You may be willing to begin before conditions are completely certain.',

    careerAdaptability:
      'You may adjust quickly when circumstances, markets, or plans change.',

    careerRiskTaking:
      'Enthusiasm for opportunity may lead to taking risks without enough protection.',

    careerValidateRisk:
      'Test assumptions with small experiments before making a large commitment.',

    careerKeepCashReserve:
      'Maintain a financial reserve when pursuing independent or uncertain opportunities.',
  },
  },
  bazi,
  ziwei,
  practice,
  practiceAudio,
  practiceMeditation, 
    peaceJournal,
  buddhistCalendar,
  altarCustomization,
    dataSync,
  pdfExport,
  premiumContent,
  smartFeatures,
  chantCounter,
  practiceJourney,
  astrologyHome,
  userProfiles,
  today,
  insightFeatures,
  expertMode,
  timelineEvents,
  ...engagementFeatures,
    ...glossary,
     ...adsFeatures,
} as const;

export default en;
