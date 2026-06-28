import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  recordRetentionActivity,
} from './retentionProgress';

const STORAGE_KEY =
  '@luna_oracle/relationship_timeline_v1';

export type RelationshipEventType =
  | 'firstMet'
  | 'firstDate'
  | 'conversation'
  | 'conflict'
  | 'breakup'
  | 'reunion'
  | 'milestone'
  | 'reflection';

export type RelationshipEvent = {
  id: string;
  type: RelationshipEventType;
  title: string;
  date: string;
  note?: string;
  intensity: number;
  createdAt: string;
};

export type RelationshipInsight = {
  totalEvents: number;
  conflictCount: number;
  conversationCount: number;
  averageIntensity: number;
  themeKey: string;
  themeFallback: string;
};

export const RELATIONSHIP_EVENT_TYPES:
RelationshipEventType[] = [
  'firstMet',
  'firstDate',
  'conversation',
  'conflict',
  'breakup',
  'reunion',
  'milestone',
  'reflection',
];

function createId():
string {
  return `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2)}`;
}

function todayKey():
string {
  return new Date()
    .toISOString()
    .slice(0, 10);
}

async function readEvents():
Promise<RelationshipEvent[]> {
  const raw =
    await AsyncStorage.getItem(
      STORAGE_KEY,
    );

  if (!raw) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(raw);

    return Array.isArray(parsed)
      ? parsed
      : [];
  } catch {
    return [];
  }
}

async function writeEvents(
  events: RelationshipEvent[],
): Promise<void> {
  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(events),
  );
}

export async function listRelationshipEvents():
Promise<RelationshipEvent[]> {
  const events =
    await readEvents();

  return events.sort(
    (a, b) =>
      b.date.localeCompare(
        a.date,
      ),
  );
}

export async function saveRelationshipEvent(
  input: {
    type: RelationshipEventType;
    title: string;
    date?: string;
    note?: string;
    intensity: number;
  },
): Promise<RelationshipEvent> {
  const events =
    await readEvents();

  const entry:
    RelationshipEvent = {
      id:
        createId(),
      type:
        input.type,
      title:
        input.title.trim() ||
        input.type,
      date:
        input.date || todayKey(),
      note:
        input.note?.trim() ||
        undefined,
      intensity:
        Math.max(
          1,
          Math.min(
            100,
            Math.round(
              input.intensity,
            ),
          ),
        ),
      createdAt:
        new Date().toISOString(),
    };

  await writeEvents([
    entry,
    ...events,
  ]);

  await recordRetentionActivity(
    'relationshipTimeline',
  );

  return entry;
}

export async function deleteRelationshipEvent(
  id: string,
): Promise<void> {
  const events =
    await readEvents();

  await writeEvents(
    events.filter(
      event => event.id !== id,
    ),
  );
}

export function buildRelationshipInsight(
  events: RelationshipEvent[],
): RelationshipInsight {
  const totalEvents =
    events.length;

  const conflictCount =
    events.filter(
      event =>
        event.type === 'conflict' ||
        event.type === 'breakup',
    ).length;

  const conversationCount =
    events.filter(
      event =>
        event.type === 'conversation' ||
        event.type === 'reflection',
    ).length;

  const averageIntensity =
    totalEvents
      ? Math.round(
          events.reduce(
            (sum, event) =>
              sum + event.intensity,
            0,
          ) / totalEvents,
        )
      : 0;

  let themeKey =
    'relationshipTimeline.insights.empty';

  let themeFallback =
    'Add relationship events to reveal repeating patterns.';

  if (totalEvents > 0) {
    if (
      conflictCount >
      conversationCount
    ) {
      themeKey =
        'relationshipTimeline.insights.repair';
      themeFallback =
        'This timeline asks for repair, boundaries, and calmer conversations.';
    } else if (
      conversationCount >=
      Math.max(2, conflictCount)
    ) {
      themeKey =
        'relationshipTimeline.insights.communication';
      themeFallback =
        'Conversation is becoming a stabilizing pattern in this relationship.';
    } else if (
      averageIntensity >= 75
    ) {
      themeKey =
        'relationshipTimeline.insights.intensity';
      themeFallback =
        'The connection carries strong intensity. Slow pacing may help.';
    } else {
      themeKey =
        'relationshipTimeline.insights.balance';
      themeFallback =
        'The relationship pattern looks mixed. Notice what repeats before reacting.';
    }
  }

  return {
    totalEvents,
    conflictCount,
    conversationCount,
    averageIntensity,
    themeKey,
    themeFallback,
  };
}

export async function getRelationshipTimelineDashboard():
Promise<{
  events: RelationshipEvent[];
  insight: RelationshipInsight;
}> {
  const events =
    await listRelationshipEvents();

  return {
    events,
    insight:
      buildRelationshipInsight(
        events,
      ),
  };
}
