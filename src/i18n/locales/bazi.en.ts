const bazi = {
  title: 'BaZi Chart',
  subtitle:
    'Enter birth date, time, and place to calculate the Four Pillars, Five Elements, Ten Gods, luck cycles, and reflective readings.',

  birthInformation: 'Birth Information',
  displayName: 'Display Name',
  displayNamePlaceholder: 'Optional',
  solarBirthDate: 'Solar Birth Date',
  birthTime: 'Local Birth Time',
  gender: 'Gender',

  birthLocation: 'Birthplace and Time Zone',
  timeZone: 'IANA Time Zone',
  placeName: 'Place of Birth',
  placeNamePlaceholder: 'Example: Ho Chi Minh City',
  longitude: 'Longitude',
  latitude: 'Latitude',

  trueSolarTime: 'True Solar Time Correction',
  trueSolarTimeDescription:
    'Requires accurate longitude. Keep this off when the birthplace is uncertain.',

  calculate: 'Calculate BaZi Chart',
  calculating: 'Calculating chart...',

  chartResult: 'Chart Result',
  lunarDate: 'Lunar Date',
  leapMonthShort: 'leap',
  dayMaster: 'Day Master',
  strength: 'Day Master Strength',
  favorableElements: 'Favorable Elements',
  correctedTime: 'Corrected Time',
  totalCorrection: 'Total Correction',

  fourPillars: 'Four Pillars',
  fiveElements: 'Five-Element Distribution',
  usefulElements: 'Useful Elements and Balance',
  interpretation: 'Interpretation',
  luckPillars: 'Luck Pillars',

  noticeTitle: 'Notice',
  notice:
    'Results are provided for cultural reference and personal reflection. They are not certain predictions, medical advice, or financial advice.',

  units: {
    minutes: 'minutes',
  },

  genders: {
    male: 'Male',
    female: 'Female',
    unspecified: 'Unspecified',
  },

  pillars: {
    year: 'Year',
    month: 'Month',
    day: 'Day',
    hour: 'Hour',
  },

  elements: {
    wood: 'Wood',
    fire: 'Fire',
    earth: 'Earth',
    metal: 'Metal',
    water: 'Water',
  },

  strengthLevels: {
    veryWeak: 'Very Weak',
    weak: 'Weak',
    balanced: 'Balanced',
    strong: 'Strong',
    veryStrong: 'Very Strong',
  },

  tenGods: {
    dayMaster: 'Day Master',
    mixed: 'Mixed',
    friend: 'Friend',
    robWealth: 'Rob Wealth',
    eatingGod: 'Eating God',
    hurtingOfficer: 'Hurting Officer',
    indirectWealth: 'Indirect Wealth',
    directWealth: 'Direct Wealth',
    sevenKillings: 'Seven Killings',
    directOfficer: 'Direct Officer',
    indirectResource: 'Indirect Resource',
    directResource: 'Direct Resource',
  },

  analysis: {
    favorable: 'Favorable',
    supportive: 'Supportive',
    unfavorable: 'Unfavorable',
    climateBalancing: 'Climate Balancing',
  },

  common: {
    strengths: 'Strengths',
    pointsToConsider: 'Points to Consider',
    advice: 'Advice',
  },

  interpretationSections: {
    character: 'Character',
    love: 'Love',
    career: 'Career',
    wealth: 'Wealth',
    wellbeing: 'Wellbeing',
  },

  errors: {
    title: 'Invalid Information',
    invalidDate: 'The birth date is invalid.',
    invalidTime: 'Birth time must be between 00:00 and 23:59.',
    invalidTimeZone:
      'The time zone is invalid. Example: Asia/Ho_Chi_Minh.',
    longitudeRequired:
      'Longitude is required when true solar time is enabled.',
    invalidCoordinate: 'Longitude or latitude is invalid.',
    calculateFailed:
      'Unable to calculate the chart. Please review the information.',
  },

  stage2: {
    title: 'Detailed Analysis',
    subtitle:
      'Day Master strength, chart structure, useful elements, stem-branch relations, and three major life domains.',

    strengthAndStructure: 'Day Master Strength and Structure',
    strengthScore: 'Strength Score',
    primaryStructure: 'Primary Structure',
    purity: 'Purity',
    stability: 'Stability',
    supportDrainBalance: 'Support/Drain Balance',
    monthCommand: 'Month Command',
    roots: 'Roots',
    structureExposed: 'Structure Exposed',
    structureHidden: 'Structure Hidden',

    detailedUsefulElements: 'Detailed Useful Elements',
    yongShen: 'Yong Shen',
    xiShen: 'Xi Shen',
    jiShen: 'Ji Shen',
    chouShen: 'Chou Shen',
    seasonalClimate: 'Seasonal Climate',
    confidence: 'Confidence',

    relationsTitle: 'Combinations and Conflicts',
    spousePalace: 'Spouse Palace',
    careerPillar: 'Career Pillar',
    family: 'Family',

    favorableFactors: 'Favorable Factors',
    pointsToConsider: 'Points to Consider',
    suggestions: 'Growth Suggestions',

    domains: {
      love: 'Detailed Love Analysis',
      career: 'Detailed Career Analysis',
      wealth: 'Detailed Wealth Analysis',
    },

    levels: {
      low: 'Needs Foundation',
      developing: 'Developing',
      balanced: 'Balanced',
      favorable: 'Favorable',
      strong: 'Strong',
    },

    tones: {
      supportive: 'Supportive',
      mixed: 'Mixed',
      challenging: 'Challenging',
    },

    relationTypes: {
      stemCombination: 'Stem Combination',
      stemClash: 'Stem Clash',
      sixHarmony: 'Six Harmony',
      sixClash: 'Six Clash',
      harm: 'Harm',
      break: 'Break',
      punishment: 'Punishment',
      selfPunishment: 'Self-Punishment',
      threeHarmony: 'Three Harmony',
      threeMeeting: 'Three Meeting',
    },

    strategies: {
      supportWeak: 'Support a Weak Day Master',
      drainStrong: 'Drain a Strong Day Master',
      balanceDistribution: 'Balance the Distribution',
      followStrongCandidate: 'Follow-Strong Candidate',
      followWeakCandidate: 'Follow-Weak Candidate',
    },

    climates: {
      cold: 'Cold',
      hot: 'Hot',
      dry: 'Dry',
      damp: 'Damp',
      balanced: 'Balanced',
    },

    patterns: {
      ordinary: 'Ordinary Structure',
      followStrongCandidate: 'Follow-Strong Candidate',
      followWeakCandidate: 'Follow-Weak Candidate',
    },

    notice:
      'Stage 2 uses a transparent, testable structural model. Useful elements, chart structure, and readings remain traditional references rather than certain predictions.',
  },
  stage3: {
    diagnosticsTitle: 'Technical Confidence',
    diagnosticsSubtitle:
      'Assesses input quality and the stability of the calculation.',
    timeConfidence: 'Birth Time and Time Zone',
    pillarConfidence: 'Four Pillars',
    luckConfidence: 'Luck Cycles',
    interpretationConfidence: 'Interpretation',

    saveChart: 'Save Chart',
    updateSaved: 'Update Saved Chart',
    saving: 'Saving...',
    savedTitle: 'Chart Saved',
    savedMessage: 'The chart has been saved on this device.',
    saveErrorTitle: 'Unable to Save',
    saveErrorMessage: 'An error occurred while saving the chart.',

    historyTitle: 'Saved Charts',
    historySubtitle:
      'Review, share, or recalculate charts with the current engine version.',
    searchPlaceholder: 'Search by name or birthplace...',
    emptyHistoryTitle: 'No Saved Charts',
    emptyHistoryMessage:
      'Create a chart and tap Save to find it here.',
    open: 'Open',
    share: 'Share',
    recalculate: 'Recalculate',
    duplicate: 'Duplicate',
    engineVersion: 'Engine',
    deleteTitle: 'Delete Chart',
    deleteMessage: 'Are you sure you want to delete this chart?',
    recalculatedTitle: 'Chart Updated',
    recalculatedMessage:
      'The chart was recalculated with the current engine version.',
    recalculateErrorTitle: 'Unable to Update',
    recalculateErrorMessage: 'Please check the saved birth information.',

    diagnosticCodes: {
      DIAGNOSTIC_AMBIGUOUS_LOCAL_TIME:
        'The birth time occurs twice during a daylight-saving fold; the earlier UTC instant was selected.',
      DIAGNOSTIC_NONEXISTENT_LOCAL_TIME:
        'The birth time does not exist during a daylight-saving gap and was normalized.',
      DIAGNOSTIC_TRUE_SOLAR_LONGITUDE_MISSING:
        'Longitude is required for true-solar-time correction.',
      DIAGNOSTIC_TRUE_SOLAR_CROSSED_DATE:
        'True-solar-time correction crossed the local date boundary.',
      DIAGNOSTIC_LARGE_SOLAR_TIME_CORRECTION:
        'The solar-time correction is large; verify longitude and time zone.',
      DIAGNOSTIC_BIRTH_NEAR_SOLAR_TERM:
        'Birth occurred close to a solar-term boundary; the year or month pillar should be reviewed.',
      DIAGNOSTIC_BIRTH_NEAR_DAY_BOUNDARY:
        'Birth occurred close to the configured day boundary.',
      DIAGNOSTIC_PROVIDER_DAY_BOUNDARY_LIMITATION:
        'The calendar provider could not fully confirm the selected day-boundary rule.',
      DIAGNOSTIC_LUCK_DIRECTION_UNDETERMINED:
        'Gender is unspecified, so luck-cycle direction is undetermined.',
      DIAGNOSTIC_LUCK_START_PROVIDER_FALLBACK:
        'Luck-cycle start age used a fallback because adjacent solar terms were unavailable.',
      DIAGNOSTIC_USEFUL_ELEMENT_LOW_CONFIDENCE:
        'Useful-element analysis currently has low confidence.',
      DIAGNOSTIC_INTERPRETATION_SCORE_SPREAD_HIGH:
        'Interpretation domains have a wide score spread.',
      DIAGNOSTIC_TRADITIONAL_REFERENCE_ONLY:
        'Interpretation is for cultural reference and personal reflection only.',
    },
  },

  stage4: {
    title: 'Timing and Compatibility',
    subtitle:
      'Explore annual and monthly transits, compare two charts, and select dates using BaZi structure.',
    calculating: 'Calculating...',
    emptyTitle: 'No Saved Charts',
    emptyMessage:
      'Create and save at least one chart before using the Stage 4 tools.',
    primaryChart: 'Primary Chart',
    secondaryChart: 'Second Chart',
    optionalPartnerChart: 'Partner Chart (Optional)',
    noPartner: 'Do Not Use a Second Chart',

    tabs: {
      timeline: 'Timeline',
      compatibility: 'Compatibility',
      dates: 'Date Selection',
    },

    domains: {
      overall: 'Overall',
      love: 'Love',
      career: 'Career',
      wealth: 'Wealth',
      wellbeing: 'Wellbeing',
    },

    levels: {
      low: 'Low',
      developing: 'Developing',
      balanced: 'Balanced',
      favorable: 'Favorable',
      strong: 'Strong',
      challenging: 'Challenging',
      cautious: 'Cautious',
      mixed: 'Mixed',
    },

    timeline: {
      title: 'Annual and Monthly Transits',
      subtitle:
        'Ranks each year using the active luck pillar, useful elements, and relations to the natal chart.',
      yearCount: '{{count}} years',
      calculate: 'Build Timeline',
      peakYears: 'Peak Years',
      cautionYears: 'Caution Years',
      activeLuck: 'Active Luck Pillar',
      monthLabel: 'Month {{count}}',
    },

    compatibility: {
      title: 'Compare Two Charts',
      subtitle:
        'Compares emotional flow, communication, stability, cooperation, and finance.',
      calculate: 'Analyze Compatibility',
      overall: 'Overall Compatibility',
      purposes: {
        general: 'General',
        love: 'Love',
        business: 'Business',
      },
      domains: {
        emotional: 'Emotional',
        communication: 'Communication',
        stability: 'Stability',
        cooperation: 'Cooperation',
        finance: 'Finance',
      },
      complementingElements: 'Complementing Elements',
      conflictingElements: 'Elements to Balance',
    },

    dates: {
      title: 'BaZi Date Selection',
      subtitle:
        'Find structurally suitable dates for the primary chart and optionally a partner chart.',
      calculate: 'Find Suggested Dates',
      monthCount: 'Next {{count}} months',
      activities: {
        wedding: 'Wedding',
        construction: 'Construction',
        opening: 'Business Opening',
        moving: 'Moving Home',
        travel: 'Travel',
        signing: 'Contract Signing',
      },
    },

    errors: {
      noPrimaryTitle: 'No Chart Selected',
      noPrimaryMessage: 'Please select a primary chart.',
      needTwoChartsTitle: 'Two Charts Required',
      needTwoChartsMessage:
        'Please select two different charts for comparison.',
      sameChartTitle: 'Duplicate Chart',
      sameChartMessage:
        'The first and second charts must be different.',
      calculateTitle: 'Unable to Calculate',
      calculateMessage:
        'An error occurred while running the Stage 4 analysis.',
    },

    notice:
      'Stage 4 is a transparent structural model. Transit, compatibility, and date-selection results are cultural references only and do not replace real-world judgment or professional almanac consultation.',
  },
};

export default bazi;
