import type {BaziChart, BaziEngine, BirthInput, PillarKind} from '../types';

export interface VerifiedBaziFixture {
  id: string;
  description: string;
  source?: string;
  verifiedBy?: string;
  input: BirthInput;
  expected: {
    pillars: Partial<Record<PillarKind, string>>;
    lunarDate?: {
      year: number;
      month: number;
      day: number;
      isLeapMonth?: boolean;
    };
    luckDirection?: BaziChart['luckStart']['direction'];
    tolerance?: {
      luckStartDecimalYears?: number;
    };
  };
}

export interface FixtureFailure {
  fixtureId: string;
  field: string;
  expected: unknown;
  actual: unknown;
}

export interface FixtureReport {
  passed: number;
  failed: number;
  failures: FixtureFailure[];
}

export function runVerifiedFixtures(
  engine: BaziEngine,
  fixtures: VerifiedBaziFixture[],
): FixtureReport {
  const failures: FixtureFailure[] = [];
  let passed = 0;

  for (const fixture of fixtures) {
    const chart = engine.calculate(fixture.input);
    const before = failures.length;

    for (const [kind, expected] of Object.entries(fixture.expected.pillars)) {
      const actual = chart.pillars[kind as PillarKind]?.text;

      if (expected !== undefined && actual !== expected) {
        failures.push({
          fixtureId: fixture.id,
          field: `pillars.${kind}`,
          expected,
          actual,
        });
      }
    }

    if (fixture.expected.lunarDate) {
      const expected = fixture.expected.lunarDate;
      const actual = chart.lunarDate;

      for (const field of ['year', 'month', 'day'] as const) {
        if (actual[field] !== expected[field]) {
          failures.push({
            fixtureId: fixture.id,
            field: `lunarDate.${field}`,
            expected: expected[field],
            actual: actual[field],
          });
        }
      }

      if (
        expected.isLeapMonth !== undefined &&
        actual.isLeapMonth !== expected.isLeapMonth
      ) {
        failures.push({
          fixtureId: fixture.id,
          field: 'lunarDate.isLeapMonth',
          expected: expected.isLeapMonth,
          actual: actual.isLeapMonth,
        });
      }
    }

    if (
      fixture.expected.luckDirection !== undefined &&
      chart.luckStart.direction !== fixture.expected.luckDirection
    ) {
      failures.push({
        fixtureId: fixture.id,
        field: 'luckStart.direction',
        expected: fixture.expected.luckDirection,
        actual: chart.luckStart.direction,
      });
    }

    if (failures.length === before) {
      passed += 1;
    }
  }

  return {
    passed,
    failed: fixtures.length - passed,
    failures,
  };
}
