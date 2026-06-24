import AsyncStorage
  from '@react-native-async-storage/async-storage';

import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

import {
  buildMysticHomeFeed,
} from './mysticHomeFeed';

const SETTINGS_KEY =
  '@luna_oracle/smart_notifications_v1';

const CHANNEL_ID =
  'luna_oracle_daily';

export type SmartNotificationSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  loveEnabled: boolean;
  tarotEnabled: boolean;
  forecastEnabled: boolean;
};

const DEFAULT_SETTINGS:
SmartNotificationSettings = {
  enabled: true,
  hour: 8,
  minute: 30,
  loveEnabled: true,
  tarotEnabled: true,
  forecastEnabled: true,
};

export async function getSmartNotificationSettings():
Promise<SmartNotificationSettings> {
  const raw =
    await AsyncStorage.getItem(
      SETTINGS_KEY,
    );

  if (!raw) {
    return DEFAULT_SETTINGS;
  }

  try {
    return {
      ...DEFAULT_SETTINGS,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSmartNotificationSettings(
  settings: SmartNotificationSettings,
): Promise<void> {
  await AsyncStorage.setItem(
    SETTINGS_KEY,
    JSON.stringify(settings),
  );
}

async function ensureChannel():
Promise<string> {
  return notifee.createChannel({
    id: CHANNEL_ID,
    name: 'Luna Oracle Daily',
    importance:
      AndroidImportance.HIGH,
  });
}

function nextDateAt(
  hour: number,
  minute: number,
  offsetDays = 0,
): Date {
  const date =
    new Date();

  date.setDate(
    date.getDate() +
      offsetDays,
  );

  date.setHours(
    hour,
    minute,
    0,
    0,
  );

  if (
    offsetDays === 0 &&
    date.getTime() <= Date.now()
  ) {
    date.setDate(
      date.getDate() + 1,
    );
  }

  return date;
}

export async function requestSmartNotificationPermission():
Promise<boolean> {
  const permission =
    await notifee.requestPermission();

  return (
    permission.authorizationStatus >=
    1
  );
}

export async function cancelSmartLunaNotifications():
Promise<void> {
  await notifee.cancelTriggerNotifications([
    'luna_daily_1',
    'luna_daily_2',
    'luna_daily_3',
  ]);
}

export async function scheduleSmartLunaNotifications(
  settings?: SmartNotificationSettings,
): Promise<void> {
  const nextSettings =
    settings ??
    (await getSmartNotificationSettings());

  await saveSmartNotificationSettings(
    nextSettings,
  );

  await cancelSmartLunaNotifications();

  if (!nextSettings.enabled) {
    return;
  }

  const allowed =
    await requestSmartNotificationPermission();

  if (!allowed) {
    return;
  }

  const channelId =
    await ensureChannel();

  const feed =
    await buildMysticHomeFeed();

  const templates = [
    {
      id: 'luna_daily_1',
      title:
        '☾ Your Luna Oracle is ready',
      body:
        `Energy ${feed.dailyInsight.energyScore} · ${feed.dailyCard.card.name}. Draw your daily card now.`,
    },
    {
      id: 'luna_daily_2',
      title:
        '✦ A small aligned step',
      body:
        `Today asks for one clear action. Open your Daily Ritual.`,
    },
    {
      id: 'luna_daily_3',
      title:
        '♡ Love signal',
      body:
        `Love energy ${feed.love.loveScore}. Check your Love Mode when you have a quiet moment.`,
    },
  ];

  for (
    let index = 0;
    index < templates.length;
    index += 1
  ) {
    const item =
      templates[index];

    const date =
      nextDateAt(
        nextSettings.hour,
        nextSettings.minute,
        index,
      );

    const trigger:
      TimestampTrigger = {
        type:
          TriggerType.TIMESTAMP,
        timestamp:
          date.getTime(),
      };

    await notifee.createTriggerNotification(
      {
        id: item.id,
        title: item.title,
        body: item.body,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
        data: {
          route:
            index === 2
              ? 'LoveModeAdvanced'
              : 'DailyRitual',
        },
      },
      trigger,
    );
  }
}

export async function initializeSmartLunaNotifications():
Promise<void> {
  const settings =
    await getSmartNotificationSettings();

  if (settings.enabled) {
    await scheduleSmartLunaNotifications(
      settings,
    );
  }
}
