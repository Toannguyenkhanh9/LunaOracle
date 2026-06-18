import type {
  BaziStage4Analyzer,
  CalendarProvider,
} from '../types';
import {buildTransitTimeline} from './timeline';
import {compareBaziChartsDetailed} from './compatibility';
import {selectAuspiciousDates} from './dateSelection';

export function createBaziStage4Analyzer(
  provider: CalendarProvider,
): BaziStage4Analyzer {
  return {
    buildTimeline(chart, options) {
      return buildTransitTimeline(provider, chart, options);
    },

    compare(first, second, purpose = 'general') {
      return compareBaziChartsDetailed(first, second, purpose);
    },

    selectDates(primary, request, partner) {
      return selectAuspiciousDates(
        provider,
        primary,
        request,
        partner,
      );
    },
  };
}
