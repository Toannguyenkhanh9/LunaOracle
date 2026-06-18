import {
  DEFAULT_OPTIONS,
  STEMS,
} from './constants';
import {analyzeTenGodDistribution} from './core/distribution';
import {analyzeElements} from './core/elements';
import {calculateLuck} from './core/luck';
import {createNatalPillars} from './core/pillars';
import {analyzeNatalRelations} from './core/relations';
import {summarizeRelations} from './core/relationSummary';
import {analyzeChartStructure} from './core/structure';
import {analyzeDayMasterStrength} from './core/strength';
import {calculateAnnualTransits} from './core/transits';
import {analyzeUsefulElements} from './core/usefulElements';
import {buildInterpretation} from './interpretation';
import {assertValidBirthInput, birthNearSolarTerm, buildChartDiagnostics} from './validation';
import {fingerprintBirthInput} from './utils/fingerprint';
import {analyzeLifeDomains} from './analysis';
import type {
  BaziChart,
  BaziEngine,
  BaziOptions,
  BirthInput,
  EngineDependencies,
} from './types';
import {normalizeBirthTime} from './utils/timezone';

export const BAZI_ENGINE_VERSION = '4.0.0';

function mergeOptions(input: BirthInput): BaziOptions {
  return {
    ...DEFAULT_OPTIONS,
    ...input.options,
    luckPillarCount: Math.max(
      0,
      Math.min(12, input.options?.luckPillarCount ?? DEFAULT_OPTIONS.luckPillarCount),
    ),
    annualTransitYears: Math.max(
      0,
      Math.min(60, input.options?.annualTransitYears ?? DEFAULT_OPTIONS.annualTransitYears),
    ),
  };
}

export function createBaziEngine(
  dependencies: EngineDependencies,
): BaziEngine {
  const now = dependencies.now ?? (() => new Date());

  return {
    calculate(input: BirthInput): BaziChart {
      const options = mergeOptions(input);
      const effectiveInput: BirthInput = {
        ...input,
        options,
      };

      const validation = assertValidBirthInput(effectiveInput);
      const normalizedTime = normalizeBirthTime(effectiveInput);
      const calendar = dependencies.calendarProvider.calculate(
        normalizedTime.correctedLocalDateTime,
        options.dayBoundary,
      );

      const pillars = createNatalPillars(calendar);
      const dayMaster = STEMS[calendar.dayStemIndex];
      const tenGods = analyzeTenGodDistribution(pillars);
      const elements = analyzeElements(pillars);
      const relations = analyzeNatalRelations(pillars);
      const strength = analyzeDayMasterStrength(pillars, elements, relations);
      const usefulElements = analyzeUsefulElements(
        pillars,
        elements,
        strength,
      );
      const structure = analyzeChartStructure(
        pillars,
        tenGods,
        strength,
        relations,
      );
      const relationSummary = summarizeRelations(relations);
      const lifeDomains = analyzeLifeDomains(
        input.gender,
        pillars,
        tenGods,
        relationSummary,
        strength,
        structure,
        usefulElements,
      );

      const luck = calculateLuck(
        effectiveInput,
        normalizedTime.correctedLocalDateTime,
        calendar,
        pillars,
        options.luckPillarCount,
        options.luckSect,
      );

      const annualTransits = options.includeAnnualTransits
        ? calculateAnnualTransits(
            dependencies.calendarProvider,
            pillars,
            usefulElements,
            now().getFullYear(),
            options.annualTransitYears,
          )
        : [];

      const interpretation = buildInterpretation(
        input.gender,
        tenGods,
        relations,
        strength,
        elements,
        usefulElements,
      );

      const warnings = Array.from(
        new Set([
          ...validation.warnings.map(item => item.code),
          ...normalizedTime.warnings,
          ...calendar.providerWarnings,
          ...luck.warnings,
          ...(birthNearSolarTerm(
            normalizedTime,
            calendar.previousJie,
            calendar.nextJie,
          )
            ? ['BIRTH_NEAR_SOLAR_TERM_BOUNDARY']
            : []),
          'INTERPRETATION_IS_TRADITIONAL_REFERENCE_NOT_CERTAINTY',
          'USEFUL_ELEMENT_ANALYSIS_IS_STRUCTURAL_HEURISTIC',
          'SPECIAL_PATTERN_CANDIDATES_REQUIRE_MANUAL_VERIFICATION',
          'LIFE_DOMAIN_ANALYSIS_IS_NOT_A_CERTAIN_PREDICTION',
          'WELLBEING_SECTION_IS_NOT_MEDICAL_ADVICE',
        ]),
      );

      const diagnostics = buildChartDiagnostics({
        validation,
        normalizedTime,
        previousJie: calendar.previousJie,
        nextJie: calendar.nextJie,
        luckStart: luck.start,
        usefulElements,
        interpretation,
        warnings,
      });

      return {
        version: BAZI_ENGINE_VERSION,
        input: effectiveInput,
        options,
        normalizedTime,
        lunarDate: calendar.lunarDate,
        pillars,
        dayMaster,
        tenGods,
        elements,
        strength,
        usefulElements,
        structure,
        relations,
        relationSummary,
        lifeDomains,
        luckStart: luck.start,
        luckPillars: luck.pillars,
        annualTransits,
        interpretation,
        warnings,
        validation,
        diagnostics,
        meta: {
          providerName: calendar.providerName,
          generatedAt: now().toISOString(),
          standaloneSafe: true,
          inputFingerprint: fingerprintBirthInput(effectiveInput),
        },
      };
    },
  };
}
