const expertMode = {
  title: 'Expert Mode',
  subtitle:
    'Switch between an accessible view and a technical layer for deeper inspection.',
  currentMode: 'Current mode',

  modes: {
    simple: 'Simple',
    expert: 'Expert',
  },

  bar: {
    eyebrow: 'Display level',
    simpleTitle: 'Simple mode is active',
    simpleSubtitle:
      'Prioritizes clear summaries and hides most technical terminology.',
    expertTitle: 'Expert mode is active',
    expertSubtitle:
      'Shows additional calculation data, raw codes, and diagnostics.',
  },

  chooseEyebrow: 'CHOOSE A VIEW',
  chooseTitle: 'One app, two levels',
  chooseSubtitle:
    'You can switch at any time. Charts and saved profiles are not changed.',

  simple: {
    title: 'Simple Mode',
    subtitle:
      'Best for new users or quick reading.',
    items: {
      0: 'Summarized content with limited terminology.',
      1: 'Focuses on conclusions, key points, and practical guidance.',
      2: 'Hides engine diagnostics and internal codes.',
    },
  },

  expert: {
    title: 'Expert Mode',
    subtitle:
      'Best for users who want to inspect structure and methodology.',
    items: {
      0: 'Shows Ten Gods, auxiliary stars, transformations, cycles, and diagnostics.',
      1: 'Can display raw codes, indices, and technical values.',
      2: 'Explains how Timeline and Compatibility models produce results.',
    },
  },

  preferencesEyebrow: 'EXPERT PREFERENCES',
  preferencesTitle: 'Technical data to display',

  preferences: {
    calculationDetails: {
      title: 'Calculation details',
      subtitle:
        'Show technical tables, model versions, and normalized input data.',
    },
    rawCodes: {
      title: 'Raw technical codes',
      subtitle:
        'Show internal codes, stem-branch indices, and raw values for comparison.',
    },
    diagnostics: {
      title: 'Diagnostics and warnings',
      subtitle:
        'Show data-quality, birth-time, solar-term-boundary, and completeness warnings.',
    },
  },

  coverageEyebrow: 'COVERAGE',
  coverageTitle: 'What Expert Mode changes',

  coverage: {
    bazi:
      'BaZi: reveals diagnostics, Ten Gods, hidden stems, and advanced interpretation layers.',
    ziwei:
      'Zi Wei: reveals auxiliary stars, transformations, Chang Sheng cycle, major cycles, annual cycles, and diagnostics.',
    today:
      'Today: reveals stem-branch indices, raw calendar state, and auspicious-hour data.',
    timeline:
      'Timeline: reveals relationship codes, annual stem-branch indices, and model version.',
    compatibility:
      'Compatibility: reveals dimension weights, model code, and comparison inputs.',
  },

  noticeTitle: 'Limits of Expert Mode',
  notice:
    'More data does not make a result certain. These features remain cultural references for reflection and do not replace professional advice.',

  reset: 'Reset to defaults',

  home: {
    title: 'Expert Mode',
    subtitle:
      'Switch between an accessible view and deeper technical data.',
  },

  lockedTitle: 'Advanced content is hidden',
  lockedMessage:
    'Turn on Expert Mode to view this section.',

  details: {
    eyebrow: 'EXPERT DATA',
    title: 'Technical details',
    todayTitle: 'Daily calculation data',
    timelineTitle: 'Timeline model data',
    compatibilityTitle: 'Compatibility model data',

    fields: {
      modelVersion: 'Model version',
      generatedAt: 'Generated at',
      dayStemIndex: 'Day stem index',
      dayBranchIndex: 'Day branch index',
      rawDayCanChi: 'Raw day pillar',
      rawMonthCanChi: 'Raw month pillar',
      rawYearCanChi: 'Raw year pillar',
      tianShenLuck: 'Tian Shen status',
      leapMonth: 'Leap month',
      profileRelation: 'Profile relation',
      yearStemIndex: 'Year stem index',
      yearBranchIndex: 'Year branch index',
      relationCode: 'Relationship code',
      timelineTone: 'Timeline score group',
      compatibilityMode: 'Relationship mode',
      profileAId: 'First profile ID',
      profileBId: 'Second profile ID',
      calculationMethod: 'Calculation method',
      normalizedTime: 'Normalized time',
      timeZone: 'Time zone',
      correctionMinutes: 'Correction minutes',
      trueSolarTime: 'True solar time',
      diagnosticsCount: 'Diagnostic count',
      mainStarCount: 'Main-star count',
      auxiliaryStarCount: 'Auxiliary-star count',
      lifePalace: 'Life palace',
      bodyPalace: 'Body palace',
      bureau: 'Five-element bureau',
    },

    values: {
      yes: 'Yes',
      no: 'No',
      unavailable: 'Unavailable',
    },

    notes: {
      today:
        'Indices are zero-based and are provided for algorithm verification.',
      timeline:
        'Timeline scores are a stable profile-based visualization, not a complete BaZi luck-cycle calculation.',
      compatibility:
        'Dimension weights change with the selected relationship mode.',
      bazi:
        'Advanced layers appear after a chart has been calculated.',
      ziwei:
        'Stage 3–6 sections become available in Expert Mode.',
    },
  },
};

export default expertMode;
