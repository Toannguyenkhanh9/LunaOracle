import type {
  AnnualTransit,
  CalendarProvider,
  Element,
  Pillar,
  PillarKind,
  UsefulElementAnalysis,
} from '../types';
import {createPillar} from './pillars';
import {analyzeExternalPillarRelations} from './relations';

function pillarElements(pillar: Pillar): Element[] {
  return Array.from(
    new Set([
      pillar.stem.element,
      pillar.branch.primaryElement,
      ...pillar.hiddenStemTenGods.map(item => item.stem.element),
    ]),
  );
}

export function calculateAnnualTransits(
  provider: CalendarProvider,
  natal: Record<PillarKind, Pillar>,
  useful: UsefulElementAnalysis,
  startYear: number,
  count: number,
): AnnualTransit[] {
  const result: AnnualTransit[] = [];

  for (let year = startYear; year < startYear + count; year += 1) {
    // July is deliberately used to stay away from the Li Chun boundary.
    const calendar = provider.calculate(
      {
        year,
        month: 7,
        day: 1,
        hour: 12,
        minute: 0,
        second: 0,
      },
      'midnight',
    );

    const pillar = createPillar(
      'transit',
      calendar.yearStemIndex,
      calendar.yearBranchIndex,
      natal.day.stem,
    );

    const elements = pillarElements(pillar);

    result.push({
      year,
      pillar,
      relationsToNatal: analyzeExternalPillarRelations(
        pillar,
        'transit',
        natal,
      ),
      favorableElementHits: elements.filter(element =>
        useful.favorable.includes(element),
      ),
      unfavorableElementHits: elements.filter(element =>
        useful.unfavorable.includes(element),
      ),
    });
  }

  return result;
}
