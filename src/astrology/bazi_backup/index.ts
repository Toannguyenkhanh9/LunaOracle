import {LunarJavascriptCalendarProvider} from './calendar';
import {createBaziEngine} from './engine';

export * from './types';
export * from './constants';
export * from './engine';
export * from './compatibility';
export * from './calendar';
export * from './core/tenGods';
export * from './core/relations';
export * from './interpretation/locales';

export function createDefaultBaziEngine() {
  return createBaziEngine({
    calendarProvider: new LunarJavascriptCalendarProvider(),
  });
}
