import {
  getDailyQuestDashboard,
} from './oracleEngagement';

import {
  getRetentionProgress,
  recordRetentionActivity,
} from './retentionProgress';

import {
  getOracleJourneyDashboard,
} from './oracleJourney';

import {
  getMoodDashboard,
} from './moodTracker';

import {
  buildDreamStats,
} from './dreamJournal';

import {
  getRelationshipTimelineDashboard,
} from './relationshipTimeline';

export async function buildUserProgressHub() {
  await recordRetentionActivity(
    'userProgress',
  ).catch(() => {});

  const [
    oracle,
    retention,
    journey,
    mood,
    dreams,
    relationship,
  ] = await Promise.all([
    getDailyQuestDashboard(),
    getRetentionProgress(),
    getOracleJourneyDashboard(),
    getMoodDashboard(),
    buildDreamStats(),
    getRelationshipTimelineDashboard(),
  ]);

  return {
    oracle,
    retention,
    journey,
    mood,
    dreams,
    relationship,
  };
}
