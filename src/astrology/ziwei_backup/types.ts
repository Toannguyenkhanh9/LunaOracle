export type ZiweiGender = 'male' | 'female';
export type YinYang = 'yin' | 'yang';
export type CycleDirection = 'forward' | 'reverse';

export type HeavenlyStemId =
  | 'jia' | 'yi' | 'bing' | 'ding' | 'wu'
  | 'ji' | 'geng' | 'xin' | 'ren' | 'gui';

export type EarthlyBranchId =
  | 'zi' | 'chou' | 'yin' | 'mao' | 'chen' | 'si'
  | 'wu' | 'wei' | 'shen' | 'you' | 'xu' | 'hai';

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

export type ZiweiDiagnosticCode =
  | 'BIRTH_NEAR_HOUR_BOUNDARY'
  | 'BIRTH_AT_ZI_HOUR'
  | 'TIME_ZONE_METADATA_ONLY'
  | 'LEAP_LUNAR_MONTH';

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

export interface ZiweiCalendarProvider {
  readonly name: string;
  getLunarBirthProfile(input: LocalDateTimeInput): LunarBirthProfile;
}
