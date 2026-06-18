export type ZiweiGender = 'male' | 'female';
export type YinYang = 'yin' | 'yang';
export type CycleDirection = 'forward' | 'reverse';

export type HeavenlyStemId =
  | 'jia'
  | 'yi'
  | 'bing'
  | 'ding'
  | 'wu'
  | 'ji'
  | 'geng'
  | 'xin'
  | 'ren'
  | 'gui';

export type EarthlyBranchId =
  | 'zi'
  | 'chou'
  | 'yin'
  | 'mao'
  | 'chen'
  | 'si'
  | 'wu'
  | 'wei'
  | 'shen'
  | 'you'
  | 'xu'
  | 'hai';

export type FiveElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type BureauNumber = 2 | 3 | 4 | 5 | 6;

export type ZiweiPalaceId =
  | 'life'
  | 'parents'
  | 'fortune'
  | 'property'
  | 'career'
  | 'friends'
  | 'travel'
  | 'health'
  | 'wealth'
  | 'children'
  | 'spouse'
  | 'siblings';

export type ZiweiMainStarId =
  | 'ziWei'
  | 'tianJi'
  | 'taiYang'
  | 'wuQu'
  | 'tianTong'
  | 'lianZhen'
  | 'tianFu'
  | 'taiYin'
  | 'tanLang'
  | 'juMen'
  | 'tianXiang'
  | 'tianLiang'
  | 'qiSha'
  | 'poJun';

export type ZiweiMainStarGroup = 'ziWeiGroup' | 'tianFuGroup';
export type ZiweiStarBrightness =
  | 'mien'
  | 'vuong'
  | 'dac'
  | 'binh'
  | 'ham'
  | 'notEvaluated';

export type ZiweiAuxiliaryStarId =
  | 'zuoFu'
  | 'youBi'
  | 'wenChang'
  | 'wenQu'
  | 'tianKui'
  | 'tianYue'
  | 'luCun'
  | 'qingYang'
  | 'tuoLuo'
  | 'huoXing'
  | 'lingXing'
  | 'diKong'
  | 'diJie'
  | 'tianMa'
  | 'hongLuan'
  | 'tianXi'
  | 'taoHua'
  | 'guChen'
  | 'guaXiu'
  | 'longChi'
  | 'fengGe';

export type ZiweiAuxiliaryStarCategory =
  | 'assistant'
  | 'literary'
  | 'noble'
  | 'wealth'
  | 'malefic'
  | 'mobility'
  | 'romance'
  | 'solitary'
  | 'ceremonial';

export type ZiweiAuxiliaryStarTone = 'supportive' | 'challenging' | 'mixed';

export type ZiweiAuxiliaryStarSource =
  | 'lunarMonth'
  | 'birthHour'
  | 'yearStem'
  | 'yearBranch'
  | 'derivedFromLuCun';

export type LocalDateTimeInput = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
};

export type ZiweiBirthLocation = {
  timeZone: string;
  placeName?: string;
  longitude?: number;
  latitude?: number;
};

export type ZiweiBirthInput = {
  displayName?: string;
  localDateTime: LocalDateTimeInput;
  gender: ZiweiGender;
  location: ZiweiBirthLocation;
};

export type LunarBirthProfile = {
  lunarYear: number;
  lunarMonth: number;
  lunarDay: number;
  isLeapMonth: boolean;
  yearStemId: HeavenlyStemId;
  yearBranchId: EarthlyBranchId;
  yearStemHan: string;
  yearBranchHan: string;
  birthHourBranchId: EarthlyBranchId;
  birthHourBranchIndex: number;
};

export type ZiweiPolarityProfile = {
  yearPolarity: YinYang;
  gender: ZiweiGender;
  classification:
    | 'yangMale'
    | 'yinMale'
    | 'yangFemale'
    | 'yinFemale';
  majorCycleDirection: CycleDirection;
};

export type ZiweiPalace = {
  id: ZiweiPalaceId;
  branchId: EarthlyBranchId;
  branchIndex: number;
  isLifePalace: boolean;
  isBodyPalace: boolean;
};

export type FiveElementBureau = {
  element: FiveElement;
  number: BureauNumber;
  lifePalaceStemId: HeavenlyStemId;
  lifePalaceStemIndex: number;
  lifePalaceBranchId: EarthlyBranchId;
  jiaZiIndex: number;
};

export type ZiweiMainStarPlacement = {
  id: ZiweiMainStarId;
  group: ZiweiMainStarGroup;
  anchorStarId: 'ziWei' | 'tianFu';
  offsetFromAnchor: number;
  branchId: EarthlyBranchId;
  branchIndex: number;
  palaceId: ZiweiPalaceId;
  brightness: ZiweiStarBrightness;
};

export type ZiweiMainStarAnchors = {
  ziWeiBranchId: EarthlyBranchId;
  ziWeiBranchIndex: number;
  tianFuBranchId: EarthlyBranchId;
  tianFuBranchIndex: number;
  lunarDay: number;
  bureauNumber: BureauNumber;
  quotient: number;
  adjustment: number;
};

export type ZiweiMainStarsByPalace = Record<
  ZiweiPalaceId,
  ZiweiMainStarPlacement[]
>;

export type ZiweiAuxiliaryStarPlacement = {
  id: ZiweiAuxiliaryStarId;
  category: ZiweiAuxiliaryStarCategory;
  tone: ZiweiAuxiliaryStarTone;
  source: ZiweiAuxiliaryStarSource;
  branchId: EarthlyBranchId;
  branchIndex: number;
  palaceId: ZiweiPalaceId;
  ruleCode: string;
};

export type ZiweiAuxiliaryStarsByPalace = Record<
  ZiweiPalaceId,
  ZiweiAuxiliaryStarPlacement[]
>;

export type ZiweiAuxiliaryStarSummary = {
  total: number;
  supportiveCount: number;
  challengingCount: number;
  mixedCount: number;
  byCategory: Record<ZiweiAuxiliaryStarCategory, number>;
  luCunBranchId: EarthlyBranchId;
  qingYangBranchId: EarthlyBranchId;
  tuoLuoBranchId: EarthlyBranchId;
};

export type ZiweiTransformationType = 'lu' | 'quan' | 'ke' | 'ji';
export type ZiweiTransformableStarId =
  | ZiweiMainStarId
  | 'wenChang'
  | 'wenQu'
  | 'zuoFu'
  | 'youBi';

export type ZiweiTransformationPlacement = {
  type: ZiweiTransformationType;
  starId: ZiweiTransformableStarId;
  starKind: 'main' | 'auxiliary';
  branchId: EarthlyBranchId;
  branchIndex: number;
  palaceId: ZiweiPalaceId;
  sourceYearStemId: HeavenlyStemId;
  ruleCode: string;
};

export type ZiweiTransformationsByPalace = Record<
  ZiweiPalaceId,
  ZiweiTransformationPlacement[]
>;

export type ZiweiVoidMarkerId = 'tuan' | 'triet';

export type ZiweiVoidMarkerPlacement = {
  id: ZiweiVoidMarkerId;
  branchIds: [EarthlyBranchId, EarthlyBranchId];
  branchIndexes: [number, number];
  palaceIds: [ZiweiPalaceId, ZiweiPalaceId];
  ruleCode: string;
};

export type ZiweiVoidMarkersByPalace = Record<
  ZiweiPalaceId,
  ZiweiVoidMarkerId[]
>;

export type ZiweiTrangSinhStageId =
  | 'trangSinh'
  | 'mocDuc'
  | 'quanDoi'
  | 'lamQuan'
  | 'deVuong'
  | 'suy'
  | 'benh'
  | 'tu'
  | 'mo'
  | 'tuyet'
  | 'thai'
  | 'duong';

export type ZiweiTrangSinhPlacement = {
  stageId: ZiweiTrangSinhStageId;
  sequenceIndex: number;
  branchId: EarthlyBranchId;
  branchIndex: number;
  palaceId: ZiweiPalaceId;
  direction: CycleDirection;
  ruleCode: string;
};

export type ZiweiTrangSinhByPalace = Record<
  ZiweiPalaceId,
  ZiweiTrangSinhPlacement
>;

export type ZiweiBrightnessSummary = {
  source: 'vietnamese-reference-v1';
  evaluatedCount: number;
  byBrightness: Record<Exclude<ZiweiStarBrightness, 'notEvaluated'>, number>;
};



export type ZiweiMajorCyclePlacement = {
  index: number;
  startAge: number;
  endAge: number;
  direction: CycleDirection;
  branchId: EarthlyBranchId;
  branchIndex: number;
  palaceId: ZiweiPalaceId;
  bureauNumber: BureauNumber;
  ruleCode: 'MAJOR_CYCLE_START_AT_BUREAU_AGE_FROM_LIFE_PALACE';
};

export type ZiweiMajorCycleByPalace = Record<
  ZiweiPalaceId,
  ZiweiMajorCyclePlacement[]
>;

export type ZiweiMinorCyclePlacement = {
  nominalAge: number;
  solarAge: number;
  calendarYear: number;
  direction: CycleDirection;
  startBranchId: EarthlyBranchId;
  branchId: EarthlyBranchId;
  branchIndex: number;
  palaceId: ZiweiPalaceId;
  ruleCode: 'MINOR_CYCLE_YEAR_TRIAD_START_MALE_FORWARD_FEMALE_REVERSE';
};

export type ZiweiMinorCycleByPalace = Record<
  ZiweiPalaceId,
  ZiweiMinorCyclePlacement[]
>;

export type ZiweiAnnualStarId =
  | 'taiSui'
  | 'luCun'
  | 'qingYang'
  | 'tuoLuo'
  | 'tianMa';

export type ZiweiAnnualStarTone =
  | 'supportive'
  | 'challenging'
  | 'mixed'
  | 'neutral';

export type ZiweiAnnualStarPlacement = {
  id: ZiweiAnnualStarId;
  calendarYear: number;
  sourceYearStemId: HeavenlyStemId;
  sourceYearBranchId: EarthlyBranchId;
  branchId: EarthlyBranchId;
  branchIndex: number;
  palaceId: ZiweiPalaceId;
  tone: ZiweiAnnualStarTone;
  ruleCode: string;
};

export type ZiweiAnnualCycle = {
  calendarYear: number;
  nominalAge: number;
  solarAge: number;
  yearStemId: HeavenlyStemId;
  yearBranchId: EarthlyBranchId;
  taiSuiPalaceId: ZiweiPalaceId;
  taiSuiBranchId: EarthlyBranchId;
  activeMajorCycleIndex: number | null;
  activeMajorPalaceId: ZiweiPalaceId | null;
  minorCyclePalaceId: ZiweiPalaceId;
  minorCycleBranchId: EarthlyBranchId;
  annualStars: ZiweiAnnualStarPlacement[];
  annualTransformations: ZiweiTransformationPlacement[];
  supportiveStarCount: number;
  challengingStarCount: number;
  ruleCode: 'ANNUAL_TRANSIT_NOMINAL_AGE_REFERENCE_V1';
};


export type ZiweiInterpretationLevel =
  | 'veryFavorable'
  | 'favorable'
  | 'balanced'
  | 'challenging'
  | 'veryChallenging';

export type ZiweiInterpretationConfidence = 'low' | 'medium' | 'high';

export type ZiweiInterpretationTone =
  | 'supportive'
  | 'challenging'
  | 'mixed'
  | 'neutral';

export type ZiweiInterpretationSource =
  | 'mainStar'
  | 'auxiliaryStar'
  | 'transformation'
  | 'voidMarker'
  | 'trangSinh'
  | 'bodyResidence'
  | 'majorCycle'
  | 'minorCycle'
  | 'annualStar'
  | 'annualTransformation';

export type ZiweiInterpretationEvidence = {
  code: string;
  source: ZiweiInterpretationSource;
  sourceId: string;
  palaceId: ZiweiPalaceId;
  tone: ZiweiInterpretationTone;
  scoreDelta: number;
  brightness?: ZiweiStarBrightness;
  details?: Record<string, string | number | boolean | null>;
};

export type ZiweiPalaceInterpretation = {
  palaceId: ZiweiPalaceId;
  score: number;
  level: ZiweiInterpretationLevel;
  confidence: ZiweiInterpretationConfidence;
  headlineCode: string;
  adviceCode: string;
  mainStarIds: ZiweiMainStarId[];
  auxiliaryStarIds: ZiweiAuxiliaryStarId[];
  transformationTypes: ZiweiTransformationType[];
  evidence: ZiweiInterpretationEvidence[];
  supportiveEvidence: ZiweiInterpretationEvidence[];
  challengingEvidence: ZiweiInterpretationEvidence[];
};

export type ZiweiDomainId =
  | 'self'
  | 'love'
  | 'career'
  | 'wealth'
  | 'health'
  | 'family'
  | 'travel';

export type ZiweiDomainInterpretation = {
  domainId: ZiweiDomainId;
  primaryPalaceId: ZiweiPalaceId;
  relatedPalaceIds: ZiweiPalaceId[];
  score: number;
  level: ZiweiInterpretationLevel;
  confidence: ZiweiInterpretationConfidence;
  headlineCode: string;
  adviceCode: string;
  evidence: ZiweiInterpretationEvidence[];
};

export type ZiweiAnnualInterpretation = {
  calendarYear: number;
  nominalAge: number;
  score: number;
  level: ZiweiInterpretationLevel;
  confidence: ZiweiInterpretationConfidence;
  headlineCode: string;
  adviceCode: string;
  activeMajorPalaceId: ZiweiPalaceId | null;
  minorCyclePalaceId: ZiweiPalaceId;
  taiSuiPalaceId: ZiweiPalaceId;
  evidence: ZiweiInterpretationEvidence[];
};

export type ZiweiInterpretationReport = {
  ruleset: 'ziwei-interpretation-reference-v1';
  overallScore: number;
  overallLevel: ZiweiInterpretationLevel;
  overallConfidence: ZiweiInterpretationConfidence;
  headlineCode: string;
  palaceReadings: ZiweiPalaceInterpretation[];
  palaceReadingsById: Record<ZiweiPalaceId, ZiweiPalaceInterpretation>;
  domainReadings: ZiweiDomainInterpretation[];
  domainReadingsById: Record<ZiweiDomainId, ZiweiDomainInterpretation>;
  annualReadings: ZiweiAnnualInterpretation[];
};

export type ZiweiDiagnosticCode =
  | 'BIRTH_NEAR_HOUR_BOUNDARY'
  | 'BIRTH_AT_ZI_HOUR'
  | 'TIME_ZONE_METADATA_ONLY'
  | 'LEAP_LUNAR_MONTH'
  | 'MAIN_STAR_BRIGHTNESS_NOT_EVALUATED'
  | 'AUXILIARY_STAR_RULESET_VIETNAMESE_V1'
  | 'FIRE_BELL_RULESET_VARIANT'
  | 'FOUR_TRANSFORMATIONS_YEAR_STEM_V1'
  | 'VOID_MARKERS_REFERENCE_V1'
  | 'TRANG_SINH_REFERENCE_V1'
  | 'MAIN_STAR_BRIGHTNESS_REFERENCE_V1'
  | 'BRIGHTNESS_TABLE_REQUIRES_EXPERT_REVIEW'
  | 'MAJOR_CYCLE_REFERENCE_V1'
  | 'MINOR_CYCLE_REFERENCE_V1'
  | 'ANNUAL_TRANSIT_REFERENCE_V1'
  | 'ANNUAL_BOUNDARY_REFERENCE_ONLY'
  | 'CYCLE_AGE_USES_NOMINAL_AGE'
  | 'INTERPRETATION_REFERENCE_V1'
  | 'INTERPRETATION_REQUIRES_EXPERT_REVIEW';

export type ZiweiChartStage1 = {
  version: '1.0.0';
  ruleset: 'vietnamese-traditional-v1';
  input: ZiweiBirthInput;
  lunar: LunarBirthProfile;
  polarity: ZiweiPolarityProfile;
  lifePalaceBranchId: EarthlyBranchId;
  lifePalaceBranchIndex: number;
  bodyPalaceBranchId: EarthlyBranchId;
  bodyPalaceBranchIndex: number;
  bodyResidencePalaceId: ZiweiPalaceId;
  palaces: ZiweiPalace[];
  bureau: FiveElementBureau;
  diagnostics: ZiweiDiagnosticCode[];
};

export type ZiweiChartStage2 = Omit<ZiweiChartStage1, 'version'> & {
  version: '2.0.0';
  mainStarAnchors: ZiweiMainStarAnchors;
  mainStars: ZiweiMainStarPlacement[];
  mainStarsByPalace: ZiweiMainStarsByPalace;
};

export type ZiweiChartStage3 = Omit<ZiweiChartStage2, 'version'> & {
  version: '3.0.0';
  auxiliaryStars: ZiweiAuxiliaryStarPlacement[];
  auxiliaryStarsByPalace: ZiweiAuxiliaryStarsByPalace;
  auxiliarySummary: ZiweiAuxiliaryStarSummary;
};

export type ZiweiChartStage4 = Omit<
  ZiweiChartStage3,
  'version' | 'mainStars' | 'mainStarsByPalace'
> & {
  version: '4.0.0';
  mainStars: ZiweiMainStarPlacement[];
  mainStarsByPalace: ZiweiMainStarsByPalace;
  transformations: ZiweiTransformationPlacement[];
  transformationsByPalace: ZiweiTransformationsByPalace;
  voidMarkers: ZiweiVoidMarkerPlacement[];
  voidMarkersByPalace: ZiweiVoidMarkersByPalace;
  trangSinhCycle: ZiweiTrangSinhPlacement[];
  trangSinhByPalace: ZiweiTrangSinhByPalace;
  brightnessSummary: ZiweiBrightnessSummary;
};

export type ZiweiChartStage5 = Omit<ZiweiChartStage4, 'version'> & {
  version: '5.0.0';
  cycleRuleset: 'vietnamese-cycle-reference-v1';
  majorCycles: ZiweiMajorCyclePlacement[];
  majorCyclesByPalace: ZiweiMajorCycleByPalace;
  minorCycles: ZiweiMinorCyclePlacement[];
  minorCyclesByPalace: ZiweiMinorCycleByPalace;
  annualCycles: ZiweiAnnualCycle[];
  annualCycleRange: {
    startYear: number;
    endYear: number;
    totalYears: number;
  };
};

export type ZiweiChartStage6 = Omit<ZiweiChartStage5, 'version'> & {
  version: '6.0.0';
  interpretationRuleset: 'ziwei-interpretation-reference-v1';
  interpretation: ZiweiInterpretationReport;
};

export type ZiweiChart = ZiweiChartStage6;

export interface ZiweiCalendarProvider {
  readonly name: string;
  getLunarBirthProfile(input: LocalDateTimeInput): LunarBirthProfile;
}
