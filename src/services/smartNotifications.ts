import AsyncStorage
  from '@react-native-async-storage/async-storage';

import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  TriggerType,
  type TimestampTrigger,
} from '@notifee/react-native';

import {
  buildDailyBrief,
} from './dailyBrief';

import {
  getUserProfiles,
  type UserProfile,
} from './userProfiles';

export type SmartNotificationPreferences = {
  dailyEnabled: boolean;
  dailyHour: number;
  dailyMinute: number;
  dailyProfileId?: string;

  monthlyEnabled: boolean;
  monthlyDay: number;
  monthlyHour: number;
  monthlyMinute: number;
};

type NotificationEnvelope = {
  schemaVersion: 1;
  preferences:
    SmartNotificationPreferences;
};

const STORAGE_KEY =
  '@eastern_destiny/smart_notifications_v1';

const LAST_REFRESH_KEY =
  '@eastern_destiny/smart_notifications_last_refresh_v1';

const CHANNEL_ID =
  'eastern-destiny-daily';

const DAILY_PREFIX =
  'ed-daily-';

const MONTHLY_PREFIX =
  'ed-monthly-';

export const DEFAULT_SMART_NOTIFICATION_PREFERENCES:
  SmartNotificationPreferences = {
    dailyEnabled: false,
    dailyHour: 8,
    dailyMinute: 0,
    monthlyEnabled: false,
    monthlyDay: 1,
    monthlyHour: 9,
    monthlyMinute: 0,
  };

type NotificationCopy = {
  dailyTitle: string;
  dailyFallback: string;
  monthlyTitle: string;
  monthlyBody: string;
  profilePrefix: string;
  headlines: Record<
    string,
    string
  >;
};

const COPY: Record<
  string,
  NotificationCopy
> = {
  vi: {
    dailyTitle:
      'Eastern Destiny · Hôm nay',
    dailyFallback:
      'Mở bản tóm tắt hôm nay để xem ngày âm, Can Chi và gợi ý cá nhân.',
    monthlyTitle:
      'Tổng kết tháng đã sẵn sàng',
    monthlyBody:
      'Xem lại sự kiện, ghi chú, dấu trang và nội dung bạn đã khám phá trong tháng.',
    profilePrefix:
      'Hồ sơ',
    headlines: {
      slowDown:
        'Hôm nay nên chậm lại và kiểm tra kỹ trước quyết định quan trọng.',
      connection:
        'Hôm nay có nhịp thuận cho kết nối, trao đổi và hoàn tất việc đang làm.',
      steadyMomentum:
        'Hôm nay phù hợp để duy trì tiến độ và hoàn thành một ưu tiên rõ ràng.',
      carefulReview:
        'Hôm nay nên rà soát thông tin và tránh nhận quá nhiều việc cùng lúc.',
      balancedDay:
        'Hôm nay có nhịp khá cân bằng; hãy chọn một việc quan trọng để tập trung.',
    },
  },

  en: {
    dailyTitle:
      'Eastern Destiny · Today',
    dailyFallback:
      'Open today’s brief for the lunar date, sexagenary pattern, and personal guidance.',
    monthlyTitle:
      'Your monthly review is ready',
    monthlyBody:
      'Review events, notes, bookmarks, and the content you explored this month.',
    profilePrefix:
      'Profile',
    headlines: {
      slowDown:
        'Slow down today and review details before major decisions.',
      connection:
        'Today supports communication, connection, and completing ongoing work.',
      steadyMomentum:
        'Today favors steady momentum and one clearly defined priority.',
      carefulReview:
        'Review information carefully and avoid taking on too much at once.',
      balancedDay:
        'Today is relatively balanced; choose one meaningful priority.',
    },
  },

  zh: {
    dailyTitle:
      'Eastern Destiny · 今日',
    dailyFallback:
      '打开今日简报，查看农历、干支与个人参考。',
    monthlyTitle:
      '月度回顾已准备好',
    monthlyBody:
      '回顾本月的事件、笔记、收藏与探索内容。',
    profilePrefix:
      '档案',
    headlines: {
      slowDown:
        '今天宜放慢脚步，重大决定前先核对细节。',
      connection:
        '今天较适合沟通、连接与完成正在进行的事务。',
      steadyMomentum:
        '今天适合保持稳定进度，并专注一个明确重点。',
      carefulReview:
        '今天宜仔细复核信息，避免同时承担过多事务。',
      balancedDay:
        '今天整体较平衡，请选择一个真正重要的重点。',
    },
  },

  ko: {
    dailyTitle:
      'Eastern Destiny · 오늘',
    dailyFallback:
      '오늘의 음력, 간지와 개인 안내를 확인하세요.',
    monthlyTitle:
      '월간 리뷰가 준비되었습니다',
    monthlyBody:
      '이번 달의 이벤트, 메모, 북마크와 탐색 내용을 돌아보세요.',
    profilePrefix:
      '프로필',
    headlines: {
      slowDown:
        '오늘은 속도를 늦추고 큰 결정 전 세부 사항을 확인하세요.',
      connection:
        '오늘은 소통, 연결과 진행 중인 일의 마무리에 도움이 됩니다.',
      steadyMomentum:
        '오늘은 꾸준한 진행과 하나의 분명한 우선순위에 적합합니다.',
      carefulReview:
        '정보를 꼼꼼히 확인하고 한꺼번에 너무 많은 일을 맡지 마세요.',
      balancedDay:
        '오늘은 비교적 균형적이므로 의미 있는 한 가지에 집중하세요.',
    },
  },

  ja: {
    dailyTitle:
      'Eastern Destiny · 今日',
    dailyFallback:
      '今日の旧暦、干支、個人向けの参考を確認しましょう。',
    monthlyTitle:
      '月間レビューの準備ができました',
    monthlyBody:
      '今月の出来事、メモ、ブックマーク、閲覧内容を振り返りましょう。',
    profilePrefix:
      'プロフィール',
    headlines: {
      slowDown:
        '今日は少し速度を落とし、大きな判断の前に詳細を確認しましょう。',
      connection:
        '今日は対話、つながり、継続中の作業の完了に向いています。',
      steadyMomentum:
        '今日は着実な進行と一つの明確な優先事項に向いています。',
      carefulReview:
        '情報を丁寧に確認し、一度に多くを引き受けないようにしましょう。',
      balancedDay:
        '今日は比較的バランスが良いので、大切な一つに集中しましょう。',
    },
  },
};

function normalizeLanguage(
  language?: string,
): string {
  const value =
    (
      language ??
      'en'
    ).toLowerCase();

  if (
    value.startsWith('vi')
  ) {
    return 'vi';
  }

  if (
    value.startsWith('zh')
  ) {
    return 'zh';
  }

  if (
    value.startsWith('ko')
  ) {
    return 'ko';
  }

  if (
    value.startsWith('ja')
  ) {
    return 'ja';
  }

  return 'en';
}

function clampInteger(
  value: unknown,
  min: number,
  max: number,
  fallback: number,
): number {
  const numeric =
    Number(value);

  if (
    !Number.isFinite(numeric)
  ) {
    return fallback;
  }

  return Math.min(
    max,
    Math.max(
      min,
      Math.round(numeric),
    ),
  );
}

function normalizePreferences(
  value: unknown,
): SmartNotificationPreferences {
  if (
    !value ||
    typeof value !== 'object'
  ) {
    return {
      ...DEFAULT_SMART_NOTIFICATION_PREFERENCES,
    };
  }

  const candidate =
    value as Partial<
      SmartNotificationPreferences
    >;

  return {
    dailyEnabled:
      Boolean(
        candidate.dailyEnabled,
      ),
    dailyHour:
      clampInteger(
        candidate.dailyHour,
        0,
        23,
        8,
      ),
    dailyMinute:
      clampInteger(
        candidate.dailyMinute,
        0,
        59,
        0,
      ),
    dailyProfileId:
      typeof candidate.dailyProfileId ===
      'string'
        ? candidate.dailyProfileId
        : undefined,

    monthlyEnabled:
      Boolean(
        candidate.monthlyEnabled,
      ),
    monthlyDay:
      clampInteger(
        candidate.monthlyDay,
        1,
        28,
        1,
      ),
    monthlyHour:
      clampInteger(
        candidate.monthlyHour,
        0,
        23,
        9,
      ),
    monthlyMinute:
      clampInteger(
        candidate.monthlyMinute,
        0,
        59,
        0,
      ),
  };
}

export async function getSmartNotificationPreferences(): Promise<
  SmartNotificationPreferences
> {
  try {
    const raw =
      await AsyncStorage.getItem(
        STORAGE_KEY,
      );

    if (!raw) {
      return {
        ...DEFAULT_SMART_NOTIFICATION_PREFERENCES,
      };
    }

    const parsed =
      JSON.parse(raw) as Partial<
        NotificationEnvelope
      >;

    return normalizePreferences(
      parsed.preferences,
    );
  } catch (error) {
    console.warn(
      'Unable to read smart notification preferences:',
      error,
    );

    return {
      ...DEFAULT_SMART_NOTIFICATION_PREFERENCES,
    };
  }
}

export async function saveSmartNotificationPreferences(
  preferences:
    SmartNotificationPreferences,
): Promise<void> {
  const normalized =
    normalizePreferences(
      preferences,
    );

  await AsyncStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      schemaVersion: 1,
      preferences:
        normalized,
    }),
  );
}

async function ensureChannel(): Promise<void> {
  await notifee.createChannel({
    id: CHANNEL_ID,
    name:
      'Eastern Destiny',
    importance:
      AndroidImportance.DEFAULT,
  });
}

export async function requestSmartNotificationPermission(): Promise<
  boolean
> {
  const settings =
    await notifee.requestPermission();

  return (
    settings.authorizationStatus ===
      AuthorizationStatus.AUTHORIZED ||
    settings.authorizationStatus ===
      AuthorizationStatus.PROVISIONAL
  );
}

async function cancelByPrefix(
  prefix: string,
): Promise<void> {
  const ids =
    await notifee.getTriggerNotificationIds();

  await Promise.all(
    ids
      .filter(id =>
        id.startsWith(
          prefix,
        ),
      )
      .map(id =>
        notifee.cancelTriggerNotification(
          id,
        ),
      ),
  );
}

function resolveProfile(
  profiles: UserProfile[],
  profileId?: string,
): UserProfile | null {
  if (profileId) {
    const exact =
      profiles.find(
        item =>
          item.id ===
          profileId,
      );

    if (exact) {
      return exact;
    }
  }

  return (
    profiles.find(
      item =>
        item.isFavorite,
    ) ??
    profiles[0] ??
    null
  );
}

function nextDailyDates(
  count: number,
  hour: number,
  minute: number,
): Date[] {
  const result: Date[] = [];
  const now = new Date();

  for (
    let offset = 0;
    result.length < count &&
    offset < count + 3;
    offset += 1
  ) {
    const date =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() +
          offset,
        hour,
        minute,
        0,
        0,
      );

    if (
      date.getTime() >
      now.getTime() +
        15_000
    ) {
      result.push(date);
    }
  }

  return result;
}

function nextMonthlyDates(
  count: number,
  day: number,
  hour: number,
  minute: number,
): Date[] {
  const result: Date[] = [];
  const now = new Date();

  for (
    let offset = 0;
    result.length < count &&
    offset < count + 3;
    offset += 1
  ) {
    const date =
      new Date(
        now.getFullYear(),
        now.getMonth() +
          offset,
        day,
        hour,
        minute,
        0,
        0,
      );

    if (
      date.getTime() >
      now.getTime() +
        15_000
    ) {
      result.push(date);
    }
  }

  return result;
}

export async function scheduleSmartNotifications(
  preferences:
    SmartNotificationPreferences,
  language?: string,
): Promise<{
  dailyScheduled: number;
  monthlyScheduled: number;
}> {
  const normalized =
    normalizePreferences(
      preferences,
    );

  await saveSmartNotificationPreferences(
    normalized,
  );

  await ensureChannel();

  await Promise.all([
    cancelByPrefix(
      DAILY_PREFIX,
    ),
    cancelByPrefix(
      MONTHLY_PREFIX,
    ),
  ]);

  const profiles =
    await getUserProfiles();

  const profile =
    resolveProfile(
      profiles,
      normalized.dailyProfileId,
    );

  const copy =
    COPY[
      normalizeLanguage(
        language,
      )
    ];

  let dailyScheduled = 0;
  let monthlyScheduled = 0;

  if (
    normalized.dailyEnabled
  ) {
    const dates =
      nextDailyDates(
        30,
        normalized.dailyHour,
        normalized.dailyMinute,
      );

    for (
      let index = 0;
      index < dates.length;
      index += 1
    ) {
      const date =
        dates[index];

      const brief =
        buildDailyBrief(
          profile,
          date,
        );

      const profileLine =
        profile
          ? `${copy.profilePrefix}: ${profile.displayName}\n`
          : '';

      const trigger:
        TimestampTrigger = {
          type:
            TriggerType.TIMESTAMP,
          timestamp:
            date.getTime(),
        };

      await notifee.createTriggerNotification(
        {
          id:
            `${DAILY_PREFIX}${brief.dateKey}`,
          title:
            copy.dailyTitle,
          body:
            `${profileLine}${
              copy.headlines[
                brief.headlineCode
              ] ??
              copy.dailyFallback
            }`,
          android: {
            channelId:
              CHANNEL_ID,
            pressAction: {
              id: 'default',
              launchActivity:
                'default',
            },
            smallIcon:
              'ic_notification',
          },
          ios: {
            sound: 'default',
          },
          data: {
            route:
              'DailyBrief',
            profileId:
              profile?.id ??
              '',
            dateKey:
              brief.dateKey,
          },
        },
        trigger,
      );

      dailyScheduled += 1;
    }
  }

  if (
    normalized.monthlyEnabled
  ) {
    const dates =
      nextMonthlyDates(
        12,
        normalized.monthlyDay,
        normalized.monthlyHour,
        normalized.monthlyMinute,
      );

    for (
      let index = 0;
      index < dates.length;
      index += 1
    ) {
      const date =
        dates[index];

      const monthKey =
        [
          date.getFullYear(),
          String(
            date.getMonth() +
              1,
          ).padStart(
            2,
            '0',
          ),
        ].join('-');

      const trigger:
        TimestampTrigger = {
          type:
            TriggerType.TIMESTAMP,
          timestamp:
            date.getTime(),
        };

      await notifee.createTriggerNotification(
        {
          id:
            `${MONTHLY_PREFIX}${monthKey}`,
          title:
            copy.monthlyTitle,
          body:
            copy.monthlyBody,
          android: {
            channelId:
              CHANNEL_ID,
            pressAction: {
              id: 'default',
              launchActivity:
                'default',
            },
            smallIcon:
              'ic_notification',
          },
          ios: {
            sound: 'default',
          },
          data: {
            route:
              'MonthlyReview',
            year:
              String(
                date.getFullYear(),
              ),
            month:
              String(
                date.getMonth() + 1,
              ),
          },
        },
        trigger,
      );

      monthlyScheduled += 1;
    }
  }

  const refreshedAt =
    new Date();

  const refreshKey = [
    refreshedAt.getFullYear(),
    String(
      refreshedAt.getMonth() + 1,
    ).padStart(
      2,
      '0',
    ),
    String(
      refreshedAt.getDate(),
    ).padStart(
      2,
      '0',
    ),
  ].join('-');

  await AsyncStorage.setItem(
    LAST_REFRESH_KEY,
    refreshKey,
  );

  return {
    dailyScheduled,
    monthlyScheduled,
  };
}

export async function refreshSmartNotifications(
  language?: string,
): Promise<{
  dailyScheduled: number;
  monthlyScheduled: number;
}> {
  const preferences =
    await getSmartNotificationPreferences();

  return scheduleSmartNotifications(
    preferences,
    language,
  );
}

export async function refreshSmartNotificationsIfNeeded(
  language?: string,
): Promise<boolean> {
  const preferences =
    await getSmartNotificationPreferences();

  if (
    !preferences.dailyEnabled &&
    !preferences.monthlyEnabled
  ) {
    return false;
  }

  const now = new Date();

  const todayKey = [
    now.getFullYear(),
    String(
      now.getMonth() + 1,
    ).padStart(
      2,
      '0',
    ),
    String(
      now.getDate(),
    ).padStart(
      2,
      '0',
    ),
  ].join('-');

  const lastRefresh =
    await AsyncStorage.getItem(
      LAST_REFRESH_KEY,
    );

  if (
    lastRefresh ===
    todayKey
  ) {
    return false;
  }

  await scheduleSmartNotifications(
    preferences,
    language,
  );

  await AsyncStorage.setItem(
    LAST_REFRESH_KEY,
    todayKey,
  );

  return true;
}

export async function cancelAllSmartNotifications(): Promise<void> {
  await Promise.all([
    cancelByPrefix(
      DAILY_PREFIX,
    ),
    cancelByPrefix(
      MONTHLY_PREFIX,
    ),
  ]);
}
