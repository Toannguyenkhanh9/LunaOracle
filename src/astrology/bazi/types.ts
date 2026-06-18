export type Element = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type Polarity = 'yang' | 'yin';

export type Gender = 'male' | 'female' | 'unspecified';
export type DayBoundaryMode = 'midnight' | 'ziHour';
export type TimeCorrectionMode = 'civil' | 'trueSolar';
export type LuckSect = 1 | 2;

export type StemId =
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

export type BranchId =
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

export type PillarKind = 'year' | 'month' | 'day' | 'hour';

export type TenGod =
  | 'friend'
  | 'robWealth'
  | 'eatingGod'
  | 'hurtingOfficer'
  | 'indirectWealth'
  | 'directWealth'
  | 'sevenKillings'
  | 'directOfficer'
  | 'indirectResource'
  | 'directResource';

export type StrengthLevel =
  | 'veryWeak'
  | 'weak'
  | 'balanced'
  | 'strong'
  | 'veryStrong';


export type StrengthPattern =
  | 'ordinary'
  | 'followStrongCandidate'
  | 'followWeakCandidate';

export type UsefulElementStrategy =
  | 'supportWeak'
  | 'drainStrong'
  | 'balanceDistribution'
  | 'followStrongCandidate'
  | 'followWeakCandidate';

export type ClimateProfile =
  | 'cold'
  | 'hot'
  | 'dry'
  | 'damp'
  | 'balanced';

export type StructureType = TenGod | 'dayMaster' | 'mixed';

export type SpecialPatternCandidate =
  | 'none'
  | 'followStrong'
  | 'followWeak'
  | 'dominantOutput'
  | 'dominantWealth'
  | 'dominantOfficer'
  | 'dominantResource';

export type RelationImpactTone =
  | 'supportive'
  | 'mixed'
  | 'challenging';

export type RelationDomain =
  | 'self'
  | 'family'
  | 'career'
  | 'love'
  | 'future'
  | 'social';

export type LifeDomainLevel =
  | 'low'
  | 'developing'
  | 'balanced'
  | 'favorable'
  | 'strong';

export type LoveStyle =
  | 'steady'
  | 'expressive'
  | 'independent'
  | 'intense'
  | 'reflective';

export type CareerArchetype =
  | 'leadership'
  | 'creative'
  | 'analytical'
  | 'commercial'
  | 'specialist'
  | 'independent';

export type WealthStyle =
  | 'stableAccumulation'
  | 'opportunityDriven'
  | 'valueCreation'
  | 'resourceManagement'
  | 'conservative';

export type RelationType =
  | 'stemCombination'
  | 'stemClash'
  | 'sixHarmony'
  | 'sixClash'
  | 'harm'
  | 'break'
  | 'punishment'
  | 'selfPunishment'
  | 'threeHarmony'
  | 'threeMeeting';

export interface LocalDateTimeInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
}

export interface BirthLocation {
  timeZone: string;
  longitude?: number;
  latitude?: number;
  placeName?: string;
}

export interface BaziOptions {
  timeCorrection: TimeCorrectionMode;
  dayBoundary: DayBoundaryMode;
  luckSect: LuckSect;
  luckPillarCount: number;
  includeAnnualTransits: boolean;
  annualTransitYears: number;
}

export interface BirthInput {
  localDateTime: LocalDateTimeInput;
  location: BirthLocation;
  gender: Gender;
  options?: Partial<BaziOptions>;
  displayName?: string;
}

export interface StemDefinition {
  id: StemId;
  index: number;
  han: string;
  vi: string;
  en: string;
  element: Element;
  polarity: Polarity;
}

export interface HiddenStemDefinition {
  stemId: StemId;
  weight: number;
  role: 'main' | 'middle' | 'residual';
}

export interface BranchDefinition {
  id: BranchId;
  index: number;
  han: string;
  vi: string;
  en: string;
  primaryElement: Element;
  polarity: Polarity;
  hiddenStems: HiddenStemDefinition[];
}

export interface Pillar {
  kind: PillarKind | 'luck' | 'transit';
  stem: StemDefinition;
  branch: BranchDefinition;
  text: string;
  stemTenGod: TenGod | 'dayMaster';
  hiddenStemTenGods: Array<{
    stem: StemDefinition;
    tenGod: TenGod | 'dayMaster';
    weight: number;
    role: HiddenStemDefinition['role'];
  }>;
}

export interface LunarDateInfo {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

export interface SolarTermPoint {
  name: string;
  localDateTime: LocalDateTimeInput;
}

export interface CalendarPillarResult {
  yearStemIndex: number;
  yearBranchIndex: number;
  monthStemIndex: number;
  monthBranchIndex: number;
  dayStemIndex: number;
  dayBranchIndex: number;
  hourStemIndex: number;
  hourBranchIndex: number;
  lunarDate: LunarDateInfo;
  previousJie?: SolarTermPoint;
  nextJie?: SolarTermPoint;
  providerName: string;
  providerWarnings: string[];
}

export interface TimeNormalizationResult {
  civilLocalDateTime: LocalDateTimeInput;
  correctedLocalDateTime: LocalDateTimeInput;
  utcInstantIso: string;
  timeZoneOffsetMinutes: number;
  equationOfTimeMinutes: number;
  longitudeCorrectionMinutes: number;
  totalCorrectionMinutes: number;
  warnings: string[];
}

export interface ElementContribution {
  source: string;
  element: Element;
  rawWeight: number;
  seasonalWeight: number;
}

export interface ElementAnalysis {
  raw: Record<Element, number>;
  seasonAdjusted: Record<Element, number>;
  percentages: Record<Element, number>;
  dominant: Element[];
  deficient: Element[];
  contributions: ElementContribution[];
}

export interface StrengthComponents {
  supportBalance: number;
  monthCommand: number;
  roots: number;
  visibleSupport: number;
  hiddenSupport: number;
  relationAdjustment: number;
}

export interface DayMasterStrength {
  level: StrengthLevel;
  score: number;
  supportScore: number;
  drainScore: number;
  rootScore: number;
  seasonSupport: 'supportive' | 'neutral' | 'draining';
  reasons: string[];
  confidence: 'low' | 'medium' | 'high';
  components: StrengthComponents;
  pattern: StrengthPattern;
  balanceDistance: number;
}

export interface UsefulElementAnalysis {
  favorable: Element[];
  supportive: Element[];
  unfavorable: Element[];
  climateBalancing: Element[];
  rationaleCodes: string[];
  confidence: 'low' | 'medium' | 'high';

  /** Primary useful element in the selected structural heuristic. */
  yongShen: Element | null;
  /** Helpful supporting elements after Yong Shen. */
  xiShen: Element[];
  /** Context-dependent or relatively neutral elements. */
  xianShen: Element[];
  /** Elements that tend to aggravate the structural imbalance. */
  jiShen: Element[];
  /** Elements that feed or reinforce the main Ji Shen. */
  chouShen: Element[];
  /** Transparent per-element scores used by the ranking algorithm. */
  elementScores: Record<Element, number>;
  strategy: UsefulElementStrategy;
  climateProfile: ClimateProfile;
}

export interface RelationParticipant {
  pillar: PillarKind | 'luck' | 'transit';
  stemId?: StemId;
  branchId?: BranchId;
}

export interface ChartRelation {
  type: RelationType;
  participants: RelationParticipant[];
  resultingElement?: Element;
  code: string;
}

export interface ChartStructure {
  type: StructureType;
  primaryTenGod: TenGod | 'dayMaster';
  monthCommandTenGod: TenGod | 'dayMaster';
  monthCommandStem: StemDefinition;
  isExposed: boolean;
  purityScore: number;
  stabilityScore: number;
  supportingTenGods: TenGod[];
  specialPatternCandidate: SpecialPatternCandidate;
  evidenceCodes: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface RelationImpact {
  relation: ChartRelation;
  tone: RelationImpactTone;
  weight: number;
  domains: RelationDomain[];
  code: string;
}

export interface RelationSummary {
  impacts: RelationImpact[];
  supportiveCount: number;
  mixedCount: number;
  challengingCount: number;
  spousePalaceScore: number;
  careerPalaceScore: number;
  familyScore: number;
  strongestCodes: string[];
}

export interface DomainFactor {
  code: string;
  score: number;
}

export interface BaseLifeDomainAnalysis {
  score: number;
  level: LifeDomainLevel;
  headlineCode: string;
  factorCodes: string[];
  riskCodes: string[];
  adviceCodes: string[];
  favorableElements: Element[];
  relatedTenGods: TenGod[];
  confidence: 'low' | 'medium' | 'high';
  factors: DomainFactor[];
}

export interface LoveDomainAnalysis extends BaseLifeDomainAnalysis {
  style: LoveStyle;
  spouseStars: TenGod[];
  spouseStarStrength: number;
  spousePalaceScore: number;
}

export interface CareerDomainAnalysis extends BaseLifeDomainAnalysis {
  archetype: CareerArchetype;
  structureTenGod: TenGod | 'dayMaster';
  careerPalaceScore: number;
}

export interface WealthDomainAnalysis extends BaseLifeDomainAnalysis {
  style: WealthStyle;
  directWealthStrength: number;
  indirectWealthStrength: number;
  wealthCapacityScore: number;
}

export interface LifeDomainAnalysis {
  love: LoveDomainAnalysis;
  career: CareerDomainAnalysis;
  wealth: WealthDomainAnalysis;
}

export interface TenGodDistribution {
  visible: Record<TenGod, number>;
  hidden: Record<TenGod, number>;
  combined: Record<TenGod, number>;
  dominant: TenGod[];
}

export interface LuckStart {
  direction: 'forward' | 'backward' | 'undetermined';
  years: number;
  months: number;
  days: number;
  decimalYears: number;
  referenceTerm?: SolarTermPoint;
  method: 'solarTermInterval' | 'providerFallback' | 'undetermined';
}

export interface LuckPillar {
  index: number;
  pillar: Pillar;
  startAge: number;
  endAge: number;
  approximateStartYear: number;
  approximateEndYear: number;
  relationsToNatal: ChartRelation[];
}

export interface AnnualTransit {
  year: number;
  pillar: Pillar;
  relationsToNatal: ChartRelation[];
  favorableElementHits: Element[];
  unfavorableElementHits: Element[];
}

export type TransitDomain =
  | 'overall'
  | 'love'
  | 'career'
  | 'wealth'
  | 'wellbeing';

export type TransitLevel =
  | 'challenging'
  | 'cautious'
  | 'mixed'
  | 'favorable'
  | 'strong';

export interface TransitDomainScore {
  score: number;
  level: TransitLevel;
  factorCodes: string[];
}

export interface AnnualTransitDetailed {
  year: number;
  age: number;
  pillar: Pillar;
  activeLuckPillarIndex: number | null;
  activeLuckPillar: Pillar | null;
  relationsToNatal: ChartRelation[];
  relationsToLuck: ChartRelation[];
  domainScores: Record<TransitDomain, TransitDomainScore>;
  headlineCodes: string[];
  warningCodes: string[];
}

export interface MonthlyTransitDetailed {
  year: number;
  month: number;
  pillar: Pillar;
  annualPillar: Pillar;
  relationsToNatal: ChartRelation[];
  relationsToAnnual: ChartRelation[];
  domainScores: Record<TransitDomain, TransitDomainScore>;
  headlineCodes: string[];
}

export interface Stage4TimelineOptions {
  startYear: number;
  years: number;
  includeMonthly?: boolean;
  monthlyYears?: number[];
}

export interface TransitTimeline {
  startYear: number;
  endYear: number;
  annual: AnnualTransitDetailed[];
  monthlyByYear: Record<string, MonthlyTransitDetailed[]>;
  peakYears: number[];
  cautionYears: number[];
  disclaimerCodes: string[];
}

export type CompatibilityPurpose =
  | 'general'
  | 'love'
  | 'business';

export interface CompatibilityDomainScore {
  score: number;
  level: LifeDomainLevel;
  factorCodes: string[];
}

export interface DetailedCompatibilityResult {
  purpose: CompatibilityPurpose;
  score: number;
  level: LifeDomainLevel;
  domains: {
    emotional: CompatibilityDomainScore;
    communication: CompatibilityDomainScore;
    stability: CompatibilityDomainScore;
    cooperation: CompatibilityDomainScore;
    finance: CompatibilityDomainScore;
  };
  harmonyCodes: string[];
  challengeCodes: string[];
  complementingElements: Element[];
  conflictingElements: Element[];
  disclaimerCodes: string[];
}

export type DateSelectionActivity =
  | 'wedding'
  | 'construction'
  | 'opening'
  | 'moving'
  | 'travel'
  | 'signing';

export interface DateSelectionRequest {
  activity: DateSelectionActivity;
  startDate: string;
  endDate: string;
  limit?: number;
}

export interface RecommendedDate {
  date: string;
  pillar: Pillar;
  score: number;
  level: TransitLevel;
  activity: DateSelectionActivity;
  primaryScore: number;
  partnerScore: number | null;
  reasonCodes: string[];
  warningCodes: string[];
  disclaimerCodes: string[];
}

export interface BaziStage4Analyzer {
  buildTimeline(
    chart: BaziChart,
    options: Stage4TimelineOptions,
  ): TransitTimeline;

  compare(
    first: BaziChart,
    second: BaziChart,
    purpose?: CompatibilityPurpose,
  ): DetailedCompatibilityResult;

  selectDates(
    primary: BaziChart,
    request: DateSelectionRequest,
    partner?: BaziChart,
  ): RecommendedDate[];
}

export interface InterpretationSection {
  score: number;
  level: 'low' | 'developing' | 'balanced' | 'favorable' | 'strong';
  headlineCode: string;
  strengthCodes: string[];
  cautionCodes: string[];
  adviceCodes: string[];
}

export interface BaziInterpretation {
  character: InterpretationSection;
  love: InterpretationSection;
  career: InterpretationSection;
  wealth: InterpretationSection;
  wellbeing: InterpretationSection;
}

export interface BaziChart {
  version: string;
  input: BirthInput;
  options: BaziOptions;
  normalizedTime: TimeNormalizationResult;
  lunarDate: LunarDateInfo;
  pillars: Record<PillarKind, Pillar>;
  dayMaster: StemDefinition;
  tenGods: TenGodDistribution;
  elements: ElementAnalysis;
  strength: DayMasterStrength;
  usefulElements: UsefulElementAnalysis;
  structure: ChartStructure;
  relations: ChartRelation[];
  relationSummary: RelationSummary;
  lifeDomains: LifeDomainAnalysis;
  luckStart: LuckStart;
  luckPillars: LuckPillar[];
  annualTransits: AnnualTransit[];
  interpretation: BaziInterpretation;
  warnings: string[];
  validation: InputValidationResult;
  diagnostics: ChartDiagnostics;
  meta: {
    providerName: string;
    generatedAt: string;
    standaloneSafe: true;
    inputFingerprint: string;
  };
}

export interface CalendarProvider {
  readonly name: string;
  calculate(
    localDateTime: LocalDateTimeInput,
    dayBoundary: DayBoundaryMode,
  ): CalendarPillarResult;
}

export interface EngineDependencies {
  calendarProvider: CalendarProvider;
  now?: () => Date;
}

export interface BaziEngine {
  calculate(input: BirthInput): BaziChart;
}

export type ValidationSeverity = 'error' | 'warning' | 'info';

export interface InputValidationIssue {
  code: string;
  severity: ValidationSeverity;
  field?:
    | 'localDateTime'
    | 'timeZone'
    | 'longitude'
    | 'latitude'
    | 'gender'
    | 'options';
  details?: Record<string, string | number | boolean>;
}

export interface InputValidationResult {
  valid: boolean;
  issues: InputValidationIssue[];
  errors: InputValidationIssue[];
  warnings: InputValidationIssue[];
}

export type LocalTimeStatus = 'valid' | 'ambiguous' | 'nonexistent';

export interface LocalTimeResolution {
  status: LocalTimeStatus;
  candidatesUtcIso: string[];
  selectedUtcIso: string;
}

export type DiagnosticConfidence = 'low' | 'medium' | 'high';

export interface DiagnosticSection {
  score: number;
  confidence: DiagnosticConfidence;
  codes: string[];
}

export interface ChartDiagnostics {
  overallScore: number;
  overallConfidence: DiagnosticConfidence;
  time: DiagnosticSection;
  pillars: DiagnosticSection;
  luck: DiagnosticSection;
  interpretation: DiagnosticSection;
  codes: string[];
}
