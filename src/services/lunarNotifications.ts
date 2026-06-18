import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {Solar} from 'lunar-javascript';

import i18n from '../i18n';

const STORAGE_KEY =
  '@pagoda_online_lunar_reminder_settings';

const CHANNEL_ID =
  'lunar-observance-reminders';

const NOTIFICATION_PREFIX =
  'lunar-observance-';

export type LunarReminderSettings = {
  enabled: boolean;
  hour: number;
  minute: number;
  daysAhead: number;
};

export type ScheduleLunarReminderResult = {
  permissionGranted: boolean;
  scheduledCount: number;
};

export const DEFAULT_LUNAR_REMINDER_SETTINGS:
LunarReminderSettings = {
  enabled: false,
  hour: 7,
  minute: 0,

  // Khoảng 12 tháng, thường tạo khoảng 24 thông báo.
  daysAhead: 370,
};

type LunarObservance = {
  solarDate: Date;
  notifyAt: Date;
  lunarDay: 1 | 15;
  lunarMonth: number;
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
  settings: LunarReminderSettings,
): LunarReminderSettings {
  return {
    enabled: Boolean(settings.enabled),
    hour: clampHour(settings.hour),
    minute: clampMinute(settings.minute),
    daysAhead: Math.max(
      30,
      Math.min(
        730,
        Math.floor(settings.daysAhead),
      ),
    ),
  };
}

async function ensureNotificationChannel():
Promise<void> {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name: i18n.t(
      'lunarNotifications.channelName',
      {
        defaultValue:
          'Lunar calendar reminders',
      },
    ),
    description: i18n.t(
      'lunarNotifications.channelDescription',
      {
        defaultValue:
          'Reminders for the first lunar day and full moon day.',
      },
    ),
    importance: AndroidImportance.HIGH,
  });
}

export async function requestLunarNotificationPermission():
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

function buildUpcomingLunarObservances(
  settings: LunarReminderSettings,
): LunarObservance[] {
  const result: LunarObservance[] = [];

  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  const now = Date.now();

  for (
    let offset = 0;
    offset < settings.daysAhead;
    offset += 1
  ) {
    const solarDate = new Date(startDate);

    solarDate.setDate(
      startDate.getDate() + offset,
    );

    const solar = Solar.fromYmd(
      solarDate.getFullYear(),
      solarDate.getMonth() + 1,
      solarDate.getDate(),
    );

    const lunar = solar.getLunar();
    const lunarDay = lunar.getDay();

    if (
      lunarDay !== 1 &&
      lunarDay !== 15
    ) {
      continue;
    }

    const notifyAt = new Date(solarDate);

    notifyAt.setHours(
      settings.hour,
      settings.minute,
      0,
      0,
    );

    // Nếu hôm nay đã qua giờ nhắc thì bỏ qua.
    if (notifyAt.getTime() <= now) {
      continue;
    }

    result.push({
      solarDate,
      notifyAt,
      lunarDay,
      lunarMonth: Math.abs(
        lunar.getMonth(),
      ),
    });
  }

  return result;
}

function makeNotificationId(
  observance: LunarObservance,
): string {
  const year =
    observance.solarDate.getFullYear();

  const month = String(
    observance.solarDate.getMonth() + 1,
  ).padStart(2, '0');

  const day = String(
    observance.solarDate.getDate(),
  ).padStart(2, '0');

  return [
    NOTIFICATION_PREFIX,
    year,
    month,
    day,
    observance.lunarDay,
  ].join('');
}

export async function getLunarReminderSettings():
Promise<LunarReminderSettings> {
  try {
    const stored =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!stored) {
      return {
        ...DEFAULT_LUNAR_REMINDER_SETTINGS,
      };
    }

    const parsed = JSON.parse(
      stored,
    ) as Partial<LunarReminderSettings>;

    return normalizeSettings({
      ...DEFAULT_LUNAR_REMINDER_SETTINGS,
      ...parsed,
    });
  } catch (error) {
    console.warn(
      'Cannot read lunar reminder settings:',
      error,
    );

    return {
      ...DEFAULT_LUNAR_REMINDER_SETTINGS,
    };
  }
}

export async function saveLunarReminderSettings(
  settings: LunarReminderSettings,
): Promise<void> {
  const normalized =
    normalizeSettings(settings);

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(normalized),
  );
}

export async function cancelLunarReminders():
Promise<void> {
  const ids =
    await notifee.getTriggerNotificationIds();

  const lunarIds = ids.filter(id =>
    id.startsWith(
      NOTIFICATION_PREFIX,
    ),
  );

  await Promise.all(
    lunarIds.map(id =>
      notifee.cancelTriggerNotification(
        id,
      ),
    ),
  );
}

export async function scheduleLunarReminders(
  inputSettings: LunarReminderSettings,
): Promise<ScheduleLunarReminderResult> {
  const settings =
    normalizeSettings(inputSettings);

  await saveLunarReminderSettings(
    settings,
  );

  // Xóa lịch cũ trước khi tạo lịch mới,
  // tránh thông báo trùng khi đổi giờ.
  await cancelLunarReminders();

  if (!settings.enabled) {
    return {
      permissionGranted: true,
      scheduledCount: 0,
    };
  }

  const permissionGranted =
    await requestLunarNotificationPermission();

  if (!permissionGranted) {
    return {
      permissionGranted: false,
      scheduledCount: 0,
    };
  }

  await ensureNotificationChannel();

  const observances =
    buildUpcomingLunarObservances(
      settings,
    );

  for (const observance of observances) {
    const isFirstDay =
      observance.lunarDay === 1;

    const title = isFirstDay
      ? i18n.t(
          'lunarNotifications.firstDayTitle',
          {
            defaultValue:
              'Today is the first lunar day',
          },
        )
      : i18n.t(
          'lunarNotifications.fullMoonTitle',
          {
            defaultValue:
              'Today is the full moon day',
          },
        );

    const body = i18n.t(
      'lunarNotifications.reminderBody',
      {
        lunarMonth:
          observance.lunarMonth,
        defaultValue:
          'Take a few quiet minutes to meditate, pray, or listen to a sutra.',
      },
    );

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp:
        observance.notifyAt.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        id: makeNotificationId(
          observance,
        ),
        title,
        body,

        data: {
          screen: 'LunarCalendar',
          lunarDay: String(
            observance.lunarDay,
          ),
          lunarMonth: String(
            observance.lunarMonth,
          ),
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
  }

  return {
    permissionGranted: true,
    scheduledCount:
      observances.length,
  };
}

export async function setLunarReminderEnabled(
  enabled: boolean,
): Promise<ScheduleLunarReminderResult> {
  const current =
    await getLunarReminderSettings();

  return scheduleLunarReminders({
    ...current,
    enabled,
  });
}

export async function updateLunarReminderTime(
  hour: number,
  minute: number,
): Promise<ScheduleLunarReminderResult> {
  const current =
    await getLunarReminderSettings();

  return scheduleLunarReminders({
    ...current,
    hour,
    minute,
  });
}

/**
 * Gọi sau khi i18n khởi tạo xong.
 * Hàm này làm mới danh sách thông báo cho 12 tháng tiếp theo.
 */
export async function refreshLunarReminders():
Promise<ScheduleLunarReminderResult> {
  const settings =
    await getLunarReminderSettings();

  if (!settings.enabled) {
    return {
      permissionGranted: true,
      scheduledCount: 0,
    };
  }

  return scheduleLunarReminders(
    settings,
  );
}
