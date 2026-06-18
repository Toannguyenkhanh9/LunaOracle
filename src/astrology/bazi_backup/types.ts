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

export interface DayMasterStrength {
  level: StrengthLevel;
  score: number;
  supportScore: number;
  drainScore: number;
  rootScore: number;
  seasonSupport: 'supportive' | 'neutral' | 'draining';
  reasons: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface UsefulElementAnalysis {
  favorable: Element[];
  supportive: Element[];
  unfavorable: Element[];
  climateBalancing: Element[];
  rationaleCodes: string[];
  confidence: 'low' | 'medium' | 'high';
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
  relations: ChartRelation[];
  luckStart: LuckStart;
  luckPillars: LuckPillar[];
  annualTransits: AnnualTransit[];
  interpretation: BaziInterpretation;
  warnings: string[];
  meta: {
    providerName: string;
    generatedAt: string;
    standaloneSafe: true;
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
