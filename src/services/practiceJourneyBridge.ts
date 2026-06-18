import {
  recordPracticeJourneyActivity,
} from './practiceJourney';

export function recordJourneyIncense(): Promise<unknown> {
  return recordPracticeJourneyActivity(
    'incense',
    1,
  );
}

export function recordJourneyMeditation(
  minutes: number,
): Promise<unknown> {
  return recordPracticeJourneyActivity(
    'meditation',
    minutes,
  );
}

export function recordJourneyChant(
  count: number,
): Promise<unknown> {
  return recordPracticeJourneyActivity(
    'chant',
    count,
  );
}

export function recordJourneyBreath(
  count: number,
): Promise<unknown> {
  return recordPracticeJourneyActivity(
    'breath',
    count,
  );
}

export function recordJourneyPrayer(): Promise<unknown> {
  return recordPracticeJourneyActivity(
    'prayer',
    1,
  );
}

export function recordJourneyAudio(): Promise<unknown> {
  return recordPracticeJourneyActivity(
    'audio',
    1,
  );
}

export function recordJourneyJournal(): Promise<unknown> {
  return recordPracticeJourneyActivity(
    'journal',
    1,
  );
}

export function recordJourneyDailyRitual(): Promise<unknown> {
  return recordPracticeJourneyActivity(
    'dailyRitual',
    1,
  );
}
