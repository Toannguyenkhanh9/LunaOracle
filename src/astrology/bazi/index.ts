import {LunarJavascriptCalendarProvider} from './calendar';
import {createBaziEngine} from './engine';
import {createBaziStage4Analyzer} from './stage4';

export * from './types';
export * from './constants';
export * from './engine';
export * from './compatibility';
export * from './calendar';
export * from './core/tenGods';
export * from './core/relations';
export * from './core/structure';
export * from './core/relationSummary';
export * from './analysis';
export * from './interpretation/locales';
export * from './validation';
export * from './stage4';
export * from './utils/timezone';
export * from './utils/fingerprint';

export function createDefaultBaziEngine() {
  return createBaziEngine({
    calendarProvider: new LunarJavascriptCalendarProvider(),
  });
}

export function createDefaultBaziStage4Analyzer() {
  return createBaziStage4Analyzer(new LunarJavascriptCalendarProvider());
}
