const ziwei = {
  title: 'Zi Wei Dou Shu',
  subtitle:
    'Enter birth date, time, and place to build the twelve palaces, place main and auxiliary stars, Four Transformations, void markers, and the Trang Sinh cycle.',
  stage1: 'Chart Foundation',
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
  calculate: 'Build Zi Wei Chart',
  calculating: 'Building chart...',
  chartResult: 'Chart Result',
  lunarDate: 'Lunar Birth Date',
  leapMonth: 'leap month',
  yearCanChi: 'Year Stem-Branch',
  birthHourBranch: 'Birth Hour Branch',
  polarityProfile: 'Yin-Yang Gender Type',
  lifePalace: 'Life Palace',
  bodyPalace: 'Body Palace',
  bodyResidence: 'Body Resides In',
  fiveElementBureau: 'Five-Element Bureau',
  twelvePalaces: 'Twelve-Palace Chart',
  palaceList: 'Twelve Palaces',
  lifeTag: 'Life',
  bodyTag: 'Body',
  diagnosticsTitle: 'Technical Notes',
  notice:
    'The chart includes major cycles, minor cycles, annual transits, and evidence-based interpretations for the twelve palaces. Content is for cultural reference and does not replace professional advice.',
  genders: {male: 'Male', female: 'Female'},
  classifications: {
    yangMale: 'Yang Male',
    yinMale: 'Yin Male',
    yangFemale: 'Yang Female',
    yinFemale: 'Yin Female',
  },
  directions: {forward: 'Major cycles move forward', reverse: 'Major cycles move in reverse'},
  stems: {
    jia: 'Jia', yi: 'Yi', bing: 'Bing', ding: 'Ding', wu: 'Wu',
    ji: 'Ji', geng: 'Geng', xin: 'Xin', ren: 'Ren', gui: 'Gui',
  },
  branches: {
    zi: 'Zi', chou: 'Chou', yin: 'Yin', mao: 'Mao', chen: 'Chen', si: 'Si',
    wu: 'Wu', wei: 'Wei', shen: 'Shen', you: 'You', xu: 'Xu', hai: 'Hai',
  },
  palaces: {
    life: 'Life', parents: 'Parents', fortune: 'Fortune', property: 'Property',
    career: 'Career', friends: 'Friends', travel: 'Travel', health: 'Health',
    wealth: 'Wealth', children: 'Children', spouse: 'Spouse', siblings: 'Siblings',
  },
  bureaus: {
    water: 'Water {{number}} Bureau',
    wood: 'Wood {{number}} Bureau',
    metal: 'Metal {{number}} Bureau',
    earth: 'Earth {{number}} Bureau',
    fire: 'Fire {{number}} Bureau',
  },
  diagnostics: {
    BIRTH_NEAR_HOUR_BOUNDARY:
      'The birth time is near a double-hour boundary; verify the birth minute.',
    BIRTH_AT_ZI_HOUR:
      'Birth occurred during Zi hour. The day-boundary rule must remain consistent throughout the chart calculation.',
    TIME_ZONE_METADATA_ONLY:
      'The Chart Foundation records the time zone but uses the entered local wall-clock date and time directly.',
    LEAP_LUNAR_MONTH:
      'The birth date falls in a leap lunar month; preserve the leap-month flag throughout star placement.',
    MAIN_STAR_BRIGHTNESS_NOT_EVALUATED:
      'The Major Star System places the fourteen main stars; brightness states are presented under Four Transformations and Star Cycles.',
    AUXILIARY_STAR_RULESET_VIETNAMESE_V1:
      'Auxiliary stars use the declared Vietnamese ruleset v1.',
    FIRE_BELL_RULESET_VARIANT:
      'Huo Xing and Ling Xing have school-specific variants; use one consistent ruleset when comparing charts.',
    FOUR_TRANSFORMATIONS_YEAR_STEM_V1:
      'The Four Transformations use the declared Vietnamese v1 birth-year-stem table.',
    VOID_MARKERS_REFERENCE_V1:
      'Tuan and Triet use the declared stem-branch reference rules.',
    TRANG_SINH_REFERENCE_V1:
      'The Trang Sinh cycle uses the Five-Element Bureau and major-cycle direction.',
    MAIN_STAR_BRIGHTNESS_REFERENCE_V1:
      'Main-star brightness uses the versioned Vietnamese reference table v1.',
    BRIGHTNESS_TABLE_REQUIRES_EXPERT_REVIEW:
      'Brightness tables vary by school and require expert review before professional use.',
    MAJOR_CYCLE_REFERENCE_V1:
      'Major cycles use the declared Vietnamese reference rule: start at the Bureau age and move from the Life Palace.',
    MINOR_CYCLE_REFERENCE_V1:
      'Minor cycles use year-triad start branches, moving forward for male charts and reverse for female charts.',
    ANNUAL_TRANSIT_REFERENCE_V1:
      'Annual Tai Sui, Lu Cun, Qing Yang, Tuo Luo, Tian Ma, and annual Four Transformations use the Timing and Life Cycles reference rules.',
    ANNUAL_BOUNDARY_REFERENCE_ONLY:
      'Annual records currently use calendar-year granularity rather than a selectable Lunar New Year or Li-Chun boundary.',
    CYCLE_AGE_USES_NOMINAL_AGE:
      'Major, minor, and annual cycles are indexed by nominal age.',
    INTERPRETATION_REFERENCE_V1: 'Interpretations use the transparent reference model v1.',
    INTERPRETATION_REQUIRES_EXPERT_REVIEW: 'Interpretations require expert review before professional use.',
  },
  stage2Title: 'Major Star System',
  stage2Subtitle:
    'Places Zi Wei, Tian Fu, and both main-star groups from the lunar birth day and Five-Element Bureau.',
  stage2Labels: {
    ziWeiAnchor: 'Zi Wei Position',
    tianFuAnchor: 'Tian Fu Position',
    mainStarCount: 'Main-Star Count',
    mainStarLegend: 'Fourteen Main Stars',
    noMainStar: 'No main star',
    brightnessDeferred: 'Star brightness is shown under Four Transformations and Star Cycles',
  },
  starGroups: {
    ziWeiGroup: 'Zi Wei Group',
    tianFuGroup: 'Tian Fu Group',
  },
  mainStars: {
    ziWei: 'Zi Wei', tianJi: 'Tian Ji', taiYang: 'Tai Yang',
    wuQu: 'Wu Qu', tianTong: 'Tian Tong', lianZhen: 'Lian Zhen',
    tianFu: 'Tian Fu', taiYin: 'Tai Yin', tanLang: 'Tan Lang',
    juMen: 'Ju Men', tianXiang: 'Tian Xiang', tianLiang: 'Tian Liang',
    qiSha: 'Qi Sha', poJun: 'Po Jun',

  },

  stage3Title: 'Auxiliary and Challenging Stars',
  stage3Subtitle:
    'Places 21 auxiliary stars from the lunar month, birth hour, year stem, and year branch using a declared Vietnamese ruleset.',
  stage3Labels: {
    auxiliaryStarCount: 'Auxiliary-Star Count',
    supportiveCount: 'Supportive Stars',
    challengingCount: 'Challenging Stars',
    mixedCount: 'Mixed Stars',
    byCategory: 'Auxiliary Stars by Category',
    byPalace: 'Auxiliary Stars in the Twelve Palaces',
    noAuxiliaryStar: 'No auxiliary star in this palace',
    rulesetTitle: 'Active Ruleset',
    rulesetNotice:
      'Huo Xing and Ling Xing have school-specific variants. The engine uses Vietnamese ruleset v1, stores a rule code for every star, and does not silently mix an unverified brightness table.',
  },
  auxiliaryCategories: {
    assistant: 'Assistants', literary: 'Literary Stars', noble: 'Noble Helpers', wealth: 'Wealth',
    malefic: 'Challenging Stars', mobility: 'Movement', romance: 'Romance',
    solitary: 'Solitary', ceremonial: 'Ceremonial',
  },
  auxiliaryTones: {
    supportive: 'Supportive', challenging: 'Challenging', mixed: 'Mixed',
  },
  auxiliaryStars: {
    zuoFu: 'Zuo Fu', youBi: 'You Bi', wenChang: 'Wen Chang', wenQu: 'Wen Qu',
    tianKui: 'Tian Kui', tianYue: 'Tian Yue', luCun: 'Lu Cun',
    qingYang: 'Qing Yang', tuoLuo: 'Tuo Luo', huoXing: 'Huo Xing', lingXing: 'Ling Xing',
    diKong: 'Di Kong', diJie: 'Di Jie', tianMa: 'Tian Ma',
    hongLuan: 'Hong Luan', tianXi: 'Tian Xi', taoHua: 'Tao Hua',
    guChen: 'Gu Chen', guaXiu: 'Gua Xiu', longChi: 'Long Chi', fengGe: 'Feng Ge',
  },

  stage4Title: 'Four Transformations and Star Cycles',
  stage4Subtitle:
    'Places the Four Transformations, calculates Tuan and Triet, builds the twelve-stage Trang Sinh cycle, and evaluates fourteen main stars with a declared reference table.',
  stage4Labels: {
    transformationCount: 'Four Transformations',
    voidMarkerCount: 'Void Marker Sets',
    trangSinhCount: 'Life-Cycle Phases',
    brightnessCount: 'Evaluated Main Stars',
    fourTransformations: 'Four Transformations by Birth-Year Stem',
    voidMarkers: 'Tuan and Triet',
    brightnessTitle: 'Main-Star Brightness',
    trangSinhTitle: 'Trang Sinh Life Cycle',
    byPalace: 'Transformations and Star-Cycle Summary by Palace',
    rulesetTitle: 'Transformations and Star-Cycle Ruleset',
    rulesetNotice:
      'The Four Transformations, Tuan, Triet, and Trang Sinh use the declared Vietnamese v1 ruleset. The brightness table is separately versioned and should be reviewed by a qualified practitioner before professional use.',
  },
  transformations: {
    lu: 'Transformation of Prosperity',
    quan: 'Transformation of Authority',
    ke: 'Transformation of Merit',
    ji: 'Transformation of Obstruction',
  },
  voidMarkers: {
    tuan: 'Tuan Void',
    triet: 'Triet Void',
  },
  trangSinh: {
    trangSinh: 'Birth',
    mocDuc: 'Bath',
    quanDoi: 'Crown and Belt',
    lamQuan: 'Entering Office',
    deVuong: 'Imperial Peak',
    suy: 'Decline',
    benh: 'Illness',
    tu: 'Death',
    mo: 'Tomb',
    tuyet: 'Extinction',
    thai: 'Conception',
    duong: 'Nurturing',
  },
  brightness: {
    mien: 'Temple',
    vuong: 'Prosperous',
    dac: 'Favorable',
    binh: 'Neutral',
    ham: 'Fallen',
    notEvaluated: 'Not Evaluated',
  },

  stage5: {
    title: 'Timing and Life Cycles',
    subtitle:
      'Builds decade cycles, age-by-age minor cycles, and annual overlays including Tai Sui, Lu Cun, Qing Yang, Tuo Luo, Tian Ma, and annual Four Transformations.',
    majorCycleCount: 'Major Cycles',
    minorCycleCount: 'Minor-Cycle Ages',
    annualCycleCount: 'Annual Records',
    ruleset: 'Cycle Ruleset',
    rulesetName: 'Vietnamese Reference v1',
    majorCycles: 'Major Cycles',
    annualTransit: 'Annual Transit',
    nominalAge: 'Nominal Age',
    solarAge: 'Approx. Solar Age',
    activeMajorCycle: 'Active Major Cycle',
    minorCycle: 'Minor Cycle',
    annualTaiSui: 'Annual Tai Sui',
    annualTransformationCount: 'Annual Transformations',
    notStarted: 'Not started',
    annualStars: 'Annual Transit Stars',
    annualTransformations: 'Annual Four Transformations',
    annualStarNames: {
      taiSui: 'Annual Tai Sui',
      luCun: 'Annual Lu Cun',
      qingYang: 'Annual Qing Yang',
      tuoLuo: 'Annual Tuo Luo',
      tianMa: 'Annual Tian Ma',
    },
    noticeTitle: 'Timing and Life-Cycle Method',
    notice:
      'Cycles use nominal age and a declared Vietnamese reference ruleset. The annual year boundary is represented at calendar-year granularity; professional use should add an explicit Lunar New Year or Li-Chun boundary policy and expert-validated fixtures.',
  },

  stage6: {
    title: 'Comprehensive Interpretation',
    subtitle:
      'Interprets the twelve palaces, seven life domains, and annual periods with a transparent scoring model and visible evidence.',
    tabs: {overview: 'Overview', palaces: '12 Palaces', annual: 'Annual'},
    overallReading: 'Overall Reading',
    confidenceLabel: 'Confidence',
    confidence: {low: 'Low', medium: 'Medium', high: 'High'},
    lifeDomains: 'Main Life Domains',
    domains: {
      self: 'Self', love: 'Love', career: 'Career', wealth: 'Wealth',
      health: 'Health', family: 'Family', travel: 'Travel',
    },
    headlines: {
      veryFavorable: 'Strong foundation with multiple supportive factors',
      favorable: 'Generally favorable with room to develop',
      balanced: 'Relatively balanced with mixed influences',
      challenging: 'Some challenges require deliberate adjustment',
      veryChallenging: 'Higher pressure calls for caution and gradual progress',
    },
    primaryPalace: 'Primary Palace',
    palaceInterpretations: 'Twelve-Palace Interpretations',
    supportiveEvidence: 'Supportive Evidence',
    challengingEvidence: 'Points to Consider',
    noEvidence: 'No prominent factor in this group.',
    annualInterpretation: 'Annual Interpretation',
    nominalAge: 'Nominal age {{age}}',
    activeMajorPalace: 'Major-Cycle Palace',
    minorPalace: 'Minor-Cycle Palace',
    taiSuiPalace: 'Annual Tai Sui Palace',
    notAvailable: 'Not started',
    evidenceTitle: 'Interpretation Evidence',
    tones: {
      supportive: 'Supportive', challenging: 'Challenging', mixed: 'Mixed', neutral: 'Neutral',
    },
    evidenceTypes: {
      mainStar: 'Main Star', auxiliaryStar: 'Auxiliary Star', transformation: 'Four Transformation',
      voidMarker: 'Tuan/Triet', trangSinh: 'Trang Sinh Cycle', bodyResidence: 'Body resides in this palace',
      majorCycle: 'Major Cycle', minorCycle: 'Minor Cycle', annualStar: 'Annual Star',
    },
    noMainStar: 'Palace without a main star',
    advice: {
      domains: {
        self: 'Build self-awareness and understand your recurring strengths, limits, and reactions before major decisions.',
        love: 'Prioritize clear communication, healthy boundaries, and emotional steadiness.',
        career: 'Choose an environment that fits your abilities, build long-term skills, and avoid purely impulsive moves.',
        wealth: 'Use budgeting, reserves, and risk control rather than chasing short-term returns.',
        health: 'Maintain a sustainable routine and seek qualified medical care for real symptoms.',
        family: 'Encourage dialogue, shared responsibility, and respect for differences.',
        travel: 'Prepare carefully for environmental changes, broaden connections, and keep practical safety limits.',
      },
      palaces: {
        life: 'Develop self-awareness and choose a path aligned with your actual temperament.',
        parents: 'Communicate respectfully with parents and elders while maintaining appropriate boundaries.',
        fortune: 'Support inner stability through rest, reflection, and sustainable mental habits.',
        property: 'Use a long-term view for property, housing, renovation, and asset accumulation.',
        career: 'Focus on core competence, professional credibility, and collaboration.',
        friends: 'Choose trustworthy relationships and clarify interests and responsibilities.',
        travel: 'Adapt to new environments without neglecting planning and safety.',
        health: 'Use real health data and professional advice rather than relying on a chart.',
        wealth: 'Manage cash flow, debt, and investments with a concrete plan.',
        children: 'Use encouragement, listening, and realistic expectations with children or creative projects.',
        spouse: 'Build relationships through transparency, respect, and constructive conflict resolution.',
        siblings: 'Offer mutual support while avoiding dependence or excessive interference.',
      },
      annual:
        'Treat the annual reading as a reference signal and compare it with real circumstances, plans, and available resources.',
    },
    noticeTitle: 'Comprehensive Interpretation Method',
    notice:
      'Interpretations use a testable scoring model based on main stars, brightness, auxiliary stars, Four Transformations, void markers, the Trang Sinh cycle, and timing layers. They are not certain predictions and require expert validation before professional use.',
  },

  errors: {
    title: 'Invalid Information',
    calculateFailed: 'Unable to build the chart. Please review the information.',
    codes: {
      INVALID_YEAR: 'Birth year must be between 1900 and 2100.',
      INVALID_MONTH: 'The birth month is invalid.',
      INVALID_DAY: 'The birth day is invalid.',
      INVALID_BIRTH_DATE: 'The solar birth date is invalid.',
      INVALID_BIRTH_HOUR: 'Birth hour must be between 00 and 23.',
      INVALID_BIRTH_MINUTE: 'Birth minute must be between 00 and 59.',
      INVALID_TIME_ZONE: 'The IANA time zone is invalid.',
      INVALID_LONGITUDE: 'Longitude is invalid.',
      INVALID_LATITUDE: 'Latitude is invalid.',
      INVALID_COORDINATE: 'Longitude or latitude is invalid.',
    },
  },
};
export default ziwei;
