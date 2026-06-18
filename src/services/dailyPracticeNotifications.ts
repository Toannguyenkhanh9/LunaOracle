import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

import i18n from '../i18n';

const STORAGE_KEY =
  '@pagoda_online_daily_practice_reminder';

const CHANNEL_ID =
  'daily-practice-reminder';

const NOTIFICATION_ID =
  'daily-practice-reminder';

export type DailyPracticeType =
  | 'meditation'
  | 'sutra'
  | 'both';

export type DailyPracticeReminderSettings = {
  enabled: boolean;
  type: DailyPracticeType;
  hour: number;
  minute: number;
};

export type DailyPracticeScheduleResult = {
  permissionGranted: boolean;
  scheduled: boolean;
};

export const DEFAULT_DAILY_PRACTICE_REMINDER_SETTINGS:
DailyPracticeReminderSettings = {
  enabled: false,
  type: 'meditation',
  hour: 20,
  minute: 0,
};

function clampHour(value: number): number {
  return Math.max(
    0,
    Math.min(23, Math.floor(value)),
  );
}

function clampMinute(value: number): number {
  return Math.max(
    0,
    Math.min(59, Math.floor(value)),
  );
}

function normalizeSettings(
  settings: DailyPracticeReminderSettings,
): DailyPracticeReminderSettings {
  const validTypes: DailyPracticeType[] = [
    'meditation',
    'sutra',
    'both',
  ];

  return {
    enabled: Boolean(settings.enabled),

    type: validTypes.includes(settings.type)
      ? settings.type
      : 'meditation',

    hour: clampHour(settings.hour),
    minute: clampMinute(settings.minute),
  };
}

function getNextReminderDate(
  hour: number,
  minute: number,
): Date {
  const now = new Date();

  const reminderDate = new Date();
  reminderDate.setHours(
    hour,
    minute,
    0,
    0,
  );

  if (
    reminderDate.getTime() <=
    now.getTime()
  ) {
    reminderDate.setDate(
      reminderDate.getDate() + 1,
    );
  }

  return reminderDate;
}

function getNotificationContent(
  type: DailyPracticeType,
): {
  title: string;
  body: string;
  screen: string;
} {
  if (type === 'sutra') {
    return {
      title: i18n.t(
        'dailyPracticeNotifications.sutraTitle',
        {
          defaultValue:
            'It is time to chant or listen to a sutra',
        },
      ),

      body: i18n.t(
        'dailyPracticeNotifications.sutraBody',
        {
          defaultValue:
            'Take a few quiet minutes to chant, listen, and settle your mind.',
        },
      ),

      screen: 'SpiritualAudio',
    };
  }

  if (type === 'both') {
    return {
      title: i18n.t(
        'dailyPracticeNotifications.bothTitle',
        {
          defaultValue:
            'It is time for your daily practice',
        },
      ),

      body: i18n.t(
        'dailyPracticeNotifications.bothBody',
        {
          defaultValue:
            'Choose a short meditation or listen to a sutra for a peaceful moment.',
        },
      ),

      screen: 'Home',
    };
  }

  return {
    title: i18n.t(
      'dailyPracticeNotifications.meditationTitle',
      {
        defaultValue:
          'It is time to meditate',
      },
    ),

    body: i18n.t(
      'dailyPracticeNotifications.meditationBody',
      {
        defaultValue:
          'Take a few slow breaths and give yourself a quiet moment.',
      },
    ),

    screen: 'Meditation',
  };
}

async function ensureChannel():
Promise<void> {
  await notifee.createChannel({
    id: CHANNEL_ID,

    name: i18n.t(
      'dailyPracticeNotifications.channelName',
      {
        defaultValue:
          'Daily practice reminders',
      },
    ),

    description: i18n.t(
      'dailyPracticeNotifications.channelDescription',
      {
        defaultValue:
          'Daily reminders for meditation and sutra practice.',
      },
    ),

    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function requestDailyPracticePermission():
Promise<boolean> {
  const settings =
    await notifee.requestPermission();

  return (
    settings.authorizationStatus ===
      AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus ===
      AuthorizationStatus.PROVISIONAL
  );
}

export async function getDailyPracticeReminderSettings():
Promise<DailyPracticeReminderSettings> {
  try {
    const stored =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!stored) {
      return {
        ...DEFAULT_DAILY_PRACTICE_REMINDER_SETTINGS,
      };
    }

    const parsed = JSON.parse(
      stored,
    ) as Partial<DailyPracticeReminderSettings>;

    return normalizeSettings({
      ...DEFAULT_DAILY_PRACTICE_REMINDER_SETTINGS,
      ...parsed,
    });
  } catch (error) {
    console.warn(
      'Cannot read daily practice reminder settings:',
      error,
    );

    return {
      ...DEFAULT_DAILY_PRACTICE_REMINDER_SETTINGS,
    };
  }
}

export async function saveDailyPracticeReminderSettings(
  settings: DailyPracticeReminderSettings,
): Promise<void> {
  const normalized =
    normalizeSettings(settings);

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalized),
  );
}

export async function cancelDailyPracticeReminder():
Promise<void> {
  await notifee.cancelTriggerNotification(
    NOTIFICATION_ID,
  );
}

export async function scheduleDailyPracticeReminder(
  inputSettings: DailyPracticeReminderSettings,
): Promise<DailyPracticeScheduleResult> {
  const settings =
    normalizeSettings(inputSettings);

  await saveDailyPracticeReminderSettings(
    settings,
  );

  // Xóa lịch cũ trước để không bị trùng
  // khi người dùng đổi giờ hoặc loại nhắc.
  await cancelDailyPracticeReminder();

  if (!settings.enabled) {
    return {
      permissionGranted: true,
      scheduled: false,
    };
  }

  const permissionGranted =
    await requestDailyPracticePermission();

  if (!permissionGranted) {
    return {
      permissionGranted: false,
      scheduled: false,
    };
  }

  await ensureChannel();

  const content =
    getNotificationContent(
      settings.type,
    );

  const nextReminder =
    getNextReminderDate(
      settings.hour,
      settings.minute,
    );

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,

    timestamp:
      nextReminder.getTime(),

    repeatFrequency:
      RepeatFrequency.DAILY,
  };

  await notifee.createTriggerNotification(
    {
      id: NOTIFICATION_ID,

      title: content.title,
      body: content.body,

      data: {
        screen: content.screen,
        practiceType: settings.type,
      },

      android: {
        channelId: CHANNEL_ID,

        pressAction: {
          id: 'default',
        },
      },

      ios: {
        sound: 'default',
      },
    },

    trigger,
  );

  return {
    permissionGranted: true,
    scheduled: true,
  };
}

export async function setDailyPracticeReminderEnabled(
  enabled: boolean,
): Promise<DailyPracticeScheduleResult> {
  const current =
    await getDailyPracticeReminderSettings();

  return scheduleDailyPracticeReminder({
    ...current,
    enabled,
  });
}

export async function updateDailyPracticeReminderType(
  type: DailyPracticeType,
): Promise<DailyPracticeScheduleResult> {
  const current =
    await getDailyPracticeReminderSettings();

  return scheduleDailyPracticeReminder({
    ...current,
    type,
  });
}

export async function updateDailyPracticeReminderTime(
  hour: number,
  minute: number,
): Promise<DailyPracticeScheduleResult> {
  const current =
    await getDailyPracticeReminderSettings();

  return scheduleDailyPracticeReminder({
    ...current,
    hour,
    minute,
  });
}

/**
 * Gọi sau khi i18n đã khởi tạo.
 * Hàm này tạo lại notification để nội dung
 * theo đúng ngôn ngữ hiện tại.
 */
export async function refreshDailyPracticeReminder():
Promise<DailyPracticeScheduleResult> {
  const settings =
    await getDailyPracticeReminderSettings();

  if (!settings.enabled) {
    return {
      permissionGranted: true,
      scheduled: false,
    };
  }

  return scheduleDailyPracticeReminder(
    settings,
  );
}
